import React, { useState, useEffect, useMemo } from 'react';
import { FLASHCARDS_DATA } from '../data/flashcardsData';
import { ALL_LAW_TOPICS } from '../data/laborLawData';
import { Flashcard, StudyDifficulty } from '../types/laborLaw';
import {
  filterFlashcardsForDifficulty,
  buildFlashcardExamChoices,
  mapActiveWorldToFlashcardWorldNum,
  buildQuickStudyCuratedDeck,
  QUICK_STUDY_DURATION_SECONDS,
} from '../utils/studyModes';
import { formatPomodoroSeconds } from '../utils/engagementFeatures';
import { PlayerProfileStats } from '../utils/profileAchievements';
import { marioAudio } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  RotateCw,
  ArrowLeft,
  ArrowRight,
  Shuffle,
  CheckCircle,
  XCircle,
  Sparkles,
  Filter,
  GraduationCap,
  Feather,
  Zap,
  Clock,
  Pause,
  Play,
  Flag,
} from 'lucide-react';
import { MarioStarIcon, MarioCoinIcon } from './MarioIcons';

interface FlashcardsViewProps {
  fontSize: 'normal' | 'large' | 'xlarge';
  onEarnCoin: () => void;
  onEarnCoins?: (amount: number) => void;
  studyDifficulty: StudyDifficulty;
  setStudyDifficulty: (difficulty: StudyDifficulty) => void;
  activeWorld?: string;
  profileStats?: PlayerProfileStats;
  completedTopicIds?: string[];
  onToggleNeedsImprovementWorld?: (worldId: string) => void;
  onOpenProfile?: () => void;
  quickStudyLaunchId?: number;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  fontSize,
  onEarnCoin,
  onEarnCoins,
  studyDifficulty,
  setStudyDifficulty,
  activeWorld = 'all',
  profileStats,
  completedTopicIds = [],
  onToggleNeedsImprovementWorld,
  onOpenProfile,
  quickStudyLaunchId = 0,
}) => {
  const [cards, setCards] = useState<Flashcard[]>(FLASHCARDS_DATA);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedWorld, setSelectedWorld] = useState<number | 'all'>(() =>
    mapActiveWorldToFlashcardWorldNum(activeWorld)
  );
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());

  // Exam Prep Multiple-Choice state per card
  const [selectedMcqIdx, setSelectedMcqIdx] = useState<number | null>(null);

  // 5-Minute Quick Study Mode State
  const [isQuickStudyMode, setIsQuickStudyMode] = useState(false);
  const [quickStudyDeck, setQuickStudyDeck] = useState<Flashcard[]>([]);
  const [quickStudySourceLabel, setQuickStudySourceLabel] = useState('');
  const [quickStudySecondsLeft, setQuickStudySecondsLeft] = useState(QUICK_STUDY_DURATION_SECONDS);
  const [isQuickStudyPaused, setIsQuickStudyPaused] = useState(false);
  const [quickStudyFinished, setQuickStudyFinished] = useState(false);
  const [quickStudyReviewedCount, setQuickStudyReviewedCount] = useState(0);

  useEffect(() => {
    setSelectedWorld(mapActiveWorldToFlashcardWorldNum(activeWorld));
  }, [activeWorld]);

  const startQuickStudySprint = () => {
    const curated = buildQuickStudyCuratedDeck({
      allCards: FLASHCARDS_DATA,
      needsImprovementTopicIds: profileStats?.needsImprovementTopicIds || [],
      needsImprovementWorlds: profileStats?.needsImprovementWorlds || [],
      completedTopicIds,
      masteredCardIds: Array.from(masteredIds),
      allTopics: ALL_LAW_TOPICS.map((t) => ({
        id: t.id,
        worldId: t.worldId,
        title: t.title,
        subtitle: t.badge,
      })),
      deckSize: 15,
    });
    setQuickStudyDeck(curated.cards);
    setQuickStudySourceLabel(curated.sourceLabel);
    setQuickStudySecondsLeft(QUICK_STUDY_DURATION_SECONDS);
    setIsQuickStudyPaused(false);
    setQuickStudyFinished(false);
    setQuickStudyReviewedCount(0);
    setIsQuickStudyMode(true);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSelectedMcqIdx(null);
    marioAudio.playPowerUp();
  };

  useEffect(() => {
    if (quickStudyLaunchId > 0) {
      startQuickStudySprint();
    }
  }, [quickStudyLaunchId]);

  useEffect(() => {
    if (!isQuickStudyMode || isQuickStudyPaused || quickStudyFinished) return;
    const timer = window.setInterval(() => {
      setQuickStudySecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setQuickStudyFinished(true);
          marioAudio.playQuizComplete();
          if (onEarnCoins) onEarnCoins(20);
          else onEarnCoin();
          try {
            confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
          } catch {
            // ignore
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isQuickStudyMode, isQuickStudyPaused, quickStudyFinished]);

  const exitQuickStudyMode = () => {
    setIsQuickStudyMode(false);
    setQuickStudyFinished(false);
    setIsQuickStudyPaused(false);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSelectedMcqIdx(null);
    marioAudio.playPipe();
  };

  const standardFilteredCards = useMemo(
    () => filterFlashcardsForDifficulty(cards, studyDifficulty, selectedWorld),
    [cards, studyDifficulty, selectedWorld]
  );

  const filteredCards = isQuickStudyMode ? quickStudyDeck : standardFilteredCards;

  useEffect(() => {
    if (!isQuickStudyMode) {
      setCurrentIndex(0);
      setIsFlipped(false);
      setSelectedMcqIdx(null);
    }
  }, [studyDifficulty, selectedWorld, isQuickStudyMode]);

  const activeCard = filteredCards[currentIndex] || filteredCards[0];

  const examChoices = useMemo(
    () => (activeCard ? buildFlashcardExamChoices(activeCard, FLASHCARDS_DATA) : []),
    [activeCard]
  );

  const activeWorldIdForToggle = useMemo(() => {
    if (selectedWorld === 'all') return null;
    if (selectedWorld === 7) return 'holidays';
    return `world${selectedWorld}`;
  }, [selectedWorld]);

  const isSelectedWorldMarkedWeak = Boolean(
    activeWorldIdForToggle &&
      profileStats?.needsImprovementWorlds?.includes(activeWorldIdForToggle)
  );

  const totalNeedsImprovementCount =
    (profileStats?.needsImprovementTopicIds?.length || 0) +
    (profileStats?.needsImprovementWorlds?.length || 0);

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
    marioAudio.playJump();
  };

  const handleNext = () => {
    setIsFlipped(false);
    setSelectedMcqIdx(null);
    if (isQuickStudyMode && currentIndex >= filteredCards.length - 1) {
      setQuickStudyFinished(true);
      marioAudio.playQuizComplete();
      if (onEarnCoins) onEarnCoins(20);
      else onEarnCoin();
      try {
        confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
      return;
    }
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
    marioAudio.playPipe();
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setSelectedMcqIdx(null);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(Math.max(0, filteredCards.length - 1));
    }
    marioAudio.playPipe();
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setSelectedMcqIdx(null);
    if (isQuickStudyMode) {
      setQuickStudyDeck((prev) => [...prev].sort(() => Math.random() - 0.5));
    } else {
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      setCards(shuffled);
    }
    setCurrentIndex(0);
    marioAudio.playPowerUp();
  };

  const handleSelectMcqOption = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedMcqIdx !== null) return;
    setSelectedMcqIdx(idx);
    const picked = examChoices[idx];
    if (picked?.isCorrect) {
      marioAudio.playCoin();
      if (onEarnCoins) onEarnCoins(2);
      else onEarnCoin();
      if (isQuickStudyMode) {
        setQuickStudyReviewedCount((c) => c + 1);
      }
      try {
        confetti({ particleCount: 30, spread: 55, origin: { y: 0.7 } });
      } catch {
        // ignore
      }
    } else {
      marioAudio.playStomp();
    }
  };

  const handleMastered = () => {
    if (!activeCard) return;
    marioAudio.playCoin();
    onEarnCoin();
    if (isQuickStudyMode) {
      setQuickStudyReviewedCount((c) => c + 1);
    }

    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#e11d48', '#10b981', '#3b82f6'],
      });
    } catch {
      // ignore
    }

    setMasteredIds((prev) => new Set(prev).add(activeCard.id));
    handleNext();
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleFlip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isFlipped, filteredCards.length, isQuickStudyMode]);

  const bodyTextClass =
    fontSize === 'xlarge'
      ? 'text-xl sm:text-2xl leading-relaxed'
      : fontSize === 'large'
      ? 'text-lg sm:text-xl leading-relaxed'
      : 'text-base sm:text-lg leading-normal';

  return (
    <div className="space-y-5 max-w-4xl mx-auto w-full">
      {/* Header Banner + Quick Study Mode CTA */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 rounded-3xl p-4 sm:p-7 mario-card border-4 border-slate-950 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 text-white font-black rounded-lg border border-black text-[11px] uppercase font-mario">
              <span>
                {isQuickStudyMode
                  ? '5-MINUTE QUICK STUDY SPRINT'
                  : studyDifficulty === 'exam_prep'
                  ? 'EXAM PREP • MULTIPLE CHOICE BLOCKS'
                  : 'CASUAL • DEFINITION FLIP BLOCKS'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-display">
              {isQuickStudyMode
                ? 'CURATED WEAK-SPOT FLASHCARD DECK'
                : 'QUESTION MARK FLIP BLOCKS'}
            </h2>
            <p className="text-amber-100 font-bold text-xs sm:text-sm max-w-xl">
              {isQuickStudyMode
                ? quickStudySourceLabel
                : studyDifficulty === 'exam_prep'
                ? 'Exam Prep Mode: Test yourself with 4-option multiple-choice doctrines across all 6 Worlds & Holidays before flipping (+2c per correct pick)!'
                : 'Casual Mode: Focus on foundational definitions and statutory thresholds across Worlds 1–6 & Holidays. Tap the card to flip!'}
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 shrink-0 w-full sm:w-auto">
            {!isQuickStudyMode ? (
              <button
                type="button"
                data-testid="quick-study-mode-btn"
                onClick={startQuickStudySprint}
                className="min-h-[46px] w-full sm:w-auto px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 font-black rounded-2xl border-3 border-black shadow-[0_4px_0_#000] active:translate-y-0.5 inline-flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer whitespace-nowrap"
              >
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Quick Study Mode (5m)</span>
                {totalNeedsImprovementCount > 0 && (
                  <span className="text-emerald-300 tabular-nums">
                    · {totalNeedsImprovementCount} Flagged
                  </span>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={exitQuickStudyMode}
                className="min-h-[44px] w-full sm:w-auto px-4 py-2 bg-white hover:bg-slate-100 text-slate-950 font-black rounded-2xl border-3 border-black shadow-[0_3px_0_#000] inline-flex items-center justify-center gap-1.5 text-xs cursor-pointer whitespace-nowrap"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span>Back to Full {FLASHCARDS_DATA.length}-Card Deck</span>
              </button>
            )}
          </div>
        </div>

        {/* Active 5-Minute Quick Study Timer HUD */}
        {isQuickStudyMode && (
          <div
            data-testid="quick-study-timer-banner"
            className="bg-slate-950 text-white rounded-2xl p-3.5 sm:p-4 border-2 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-400 text-slate-950 border-2 border-black flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xl sm:text-2xl font-black text-amber-300 tabular-nums">
                    {formatPomodoroSeconds(quickStudySecondsLeft)}
                  </span>
                  <span className="text-xs font-bold text-slate-300 tabular-nums">
                    · {quickStudyDeck.length} Curated Cards · {quickStudyReviewedCount} Mastered
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Prioritizing topics marked &ldquo;Need Improvement&rdquo; in your Profile Stats (+20c sprint finish bonus).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsQuickStudyPaused((p) => !p)}
                className="min-h-[44px] px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-600 inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                {isQuickStudyPaused ? (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Resume</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-300" />
                    <span>Pause</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={startQuickStudySprint}
                className="min-h-[44px] px-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs border-2 border-black inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Refresh 5m Deck</span>
              </button>
              {onOpenProfile && (
                <button
                  type="button"
                  onClick={onOpenProfile}
                  className="min-h-[44px] px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-slate-600 inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Edit Weak Topics</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Filter, Difficulty Switch & Shuffle Controls (Hidden during Quick Study Sprint Summary) */}
      {!isQuickStudyMode && (
        <div className="bg-white rounded-2xl border-4 border-slate-900 p-3 sm:p-4 space-y-3 shadow-[4px_4px_0_#000]">
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            {/* Worlds 1–6 & Holidays Filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-black text-slate-700 inline-flex items-center gap-1 uppercase font-mario mr-1">
                <Filter className="w-3.5 h-3.5 shrink-0" /> Deck:
              </span>
              <button
                type="button"
                onClick={() => setSelectedWorld('all')}
                className={`min-h-[44px] px-3 inline-flex items-center justify-center rounded-xl text-xs font-black border-2 border-black transition-all cursor-pointer leading-none whitespace-nowrap tabular-nums ${
                  selectedWorld === 'all'
                    ? 'bg-amber-400 text-slate-950 shadow-[0_2px_0_#000]'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All ({filterFlashcardsForDifficulty(cards, studyDifficulty, 'all').length})
              </button>
              {[1, 2, 3, 4, 5, 6].map((w) => (
                <button
                  key={w}
                  type="button"
                  data-testid={`flashcard-world-${w}-btn`}
                  onClick={() => setSelectedWorld(w)}
                  className={`min-h-[44px] min-w-[44px] px-3 inline-flex items-center justify-center rounded-xl text-xs font-black border-2 border-black transition-all cursor-pointer leading-none whitespace-nowrap ${
                    selectedWorld === w
                      ? 'bg-amber-400 text-slate-950 shadow-[0_2px_0_#000]'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  W{w}
                </button>
              ))}
              <button
                type="button"
                data-testid="flashcard-holidays-btn"
                onClick={() => setSelectedWorld(7)}
                className={`min-h-[44px] px-3 inline-flex items-center justify-center rounded-xl text-xs font-black border-2 border-black transition-all cursor-pointer leading-none whitespace-nowrap ${
                  selectedWorld === 7
                    ? 'bg-red-600 text-white shadow-[0_2px_0_#000]'
                    : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                }`}
              >
                Holidays
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {activeWorldIdForToggle && onToggleNeedsImprovementWorld && (
                <button
                  type="button"
                  onClick={() => {
                    onToggleNeedsImprovementWorld(activeWorldIdForToggle);
                    marioAudio.playCoin();
                  }}
                  className={`min-h-[44px] px-3 inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-black font-black text-xs cursor-pointer leading-none whitespace-nowrap ${
                    isSelectedWorldMarkedWeak
                      ? 'bg-rose-600 text-white shadow-[0_2px_0_#000]'
                      : 'bg-amber-50 text-amber-950 hover:bg-amber-100'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {isSelectedWorldMarkedWeak ? 'Marked Need Improvement' : 'Flag Need Improvement'}
                  </span>
                </button>
              )}

              {/* Inline Difficulty Switcher */}
              <button
                type="button"
                onClick={() =>
                  setStudyDifficulty(studyDifficulty === 'casual' ? 'exam_prep' : 'casual')
                }
                className={`min-h-[44px] px-3 inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-black font-black text-xs cursor-pointer leading-none whitespace-nowrap ${
                  studyDifficulty === 'exam_prep'
                    ? 'bg-red-600 text-white shadow-[0_2px_0_#000]'
                    : 'bg-emerald-400 text-slate-950 shadow-[0_2px_0_#000]'
                }`}
              >
                {studyDifficulty === 'exam_prep' ? (
                  <>
                    <GraduationCap className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span>Exam Prep (MCQ)</span>
                  </>
                ) : (
                  <>
                    <Feather className="w-3.5 h-3.5 shrink-0" />
                    <span>Casual (Definitions)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleShuffle}
                className="min-h-[44px] px-3.5 inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl border-2 border-black shadow-[0_2px_0_#000] active:translate-y-0.5 text-xs cursor-pointer leading-none whitespace-nowrap"
              >
                <Shuffle className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>Shuffle</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Study Finished Summary Card */}
      {isQuickStudyMode && quickStudyFinished ? (
        <div
          data-testid="quick-study-complete-card"
          className="bg-white rounded-3xl mario-card border-4 border-slate-950 p-6 sm:p-8 text-center space-y-5"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-400 border-3 border-black mx-auto flex items-center justify-center shadow-[0_4px_0_#000]">
            <MarioStarIcon className="w-9 h-9" />
          </div>
          <div className="space-y-1.5">
            <span className="text-xs font-black uppercase text-emerald-700 font-mario block">
              5-MINUTE QUICK STUDY SPRINT COMPLETE
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 font-display">
              WEAK-SPOT DECK CLEARED!
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-600 max-w-lg mx-auto">
              You reviewed {quickStudyDeck.length} targeted flashcards ({quickStudyReviewedCount} mastered during this sprint) and earned +20 bonus coins!
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={startQuickStudySprint}
              className="min-h-[46px] px-6 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-2xl border-3 border-black shadow-[0_4px_0_#000] inline-flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer whitespace-nowrap"
            >
              <Zap className="w-4 h-4 shrink-0" />
              <span>Start Another 5-Min Sprint</span>
            </button>
            <button
              type="button"
              onClick={exitQuickStudyMode}
              className="min-h-[46px] px-6 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl border-3 border-black shadow-[0_4px_0_#000] inline-flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer whitespace-nowrap"
            >
              <span>Return to All Flashcards</span>
            </button>
          </div>
        </div>
      ) : activeCard ? (
        <div className="space-y-4">
          <div
            onClick={studyDifficulty === 'casual' || isFlipped ? handleFlip : undefined}
            data-testid="flashcard-surface"
            className={`${
              studyDifficulty === 'casual' || isFlipped ? 'cursor-pointer' : ''
            } transition-all duration-200 rounded-3xl p-4 sm:p-7 md:p-9 min-h-[300px] sm:min-h-[340px] flex flex-col justify-between border-4 border-slate-950 mario-card select-none ${
              isFlipped ? 'bg-white' : 'mario-box'
            }`}
          >
            {/* Top Metadata Bar */}
            <div className="flex items-center justify-between border-b-2 border-slate-900/20 pb-3 gap-2 flex-wrap text-xs font-bold text-slate-900">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-black text-slate-950">{activeCard.world}</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-700">{activeCard.difficulty}</span>
              </div>

              <div className="flex items-center gap-2 font-black text-xs text-slate-900 tabular-nums">
                <span className="font-mario text-[10px]">
                  Card {currentIndex + 1}/{filteredCards.length}
                </span>
                {masteredIds.has(activeCard.id) && (
                  <span className="text-emerald-800 inline-flex items-center gap-1 font-bold text-xs">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" /> Mastered
                  </span>
                )}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="py-5 sm:py-7 space-y-4">
              {!isFlipped ? (
                studyDifficulty === 'casual' ? (
                  /* CASUAL MODE: Clean Definition Flip Card */
                  <div className="space-y-4 max-w-2xl mx-auto text-center">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/70 border-3 border-black rounded-2xl mx-auto flex items-center justify-center text-2xl font-black text-slate-950 shadow-[0_3px_0_#000]">
                      ?
                    </div>
                    <span className="text-[10px] font-black uppercase font-mario text-emerald-900 block">
                      CORE DEFINITION &amp; THRESHOLD
                    </span>
                    <h3 className={`${bodyTextClass} font-black text-slate-950 leading-relaxed px-1`}>
                      &ldquo;{activeCard.question}&rdquo;
                    </h3>
                    <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-950 text-amber-300 rounded-xl font-black text-[11px] uppercase font-mario shadow-sm">
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>TAP TO FLIP DEFINITION</span>
                    </div>
                  </div>
                ) : (
                  /* EXAM PREP MODE: Harder 4-Option Multiple Choice Challenge */
                  <div className="space-y-4 max-w-2xl mx-auto">
                    <div className="text-center space-y-1.5">
                      <span className="text-[10px] font-black uppercase font-mario text-red-800 block">
                        EXAM PREP MULTIPLE-CHOICE CHALLENGE
                      </span>
                      <h3 className={`${bodyTextClass} font-black text-slate-950 leading-snug`}>
                        &ldquo;{activeCard.question}&rdquo;
                      </h3>
                    </div>

                    <div className="space-y-2">
                      {examChoices.map((choice, cIdx) => {
                        const isPicked = selectedMcqIdx === cIdx;
                        const answered = selectedMcqIdx !== null;
                        let btnStyle =
                          'bg-white/95 hover:bg-white border-slate-900 text-slate-950';
                        if (answered) {
                          if (choice.isCorrect) {
                            btnStyle =
                              'bg-emerald-100 border-emerald-700 text-emerald-950 ring-2 ring-emerald-500';
                          } else if (isPicked) {
                            btnStyle = 'bg-rose-100 border-rose-600 text-rose-950';
                          } else {
                            btnStyle = 'bg-white/60 border-slate-400 text-slate-600';
                          }
                        }

                        return (
                          <button
                            key={cIdx}
                            type="button"
                            onClick={(e) => handleSelectMcqOption(cIdx, e)}
                            disabled={answered}
                            className={`w-full min-h-[48px] text-left p-3 rounded-xl border-2 transition-all flex items-start gap-2.5 cursor-pointer ${btnStyle}`}
                          >
                            <span className="inline-flex items-center justify-center w-6 h-6 shrink-0 rounded-md bg-slate-950 text-amber-300 text-xs font-black font-mario mt-0.5">
                              {String.fromCharCode(65 + cIdx)}
                            </span>
                            <span className="text-xs sm:text-sm font-bold leading-snug flex-1">
                              {choice.text}
                            </span>
                            {answered && choice.isCorrect && (
                              <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                            )}
                            {answered && isPicked && !choice.isCorrect && (
                              <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex justify-center pt-1">
                      <button
                        type="button"
                        onClick={handleFlip}
                        className="min-h-[44px] px-4 inline-flex items-center justify-center gap-1.5 bg-slate-950 hover:bg-slate-800 text-amber-300 rounded-xl font-black text-xs uppercase font-mario cursor-pointer"
                      >
                        <RotateCw className="w-3.5 h-3.5 shrink-0" />
                        <span>Reveal Full Doctrine</span>
                      </button>
                    </div>
                  </div>
                )
              ) : (
                /* REVEALED BACK OF FLASHCARD */
                <div className="space-y-4 text-left bg-slate-50 p-4 sm:p-6 rounded-2xl border-3 border-emerald-600 shadow-sm">
                  <div className="bg-amber-100/90 border-2 border-amber-400 rounded-xl p-3 sm:p-4 flex items-start gap-2.5">
                    <MarioStarIcon className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-black uppercase text-amber-900 block font-mario">
                        CORE DEFINITION / TAKEAWAY:
                      </span>
                      <p className="text-sm sm:text-base font-black text-slate-950 mt-0.5">
                        {activeCard.keyTakeaway}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-emerald-900 font-black text-xs uppercase font-mario">
                      <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>COMPLETE STATUTORY PROVISION:</span>
                    </div>
                    <p className={`${bodyTextClass} font-bold text-slate-900 leading-relaxed`}>
                      {activeCard.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Bar: Quick Hint */}
            <div className="flex items-center justify-between border-t-2 border-slate-900/20 pt-3 text-xs font-bold text-slate-800 gap-2 flex-wrap">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFlip();
                }}
                className="min-h-[44px] inline-flex items-center gap-1 text-slate-900 font-black cursor-pointer hover:underline"
              >
                <RotateCw className="w-3.5 h-3.5 shrink-0" />
                <span>{isFlipped ? 'Flip back to prompt' : 'Flip card'}</span>
              </button>
              <span className="inline-flex items-center gap-1 text-amber-900 font-black">
                <MarioCoinIcon className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {studyDifficulty === 'exam_prep' ? '+2c Correct MCQ · +1c Mastered' : '+1 Coin on Mastery'}
                </span>
              </span>
            </div>
          </div>

          {/* Navigation Controls - Ergonomic 44px+ Mobile Targets */}
          <div className="grid grid-cols-3 sm:flex sm:items-center sm:justify-between gap-2.5 pt-1">
            <button
              type="button"
              onClick={handlePrev}
              className="min-h-[46px] px-3 sm:px-6 inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-100 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_3px_0_#000] active:translate-y-0.5 text-xs sm:text-sm cursor-pointer leading-none whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>Prev</span>
            </button>

            <button
              type="button"
              onClick={handleMastered}
              className="min-h-[46px] px-3 sm:px-7 inline-flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_3px_0_#000] active:translate-y-0.5 text-xs sm:text-sm cursor-pointer leading-none whitespace-nowrap"
            >
              <CheckCircle className="w-4 h-4 text-emerald-800 shrink-0" />
              <span className="truncate">Mastered (+1c)</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="min-h-[46px] px-3 sm:px-6 inline-flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl border-3 border-black shadow-[0_3px_0_#000] active:translate-y-0.5 text-xs sm:text-sm cursor-pointer leading-none whitespace-nowrap"
            >
              <span>{isQuickStudyMode && currentIndex === filteredCards.length - 1 ? 'Finish' : 'Next'}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center p-8 bg-white rounded-2xl border-4 border-slate-900">
          <p className="font-bold text-slate-700 text-lg">No cards available in this category.</p>
        </div>
      )}
    </div>
  );
};
