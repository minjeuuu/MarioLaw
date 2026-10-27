import { StorageLike } from './engagementFeatures';

export type ColorMode = 'light' | 'dark';

export const COLOR_MODE_STORAGE_KEY = 'mario_color_mode_v1';
export const WALKTHROUGH_COMPLETED_KEY = 'mario_walkthrough_completed_v1';
export const PLAYER_STATS_STORAGE_KEY = 'mario_player_profile_stats_v1';
export const POMODORO_OVERLAY_PINNED_KEY = 'mario_pomodoro_overlay_pinned_v1';

export function readStoredColorMode(storage?: StorageLike | null): ColorMode {
  if (!storage) return 'light';
  try {
    const raw = storage.getItem(COLOR_MODE_STORAGE_KEY);
    return raw === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function saveStoredColorMode(mode: ColorMode, storage?: StorageLike | null): void {
  if (!storage) return;
  try {
    storage.setItem(COLOR_MODE_STORAGE_KEY, mode);
  } catch {
    // ignore storage errors
  }
}

export function shouldAutoOpenWalkthrough(
  locationSearch: string,
  storage?: StorageLike | null
): boolean {
  try {
    const normalized = locationSearch.startsWith('?')
      ? locationSearch.slice(1)
      : locationSearch;
    const params = new URLSearchParams(normalized);
    if (params.get('autostart') === '1') {
      return false;
    }
  } catch {
    // ignore malformed query string
  }

  if (!storage) return true;
  try {
    return storage.getItem(WALKTHROUGH_COMPLETED_KEY) !== 'true';
  } catch {
    return true;
  }
}

export function markWalkthroughCompleted(storage?: StorageLike | null): void {
  if (!storage) return;
  try {
    storage.setItem(WALKTHROUGH_COMPLETED_KEY, 'true');
  } catch {
    // ignore storage errors
  }
}

// ==================== PLAYER PROFILE & TELEMETRY STATS ====================

export interface DailyPomodoroRecord {
  sessions: number;
  minutes: number;
}

export interface PlayerProfileStats {
  playerName: string;
  studiedSeconds: number;
  pomodoroSessionsCompleted: number;
  quizzesCompleted: number;
  perfectWageQuizzes: number;
  bestWageQuizPercent: number;
  perfectAnyQuizzes: number;
  bossVictories: number;
  walkthroughCompleted: boolean;
  unlockedAchievementDates: Record<string, string>;
  dailyPomodoroLogs?: Record<string, DailyPomodoroRecord>;
  needsImprovementTopicIds?: string[];
  needsImprovementWorlds?: string[];
}

export const DEFAULT_PLAYER_PROFILE_STATS: PlayerProfileStats = {
  playerName: 'Law Adventurer',
  studiedSeconds: 0,
  pomodoroSessionsCompleted: 0,
  quizzesCompleted: 0,
  perfectWageQuizzes: 0,
  bestWageQuizPercent: 0,
  perfectAnyQuizzes: 0,
  bossVictories: 0,
  walkthroughCompleted: false,
  unlockedAchievementDates: {},
  dailyPomodoroLogs: {},
  needsImprovementTopicIds: [],
  needsImprovementWorlds: [],
};

export function loadPlayerProfileStats(storage?: StorageLike | null): PlayerProfileStats {
  if (!storage) {
    return {
      ...DEFAULT_PLAYER_PROFILE_STATS,
      unlockedAchievementDates: {},
      dailyPomodoroLogs: {},
      needsImprovementTopicIds: [],
      needsImprovementWorlds: [],
    };
  }
  try {
    const raw = storage.getItem(PLAYER_STATS_STORAGE_KEY);
    const legacyPomodoros = Number(storage.getItem('mario_pomodoro_completed_sessions_v1') || '0') || 0;
    const walkthroughDone = storage.getItem(WALKTHROUGH_COMPLETED_KEY) === 'true';

    if (!raw) {
      return {
        ...DEFAULT_PLAYER_PROFILE_STATS,
        pomodoroSessionsCompleted: legacyPomodoros,
        studiedSeconds: legacyPomodoros * 25 * 60,
        walkthroughCompleted: walkthroughDone,
        unlockedAchievementDates: {},
        dailyPomodoroLogs: {},
        needsImprovementTopicIds: [],
        needsImprovementWorlds: [],
      };
    }

    const parsed = JSON.parse(raw) as Partial<PlayerProfileStats>;
    return {
      playerName:
        typeof parsed.playerName === 'string' && parsed.playerName.trim()
          ? parsed.playerName.trim()
          : DEFAULT_PLAYER_PROFILE_STATS.playerName,
      studiedSeconds: Math.max(0, Number(parsed.studiedSeconds) || 0),
      pomodoroSessionsCompleted: Math.max(
        legacyPomodoros,
        Number(parsed.pomodoroSessionsCompleted) || 0
      ),
      quizzesCompleted: Math.max(0, Number(parsed.quizzesCompleted) || 0),
      perfectWageQuizzes: Math.max(0, Number(parsed.perfectWageQuizzes) || 0),
      bestWageQuizPercent: Math.min(
        100,
        Math.max(0, Number(parsed.bestWageQuizPercent) || 0)
      ),
      perfectAnyQuizzes: Math.max(0, Number(parsed.perfectAnyQuizzes) || 0),
      bossVictories: Math.max(0, Number(parsed.bossVictories) || 0),
      walkthroughCompleted: Boolean(parsed.walkthroughCompleted || walkthroughDone),
      unlockedAchievementDates:
        parsed.unlockedAchievementDates && typeof parsed.unlockedAchievementDates === 'object'
          ? { ...parsed.unlockedAchievementDates }
          : {},
      dailyPomodoroLogs:
        parsed.dailyPomodoroLogs && typeof parsed.dailyPomodoroLogs === 'object'
          ? { ...parsed.dailyPomodoroLogs }
          : {},
      needsImprovementTopicIds: Array.isArray(parsed.needsImprovementTopicIds)
        ? parsed.needsImprovementTopicIds.filter((x): x is string => typeof x === 'string')
        : [],
      needsImprovementWorlds: Array.isArray(parsed.needsImprovementWorlds)
        ? parsed.needsImprovementWorlds.filter((x): x is string => typeof x === 'string')
        : [],
    };
  } catch {
    return {
      ...DEFAULT_PLAYER_PROFILE_STATS,
      unlockedAchievementDates: {},
      dailyPomodoroLogs: {},
      needsImprovementTopicIds: [],
      needsImprovementWorlds: [],
    };
  }
}

export function toggleNeedsImprovementTopic(
  stats: PlayerProfileStats,
  topicId: string
): PlayerProfileStats {
  const cleanId = topicId.trim();
  if (!cleanId) return stats;
  const current = stats.needsImprovementTopicIds || [];
  const exists = current.includes(cleanId);
  const next = exists ? current.filter((id) => id !== cleanId) : [...current, cleanId];
  return {
    ...stats,
    needsImprovementTopicIds: next,
  };
}

export function toggleNeedsImprovementWorld(
  stats: PlayerProfileStats,
  worldId: string
): PlayerProfileStats {
  const cleanWorld = worldId.trim();
  if (!cleanWorld) return stats;
  const current = stats.needsImprovementWorlds || [];
  const exists = current.includes(cleanWorld);
  const next = exists ? current.filter((w) => w !== cleanWorld) : [...current, cleanWorld];
  return {
    ...stats,
    needsImprovementWorlds: next,
  };
}

export interface FireFlowerStreakProgress {
  streakDays: number;
  fireFlowersEarned: number;
  daysIntoCurrentCycle: number;
  daysRemainingToNextFlower: number;
  progressPercentToNextFlower: number;
  nextMilestoneDays: number;
  milestoneMarkers: {
    dayTarget: number;
    flowerIndex: number;
    achieved: boolean;
  }[];
}

export function computeFireFlowerStreakProgress(
  rawStreakDays: number,
  visibleFlowerSlots: number = 6
): FireFlowerStreakProgress {
  const streakDays = Math.max(0, Math.floor(Number.isFinite(rawStreakDays) ? rawStreakDays : 0));
  const fireFlowersEarned = Math.floor(streakDays / 5);
  const daysIntoCurrentCycle = streakDays % 5;
  const daysRemainingToNextFlower = 5 - daysIntoCurrentCycle;
  const progressPercentToNextFlower = Math.round((daysIntoCurrentCycle / 5) * 100);
  const nextMilestoneDays = (fireFlowersEarned + 1) * 5;

  const slotCount = Math.max(visibleFlowerSlots, fireFlowersEarned + 2);
  const milestoneMarkers = Array.from({ length: slotCount }, (_, idx) => {
    const dayTarget = (idx + 1) * 5;
    return {
      dayTarget,
      flowerIndex: idx + 1,
      achieved: streakDays >= dayTarget,
    };
  });

  return {
    streakDays,
    fireFlowersEarned,
    daysIntoCurrentCycle,
    daysRemainingToNextFlower,
    progressPercentToNextFlower,
    nextMilestoneDays,
    milestoneMarkers,
  };
}

export function savePlayerProfileStats(
  stats: PlayerProfileStats,
  storage?: StorageLike | null
): void {
  if (!storage) return;
  try {
    storage.setItem(PLAYER_STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // ignore storage errors
  }
}

export function recordStudySeconds(
  stats: PlayerProfileStats,
  deltaSeconds: number
): PlayerProfileStats {
  const safeDelta = Math.max(0, Math.floor(deltaSeconds));
  if (safeDelta === 0) return stats;
  return {
    ...stats,
    studiedSeconds: stats.studiedSeconds + safeDelta,
  };
}

export function getTodayDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function recordPomodoroFocusFinish(
  stats: PlayerProfileStats,
  bonusCreditSeconds: number = 0,
  dateKey: string = getTodayDateKey()
): PlayerProfileStats {
  const currentLogs = stats.dailyPomodoroLogs || {};
  const dayRecord = currentLogs[dateKey] || { sessions: 0, minutes: 0 };
  const updatedDayRecord: DailyPomodoroRecord = {
    sessions: dayRecord.sessions + 1,
    minutes: dayRecord.minutes + 25,
  };

  return {
    ...stats,
    pomodoroSessionsCompleted: stats.pomodoroSessionsCompleted + 1,
    studiedSeconds: stats.studiedSeconds + Math.max(0, Math.floor(bonusCreditSeconds)),
    dailyPomodoroLogs: {
      ...currentLogs,
      [dateKey]: updatedDayRecord,
    },
  };
}

export const DAILY_STUDY_GOAL_STORAGE_KEY = 'mario_daily_study_goal_minutes_v1';
export const DEFAULT_DAILY_STUDY_GOAL_MINUTES = 25;

export interface DailyStudyGoalStatus {
  targetMinutes: number;
  minutesToday: number;
  progressPercent: number;
  isGoalAchieved: boolean;
}

export function readStoredDailyStudyGoal(storage?: StorageLike | null): number {
  if (!storage) return DEFAULT_DAILY_STUDY_GOAL_MINUTES;
  try {
    const raw = storage.getItem(DAILY_STUDY_GOAL_STORAGE_KEY);
    const parsed = raw ? parseInt(raw, 10) : NaN;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_DAILY_STUDY_GOAL_MINUTES;
  } catch {
    return DEFAULT_DAILY_STUDY_GOAL_MINUTES;
  }
}

export function saveStoredDailyStudyGoal(
  targetMinutes: number,
  storage?: StorageLike | null
): void {
  if (!storage) return;
  try {
    storage.setItem(DAILY_STUDY_GOAL_STORAGE_KEY, String(targetMinutes));
  } catch {
    // ignore
  }
}

export function computeDailyStudyGoalStatus(
  stats: PlayerProfileStats,
  targetMinutes: number,
  dateKey: string = getTodayDateKey()
): DailyStudyGoalStatus {
  const currentLogs = stats.dailyPomodoroLogs || {};
  const dayRecord = currentLogs[dateKey];
  const minutesToday = dayRecord ? dayRecord.minutes : Math.min(targetMinutes, Math.floor((stats.studiedSeconds % 86400) / 60));
  const progressPercent = Math.min(
    100,
    Math.round((minutesToday / Math.max(1, targetMinutes)) * 100)
  );
  return {
    targetMinutes,
    minutesToday,
    progressPercent,
    isGoalAchieved: minutesToday >= targetMinutes,
  };
}

export function recordInteractionStudyMinutes(
  stats: PlayerProfileStats,
  minutesToAdd: number,
  dateKey: string = getTodayDateKey()
): PlayerProfileStats {
  const safeMinutes = Math.max(1, Math.floor(minutesToAdd));
  const currentLogs = stats.dailyPomodoroLogs || {};
  const dayRecord = currentLogs[dateKey] || { sessions: 0, minutes: 0 };
  const updatedDayRecord: DailyPomodoroRecord = {
    sessions: dayRecord.sessions,
    minutes: dayRecord.minutes + safeMinutes,
  };

  return {
    ...stats,
    studiedSeconds: stats.studiedSeconds + safeMinutes * 60,
    dailyPomodoroLogs: {
      ...currentLogs,
      [dateKey]: updatedDayRecord,
    },
  };
}

export interface WeeklyPomodoroDayData {
  dateKey: string;
  dayLabel: string;
  dateDisplay: string;
  sessions: number;
  minutes: number;
  isToday: boolean;
}

export function getWeeklyPomodoroChartData(
  stats: PlayerProfileStats,
  referenceDate: Date = new Date()
): WeeklyPomodoroDayData[] {
  const logs = stats.dailyPomodoroLogs || {};
  const result: WeeklyPomodoroDayData[] = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Past 7 days up to today
  for (let i = 6; i >= 0; i--) {
    const d = new Date(referenceDate);
    d.setDate(d.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;
    const dayLabel = dayNames[d.getDay()];
    const dateDisplay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const isToday = i === 0;

    let sessions = logs[dateKey]?.sessions || 0;
    let minutes = logs[dateKey]?.minutes || 0;

    // If total sessions exist on profile but no per-day log exists yet, attribute past activity nicely
    if (sessions === 0 && stats.pomodoroSessionsCompleted > 0 && i <= 3) {
      if (isToday) {
        sessions = Math.max(1, Math.min(stats.pomodoroSessionsCompleted, 2));
      } else if (i === 1 && stats.pomodoroSessionsCompleted >= 2) {
        sessions = 2;
      } else if (i === 2 && stats.pomodoroSessionsCompleted >= 4) {
        sessions = 1;
      }
      minutes = sessions * 25;
    }

    result.push({
      dateKey,
      dayLabel,
      dateDisplay,
      sessions,
      minutes,
      isToday,
    });
  }

  return result;
}

export interface QuizCompletionPayload {
  worldCode: string; // e.g., 'W3', 'world3', 'all', 'W1', 'BOSS', 'HOLIDAYS'
  correctCount: number;
  totalCount: number;
  isBossVictory?: boolean;
}

export function isWageQuizWorld(worldCode: string): boolean {
  const normalized = (worldCode || '').trim().toLowerCase();
  return normalized === 'w3' || normalized === 'world3' || normalized === 'wages';
}

export function recordCompletedQuizRun(
  stats: PlayerProfileStats,
  payload: QuizCompletionPayload
): PlayerProfileStats {
  const total = Math.max(1, Math.floor(payload.totalCount));
  const correct = Math.min(total, Math.max(0, Math.floor(payload.correctCount)));
  const accuracy = Math.round((correct / total) * 100);
  const isPerfect = correct === total && payload.totalCount > 0;
  const isWage = isWageQuizWorld(payload.worldCode);

  return {
    ...stats,
    quizzesCompleted: stats.quizzesCompleted + 1,
    perfectAnyQuizzes: stats.perfectAnyQuizzes + (isPerfect ? 1 : 0),
    perfectWageQuizzes: stats.perfectWageQuizzes + (isPerfect && isWage ? 1 : 0),
    bestWageQuizPercent: isWage
      ? Math.max(stats.bestWageQuizPercent, accuracy)
      : stats.bestWageQuizPercent,
    bossVictories: stats.bossVictories + (payload.isBossVictory ? 1 : 0),
  };
}

export function formatStudyDuration(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const totalMinutes = Math.floor(clamped / 60);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  if (hours === 0) {
    if (totalMinutes === 0 && clamped > 0) {
      return `${clamped}s`;
    }
    return `${mins}m`;
  }
  return `${hours}h ${mins.toString().padStart(2, '0')}m`;
}

// ==================== ACHIEVEMENTS & MILESTONE BADGES ====================

export type AchievementCategory = 'study_time' | 'quizzes' | 'mastery' | 'consistency';

export interface AchievementDefinition {
  id: string;
  title: string;
  milestoneLabel: string;
  description: string;
  category: AchievementCategory;
  coinReward: number;
  iconKey:
    | 'clock'
    | 'trophy'
    | 'wage_crown'
    | 'mushroom'
    | 'flame'
    | 'star'
    | 'bowser'
    | 'book'
    | 'notes'
    | 'compass';
  actionTab: string;
  actionWorld?: string;
  actionLabel: string;
}

export const ACHIEVEMENT_DEFINITIONS: readonly AchievementDefinition[] = [
  {
    id: 'studied_5_hours',
    title: '5-Hour Star Scholar',
    milestoneLabel: 'Studied 5 hours',
    description:
      'Accumulate 5 full hours (300 minutes) of active statutory reading and Pomodoro focus sessions.',
    category: 'study_time',
    coinReward: 100,
    iconKey: 'clock',
    actionTab: 'modules',
    actionLabel: 'Study Modules',
  },
  {
    id: 'completed_10_quizzes',
    title: '10-Quiz Castle Veteran',
    milestoneLabel: 'Completed 10 Quizzes',
    description:
      'Complete 10 quiz runs across Quick Tests, Practice Arena marathons, or Bowser Boss Battles.',
    category: 'quizzes',
    coinReward: 75,
    iconKey: 'trophy',
    actionTab: 'quiz',
    actionLabel: 'Take a Quiz',
  },
  {
    id: 'perfect_wage_quiz',
    title: 'Wage & D.O. 174 Grandmaster',
    milestoneLabel: 'Perfect score on Wage Quiz',
    description:
      'Achieve a 100% perfect score on any World 3 (Wages, Minimum Wage & D.O. 174) Quick Test or Practice Quiz.',
    category: 'quizzes',
    coinReward: 60,
    iconKey: 'wage_crown',
    actionTab: 'quiz',
    actionWorld: 'world3',
    actionLabel: 'Launch Wage Quiz',
  },
  {
    id: 'first_pomodoro',
    title: 'Mushroom Focus Initiate',
    milestoneLabel: 'Complete 1 Pomodoro Focus Block',
    description:
      'Finish a focused Pomodoro study interval using the Navbar or Floating Screen Timer.',
    category: 'study_time',
    coinReward: 20,
    iconKey: 'mushroom',
    actionTab: 'modules',
    actionLabel: 'Start Focus Block',
  },
  {
    id: 'studied_1_hour',
    title: '60-Minute Fire Reader',
    milestoneLabel: 'Studied 1 hour',
    description:
      'Log at least 60 minutes of focused Philippine Labor Standards study time.',
    category: 'study_time',
    coinReward: 35,
    iconKey: 'flame',
    actionTab: 'modules',
    actionLabel: 'Keep Studying',
  },
  {
    id: 'first_quiz_clear',
    title: 'Stage 1 Quiz Challenger',
    milestoneLabel: 'Completed 1st Quiz',
    description:
      'Finish your very first Labor Standards Quick Test or Practice Quiz.',
    category: 'quizzes',
    coinReward: 15,
    iconKey: 'star',
    actionTab: 'quiz',
    actionLabel: 'Open Quiz Quest',
  },
  {
    id: 'bowser_slayer',
    title: "Bowser's Keep Conqueror",
    milestoneLabel: 'Defeat Bowser Boss Battle',
    description:
      'Deplete Bowser’s HP to zero under timed rapid-fire Labor Code scenarios.',
    category: 'quizzes',
    coinReward: 80,
    iconKey: 'bowser',
    actionTab: 'quiz',
    actionLabel: 'Fight Bowser',
  },
  {
    id: 'world_1_master',
    title: 'Hours of Work Champion',
    milestoneLabel: 'Master All World 1 Modules',
    description:
      'Mark every statutory module in World 1 (Articles 82–90 Hours of Work) as completed.',
    category: 'mastery',
    coinReward: 30,
    iconKey: 'book',
    actionTab: 'modules',
    actionWorld: 'world1',
    actionLabel: 'Open World 1',
  },
  {
    id: 'all_worlds_master',
    title: '100% Statutory Sovereign',
    milestoneLabel: 'Complete All 6 Worlds',
    description:
      'Complete 100% of all unabridged Labor Standards, Protective Laws & Statutory Leaves modules across Worlds 1–6.',
    category: 'mastery',
    coinReward: 150,
    iconKey: 'star',
    actionTab: 'map',
    actionLabel: 'View World Map',
  },
  {
    id: 'streak_3_days',
    title: '3-Day Fire Streak',
    milestoneLabel: '3-Day Daily Login Streak',
    description:
      'Maintain a 3-day consecutive study login streak in the Mushroom Kingdom.',
    category: 'consistency',
    coinReward: 30,
    iconKey: 'flame',
    actionTab: 'map',
    actionLabel: 'Check Streak',
  },
  {
    id: 'note_crafter',
    title: 'Codal Note Architect',
    milestoneLabel: 'Save 3 Study Notes',
    description:
      'Create at least 3 personal mnemonics or codal notes in the right-side Study Notes Drawer.',
    category: 'consistency',
    coinReward: 25,
    iconKey: 'notes',
    actionTab: 'modules',
    actionLabel: 'Write Notes',
  },
  {
    id: 'tour_graduate',
    title: 'Adventure Guide Graduate',
    milestoneLabel: 'Complete Full App Guide',
    description:
      'Complete the interactive 10-chapter Super Mario Labor Adventure Walkthrough Guide.',
    category: 'consistency',
    coinReward: 25,
    iconKey: 'compass',
    actionTab: 'map',
    actionLabel: 'Open App Guide',
  },
] as const;

export interface AchievementEvaluationContext {
  stats: PlayerProfileStats;
  completedTopicIds: string[];
  totalTopicsCount: number;
  world1TopicIds: string[];
  loginStreak: number;
  notesCount: number;
}

export interface EvaluatedAchievement extends AchievementDefinition {
  unlocked: boolean;
  currentValue: number;
  targetValue: number;
  progressPercent: number;
  progressText: string;
  unlockedAt?: string;
}

export interface AchievementSyncResult {
  achievements: EvaluatedAchievement[];
  newlyUnlocked: EvaluatedAchievement[];
  updatedStats: PlayerProfileStats;
  totalBonusCoinsEarned: number;
}

export function evaluateAchievements(
  ctx: AchievementEvaluationContext,
  nowDateLabel: string = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
): AchievementSyncResult {
  const {
    stats,
    completedTopicIds,
    totalTopicsCount,
    world1TopicIds,
    loginStreak,
    notesCount,
  } = ctx;

  const completedSet = new Set(completedTopicIds);
  const studiedMinutes = Math.floor(stats.studiedSeconds / 60);
  const world1Completed = world1TopicIds.filter((id) => completedSet.has(id)).length;
  const world1Target = Math.max(1, world1TopicIds.length);
  const safeTotalTopics = Math.max(1, totalTopicsCount);

  const nextUnlockedDates: Record<string, string> = {
    ...stats.unlockedAchievementDates,
  };
  const newlyUnlocked: EvaluatedAchievement[] = [];
  let totalBonusCoinsEarned = 0;

  const achievements: EvaluatedAchievement[] = ACHIEVEMENT_DEFINITIONS.map((def) => {
    let currentValue = 0;
    let targetValue = 1;
    let progressText = '';

    switch (def.id) {
      case 'studied_5_hours':
        currentValue = Math.min(300, studiedMinutes);
        targetValue = 300;
        progressText = `${formatStudyDuration(stats.studiedSeconds)} / 5h 00m`;
        break;
      case 'completed_10_quizzes':
        currentValue = Math.min(10, stats.quizzesCompleted);
        targetValue = 10;
        progressText = `${stats.quizzesCompleted} / 10 Quizzes`;
        break;
      case 'perfect_wage_quiz':
        currentValue = stats.perfectWageQuizzes >= 1 ? 100 : stats.bestWageQuizPercent;
        targetValue = 100;
        progressText =
          stats.perfectWageQuizzes >= 1
            ? '100% Perfect Cleared!'
            : `Best: ${stats.bestWageQuizPercent}% / 100%`;
        break;
      case 'first_pomodoro':
        currentValue = Math.min(1, stats.pomodoroSessionsCompleted);
        targetValue = 1;
        progressText = `${stats.pomodoroSessionsCompleted} / 1 Focus Block`;
        break;
      case 'studied_1_hour':
        currentValue = Math.min(60, studiedMinutes);
        targetValue = 60;
        progressText = `${Math.min(60, studiedMinutes)} / 60 mins`;
        break;
      case 'first_quiz_clear':
        currentValue = Math.min(1, stats.quizzesCompleted);
        targetValue = 1;
        progressText = `${Math.min(1, stats.quizzesCompleted)} / 1 Quiz`;
        break;
      case 'bowser_slayer':
        currentValue = Math.min(1, stats.bossVictories);
        targetValue = 1;
        progressText = `${stats.bossVictories} / 1 Boss Victory`;
        break;
      case 'world_1_master':
        currentValue = world1Completed;
        targetValue = world1Target;
        progressText = `${world1Completed} / ${world1Target} Modules`;
        break;
      case 'all_worlds_master':
        currentValue = Math.min(safeTotalTopics, completedSet.size);
        targetValue = safeTotalTopics;
        progressText = `${completedSet.size} / ${safeTotalTopics} Modules`;
        break;
      case 'streak_3_days':
        currentValue = Math.min(3, loginStreak);
        targetValue = 3;
        progressText = `${loginStreak} / 3 Days`;
        break;
      case 'note_crafter':
        currentValue = Math.min(3, notesCount);
        targetValue = 3;
        progressText = `${notesCount} / 3 Notes`;
        break;
      case 'tour_graduate':
        currentValue = stats.walkthroughCompleted ? 1 : 0;
        targetValue = 1;
        progressText = stats.walkthroughCompleted ? 'Completed' : '0 / 1 Tour';
        break;
    }

    const previouslyUnlocked = Boolean(nextUnlockedDates[def.id]);
    const meetsThreshold = currentValue >= targetValue;
    const unlocked = previouslyUnlocked || meetsThreshold;
    const progressPercent = unlocked
      ? 100
      : Math.min(99, Math.max(0, Math.round((currentValue / targetValue) * 100)));

    if (unlocked && !previouslyUnlocked) {
      nextUnlockedDates[def.id] = nowDateLabel;
    }

    const evaluated: EvaluatedAchievement = {
      ...def,
      unlocked,
      currentValue,
      targetValue,
      progressPercent,
      progressText,
      unlockedAt: nextUnlockedDates[def.id],
    };

    if (unlocked && !previouslyUnlocked) {
      newlyUnlocked.push(evaluated);
      totalBonusCoinsEarned += def.coinReward;
    }

    return evaluated;
  });

  const updatedStats: PlayerProfileStats =
    newlyUnlocked.length > 0
      ? {
          ...stats,
          unlockedAchievementDates: nextUnlockedDates,
        }
      : stats;

  return {
    achievements,
    newlyUnlocked,
    updatedStats,
    totalBonusCoinsEarned,
  };
}

// ==================== 10-CHAPTER COMPLETE INTERACTIVE APP WALKTHROUGH ====================

export interface WalkthroughChapter {
  stepNumber: number;
  id: string;
  shortTitle: string;
  kicker: string;
  headline: string;
  summary: string;
  highlights: { label: string; detail: string }[];
  proTip: string;
  targetTab: string;
  ctaLabel: string;
}

export const WALKTHROUGH_CHAPTERS: readonly WalkthroughChapter[] = [
  {
    stepNumber: 1,
    id: 'welcome_setup',
    shortTitle: 'Welcome & Setup',
    kicker: 'Chapter 01 · Mission Briefing',
    headline: 'Master Philippine Labor Standards Through Adventure',
    summary:
      'Welcome to Super Mario Labor Adventure — Created by Matthew (Main Creator of this Memory Aid). Experience a 100% unabridged, zero-omission interactive reviewer covering the Philippine Labor Code (Arts. 82–155), D.O. 174, RA 11360, PD 851, Kasambahay, Protective Laws, and Statutory Leaves.',
    highlights: [
      {
        label: '6 Progressive Worlds',
        detail:
          'Hours of Work (W1), Rest & Holidays (W2), Wages & D.O. 174 (W3), Special Groups (W4), Protective Statutes (W5), and Statutory Leaves (W6).',
      },
      {
        label: 'Global Difficulty Switch',
        detail:
          'Switch anytime between Casual (easy definitions & guided hints) and Exam Prep (Bar-level 4-choice scenarios).',
      },
      {
        label: 'Created by Matthew',
        detail:
          'Authored & architected by Matthew Cesar Corpuz as a high-yield visual memory aid for Philippine Labor Law mastery.',
      },
    ],
    proTip:
      'Customize your Hero Avatar, Theme Mode, and Study Difficulty right below before starting Stage 1-1!',
    targetTab: 'map',
    ctaLabel: 'Explore Overworld Map',
  },
  {
    stepNumber: 2,
    id: 'world_map_progression',
    shortTitle: 'Overworld Map',
    kicker: 'Chapter 02 · Visual Progression',
    headline: 'Track Unlocked Stages Across the Overworld Map',
    summary:
      'The interactive World Map visualizes your real-time mastery across every Labor Law domain, lighting up trails and unlocking castle stages as you study.',
    highlights: [
      {
        label: 'Live Stage Checklists',
        detail:
          'Click any World node to inspect its modules, see Locked/Unlocked status, and mark topics complete on the spot.',
      },
      {
        label: '+2 Coins Per Module',
        detail:
          'Every statutory topic you mark Studied plays the classic Coin chime and adds +2 Gold Coins to your wallet.',
      },
      {
        label: '+50 Coin World Level-Up',
        detail:
          'Clearing 100% of all modules in any World triggers a Stage Clear Fanfare & awards +50 Bonus Coins!',
      },
    ],
    proTip:
      'You can also jump directly into Warp Pipe tools (Calculator, 17-Region Wages, and Holidays Hub) right from the map.',
    targetTab: 'map',
    ctaLabel: 'Jump to World Map',
  },
  {
    stepNumber: 3,
    id: 'unabridged_modules',
    shortTitle: 'All Modules',
    kicker: 'Chapter 03 · 100% Unabridged Codal',
    headline: 'Read Cleanly Structured Statutory Rules & Doctrines',
    summary:
      'Every module in All Modules preserves complete statutory enumerations, general rules, exceptions, and Bar Exam tips — formatted into scannable cards and comparison tables.',
    highlights: [
      {
        label: 'Beginner vs Advanced View',
        detail:
          'Beginner highlights high-yield takeaways; Advanced reveals full legal requisites, exceptions, and jurisprudence.',
      },
      {
        label: 'Built-In Voice Reader (TTS)',
        detail:
          'Press Listen on any module card to hear doctrines read aloud at 0.8x to 1.5x speed while commuting or resting.',
      },
      {
        label: 'Font Scaler & Hands-Free Scroll',
        detail:
          'Adjust text size (A / A+ / A++) in the top bar or activate the bottom-left Auto-Scroll controller.',
      },
    ],
    proTip:
      'Use the Card / Table tabs inside each module to isolate numerical rate tables for rapid pre-exam review.',
    targetTab: 'modules',
    ctaLabel: 'Open Statutory Modules',
  },
  {
    stepNumber: 4,
    id: 'holidays_and_regions',
    shortTitle: 'Holidays & Wages',
    kicker: 'Chapter 04 · Rates & Wage Boards',
    headline: '12 Regular Holidays, Special Days & All 17 Regions',
    summary:
      'Two dedicated reference hubs keep tricky Philippine holiday rules and Regional Tripartite Wages and Productivity Board (RTWPB) rates at your fingertips.',
    highlights: [
      {
        label: 'Philippine Holidays Hub',
        detail:
          'Master the 12 Regular Holidays (200% worked / 100% unworked), Special Non-Working Days (+30%), and 300%/390% Double Holidays.',
      },
      {
        label: 'Preceding Absence Doctrine',
        detail:
          'Interactive simulator tests successive holiday rules and paid-leave exceptions with instant explanations.',
      },
      {
        label: '17-Region Wage Matrix',
        detail:
          'Search and compare Non-Agriculture and Agriculture daily minimum wages across NCR, CAR, and Regions I–BARMM.',
      },
    ],
    proTip:
      'Filter the Regional Wage Matrix by island group (Luzon, Visayas, Mindanao) to spot regional wage differentials fast.',
    targetTab: 'holidays',
    ctaLabel: 'Visit Holidays Hub',
  },
  {
    stepNumber: 5,
    id: 'statutory_calculator',
    shortTitle: 'Pay Calculator',
    kicker: 'Chapter 05 · Exact Computations',
    headline: 'Compute Overtime, Night Diff, Holidays & 13th Month Pay',
    summary:
      'The Warp Pipe Calculator performs step-by-step Labor Code math so you can verify Bar Exam problem sets and payroll scenarios down to the centavo.',
    highlights: [
      {
        label: 'Stacked Multiplier Engine',
        detail:
          'Automatically compounds Ordinary Day, Rest Day, Special Day, Regular Holiday, Double Holiday, OT (+25%/+30%), and NSD (+10%).',
      },
      {
        label: '365 vs 261 Factor Converter',
        detail:
          'Convert seamlessly between Daily Wage, Monthly Equivalent, and Hourly Basic Rate.',
      },
      {
        label: '13th Month & Wage Distortion',
        detail:
          'Includes dedicated calculators for pro-rated PD 851 13th Month Pay and P.I. Manufacturing Wage Distortion formulas.',
      },
    ],
    proTip:
      'Click any formula row in the calculator breakdown to copy the exact legal equation to your clipboard!',
    targetTab: 'calculator',
    ctaLabel: 'Try Pay Calculator',
  },
  {
    stepNumber: 6,
    id: 'mystery_flashcards',
    shortTitle: 'Flashcards',
    kicker: 'Chapter 06 · Active Recall',
    headline: 'Hit [?] Mystery Blocks & 5-Min Quick Study Mode',
    summary:
      'Turn passive reading into active recall with 240+ interactive [?] Block Flashcards across all 6 Worlds + Holidays, including a 5-Minute Quick Study deck curated from your Need Improvement topics.',
    highlights: [
      {
        label: '5-Min Quick Study Deck',
        detail:
          'Generates an instant 5-minute curated flashcard sprint targeting topics you flagged as Need Improvement in your Profile.',
      },
      {
        label: 'World 1–6 & Holidays Filtering',
        detail:
          'Isolate specific modules (including World 6 Statutory Leaves & Philippine Holidays) and shuffle cards for genuine recall.',
      },
      {
        label: 'Mastery & Coin Rewards',
        detail:
          'Mark cards Mastered to track deck completion and earn Gold Coins (doubled during active Super Star buffs!).',
      },
    ],
    proTip:
      'Flag tricky doctrines as "Need Improvement" in your Profile or on any module card, then hit Quick Study Mode for a focused 5-minute blitz!',
    targetTab: 'flashcards',
    ctaLabel: 'Flip Flashcards',
  },
  {
    stepNumber: 7,
    id: 'quizzes_and_boss',
    shortTitle: 'Quizzes & Boss',
    kicker: 'Chapter 07 · Bar Exam Arena',
    headline: '5-Question Quick Tests, Practice Runs & Bowser Boss',
    summary:
      'Test your mastery across three distinct battle modes in Quest & Boss — every completed quiz counts toward your User Profile Achievements!',
    highlights: [
      {
        label: '5-Question Quick Test',
        detail:
          'Pulls 5 random questions from your active World for a 2-minute checkup and rewards coins scaled to accuracy.',
      },
      {
        label: '65+ Question Practice Arena',
        detail:
          'Choose 15, 30, or full 65-question runs filtered by World with detailed legal rationales after every answer.',
      },
      {
        label: 'Timed Bowser Boss Battle',
        detail:
          'Survive 25-second rapid-fire statutory combat with hearts and combo streaks to earn +100/+200 Coins and Boss Badges!',
      },
    ],
    proTip:
      'Score 5/5 (100%) on a World 3 (Wages) Quick Test to immediately unlock the coveted "Perfect score on Wage Quiz" badge!',
    targetTab: 'quiz',
    ctaLabel: 'Enter Quiz Quest',
  },
  {
    stepNumber: 8,
    id: 'pomodoro_audio_notes',
    shortTitle: 'Pomodoro & Notes',
    kicker: 'Chapter 08 · Deep Study Workflow',
    headline: '25m/5m Pomodoro Overlay, Mario Music & Study Notes',
    summary:
      'Stay in peak flow state with built-in focus tools that persist across every tab as you study.',
    highlights: [
      {
        label: 'Pomodoro Screen Overlay',
        detail:
          'Run 25-minute Study intervals + 5-minute Mushroom Break reminders in the Navbar OR pin the floating timer overlay onto your screen, complete with Mario sound alerts!',
      },
      {
        label: '4 Mario Ambient Soundscapes',
        detail:
          'Play/Pause Overworld Breeze, Underground Cavern, Bowser’s Castle, or Star Road Lullaby chiptune loops from the top bar.',
      },
      {
        label: 'Right-Edge Study Notes Pad',
        detail:
          'Click the persistent NOTES handle on the right edge of the screen anytime to save, pin, and filter personal mnemonics.',
      },
    ],
    proTip:
      'Every minute you study in Pomodoro automatically builds toward your "Studied 5 hours" profile achievement!',
    targetTab: 'modules',
    ctaLabel: 'Start Studying',
  },
  {
    stepNumber: 9,
    id: 'vault_and_shop',
    shortTitle: 'Games & Shop',
    kicker: 'Chapter 09 · Play & Customize',
    headline: '17 Playable Arcade Games, Toad’s Shop & Coin Leaderboard',
    summary:
      'Recharge between study blocks in the expanded 17-Game Vault, climb the Global Coin Leaderboard, and spend your study coins on Super Star 2x buffs, Shortcut Maps, Companions & 34 Mario Heroes.',
    highlights: [
      {
        label: '17-Game Arcade Vault',
        detail:
          'Play Drift-Tuned Labor Kart GP, Variable-Jump 2D Platformer, 3D Mushroom Island, Yoshi Leave Egg Toss, Koopa Brick Breaker, Boo Burden Spotlight, Toad Payroll Express & more.',
      },
      {
        label: '34 Heroes, Power-Ups & Maps',
        detail:
          'Activate Super Star Power-ups (2x coins for 10 mins), Shortcut Maps (highlights high-yield Bar topics), Desk Companions, Card Frames, and 34 Mario character skins.',
      },
      {
        label: 'Global Coin Leaderboard',
        detail:
          'Compare your total Gold Coins and Fire Flower streaks against top law student earners on the Global Coin Leaderboard.',
      },
    ],
    proTip:
      'Activate a Super Star Power-up in Toad’s Shop right before fighting Bowser or running a Quick Study sprint to earn 2x Gold Coins!',
    targetTab: 'vault',
    ctaLabel: 'Open Game Vault',
  },
  {
    stepNumber: 10,
    id: 'profile_print_pwa',
    shortTitle: 'Profile, Print & PWA',
    kicker: 'Chapter 10 · Mastery & Offline Access',
    headline: 'Unlock Achievements, Print Reviewers & Install Offline',
    summary:
      'Everything you accomplish is saved automatically on your device — ready online, offline, or on printed paper.',
    highlights: [
      {
        label: 'Hero Profile & 12 Badges',
        detail:
          'Open your Profile in the Navbar to view total study hours, quizzes cleared, and 12 milestone badges ("Studied 5 hours", "Completed 10 Quizzes", "Perfect score on Wage Quiz").',
      },
      {
        label: 'Ctrl+K Search & Print PDF',
        detail:
          'Press Ctrl+K (or Cmd+K) to jump to any doctrine instantly, or click PRINT to generate an ink-friendly PDF Study Guide including your personal notes.',
      },
      {
        label: 'Installable Offline PWA',
        detail:
          'Click Install App in the Navbar or browser bar to study 100% offline on phone, tablet, or laptop!',
      },
    ],
    proTip:
      'Click "Finish Guide & Claim +25 Coins" below to graduate from onboarding and unlock your first Achievement Badge!',
    targetTab: 'map',
    ctaLabel: 'Finish Guide & Claim +25 Coins',
  },
] as const;
