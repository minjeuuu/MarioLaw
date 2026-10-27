import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  boxesIntersect3D,
  createBoxCollider,
  createPlayerAABB,
  resolveCharacterStep3D,
  PlayerPhysicsState3D,
  WorldBounds3D,
} from './collision3d';

const WORLD_BOUNDS: WorldBounds3D = {
  minX: -29,
  maxX: 29,
  minY: 0,
  maxY: 40,
  minZ: -29,
  maxZ: 29,
};

function makePlayer(overrides: Partial<PlayerPhysicsState3D> = {}): PlayerPhysicsState3D {
  return {
    x: 0,
    y: 0,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    halfWidth: 0.7,
    height: 3.2,
    halfDepth: 0.7,
    grounded: true,
    ...overrides,
  };
}

describe('3D AABB Bounding-Box Collision Engine', () => {
  it('detects 3D AABB overlap accurately', () => {
    const a = createPlayerAABB(0, 0, 0, 0.7, 3.2, 0.7);
    const pipe = createBoxCollider('pipe-1', 1.0, 0, 0, 4, 1.5, 1.5, 'pipe');
    const farPipe = createBoxCollider('pipe-2', 10, 10, 0, 4, 1.5, 1.5, 'pipe');

    assert.equal(boxesIntersect3D(a, pipe), true);
    assert.equal(boxesIntersect3D(a, farPipe), false);
  });

  it('prevents character from passing horizontally through a solid pipe or castle wall', () => {
    const pipe = createBoxCollider('pipe-1', 3, 0, 0, 4, 1.5, 1.5, 'pipe');
    let player = makePlayer({ x: 0.5, y: 0, z: 0, vx: 0.6 });
    let collided = false;

    for (let i = 0; i < 10; i++) {
      const next = resolveCharacterStep3D({ ...player, vx: 0.6 }, [pipe], WORLD_BOUNDS);
      collided = collided || next.collidedHorizontally;
      player = { ...player, ...next };
    }

    // Pipe minX is 3 - 1.5 = 1.5; player maxX (x + 0.7) must never exceed 1.5
    assert.ok(player.x + player.halfWidth <= 1.5001, `Expected player maxX <= 1.5, got ${player.x + player.halfWidth}`);
    assert.equal(collided, true);
    assert.equal(player.vx, 0);
  });

  it('prevents character from falling through floor surfaces and lands cleanly on pipe top', () => {
    const floor = createBoxCollider('island-floor', 0, 0, -2, 0, 30, 30, 'ground');
    const pipe = createBoxCollider('pipe-top', 0, 0, 0, 4, 1.6, 1.6, 'pipe');

    // Falling onto floor
    const floorStep = resolveCharacterStep3D(makePlayer({ y: 0.1, vy: -0.35 }), [floor], WORLD_BOUNDS);
    assert.equal(floorStep.y, 0);
    assert.equal(floorStep.grounded, true);

    // Falling onto top of pipe at maxY = 4
    const pipeStep = resolveCharacterStep3D(makePlayer({ x: 0, y: 4.15, z: 0, vy: -0.3 }), [floor, pipe], WORLD_BOUNDS);
    assert.equal(pipeStep.y, 4);
    assert.equal(pipeStep.grounded, true);
    assert.equal(pipeStep.landedColliderId, 'pipe-top');
  });

  it('detects upward head-bonk against floating question blocks without clipping inside', () => {
    const qBlock = createBoxCollider('qblock-1', 0, 0, 4.0, 6.0, 1.1, 1.1, 'question_block', true);
    // Player height is 3.2; at y = 0.7, top is 3.9; jumping with vy = 0.45 crosses minY = 4.0
    const step = resolveCharacterStep3D(makePlayer({ x: 0, y: 0.7, z: 0, vy: 0.45, grounded: false }), [qBlock], WORLD_BOUNDS);

    assert.ok(step.y + 3.2 <= 4.0, `Player top (${step.y + 3.2}) must stay at or below block minY (4.0)`);
    assert.deepEqual(step.bumpedColliderIds, ['qblock-1']);
    assert.ok(step.vy < 0);
  });

  it('clamps character strictly inside world fence bounds', () => {
    const step = resolveCharacterStep3D(makePlayer({ x: 28.8, z: -28.8, vx: 1.5, vz: -1.5 }), [], WORLD_BOUNDS);
    assert.ok(step.x + 0.7 <= WORLD_BOUNDS.maxX + 0.001);
    assert.ok(step.z - 0.7 >= WORLD_BOUNDS.minZ - 0.001);
    assert.equal(step.collidedHorizontally, true);
  });
});
