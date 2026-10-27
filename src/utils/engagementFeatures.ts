import { LawTopic } from '../types/laborLaw';

export type MarioSoundscapeId = 'overworld' | 'underground' | 'castle' | 'star_road';

export interface SoundscapeMeta {
  id: MarioSoundscapeId;
  name: string;
  shortName: string;
  subtitle: string;
  bpmLabel: string;
  accentClass: string;
}

export const MARIO_SOUNDSCAPES: SoundscapeMeta[] = [
  {
    id: 'overworld',
    name: 'Overworld Breeze',
    shortName: 'Overworld',
    subtitle: 'Upbeat Mushroom Kingdom study groove',
    bpmLabel: '124 BPM • Major',
    accentClass: 'bg-emerald-500 text-slate-950',
  },
  {
    id: 'underground',
    name: 'Underground Cavern',
    shortName: 'Underground',
    subtitle: 'Deep bassline focus loop for statutory reading',
    bpmLabel: '108 BPM • Bass',
    accentClass: 'bg-cyan-400 text-slate-950',
  },
  {
    id: 'castle',
    name: "Bowser's Castle",
    shortName: 'Castle',
    subtitle: 'Intense dramatic tension for Exam Prep & Boss runs',
    bpmLabel: '132 BPM • Minor',
    accentClass: 'bg-rose-500 text-white',
  },
  {
    id: 'star_road',
    name: 'Star Road Lullaby',
    shortName: 'Star Road',
    subtitle: 'Calm celestial arpeggios for long memorization blocks',
    bpmLabel: '92 BPM • Ambient',
    accentClass: 'bg-amber-400 text-slate-950',
  },
];

export const GROUP_MEMBERS: readonly string[] = [
  'CORPUZ, MATTHEW CESAR',
  'CRUZ, MARY LOUISE',
  'FANGED, TRACY FAE',
  'FERNANDEZ, JELYN',
  'GARCIA, AERON STEVEN',
  'GARVIDA, MHELBOURNE',
  'MAÑALAC, ABIGAIL',
  'UNTALAN, BEYONCE HELEIN',
  'VILA, HANNAH DANIELA',
] as const;

// ==================== STUDY NOTES (PERSISTENT RIGHT DRAWER) ====================

export const STUDY_NOTES_STORAGE_KEY = 'mario_labor_study_notes_v1';

export interface StudyNoteItem {
  id: string;
  title: string;
  content: string;
  worldTag: string; // e.g., 'all', 'world1'..'world5', 'holidays', 'wages_matrix'
  pinned: boolean;
  updatedAt: string;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function loadStudyNotes(storage?: StorageLike | null): StudyNoteItem[] {
  if (!storage) return [];
  try {
    const raw = storage.getItem(STUDY_NOTES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is StudyNoteItem =>
        Boolean(item) &&
        typeof item.id === 'string' &&
        typeof item.content === 'string'
    );
  } catch {
    return [];
  }
}

export function saveStudyNotes(
  notes: StudyNoteItem[],
  storage?: StorageLike | null
): void {
  if (!storage) return;
  try {
    storage.setItem(STUDY_NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // ignore storage quota errors
  }
}

export function createStudyNote(
  notes: StudyNoteItem[],
  input: { title?: string; content: string; worldTag?: string },
  nowIso: string = new Date().toISOString()
): StudyNoteItem[] {
  const trimmedContent = input.content.trim();
  if (!trimmedContent) return notes;
  const trimmedTitle = (input.title || '').trim() || deriveNoteTitle(trimmedContent);
  const newItem: StudyNoteItem = {
    id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: trimmedTitle,
    content: trimmedContent,
    worldTag: input.worldTag || 'all',
    pinned: false,
    updatedAt: nowIso,
  };
  return sortStudyNotes([newItem, ...notes]);
}

export function updateStudyNote(
  notes: StudyNoteItem[],
  id: string,
  patch: Partial<Pick<StudyNoteItem, 'title' | 'content' | 'worldTag' | 'pinned'>>,
  nowIso: string = new Date().toISOString()
): StudyNoteItem[] {
  const updated = notes.map((n) => {
    if (n.id !== id) return n;
    const nextContent =
      patch.content !== undefined ? patch.content.trim() : n.content;
    if (!nextContent) return n;
    const nextTitle =
      patch.title !== undefined
        ? patch.title.trim() || deriveNoteTitle(nextContent)
        : n.title;
    return {
      ...n,
      ...patch,
      title: nextTitle,
      content: nextContent,
      updatedAt: nowIso,
    };
  });
  return sortStudyNotes(updated);
}

export function deleteStudyNote(
  notes: StudyNoteItem[],
  id: string
): StudyNoteItem[] {
  return notes.filter((n) => n.id !== id);
}

export function filterStudyNotes(
  notes: StudyNoteItem[],
  worldFilter: string,
  query: string
): StudyNoteItem[] {
  const q = query.trim().toLowerCase();
  return sortStudyNotes(
    notes.filter((n) => {
      const worldMatches =
        worldFilter === 'all' || n.worldTag === worldFilter;
      if (!worldMatches) return false;
      if (!q) return true;
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.worldTag.toLowerCase().includes(q)
      );
    })
  );
}

function deriveNoteTitle(content: string): string {
  const firstLine = content.split('\n')[0].trim();
  return firstLine.length > 44 ? `${firstLine.slice(0, 41)}...` : firstLine;
}

function sortStudyNotes(notes: StudyNoteItem[]): StudyNoteItem[] {
  return [...notes].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.updatedAt.localeCompare(a.updatedAt);
  });
}

