import test from 'node:test';
import assert from 'node:assert/strict';
import {
  readStoredColorMode,
  saveStoredColorMode,
  shouldAutoOpenWalkthrough,
  markWalkthroughCompleted,
  DEFAULT_PLAYER_PROFILE_STATS,
  loadPlayerProfileStats,
  recordStudySeconds,
  recordPomodoroFocusFinish,
  recordCompletedQuizRun,
  formatStudyDuration,
  evaluateAchievements,
  WALKTHROUGH_CHAPTERS,
  getWeeklyPomodoroChartData,
} from './profileAchievements';

function createMemoryStorage(initial: Record<string, string> = {}) {
  const store = new Map<string, string>(Object.entries(initial));
  return {
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
  };
}

test('color mode reads and persists light and dark modes accurately', () => {
  const storage = createMemoryStorage();
  assert.equal(readStoredColorMode(storage), 'light');
  saveStoredColorMode('dark', storage);
  assert.equal(readStoredColorMode(storage), 'dark');
  saveStoredColorMode('light', storage);
  assert.equal(readStoredColorMode(storage), 'light');
});

test('walkthrough auto-opens on first visit, respects ?autostart=1, and stays closed once completed', () => {
  const storage = createMemoryStorage();
  assert.equal(shouldAutoOpenWalkthrough('', storage), true);
  assert.equal(shouldAutoOpenWalkthrough('?autostart=1', storage), false);

  markWalkthroughCompleted(storage);
  assert.equal(shouldAutoOpenWalkthrough('', storage), false);
});

test('10-chapter walkthrough guide has complete ordered steps', () => {
  assert.equal(WALKTHROUGH_CHAPTERS.length, 10);
  WALKTHROUGH_CHAPTERS.forEach((ch, idx) => {
    assert.equal(ch.stepNumber, idx + 1);
    assert.ok(ch.headline.length > 10);
    assert.ok(ch.highlights.length >= 3);
  });
});

test('study time formatting and accumulation unlock Studied 5 hours badge at 18000 seconds', () => {
  let stats = { ...DEFAULT_PLAYER_PROFILE_STATS };
  assert.equal(formatStudyDuration(0), '0m');
  assert.equal(formatStudyDuration(45), '45s');
  assert.equal(formatStudyDuration(1500), '25m');
  assert.equal(formatStudyDuration(3900), '1h 05m');
  assert.equal(formatStudyDuration(18000), '5h 00m');

  stats = recordStudySeconds(stats, 3600); // 1 hour
  stats = recordPomodoroFocusFinish(stats, 0);

  let eval1 = evaluateAchievements({
    stats,
    completedTopicIds: [],
    totalTopicsCount: 14,
    world1TopicIds: ['t1', 't2', 't3'],
    loginStreak: 1,
    notesCount: 0,
  });

  const oneHourBadge = eval1.achievements.find((a) => a.id === 'studied_1_hour')!;
  const fiveHourBadge = eval1.achievements.find((a) => a.id === 'studied_5_hours')!;
  const firstPomodoroBadge = eval1.achievements.find((a) => a.id === 'first_pomodoro')!;

  assert.equal(oneHourBadge.unlocked, true);
  assert.equal(firstPomodoroBadge.unlocked, true);
  assert.equal(fiveHourBadge.unlocked, false);
  assert.equal(fiveHourBadge.progressPercent, 20);

  // Add remaining 4 hours (14,400 seconds)
  stats = recordStudySeconds(eval1.updatedStats, 14400);
  const eval2 = evaluateAchievements({
    stats,
    completedTopicIds: [],
    totalTopicsCount: 14,
    world1TopicIds: ['t1', 't2', 't3'],
    loginStreak: 1,
    notesCount: 0,
  });

  const fiveHourAfter = eval2.achievements.find((a) => a.id === 'studied_5_hours')!;
  assert.equal(fiveHourAfter.unlocked, true);
  assert.equal(fiveHourAfter.progressPercent, 100);
  assert.equal(
    eval2.newlyUnlocked.some((b) => b.id === 'studied_5_hours'),
    true
  );
});

