/**
 * Pure, deterministic arcade physics engines for:
 * 1. Game2D: Variable-jump-height & momentum platformer physics (with coyote time, jump buffer, & apex float).
 * 2. LaborKart: Drift-based arcade kart handling (steering inertia, hop-into-drift slip angle, counter-steering, and 3-tier Mini-Turbo boost).
 * 3. Game3D: Smooth 3D spatial acceleration, exponential ground/air friction, and variable jump height cut.
 */

export interface Platformer2DState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  grounded: boolean;
  direction: 1 | -1;
  coyoteTimer: number;
  jumpBufferTimer: number;
  jumpCutApplied: boolean;
}

export interface Platformer2DInput {
  left: boolean;
  right: boolean;
  jumpHeld: boolean;
  jumpJustPressed: boolean;
}

export interface Platformer2DConfig {
  maxSpeed: number;
  groundAccel: number;
  airAccel: number;
  groundFriction: number;
  airDrag: number;
  jumpForce: number;
  gravity: number;
  holdGravityScale: number;
  earlyReleaseCutFactor: number;
  maxFallSpeed: number;
  coyoteFrames: number;
  jumpBufferFrames: number;
}

export const DEFAULT_PLATFORMER_2D_CONFIG: Platformer2DConfig = {
  maxSpeed: 5.1,
  groundAccel: 0.72,
  airAccel: 0.48,
  groundFriction: 0.76,
  airDrag: 0.91,
  jumpForce: -12.6,
  gravity: 0.62,
  holdGravityScale: 0.68, // Sustaining jump button gives higher arc
  earlyReleaseCutFactor: 0.44, // Releasing jump early cuts upward velocity for short hop
  maxFallSpeed: 12.5,
  coyoteFrames: 8,
  jumpBufferFrames: 7,
};

export interface Platformer2DStepResult {
  state: Platformer2DState;
  didTriggerJump: boolean;
}

export function stepPlatformer2DPhysics(
  prev: Platformer2DState,
  input: Platformer2DInput,
  stepScale = 1,
  config: Platformer2DConfig = DEFAULT_PLATFORMER_2D_CONFIG
): Platformer2DStepResult {
  const s = Math.max(0.5, Math.min(1.75, stepScale));
  let {
    x,
    y,
    vx,
    vy,
    grounded,
    direction,
    coyoteTimer,
    jumpBufferTimer,
    jumpCutApplied,
  } = prev;

  const accel = (grounded ? config.groundAccel : config.airAccel) * s;

  if (input.left && !input.right) {
    vx = Math.max(-config.maxSpeed, vx - accel);
    direction = -1;
  } else if (input.right && !input.left) {
    vx = Math.min(config.maxSpeed, vx + accel);
    direction = 1;
  } else {
    const damp = Math.pow(grounded ? config.groundFriction : config.airDrag, s);
    vx *= damp;
    if (Math.abs(vx) < 0.08) vx = 0;
  }

  // Coyote window
  if (grounded) {
    coyoteTimer = config.coyoteFrames;
    jumpCutApplied = false;
  } else if (coyoteTimer > 0) {
    coyoteTimer = Math.max(0, coyoteTimer - s);
  }

  // Edge-triggered jump buffer so holding Space doesn't endlessly re-queue
  if (input.jumpJustPressed) {
    jumpBufferTimer = config.jumpBufferFrames;
  } else if (jumpBufferTimer > 0) {
    jumpBufferTimer = Math.max(0, jumpBufferTimer - s);
  }

  let didTriggerJump = false;
  if (jumpBufferTimer > 0 && (grounded || coyoteTimer > 0)) {
    vy = config.jumpForce;
    grounded = false;
    coyoteTimer = 0;
    jumpBufferTimer = 0;
    jumpCutApplied = false;
    didTriggerJump = true;
  }

  // Variable Jump Height:
  // 1) Releasing jump early while moving upward cuts upward velocity once for crisp short hops
  if (!input.jumpHeld && vy < -2.2 && !jumpCutApplied) {
    vy *= config.earlyReleaseCutFactor;
    jumpCutApplied = true;
  }

  // 2) Holding jump while ascending reduces effective gravity for full Mario high-jump feel
  const gravityMultiplier =
    input.jumpHeld && vy < -1.2 && !jumpCutApplied ? config.holdGravityScale : 1.0;

  vy = Math.min(config.maxFallSpeed, vy + config.gravity * gravityMultiplier * s);
  x += vx * s;
  y += vy * s;

  return {
    state: {
      ...prev,
      x,
      y,
      vx,
      vy,
      grounded,
      direction,
      coyoteTimer,
      jumpBufferTimer,
      jumpCutApplied,
    },
    didTriggerJump,
  };
}

// ==================== LABOR KART DRIFT-BASED ARCADE PHYSICS ====================

export type DriftSparkTier = 'none' | 'blue' | 'orange' | 'purple';