// ==================== WORLD PROGRESS & LEVEL-UP CELEBRATION ====================

export const CLAIMED_WORLD_LEVELUPS_KEY = 'mario_claimed_world_levelups_v1';
export const WORLD_LEVELUP_BONUS_COINS = 50;

export interface TopicUnlockStatus {
  id: string;
  title: string;
  badge: string;
  isCompleted: boolean;
  isUnlocked: boolean;
  stageOrder: number;
}

export interface WorldProgressSnapshot {
  worldId: string;
  completedCount: number;
  totalCount: number;
  percent: number;
  isWorldCleared: boolean;
  isWorldUnlocked: boolean;
  topics: TopicUnlockStatus[];
}

export const ORDERED_STUDY_WORLDS = [
  'world1',
  'world2',
  'world3',
  'world4',
  'world5',
  'world6',
] as const;

export const MAIN_CREATOR_AUTHOR = {
  shortBadge: 'Created by Matthew',
  fullCredit: 'Created by Matthew (Matthew Cesar Corpuz) — Main Creator of this Memory Aid',
  memberListing: 'CORPUZ, MATTHEW CESAR',
} as const;

export function computeWorldProgressMap(
  allTopics: Pick<LawTopic, 'id' | 'worldId' | 'title' | 'badge'>[],
  completedTopicIds: string[]
): Record<string, WorldProgressSnapshot> {
  const completedSet = new Set(completedTopicIds);
  const result: Record<string, WorldProgressSnapshot> = {};

  ORDERED_STUDY_WORLDS.forEach((worldId, worldIndex) => {
    const worldTopics = allTopics.filter((t) => t.worldId === worldId);
    const totalCount = worldTopics.length;
    const completedCount = worldTopics.filter((t) => completedSet.has(t.id)).length;
    const percent =
      totalCount > 0 ? Math.min(100, Math.round((completedCount / totalCount) * 100)) : 0;
    const isWorldCleared = totalCount > 0 && completedCount === totalCount;

    const prevWorldId = worldIndex > 0 ? ORDERED_STUDY_WORLDS[worldIndex - 1] : null;
    const prevProgress = prevWorldId ? result[prevWorldId] : null;
    const isWorldUnlocked =
      worldIndex === 0 ||
      completedCount > 0 ||
      Boolean(prevProgress && prevProgress.completedCount > 0);

    const topics: TopicUnlockStatus[] = worldTopics.map((topic, idx) => {
      const isCompleted = completedSet.has(topic.id);
      const prevTopicCompleted = idx === 0 ? true : completedSet.has(worldTopics[idx - 1].id);
      const isUnlocked = isCompleted || (idx === 0 && isWorldUnlocked) || prevTopicCompleted;
      return {
        id: topic.id,
        title: topic.title,
        badge: topic.badge,
        isCompleted,
        isUnlocked,
        stageOrder: idx + 1,
      };
    });

    result[worldId] = {
      worldId,
      completedCount,
      totalCount,
      percent,
      isWorldCleared,
      isWorldUnlocked,
      topics,
    };
  });

  return result;
}

