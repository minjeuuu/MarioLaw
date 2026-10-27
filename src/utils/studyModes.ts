import { Flashcard, StudyDifficulty } from '../types/laborLaw';
import { FLASHCARDS_DATA } from '../data/flashcardsData';
import {
  PRACTICE_QUESTIONS,
  BOWSER_BOSS_QUESTIONS,
  QuizQuestion,
} from '../data/quizQuestionsData';
import { drawUniqueFromDeck, shuffleChoiceOptions } from './gameQuestionDeck';

export const STREAK_COUNT_KEY = 'mario_daily_streak';
export const STREAK_STUDY_DATE_KEY = 'mario_streak_study_date';
export const LEGACY_LOGIN_DATE_KEY = 'mario_last_login_date';
export const STUDY_DIFFICULTY_KEY = 'mario_study_difficulty';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface DailyStreakState {
  streak: number;
  lastStudyDate: string;
  isBonusClaimedToday: boolean;
}

export interface AdaptedQuizQuestion extends QuizQuestion {
  hint?: string;
  difficultyMode: StudyDifficulty;
}

export interface QuickTestSummary {
  correctCount: number;
  totalCount: number;
  accuracyPercent: number;
  coinsEarned: number;
  rankTitle: string;
  feedbackMessage: string;
}

export interface FlashcardChoiceItem {
  text: string;
  isCorrect: boolean;
}

/**
 * Formats a Date into local YYYY-MM-DD calendar day string.
 */
export function formatLocalDayKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addLocalDays(date: Date, deltaDays: number): Date {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  copy.setDate(copy.getDate() + deltaDays);
  return copy;
}

function parseAnyStoredDateToKey(raw: string | null): string | null {
  if (!raw) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw;
  }
  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    return formatLocalDayKey(parsed);
  }
  return null;
}

/**
 * Synchronizes and persists the user's consecutive Daily Login Streak in localStorage.
 * - First visit: initializes streak to 1 and records today's study date.
 * - Same-day revisit: preserves current streak (>= 1).
 * - Next consecutive day: increments streak by +1 and records today's study date.
 * - Gap of >= 2 days: resets streak to 1 and records today's study date.
 */
export function syncDailyLoginStreak(
  storage: StorageLike,
  now: Date = new Date()
): DailyStreakState {
  const todayKey = formatLocalDayKey(now);
  const yesterdayKey = formatLocalDayKey(addLocalDays(now, -1));

  const rawSavedCount = parseInt(storage.getItem(STREAK_COUNT_KEY) || '0', 10);
  const safeSavedCount = Number.isFinite(rawSavedCount) && rawSavedCount > 0 ? rawSavedCount : 0;

  const storedStudyKey =
    parseAnyStoredDateToKey(storage.getItem(STREAK_STUDY_DATE_KEY)) ??
    parseAnyStoredDateToKey(storage.getItem(LEGACY_LOGIN_DATE_KEY));

  let nextStreak = 1;

  if (!storedStudyKey) {
    nextStreak = Math.max(1, safeSavedCount || 1);
  } else if (storedStudyKey === todayKey) {
    nextStreak = Math.max(1, safeSavedCount || 1);
  } else if (storedStudyKey === yesterdayKey) {
    nextStreak = Math.max(1, safeSavedCount || 1) + 1;
  } else {
    nextStreak = 1;
  }

  storage.setItem(STREAK_COUNT_KEY, String(nextStreak));
  storage.setItem(STREAK_STUDY_DATE_KEY, todayKey);

  const isBonusClaimedToday = storage.getItem(LEGACY_LOGIN_DATE_KEY) === now.toDateString();

  return {
    streak: nextStreak,
    lastStudyDate: todayKey,
    isBonusClaimedToday,
  };
}

export function readStoredStudyDifficulty(storage?: StorageLike | null): StudyDifficulty {
  if (!storage) return 'exam_prep';
  const saved = storage.getItem(STUDY_DIFFICULTY_KEY);
  if (saved === 'casual' || saved === 'exam_prep') {
    return saved;
  }
  return 'exam_prep';
}

export function mapActiveWorldToQuizCode(
  activeWorld: string
): 'all' | QuizQuestion['worldCode'] {
  switch (activeWorld) {
    case 'world1':
    case 'w1':
      return 'w1';
    case 'world2':
    case 'w2':
      return 'w2';
    case 'world3':
    case 'w3':
      return 'w3';
    case 'world4':
    case 'w4':
      return 'w4';
    case 'world5':
    case 'w5':
      return 'w5';
    case 'world6':
    case 'w6':
      return 'w6';
    case 'holidays':
      return 'holidays';
    default:
      return 'all';
  }
}