export interface KartArcadeState {
  playerDist: number;
  playerX: number; // -1.15 .. +1.15 normalized road position
  playerSpeed: number;
  steerVelocity: number; // smooth angular lateral velocity
  isDrifting: boolean;
  driftDirection: -1 | 0 | 1; // -1 left drift, +1 right drift
  driftCharge: number; // frames accumulated in current drift
  driftSparkTier: DriftSparkTier;
  hopProgress: number; // 0..1 hop animation into drift
  visualSlipAngle: number; // -1..+1 chassis yaw angle for arcade rendering
  boostRemaining: number;
  spinoutRemaining: number;
}

export interface KartArcadeInput {
  left: boolean;
  right: boolean;
  accel: boolean;
  brake: boolean;
  driftHeld: boolean;
}

export interface KartArcadeStepResult {
  state: KartArcadeState;
  releasedBoostTier: DriftSparkTier;
  upgradedSparkTier: DriftSparkTier | null;
  didHopStart: boolean;
}

export function getDriftSparkTierForCharge(chargeFrames: number): DriftSparkTier {
  if (chargeFrames >= 125) return 'purple';
  if (chargeFrames >= 72) return 'orange';
  if (chargeFrames >= 30) return 'blue';
  return 'none';
}

export function stepKartArcadePhysics(
  prev: KartArcadeState,
  input: KartArcadeInput,
  engineClass: '50cc' | '100cc' | '150cc' = '100cc',
  roadCurvePull = 0, // centrifugal pull from road curvature
  stepScale = 1
): KartArcadeStepResult {
  const s = Math.max(0.5, Math.min(1.75, stepScale));
  const maxNormalSpeed = engineClass === '50cc' ? 18.5 : engineClass === '100cc' ? 21.5 : 24.5;
  const maxBoostSpeed = engineClass === '50cc' ? 26.5 : engineClass === '100cc' ? 29.8 : 33.0;
  const accelRate = (engineClass === '50cc' ? 0.34 : engineClass === '100cc' ? 0.40 : 0.46) * s;
  const coastDrag = 0.14 * s;
  const brakeRate = 0.55 * s;

  let {
    playerDist,
    playerX,
    playerSpeed,
    steerVelocity,
    isDrifting,
    driftDirection,
    driftCharge,
    driftSparkTier,
    hopProgress,
    visualSlipAngle,
    boostRemaining,
    spinoutRemaining,
  } = prev;

  let releasedBoostTier: DriftSparkTier = 'none';
  let upgradedSparkTier: DriftSparkTier | null = null;
  let didHopStart = false;

  const steerAxis = (input.right ? 1 : 0) - (input.left ? 1 : 0);

  // 1. Forward Velocity Curve
  if (spinoutRemaining > 0) {
    spinoutRemaining = Math.max(0, spinoutRemaining - s);
    playerSpeed = Math.max(0, playerSpeed - 0.52 * s);
    isDrifting = false;
    driftDirection = 0;
    driftCharge = 0;
    driftSparkTier = 'none';
  } else if (boostRemaining > 0) {
    boostRemaining = Math.max(0, boostRemaining - s);
    playerSpeed = Math.min(maxBoostSpeed, playerSpeed + 0.95 * s);
  } else if (input.accel) {
    // Smooth asymptotic acceleration curve so kart feels weighted, not twitchy
    const speedRatio = playerSpeed / maxNormalSpeed;
    const curveGain = Math.max(0.32, 1.12 - speedRatio * 0.65);
    if (playerSpeed > maxNormalSpeed) {
      playerSpeed = Math.max(maxNormalSpeed, playerSpeed - 0.22 * s);
    } else {
      playerSpeed = Math.min(maxNormalSpeed, playerSpeed + accelRate * curveGain);
    }
  } else if (input.brake) {
    playerSpeed = Math.max(0, playerSpeed - brakeRate);
  } else {
    playerSpeed = Math.max(0, playerSpeed - coastDrag);
  }

  // 2. Hop & Drift State Machine
  const canSustainDrift = playerSpeed > 7.5 && spinoutRemaining <= 0;

  if (input.driftHeld && canSustainDrift) {
    if (!isDrifting && steerAxis !== 0) {
      isDrifting = true;
      driftDirection = steerAxis as -1 | 1;
      driftCharge = 0;
      driftSparkTier = 'none';
      hopProgress = 1.0;
      didHopStart = true;
    } else if (isDrifting && driftDirection !== 0) {
      // Holding into the drift corner charges sparks faster than counter-steering
      const intoCorner = steerAxis === driftDirection ? 1.55 : steerAxis === -driftDirection ? 0.65 : 1.0;
      driftCharge += intoCorner * s;
      const nextTier = getDriftSparkTierForCharge(driftCharge);
      if (nextTier !== driftSparkTier) {
        driftSparkTier = nextTier;
        if (nextTier !== 'none') {
          upgradedSparkTier = nextTier;
        }
      }
    }
  } else if (isDrifting) {
    // Drift released -> convert spark charge into Mini-Turbo boost!
    if (driftSparkTier === 'purple') {
      boostRemaining = Math.max(boostRemaining, 130);
      releasedBoostTier = 'purple';
    } else if (driftSparkTier === 'orange') {
      boostRemaining = Math.max(boostRemaining, 85);
      releasedBoostTier = 'orange';
    } else if (driftSparkTier === 'blue') {
      boostRemaining = Math.max(boostRemaining, 48);
      releasedBoostTier = 'blue';
    }
    isDrifting = false;
    driftDirection = 0;
    driftCharge = 0;
    driftSparkTier = 'none';
  }

  if (hopProgress > 0) {
    hopProgress = Math.max(0, hopProgress - 0.12 * s);
  }

  // 3. Arcade Steering Inertia vs Drift Slip Vector
  const speedAuthority = Math.min(1.08, Math.max(0.18, playerSpeed / maxNormalSpeed));
  let targetSteerVel = 0;

  if (isDrifting && driftDirection !== 0) {
    // Base inward carve + player counter-steer / tighten control
    const baseCarve = driftDirection * 0.024;
    const fineAdjust = steerAxis * 0.014;
    targetSteerVel = (baseCarve + fineAdjust) * speedAuthority;
  } else {
    targetSteerVel = steerAxis * 0.029 * speedAuthority;
  }

  // Smooth lateral inertia (eliminates rigid snap steering)
  const steerBlend = isDrifting ? 0.14 * s : 0.22 * s;
  steerVelocity += (targetSteerVel - steerVelocity) * Math.min(1, steerBlend);
  if (!isDrifting && steerAxis === 0 && Math.abs(steerVelocity) < 0.0005) {
    steerVelocity = 0;
  }

  playerX = Math.max(-1.12, Math.min(1.12, playerX + steerVelocity * s - roadCurvePull * speedAuthority * s));

  // Off-road turf drag (unless boosted!)
  if (Math.abs(playerX) > 0.86 && boostRemaining <= 0) {
    playerSpeed = Math.max(7.5, playerSpeed - 0.65 * s);
    // Off-road without boost cancels active drift charge if too slow
    if (playerSpeed <= 8.2 && isDrifting) {
      isDrifting = false;
      driftDirection = 0;
      driftCharge = 0;
      driftSparkTier = 'none';
    }
  }

  // Visual chassis slip angle for tactile drift feedback
  const targetSlip = isDrifting
    ? driftDirection * 0.72 + steerAxis * 0.22
    : steerAxis * 0.28;
  visualSlipAngle += (targetSlip - visualSlipAngle) * Math.min(1, 0.2 * s);

  playerDist += playerSpeed * s;

  return {
    state: {
      playerDist,
      playerX,
      playerSpeed,
      steerVelocity,
      isDrifting,
      driftDirection,
      driftCharge,
      driftSparkTier,
      hopProgress,
      visualSlipAngle,
      boostRemaining,
      spinoutRemaining,
    },
    releasedBoostTier,
    upgradedSparkTier,
    didHopStart,
  };
}