export interface WorldLevelUpCheckResult {
  triggered: boolean;
  worldId: string | null;
  bonusCoins: number;
  updatedClaimedWorlds: string[];
}

export function evaluateWorldLevelUp(params: {
  toggledTopicId: string;
  previousCompletedIds: string[];
  nextCompletedIds: string[];
  allTopics: Pick<LawTopic, 'id' | 'worldId'>[];
  claimedWorldIds: string[];
}): WorldLevelUpCheckResult {
  const {
    toggledTopicId,
    previousCompletedIds,
    nextCompletedIds,
    allTopics,
    claimedWorldIds,
  } = params;

  const topic = allTopics.find((t) => t.id === toggledTopicId);
  if (!topic) {
    return {
      triggered: false,
      worldId: null,
      bonusCoins: 0,
      updatedClaimedWorlds: claimedWorldIds,
    };
  }

  const worldTopics = allTopics.filter((t) => t.worldId === topic.worldId);
  if (worldTopics.length === 0) {
    return {
      triggered: false,
      worldId: null,
      bonusCoins: 0,
      updatedClaimedWorlds: claimedWorldIds,
    };
  }

  const prevSet = new Set(previousCompletedIds);
  const nextSet = new Set(nextCompletedIds);

  const wasClearedBefore = worldTopics.every((t) => prevSet.has(t.id));
  const isClearedNow = worldTopics.every((t) => nextSet.has(t.id));

  if (!wasClearedBefore && isClearedNow) {
    const alreadyClaimed = claimedWorldIds.includes(topic.worldId);
    const bonusCoins = alreadyClaimed ? 15 : WORLD_LEVELUP_BONUS_COINS;
    const updatedClaimedWorlds = alreadyClaimed
      ? claimedWorldIds
      : [...claimedWorldIds, topic.worldId];

    return {
      triggered: true,
      worldId: topic.worldId,
      bonusCoins,
      updatedClaimedWorlds,
    };
  }

  return {
    triggered: false,
    worldId: null,
    bonusCoins: 0,
    updatedClaimedWorlds: claimedWorldIds,
  };
}

// ==================== SUPER STAR POWER-UP (2X COINS FOR 10 MINUTES) ====================

export const SUPER_STAR_EXPIRY_STORAGE_KEY = 'mario_super_star_expiry_ms_v1';
export const SUPER_STAR_DEFAULT_DURATION_MS = 10 * 60 * 1000; // 10 minutes

export function activateSuperStarBuff(
  currentExpiryMs: number,
  nowMs: number = Date.now(),
  durationMs: number = SUPER_STAR_DEFAULT_DURATION_MS
): number {
  const base = Math.max(nowMs, Number.isFinite(currentExpiryMs) ? currentExpiryMs : 0);
  return base + Math.max(1000, durationMs);
}

export function getSuperStarBuffStatus(
  expiryMs: number,
  nowMs: number = Date.now()
): {
  isActive: boolean;
  remainingSeconds: number;
  formattedRemaining: string;
} {
  if (!Number.isFinite(expiryMs) || expiryMs <= nowMs) {
    return { isActive: false, remainingSeconds: 0, formattedRemaining: '00:00' };
  }
  const remainingSeconds = Math.ceil((expiryMs - nowMs) / 1000);
  return {
    isActive: true,
    remainingSeconds,
    formattedRemaining: formatPomodoroSeconds(remainingSeconds),
  };
}

export function computeEffectiveCoinReward(
  baseCoins: number,
  options: { isSuperStarActive: boolean; hasMushroomCoinCharm?: boolean }
): number {
  const safeBase = Math.max(0, Math.round(baseCoins));
  if (safeBase === 0) return 0;
  const starMultiplier = options.isSuperStarActive ? 2 : 1;
  const charmBonus = options.hasMushroomCoinCharm ? 1 : 0;
  return safeBase * starMultiplier + charmBonus * starMultiplier;
}

// ==================== SHORTCUT MAPS (HIGH-YIELD BAR TOPIC HIGHLIGHTS) ====================