export function mapActiveWorldToFlashcardWorldNum(activeWorld: string): number | 'all' {
  switch (activeWorld) {
    case 'world1':
    case 'w1':
      return 1;
    case 'world2':
    case 'w2':
      return 2;
    case 'world3':
    case 'w3':
      return 3;
    case 'world4':
    case 'w4':
      return 4;
    case 'world5':
    case 'w5':
      return 5;
    case 'world6':
    case 'w6':
      return 6;
    case 'holidays':
      return 7;
    default:
      return 'all';
  }
}

export function getQuizWorldLabel(worldCode: 'all' | QuizQuestion['worldCode']): string {
  switch (worldCode) {
    case 'w1':
      return 'World 1: Hours of Work';
    case 'w2':
      return 'World 2: Rest, Service Charge & 13th Month';
    case 'w3':
      return 'World 3: Wages & D.O. 174';
    case 'w4':
      return 'World 4: Special Groups of Employees';
    case 'w5':
      return 'World 5: Protective Labor Laws';
    case 'w6':
      return 'World 6: Statutory Leaves & Welfare';
    case 'holidays':
      return 'Philippine Holidays Hub';
    default:
      return 'All 6 Worlds & Holidays';
  }
}

function mapFlashcardWorldNumToCode(worldNum: number): QuizQuestion['worldCode'] {
  if (worldNum === 1) return 'w1';
  if (worldNum === 2) return 'w2';
  if (worldNum === 3) return 'w3';
  if (worldNum === 4) return 'w4';
  if (worldNum === 5) return 'w5';
  if (worldNum === 6) return 'w6';
  return 'holidays';
}

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Builds deterministic Casual-mode definition & core-rule questions from Flashcards
 * (3 straightforward choices + statutory memory hint).
 */
function buildCasualDefinitionPool(): AdaptedQuizQuestion[] {
  const eligible = FLASHCARDS_DATA;

  return eligible.map((card, index) => {
    const worldCode = mapFlashcardWorldNumToCode(card.worldNum);
    const distractorsPool = eligible.filter(
      (other) => other.id !== card.id && other.keyTakeaway !== card.keyTakeaway
    );

    const seed = hashSeed(card.id);
    const d1 = distractorsPool[seed % distractorsPool.length]?.keyTakeaway ??
      'Subject exclusively to employer discretion without statutory minimum.';
    const d2 = distractorsPool[(seed + 17) % distractorsPool.length]?.keyTakeaway ??
      'Requires prior Cabinet proclamation before taking legal effect.';

    // Deterministic rotation of correct option slot (0, 1, or 2)
    const correctSlot = index % 3;
    const options: string[] = [];
    const wrongChoices = [d1, d2];
    let wrongPtr = 0;
    for (let slot = 0; slot < 3; slot++) {
      if (slot === correctSlot) {
        options.push(card.keyTakeaway);
      } else {
        options.push(wrongChoices[wrongPtr++]);
      }
    }

    return {
      id: 1000 + index + 1,
      world: card.world,
      worldCode,
      scenario: card.question,
      options,
      correctIndex: correctSlot,
      explanation: card.answer,
      legalBasis: `${card.world} • Core Statutory Definition`,
      hint: `Focus on the core rule in ${card.world}.`,
      difficultyMode: 'casual',
    };
  });
}

const CASUAL_DEFINITION_POOL: AdaptedQuizQuestion[] = buildCasualDefinitionPool();

/**
 * Returns the question pool tailored to the global StudyDifficulty setting:
 * - 'casual': Easy definition & threshold questions with 3 clear choices + helpful hint.
 * - 'exam_prep': Full 4-option Bar Exam hypothetical fact patterns with no pre-answer hints.
 */
