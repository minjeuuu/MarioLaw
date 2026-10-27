export interface AABB3D {
  id: string;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
  kind?: 'ground' | 'pipe' | 'block' | 'question_block' | 'castle' | 'fence' | 'platform';
  isQuestionBlock?: boolean;
  hit?: boolean;
}

export interface PlayerPhysicsState3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  halfWidth: number;
  height: number;
  halfDepth: number;
  grounded: boolean;
}

export interface WorldBounds3D {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
}

export interface StepCollisionResult3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  grounded: boolean;
  collidedHorizontally: boolean;
  landedColliderId: string | null;
  bumpedColliderIds: string[];
}

export function createPlayerAABB(
  x: number,
  y: number,
  z: number,
  halfWidth: number,
  height: number,
  halfDepth: number
): AABB3D {
  return {
    id: 'player',
    minX: x - halfWidth,
    maxX: x + halfWidth,
    minY: y,
    maxY: y + height,
    minZ: z - halfDepth,
    maxZ: z + halfDepth,
  };
}

export function boxesIntersect3D(a: AABB3D, b: AABB3D): boolean {
  return (
    a.minX < b.maxX &&
    a.maxX > b.minX &&
    a.minY < b.maxY &&
    a.maxY > b.minY &&
    a.minZ < b.maxZ &&
    a.maxZ > b.minZ
  );
}

export function createBoxCollider(
  id: string,
  centerX: number,
  centerZ: number,
  minY: number,
  maxY: number,
  halfWidth: number,
  halfDepth: number,
  kind: AABB3D['kind'] = 'block',
  isQuestionBlock = false
): AABB3D {
  return {
    id,
    minX: centerX - halfWidth,
    maxX: centerX + halfWidth,
    minY,
    maxY,
    minZ: centerZ - halfDepth,
    maxZ: centerZ + halfDepth,
    kind,
    isQuestionBlock,
    hit: false,
  };
}

/**
 * Resolves 3D character movement using separated-axis AABB bounding-box collision detection.
 * Prevents tunneling or clipping through floor surfaces, pipes, floating blocks, castle walls, and fences.
 */
export function resolveCharacterStep3D(
  state: PlayerPhysicsState3D,
  colliders: readonly AABB3D[],
  bounds: WorldBounds3D,
  gravity = 0.022
): StepCollisionResult3D {
  const EPS = 0.0001;
  const VERTICAL_WALL_TRIM = 0.06;

  let x = state.x;
  let y = state.y;
  let z = state.z;
  let vx = state.vx;
  let vy = state.vy - gravity;
  let vz = state.vz;

  const hw = state.halfWidth;
  const h = state.height;
  const hd = state.halfDepth;

  let collidedHorizontally = false;
  let grounded = false;
  let landedColliderId: string | null = null;
  const bumpedColliderIds: string[] = [];

  // 1. Resolve X-axis movement against solid AABBs
  x += vx;
  const xBox = createPlayerAABB(x, y + VERTICAL_WALL_TRIM, z, hw, Math.max(0.2, h - VERTICAL_WALL_TRIM * 2), hd);
  for (const obs of colliders) {
    if (!boxesIntersect3D(xBox, obs)) continue;
    if (vx > 0) {
      x = obs.minX - hw - EPS;
    } else if (vx < 0) {
      x = obs.maxX + hw + EPS;
    } else {
      const centerObsX = (obs.minX + obs.maxX) * 0.5;
      x = x >= centerObsX ? obs.maxX + hw + EPS : obs.minX - hw - EPS;
    }
    vx = 0;
    collidedHorizontally = true;
    xBox.minX = x - hw;
    xBox.maxX = x + hw;
  }

  // 2. Resolve Z-axis movement against solid AABBs
  z += vz;
  const zBox = createPlayerAABB(x, y + VERTICAL_WALL_TRIM, z, hw, Math.max(0.2, h - VERTICAL_WALL_TRIM * 2), hd);
  for (const obs of colliders) {
    if (!boxesIntersect3D(zBox, obs)) continue;
    if (vz > 0) {
      z = obs.minZ - hd - EPS;
    } else if (vz < 0) {
      z = obs.maxZ + hd + EPS;
    } else {
      const centerObsZ = (obs.minZ + obs.maxZ) * 0.5;
      z = z >= centerObsZ ? obs.maxZ + hd + EPS : obs.minZ - hd - EPS;
    }
    vz = 0;
    collidedHorizontally = true;
    zBox.minZ = z - hd;
    zBox.maxZ = z + hd;
  }

  // 3. Resolve Y-axis movement (floor landing + ceiling/question-block head bonk)
  const prevY = y;
  y += vy;
  const yBox = createPlayerAABB(x, y, z, hw * 0.92, h, hd * 0.92);

  for (const obs of colliders) {
    if (!boxesIntersect3D(yBox, obs)) continue;

    if (vy <= 0 && prevY >= obs.maxY - 0.55) {
      // Landing on top of floor, pipe, platform, or block
      y = obs.maxY;
      vy = 0;
      grounded = true;
      landedColliderId = obs.id;
      yBox.minY = y;
      yBox.maxY = y + h;
    } else if (vy > 0 && prevY + h <= obs.minY + 0.55) {
      // Head bonk against underside of floating block
      y = obs.minY - h - EPS;
      vy = -0.04;
      bumpedColliderIds.push(obs.id);
      yBox.minY = y;
      yBox.maxY = y + h;
    } else {
      // Deep overlap safety recovery: push upward if closer to top, else downward
      const distToTop = Math.abs(obs.maxY - y);
      const distToBottom = Math.abs(y + h - obs.minY);
      if (distToTop <= distToBottom) {
        y = obs.maxY;
        vy = 0;
        grounded = true;
        landedColliderId = obs.id;
      } else {
        y = obs.minY - h - EPS;
        vy = Math.min(0, vy);
      }
      yBox.minY = y;
      yBox.maxY = y + h;
    }
  }

  // 4. Hard floor & world boundary safety clamp so player can NEVER fall through world floor or fences
  if (y <= bounds.minY) {
    y = bounds.minY;
    vy = 0;
    grounded = true;
    if (!landedColliderId) landedColliderId = 'world-floor';
  }
  if (y + h > bounds.maxY) {
    y = bounds.maxY - h;
    vy = Math.min(0, vy);
  }

  if (x - hw < bounds.minX) {
    x = bounds.minX + hw;
    vx = 0;
    collidedHorizontally = true;
  } else if (x + hw > bounds.maxX) {
    x = bounds.maxX - hw;
    vx = 0;
    collidedHorizontally = true;
  }

  if (z - hd < bounds.minZ) {
    z = bounds.minZ + hd;
    vz = 0;
    collidedHorizontally = true;
  } else if (z + hd > bounds.maxZ) {
    z = bounds.maxZ - hd;
    vz = 0;
    collidedHorizontally = true;
  }

  return {
    x,
    y,
    z,
    vx,
    vy,
    vz,
    grounded,
    collidedHorizontally,
    landedColliderId,
    bumpedColliderIds,
  };
}