export const SHORTCUT_MAP_ACTIVE_STORAGE_KEY = 'mario_shortcut_map_active_v1';

export interface ShortcutTopicIntel {
  topicId: string;
  worldId: string;
  priorityLabel: string;
  barShortcutNote: string;
}

export const SHORTCUT_MAP_HIGHLIGHTS: Record<string, ShortcutTopicIntel> = {
  'm1-coverage': {
    topicId: 'm1-coverage',
    worldId: 'world1',
    priorityLabel: 'WARP SHORTCUT • ART. 82',
    barShortcutNote: 'Focus on Field Personnel ("actual hours cannot be determined with reasonable certainty") vs Supervised Piece-Rate Workers!',
  },
  'm1-hours-worked': {
    topicId: 'm1-hours-worked',
    worldId: 'world1',
    priorityLabel: 'WARP SHORTCUT • ART. 84',
    barShortcutNote: '20-Minute Brownout Rule + Rest breaks of 5–20 mins = Compensable! Waiting time when engaged to wait = Compensable!',
  },
  'm1-fwa-cww-meals-ot': {
    topicId: 'm1-fwa-cww-meals-ot',
    worldId: 'world1',
    priorityLabel: 'WARP SHORTCUT • ART. 87–88',
    barShortcutNote: 'Undertime on Monday can NEVER be offset by Overtime on Tuesday (Art. 88)! Ordinary OT = +25%; Rest/Holiday OT = +30%.',
  },
  'm2-holiday-pay': {
    topicId: 'm2-holiday-pay',
    worldId: 'world2',
    priorityLabel: 'WARP SHORTCUT • ART. 94',
    barShortcutNote: 'Master the Successive Regular Holidays rule (Maundy Thursday & Good Friday) and Double Regular Holiday + Rest Day = 390%!',
  },
  'm2-13th-month': {
    topicId: 'm2-13th-month',
    worldId: 'world2',
    priorityLabel: 'WARP SHORTCUT • R.A. 11360 & P.D. 851',
    barShortcutNote: '100% of service charges go to rank-and-file/non-managerial workers; 13th Month Pay = Total Basic Salary Earned / 12 on or before Dec 24!',
  },
  'm3-wage-principles': {
    topicId: 'm3-wage-principles',
    worldId: 'world3',
    priorityLabel: 'WARP SHORTCUT • FACILITIES VS SUPPLEMENTS',
    barShortcutNote: 'Purpose Test (Mabeza): Benefit of employee + voluntary written acceptance + fair value = Deductible Facility; Employer benefit = Non-deductible Supplement!',
  },
  'm3-payment-contracting-distortion': {
    topicId: 'm3-payment-contracting-distortion',
    worldId: 'world3',
    priorityLabel: 'WARP SHORTCUT • D.O. 174-17',
    barShortcutNote: '₱5,000,000 paid-up capital/net worth + control over means & methods = Legitimate Job Contracting; Labor-Only = Principal becomes direct employer!',
  },
  'm4-minors-kasambahay-homework': {
    topicId: 'm4-minors-kasambahay-homework',
    worldId: 'world4',
    priorityLabel: 'WARP SHORTCUT • R.A. 10361 KASAMBAHAY',
    barShortcutNote: 'Kasambahay SIL (5 days after 1 yr) is NON-cumulative & NON-convertible to cash! Wage < ₱5,000 = Employer pays 100% SSS/PhilHealth/Pag-IBIG.',
  },
  'm5-harassment-safe-spaces': {
    topicId: 'm5-harassment-safe-spaces',
    worldId: 'world5',
    priorityLabel: 'WARP SHORTCUT • R.A. 11313 SAFE SPACES',
    barShortcutNote: 'Safe Spaces Act penalizes peer-to-peer and subordinate-to-superior workplace harassment (no moral ascendancy needed)!',
  },
  'm6-service-incentive-leave': {
    topicId: 'm6-service-incentive-leave',
    worldId: 'world6',
    priorityLabel: 'WARP SHORTCUT • ART. 95 SIL',
    barShortcutNote: '5 days paid SIL after 1 year; commutable to cash; Auto Bus: 3-year prescription runs from demand/refusal or separation!',
  },
  'm6-maternity-leave': {
    topicId: 'm6-maternity-leave',
    worldId: 'world6',
    priorityLabel: 'WARP SHORTCUT • R.A. 11210',
    barShortcutNote: '105 days live birth (+15 solo parent = 120d) | 60 days miscarriage | Up to 7 days transferable to father (married or unmarried)!',
  },
  'm6-paternity-leave': {
    topicId: 'm6-paternity-leave',
    worldId: 'world6',
    priorityLabel: 'WARP SHORTCUT • R.A. 8187',
    barShortcutNote: '7 calendar days full pay for married male employee cohabiting with legitimate spouse for the first 4 deliveries/miscarriages!',
  },
  'm6-solo-parents-leave': {
    topicId: 'm6-solo-parents-leave',
    worldId: 'world6',
    priorityLabel: 'WARP SHORTCUT • R.A. 11861',
    barShortcutNote: '7 working days forfeitable parental leave after just 6 months service; dependent child age cap raised to <= 22 years old!',
  },
  'm6-gynecological-leave': {
    topicId: 'm6-gynecological-leave',
    worldId: 'world6',
    priorityLabel: 'WARP SHORTCUT • R.A. 9710',
    barShortcutNote: 'Up to 2 months special leave with full pay after gynecological surgery with 6 months aggregate employment in last 12 months!',
  },
  'm6-vawc-leave': {
    topicId: 'm6-vawc-leave',
    worldId: 'world6',
    priorityLabel: 'WARP SHORTCUT • R.A. 9262',
    barShortcutNote: 'Up to 10 paid days leave for women/children VAWC victims upon presenting a Barangay/Court Protection Order certification!',
  },
};