export function getQuizQuestionsForDifficulty(
  difficulty: StudyDifficulty,
  worldCode: 'all' | QuizQuestion['worldCode'] = 'all'
): AdaptedQuizQuestion[] {
  if (difficulty === 'casual') {
    const filtered =
      worldCode === 'all'
        ? CASUAL_DEFINITION_POOL
        : CASUAL_DEFINITION_POOL.filter((q) => q.worldCode === worldCode);
    return filtered.map((q) => ({ ...q, options: [...q.options] }));
  }

  const examSource = [...PRACTICE_QUESTIONS, ...BOWSER_BOSS_QUESTIONS];
  const filtered =
    worldCode === 'all'
      ? examSource
      : examSource.filter((q) => q.worldCode === worldCode);

  return filtered.map((q) => ({
    ...q,
    options: [...q.options],
    difficultyMode: 'exam_prep' as const,
  }));
}

/**
 * Adapts a Boss Battle question according to StudyDifficulty:
 * - 'casual': Trims 1 distractor down to 3 choices (preserving the correct answer) and attaches a statutory basis hint.
 * - 'exam_prep': Preserves all 4 choices with zero hints.
 */
export function adaptBossQuestionForDifficulty(
  question: QuizQuestion,
  difficulty: StudyDifficulty
): AdaptedQuizQuestion {
  if (difficulty === 'exam_prep') {
    return {
      ...question,
      options: [...question.options],
      difficultyMode: 'exam_prep',
    };
  }

  // Keep correct option + first 2 wrong options in original order
  const keptOptions: string[] = [];
  let newCorrectIndex = 0;
  let wrongKept = 0;

  question.options.forEach((opt, idx) => {
    if (idx === question.correctIndex) {
      newCorrectIndex = keptOptions.length;
      keptOptions.push(opt);
    } else if (wrongKept < 2) {
      keptOptions.push(opt);
      wrongKept += 1;
    }
  });

  return {
    ...question,
    options: keptOptions,
    correctIndex: newCorrectIndex,
    hint: `Statutory Anchor: ${question.legalBasis}`,
    difficultyMode: 'casual',
  };
}

/**
 * Pulls `count` (default 5) unique random questions from the current active world
 * (or across all worlds when activeWorld is 'all'), respecting the global Difficulty mode.
 */
export function pickQuickTestQuestions(
  activeWorld: string,
  difficulty: StudyDifficulty,
  count = 5,
  rng: () => number = Math.random
): AdaptedQuizQuestion[] {
  const worldCode = mapActiveWorldToQuizCode(activeWorld);
  let pool = getQuizQuestionsForDifficulty(difficulty, worldCode);

  // Fallback to all worlds if a filter ever has fewer than `count` items
  if (pool.length < count) {
    const extra = getQuizQuestionsForDifficulty(difficulty, 'all').filter(
      (item) => !pool.some((p) => p.id === item.id)
    );
    pool = [...pool, ...extra];
  }

  if (rng === Math.random) {
    const drawn = drawUniqueFromDeck(
      `quick_test_${difficulty}_${worldCode}`,
      pool,
      Math.min(count, pool.length)
    );
    return drawn.map((item) => {
      const shuffled = shuffleChoiceOptions(item.options, item.correctIndex);
      return {
        ...item,
        options: shuffled.options,
        correctIndex: shuffled.correctIndex,
      };
    });
  }

  const copy = [...pool];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy.slice(0, Math.min(count, copy.length));
}

/**
 * Computes the Instant Score Summary and accuracy-scaled Coin Reward for Quick Test mode.
 */
export function computeQuickTestSummary(
  correctCount: number,
  totalCount: number,
  difficulty: StudyDifficulty = 'exam_prep'
): QuickTestSummary {
  const safeTotal = Math.max(1, totalCount);
  const clampedCorrect = Math.max(0, Math.min(safeTotal, correctCount));
  const accuracyPercent = Math.round((clampedCorrect / safeTotal) * 100);

  let coinsEarned = 0;
  if (clampedCorrect > 0) {
    const baseReward = Math.round((clampedCorrect / safeTotal) * 30);
    const masteryBonus = accuracyPercent === 100 ? 10 : accuracyPercent >= 80 ? 5 : 0;
    const rawTotal = baseReward + masteryBonus;
    coinsEarned = difficulty === 'exam_prep' ? Math.round(rawTotal * 1.25) : rawTotal;
  }

  let rankTitle = 'STAGE ROOKIE';
  let feedbackMessage =
    'Review the Active World statutory cards or flip through Casual Definitions to boost your accuracy!';

  if (accuracyPercent === 100) {
    rankTitle = 'SUPER STAR PERFECT!';
    feedbackMessage =
      'Flawless 100% accuracy! Every statutory rule and exception mastered on the first pass.';
  } else if (accuracyPercent >= 80) {
    rankTitle = 'FIRE FLOWER ACE!';
    feedbackMessage =
      'High-accuracy command of the doctrines! Just one minor statutory nuance away from perfection.';
  } else if (accuracyPercent >= 60) {
    rankTitle = 'SUPER MUSHROOM PASS!';
    feedbackMessage =
      'Solid working grasp of the core Labor Code provisions. Check missed items below to lock in 100%.';
  } else if (accuracyPercent >= 40) {
    rankTitle = 'PIPE EXPLORER';
    feedbackMessage =
      'Good warm-up! Review the statutory explanations below and run another 5-question Quick Test.';
  }

  return {
    correctCount: clampedCorrect,
    totalCount: safeTotal,
    accuracyPercent,
    coinsEarned,
    rankTitle,
    feedbackMessage,
  };
}