// ==================== 3D ISLAND MOMENTUM & VARIABLE JUMP HELPER ====================

export interface Island3DMomentumResult {
  vx: number;
  vz: number;
  vy: number;
  rotY: number;
  jumpCutApplied: boolean;
}

export function stepIsland3DMomentum(params: {
  vx: number;
  vz: number;
  vy: number;
  rotY: number;
  moveX: number;
  moveZ: number;
  maxSpeed: number;
  grounded: boolean;
  jumpHeld: boolean;
  jumpCutApplied: boolean;
  stepScale: number;
}): Island3DMomentumResult {
  const {
    moveX,
    moveZ,
    maxSpeed,
    grounded,
    jumpHeld,
    stepScale,
  } = params;
  let { vx, vz, vy, rotY, jumpCutApplied } = params;
  const s = Math.max(0.5, Math.min(1.75, stepScale));

  if (moveX !== 0 || moveZ !== 0) {
    const targetAngle = Math.atan2(moveX, moveZ);
    // Smooth shortest-arc turn interpolation
    let angleDiff = targetAngle - rotY;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    rotY += angleDiff * Math.min(1, 0.28 * s);

    const targetVx = Math.sin(targetAngle) * maxSpeed * s;
    const targetVz = Math.cos(targetAngle) * maxSpeed * s;
    const accelLerp = Math.min(1, (grounded ? 0.26 : 0.16) * s);
    vx += (targetVx - vx) * accelLerp;
    vz += (targetVz - vz) * accelLerp;
  } else {
    const friction = Math.pow(grounded ? 0.72 : 0.88, s);
    vx *= friction;
    vz *= friction;
    if (Math.hypot(vx, vz) < 0.004) {
      vx = 0;
      vz = 0;
    }
  }

  if (grounded) {
    jumpCutApplied = false;
  } else if (!jumpHeld && vy > 0.14 && !jumpCutApplied) {
    vy *= 0.48;
    jumpCutApplied = true;
  }

  return { vx, vz, vy, rotY, jumpCutApplied };
}
