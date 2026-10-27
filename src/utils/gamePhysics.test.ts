import test from 'node:test';
import assert from 'node:assert/strict';
import {
  stepPlatformer2DPhysics,
  stepKartArcadePhysics,
  getDriftSparkTierForCharge,
  stepIsland3DMomentum,
  Platformer2DState,
  KartArcadeState,
} from './gamePhysics';
import {
  audioController,
  MODULE_AUDIO_PROFILES,
  SOUND_PACK_DEFINITIONS,
} from './audioController';
import {
  activateSuperStarBuff,
  getSuperStarBuffStatus,
  computeEffectiveCoinReward,
  filterTopicsForPrintGuide,
  buildGlobalCoinLeaderboard,
  MAIN_CREATOR_AUTHOR,
} from './engagementFeatures';
import { computeFireFlowerStreakProgress } from './profileAchievements';
import { buildQuickStudyCuratedDeck } from './studyModes';
import { FLASHCARDS_DATA } from '../data/flashcardsData';
import { PRACTICE_QUESTIONS, BOWSER_BOSS_QUESTIONS } from '../data/quizQuestionsData';

function createInitialPlatformerState(): Platformer2DState {
  return {
    x: 100,
    y: 300,
    vx: 0,
    vy: 0,
    width: 32,
    height: 40,
    grounded: true,
    direction: 1,
    coyoteTimer: 8,
    jumpBufferTimer: 0,
    jumpCutApplied: false,
  };
}

function createInitialKartState(): KartArcadeState {
  return {
    playerDist: 0,
    playerX: 0,
    playerSpeed: 18,
    steerVelocity: 0,
    isDrifting: false,
    driftDirection: 0,
    driftCharge: 0,
    driftSparkTier: 'none',
    hopProgress: 0,
    visualSlipAngle: 0,
    boostRemaining: 0,
    spinoutRemaining: 0,
  };
}

test('Game2D variable jump height: holding jump reaches higher apex than tapping jump', () => {
  // Simulate short hop (release jump after 2 frames)
  let tapState = createInitialPlatformerState();
  let minTapY = tapState.y;
  for (let frame = 0; frame < 32; frame++) {
    const res = stepPlatformer2DPhysics(tapState, {
      left: false,
      right: false,
      jumpJustPressed: frame === 0,
      jumpHeld: frame < 2,
    });
    tapState = res.state;
    minTapY = Math.min(minTapY, tapState.y);
  }

  // Simulate full sustained jump (hold jump for all 32 frames)
  let holdState = createInitialPlatformerState();
  let minHoldY = holdState.y;
  for (let frame = 0; frame < 32; frame++) {
    const res = stepPlatformer2DPhysics(holdState, {
      left: false,
      right: false,
      jumpJustPressed: frame === 0,
      jumpHeld: true,
    });
    holdState = res.state;
    minHoldY = Math.min(minHoldY, holdState.y);
  }

  // Lower Y coordinate means higher jump in 2D canvas coordinates
  assert.ok(
    minHoldY < minTapY - 35,
    `Expected held jump apex (${minHoldY}) to be significantly higher than short-tap apex (${minTapY})`
  );
});

test('Game2D coyote time allows jumping shortly after stepping off a ledge', () => {
  let state: Platformer2DState = {
    ...createInitialPlatformerState(),
    grounded: false,
    coyoteTimer: 5,
  };
  const step = stepPlatformer2DPhysics(state, {
    left: false,
    right: true,
    jumpJustPressed: true,
    jumpHeld: true,
  });
  assert.equal(step.didTriggerJump, true);
  assert.ok(step.state.vy < -10);
});

test('LaborKart drift handling charges Blue -> Orange -> Purple sparks and releases Mini-Turbo boost', () => {
  assert.equal(getDriftSparkTierForCharge(10), 'none');
  assert.equal(getDriftSparkTierForCharge(35), 'blue');
  assert.equal(getDriftSparkTierForCharge(80), 'orange');
  assert.equal(getDriftSparkTierForCharge(130), 'purple');

  let kart = createInitialKartState();
  // Initiate right drift hop
  const hop = stepKartArcadePhysics(
    kart,
    { left: false, right: true, accel: true, brake: false, driftHeld: true },
    '100cc'
  );
  assert.equal(hop.didHopStart, true);
  assert.equal(hop.state.isDrifting, true);
  assert.equal(hop.state.driftDirection, 1);

  kart = hop.state;
  // Hold into right corner for 60 frames to charge Orange Mini-Turbo
  for (let i = 0; i < 60; i++) {
    kart = stepKartArcadePhysics(
      kart,
      { left: false, right: true, accel: true, brake: false, driftHeld: true },
      '100cc'
    ).state;
  }
  assert.ok(kart.driftSparkTier === 'orange' || kart.driftSparkTier === 'purple');

  // Release drift -> triggers Mini-Turbo boost!
  const release = stepKartArcadePhysics(
    kart,
    { left: false, right: false, accel: true, brake: false, driftHeld: false },
    '100cc'
  );
  assert.notEqual(release.releasedBoostTier, 'none');
  assert.equal(release.state.isDrifting, false);
  assert.ok(release.state.boostRemaining >= 85);
});