test('quiz runs track Completed 10 Quizzes and Perfect score on Wage Quiz accurately', () => {
  let stats = { ...DEFAULT_PLAYER_PROFILE_STATS };

  // Non-perfect World 3 Wage Quiz (4/5 = 80%)
  stats = recordCompletedQuizRun(stats, {
    worldCode: 'W3',
    correctCount: 4,
    totalCount: 5,
  });
  assert.equal(stats.quizzesCompleted, 1);
  assert.equal(stats.perfectWageQuizzes, 0);
  assert.equal(stats.bestWageQuizPercent, 80);

  // Perfect World 1 Quiz (5/5) should NOT unlock Wage Quiz badge
  stats = recordCompletedQuizRun(stats, {
    worldCode: 'W1',
    correctCount: 5,
    totalCount: 5,
  });
  assert.equal(stats.perfectAnyQuizzes, 1);
  assert.equal(stats.perfectWageQuizzes, 0);

  // Perfect World 3 Wage Quiz (5/5) unlocks Perfect score on Wage Quiz
  stats = recordCompletedQuizRun(stats, {
    worldCode: 'world3',
    correctCount: 5,
    totalCount: 5,
  });
  assert.equal(stats.perfectWageQuizzes, 1);
  assert.equal(stats.bestWageQuizPercent, 100);

  // Complete 7 more quizzes to reach 10 total quizzes
  for (let i = 0; i < 7; i++) {
    stats = recordCompletedQuizRun(stats, {
      worldCode: 'all',
      correctCount: 3,
      totalCount: 5,
    });
  }
  assert.equal(stats.quizzesCompleted, 10);

  const result = evaluateAchievements({
    stats,
    completedTopicIds: ['t1', 't2', 't3'],
    totalTopicsCount: 14,
    world1TopicIds: ['t1', 't2', 't3'],
    loginStreak: 3,
    notesCount: 3,
  });

  const tenQuizzes = result.achievements.find((a) => a.id === 'completed_10_quizzes')!;
  const perfectWage = result.achievements.find((a) => a.id === 'perfect_wage_quiz')!;
  const world1Master = result.achievements.find((a) => a.id === 'world_1_master')!;
  const streak3 = result.achievements.find((a) => a.id === 'streak_3_days')!;
  const noteCrafter = result.achievements.find((a) => a.id === 'note_crafter')!;

  assert.equal(tenQuizzes.unlocked, true);
  assert.equal(perfectWage.unlocked, true);
  assert.equal(world1Master.unlocked, true);
  assert.equal(streak3.unlocked, true);
  assert.equal(noteCrafter.unlocked, true);
});

test('loadPlayerProfileStats hydrates legacy pomodoro sessions cleanly', () => {
  const storage = createMemoryStorage({
    mario_pomodoro_completed_sessions_v1: '4',
    mario_walkthrough_completed_v1: 'true',
  });
  const loaded = loadPlayerProfileStats(storage);
  assert.equal(loaded.pomodoroSessionsCompleted, 4);
  assert.equal(loaded.studiedSeconds, 4 * 25 * 60);
  assert.equal(loaded.walkthroughCompleted, true);
});

test('getWeeklyPomodoroChartData returns 7 days of structured data with today flagged', () => {
  const refDate = new Date('2026-10-25T12:00:00Z');
  let stats = { ...DEFAULT_PLAYER_PROFILE_STATS };
  stats = recordPomodoroFocusFinish(stats, 25);
  stats = recordPomodoroFocusFinish(stats, 25);

  const chartData = getWeeklyPomodoroChartData(stats, refDate);
  assert.equal(chartData.length, 7);
  const todayEntry = chartData.find((d) => d.isToday);
  assert.ok(todayEntry);
  assert.equal(todayEntry.sessions, 2);
  assert.equal(todayEntry.minutes, 50);
});