/**
 * Filters & orders flashcards based on the global Difficulty toggle:
 * - 'casual': Easy & Medium core definition cards (Easy first).
 * - 'exam_prep': Medium & Hard exam-grade cards (Hard first) for multiple-choice testing.
 */
export function filterFlashcardsForDifficulty(
  cards: Flashcard[],
  difficulty: StudyDifficulty,
  selectedWorld: number | 'all' = 'all'
): Flashcard[] {
  const worldScoped =
    selectedWorld === 'all' ? cards : cards.filter((c) => c.worldNum === selectedWorld);

  if (difficulty === 'casual') {
    const casualCards = worldScoped.filter(
      (c) => c.difficulty === 'Easy' || c.difficulty === 'Medium'
    );
    const list = casualCards.length > 0 ? casualCards : worldScoped;
    const rank = { Easy: 0, Medium: 1, Hard: 2 };
    return [...list].sort((a, b) => rank[a.difficulty] - rank[b.difficulty]);
  }

  const examCards = worldScoped.filter(
    (c) => c.difficulty === 'Hard' || c.difficulty === 'Medium'
  );
  const list = examCards.length > 0 ? examCards : worldScoped;
  const rank = { Hard: 0, Medium: 1, Easy: 2 };
  return [...list].sort((a, b) => rank[a.difficulty] - rank[b.difficulty]);
}

/**
 * Generates deterministic 4-option multiple-choice options for a Flashcard in 'exam_prep' mode.
 */
export function buildFlashcardExamChoices(
  card: Flashcard,
  allCards: Flashcard[] = FLASHCARDS_DATA
): FlashcardChoiceItem[] {
  const sameWorldCandidates = allCards.filter(
    (c) => c.id !== card.id && c.worldNum === card.worldNum && c.keyTakeaway !== card.keyTakeaway
  );
  const fallbackCandidates = allCards.filter(
    (c) => c.id !== card.id && c.keyTakeaway !== card.keyTakeaway
  );
  const source = sameWorldCandidates.length >= 3 ? sameWorldCandidates : fallbackCandidates;

  const seed = hashSeed(card.id);
  const distractors: string[] = [];
  let offset = 0;
  while (distractors.length < 3 && offset < source.length * 2) {
    const pick = source[(seed + offset * 7) % source.length]?.keyTakeaway;
    if (pick && !distractors.includes(pick) && pick !== card.keyTakeaway) {
      distractors.push(pick);
    }
    offset += 1;
  }

  while (distractors.length < 3) {
    distractors.push(`Subject to voluntary employer policy (${distractors.length + 1})`);
  }

  const correctPos = seed % 4;
  const items: FlashcardChoiceItem[] = [];
  let dIdx = 0;
  for (let i = 0; i < 4; i++) {
    if (i === correctPos) {
      items.push({ text: card.keyTakeaway, isCorrect: true });
    } else {
      items.push({ text: distractors[dIdx++], isCorrect: false });
    }
  }
  return items;
}

export const QUICK_STUDY_DURATION_SECONDS = 5 * 60; // 5 minutes (300 seconds)

export interface QuickStudyTopicMeta {
  id: string;
  worldId: string;
  title: string;
  subtitle?: string;
}

export interface QuickStudyDeckResult {
  cards: Flashcard[];
  matchedWeakCardCount: number;
  sourceLabel: string;
  targetWorldNums: number[];
}

/**
 * Generates a curated 5-minute Quick Study flashcard deck (default 15 cards)
 * prioritized from topics and worlds marked as 'Need Improvement' in the user's profile stats.
 * Falls back intelligently to unmastered cards in uncompleted topics if no weak topics are flagged yet.
 */
