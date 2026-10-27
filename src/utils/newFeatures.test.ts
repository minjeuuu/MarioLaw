import test from 'node:test';
import assert from 'node:assert/strict';
import { MODULE_6_LEAVES } from '../data/module6Leaves';
import {
  ALL_LAW_TOPICS,
  WORLDS_METADATA,
  FLASHCARDS_DATA,
} from '../data/laborLawData';
import { PRACTICE_QUESTIONS, BOWSER_BOSS_QUESTIONS } from '../data/quizQuestionsData';
import {
  computeWorldProgressMap,
  DEFAULT_PRINT_FORMAT_OPTIONS,
} from './engagementFeatures';
import {
  DAILY_CHALLENGE_BANK,
  DAILY_CHALLENGE_BASE_COINS,
  DAILY_CHALLENGE_REVIEW_COINS,
  getDailyChallengeForDate,
  getNextDailyChallengeCountdown,
  loadDailyChallengeState,
  submitDailyChallengeAnswer,
} from '../data/dailyChallengesData';
import { formatLocalDayKey, pickQuickTestQuestions } from './studyModes';
import {
  SOUND_PACK_SYNTH_PROFILES,
  synthesizeLoopWavDataUri,
  marioAudio,
} from './audioController';
import {
  drawUniqueFromDeck,
  resetSessionDecks,
  KART_QUESTION_BANK,
  drawKartQuestion,
  WORLD6_LEAVE_CLINIC_BANK,
  drawWorld6LeaveCase,
  drawClimberTowerRun,
} from './gameQuestionDeck';
import { SoundPackId } from '../types/laborLaw';