export function isShortcutKeyTopic(topicId: string, topicIndexInWorld?: number): boolean {
  if (SHORTCUT_MAP_HIGHLIGHTS[topicId]) return true;
  return topicIndexInWorld === 0 || topicIndexInWorld === 1;
}

// ==================== PRINT STUDY GUIDE FORMATTING HELPERS ====================

export interface PrintGuideFormatOptions {
  compactLayout: boolean;
  includeBarTips: boolean;
  includeLegalCitations: boolean;
  hideCompletedTopics: boolean;
  fontStyle: 'editorial_serif' | 'modern_sans';
  colorAccent: 'executive_navy' | 'ink_saver_bw';
  pageBreakPerWorld: boolean;
  pageBreakPerModule: boolean;
}

export const DEFAULT_PRINT_FORMAT_OPTIONS: PrintGuideFormatOptions = {
  compactLayout: false,
  includeBarTips: true,
  includeLegalCitations: true,
  hideCompletedTopics: false,
  fontStyle: 'editorial_serif',
  colorAccent: 'executive_navy',
  pageBreakPerWorld: true,
  pageBreakPerModule: false,
};

export function filterTopicsForPrintGuide<T extends Pick<LawTopic, 'id' | 'worldId'>>(
  topics: T[],
  selectedWorlds: string[],
  completedTopicIds: string[],
  hideCompletedTopics: boolean
): T[] {
  const selectedSet = new Set(selectedWorlds);
  const completedSet = new Set(completedTopicIds);
  return topics.filter((t) => {
    if (!selectedSet.has(t.worldId)) return false;
    if (hideCompletedTopics && completedSet.has(t.id)) return false;
    return true;
  });
}

// ==================== POMODORO TIMER HELPERS ====================

export type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak' | 'sprint';

export const POMODORO_PRESETS: Record<
  PomodoroMode,
  { label: string; shortLabel: string; minutes: number; coinReward: number }
> = {
  focus: { label: '25m Deep Study', shortLabel: '25m Focus', minutes: 25, coinReward: 15 },
  sprint: { label: '15m Quick Sprint', shortLabel: '15m Sprint', minutes: 15, coinReward: 10 },
  shortBreak: { label: '5m Mushroom Break', shortLabel: '5m Break', minutes: 5, coinReward: 0 },
  longBreak: { label: '15m Warp Rest', shortLabel: '15m Rest', minutes: 15, coinReward: 0 },
};

