import React, { useState, useEffect, useRef, useMemo } from 'react';
import { marioAudio } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  BOWSER_BOSS_QUESTIONS,
  QuizQuestion,
} from '../data/quizQuestionsData';
import { StudyDifficulty } from '../types/laborLaw';
import {
  AdaptedQuizQuestion,
  getQuizQuestionsForDifficulty,
  adaptBossQuestionForDifficulty,
  pickQuickTestQuestions,
  computeQuickTestSummary,
  mapActiveWorldToQuizCode,
  getQuizWorldLabel,
} from '../utils/studyModes';
import { drawUniqueFromDeck, shuffleChoiceOptions } from '../utils/gameQuestionDeck';
import { QuizCompletionPayload } from '../utils/profileAchievements';
import {
  Trophy,
  CheckCircle,
  XCircle,
  ArrowRight,
  RotateCcw,
  Award,
  Flame,
  Heart,
  Clock,
  Filter,
  Shuffle,
  Zap,
  Lightbulb,
  GraduationCap,
  Feather,
} from 'lucide-react';
import {
  Mario1UpIcon,
  MarioFlagIcon,
  MarioStarIcon,
  MarioMushroomIcon,
  MarioCoinIcon,
  MarioBowserIcon,
  MarioFireballIcon,
  MarioAxeIcon,
} from './MarioIcons';

interface DigitalBadge {
  id: string;
  name: string;
  title: string;
  description: string;
  dateUnlocked: string;
}

interface QuickAnswerRecord {
  question: AdaptedQuizQuestion;
  chosenIndex: number;
  isCorrect: boolean;
}

interface BarQuizQuestProps {
  fontSize: 'normal' | 'large' | 'xlarge';
  onEarnCoins: (amount: number) => void;
  activeWorld: string;
  onChangeActiveWorld?: (worldId: string) => void;
  studyDifficulty: StudyDifficulty;
  setStudyDifficulty: (difficulty: StudyDifficulty) => void;
  onQuizCompleted?: (payload: QuizCompletionPayload) => void;
  onOpenProfile?: () => void;
  unlockedAchievementsCount?: number;
}