class MemoryStorage {
  private map = new Map<string, string>();
  getItem(key: string): string | null {
    return this.map.has(key) ? (this.map.get(key) as string) : null;
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
}

test('World 6 Statutory Leaves has full module content, embedded matrices, flashcards, and quiz coverage', () => {
  assert.equal(MODULE_6_LEAVES.length, 7);
  const world6Meta = WORLDS_METADATA.find((w) => w.id === 'world6');
  assert.ok(world6Meta, 'world6 metadata exists');
  assert.equal(world6Meta.worldNumber, 6);

  const embeddedTablesCount = MODULE_6_LEAVES.reduce(
    (acc, t) => acc + t.rules.filter((r) => Boolean(r.tableData)).length,
    0
  );
  assert.ok(embeddedTablesCount >= 4, 'World 6 includes at least 4 embedded comparative matrices');

  const w6Flashcards = FLASHCARDS_DATA.filter((fc) => fc.worldNum === 6);
  assert.ok(w6Flashcards.length >= 25, `Expected >=25 World 6 flashcards, got ${w6Flashcards.length}`);

  const w6Practice = PRACTICE_QUESTIONS.filter((q) => q.worldCode === 'w6');
  const w6Boss = BOWSER_BOSS_QUESTIONS.filter((q) => q.worldCode === 'w6');
  assert.ok(w6Practice.length >= 15, `Expected >=15 World 6 practice questions, got ${w6Practice.length}`);
  assert.ok(w6Boss.length >= 8, `Expected >=8 World 6 boss questions, got ${w6Boss.length}`);
});

test('World tracker registers World 6 completion accurately from 0/7 to 7/7', () => {
  const initialMap = computeWorldProgressMap(ALL_LAW_TOPICS, []);
  assert.equal(initialMap.world6.totalCount, 7);
  assert.equal(initialMap.world6.completedCount, 0);
  assert.equal(initialMap.world6.isWorldCleared, false);

  const w6Ids = MODULE_6_LEAVES.map((t) => t.id);
  const completedMap = computeWorldProgressMap(ALL_LAW_TOPICS, w6Ids);
  assert.equal(completedMap.world6.completedCount, 7);
  assert.equal(completedMap.world6.percent, 100);
  assert.equal(completedMap.world6.isWorldCleared, true);
});

test('Daily Challenge rotates every 24h, computes midnight countdown, awards coins once per day, and resets next day', () => {
  assert.ok(DAILY_CHALLENGE_BANK.length >= 12);

  const day1 = new Date(2026, 9, 27, 14, 30, 0); // 14:30:00 -> 09:30:00 until midnight
  const day2 = new Date(2026, 9, 28, 8, 15, 0);

  const c1 = getDailyChallengeForDate(day1);
  const c1Again = getDailyChallengeForDate(new Date(2026, 9, 27, 23, 59, 0));
  const c2 = getDailyChallengeForDate(day2);

  assert.equal(c1.id, c1Again.id, 'Same calendar day returns identical Daily Challenge');
  assert.notEqual(c1.id, c2.id, 'Consecutive calendar days rotate to a new Daily Challenge');

  const countdown = getNextDailyChallengeCountdown(day1);
  assert.equal(countdown.formatted, '09:30:00');
  assert.equal(formatLocalDayKey(day1), '2026-10-27');

  const store = new MemoryStorage();
  const initialState = loadDailyChallengeState(store, day1);
  assert.equal(initialState.completed, false);

  // Submit correct answer on Day 1
  const solved = submitDailyChallengeAnswer(store, c1.correctIndex, day1);
  assert.equal(solved.record.completed, true);
  assert.equal(solved.record.isCorrect, true);
  assert.equal(solved.baseCoinsEarned, DAILY_CHALLENGE_BASE_COINS);
  assert.equal(solved.record.totalSolvedCount, 1);

  // Duplicate submission on same day awards 0 duplicate coins
  const duplicate = submitDailyChallengeAnswer(store, c1.correctIndex, day1);
  assert.equal(duplicate.baseCoinsEarned, 0);
  assert.equal(duplicate.alreadyCompletedToday, true);
  assert.equal(duplicate.record.totalSolvedCount, 1);

  // Next day (24h refresh) resets completed flag while preserving lifetime solved count
  const day2Loaded = loadDailyChallengeState(store, day2);
  assert.equal(day2Loaded.completed, false);
  assert.equal(day2Loaded.totalSolvedCount, 1);

  // Wrong answer on Day 2 awards +20 review bonus coins
  const wrongIdx = (c2.correctIndex + 1) % c2.options.length;
  const missed = submitDailyChallengeAnswer(store, wrongIdx, day2);
  assert.equal(missed.record.isCorrect, false);
  assert.equal(missed.baseCoinsEarned, DAILY_CHALLENGE_REVIEW_COINS);
  assert.equal(missed.record.totalSolvedCount, 1);
});

test('All 6 Audio Packs synthesize persistent PCM WAV loop URIs and sync across module navigation events', () => {
  const expectedPacks: SoundPackId[] = [
    'sound_default',
    'sound_nes_8bit',
    'sound_snes_16bit',
    'sound_zen_lofi',
    'sound_galaxy_synth',
    'sound_bowser_metal',
  ];

  for (const packId of expectedPacks) {
    const profile = SOUND_PACK_SYNTH_PROFILES[packId];
    assert.ok(profile, `Profile missing for ${packId}`);
    assert.ok(profile.signatureSteps.length >= 10, `Pack ${packId} has full multi-bar BGM loop`);
    assert.ok(profile.signatureLoopMs >= 3000);

    const wavUri = synthesizeLoopWavDataUri('world6', packId);
    assert.ok(
      wavUri.startsWith('data:audio/wav;base64,UklGR'),
      `Expected valid RIFF WAV base64 loop for ${packId}`
    );
  }

  marioAudio.stopBgm();
  const playing = marioAudio.toggleSoundPackFullTrack('sound_galaxy_synth');
  assert.equal(marioAudio.settings.soundPack, 'sound_galaxy_synth');
  assert.equal(marioAudio.settings.musicEnabled, true);
  assert.equal(typeof playing, 'boolean');
  assert.ok(
    marioAudio.getActiveLoopDataUri()?.startsWith('data:audio/wav;base64,UklGR'),
    'Active BGM loop produces a persistent WAV data URI'
  );

  for (const modId of ['world1', 'world2', 'world3', 'world4', 'world5', 'world6', 'holidays', 'quiz', 'shop']) {
    marioAudio.syncModuleAudio(modId, false);
    assert.equal(marioAudio.activeModuleId, modId);
    assert.ok(
      marioAudio.getActiveLoopDataUri()?.startsWith('data:audio/wav;base64,UklGR'),
      `Module ${modId} updates persistent WAV loop URI`
    );
  }

  marioAudio.stopBgm();
  marioAudio.setSoundPack('sound_default', false);
});

test('Game & Quiz session decks deal 100% unique non-repeating questions across full cycles and guard cycle boundaries', () => {
  resetSessionDecks();

  // 1. Generic cycle uniqueness + boundary guard
  const samplePool = ['A', 'B', 'C', 'D', 'E', 'F'];
  for (let trial = 0; trial < 25; trial++) {
    resetSessionDecks('unit_boundary');
    const cycle1 = drawUniqueFromDeck('unit_boundary', samplePool, samplePool.length);
    const cycle2 = drawUniqueFromDeck('unit_boundary', samplePool, samplePool.length);
    assert.equal(new Set(cycle1).size, samplePool.length, 'Cycle 1 contains all unique items');
    assert.equal(new Set(cycle2).size, samplePool.length, 'Cycle 2 contains all unique items');
    assert.notEqual(
      cycle1[cycle1.length - 1],
      cycle2[0],
      'Last item of Cycle 1 never repeats immediately as first item of Cycle 2'
    );
  }

  // 2. Labor Kart 40-question non-repeating deck
  assert.equal(KART_QUESTION_BANK.length, 40);
  const seenKartIds = new Set<string>();
  for (let i = 0; i < KART_QUESTION_BANK.length; i++) {
    const q = drawKartQuestion();
    assert.ok(q.question.length > 10, 'Kart question prompt is non-empty');
    assert.equal( seenKartIds.has(q.id), false, `Duplicate Kart question drawn early at index ${i}`);
    seenKartIds.add(q.id);
  }
  assert.equal(seenKartIds.size, KART_QUESTION_BANK.length);

  // 3. World 6 Leave Clinic 18-case non-repeating deck
  assert.equal(WORLD6_LEAVE_CLINIC_BANK.length, 18);
  const seenClinicIds = new Set<string>();
  for (let i = 0; i < WORLD6_LEAVE_CLINIC_BANK.length; i++) {
    const c = drawWorld6LeaveCase();
    assert.ok(c.options.includes(c.correctLeave), 'Shuffled options retain correctLeave');
    assert.equal(seenClinicIds.has(c.id), false);
    seenClinicIds.add(c.id);
  }
  assert.equal(seenClinicIds.size, 18);

  // 4. Lakitu Cloud Climber 5-floor tiered non-repeating runs (5 consecutive runs = 25 unique questions)
  const seenClimberIds = new Set<string>();
  for (let run = 0; run < 5; run++) {
    const tower = drawClimberTowerRun();
    assert.equal(tower.length, 5);
    for (const rung of tower) {
      assert.equal(seenClimberIds.has(rung.id), false);
      seenClimberIds.add(rung.id);
    }
  }
  assert.equal(seenClimberIds.size, 25);

  // 5. Quick Test non-repeating draws across consecutive 5-question runs in World 6
  const run1 = pickQuickTestQuestions('world6', 'exam_prep', 5);
  const run2 = pickQuickTestQuestions('world6', 'exam_prep', 5);
  const run3 = pickQuickTestQuestions('world6', 'exam_prep', 5);
  const combinedQuickIds = [...run1, ...run2, ...run3].map((q) => q.id);
  assert.equal(
    new Set(combinedQuickIds).size,
    15,
    'Three consecutive 5-question Quick Tests in World 6 deal 15 distinct questions with zero repeats'
  );
});

test('Print Study Guide formatting options default to page breaks per world and support module-level page breaks', () => {
  assert.equal(DEFAULT_PRINT_FORMAT_OPTIONS.pageBreakPerWorld, true);
  assert.equal(DEFAULT_PRINT_FORMAT_OPTIONS.pageBreakPerModule, false);
  assert.equal(DEFAULT_PRINT_FORMAT_OPTIONS.includeBarTips, true);
  assert.equal(DEFAULT_PRINT_FORMAT_OPTIONS.includeLegalCitations, true);
});