export function formatPomodoroSeconds(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getNextPomodoroModeAfterCompletion(
  completedMode: PomodoroMode,
  completedFocusSessionsCount: number
): PomodoroMode {
  if (completedMode === 'focus' || completedMode === 'sprint') {
    return completedFocusSessionsCount > 0 && completedFocusSessionsCount % 4 === 0
      ? 'longBreak'
      : 'shortBreak';
  }
  return 'focus';
}

export function getAutoScrollMobilePosition(pomodoroState: {
  active: boolean;
  hasNotice: boolean;
  isExpanded: boolean;
}): {
  hidden: boolean;
  bottomClass: string;
} {
  if (pomodoroState.isExpanded) {
    return { hidden: true, bottomClass: 'hidden' };
  }
  if (pomodoroState.active) {
    return {
      hidden: false,
      bottomClass: pomodoroState.hasNotice ? 'bottom-[18rem]' : 'bottom-[11rem]',
    };
  }
  return {
    hidden: false,
    bottomClass: 'bottom-20',
  };
}

// ==================== GLOBAL COIN LEADERBOARD ====================

export const GLOBAL_LEADERBOARD_PEERS_STORAGE_KEY = 'mario_global_coin_leaderboard_peers_v1';

export interface CoinLeaderboardEntry {
  id: string;
  studentName: string;
  schoolOrSection: string;
  avatar: string;
  totalCoins: number;
  streakDays: number;
  modulesCompleted: number;
  favoriteWorld: string;
  isCurrentUser?: boolean;
  isCreator?: boolean;
  rank?: number;
}

export const DEFAULT_STUDENT_LEADERBOARD_COHORT: readonly Omit<
  CoinLeaderboardEntry,
  'rank' | 'isCurrentUser'
>[] = [
  {
    id: 'peer-matthew',
    studentName: 'Matthew Cesar Corpuz',
    schoolOrSection: 'Main Creator • Labor Law Memory Aid',
    avatar: 'goldmario',
    totalCoins: 1480,
    streakDays: 25,
    modulesCompleted: 28,
    favoriteWorld: 'World 6 • Statutory Leaves',
    isCreator: true,
  },
  {
    id: 'peer-mary-louise',
    studentName: 'Mary Louise Cruz',
    schoolOrSection: 'Labor Standards Cohort • Block A',
    avatar: 'rosalina',
    totalCoins: 1120,
    streakDays: 18,
    modulesCompleted: 26,
    favoriteWorld: 'World 3 • Wages & D.O. 174',
  },
  {
    id: 'peer-tracy',
    studentName: 'Tracy Fae Fanged',
    schoolOrSection: 'Labor Standards Cohort • Block A',
    avatar: 'peach',
    totalCoins: 985,
    streakDays: 15,
    modulesCompleted: 24,
    favoriteWorld: 'World 2 • Rest & 13th Month',
  },
  {
    id: 'peer-jelyn',
    studentName: 'Jelyn Fernandez',
    schoolOrSection: 'Labor Standards Cohort • Block A',
    avatar: 'daisy',
    totalCoins: 890,
    streakDays: 14,
    modulesCompleted: 22,
    favoriteWorld: 'World 5 • Protective Laws',
  },
  {
    id: 'peer-aeron',
    studentName: 'Aeron Steven Garcia',
    schoolOrSection: 'Labor Standards Cohort • Block A',
    avatar: 'luigi',
    totalCoins: 810,
    streakDays: 11,
    modulesCompleted: 21,
    favoriteWorld: 'World 1 • Hours of Work',
  },
  {
    id: 'peer-mhelbourne',
    studentName: 'Mhelbourne Garvida',
    schoolOrSection: 'Labor Standards Cohort • Block A',
    avatar: 'yoshi',
    totalCoins: 745,
    streakDays: 10,
    modulesCompleted: 19,
    favoriteWorld: 'World 6 • Statutory Leaves',
  },
  {
    id: 'peer-abigail',
    studentName: 'Abigail Mañalac',
    schoolOrSection: 'Labor Standards Cohort • Block A',
    avatar: 'pauline',
    totalCoins: 680,
    streakDays: 9,
    modulesCompleted: 18,
    favoriteWorld: 'Holidays • Statutory Rules',
  },
  {
    id: 'peer-beyonce',
    studentName: 'Beyonce Helein Untalan',
    schoolOrSection: 'Labor Standards Cohort • Block A',
    avatar: 'toadette',
    totalCoins: 615,
    streakDays: 8,
    modulesCompleted: 17,
    favoriteWorld: 'World 4 • Special Groups',
  },
  {
    id: 'peer-hannah',
    studentName: 'Hannah Daniela Vila',
    schoolOrSection: 'Labor Standards Cohort • Block A',
    avatar: 'capttoad',
    totalCoins: 560,
    streakDays: 7,
    modulesCompleted: 16,
    favoriteWorld: 'World 3 • Wages & D.O. 174',
  },
  {
    id: 'peer-marco',
    studentName: 'Marco Antonio Reyes',
    schoolOrSection: 'Bar Reviewee • Evening Section',
    avatar: 'firemario',
    totalCoins: 430,
    streakDays: 6,
    modulesCompleted: 14,
    favoriteWorld: 'World 1 • Hours of Work',
  },
  {
    id: 'peer-sophia',
    studentName: 'Sophia Isabel Santos',
    schoolOrSection: 'JD 2L • Labor Law Review',
    avatar: 'catpeach',
    totalCoins: 315,
    streakDays: 5,
    modulesCompleted: 11,
    favoriteWorld: 'World 6 • Statutory Leaves',
  },
  {
    id: 'peer-gabriel',
    studentName: 'Gabriel Lorenzo Mendoza',
    schoolOrSection: 'JD 1L • Statutory Foundations',
    avatar: 'toad',
    totalCoins: 195,
    streakDays: 3,
    modulesCompleted: 8,
    favoriteWorld: 'World 2 • Rest & Holidays',
  },
] as const;

export function buildGlobalCoinLeaderboard(params: {
  currentUser: {
    studentName: string;
    avatar: string;
    totalCoins: number;
    streakDays: number;
    modulesCompleted: number;
    favoriteWorld?: string;
  };
  peerEntries?: readonly Omit<CoinLeaderboardEntry, 'rank' | 'isCurrentUser'>[];
}): CoinLeaderboardEntry[] {
  const { currentUser, peerEntries = DEFAULT_STUDENT_LEADERBOARD_COHORT } = params;
  const cleanName = (currentUser.studentName || 'Law Adventurer').trim() || 'Law Adventurer';
  const normalizedUserLower = cleanName.toLowerCase();

  // Avoid duplicate Matthew entry if Matthew himself sets his profile name to Matthew Cesar Corpuz
  const filteredPeers = peerEntries.filter(
    (peer) => peer.studentName.trim().toLowerCase() !== normalizedUserLower
  );

  const isMatthewCreator =
    normalizedUserLower.includes('matthew') && normalizedUserLower.includes('corpuz');

  const combined: CoinLeaderboardEntry[] = [
    ...filteredPeers.map((peer) => ({
      ...peer,
      totalCoins: Math.max(0, Math.floor(peer.totalCoins)),
      streakDays: Math.max(0, Math.floor(peer.streakDays)),
      modulesCompleted: Math.max(0, Math.floor(peer.modulesCompleted)),
      isCurrentUser: false,
    })),
    {
      id: 'current-player',
      studentName: cleanName,
      schoolOrSection: isMatthewCreator
        ? 'You • Main Creator of this Memory Aid'
        : 'You • Active Study Session',
      avatar: currentUser.avatar || 'mario',
      totalCoins: Math.max(0, Math.floor(currentUser.totalCoins)),
      streakDays: Math.max(1, Math.floor(currentUser.streakDays)),
      modulesCompleted: Math.max(0, Math.floor(currentUser.modulesCompleted)),
      favoriteWorld: currentUser.favoriteWorld || 'All 6 Worlds',
      isCurrentUser: true,
      isCreator: isMatthewCreator,
    },
  ];

  combined.sort((a, b) => {
    if (b.totalCoins !== a.totalCoins) return b.totalCoins - a.totalCoins;
    if (b.modulesCompleted !== a.modulesCompleted) {
      return b.modulesCompleted - a.modulesCompleted;
    }
    if (b.streakDays !== a.streakDays) return b.streakDays - a.streakDays;
    if (a.isCurrentUser !== b.isCurrentUser) return a.isCurrentUser ? -1 : 1;
    return a.studentName.localeCompare(b.studentName);
  });

  return combined.map((entry, idx) => ({
    ...entry,
    rank: idx + 1,
  }));
}



