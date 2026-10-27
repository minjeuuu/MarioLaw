import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { marioAudio } from '../utils/audio';
import { MarioAvatar } from '../types/laborLaw';
import { getHeroMeta } from '../data/heroesData';
import {
  AABB3D,
  WorldBounds3D,
  createBoxCollider,
  resolveCharacterStep3D,
} from '../utils/collision3d';
import { stepIsland3DMomentum } from '../utils/gamePhysics';
import { MarioCharacterAvatar, MarioCoinIcon } from './MarioIcons';
import { Play, RotateCcw, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Trophy } from 'lucide-react';

interface Game3DProps {
  fontSize?: 'normal' | 'large' | 'xlarge';
  equippedAvatar?: MarioAvatar;
  onEarnCoins: (amount: number) => void;
}

const TOTAL_ISLAND_COINS = 18;

export const Game3D: React.FC<Game3DProps> = ({ equippedAvatar = 'mario', onEarnCoins }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const initialAutoStart =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('autostart') === '1';

  const [gameState, setGameState] = useState<'start' | 'playing' | 'victory'>(
    initialAutoStart ? 'playing' : 'start'
  );
  const gameStateRef = useRef<'start' | 'playing' | 'victory'>(
    initialAutoStart ? 'playing' : 'start'
  );
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [collisionNotice, setCollisionNotice] = useState<string>('AABB Solid Physics Active');

  const onEarnCoinsRef = useRef(onEarnCoins);
  useEffect(() => {
    onEarnCoinsRef.current = onEarnCoins;
  }, [onEarnCoins]);

  useEffect(() => {
    gameStateRef.current = gameState;
    if (typeof document !== 'undefined') {
      document.body.dataset.state =
        gameState === 'start' ? 'title' : gameState === 'victory' ? 'gameover' : 'playing';
    }
  }, [gameState]);

  const heroMeta = getHeroMeta(equippedAvatar);
  const avatarRef = useRef(equippedAvatar);
  const shirtMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const bodyMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const resetRunRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    avatarRef.current = equippedAvatar;
    const meta = getHeroMeta(equippedAvatar);
    if (shirtMatRef.current) shirtMatRef.current.color.setHex(meta.primaryHex);
    if (bodyMatRef.current) bodyMatRef.current.color.setHex(meta.secondaryHex);
  }, [equippedAvatar]);

  // Unified input state
  const keysRef = useRef<{
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    jumpHeld: boolean;
    jumpQueued: boolean;
  }>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jumpHeld: false,
    jumpQueued: false,
  });

  const startGame = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    keysRef.current.forward = false;
    keysRef.current.backward = false;
    keysRef.current.left = false;
    keysRef.current.right = false;
    keysRef.current.jumpHeld = false;
    keysRef.current.jumpQueued = false;
    if (resetRunRef.current) {
      resetRunRef.current();
    }
    setCoins(0);
    setScore(0);
    setGameState('playing');
    marioAudio.playPowerUp();
  };

  useEffect(() => {
    const clearKeys = () => {
      keysRef.current.forward = false;
      keysRef.current.backward = false;
      keysRef.current.left = false;
      keysRef.current.right = false;
      keysRef.current.jumpHeld = false;
      keysRef.current.jumpQueued = false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStateRef.current === 'start' && (e.code === 'Enter' || e.code === 'Space')) {
        e.preventDefault();
        startGame();
        return;
      }
      if (['ArrowUp', 'KeyW'].includes(e.code)) keysRef.current.forward = true;
      if (['ArrowDown', 'KeyS'].includes(e.code)) keysRef.current.backward = true;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) keysRef.current.left = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) keysRef.current.right = true;
      if (e.code === 'Space') {
        if (!keysRef.current.jumpHeld) {
          keysRef.current.jumpQueued = true;
        }
        keysRef.current.jumpHeld = true;
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) keysRef.current.forward = false;
      if (['ArrowDown', 'KeyS'].includes(e.code)) keysRef.current.backward = false;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) keysRef.current.left = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) keysRef.current.right = false;
      if (e.code === 'Space') keysRef.current.jumpHeld = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', clearKeys);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', clearKeys);
    };
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 760;
    const height = container.clientHeight || 420;

    // Detect software WebGL (SwiftShader / headless CPU renderer)
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x38bdf8);
    scene.fog = new THREE.Fog(0x38bdf8, 42, 105);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 220);
    camera.position.set(0, 10, 18);
    camera.lookAt(0, 2, -4);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Warm Key + Cool Sky/Ground Hemisphere Fill
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x15803d, 0.95);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffedd5, 1.35);
    dirLight.position.set(16, 28, 18);
    scene.add(dirLight);

    // Solid AABB Colliders Registry + Mesh map for Question Block bumps
    const colliders: AABB3D[] = [];
    const blockMeshes = new Map<string, { mesh: THREE.Mesh; baseY: number }>();

    // 1. Island Grass Ground + Tapered Soil Cliff Base + Brick Courtyard Path
    const groundGeo = new THREE.BoxGeometry(60, 2, 60);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.82 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -1;
    scene.add(ground);

    // Register primary island floor AABB so player never clips below y = 0
    colliders.push(createBoxCollider('island-floor', 0, 0, -2, 0, 30, 30, 'ground'));

    const soilGeo = new THREE.BoxGeometry(58, 8, 58);
    const soilMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.92 });
    const soil = new THREE.Mesh(soilGeo, soilMat);
    soil.position.y = -6;
    scene.add(soil);

    // Cobblestone / Courtyard Walkway (offset y = 0.025 to prevent Z-fighting)
    const pathMat = new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.78 });
    const mainWalkway = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.05, 36), pathMat);
    mainWalkway.position.set(0, 0.025, 2);
    scene.add(mainWalkway);

    // 2. Perimeter Fences with Solid AABB Colliders
    const fenceMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 });
    const fenceRailMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.65 });
    const addPerimeterFence = (id: string, x: number, z: number, w: number, d: number) => {
      const fenceGroup = new THREE.Group();
      const baseWall = new THREE.Mesh(new THREE.BoxGeometry(w, 1.8, d), fenceMat);
      baseWall.position.y = 0.9;
      const topRail = new THREE.Mesh(new THREE.BoxGeometry(w + 0.1, 0.35, d + 0.1), fenceRailMat);
      topRail.position.y = 1.95;
      fenceGroup.add(baseWall, topRail);
      fenceGroup.position.set(x, 0, z);
      scene.add(fenceGroup);

      colliders.push(createBoxCollider(id, x, z, 0, 3.2, w / 2, d / 2, 'fence'));
    };
    addPerimeterFence('fence-south', 0, 29.5, 60, 1.0);
    addPerimeterFence('fence-north', 0, -29.5, 60, 1.0);
    addPerimeterFence('fence-east', 29.5, 0, 1.0, 60);
    addPerimeterFence('fence-west', -29.5, 0, 1.0, 60);

    // 3. Multi-Part 3D Mushroom Castle Landmark at (0, 0, -21) matching its solid AABB!
    const castleGroup = new THREE.Group();
    const castleStoneMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.72 });
    const castleTrimMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 });
    const castleRoofMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.38 });
    const castleDoorMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.82 });
    const castleGoldMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.25, roughness: 0.3 });

    // Main Keep
    const mainKeep = new THREE.Mesh(new THREE.BoxGeometry(12, 7.5, 6.5), castleStoneMat);
    mainKeep.position.y = 3.75;
    castleGroup.add(mainKeep);

    // Upper Central Tower
    const centerTower = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.6, 5.5, 16), castleTrimMat);
    centerTower.position.set(0, 9.2, 0);
    const centerSpire = new THREE.Mesh(new THREE.ConeGeometry(3.0, 3.6, 16), castleRoofMat);
    centerSpire.position.set(0, 13.5, 0);
    castleGroup.add(centerTower, centerSpire);

    // Flanking Turrets
    [-6.2, 6.2].forEach((tx) => {
      const turret = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 2.1, 8.5, 14), castleStoneMat);
      turret.position.set(tx, 4.25, 0.4);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(2.4, 2.8, 14), castleRoofMat);
      roof.position.set(tx, 9.8, 0.4);
      castleGroup.add(turret, roof);
    });

    // Castle Arch Doorway + Emblem Star
    const doorArch = new THREE.Mesh(new THREE.BoxGeometry(2.8, 3.6, 0.4), castleDoorMat);
    doorArch.position.set(0, 1.8, 3.3);
    const emblem = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.25, 12), castleGoldMat);
    emblem.rotation.x = Math.PI / 2;
    emblem.position.set(0, 5.6, 3.35);
    castleGroup.add(doorArch, emblem);

    castleGroup.position.set(0, 0, -21);
    scene.add(castleGroup);

    // Solid AABB for Castle Keep + Flanking Turrets
    colliders.push(createBoxCollider('castle-main', 0, -21, 0, 13.5, 8.2, 3.6, 'castle'));

    // 4. Procedural Warp Pipes with Solid AABB Bounding Boxes
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.32 });
    const pipeLipMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.28 });
    const pipeHoleMat = new THREE.MeshStandardMaterial({ color: 0x052e16, roughness: 0.9 });
    const createPipe = (id: string, px: number, pz: number, pHeight: number) => {
      const g = new THREE.Group();
      const col = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.45, pHeight, 18), pipeMat);
      col.position.y = pHeight / 2;
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 1.75, 0.8, 18), pipeLipMat);
      rim.position.y = pHeight;
      const bore = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 0.12, 16), pipeHoleMat);
      bore.position.y = pHeight + 0.41;
      g.add(col, rim, bore);
      g.position.set(px, 0, pz);
      scene.add(g);

      colliders.push(createBoxCollider(id, px, pz, 0, pHeight + 0.4, 1.7, 1.7, 'pipe'));
    };
    createPipe('pipe-nw', -10, -8, 3.2);
    createPipe('pipe-ne', 12, -13, 4.0);
    createPipe('pipe-sw', -14, 12, 2.8);
    createPipe('pipe-se', 15, 10, 3.4);

    // 5. Stepping Stone Platforms so every high block & pipe top is reachable!
    const stepMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.65 });
    const stepTopMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.45 });
    const createStepPlatform = (id: string, sx: number, sz: number, height: number, w = 3.2, d = 3.2) => {
      const grp = new THREE.Group();
      const base = new THREE.Mesh(new THREE.BoxGeometry(w, height, d), stepMat);
      base.position.y = height / 2;
      const cap = new THREE.Mesh(new THREE.BoxGeometry(w + 0.15, 0.28, d + 0.15), stepTopMat);
      cap.position.y = height + 0.14;
      grp.add(base, cap);
      grp.position.set(sx, 0, sz);
      scene.add(grp);

      colliders.push(createBoxCollider(id, sx, sz, 0, height + 0.28, w / 2, d / 2, 'platform'));
    };
    createStepPlatform('step-center', -5.5, -8, 1.8);
    createStepPlatform('step-west', -10, 8.2, 2.0);
    createStepPlatform('step-east', 8, 6.2, 2.0);

    // 6. Question Blocks & Brick Rows with Solid AABB & Head-Bonk Reward
    const qMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.35 });
    const hitQMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7 });
    const brickMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.72 });

    const createBlockRow = (rowPrefix: string, bx: number, by: number, bz: number) => {
      for (let i = -1; i <= 1; i++) {
        const isQ = i === 0;
        const block = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), isQ ? qMat.clone() : brickMat);
        const posX = bx + i * 2.15;
        block.position.set(posX, by, bz);
        scene.add(block);

        const id = `${rowPrefix}-${i + 1}`;
        colliders.push(
          createBoxCollider(
            id,
            posX,
            bz,
            by - 1.0,
            by + 1.0,
            1.02,
            1.02,
            isQ ? 'question_block' : 'block',
            isQ
          )
        );
        blockMeshes.set(id, { mesh: block, baseY: by });
      }
    };
    createBlockRow('row-mid', 0, 4.4, -8);
    createBlockRow('row-west', -10, 5.0, 4);
    createBlockRow('row-east', 8, 5.0, 2);

    // 7. Composite 8-Part 3D Hero Character + Contact Shadow Disc
    const playerGroup = new THREE.Group();
    const initialHero = getHeroMeta(avatarRef.current);

    const bodyMat = new THREE.MeshStandardMaterial({ color: initialHero.secondaryHex, roughness: 0.55 });
    const shirtMat = new THREE.MeshStandardMaterial({ color: initialHero.primaryHex, roughness: 0.35 });
    bodyMatRef.current = bodyMat;
    shirtMatRef.current = shirtMat;

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.5, 0.95), bodyMat);
    body.position.y = 1.25;
    playerGroup.add(body);

    const sleeves = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.65, 0.85), shirtMat);
    sleeves.position.y = 1.55;
    playerGroup.add(sleeves);

    const faceMat = new THREE.MeshStandardMaterial({ color: 0xfed7aa, roughness: 0.6 });
    const head = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.98, 0.98), faceMat);
    head.position.y = 2.52;
    playerGroup.add(head);

    const cap = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.48, 1.32), shirtMat);
    cap.position.set(0, 3.12, 0.08);
    playerGroup.add(cap);

    const visor = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.18, 0.55), shirtMat);
    visor.position.set(0, 2.92, 0.82);
    playerGroup.add(visor);

    const stacheMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.8 });
    const stache = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.22, 0.28), stacheMat);
    stache.position.set(0, 2.3, 0.52);
    playerGroup.add(stache);

    const shoeMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.75 });
    const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.48, 0.88), shoeMat);
    leftShoe.position.set(-0.38, 0.24, 0.08);
    const rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.48, 0.88), shoeMat);
    rightShoe.position.set(0.38, 0.24, 0.08);
    playerGroup.add(leftShoe, rightShoe);

    playerGroup.position.set(0, 0, 8);
    playerGroup.rotation.y = Math.PI; // Face north toward Question Blocks & Castle vista!
    scene.add(playerGroup);

    // Ground Contact Shadow Disc beneath player (y = floorY + 0.03, no Z-fighting)
    const shadowDisc = new THREE.Mesh(
      new THREE.CircleGeometry(1.05, 20),
      new THREE.MeshBasicMaterial({
        color: 0x0f172a,
        transparent: true,
        opacity: 0.38,
        depthWrite: false,
      })
    );
    shadowDisc.rotation.x = -Math.PI / 2;
    shadowDisc.position.set(0, 0.03, 8);
    scene.add(shadowDisc);

    // 8. 3D Collectible Coins (metalness capped <= 0.25 without envMap so coins never reflect black)
    const coinGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.22, 16);
    const coinMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xd97706,
      emissiveIntensity: 0.22,
      metalness: 0.22,
      roughness: 0.28,
    });
    const coinsList: { mesh: THREE.Mesh; collected: boolean; origY: number }[] = [];

    const coinPositions: [number, number, number][] = [
      [0, 6.4, -8],
      [-2.15, 6.4, -8],
      [2.15, 6.4, -8],
      [-10, 1.6, 13],
      [-5, 1.6, 12],
      [0, 1.6, 13],
      [5, 1.6, 12],
      [10, 1.6, 13],
      [-10, 7.0, 4],
      [8, 7.0, 2],
      [-10, 4.9, -8],
      [12, 5.7, -13],
      [-14, 4.5, 12],
      [15, 5.1, 10],
      [-18, 1.6, -15],
      [18, 1.6, -15],
      [-18, 1.6, 18],
      [18, 1.6, 18],
    ];

    coinPositions.forEach(([cx, cy, cz]) => {
      const coin = new THREE.Mesh(coinGeo, coinMat);
      coin.position.set(cx, cy, cz);
      coin.rotation.x = Math.PI / 2;
      scene.add(coin);
      coinsList.push({ mesh: coin, collected: false, origY: cy });
    });

    const worldBounds: WorldBounds3D = {
      minX: -28.6,
      maxX: 28.6,
      minY: 0,
      maxY: 26,
      minZ: -28.6,
      maxZ: 28.6,
    };

    const pState = {
      x: 0,
      y: 0,
      z: 8,
      vx: 0,
      vy: 0,
      vz: 0,
      halfWidth: 0.68,
      height: 3.3,
      halfDepth: 0.68,
      speed: 0.26,
      jumpImpulse: 0.48,
      grounded: true,
      rotY: Math.PI,
      coyoteFrames: 0,
    };

    let localCoins = 0;
    let localScore = 0;
    let orbitAngle = 0.35;
    let gaitDist = 0;
    let jumpCutApplied3D = false;

    resetRunRef.current = () => {
      pState.x = 0;
      pState.y = 0;
      pState.z = 8;
      pState.vx = 0;
      pState.vy = 0;
      pState.vz = 0;
      pState.grounded = true;
      pState.rotY = Math.PI;
      pState.coyoteFrames = 0;
      jumpCutApplied3D = false;
      localCoins = 0;
      localScore = 0;

      colliders.forEach((c) => {
        if (c.isQuestionBlock) {
          c.hit = false;
          const entry = blockMeshes.get(c.id);
          if (entry) {
            entry.mesh.position.y = entry.baseY;
            (entry.mesh.material as THREE.MeshStandardMaterial).color.setHex(0xf59e0b);
          }
        }
      });

      coinsList.forEach((c) => {
        if (c.collected) {
          c.collected = false;
          scene.add(c.mesh);
        }
      });
    };

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // ResizeObserver for crisp responsive viewport
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(300, Math.floor(entry.contentRect.width));
        const h = Math.max(260, Math.floor(entry.contentRect.height));
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    // Software-WebGL friendly loop pacing (`afterDraw`) so headless Chromium never starves screenshots
    let frameId = 0;
    let paceTimer: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;
    const gl = renderer.getContext();
    const fencePixel = new Uint8Array(4);

    const scheduleNextFrame = () => {
      if (disposed) return;
      if (!isSoftwareGl) {
        frameId = requestAnimationFrame(tick);
        return;
      }
      paceTimer = setTimeout(() => {
        paceTimer = null;
        if (disposed) return;
        try {
          gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, fencePixel);
        } catch {
          // ignore context loss
        }
        if (!disposed) {
          frameId = requestAnimationFrame(tick);
        }
      }, 16);
    };

    let lastTime = performance.now();

    const tick = (now: number) => {
      if (disposed) return;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const stepScale = Math.max(0.6, Math.min(1.6, dt * 60));

      const animTime = now * 0.003;
      coinsList.forEach((c) => {
        if (c.collected) return;
        c.mesh.rotation.z += 0.045 * stepScale;
        c.mesh.position.y = c.origY + Math.sin(animTime + c.mesh.position.x) * 0.16;
      });

      if (gameStateRef.current === 'start') {
        orbitAngle += 0.007 * stepScale;
        camera.position.set(Math.sin(orbitAngle) * 21, 10.5, Math.cos(orbitAngle) * 21);
        camera.lookAt(0, 2.5, -5);
        renderer.render(scene, camera);
        scheduleNextFrame();
        return;
      }

      if (gameStateRef.current === 'victory') {
        orbitAngle += 0.01 * stepScale;
        camera.position.set(
          pState.x + Math.sin(orbitAngle) * 12,
          pState.y + 7,
          pState.z + Math.cos(orbitAngle) * 12
        );
        camera.lookAt(pState.x, pState.y + 1.8, pState.z);
        renderer.render(scene, camera);
        scheduleNextFrame();
        return;
      }

      // Playing mode: movement + AABB bounding-box collision resolution
      let moveX = 0;
      let moveZ = 0;
      if (keysRef.current.forward) moveZ -= 1;
      if (keysRef.current.backward) moveZ += 1;
      if (keysRef.current.left) moveX -= 1;
      if (keysRef.current.right) moveX += 1;

      if (pState.grounded) {
        pState.coyoteFrames = 7;
        jumpCutApplied3D = false;
      } else if (pState.coyoteFrames > 0) {
        pState.coyoteFrames -= 1;
      }

      // Edge-triggered jump with coyote time
      if (keysRef.current.jumpQueued && (pState.grounded || pState.coyoteFrames > 0)) {
        pState.vy = pState.jumpImpulse;
        pState.grounded = false;
        pState.coyoteFrames = 0;
        jumpCutApplied3D = false;
        keysRef.current.jumpQueued = false;
        marioAudio.playJump();
      } else {
        keysRef.current.jumpQueued = false;
      }

      // Smooth 3D momentum, shortest-arc turn damping & single-cut variable jump height
      const mom = stepIsland3DMomentum({
        vx: pState.vx,
        vz: pState.vz,
        vy: pState.vy,
        rotY: pState.rotY,
        moveX,
        moveZ,
        maxSpeed: pState.speed,
        grounded: pState.grounded,
        jumpHeld: keysRef.current.jumpHeld,
        jumpCutApplied: jumpCutApplied3D,
        stepScale,
      });
      pState.vx = mom.vx;
      pState.vz = mom.vz;
      pState.vy = mom.vy;
      pState.rotY = mom.rotY;
      jumpCutApplied3D = mom.jumpCutApplied;

      // Solve 3D AABB bounding-box step (prevents passing through pipes, blocks, castle, fences, or floor)
      const resolved = resolveCharacterStep3D(pState, colliders, worldBounds, 0.022 * stepScale);
      pState.x = resolved.x;
      pState.y = resolved.y;
      pState.z = resolved.z;
      pState.vx = resolved.vx;
      pState.vy = resolved.vy;
      pState.vz = resolved.vz;
      pState.grounded = resolved.grounded;

      // Question block head-bonk handling
      if (resolved.bumpedColliderIds.length > 0) {
        for (const bumpedId of resolved.bumpedColliderIds) {
          const hitCol = colliders.find((c) => c.id === bumpedId);
          const meshEntry = blockMeshes.get(bumpedId);
          if (hitCol && hitCol.isQuestionBlock && !hitCol.hit) {
            hitCol.hit = true;
            if (meshEntry) {
              meshEntry.mesh.position.y = meshEntry.baseY + 0.35;
              (meshEntry.mesh.material as THREE.MeshStandardMaterial).color.setHex(0x94a3b8);
              setTimeout(() => {
                if (meshEntry) meshEntry.mesh.position.y = meshEntry.baseY;
              }, 130);
            }
            marioAudio.playQuestionBlock();
            onEarnCoinsRef.current(2);
            localCoins += 2;
            localScore += 500;
            setCoins(localCoins);
            setScore(localScore);
            setCollisionNotice('Question Block Bonked! +2 Coins');
          } else {
            marioAudio.playJump();
          }
        }
      }

      // Update player mesh + gait walk cycle
      const stepHoriz = Math.hypot(pState.vx, pState.vz);
      if (stepHoriz > 0.01 && pState.grounded) {
        gaitDist += stepHoriz * 2.4;
        leftShoe.position.z = 0.08 + Math.sin(gaitDist) * 0.24;
        rightShoe.position.z = 0.08 - Math.sin(gaitDist) * 0.24;
      } else {
        leftShoe.position.z = 0.08;
        rightShoe.position.z = 0.08;
      }

      playerGroup.position.set(pState.x, pState.y, pState.z);
      playerGroup.rotation.y = pState.rotY;

      // Update contact shadow directly onto surface beneath character
      let surfaceBelowY = 0;
      for (const obs of colliders) {
        if (obs.kind === 'ground' || obs.kind === 'fence') continue;
        if (
          pState.x >= obs.minX &&
          pState.x <= obs.maxX &&
          pState.z >= obs.minZ &&
          pState.z <= obs.maxZ &&
          obs.maxY <= pState.y + 0.08 &&
          obs.maxY > surfaceBelowY
        ) {
          surfaceBelowY = obs.maxY;
        }
      }
      shadowDisc.position.set(pState.x, surfaceBelowY + 0.03, pState.z);
      const heightAboveFloor = Math.max(0, pState.y - surfaceBelowY);
      const shadowScale = Math.max(0.45, 1 - heightAboveFloor * 0.08);
      shadowDisc.scale.set(shadowScale, shadowScale, 1);

      // Coin AABB / proximity pickup
      let remainingUncollected = 0;
      coinsList.forEach((c) => {
        if (c.collected) return;
        const dx = pState.x - c.mesh.position.x;
        const dy = pState.y + 1.5 - c.mesh.position.y;
        const dz = pState.z - c.mesh.position.z;
        if (dx * dx + dy * dy + dz * dz < 4.4) {
          c.collected = true;
          scene.remove(c.mesh);
          localCoins += 1;
          localScore += 250;
          setCoins(localCoins);
          setScore(localScore);
          onEarnCoinsRef.current(1);
          marioAudio.playCoin();
        } else {
          remainingUncollected += 1;
        }
      });

      if (remainingUncollected === 0 && gameStateRef.current === 'playing') {
        onEarnCoinsRef.current(25);
        setScore((s) => s + 1500);
        setGameState('victory');
        marioAudio.playQuizComplete();
      }

      // Exponentially damped follow camera
      const camLerp = 1 - Math.exp(-5.5 * dt);
      camera.position.x += (pState.x - camera.position.x) * camLerp;
      camera.position.z += (Math.min(27.5, pState.z + 13.5) - camera.position.z) * camLerp;
      camera.position.y += (pState.y + 8.2 - camera.position.y) * camLerp;
      camera.lookAt(pState.x, pState.y + 1.8, pState.z - 2.5);

      renderer.render(scene, camera);
      scheduleNextFrame();
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      if (paceTimer) clearTimeout(paceTimer);
      resizeObserver.disconnect();
      renderer.dispose();
      if (container) container.innerHTML = '';
    };
  }, []);

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="bg-[#1e293b] rounded-3xl mario-card border-4 border-slate-950 p-4 sm:p-6 text-white space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-slate-700 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-amber-400 rounded-xl border-2 border-black flex items-center justify-center shrink-0">
              <MarioCharacterAvatar character={equippedAvatar} className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider font-mario block">
                3D SPATIAL ARENA • {heroMeta.name.toUpperCase()}
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-display text-white">
                3D MARIO COIN ISLAND
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900 px-3.5 py-2 rounded-xl border-2 border-slate-700 tabular-nums">
            <div className="flex items-center gap-1.5 font-mario text-xs text-amber-300">
              <MarioCoinIcon className="w-4 h-4 shrink-0" />
              <span>x{coins.toString().padStart(2, '0')}</span>
            </div>
            <div className="font-mario text-xs text-white">
              SCORE: <span className="text-emerald-400">{score.toString().padStart(5, '0')}</span>
            </div>
            <span className="hidden md:inline-block text-[10px] font-bold text-cyan-300 border-l border-slate-700 pl-2.5">
              {collisionNotice}
            </span>
          </div>
        </div>

        {/* 3D Viewport Frame (Canvas sibling isolated from overlays; zero backdrop-blur) */}
        <div
          data-testid="game3d-viewport"
          className="relative rounded-2xl border-4 border-slate-950 overflow-hidden bg-slate-950 shadow-2xl h-[380px] sm:h-[420px]"
        >
          <div ref={mountRef} className="w-full h-full" />

          {/* Start Screen Overlay — Zero backdrop-blur over WebGL */}
          {gameState === 'start' && (
            <div className="absolute inset-0 bg-slate-950/78 flex flex-col items-center justify-between text-center p-6 text-white">
              <div className="pt-2">
                <svg viewBox="0 0 320 64" className="w-64 sm:w-80 h-auto mx-auto" aria-hidden="true">
                  <rect x="8" y="8" width="304" height="48" rx="12" fill="#f59e0b" stroke="#0f172a" strokeWidth="4" />
                  <circle cx="24" cy="20" r="3" fill="#78350f" />
                  <circle cx="296" cy="20" r="3" fill="#78350f" />
                  <circle cx="24" cy="44" r="3" fill="#78350f" />
                  <circle cx="296" cy="44" r="3" fill="#78350f" />
                  <text
                    x="160"
                    y="39"
                    textAnchor="middle"
                    fill="#0f172a"
                    fontSize="18"
                    fontWeight="900"
                    fontFamily="Fredoka, sans-serif"
                  >
                    3D MUSHROOM COIN ISLAND
                  </text>
                </svg>
              </div>

              <div className="space-y-4">
                <button
                  type="button"
                  data-start="true"
                  onClick={startGame}
                  className="h-12 px-8 inline-flex items-center justify-center gap-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_4px_0_#000] active:translate-y-0.5 text-sm sm:text-base cursor-pointer font-mario leading-none whitespace-nowrap"
                >
                  <Play className="w-5 h-5 fill-current shrink-0" />
                  <span>START 3D GAME</span>
                </button>
              </div>

              <p className="text-xs font-bold text-amber-200 tracking-wide">
                WASD / Arrows Move · Space Jump · Collect All {TOTAL_ISLAND_COINS} Coins & Bonk [?] Blocks
              </p>
            </div>
          )}

          {/* Island Cleared Modal */}
          {gameState === 'victory' && (
            <div className="absolute inset-0 bg-slate-950/88 flex flex-col items-center justify-center text-center p-6 space-y-4 text-white">
              <div className="w-16 h-16 rounded-2xl bg-amber-400 border-3 border-black flex items-center justify-center text-slate-950 shadow-[0_4px_0_#000]">
                <Trophy className="w-9 h-9" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black font-display text-amber-300">
                3D ISLAND MASTERED!
              </h3>
              <div className="grid grid-cols-2 gap-3 w-full max-w-xs tabular-nums">
                <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-3">
                  <span className="text-[10px] font-mario text-slate-400 block">FINAL SCORE</span>
                  <span className="text-lg font-black text-emerald-400">{score}</span>
                </div>
                <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-3">
                  <span className="text-[10px] font-mario text-slate-400 block">COINS</span>
                  <span className="text-lg font-black text-amber-300">{coins}</span>
                </div>
              </div>
              <button
                type="button"
                data-start="true"
                onClick={startGame}
                className="h-11 px-7 inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_4px_0_#000] cursor-pointer font-mario text-xs leading-none whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4 shrink-0" />
                <span>PLAY AGAIN</span>
              </button>
            </div>
          )}
        </div>

        {/* On-Screen Virtual Controls — Uniform h-11 Single-Row Baseline */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="inline-flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Move Left"
              onMouseDown={() => (keysRef.current.left = true)}
              onMouseUp={() => (keysRef.current.left = false)}
              onMouseLeave={() => (keysRef.current.left = false)}
              onTouchStart={() => (keysRef.current.left = true)}
              onTouchEnd={() => (keysRef.current.left = false)}
              className="h-11 w-11 bg-slate-800 hover:bg-slate-700 active:bg-amber-400 active:text-black rounded-xl border-2 border-slate-600 inline-flex items-center justify-center cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-5 h-5 shrink-0" />
            </button>
            <button
              type="button"
              aria-label="Move Forward"
              onMouseDown={() => (keysRef.current.forward = true)}
              onMouseUp={() => (keysRef.current.forward = false)}
              onMouseLeave={() => (keysRef.current.forward = false)}
              onTouchStart={() => (keysRef.current.forward = true)}
              onTouchEnd={() => (keysRef.current.forward = false)}
              className="h-11 w-11 bg-slate-800 hover:bg-slate-700 active:bg-amber-400 active:text-black rounded-xl border-2 border-slate-600 inline-flex items-center justify-center cursor-pointer shrink-0"
            >
              <ArrowUp className="w-5 h-5 shrink-0" />
            </button>
            <button
              type="button"
              aria-label="Move Backward"
              onMouseDown={() => (keysRef.current.backward = true)}
              onMouseUp={() => (keysRef.current.backward = false)}
              onMouseLeave={() => (keysRef.current.backward = false)}
              onTouchStart={() => (keysRef.current.backward = true)}
              onTouchEnd={() => (keysRef.current.backward = false)}
              className="h-11 w-11 bg-slate-800 hover:bg-slate-700 active:bg-amber-400 active:text-black rounded-xl border-2 border-slate-600 inline-flex items-center justify-center cursor-pointer shrink-0"
            >
              <ArrowDown className="w-5 h-5 shrink-0" />
            </button>
            <button
              type="button"
              aria-label="Move Right"
              onMouseDown={() => (keysRef.current.right = true)}
              onMouseUp={() => (keysRef.current.right = false)}
              onMouseLeave={() => (keysRef.current.right = false)}
              onTouchStart={() => (keysRef.current.right = true)}
              onTouchEnd={() => (keysRef.current.right = false)}
              className="h-11 w-11 bg-slate-800 hover:bg-slate-700 active:bg-amber-400 active:text-black rounded-xl border-2 border-slate-600 inline-flex items-center justify-center cursor-pointer shrink-0"
            >
              <ArrowRight className="w-5 h-5 shrink-0" />
            </button>
          </div>

          <div className="text-xs text-slate-300 font-semibold hidden md:block">
            Solid AABB Collisions: Jump onto stepping stones, warp pipes, and floating [?] blocks!
          </div>

          <div className="inline-flex items-center gap-2.5">
            <button
              type="button"
              aria-label="Restart 3D Island"
              onClick={startGame}
              className="h-11 px-4 inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border-2 border-slate-600 cursor-pointer leading-none whitespace-nowrap"
            >
              <RotateCcw className="w-4 h-4 shrink-0" />
              <span>Reset Island</span>
            </button>

            <button
              type="button"
              aria-label="Jump (Hold for High Jump)"
              onMouseDown={() => {
                keysRef.current.jumpQueued = true;
                keysRef.current.jumpHeld = true;
              }}
              onMouseUp={() => {
                keysRef.current.jumpHeld = false;
              }}
              onMouseLeave={() => {
                keysRef.current.jumpHeld = false;
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                keysRef.current.jumpQueued = true;
                keysRef.current.jumpHeld = true;
              }}
              onTouchEnd={() => {
                keysRef.current.jumpHeld = false;
              }}
              onTouchCancel={() => {
                keysRef.current.jumpHeld = false;
              }}
              className="h-11 px-7 inline-flex items-center justify-center bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_4px_0_#000] active:translate-y-0.5 cursor-pointer font-mario text-xs leading-none whitespace-nowrap"
            >
              HOLD JUMP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