export const BarQuizQuest: React.FC<BarQuizQuestProps> = ({
  fontSize,
  onEarnCoins,
  activeWorld,
  onChangeActiveWorld,
  studyDifficulty,
  setStudyDifficulty,
  onQuizCompleted,
  onOpenProfile,
  unlockedAchievementsCount,
}) => {
  const [activeMode, setActiveMode] = useState<'quick' | 'practice' | 'boss'>('quick');

  // ==================== MODE 0: QUICK TEST (5 Random Active-World Qs) ====================
  const [quickDeck, setQuickDeck] = useState<AdaptedQuizQuestion[]>(() =>
    pickQuickTestQuestions(activeWorld, studyDifficulty, 5)
  );
  const [quickIdx, setQuickIdx] = useState(0);
  const [quickSelected, setQuickSelected] = useState<number | null>(null);
  const [quickSubmitted, setQuickSubmitted] = useState(false);
  const [quickRecords, setQuickRecords] = useState<QuickAnswerRecord[]>([]);
  const [quickComplete, setQuickComplete] = useState(false);
  const [quickRewardedCoins, setQuickRewardedCoins] = useState(0);

  const startFreshQuickTest = (
    targetWorld: string = activeWorld,
    targetDiff: StudyDifficulty = studyDifficulty
  ) => {
    const nextFive = pickQuickTestQuestions(targetWorld, targetDiff, 5);
    setQuickDeck(nextFive);
    setQuickIdx(0);
    setQuickSelected(null);
    setQuickSubmitted(false);
    setQuickRecords([]);
    setQuickComplete(false);
    setQuickRewardedCoins(0);
  };

  useEffect(() => {
    startFreshQuickTest(activeWorld, studyDifficulty);
  }, [activeWorld, studyDifficulty]);

  const quickQ = quickDeck[quickIdx];
  const activeWorldCode = mapActiveWorldToQuizCode(activeWorld);
  const activeWorldTitle = getQuizWorldLabel(activeWorldCode);

  const handleSelectQuickOption = (idx: number) => {
    if (quickSubmitted) return;
    setQuickSelected(idx);
    marioAudio.playJump();
  };

  const handleSubmitQuickAnswer = () => {
    if (quickSelected === null || !quickQ || quickSubmitted) return;
    const isCorrect = quickSelected === quickQ.correctIndex;
    setQuickSubmitted(true);
    const updatedRecords = [
      ...quickRecords,
      { question: quickQ, chosenIndex: quickSelected, isCorrect },
    ];
    setQuickRecords(updatedRecords);

    if (isCorrect) {
      marioAudio.playCoin();
    } else {
      marioAudio.playWrongAnswer();
    }
  };

  const handleNextQuickQuestion = () => {
    if (quickIdx < quickDeck.length - 1) {
      setQuickIdx((i) => i + 1);
      setQuickSelected(null);
      setQuickSubmitted(false);
      marioAudio.playPipe();
    } else {
      const correctTotal = quickRecords.filter((r) => r.isCorrect).length;
      const summary = computeQuickTestSummary(
        correctTotal,
        quickDeck.length,
        studyDifficulty
      );
      setQuickRewardedCoins(summary.coinsEarned);
      setQuickComplete(true);
      onQuizCompleted?.({
        worldCode: activeWorldCode,
        correctCount: correctTotal,
        totalCount: quickDeck.length,
      });
      if (summary.coinsEarned > 0) {
        onEarnCoins(summary.coinsEarned);
      }
      if (summary.accuracyPercent < 40) {
        marioAudio.playGameOver();
      } else {
        marioAudio.playQuizComplete();
      }
      try {
        confetti({ particleCount: 85, spread: 75, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    }
  };

  const quickSummary = useMemo(() => {
    const correctTotal = quickRecords.filter((r) => r.isCorrect).length;
    return computeQuickTestSummary(
      correctTotal,
      Math.max(1, quickDeck.length),
      studyDifficulty
    );
  }, [quickRecords, quickDeck.length, studyDifficulty]);

  // ==================== MODE 1: PRACTICE ARENA ====================
  const [worldFilter, setWorldFilter] = useState<'all' | QuizQuestion['worldCode']>('all');
  const [runLimit, setRunLimit] = useState<15 | 30 | 999>(999);
  const [shuffleSeed, setShuffleSeed] = useState<number>(1);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  useEffect(() => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsQuizComplete(false);
  }, [studyDifficulty]);

  // ==================== MODE 2: BOWSER BOSS ====================
  const [bossTier, setBossTier] = useState<'standard' | 'mega'>('standard');
  const [bossDeck, setBossDeck] = useState<QuizQuestion[]>(BOWSER_BOSS_QUESTIONS);
  const [bossMaxHp, setBossMaxHp] = useState(100);
  const [bossHp, setBossHp] = useState(100);
  const [playerHearts, setPlayerHearts] = useState(3);
  const [bossIdx, setBossIdx] = useState(0);
  const [bossSelectedAnswer, setBossSelectedAnswer] = useState<number | null>(null);
  const [bossAnswerSubmitted, setBossAnswerSubmitted] = useState(false);
  const [bossBattleState, setBossBattleState] = useState<'intro' | 'combat' | 'defeat' | 'victory'>('intro');
  const [comboStreak, setComboStreak] = useState(0);
  const defaultBossSeconds = studyDifficulty === 'casual' ? 32 : 25;
  const [timeLeft, setTimeLeft] = useState(defaultBossSeconds);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [badges, setBadges] = useState<DigitalBadge[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mario_unlocked_badges');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const fullPracticePoolForDifficulty = useMemo(
    () => getQuizQuestionsForDifficulty(studyDifficulty, 'all'),
    [studyDifficulty]
  );

  const activePracticePool = useMemo(() => {
    const filtered = getQuizQuestionsForDifficulty(studyDifficulty, worldFilter);
    const targetCount = Math.min(runLimit, filtered.length);
    if (shuffleSeed > 0) {
      const drawn = drawUniqueFromDeck(
        `practice_arena_${studyDifficulty}_${worldFilter}`,
        filtered,
        targetCount
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
    return filtered.slice(0, targetCount);
  }, [studyDifficulty, worldFilter, runLimit, shuffleSeed]);

  const bodyTextClass =
    fontSize === 'xlarge' ? 'text-xl' : fontSize === 'large' ? 'text-lg' : 'text-base';

  const q = activePracticePool[currentIdx] || activePracticePool[0];

  const resetPracticeRun = (
    nextWorld: 'all' | QuizQuestion['worldCode'] = worldFilter,
    nextLimit: 15 | 30 | 999 = runLimit,
    shuffle = false
  ) => {
    setWorldFilter(nextWorld);
    setRunLimit(nextLimit);
    if (shuffle) setShuffleSeed((s) => s + 1);
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsQuizComplete(false);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(idx);
    marioAudio.playJump();
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !q) return;
    setIsAnswerSubmitted(true);
    if (selectedAnswer === q.correctIndex) {
      setScore((s) => s + 1);
      onEarnCoins(studyDifficulty === 'exam_prep' ? 6 : 4);
      marioAudio.playCoin();
      try {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
      } catch {
        // ignore
      }
    } else {
      marioAudio.playWrongAnswer();
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < activePracticePool.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      marioAudio.playPipe();
    } else {
      setIsQuizComplete(true);
      onQuizCompleted?.({
        worldCode: worldFilter,
        correctCount: score,
        totalCount: activePracticePool.length,
      });
      marioAudio.playQuizComplete();
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    }
  };

  // Boss Battle Logic
  const rawBossQ = bossDeck[bossIdx % bossDeck.length];
  const bossQ = useMemo(
    () => (rawBossQ ? adaptBossQuestionForDifficulty(rawBossQ, studyDifficulty) : null),
    [rawBossQ, studyDifficulty]
  );

  useEffect(() => {
    if (bossBattleState === 'combat' && !bossAnswerSubmitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            handleBossTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [bossBattleState, bossAnswerSubmitted, bossIdx]);

  const handleBossTimeout = () => {
    setBossAnswerSubmitted(true);
    marioAudio.playWrongAnswer();
    setComboStreak(0);
    setPlayerHearts((h) => {
      const next = h - 1;
      if (next <= 0) {
        setBossBattleState('defeat');
        marioAudio.playGameOver();
      }
      return next;
    });
  };

  const handleStartBossBattle = (tier: 'standard' | 'mega' = bossTier) => {
    const shuffled = drawUniqueFromDeck(
      'bowser_boss_arena',
      BOWSER_BOSS_QUESTIONS,
      BOWSER_BOSS_QUESTIONS.length
    ).map((item) => {
      const optShuffled = shuffleChoiceOptions(item.options, item.correctIndex);
      return {
        ...item,
        options: optShuffled.options,
        correctIndex: optShuffled.correctIndex,
      };
    });
    const hpTarget = tier === 'mega' ? 200 : 100;
    setBossTier(tier);
    setBossDeck(shuffled);
    setBossMaxHp(hpTarget);
    setBossHp(hpTarget);
    setPlayerHearts(tier === 'mega' ? 4 : 3);
    setBossIdx(0);
    setBossSelectedAnswer(null);
    setBossAnswerSubmitted(false);
    setComboStreak(0);
    setTimeLeft(defaultBossSeconds);
    setBossBattleState('combat');
    marioAudio.playPowerUp();
  };

  const handleSelectBossOption = (idx: number) => {
    if (bossAnswerSubmitted) return;
    setBossSelectedAnswer(idx);
    marioAudio.playJump();
  };

  const handleSubmitBossAnswer = () => {
    if (bossSelectedAnswer === null || bossAnswerSubmitted || !bossQ) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setBossAnswerSubmitted(true);

    if (bossSelectedAnswer === bossQ.correctIndex) {
      marioAudio.playFireball();
      marioAudio.playBowserHit();
      try {
        confetti({ particleCount: 45, spread: 70, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
      const nextStreak = comboStreak + 1;
      setComboStreak(nextStreak);
      onEarnCoins(10);

      const nextHp = Math.max(0, bossHp - 20);
      setBossHp(nextHp);

      if (nextHp <= 0) {
        setTimeout(() => {
          setBossBattleState('victory');
          onQuizCompleted?.({
            worldCode: 'BOSS',
            correctCount: bossTier === 'mega' ? 10 : 5,
            totalCount: bossTier === 'mega' ? 10 : 5,
            isBossVictory: true,
          });
          marioAudio.playQuizComplete();
          onEarnCoins(bossTier === 'mega' ? 200 : 100);
          try {
            confetti({ particleCount: 140, spread: 100, origin: { y: 0.5 } });
          } catch {
            // ignore
          }

          const badgeId = bossTier === 'mega' ? 'mega_bowser_slayer' : 'bowser_slayer';
          const newBadge: DigitalBadge = {
            id: badgeId,
            name: bossTier === 'mega' ? 'MEGA BOWSER CONQUEROR' : 'BOWSER SLAYER',
            title:
              bossTier === 'mega'
                ? '10-Hit Grandmaster of Philippine Labor Law'
                : 'Supreme Master of Philippine Labor Standards',
            description: 'Defeated Bowser’s Lava Keep under rapid-fire statutory questioning!',
            dateUnlocked: new Date().toLocaleDateString(),
          };

          const updatedBadges = [...badges.filter((b) => b.id !== badgeId), newBadge];
          setBadges(updatedBadges);
          try {
            localStorage.setItem('mario_unlocked_badges', JSON.stringify(updatedBadges));
          } catch {
            // fallback
          }
        }, 900);
      }
    } else {
      marioAudio.playWrongAnswer();
      setComboStreak(0);
      const nextHearts = playerHearts - 1;
      setPlayerHearts(nextHearts);
      if (nextHearts <= 0) {
        setTimeout(() => {
          setBossBattleState('defeat');
          marioAudio.playGameOver();
        }, 900);
      }
    }
  };

  const handleNextBossQuestion = () => {
    setBossIdx((prev) => prev + 1);
    setBossSelectedAnswer(null);
    setBossAnswerSubmitted(false);
    setTimeLeft(defaultBossSeconds);
    marioAudio.playJump();
  };

  const worldSelectOptions: { worldId: string; label: string }[] = [
    { worldId: 'all', label: 'All Worlds' },
    { worldId: 'world1', label: 'W1: Hours' },
    { worldId: 'world2', label: 'W2: Rest' },
    { worldId: 'holidays', label: 'Holidays' },
    { worldId: 'world3', label: 'W3: Wages' },
    { worldId: 'world4', label: 'W4: Special' },
    { worldId: 'world5', label: 'W5: Protective' },
    { worldId: 'world6', label: 'W6: Leaves' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-5 w-full">
      {/* Mode Switcher Tabs + Global Difficulty Indicator */}
      <div className="bg-slate-900 p-2.5 rounded-2xl border-3 border-slate-950 shadow-[4px_4px_0_#000] space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveMode('quick');
              marioAudio.playPowerUp();
            }}
            data-testid="quiz-mode-quick"
            className={`min-h-[44px] px-3 inline-flex items-center justify-center gap-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer leading-none whitespace-nowrap ${
              activeMode === 'quick'
                ? 'bg-emerald-400 text-slate-950 border-2 border-black shadow-[0_2px_0_#000]'
                : 'bg-slate-800 text-slate-200 hover:text-white border-2 border-slate-700'
            }`}
          >
            <Zap className="w-4 h-4 shrink-0" />
            <span>Quick Test (5 Qs)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMode('practice');
              marioAudio.playJump();
            }}
            data-testid="quiz-mode-practice"
            className={`min-h-[44px] px-3 inline-flex items-center justify-center gap-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer leading-none whitespace-nowrap ${
              activeMode === 'practice'
                ? 'bg-amber-400 text-slate-950 border-2 border-black shadow-[0_2px_0_#000]'
                : 'bg-slate-800 text-slate-200 hover:text-white border-2 border-slate-700'
            }`}
          >
            <Trophy className="w-4 h-4 shrink-0" />
            <span>Practice ({fullPracticePoolForDifficulty.length} Qs)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMode('boss');
              marioAudio.playFireball();
            }}
            data-testid="quiz-mode-boss"
            className={`min-h-[44px] px-3 inline-flex items-center justify-center gap-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer leading-none whitespace-nowrap ${
              activeMode === 'boss'
                ? 'bg-red-600 text-white border-2 border-black shadow-[0_2px_0_#000]'
                : 'bg-slate-800 text-slate-200 hover:text-white border-2 border-slate-700'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Bowser Boss ({BOWSER_BOSS_QUESTIONS.length})</span>
          </button>
        </div>

        {/* Difficulty & Badges Status Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 font-bold">Difficulty:</span>
            <button
              type="button"
              onClick={() =>
                setStudyDifficulty(studyDifficulty === 'casual' ? 'exam_prep' : 'casual')
              }
              className={`min-h-[34px] px-3 rounded-lg border border-black font-black text-xs inline-flex items-center gap-1.5 cursor-pointer ${
                studyDifficulty === 'exam_prep'
                  ? 'bg-red-600 text-white'
                  : 'bg-emerald-400 text-slate-950'
              }`}
            >
              {studyDifficulty === 'exam_prep' ? (
                <>
                  <GraduationCap className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>Exam Prep (4-Choice Scenarios)</span>
                </>
              ) : (
                <>
                  <Feather className="w-3.5 h-3.5 shrink-0" />
                  <span>Casual (3-Choice Definitions + Hints)</span>
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              onOpenProfile?.();
              marioAudio.playCoin();
            }}
            className="min-h-[34px] px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 inline-flex items-center gap-1.5 text-xs font-bold text-slate-200 tabular-nums cursor-pointer whitespace-nowrap"
          >
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Achievements:</span>
            <span className="text-amber-400 font-mario">
              {unlockedAchievementsCount !== undefined ? unlockedAchievementsCount : badges.length}
            </span>
          </button>
        </div>
      </div>

      {/* ==================== MODE 0: QUICK TEST (5 RANDOM ACTIVE-WORLD QUESTIONS) ==================== */}
      {activeMode === 'quick' && (
        <div className="space-y-5">
          {/* Quick Test Header & Active World Selector */}
          <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white rounded-3xl p-4 sm:p-6 mario-card border-4 border-slate-950 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-400 text-slate-950 font-black rounded-lg border border-black text-[10px] uppercase font-mario leading-snug">
                  <Zap className="w-3.5 h-3.5 shrink-0" />
                  <span className="sm:hidden">5-Q WORLD SPRINT</span>
                  <span className="hidden sm:inline">5-QUESTION ACTIVE WORLD SPRINT</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white font-display">
                  QUICK TEST: {activeWorldTitle.toUpperCase()}
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100 font-semibold max-w-2xl">
                  Pulls 5 random {studyDifficulty === 'casual' ? 'definition & threshold' : 'Bar Exam scenario'} questions from your active world and awards coins scaled to your accuracy!
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  startFreshQuickTest(activeWorld, studyDifficulty);
                  marioAudio.playPowerUp();
                }}
                className="min-h-[42px] px-4 inline-flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-2 border-black shadow-[0_2px_0_#000] text-xs cursor-pointer whitespace-nowrap shrink-0 w-full sm:w-auto"
              >
                <Shuffle className="w-3.5 h-3.5 shrink-0" />
                <span>New Random 5</span>
              </button>
            </div>

            {/* Active World Switcher inside Quick Test */}
            {onChangeActiveWorld && (
              <div className="pt-3 border-t border-white/15 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-black uppercase text-amber-300 font-mario mr-1">
                  ACTIVE WORLD:
                </span>
                {worldSelectOptions.map((opt) => {
                  const isCurrent =
                    mapActiveWorldToQuizCode(activeWorld) ===
                    mapActiveWorldToQuizCode(opt.worldId);
                  return (
                    <button
                      key={opt.worldId}
                      type="button"
                      onClick={() => {
                        onChangeActiveWorld(opt.worldId);
                        marioAudio.playTabSwitch();
                      }}
                      className={`min-h-[44px] px-3 rounded-xl text-xs font-black border border-black cursor-pointer transition-all whitespace-nowrap ${
                        isCurrent
                          ? 'bg-amber-400 text-slate-950 shadow-[0_2px_0_#000]'
                          : 'bg-slate-950/60 text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {!quickComplete && quickQ ? (
            <div className="bg-white rounded-3xl mario-card border-4 border-slate-950 p-4 sm:p-7 space-y-5">
              {/* Progress Bar (1 of 5 .. 5 of 5) */}
              <div className="space-y-2 border-b-2 border-slate-200 pb-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-black text-slate-800">
                  <span className="inline-flex items-center gap-1.5 text-emerald-800">
                    <span className="font-mario text-[11px] text-red-600">
                      QUICK Q {quickIdx + 1} OF {quickDeck.length}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-700 truncate">{quickQ.world}</span>
                  </span>
                  <span className="text-slate-900 font-extrabold text-xs tabular-nums">
                    Accuracy so far: {quickRecords.filter((r) => r.isCorrect).length} / {quickRecords.length}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1.5">
                  {quickDeck.map((item, idx) => {
                    const rec = quickRecords[idx];
                    const stateClass = rec
                      ? rec.isCorrect
                        ? 'bg-emerald-500'
                        : 'bg-rose-500'
                      : idx === quickIdx
                      ? 'bg-amber-400'
                      : 'bg-slate-200';
                    return (
                      <div
                        key={item.id}
                        className={`h-2.5 rounded-full border border-black transition-colors ${stateClass}`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Question Prompt */}
              <div className="bg-slate-50 border-3 border-slate-800 rounded-2xl p-4 sm:p-6 space-y-2.5">
                <span className="text-[11px] font-black uppercase text-emerald-800 tracking-wider font-mario block">
                  {studyDifficulty === 'casual'
                    ? 'CASUAL CORE DEFINITION'
                    : 'EXAM PREP SCENARIO'}
                </span>
                <p className={`${bodyTextClass} font-extrabold text-slate-950 leading-relaxed`}>
                  &ldquo;{quickQ.scenario}&rdquo;
                </p>
                {studyDifficulty === 'casual' && quickQ.hint && (
                  <div className="pt-2 border-t border-slate-200 flex items-start gap-2 text-xs font-bold text-amber-900">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>Hint: {quickQ.hint}</span>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {quickQ.options.map((option, idx) => {
                  let optStyle = 'bg-white hover:bg-slate-100 border-slate-800 text-slate-900';
                  if (quickSelected === idx) {
                    optStyle = 'bg-amber-100 border-amber-600 text-amber-950 ring-2 ring-amber-400';
                  }
                  if (quickSubmitted) {
                    if (idx === quickQ.correctIndex) {
                      optStyle = 'bg-emerald-100 border-emerald-700 text-emerald-950 ring-3 ring-emerald-400';
                    } else if (quickSelected === idx) {
                      optStyle = 'bg-rose-100 border-rose-600 text-rose-950';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectQuickOption(idx)}
                      disabled={quickSubmitted}
                      className={`w-full min-h-[52px] text-left p-3.5 sm:p-4 rounded-xl border-3 transition-all flex items-start gap-3 cursor-pointer ${optStyle}`}
                    >
                      <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg bg-slate-950 text-white text-xs sm:text-sm font-black font-mario">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className={`${bodyTextClass} font-bold leading-snug pt-0.5`}>
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Instant Item Feedback */}
              {quickSubmitted && (
                <div
                  className={`p-4 rounded-2xl border-3 space-y-1.5 ${
                    quickSelected === quickQ.correctIndex
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950'
                      : 'bg-rose-50 border-rose-600 text-rose-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-black text-sm font-mario">
                    {quickSelected === quickQ.correctIndex ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>CORRECT!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        <span>NEEDS REVIEW</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                    {quickQ.explanation}
                  </p>
                </div>
              )}

              {/* Action Bar */}
              <div className="flex flex-wrap items-center justify-between pt-3 border-t-2 border-slate-200 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    startFreshQuickTest(activeWorld, studyDifficulty);
                    marioAudio.playPipe();
                  }}
                  className="min-h-[44px] px-4 inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black rounded-xl border-2 border-black text-xs sm:text-sm cursor-pointer leading-none whitespace-nowrap"
                >
                  <RotateCcw className="w-4 h-4 shrink-0" />
                  <span>Redraw 5 Qs</span>
                </button>

                {!quickSubmitted ? (
                  <button
                    type="button"
                    data-testid="quick-submit-btn"
                    onClick={handleSubmitQuickAnswer}
                    disabled={quickSelected === null}
                    className="min-h-[44px] px-6 inline-flex items-center justify-center bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_3px_0_#000] active:translate-y-0.5 text-sm cursor-pointer leading-none whitespace-nowrap flex-1 sm:flex-initial"
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    type="button"
                    data-testid="quick-next-btn"
                    onClick={handleNextQuickQuestion}
                    className="min-h-[44px] px-6 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl border-3 border-black shadow-[0_3px_0_#000] active:translate-y-0.5 text-sm cursor-pointer leading-none whitespace-nowrap flex-1 sm:flex-initial"
                  >
                    <span>
                      {quickIdx < quickDeck.length - 1
                        ? 'Next Question'
                        : 'Finish & Claim Coins'}
                    </span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* INSTANT SCORE SUMMARY & ACCURACY COIN REWARD */
            <div
              data-testid="quick-test-summary"
              className="bg-white rounded-3xl mario-card border-4 border-slate-950 p-5 sm:p-8 space-y-6"
            >
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-amber-400 border-4 border-black rounded-2xl mx-auto flex items-center justify-center shadow-[0_4px_0_#000]">
                  <MarioStarIcon className="w-9 h-9" />
                </div>
                <span className="text-xs font-black font-mario uppercase text-emerald-700 block">
                  INSTANT QUICK TEST SUMMARY · {activeWorldTitle}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 font-display">
                  {quickSummary.rankTitle}
                </h3>
                <p className="text-xs sm:text-sm font-bold text-slate-600 max-w-lg mx-auto">
                  {quickSummary.feedbackMessage}
                </p>
              </div>

              {/* 3-Metric Scoreboard (Score, Accuracy %, Coins Rewarded) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 tabular-nums">
                <div className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-4 text-center">
                  <span className="text-[10px] font-black font-mario text-slate-500 uppercase block">
                    FINAL SCORE
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-slate-950 font-display mt-1 block">
                    {quickSummary.correctCount} / {quickSummary.totalCount}
                  </span>
                </div>

                <div className="bg-emerald-50 border-2 border-emerald-700 rounded-2xl p-4 text-center">
                  <span className="text-[10px] font-black font-mario text-emerald-800 uppercase block">
                    ACCURACY RATE
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-display mt-1 block">
                    {quickSummary.accuracyPercent}%
                  </span>
                </div>

                <div className="bg-amber-50 border-2 border-amber-600 rounded-2xl p-4 text-center">
                  <span className="text-[10px] font-black font-mario text-amber-900 uppercase block">
                    ACCURACY BOUNTY
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-amber-700 font-display mt-1 inline-flex items-center justify-center gap-1.5">
                    <MarioCoinIcon className="w-6 h-6 shrink-0" />
                    <span>+{quickRewardedCoins}c</span>
                  </span>
                </div>
              </div>

              {/* Per-Question Breakdown */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-black uppercase font-mario text-slate-700">
                  5-QUESTION REVIEW BREAKDOWN
                </h4>
                <div className="space-y-2">
                  {quickRecords.map((rec, i) => (
                    <div
                      key={`${rec.question.id}-${i}`}
                      className={`p-3.5 rounded-2xl border-2 text-xs sm:text-sm space-y-1 ${
                        rec.isCorrect
                          ? 'bg-emerald-50/70 border-emerald-400'
                          : 'bg-rose-50/70 border-rose-400'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 font-black text-slate-950">
                        <span className="leading-snug">
                          Q{i + 1}. {rec.question.scenario}
                        </span>
                        <span
                          className={`shrink-0 font-mario text-[10px] px-2 py-0.5 rounded border ${
                            rec.isCorrect
                              ? 'bg-emerald-200 text-emerald-950 border-emerald-700'
                              : 'bg-rose-200 text-rose-950 border-rose-700'
                          }`}
                        >
                          {rec.isCorrect ? 'PASS' : 'MISS'}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-700">
                        Correct Rule: {rec.question.options[rec.question.correctIndex]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    startFreshQuickTest(activeWorld, studyDifficulty);
                    marioAudio.playPowerUp();
                  }}
                  className="min-h-[46px] px-7 inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-2xl border-3 border-black shadow-[0_4px_0_#000] cursor-pointer leading-none whitespace-nowrap"
                >
                  <Zap className="w-5 h-5 shrink-0" />
                  <span>Take Another 5-Question Quick Test</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== MODE 1: PRACTICE ARENA ==================== */}
      {activeMode === 'practice' && (
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-purple-950 text-white rounded-3xl p-5 sm:p-7 mario-card border-4 border-slate-950">
            <div className="flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400 text-slate-950 font-black rounded-lg border border-black text-xs uppercase leading-none">
                  <Mario1UpIcon className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span>
                    {studyDifficulty === 'casual'
                      ? 'CASUAL DEFINITIONS ARENA'
                      : 'EXAM PREP BAR ARENA'}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white font-display">
                  LABOR LAW DOCTRINE GAUNTLET
                </h2>
                <p className="text-xs sm:text-sm text-purple-100 font-bold max-w-xl">
                  {studyDifficulty === 'casual'
                    ? 'Casual Mode active: concise definition & threshold questions with 3 clear choices and statutory hints across all 6 Worlds & Holidays.'
                    : 'Exam Prep Mode active: full 4-option Bar Exam hypothetical fact patterns across all 6 Worlds & Holidays.'}
                </p>
              </div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-amber-400 border-3 border-black rounded-2xl flex items-center justify-center shadow-[4px_4px_0_#000] shrink-0">
                <Trophy className="w-8 h-8 text-slate-950" />
              </div>
            </div>
          </div>

          {/* World Filter & Deck Length Bar */}
          <div className="bg-white rounded-2xl border-4 border-slate-950 p-3.5 shadow-[4px_4px_0_#000] flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-black uppercase text-slate-700 inline-flex items-center gap-1 font-mario mr-1">
                  <Filter className="w-3.5 h-3.5" /> Topic:
                </span>
                {(
                  [
                    { id: 'all', label: `All (${fullPracticePoolForDifficulty.length})` },
                    { id: 'w1', label: 'W1' },
                    { id: 'w2', label: 'W2' },
                    { id: 'holidays', label: 'Holidays' },
                    { id: 'w3', label: 'W3' },
                    { id: 'w4', label: 'W4' },
                    { id: 'w5', label: 'W5' },
                    { id: 'w6', label: 'W6' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    data-testid={`practice-topic-${tab.id}`}
                    onClick={() => {
                      resetPracticeRun(tab.id, 999, false);
                      marioAudio.playJump();
                    }}
                    className={`min-h-[44px] min-w-[44px] px-3 inline-flex items-center justify-center rounded-xl text-xs font-black border-2 border-black transition-all cursor-pointer leading-none whitespace-nowrap tabular-nums ${
                      worldFilter === tab.id
                        ? 'bg-amber-400 text-slate-950 shadow-[0_2px_0_#000]'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {([15, 30, 999] as const).map((len) => (
                  <button
                    key={len}
                    type="button"
                    onClick={() => {
                      resetPracticeRun(worldFilter, len, false);
                      marioAudio.playPipe();
                    }}
                    className={`min-h-[44px] px-3 inline-flex items-center justify-center rounded-xl text-xs font-black border-2 border-black cursor-pointer leading-none whitespace-nowrap ${
                      runLimit === len
                        ? 'bg-slate-950 text-amber-300'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {len === 999 ? 'Full Deck' : `${len} Qs`}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    resetPracticeRun(worldFilter, runLimit, true);
                    marioAudio.playPowerUp();
                  }}
                  className="min-h-[44px] px-3.5 inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs border-2 border-black shadow-[0_2px_0_#000] cursor-pointer leading-none whitespace-nowrap"
                >
                  <Shuffle className="w-3.5 h-3.5 shrink-0" />
                  <span>Shuffle</span>
                </button>
              </div>
            </div>
          </div>

          {!isQuizComplete && q ? (
            <div className="bg-white rounded-3xl mario-card border-4 border-slate-950 p-4 sm:p-7 space-y-5">
              <div className="space-y-2 border-b-2 border-slate-200 pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-black text-slate-800">
                  <span className="inline-flex items-center gap-2 text-red-600">
                    <span className="font-mario text-[11px]">
                      STAGE {currentIdx + 1} OF {activePracticePool.length}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-700">{q.world}</span>
                  </span>
                  <span className="text-emerald-800 font-extrabold text-xs tabular-nums">
                    Score: {score} / {currentIdx + (isAnswerSubmitted ? 1 : 0)}
                  </span>
                </div>

                <div className="w-full bg-slate-200 h-3 rounded-full border-2 border-black overflow-hidden">
                  <div
                    className="bg-amber-400 h-full border-r-2 border-black transition-all duration-300"
                    style={{ width: `${((currentIdx + 1) / activePracticePool.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-50 border-3 border-slate-800 rounded-2xl p-4 sm:p-6 space-y-2">
                <span className="text-xs font-black uppercase text-amber-700 tracking-wider font-mario block">
                  {studyDifficulty === 'casual'
                    ? `DEFINITION PROMPT #${currentIdx + 1}:`
                    : `FACT PATTERN / SCENARIO #${q.id}:`}
                </span>
                <p className={`${bodyTextClass} font-extrabold text-slate-950 leading-relaxed`}>
                  &ldquo;{q.scenario}&rdquo;
                </p>
                {studyDifficulty === 'casual' && q.hint && (
                  <div className="pt-2 border-t border-slate-200 flex items-start gap-2 text-xs font-bold text-amber-900">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>Hint: {q.hint}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2.5">
                {q.options.map((option, idx) => {
                  let optStyle = 'bg-white hover:bg-slate-100 border-slate-800 text-slate-900';
                  if (selectedAnswer === idx) {
                    optStyle = 'bg-amber-100 border-amber-600 text-amber-950 ring-2 ring-amber-400';
                  }
                  if (isAnswerSubmitted) {
                    if (idx === q.correctIndex) {
                      optStyle = 'bg-emerald-100 border-emerald-700 text-emerald-950 ring-4 ring-emerald-400';
                    } else if (selectedAnswer === idx) {
                      optStyle = 'bg-rose-100 border-rose-600 text-rose-950';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswerSubmitted}
                      className={`w-full min-h-[52px] text-left p-3.5 sm:p-4 rounded-xl border-3 transition-all flex items-start gap-3 cursor-pointer ${optStyle}`}
                    >
                      <span className="inline-flex items-center justify-center w-8 h-8 shrink-0 rounded-lg bg-slate-950 text-white text-sm font-black font-mario">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className={`${bodyTextClass} font-bold leading-normal pt-0.5`}>{option}</span>
                    </button>
                  );
                })}
              </div>

              {isAnswerSubmitted && (
                <div
                  className={`p-4 sm:p-5 rounded-2xl border-3 space-y-2 ${
                    selectedAnswer === q.correctIndex
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950'
                      : 'bg-rose-50 border-rose-600 text-rose-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-black text-base">
                    {selectedAnswer === q.correctIndex ? (
                      <>
                        <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                        <span className="font-mario text-xs sm:text-sm">
                          CORRECT! +{studyDifficulty === 'exam_prep' ? 6 : 4} COINS EARNED!
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                        <span className="font-mario text-xs sm:text-sm">INCORRECT</span>
                      </>
                    )}
                  </div>
                  <p className={`${bodyTextClass} font-medium`}>{q.explanation}</p>
                  <div className="pt-2 border-t border-black/20 text-xs font-black uppercase text-slate-700">
                    Legal Basis: {q.legalBasis}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between pt-4 border-t-2 border-slate-200 gap-3">
                <button
                  type="button"
                  onClick={() => resetPracticeRun(worldFilter, runLimit, false)}
                  className="min-h-[44px] px-4 inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black rounded-xl border-2 border-black text-xs sm:text-sm cursor-pointer leading-none whitespace-nowrap"
                >
                  <RotateCcw className="w-4 h-4 shrink-0" />
                  <span>Restart Set</span>
                </button>

                {!isAnswerSubmitted ? (
                  <button
                    type="button"
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                    className="min-h-[44px] px-6 inline-flex items-center justify-center bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_4px_0_#000] active:translate-y-0.5 text-sm sm:text-base cursor-pointer leading-none whitespace-nowrap flex-1 sm:flex-initial"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="min-h-[44px] px-6 inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl border-3 border-black shadow-[0_4px_0_#000] active:translate-y-0.5 text-sm sm:text-base cursor-pointer leading-none whitespace-nowrap flex-1 sm:flex-initial"
                  >
                    <span>
                      {currentIdx < activePracticePool.length - 1
                        ? 'Next Question'
                        : 'View Final Results'}
                    </span>
                    <ArrowRight className="w-5 h-5 shrink-0" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl mario-card border-4 border-slate-950 p-6 sm:p-10 text-center space-y-6">
              <div className="w-20 h-20 bg-amber-400 border-4 border-black rounded-full mx-auto flex items-center justify-center shadow-[0_4px_0_#000]">
                <MarioFlagIcon className="w-10 h-10" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-950 font-display">
                COURSE CLEARED!
              </h3>
              <p className={`${bodyTextClass} text-slate-700 font-extrabold max-w-md mx-auto`}>
                You scored <span className="text-red-600 text-3xl font-black">{score}</span> out of{' '}
                {activePracticePool.length}!
              </p>

              <div className="bg-amber-50 border-3 border-amber-400 rounded-2xl p-5 max-w-md mx-auto">
                {score >= Math.ceil(activePracticePool.length * 0.8) ? (
                  <div className="space-y-1">
                    <span className="flex items-center justify-center gap-2 text-lg sm:text-xl font-black text-amber-600 font-mario">
                      <MarioStarIcon className="w-6 h-6" /> SUPER STAR RANK!
                    </span>
                    <p className="font-extrabold text-emerald-800 text-sm">
                      Outstanding mastery of Philippine Labor Standards and Protective Laws!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <span className="flex items-center justify-center gap-2 text-lg sm:text-xl font-black text-red-600 font-mario">
                      <MarioMushroomIcon className="w-6 h-6" /> SOLID FOUNDATION!
                    </span>
                    <p className="font-extrabold text-amber-800 text-sm">
                      Review the Modules or Flashcards to master every statutory exception.
                    </p>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => resetPracticeRun(worldFilter, runLimit, true)}
                className="min-h-[48px] px-7 inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-2xl border-3 border-black shadow-[0_4px_0_#000] cursor-pointer leading-none whitespace-nowrap"
              >
                <RotateCcw className="w-5 h-5 shrink-0" />
                <span>Retake Shuffled Arena</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================== MODE 2: BOWSER BOSS BATTLE ==================== */}
      {activeMode === 'boss' && (
        <div className="space-y-6">
          {bossBattleState === 'intro' && (
            <div className="bg-gradient-to-b from-[#450a0a] via-[#1c1917] to-[#0c0a09] text-white rounded-3xl p-5 sm:p-8 border-4 border-slate-950 shadow-[6px_6px_0_#000] text-center space-y-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-950 border-4 border-red-600 rounded-3xl mx-auto flex items-center justify-center shadow-[0_4px_0_#000]">
                <MarioBowserIcon className="w-14 h-14 sm:w-16 sm:h-16" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-amber-400 tracking-wider font-mario">
                  WORLD 8-4 • 30-SCENARIO BOSS POOL
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white font-display">
                  BOWSER&apos;S LAVA KEEP GAUNTLET
                </h2>
                <p className={`${bodyTextClass} text-slate-300 max-w-xl mx-auto font-medium text-sm`}>
                  Face randomized rapid-fire Bar Exam traps! ({studyDifficulty === 'casual' ? 'Casual: 3 options + statutory hints' : 'Exam Prep: 4 options, no hints'}).
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handleStartBossBattle('standard')}
                  className="min-h-[48px] px-5 inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-black text-xs sm:text-base rounded-2xl border-3 border-black shadow-[0_4px_0_#000] cursor-pointer leading-none whitespace-nowrap"
                >
                  <Flame className="w-5 h-5 text-amber-300 shrink-0" />
                  <span>STANDARD BOWSER (100 HP)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStartBossBattle('mega')}
                  className="min-h-[48px] px-5 inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-base rounded-2xl border-3 border-black shadow-[0_4px_0_#000] cursor-pointer leading-none whitespace-nowrap"
                >
                  <MarioStarIcon className="w-5 h-5 shrink-0" />
                  <span>MEGA BOWSER (200 HP • +200c)</span>
                </button>
              </div>
            </div>
          )}

          {bossBattleState === 'combat' && bossQ && (
            <div className="bg-gradient-to-b from-[#2a0808] to-[#0f172a] rounded-3xl p-4 sm:p-8 border-4 border-slate-950 shadow-[6px_6px_0_#000] text-white space-y-5">
              <div className="bg-black/80 rounded-2xl p-3.5 sm:p-4 border-2 border-red-700/80 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                    <MarioBowserIcon className="w-9 h-9 shrink-0" />
                    <div className="flex-1 max-w-md">
                      <div className="flex justify-between text-xs font-black font-mario mb-1 tabular-nums">
                        <span className="text-red-400">{bossTier === 'mega' ? 'MEGA BOWSER' : 'BOWSER'} HP</span>
                        <span className="text-amber-400">
                          {bossHp}/{bossMaxHp}
                        </span>
                      </div>
                      <div className="w-full bg-slate-900 h-4 rounded-full border border-black overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 h-full transition-all duration-300"
                          style={{ width: `${(bossHp / bossMaxHp) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div
                      className={`h-9 px-3 inline-flex items-center gap-1.5 rounded-xl border-2 font-mario text-xs tabular-nums ${
                        timeLeft <= 8
                          ? 'bg-red-600 text-white border-white animate-bounce'
                          : 'bg-slate-900 border-slate-700 text-amber-400'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>{timeLeft}s</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: bossTier === 'mega' ? 4 : 3 }).map((_, idx) => (
                        <Heart
                          key={idx}
                          className={`w-5 h-5 sm:w-6 sm:h-6 ${
                            idx + 1 <= playerHearts ? 'text-red-500 fill-red-500' : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {comboStreak > 1 && (
                  <div className="flex items-center gap-1.5 text-xs font-black font-mario text-amber-300">
                    <MarioFireballIcon className="w-4 h-4 shrink-0" />
                    <span>{comboStreak}x COMBO STREAK!</span>
                  </div>
                )}
              </div>

              <div className="bg-slate-900/90 border-3 border-red-900 rounded-2xl p-4 sm:p-6 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-black font-mario text-red-400">
                  <span>ROUND {bossIdx + 1}</span>
                  <span className="text-slate-400">{bossQ.world}</span>
                </div>
                <p className={`${bodyTextClass} font-bold text-white leading-relaxed`}>
                  &ldquo;{bossQ.scenario}&rdquo;
                </p>
                {studyDifficulty === 'casual' && bossQ.hint && (
                  <p className="text-xs font-semibold text-amber-300 pt-1">
                    {bossQ.hint}
                  </p>
                )}
              </div>

              <div className="space-y-2.5">
                {bossQ.options.map((opt, idx) => {
                  let optStyle = 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 text-slate-100';
                  if (bossSelectedAnswer === idx) {
                    optStyle = 'bg-amber-400/20 border-amber-400 text-white ring-2 ring-amber-400';
                  }
                  if (bossAnswerSubmitted) {
                    if (idx === bossQ.correctIndex) {
                      optStyle = 'bg-emerald-900/80 border-emerald-500 text-emerald-100 ring-2 ring-emerald-400';
                    } else if (bossSelectedAnswer === idx) {
                      optStyle = 'bg-red-950/80 border-red-600 text-red-200';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectBossOption(idx)}
                      disabled={bossAnswerSubmitted}
                      className={`w-full min-h-[50px] text-left p-3.5 sm:p-4 rounded-xl border-2 transition-all flex items-start gap-3 cursor-pointer ${optStyle}`}
                    >
                      <span className="inline-flex items-center justify-center w-7 h-7 shrink-0 rounded-lg bg-black text-amber-400 text-xs font-black font-mario">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className={`${bodyTextClass} font-semibold leading-normal`}>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {bossAnswerSubmitted && (
                <div
                  className={`p-4 rounded-xl border-2 space-y-1.5 ${
                    bossSelectedAnswer === bossQ.correctIndex
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-red-950/80 border-red-600 text-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-black text-xs sm:text-sm font-mario">
                    {bossSelectedAnswer === bossQ.correctIndex ? (
                      <>
                        <MarioFireballIcon className="w-5 h-5 shrink-0" />
                        <span>DIRECT HIT! -20 HP!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                        <span>LOST 1 HEART!</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs font-medium text-slate-300">
                    {bossQ.explanation} ({bossQ.legalBasis})
                  </p>
                </div>
              )}

              <div className="flex justify-end pt-2">
                {!bossAnswerSubmitted ? (
                  <button
                    type="button"
                    onClick={handleSubmitBossAnswer}
                    disabled={bossSelectedAnswer === null}
                    className="min-h-[46px] w-full sm:w-auto px-7 inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-black rounded-xl border-2 border-black shadow-[0_3px_0_#000] cursor-pointer leading-none whitespace-nowrap"
                  >
                    <MarioFireballIcon className="w-5 h-5 shrink-0" />
                    <span>LAUNCH FIREBALL</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNextBossQuestion}
                    className="min-h-[46px] w-full sm:w-auto px-7 inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-2 border-black shadow-[0_3px_0_#000] cursor-pointer leading-none whitespace-nowrap"
                  >
                    <span>NEXT ROUND</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                )}
              </div>
            </div>
          )}

          {bossBattleState === 'victory' && (
            <div className="bg-gradient-to-b from-amber-950 via-slate-900 to-black text-white rounded-3xl p-6 sm:p-10 border-4 border-amber-400 shadow-[6px_6px_0_#000] text-center space-y-6">
              <div className="w-24 h-24 bg-amber-400 border-4 border-black rounded-full mx-auto flex items-center justify-center shadow-[0_4px_0_#000]">
                <MarioAxeIcon className="w-12 h-12" />
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-white font-display">
                YOU CONQUERED THE LAVA KEEP!
              </h3>
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-emerald-400 font-mario">
                <MarioCoinIcon className="w-5 h-5 shrink-0" />
                <span>+{bossTier === 'mega' ? 200 : 100} MARIO COINS ADDED!</span>
              </div>
              <button
                type="button"
                onClick={() => setBossBattleState('intro')}
                className="min-h-[48px] px-8 inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-2xl border-3 border-black shadow-[0_4px_0_#000] cursor-pointer leading-none whitespace-nowrap"
              >
                <RotateCcw className="w-5 h-5 shrink-0" />
                <span>Battle Bowser Again</span>
              </button>
            </div>
          )}

          {bossBattleState === 'defeat' && (
            <div className="bg-gradient-to-b from-[#2a0808] to-black text-white rounded-3xl p-6 sm:p-10 border-4 border-red-700 shadow-[6px_6px_0_#000] text-center space-y-6">
              <div className="w-20 h-20 bg-red-950 border-4 border-black rounded-full mx-auto flex items-center justify-center shadow-[0_4px_0_#000]">
                <MarioBowserIcon className="w-12 h-12" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-display">
                DEFEATED IN THE LAVA KEEP!
              </h3>
              <button
                type="button"
                onClick={() => handleStartBossBattle(bossTier)}
                className="min-h-[48px] px-8 inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl border-3 border-black shadow-[0_4px_0_#000] cursor-pointer leading-none whitespace-nowrap"
              >
                <RotateCcw className="w-5 h-5 shrink-0" />
                <span>Retry Boss Battle</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
