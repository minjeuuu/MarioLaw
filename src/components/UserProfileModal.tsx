import React, { useState, useEffect } from 'react';
import {
  X,
  Trophy,
  Clock,
  Award,
  Flame,
  CheckCircle2,
  Lock,
  ArrowRight,
  Edit3,
  Check,
  BookOpen,
  Compass,
  StickyNote,
  ShoppingBag,
  Flag,
  Zap,
  Crown,
} from 'lucide-react';
import {
  MarioCharacterAvatar,
  MarioCoinIcon,
  MarioMushroomIcon,
  MarioStarIcon,
  MarioPeachCrownIcon,
  MarioBowserIcon,
} from './MarioIcons';
import { MarioAvatar } from '../types/laborLaw';
import { HERO_ROSTER, getHeroMeta } from '../data/heroesData';
import { ALL_LAW_TOPICS, WORLDS_METADATA } from '../data/laborLawData';
import {
  EvaluatedAchievement,
  PlayerProfileStats,
  formatStudyDuration,
  getWeeklyPomodoroChartData,
  WeeklyPomodoroDayData,
  readStoredDailyStudyGoal,
  saveStoredDailyStudyGoal,
  computeDailyStudyGoalStatus,
} from '../utils/profileAchievements';
import { marioAudio } from '../utils/audio';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PlayerProfileStats;
  onUpdatePlayerName: (name: string) => void;
  achievements: EvaluatedAchievement[];
  equippedAvatar: MarioAvatar;
  onSelectAvatar: (avatar: MarioAvatar) => void;
  coins: number;
  loginStreak: number;
  completedTopicsCount: number;
  totalTopicsCount: number;
  onNavigateAction: (tab: string, worldId?: string) => void;
  onOpenWalkthrough: () => void;
  onOpenExportScoreCard: () => void;
  onToggleNeedsImprovementTopic?: (topicId: string) => void;
  onToggleNeedsImprovementWorld?: (worldId: string) => void;
  onStartQuickStudy?: () => void;
  onOpenLeaderboard?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  stats,
  onUpdatePlayerName,
  achievements,
  equippedAvatar,
  onSelectAvatar,
  coins,
  loginStreak,
  completedTopicsCount,
  totalTopicsCount,
  onNavigateAction,
  onOpenWalkthrough,
  onOpenExportScoreCard,
  onToggleNeedsImprovementTopic,
  onToggleNeedsImprovementWorld,
  onStartQuickStudy,
  onOpenLeaderboard,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(stats.playerName);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showAllTopicsChecklist, setShowAllTopicsChecklist] = useState(false);
  const [dailyGoalTarget, setDailyGoalTarget] = useState<number>(() => readStoredDailyStudyGoal());
  const goalStatus = computeDailyStudyGoalStatus(stats, dailyGoalTarget);

  const handleSelectGoalMinutes = (mins: number) => {
    setDailyGoalTarget(mins);
    saveStoredDailyStudyGoal(mins);
    marioAudio.playCoin();
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const heroMeta = getHeroMeta(equippedAvatar);
  const overallProgressPercent = Math.min(
    100,
    Math.round((completedTopicsCount / Math.max(1, totalTopicsCount)) * 100)
  );

  const weakTopicIds = stats.needsImprovementTopicIds || [];
  const weakWorlds = stats.needsImprovementWorlds || [];
  const totalWeakCount = weakTopicIds.length + weakWorlds.length;

  const heroRank =
    unlockedCount >= 10 || overallProgressPercent >= 100
      ? 'Invincible Star Bar Grandmaster'
      : unlockedCount >= 6 || overallProgressPercent >= 65
      ? 'Fire Flower Statutory Specialist'
      : unlockedCount >= 3 || overallProgressPercent >= 30
      ? 'Super Mushroom Labor Advocate'
      : 'Stage 1-1 Law Challenger';

  const visibleAchievements = achievements.filter((item) => {
    if (filterTab === 'unlocked') return item.unlocked;
    if (filterTab === 'locked') return !item.unlocked;
    return true;
  });

  const handleSaveName = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleaned = nameInput.trim();
    if (cleaned) {
      onUpdatePlayerName(cleaned);
    } else {
      setNameInput(stats.playerName);
    }
    setIsEditingName(false);
    marioAudio.playCoin();
  };

  const renderBadgeIcon = (iconKey: EvaluatedAchievement['iconKey']) => {
    switch (iconKey) {
      case 'clock':
        return <Clock className="w-6 h-6 text-sky-400" />;
      case 'trophy':
        return <Trophy className="w-6 h-6 text-amber-400" />;
      case 'wage_crown':
        return <MarioPeachCrownIcon className="w-6 h-6" />;
      case 'mushroom':
        return <MarioMushroomIcon className="w-6 h-6" />;
      case 'flame':
        return <Flame className="w-6 h-6 text-orange-400" />;
      case 'bowser':
        return <MarioBowserIcon className="w-6 h-6" />;
      case 'book':
        return <BookOpen className="w-6 h-6 text-emerald-400" />;
      case 'notes':
        return <StickyNote className="w-6 h-6 text-yellow-300" />;
      case 'compass':
        return <Compass className="w-6 h-6 text-cyan-400" />;
      case 'star':
      default:
        return <MarioStarIcon className="w-6 h-6" />;
    }
  };

  return (
    <div
      role="dialog"
      aria-label="User Profile and Achievements"
      data-testid="user-profile-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xs select-none overflow-y-auto print:hidden"
    >
      <div className="bg-[#1e293b] text-white w-screen h-[100dvh] max-h-[100dvh] rounded-none border-0 sm:w-full sm:max-w-4xl sm:h-auto sm:max-h-[92vh] sm:rounded-3xl sm:border-4 sm:border-slate-950 shadow-[8px_8px_0_#000] overflow-hidden my-auto flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        {/* Top Modal Header */}
        <div className="bg-[#0f172a] px-4 sm:px-6 py-3.5 sm:py-4 border-b-2 border-slate-700 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 border-2 border-black flex items-center justify-center shadow-[0_2px_0_#000] shrink-0">
              <Award className="w-6 h-6 text-slate-950" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase text-amber-400 font-mario block">
                HERO DOSSIER &amp; MILESTONES
              </span>
              <h2 className="text-base sm:text-xl font-black text-white font-display truncate">
                USER PROFILE &amp; ACHIEVEMENTS
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenLeaderboard && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLeaderboard();
                }}
                className="hidden md:inline-flex min-h-[44px] px-3 items-center justify-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs border-2 border-black cursor-pointer whitespace-nowrap"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Coin Leaderboard</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenExportScoreCard();
              }}
              className="hidden sm:inline-flex min-h-[44px] px-3 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs border-2 border-black cursor-pointer whitespace-nowrap"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>Export Score Card</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close User Profile Modal"
              className="min-h-[44px] min-w-[44px] rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Section 1: Hero Identity & Live Telemetry Card */}
          <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 border-2 border-slate-700 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <button
                  type="button"
                  onClick={() => {
                    setShowAvatarPicker((prev) => !prev);
                    marioAudio.playJump();
                  }}
                  aria-label="Change Equipped Hero Avatar"
                  title="Click to switch Hero Avatar"
                  className="w-16 h-16 rounded-2xl bg-amber-400 border-3 border-black flex items-center justify-center shadow-[0_3px_0_#000] hover:scale-105 transition-transform cursor-pointer shrink-0"
                >
                  <MarioCharacterAvatar character={equippedAvatar} className="w-12 h-12" />
                </button>

                <div className="min-w-0 space-y-1">
                  {isEditingName ? (
                    <form onSubmit={handleSaveName} className="flex items-center gap-2">
                      <label htmlFor="profile-player-name" className="sr-only">
                        Player Name
                      </label>
                      <input
                        id="profile-player-name"
                        type="text"
                        maxLength={32}
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        autoFocus
                        className="min-h-[44px] px-3 py-1.5 rounded-xl bg-slate-950 border-2 border-amber-400 text-white font-bold text-sm w-44 sm:w-56"
                      />
                      <button
                        type="submit"
                        aria-label="Save Player Name"
                        className="min-h-[44px] px-3 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs border-2 border-black inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl sm:text-2xl font-black text-white font-display truncate">
                        {stats.playerName}
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setNameInput(stats.playerName);
                          setIsEditingName(true);
                        }}
                        aria-label="Edit Player Name"
                        className="min-h-[44px] min-w-[44px] rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 border border-slate-700 inline-flex items-center justify-center cursor-pointer shrink-0"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 font-semibold">
                    <span className="text-amber-300 font-bold">{heroRank}</span>
                    {typeof window !== 'undefined' && localStorage.getItem('mario_equipped_title') && (
                      <span className="text-emerald-300 font-bold">
                        · {localStorage.getItem('mario_equipped_title')}
                      </span>
                    )}
                    <span aria-hidden="true">·</span>
                    <span>Hero: {heroMeta.name}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAvatarPicker((prev) => !prev)}
                  className="min-h-[44px] px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-600 inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                  <span>{showAvatarPicker ? 'Hide Heroes' : 'Switch Hero'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenWalkthrough();
                  }}
                  className="min-h-[44px] px-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs border-2 border-black shadow-[0_2px_0_#000] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>App Guide</span>
                </button>
              </div>
            </div>

            {/* Quick Inline Avatar Switcher */}
            {showAvatarPicker && (
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <span className="text-[10px] font-black uppercase text-amber-400 font-mario block">
                  SELECT HERO AVATAR (ALL {HERO_ROSTER.length} CHARACTERS)
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {HERO_ROSTER.map((hero) => {
                    const active = equippedAvatar === hero.id;
                    return (
                      <button
                        key={hero.id}
                        type="button"
                        onClick={() => {
                          onSelectAvatar(hero.id);
                          marioAudio.playCoin();
                        }}
                        className={`min-h-[56px] p-2 rounded-xl border text-center flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                          active
                            ? 'bg-amber-400 text-slate-950 border-black font-black'
                            : 'bg-slate-950/80 text-slate-300 border-slate-700 hover:border-amber-400/60'
                        }`}
                      >
                        <MarioCharacterAvatar character={hero.id} className="w-7 h-7" />
                        <span className="text-[10px] font-bold truncate w-full">{hero.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 6 Live Stat Readouts */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
              <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Study Time
                </span>
                <span
                  data-testid="profile-stat-study-time"
                  className="text-base sm:text-lg font-black text-sky-300 tabular-nums mt-0.5 block"
                >
                  {formatStudyDuration(stats.studiedSeconds)}
                </span>
                <span className="text-[11px] text-slate-400">Goal: 5h 00m</span>
              </div>

              <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Quizzes Done
                </span>
                <span
                  data-testid="profile-stat-quizzes"
                  className="text-base sm:text-lg font-black text-amber-300 tabular-nums mt-0.5 block"
                >
                  {stats.quizzesCompleted}
                </span>
                <span className="text-[11px] text-slate-400">Goal: 10 Runs</span>
              </div>

              <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Wage Quiz Best
                </span>
                <span
                  data-testid="profile-stat-wage-best"
                  className="text-base sm:text-lg font-black text-emerald-300 tabular-nums mt-0.5 block"
                >
                  {stats.perfectWageQuizzes >= 1 ? '100%' : `${stats.bestWageQuizPercent}%`}
                </span>
                <span className="text-[11px] text-slate-400">World 3 Wages</span>
              </div>

              <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Modules Read
                </span>
                <span className="text-base sm:text-lg font-black text-white tabular-nums mt-0.5 block">
                  {completedTopicsCount}/{totalTopicsCount}
                </span>
                <span className="text-[11px] text-slate-400">{overallProgressPercent}% Clear</span>
              </div>

              <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Daily Streak
                </span>
                <span className="text-base sm:text-lg font-black text-orange-300 tabular-nums mt-0.5 block">
                  {loginStreak} {loginStreak === 1 ? 'Day' : 'Days'}
                </span>
                <span className="text-[11px] text-slate-400">Active Streak</span>
              </div>

              <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Coin Wallet
                </span>
                <span className="text-base sm:text-lg font-black text-amber-400 tabular-nums mt-0.5 inline-flex items-center gap-1">
                  <MarioCoinIcon className="w-4 h-4" />
                  <span>x{coins}</span>
                </span>
                <span className="text-[11px] text-slate-400 block">
                  {unlockedCount}/{achievements.length} Badges
                </span>
              </div>
            </div>
          </div>

          {/* Section 1.25: 'Need Improvement' Focus Areas & 5-Min Quick Study Mode */}
          <div
            data-testid="profile-needs-improvement-section"
            className="bg-slate-900 rounded-2xl p-4 sm:p-5 border-2 border-rose-500/60 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-500 border-2 border-black flex items-center justify-center text-white shadow-[0_2px_0_#000] shrink-0">
                  <Flag className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-rose-300 font-mario block">
                    PERSONALIZED WEAK-SPOT DECK ({totalWeakCount} FLAGGED)
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white font-display">
                    TOPICS MARKED &ldquo;NEED IMPROVEMENT&rdquo;
                  </h3>
                </div>
              </div>

              {onStartQuickStudy && (
                <button
                  type="button"
                  data-testid="profile-launch-quick-study-btn"
                  onClick={() => {
                    onClose();
                    onStartQuickStudy();
                  }}
                  className="min-h-[44px] px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs border-2 border-black shadow-[0_3px_0_#000] inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <Zap className="w-4 h-4 shrink-0" />
                  <span>Quick Study Mode (5-Min Deck)</span>
                </button>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Mark any World or specific Labor Law topic below as <strong className="text-rose-300">Need Improvement</strong>. Clicking <strong>Quick Study Mode</strong> builds a 5-minute curated flashcard sprint targeting these exact areas!
            </p>

            {/* Quick World Flag Buttons (W1–W6 + Holidays) */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                ...WORLDS_METADATA.map((w) => ({ id: w.id, label: `W${w.worldNumber}: ${w.shortTitle}` })),
                { id: 'holidays', label: 'Holidays Hub' },
              ].map((item) => {
                const flagged = weakWorlds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    data-testid={`toggle-weak-world-${item.id}`}
                    onClick={() => {
                      onToggleNeedsImprovementWorld?.(item.id);
                      marioAudio.playCoin();
                    }}
                    className={`min-h-[44px] px-3 rounded-xl text-xs font-black border transition-all cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap ${
                      flagged
                        ? 'bg-rose-600 text-white border-black shadow-[0_2px_0_#000]'
                        : 'bg-slate-950 text-slate-300 border-slate-700 hover:border-rose-400'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Expandable Individual Topic Checklist */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowAllTopicsChecklist((p) => !p)}
                className="min-h-[44px] px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-slate-700 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>
                  {showAllTopicsChecklist
                    ? 'Hide Individual Topic Checklist'
                    : `Select Specific Topics (${weakTopicIds.length}/${ALL_LAW_TOPICS.length} Marked)`}
                </span>
              </button>

              {showAllTopicsChecklist && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 max-h-60 overflow-y-auto pr-1">
                  {ALL_LAW_TOPICS.map((topic) => {
                    const isMarked = weakTopicIds.includes(topic.id);
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => {
                          onToggleNeedsImprovementTopic?.(topic.id);
                          marioAudio.playJump();
                        }}
                        className={`min-h-[44px] p-2.5 rounded-xl border text-left text-xs font-bold flex items-center justify-between gap-2 cursor-pointer ${
                          isMarked
                            ? 'bg-rose-950/80 border-rose-400 text-rose-100'
                            : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <span className="truncate">{topic.title}</span>
                        <span className="shrink-0 text-[10px] font-black uppercase">
                          {isMarked ? 'Marked' : '+ Flag'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Section 1.5: Daily Study Goal Tracker */}
          <div
            data-testid="daily-study-goal-section"
            className="bg-slate-900 rounded-2xl p-4 sm:p-5 border-2 border-slate-700 space-y-3.5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400 border-2 border-black flex items-center justify-center text-slate-950 shadow-[0_2px_0_#000] shrink-0">
                  <Flame className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-400 font-mario block">
                    DAILY COMMITMENT
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white font-display">
                    DAILY STUDY GOAL TRACKER
                  </h3>
                </div>
              </div>

              {/* Goal Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[15, 25, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => handleSelectGoalMinutes(mins)}
                    className={`min-h-[44px] min-w-[44px] px-3 rounded-xl font-black text-xs border transition-all cursor-pointer ${
                      dailyGoalTarget === mins
                        ? 'bg-amber-400 text-slate-950 border-black shadow-[0_2px_0_#000]'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* Progress Bar & Status */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                <span className="flex items-center gap-1.5">
                  <span>Target: {dailyGoalTarget} minutes today</span>
                  {goalStatus.isGoalAchieved && (
                    <span className="text-emerald-400 font-black">· Goal Met!</span>
                  )}
                </span>
                <span className="font-mono text-amber-300 tabular-nums font-black text-sm">
                  {goalStatus.minutesToday}m / {dailyGoalTarget}m ({goalStatus.progressPercent}%)
                </span>
              </div>

              <div className="w-full h-4 bg-slate-950 rounded-xl border border-slate-700 overflow-hidden relative p-0.5">
                <div
                  className={`h-full rounded-lg transition-all duration-500 ${
                    goalStatus.isGoalAchieved
                      ? 'bg-gradient-to-r from-emerald-400 to-green-300'
                      : 'bg-gradient-to-r from-amber-500 to-amber-300'
                  }`}
                  style={{ width: `${goalStatus.progressPercent}%` }}
                />
              </div>

              <p className="text-xs text-slate-400">
                {goalStatus.isGoalAchieved
                  ? 'Congratulations! You achieved your daily study goal. Interacting with topic audio, flashcards, or quiz questions continues to build your mastery.'
                  : `${Math.max(0, dailyGoalTarget - goalStatus.minutesToday)} minutes remaining to complete today's goal. Read topic articles, listen to audio, or practice flashcards to advance!`}
              </p>
            </div>
          </div>

          {/* Section 2: Weekly Pomodoro Focus Session History (Recharts Bar Chart) */}
          <div
            data-testid="weekly-pomodoro-history-section"
            className="bg-slate-900 rounded-2xl p-4 sm:p-5 border-2 border-slate-700 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400 border-2 border-black flex items-center justify-center text-slate-950 shadow-[0_2px_0_#000] shrink-0">
                  <Clock className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-400 font-mario block">
                    STUDY CONSISTENCY OVER TIME
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white font-display">
                    WEEKLY POMODORO FOCUS SESSION HISTORY
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap text-xs font-bold text-slate-300 tabular-nums">
                <span>
                  Total: <strong className="text-white">{getWeeklyPomodoroChartData(stats).reduce((a, b) => a + b.sessions, 0)} Blocks</strong>
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-amber-300">25-Min Intervals</span>
              </div>
            </div>

            {/* Recharts Responsive Bar Chart */}
            <div className="w-full h-56 sm:h-64 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getWeeklyPomodoroChartData(stats)}
                  margin={{ top: 12, right: 12, left: -18, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis
                    dataKey="dayLabel"
                    tick={{ fill: '#cbd5e1', fontSize: 12, fontWeight: 700 }}
                    axisLine={{ stroke: '#475569' }}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                    axisLine={{ stroke: '#475569' }}
                    tickLine={false}
                    domain={[0, 'dataMax + 1']}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as WeeklyPomodoroDayData;
                        return (
                          <div className="bg-slate-950 border-2 border-amber-400 p-2.5 rounded-xl shadow-xl text-white text-xs font-bold space-y-1">
                            <p className="font-mario text-amber-300 text-[10px]">
                              {data.dateDisplay} · {data.dayLabel}
                            </p>
                            <p className="text-white font-extrabold text-sm">
                              {data.sessions} Focus Block{data.sessions !== 1 ? 's' : ''}
                            </p>
                            <p className="text-emerald-400 font-semibold">
                              {data.minutes} Minutes Studied
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="sessions"
                    name="Focus Sessions"
                    radius={[8, 8, 2, 2]}
                    maxBarSize={48}
                  >
                    {getWeeklyPomodoroChartData(stats).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.isToday
                            ? '#fbbf24'
                            : entry.sessions > 0
                            ? '#34d399'
                            : '#475569'
                        }
                        stroke={entry.isToday ? '#000000' : 'none'}
                        strokeWidth={entry.isToday ? 2 : 0}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Section 3: Achievements & Milestone Badges */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white font-display">
                  ACHIEVEMENTS &amp; MILESTONE BADGES ({unlockedCount} / {achievements.length})
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-semibold">
                  Earn unique badges and Gold Coin rewards for study hours, quiz marathons, and statutory mastery.
                </p>
              </div>

              {/* Segmented Filter Controls */}
              <div className="inline-flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-700 self-start sm:self-auto">
                {(
                  [
                    { id: 'all' as const, label: `All (${achievements.length})` },
                    { id: 'unlocked' as const, label: `Unlocked (${unlockedCount})` },
                    {
                      id: 'locked' as const,
                      label: `In Progress (${achievements.length - unlockedCount})`,
                    },
                  ]
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setFilterTab(tab.id);
                      marioAudio.playJump();
                    }}
                    className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-black transition-colors cursor-pointer whitespace-nowrap ${
                      filterTab === tab.id
                        ? 'bg-amber-400 text-slate-950'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {visibleAchievements.length === 0 ? (
              <div className="bg-slate-900 rounded-2xl p-8 text-center border border-slate-700 space-y-2">
                <Trophy className="w-8 h-8 text-amber-400 mx-auto" />
                <p className="font-bold text-slate-200 text-sm">
                  {filterTab === 'unlocked'
                    ? 'No badges unlocked yet — complete a Quick Test or App Guide to unlock your first badge!'
                    : 'Incredible! You have unlocked every single milestone badge!'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {visibleAchievements.map((badge) => (
                  <div
                    key={badge.id}
                    data-testid={`achievement-card-${badge.id}`}
                    className={`rounded-2xl p-4 border-2 transition-all flex flex-col justify-between gap-3 ${
                      badge.unlocked
                        ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/60 border-amber-400 shadow-[0_3px_0_#000]'
                        : 'bg-slate-900/80 border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center shrink-0 ${
                          badge.unlocked
                            ? 'bg-slate-950 border-amber-400 shadow-[0_2px_0_#000]'
                            : 'bg-slate-950/60 border-slate-700 opacity-75'
                        }`}
                      >
                        {renderBadgeIcon(badge.iconKey)}
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-black text-sm sm:text-base text-white font-display truncate">
                            {badge.title}
                          </h4>
                          <span className="inline-flex items-center gap-1 text-xs font-black text-amber-300 tabular-nums shrink-0">
                            <MarioCoinIcon className="w-3.5 h-3.5" />
                            <span>+{badge.coinReward}</span>
                          </span>
                        </div>

                        <p className="text-xs font-extrabold text-amber-300">
                          Milestone: {badge.milestoneLabel}
                        </p>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {badge.description}
                        </p>
                      </div>
                    </div>

                    {/* Progress & Status Footer */}
                    <div className="space-y-2 pt-1 border-t border-slate-800">
                      <div className="flex items-center justify-between text-xs font-bold tabular-nums">
                        <span className="text-slate-300">{badge.progressText}</span>
                        {badge.unlocked ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-black">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>UNLOCKED{badge.unlockedAt ? ` · ${badge.unlockedAt}` : ''}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400">
                            <Lock className="w-3 h-3" />
                            <span>{badge.progressPercent}%</span>
                          </span>
                        )}
                      </div>

                      <div className="w-full h-2.5 bg-slate-950 rounded-full border border-slate-700 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            badge.unlocked ? 'bg-emerald-400' : 'bg-amber-400'
                          }`}
                          style={{ width: `${badge.progressPercent}%` }}
                        />
                      </div>

                      {!badge.unlocked && (
                        <div className="flex justify-end pt-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              if (badge.id === 'tour_graduate') {
                                onOpenWalkthrough();
                              } else {
                                onNavigateAction(badge.actionTab, badge.actionWorld);
                              }
                            }}
                            className="min-h-[40px] inline-flex items-center gap-1 text-xs font-black text-amber-300 hover:text-amber-200 cursor-pointer"
                          >
                            <span>{badge.actionLabel}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