test('Game3D momentum & variable jump cuts upward velocity on early release', () => {
  const cut = stepIsland3DMomentum({
    vx: 0,
    vz: 0,
    vy: 0.3,
    rotY: 0,
    moveX: 1,
    moveZ: 0,
    maxSpeed: 0.22,
    grounded: false,
    jumpHeld: false,
    jumpCutApplied: false,
    stepScale: 1,
  });
  assert.equal(cut.jumpCutApplied, true);
  assert.ok(cut.vy < 0.16);
  assert.ok(cut.vx > 0);
});

test('Centralized AudioController maps Modules 1-6 (including Modules 2-5 and World 6) and verifies 6 sound packs', () => {
  const check = audioController.verifyModuleAudioMappings();
  assert.equal(check.valid, true);
  for (const worldKey of ['world1', 'world2', 'world3', 'world4', 'world5', 'world6', 'holidays']) {
    assert.ok(MODULE_AUDIO_PROFILES[worldKey], `Missing audio profile for ${worldKey}`);
  }
  assert.equal(SOUND_PACK_DEFINITIONS.length, 6);
  const restored = audioController.restoreAudioPacks();
  assert.equal(restored.restoredPacks.length, 6);
  assert.ok(restored.modulesVerified.includes('world2'));
  assert.ok(restored.modulesVerified.includes('world6'));
});

test('Super Star 2x buff, Fire Flower 5-day streak, Quick Study deck, Print filters, Leaderboard & World 6 data', () => {
  // Matthew attribution
  assert.equal(MAIN_CREATOR_AUTHOR.shortBadge, 'Created by Matthew');

  // Super Star 10-minute buff & 2x coins
  const now = 1_700_000_000_000;
  const expiry = activateSuperStarBuff(0, now, 10 * 60 * 1000);
  const status = getSuperStarBuffStatus(expiry, now + 60_000);
  assert.equal(status.isActive, true);
  assert.equal(status.formattedRemaining, '09:00');
  assert.equal(computeEffectiveCoinReward(15, { isSuperStarActive: true }), 30);

  // Consecutive Days Studied Fire Flower every 5 days
  const streak12 = computeFireFlowerStreakProgress(12);
  assert.equal(streak12.fireFlowersEarned, 2);
  assert.equal(streak12.daysIntoCurrentCycle, 2);
  assert.equal(streak12.progressPercentToNextFlower, 40);
  assert.equal(streak12.nextMilestoneDays, 15);

  // Quick Study 5-Minute Curated Deck from Need Improvement topics
  const curated = buildQuickStudyCuratedDeck({
    allCards: FLASHCARDS_DATA,
    needsImprovementTopicIds: ['m6-maternity-leave'],
    needsImprovementWorlds: ['world6'],
    deckSize: 15,
  });
  assert.equal(curated.cards.length, 15);
  assert.ok(curated.matchedWeakCardCount > 0);
  assert.ok(curated.cards.some((c) => c.worldNum === 6));

  // Print Guide Hide Completed Topics filter
  const sampleTopics = [
    { id: 't1', worldId: 'world1' as const },
    { id: 't2', worldId: 'world6' as const },
  ];
  const uncompletedOnly = filterTopicsForPrintGuide(sampleTopics, ['world1', 'world6'], ['t1'], true);
  assert.equal(uncompletedOnly.length, 1);
  assert.equal(uncompletedOnly[0].id, 't2');

  // Global Coin Leaderboard sorting
  const board = buildGlobalCoinLeaderboard({
    currentUser: {
      studentName: 'Test Bar Candidate',
      avatar: 'mario',
      totalCoins: 2000,
      streakDays: 10,
      modulesCompleted: 20,
    },
  });
  assert.equal(board[0].isCurrentUser, true);
  assert.equal(board[0].rank, 1);
  assert.ok(board.some((entry) => entry.isCreator));

  // Massive flashcards & questions including World 6
  assert.ok(FLASHCARDS_DATA.length >= 240, `Expected >=240 flashcards, got ${FLASHCARDS_DATA.length}`);
  assert.ok(FLASHCARDS_DATA.filter((c) => c.worldNum === 6).length >= 30);
  const totalQuestions = PRACTICE_QUESTIONS.length + BOWSER_BOSS_QUESTIONS.length;
  assert.ok(totalQuestions >= 180, `Expected >=180 quiz questions, got ${totalQuestions}`);
  assert.ok(PRACTICE_QUESTIONS.filter((q) => q.worldCode === 'w6').length >= 15);
});
