import test from 'node:test';
import assert from 'node:assert/strict';
import {
  syncDailyLoginStreak,
  STREAK_COUNT_KEY,
  STREAK_STUDY_DATE_KEY,
  LEGACY_LOGIN_DATE_KEY,
  mapActiveWorldToQuizCode,
  pickQuickTestQuestions,
  computeQuickTestSummary,
  getQuizQuestionsForDifficulty,
  filterFlashcardsForDifficulty,
  buildFlashcardExamChoices,
  adaptBossQuestionForDifficulty,
  StorageLike,
} from './studyModes';
import { FLASHCARDS_DATA } from '../data/flashcardsData';
import { BOWSER_BOSS_QUESTIONS } from '../data/quizQuestionsData';

function createMemoryStorage(initial: Record<string, string> = {}): StorageLike {
  const map = new Map<string, string>(Object.entries(initial));
  return {
    getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
    setItem: (k: string, v: string) => {
      map.set(k, v);
    },
  };
}

test('syncDailyLoginStreak initializes streak=1 in localStorage on first visit', () => {
  const storage = createMemoryStorage();
  const res = syncDailyLoginStreak(storage, new Date(2026, 9, 25, 10, 0, 0));
  assert.equal(res.streak, 1);
  assert.equal(storage.getItem(STREAK_COUNT_KEY), '1');
  assert.equal(storage.getItem(STREAK_STUDY_DATE_KEY), '2026-10-25');
  assert.equal(res.isBonusClaimedToday, false);
});

test('syncDailyLoginStreak increments streak on consecutive daily logins and preserves same-day logins', () => {
  const storage = createMemoryStorage({
    [STREAK_COUNT_KEY]: '3',
    [STREAK_STUDY_DATE_KEY]: '2026-10-24',
  });
  const day4 = syncDailyLoginStreak(storage, new Date(2026, 9, 25, 9, 30, 0));
  assert.equal(day4.streak, 4);
  assert.equal(storage.getItem(STREAK_COUNT_KEY), '4');

  // Calling again on the same day does not double-increment
  const sameDay = syncDailyLoginStreak(storage, new Date(2026, 9, 25, 21, 15, 0));
  assert.equal(sameDay.streak, 4);

  // Skipping a day resets to 1
  const skipped = syncDailyLoginStreak(storage, new Date(2026, 9, 27, 8, 0, 0));
  assert.equal(skipped.streak, 1);
  assert.equal(storage.getItem(STREAK_COUNT_KEY), '1');
});

test('syncDailyLoginStreak detects when today bonus gift is claimed via legacy date key', () => {
  const now = new Date(2026, 9, 25, 12, 0, 0);
  const storage = createMemoryStorage({
    [STREAK_COUNT_KEY]: '5',
    [STREAK_STUDY_DATE_KEY]: '2026-10-25',
    [LEGACY_LOGIN_DATE_KEY]: now.toDateString(),
  });
  const res = syncDailyLoginStreak(storage, now);
  assert.equal(res.streak, 5);
  assert.equal(res.isBonusClaimedToday, true);
});

test('pickQuickTestQuestions pulls 5 unique random questions scoped to activeWorld', () => {
  for (const world of ['world1', 'world2', 'world3', 'world4', 'world5', 'world6', 'holidays']) {
    const expectedCode = mapActiveWorldToQuizCode(world);
    const examPick = pickQuickTestQuestions(world, 'exam_prep', 5);
    assert.equal(examPick.length, 5);
    assert.equal(new Set(examPick.map((q) => q.id)).size, 5);
    examPick.forEach((q) => {
      assert.equal(q.worldCode, expectedCode);
      assert.equal(q.options.length, 4);
      assert.equal(q.difficultyMode, 'exam_prep');
    });

    const casualPick = pickQuickTestQuestions(world, 'casual', 5);
    assert.equal(casualPick.length, 5);
    assert.equal(new Set(casualPick.map((q) => q.id)).size, 5);
    casualPick.forEach((q) => {
      assert.equal(q.worldCode, expectedCode);
      assert.equal(q.options.length, 3);
      assert.equal(q.difficultyMode, 'casual');
      assert.ok(q.hint && q.hint.length > 0);
    });
  }
});

test('computeQuickTestSummary scales coins accurately with accuracy and difficulty', () => {
  const zero = computeQuickTestSummary(0, 5, 'casual');
  assert.equal(zero.accuracyPercent, 0);
  assert.equal(zero.coinsEarned, 0);

  const midCasual = computeQuickTestSummary(3, 5, 'casual');
  assert.equal(midCasual.accuracyPercent, 60);
  assert.ok(midCasual.coinsEarned > 0);

  const perfectCasual = computeQuickTestSummary(5, 5, 'casual');
  const perfectExam = computeQuickTestSummary(5, 5, 'exam_prep');
  assert.equal(perfectCasual.accuracyPercent, 100);
  assert.equal(perfectExam.accuracyPercent, 100);
  assert.ok(perfectExam.coinsEarned > perfectCasual.coinsEarned);
  assert.ok(perfectCasual.coinsEarned > midCasual.coinsEarned);
});

test('difficulty toggle adjusts both quiz questions and flashcards complexity', () => {
  const casualQuiz = getQuizQuestionsForDifficulty('casual', 'w1');
  const examQuiz = getQuizQuestionsForDifficulty('exam_prep', 'w1');
  assert.ok(casualQuiz.length >= 5);
  assert.ok(examQuiz.length >= 5);
  assert.equal(casualQuiz[0].options.length, 3);
  assert.equal(examQuiz[0].options.length, 4);

  const casualCards = filterFlashcardsForDifficulty(FLASHCARDS_DATA, 'casual', 'all');
  const examCards = filterFlashcardsForDifficulty(FLASHCARDS_DATA, 'exam_prep', 'all');
  assert.ok(casualCards.every((c) => c.difficulty !== 'Hard'));
  assert.ok(examCards.every((c) => c.difficulty !== 'Easy'));

  const mcqChoices = buildFlashcardExamChoices(examCards[0], FLASHCARDS_DATA);
  assert.equal(mcqChoices.length, 4);
  assert.equal(mcqChoices.filter((c) => c.isCorrect).length, 1);

  const bossAdapted = adaptBossQuestionForDifficulty(BOWSER_BOSS_QUESTIONS[0], 'casual');
  assert.equal(bossAdapted.options.length, 3);
  assert.equal(
    bossAdapted.options[bossAdapted.correctIndex],
    BOWSER_BOSS_QUESTIONS[0].options[BOWSER_BOSS_QUESTIONS[0].correctIndex]
  );
});