export function buildQuickStudyCuratedDeck(params: {
  allCards?: Flashcard[];
  needsImprovementTopicIds?: string[];
  needsImprovementWorlds?: string[];
  completedTopicIds?: string[];
  masteredCardIds?: string[];
  allTopics?: QuickStudyTopicMeta[];
  deckSize?: number;
}): QuickStudyDeckResult {
  const {
    allCards = FLASHCARDS_DATA,
    needsImprovementTopicIds = [],
    needsImprovementWorlds = [],
    completedTopicIds = [],
    masteredCardIds = [],
    allTopics = [],
    deckSize = 15,
  } = params;

  const safeDeckSize = Math.max(5, Math.min(30, deckSize));
  const masteredSet = new Set(masteredCardIds);
  const completedTopicSet = new Set(completedTopicIds);
  const weakTopicSet = new Set(needsImprovementTopicIds);

  // Derive target worldNums from explicitly flagged worlds + flagged topics' parent worlds
  const targetWorldNumSet = new Set<number>();
  needsImprovementWorlds.forEach((wId) => {
    const num = mapActiveWorldToFlashcardWorldNum(wId);
    if (typeof num === 'number') targetWorldNumSet.add(num);
  });

  const weakTopicKeywords: string[] = [];
  allTopics.forEach((topic) => {
    if (weakTopicSet.has(topic.id)) {
      const num = mapActiveWorldToFlashcardWorldNum(topic.worldId);
      if (typeof num === 'number') targetWorldNumSet.add(num);
      const words = `${topic.title} ${topic.subtitle || ''}`
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length >= 4 && !['with', 'from', 'under', 'work', 'rules', 'labor', 'code'].includes(w));
      weakTopicKeywords.push(...words);
    }
  });

  const hasExplicitWeakFlags = targetWorldNumSet.size > 0 || weakTopicSet.size > 0;

  // Score every flashcard for relevance to "Need Improvement"
  const scored = allCards.map((card, index) => {
    let score = 0;
    const hay = `${card.question} ${card.answer} ${card.keyTakeaway} ${card.world}`.toLowerCase();

    if (targetWorldNumSet.has(card.worldNum)) {
      score += 40;
    }

    let keywordHits = 0;
    for (const kw of weakTopicKeywords) {
      if (hay.includes(kw)) {
        keywordHits += 1;
      }
    }
    score += Math.min(45, keywordHits * 15);

    if (!masteredSet.has(card.id)) {
      score += 12;
    }
    if (card.difficulty === 'Hard') {
      score += 6;
    } else if (card.difficulty === 'Medium') {
      score += 3;
    }

    // If user hasn't flagged anything yet, boost worlds where topics are still uncompleted
    if (!hasExplicitWeakFlags && allTopics.length > 0) {
      const worldIdForCard =
        card.worldNum >= 1 && card.worldNum <= 6 ? `world${card.worldNum}` : 'holidays';
      const hasUncompletedInWorld = allTopics.some(
        (t) => t.worldId === worldIdForCard && !completedTopicSet.has(t.id)
      );
      if (hasUncompletedInWorld) {
        score += 20;
      }
    }

    return {
      card,
      score,
      isDirectWeakMatch: targetWorldNumSet.has(card.worldNum) || keywordHits > 0,
      tieBreaker: (hashSeed(card.id) + index) % 997,
    };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.tieBreaker - b.tieBreaker;
  });

  const selected = scored.slice(0, Math.min(safeDeckSize, scored.length));
  const matchedWeakCardCount = selected.filter((item) => item.isDirectWeakMatch).length;
  const targetWorldNums = Array.from(targetWorldNumSet).sort((a, b) => a - b);

  const sourceLabel = hasExplicitWeakFlags
    ? `Curated from ${weakTopicSet.size + needsImprovementWorlds.length} 'Need Improvement' profile focus area${
        weakTopicSet.size + needsImprovementWorlds.length === 1 ? '' : 's'
      }`
    : 'Smart Weak-Spot Mix (Unmastered & High-Yield Bar Cards — flag topics in Profile to customize)';

  return {
    cards: selected.map((s) => s.card),
    matchedWeakCardCount,
    sourceLabel,
    targetWorldNums,
  };
}

export { BOWSER_BOSS_QUESTIONS };

