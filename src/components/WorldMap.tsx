import React, { useState, useMemo, useEffect } from 'react';
import {
  MarioCharacterAvatar,
  MarioMushroomIcon,
  MarioFireFlowerIcon,
  MarioStarIcon,
  MarioPipeIcon,
  MarioPeachCrownIcon,
  Mario1UpIcon,
  MarioCoinIcon,
} from './MarioIcons';
import { MarioAvatar } from '../types/laborLaw';
import { HERO_ROSTER, getHeroMeta } from '../data/heroesData';
import { ALL_LAW_TOPICS } from '../data/laborLawData';
import {
  computeWorldProgressMap,
  GROUP_MEMBERS,
  MAIN_CREATOR_AUTHOR,
  SHORTCUT_MAP_HIGHLIGHTS,
  isShortcutKeyTopic,
} from '../utils/engagementFeatures';
import { computeFireFlowerStreakProgress } from '../utils/profileAchievements';
import {
  DAILY_CHALLENGE_BASE_COINS,
  DAILY_CHALLENGE_REVIEW_COINS,
  getDailyChallengeForDate,
  getNextDailyChallengeCountdown,
  loadDailyChallengeState,
  submitDailyChallengeAnswer,
} from '../data/dailyChallengesData';
import { marioAudio } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  ArrowRight,
  Compass,
  Users,
  ChevronDown,
  ChevronUp,
  Calendar,
  CheckCircle2,
  Unlock,
  Lock,
  Sparkles,
  Award,
  Shuffle,
  Trophy,
  Zap,
  MapPin,
  Scale,
  Clock,
  XCircle,
} from 'lucide-react';

interface WorldMapProps {
  onSelectWorld: (worldId: string) => void;
  onSelectTopic?: (worldId: string, topicId: string) => void;
  activeWorld: string;
  fontSize: 'normal' | 'large' | 'xlarge';
  equippedAvatar: MarioAvatar;
  setEquippedAvatar: (avatar: MarioAvatar) => void;
  completedTopicIds?: string[];
  onToggleTopicComplete?: (topicId: string) => void;
  onOpenWalkthrough?: () => void;
  onOpenProfile?: () => void;
  unlockedAchievementsCount?: number;
  loginStreak?: number;
  onStartQuickStudy?: () => void;
  onOpenLeaderboard?: () => void;
  shortcutMapActive?: boolean;
  needsImprovementCount?: number;
  onEarnCoins?: (amount: number) => void;
  superStarActive?: boolean;
}

interface MapNode {
  id: string;
  levelNumber: string;
  name: string;
  worldName: string;
  x: number;
  y: number;
  iconType: 'mushroom' | 'flower' | 'star' | 'crown' | '1up' | 'pipe' | 'holiday';
  badge: string;
  summary: string;
  topicsCount: number;
}

const MAP_NODES: MapNode[] = [
  {
    id: 'world1',
    levelNumber: 'WORLD 1',
    name: 'YOSHI ISLAND',
    worldName: 'Hours of Work',
    x: 16,
    y: 70,
    iconType: 'mushroom',
    badge: 'Art. 82-90 Labor Code',
    summary:
      'Coverage & Exclusions, Managerial & Field Tests, 20-min Brownouts, Travel Time, Compressed Work Week & Overtime.',
    topicsCount: 3,
  },
  {
    id: 'world2',
    levelNumber: 'WORLD 2',
    name: 'DONUT PLAINS',
    worldName: 'Rest & Holidays',
    x: 30,
    y: 36,
    iconType: 'flower',
    badge: 'Art. 91-94, RA 11360, PD 851',
    summary:
      'Rest Periods, 12 Regular & 9 Special Holidays, Double Holidays, 100% Service Charge & 13th Month Pay.',
    topicsCount: 4,
  },
  {
    id: 'holidays',
    levelNumber: 'HOLIDAY HUB',
    name: 'FESTIVAL ISLAND',
    worldName: 'PH Holidays Master Tab',
    x: 42,
    y: 17,
    iconType: 'holiday',
    badge: '12 Regular + Special Days',
    summary:
      'Dedicated Holiday Hub: All Regular & Special Non-Working Days, Double Holiday 300%/390% rules, Preceding Absence doctrines & Interactive Holiday Simulator.',
    topicsCount: 12,
  },
  {
    id: 'world3',
    levelNumber: 'WORLD 3',
    name: 'VANILLA DOME',
    worldName: 'Wages & D.O. 174',
    x: 52,
    y: 72,
    iconType: 'star',
    badge: 'Art. 97-129 & D.O. 174',
    summary:
      'No Work-No Pay, Wage vs Salary, 12 Exemptions, D.O. 174 Job vs Labor-Only Contracting, 10 Deductions & Distortion.',
    topicsCount: 2,
  },
  {
    id: 'world4',
    levelNumber: 'WORLD 4',
    name: 'FOREST OF ILLUSION',
    worldName: 'Special Groups',
    x: 70,
    y: 34,
    iconType: 'crown',
    badge: 'Women, Minors, Kasambahay',
    summary:
      'Women Facilities & Discrimination, Competitor Rule, Child Labor, Batas Kasambahay 8 Rights, Homeworkers & Night Work.',
    topicsCount: 2,
  },
  {
    id: 'world5',
    levelNumber: 'WORLD 5',
    name: 'BOWSER CASTLE',
    worldName: 'Protective Laws',
    x: 84,
    y: 62,
    iconType: '1up',
    badge: 'RA 10028, 7192, 9710, 7877, 11313, 9262',
    summary:
      'Breastfeeding Act, RA 7192, Magna Carta, Sexual Harassment, Safe Spaces Act, Anti-VAWC, SPES & Telecommuting.',
    topicsCount: 3,
  },
  {
    id: 'world6',
    levelNumber: 'WORLD 6',
    name: 'PEACH CASTLE',
    worldName: 'Statutory Leaves',
    x: 88,
    y: 22,
    iconType: 'crown',
    badge: 'Art. 95, RA 11210, 8187, 8972/11861, 9710, 9262',
    summary:
      '7 Full Stages: Service Incentive Leave (5d & Auto Bus prescription), 105-Day Maternity & 7-Day Father Allocation, Paternity, Solo Parents (6-mo service), Gynecological Surgery, VAWC & Master Leave Matrix.',
    topicsCount: 7,
  },
  {
    id: 'warp_calc',
    levelNumber: 'WARP PIPE',
    name: 'PIPE LAND',
    worldName: 'Multiplier Calculator',
    x: 34,
    y: 84,
    iconType: 'pipe',
    badge: 'Interactive Wage Engine',
    summary:
      'Statutory calculation simulator for base pay, overtime, holiday premiums, night differentials, and 13th month.',
    topicsCount: 1,
  },
  {
    id: 'wages_matrix',
    levelNumber: 'STAR ROAD',
    name: 'STAR ROAD',
    worldName: '17 Regions Matrix',
    x: 68,
    y: 15,
    iconType: 'star',
    badge: 'NCR to BARMM Rates',
    summary:
      'Complete regional minimum wage rates for Non-Agriculture, Agriculture, and Kasambahay domestic workers.',
    topicsCount: 1,
  },
];

export const WorldMap: React.FC<WorldMapProps> = ({
  onSelectWorld,
  onSelectTopic,
  activeWorld,
  fontSize,
  equippedAvatar,
  setEquippedAvatar,
  completedTopicIds = [],
  onToggleTopicComplete,
  onOpenWalkthrough,
  onOpenProfile,
  unlockedAchievementsCount = 0,
  loginStreak = 1,
  onStartQuickStudy,
  onOpenLeaderboard,
  shortcutMapActive = false,
  needsImprovementCount = 0,
  onEarnCoins,
  superStarActive = false,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(
    MAP_NODES.some((n) => n.id === activeWorld) ? activeWorld : 'world1'
  );
  const [showAllHeroes, setShowAllHeroes] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 640 : false
  );

  // 24-Hour Daily Bar Challenge State & Midnight Countdown
  const [nowDate, setNowDate] = useState<Date>(() => new Date());
  const [dailyRecord, setDailyRecord] = useState(() =>
    loadDailyChallengeState(typeof window !== 'undefined' ? window.localStorage : null)
  );
  const [isDailyChallengeOpen, setIsDailyChallengeOpen] = useState<boolean>(false);
  const [selectedDailyOption, setSelectedDailyOption] = useState<number | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => {
      const nextNow = new Date();
      setNowDate(nextNow);
      const refreshed = loadDailyChallengeState(
        typeof window !== 'undefined' ? window.localStorage : null,
        nextNow
      );
      setDailyRecord((prev) => {
        if (prev.dateKey !== refreshed.dateKey) {
          setSelectedDailyOption(null);
          return refreshed;
        }
        return prev;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const todayChallenge = useMemo(() => getDailyChallengeForDate(nowDate), [nowDate]);
  const dailyCountdown = useMemo(() => getNextDailyChallengeCountdown(nowDate), [nowDate]);
  const effectiveDailyReward = superStarActive
    ? DAILY_CHALLENGE_BASE_COINS * 2
    : DAILY_CHALLENGE_BASE_COINS;

  const handleSubmitDailyChallenge = () => {
    if (selectedDailyOption === null || dailyRecord.completed) return;
    const result = submitDailyChallengeAnswer(
      typeof window !== 'undefined' ? window.localStorage : null,
      selectedDailyOption,
      new Date()
    );
    setDailyRecord(result.record);
    if (!result.alreadyCompletedToday && result.baseCoinsEarned > 0) {
      onEarnCoins?.(result.baseCoinsEarned);
      if (result.record.isCorrect) {
        marioAudio.playLevelUp();
        try {
          confetti({
            particleCount: 65,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#fbbf24', '#10b981', '#ef4444', '#38bdf8'],
          });
        } catch {
          // ignore
        }
      } else {
        marioAudio.playCoin();
      }
    }
  };

  const streakInfo = useMemo(
    () => computeFireFlowerStreakProgress(loginStreak, 6),
    [loginStreak]
  );

  const worldProgressMap = useMemo(
    () => computeWorldProgressMap(ALL_LAW_TOPICS, completedTopicIds),
    [completedTopicIds]
  );

  const uncompletedTopics = useMemo(() => {
    return ALL_LAW_TOPICS.filter((t) => !completedTopicIds?.includes(t.id));
  }, [completedTopicIds]);

  const [quickStudyOffset, setQuickStudyOffset] = useState<number>(0);

  const suggestedTopic = useMemo(() => {
    const pool = uncompletedTopics.length > 0 ? uncompletedTopics : ALL_LAW_TOPICS;
    if (pool.length === 0) return null;
    return pool[quickStudyOffset % pool.length];
  }, [uncompletedTopics, quickStudyOffset]);

  const handleShuffleQuickStudy = () => {
    marioAudio.playCoin();
    setQuickStudyOffset((prev) => prev + 1);
  };

  const handleWarpToSuggested = (topic: typeof ALL_LAW_TOPICS[number]) => {
    marioAudio.playPipe();
    if (onSelectTopic) {
      onSelectTopic(topic.worldId, topic.id);
    } else {
      onSelectWorld(topic.worldId);
    }
  };

  const selectedNode =
    MAP_NODES.find((n) => n.id === selectedNodeId) || MAP_NODES[0];
  const selectedWorldProgress = worldProgressMap[selectedNode.id] || null;

  const totalClearedWorlds = Object.values(worldProgressMap).filter(
    (w) => w.isWorldCleared
  ).length;

  const handleNodeInspect = (node: MapNode) => {
    setSelectedNodeId(node.id);
    marioAudio.playJump();
  };

  const handleSelectHero = (id: MarioAvatar) => {
    setEquippedAvatar(id);
    marioAudio.playJump();
    try {
      localStorage.setItem('mario_equipped_avatar', id);
    } catch {
      // ignore
    }
  };

  const activeHeroMeta = getHeroMeta(equippedAvatar);
  const bodyTextClass =
    fontSize === 'xlarge' ? 'text-xl' : fontSize === 'large' ? 'text-lg' : 'text-base';

  return (
    <div className="space-y-6">
      <div className="bg-[#1e293b] rounded-3xl mario-card border-4 border-slate-950 p-4 md:p-6 text-white overflow-hidden relative">
        {/* Top Header of Map */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b-2 border-slate-700 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-400 border-2 border-slate-900 rounded-2xl flex items-center justify-center shadow-[0_3px_0_#000] shrink-0">
              <Compass className="w-7 h-7 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase text-amber-400 tracking-wider font-mario">
                  OVERWORLD LEVEL SELECT
                </span>
                <span className="text-emerald-300 text-xs font-bold tabular-nums">
                  · {completedTopicIds.length}/{ALL_LAW_TOPICS.length} Topics · {totalClearedWorlds}/6 Worlds
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white font-display">
                MUSHROOM KINGDOM INTERACTIVE MAP
              </h2>
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {onOpenWalkthrough && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenWalkthrough();
                      marioAudio.playCoin();
                    }}
                    className="min-h-[44px] px-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs border-2 border-black shadow-[0_2px_0_#000] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Compass className="w-4 h-4 shrink-0" />
                    <span>App Guide Tour</span>
                  </button>
                )}
                {onOpenProfile && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenProfile();
                      marioAudio.playCoin();
                    }}
                    className="min-h-[44px] px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-black text-xs border-2 border-slate-700 inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap tabular-nums"
                  >
                    <Award className="w-4 h-4 shrink-0" />
                    <span>Achievements ({unlockedAchievementsCount}/14)</span>
                  </button>
                )}
                {onOpenLeaderboard && (
                  <button
                    type="button"
                    data-testid="map-open-leaderboard-btn"
                    onClick={() => {
                      onOpenLeaderboard();
                      marioAudio.playCoin();
                    }}
                    className="min-h-[44px] px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs border-2 border-black shadow-[0_2px_0_#000] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Trophy className="w-4 h-4 shrink-0" />
                    <span>Global Coin Leaderboard</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Active Hero Summary + All 34 Characters Toggle */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-900/95 px-3 py-2.5 rounded-2xl border-2 border-slate-700 w-full lg:w-auto justify-between lg:justify-end">
            <div className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 bg-amber-400 rounded-xl border-2 border-black flex items-center justify-center shrink-0">
                <MarioCharacterAvatar character={equippedAvatar} className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black text-amber-400 uppercase font-mario block leading-none">
                  HERO ({HERO_ROSTER.length} AVAILABLE)
                </span>
                <span className="text-xs sm:text-sm font-black text-white font-display block mt-0.5 leading-tight">
                  {activeHeroMeta.name} ·{' '}
                  <span className="text-slate-300 font-semibold">{activeHeroMeta.title}</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowAllHeroes((v) => !v);
                marioAudio.playPipe();
              }}
              className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs border-2 border-black shadow-[0_2px_0_#000] cursor-pointer whitespace-nowrap"
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>{showAllHeroes ? 'Hide Roster' : `All ${HERO_ROSTER.length} Heroes`}</span>
              {showAllHeroes ? (
                <ChevronUp className="w-4 h-4 shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 shrink-0" />
              )}
            </button>
          </div>
        </div>

        {/* Visual Consecutive Days Studied Tracker (Fire Flower for every 5-day streak + Milestone Progress Bar) */}
        <div
          data-testid="consecutive-days-tracker"
          className="mb-4 bg-slate-900/95 border-2 border-amber-400/70 rounded-2xl p-3.5 sm:p-4 shadow-md"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 border-2 border-black flex items-center justify-center shrink-0 shadow-[0_2px_0_#000]">
                <MarioFireFlowerIcon className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-black uppercase text-amber-300 font-mario">
                    CONSECUTIVE DAYS STUDIED TRACKER
                  </span>
                  <span className="text-xs font-bold text-slate-300 tabular-nums">
                    · {streakInfo.streakDays} {streakInfo.streakDays === 1 ? 'Day' : 'Days'} Active ·{' '}
                    {streakInfo.fireFlowersEarned} Fire {streakInfo.fireFlowersEarned === 1 ? 'Flower' : 'Flowers'} Earned
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  Earn 1 blooming <strong className="text-amber-300">Fire Flower</strong> every 5 consecutive study days!{' '}
                  <span className="text-emerald-300 font-bold tabular-nums">
                    ({streakInfo.daysRemainingToNextFlower} {streakInfo.daysRemainingToNextFlower === 1 ? 'day' : 'days'} until Day {streakInfo.nextMilestoneDays} Fire Flower)
                  </span>
                </p>
              </div>
            </div>

            {/* Fire Flower Milestone Icons (5d, 10d, 15d, 20d, 25d, 30d) */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1">
              {streakInfo.milestoneMarkers.map((m) => {
                const isCurrentTarget =
                  !m.achieved && m.dayTarget === streakInfo.nextMilestoneDays;
                return (
                  <div
                    key={`fire-flower-${m.flowerIndex}-${m.dayTarget}`}
                    data-testid={`fire-flower-slot-${m.dayTarget}`}
                    title={
                      m.achieved
                        ? `Day ${m.dayTarget} Fire Flower Unlocked!`
                        : `Study ${m.dayTarget} consecutive days to bloom this Fire Flower`
                    }
                    className={`flex flex-col items-center justify-center px-2.5 py-1.5 rounded-xl border-2 shrink-0 transition-all ${
                      m.achieved
                        ? 'bg-amber-400/20 border-amber-400 text-amber-200 shadow-[0_0_10px_rgba(251,191,36,0.25)]'
                        : isCurrentTarget
                        ? 'bg-slate-800 border-orange-400/70 text-slate-200'
                        : 'bg-slate-950/70 border-slate-800 text-slate-500 opacity-75'
                    }`}
                  >
                    <div className={m.achieved ? 'scale-105' : 'grayscale opacity-50'}>
                      <MarioFireFlowerIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-[10px] font-black font-mono tabular-nums mt-0.5">
                      {m.dayTarget}d
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress Bar filling toward next 5-day Fire Flower milestone */}
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 tabular-nums">
              <span>
                Cycle Progress: {streakInfo.daysIntoCurrentCycle}/5 Days toward Fire Flower #{streakInfo.fireFlowersEarned + 1}
              </span>
              <span className="text-amber-300 font-black">{streakInfo.progressPercentToNextFlower}%</span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={streakInfo.progressPercentToNextFlower}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progress toward next 5-day Fire Flower milestone"
              className="w-full h-3 bg-slate-950 rounded-full border-2 border-slate-700 overflow-hidden p-0.5"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 transition-transform duration-300 origin-left"
                style={{ transform: `scaleX(${Math.max(0.06, streakInfo.progressPercentToNextFlower / 100)})` }}
              />
            </div>
          </div>
        </div>

        {/* Full Hero Roster Aligned Grid */}
        <div className="mb-4 bg-slate-900/95 border-2 border-slate-700 rounded-2xl p-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {(showAllHeroes ? HERO_ROSTER : HERO_ROSTER.slice(0, 8)).map((hero) => {
              const isSelected = equippedAvatar === hero.id;
              return (
                <button
                  key={hero.id}
                  type="button"
                  onClick={() => handleSelectHero(hero.id)}
                  className={`min-h-[44px] px-2.5 rounded-xl border-2 inline-flex items-center justify-start gap-2 transition-all cursor-pointer leading-none min-w-0 ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 border-black shadow-[0_2px_0_#000]'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  <MarioCharacterAvatar character={hero.id} className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-black truncate">{hero.shortName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 24-Hour Refreshing Daily High-Difficulty Bar Exam Challenge */}
        <div
          data-testid="daily-challenge-card"
          className="mb-4 bg-slate-950 border-3 border-emerald-400 rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0_#000] text-white space-y-4"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
            <div className="flex items-start sm:items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-emerald-400 text-slate-950 border-2 border-black flex items-center justify-center shrink-0 shadow-[0_2px_0_#000]">
                <Scale className="w-6 h-6" />
              </div>
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap text-xs font-bold text-slate-300">
                  <span className="font-black uppercase font-mario text-[10px] text-emerald-300">
                    DAILY BAR CHALLENGE
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-300">{todayChallenge.worldLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{todayChallenge.difficultyLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 font-mono text-sky-300 tabular-nums">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    Refreshes in {dailyCountdown.formatted}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white font-display leading-snug">
                  {todayChallenge.title}
                </h3>
                <p className="text-xs text-slate-300 font-medium">
                  {dailyRecord.completed
                    ? dailyRecord.isCorrect
                      ? `✓ Solved today (+${dailyRecord.coinsAwarded} base coins claimed) · Lifetime Daily Cases Mastered: ${dailyRecord.totalSolvedCount}`
                      : `Reviewed today (+${dailyRecord.coinsAwarded} review coins claimed) · Next high-difficulty case unlocks at midnight`
                    : `Solve today's high-difficulty Philippine Labor Law Bar scenario for +${effectiveDailyReward} Gold Coins${
                        superStarActive ? ' (2x Super Star Active!)' : ''
                      }!`}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <div className="min-h-[44px] px-3.5 rounded-xl bg-slate-900 border border-amber-400/60 inline-flex items-center gap-1.5 font-black text-xs text-amber-300 tabular-nums">
                <MarioCoinIcon className="w-4 h-4 shrink-0" />
                <span>
                  {dailyRecord.completed
                    ? `Claimed +${dailyRecord.coinsAwarded}c`
                    : `+${effectiveDailyReward} Coins`}
                </span>
              </div>

              <button
                type="button"
                data-testid="daily-challenge-toggle-btn"
                aria-expanded={isDailyChallengeOpen}
                onClick={() => {
                  setIsDailyChallengeOpen((v) => !v);
                  marioAudio.playQuestionBlock();
                }}
                className={`min-h-[44px] px-4 rounded-xl font-black text-xs border-2 border-black shadow-[0_2px_0_#000] active:translate-y-0.5 inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  dailyRecord.completed
                    ? 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border-emerald-400/70'
                    : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'
                }`}
              >
                <span>
                  {isDailyChallengeOpen
                    ? 'Hide Daily Scenario'
                    : dailyRecord.completed
                    ? 'View Ruling & Doctrine'
                    : 'Solve Daily Challenge'}
                </span>
                {isDailyChallengeOpen ? (
                  <ChevronUp className="w-4 h-4 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 shrink-0" />
                )}
              </button>
            </div>
          </div>

          {isDailyChallengeOpen && (
            <div
              data-testid="daily-challenge-solver"
              className="pt-3.5 border-t border-slate-800 space-y-4"
            >
              {/* Fact Pattern & Issue */}
              <div className="bg-slate-900/95 border border-slate-700 rounded-xl p-3.5 sm:p-4 space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 font-mono block">
                  Bar Examination Fact Pattern ({dailyRecord.dateKey})
                </span>
                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">
                  {todayChallenge.factPattern}
                </p>
                <p className="text-xs sm:text-sm font-black text-emerald-300 pt-1">
                  Issue: {todayChallenge.questionPrompt}
                </p>
              </div>

              {/* 4 Multiple-Choice Legal Rulings */}
              <div className="grid grid-cols-1 gap-2.5">
                {todayChallenge.options.map((opt, idx) => {
                  const chosenIdx = dailyRecord.completed
                    ? dailyRecord.selectedOptionIndex
                    : selectedDailyOption;
                  const isSelected = chosenIdx === idx;
                  const isCorrectOpt = idx === todayChallenge.correctIndex;

                  let optionStyle =
                    'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-100';
                  if (dailyRecord.completed) {
                    if (isCorrectOpt) {
                      optionStyle =
                        'bg-emerald-950/80 border-emerald-400 text-emerald-100';
                    } else if (isSelected && !isCorrectOpt) {
                      optionStyle = 'bg-rose-950/75 border-rose-400 text-rose-100';
                    } else {
                      optionStyle = 'bg-slate-900/60 border-slate-800 text-slate-400';
                    }
                  } else if (isSelected) {
                    optionStyle =
                      'bg-amber-400/20 border-amber-400 text-white ring-2 ring-amber-400/50';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={dailyRecord.completed}
                      data-testid={`daily-challenge-option-${idx}`}
                      onClick={() => {
                        setSelectedDailyOption(idx);
                        marioAudio.playClick();
                      }}
                      className={`min-h-[48px] w-full text-left p-3 sm:p-3.5 rounded-xl border-2 transition-colors flex items-start justify-between gap-3 ${
                        dailyRecord.completed ? 'cursor-default' : 'cursor-pointer'
                      } ${optionStyle}`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-slate-950 border border-slate-600 font-mono font-black text-xs text-amber-300 inline-flex items-center justify-center shrink-0 mt-0.5">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold leading-relaxed">
                          {opt}
                        </span>
                      </div>

                      {dailyRecord.completed && isCorrectOpt && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-300 shrink-0">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>Correct</span>
                        </span>
                      )}
                      {dailyRecord.completed && isSelected && !isCorrectOpt && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black text-rose-300 shrink-0">
                          <XCircle className="w-4 h-4 shrink-0" />
                          <span>Your Choice</span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Submit Action or Supreme Court Doctrinal Explanation */}
              {!dailyRecord.completed ? (
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <span className="text-xs text-slate-400">
                    Correct ruling awards <strong className="text-amber-300">+{effectiveDailyReward} Coins</strong> (or +{superStarActive ? DAILY_CHALLENGE_REVIEW_COINS * 2 : DAILY_CHALLENGE_REVIEW_COINS} review coins if missed).
                  </span>
                  <button
                    type="button"
                    data-testid="daily-challenge-submit-btn"
                    disabled={selectedDailyOption === null}
                    onClick={handleSubmitDailyChallenge}
                    className="min-h-[46px] px-5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 font-black text-xs sm:text-sm border-2 border-black shadow-[0_3px_0_#000] active:translate-y-0.5 inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Scale className="w-4 h-4 shrink-0" />
                    <span>Submit Bar Ruling (+{effectiveDailyReward} Coins)</span>
                  </button>
                </div>
              ) : (
                <div
                  data-testid="daily-challenge-explanation"
                  className="bg-slate-900 border-2 border-emerald-400/70 rounded-xl p-4 space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-black text-emerald-300 flex items-center gap-1.5">
                      {dailyRecord.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>Bar-Ready Ruling! You earned +{dailyRecord.coinsAwarded}{superStarActive ? ' (x2 Super Star)' : ''} Gold Coins!</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 shrink-0 text-amber-300" />
                          <span>Doctrine Reviewed (+{dailyRecord.coinsAwarded} Review Coins Awarded)</span>
                        </>
                      )}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-amber-300">
                      {todayChallenge.statutoryBasis}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {todayChallenge.doctrinalExplanation}
                  </p>
                  <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-amber-200">
                      ★ Bar Takeaway: {todayChallenge.barTakeaway}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectWorld(todayChallenge.worldId)}
                      className="min-h-[40px] px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-black text-xs border border-slate-600 inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <span>Review {todayChallenge.worldLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Study Widget: 5-Minute Curated Flashcard Deck + Topic Warp */}
        <div
          data-testid="quick-study-widget"
          className="mb-4 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 rounded-2xl border-4 border-slate-950 p-4 shadow-[4px_4px_0_#000] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-slate-950"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-950 text-amber-400 border-2 border-slate-900 flex items-center justify-center shrink-0 shadow-[0_2px_0_#000]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap text-xs font-bold text-slate-900">
                <span className="font-black uppercase font-mario text-[10px] text-red-900">
                  QUICK STUDY MODE
                </span>
                <span aria-hidden="true">·</span>
                {suggestedTopic && <span className="font-mono font-black">{suggestedTopic.badge}</span>}
                <span aria-hidden="true">·</span>
                <span>
                  {needsImprovementCount > 0
                    ? `${needsImprovementCount} flagged for Need Improvement`
                    : uncompletedTopics.length > 0
                    ? `${uncompletedTopics.length} topics left to master`
                    : 'All topics cleared — curated review ready'}
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-slate-950 font-display truncate mt-0.5">
                {suggestedTopic ? suggestedTopic.title : 'Ready to study!'}
              </h4>
              <p className="text-xs text-slate-900 font-medium line-clamp-1">
                {suggestedTopic ? suggestedTopic.summary : 'Launch a 5-minute curated flashcard sprint or warp to a stage below.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onStartQuickStudy && (
              <button
                type="button"
                data-testid="map-quick-study-5m-btn"
                onClick={() => {
                  marioAudio.playPowerUp();
                  onStartQuickStudy();
                }}
                className="min-h-[44px] px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs border-2 border-black shadow-[0_2px_0_#000] active:translate-y-0.5 inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Zap className="w-4 h-4 shrink-0" />
                <span>5-Min Quick Study Deck</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleShuffleQuickStudy}
              title="Suggest another topic"
              className="min-h-[44px] px-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs border-2 border-slate-950 shadow-[0_2px_0_#000] active:translate-y-0.5 inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Shuffle className="w-4 h-4 shrink-0" />
              <span>Shuffle</span>
            </button>

            {suggestedTopic && (
              <button
                type="button"
                onClick={() => handleWarpToSuggested(suggestedTopic)}
                className="min-h-[44px] px-4 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-300 font-black text-xs font-mario border-2 border-black shadow-[0_2px_0_#000] active:translate-y-0.5 inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <span>WARP TO TOPIC</span>
                <ArrowRight className="w-4 h-4 text-amber-400 shrink-0" />
              </button>
            )}
          </div>
        </div>

        {/* 2D Canvas-style Interactive Map Display with Live Unlocked/Cleared Progress */}
        <div
          data-testid="interactive-world-map"
          className="relative w-full h-[460px] md:h-[500px] bg-[#064e3b] rounded-2xl border-4 border-slate-950 overflow-hidden shadow-inner select-none"
        >
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `radial-gradient(#10b981 15%, transparent 16%), radial-gradient(#059669 15%, transparent 16%)`,
              backgroundSize: '36px 36px',
              backgroundPosition: '0 0, 18px 18px',
            }}
          />

          <div className="absolute inset-x-0 bottom-0 h-28 bg-[#1e3a8a]/70 border-t-4 border-[#3b82f6]/40" />

          {/* Dotted / Illuminated Level Trail Lines */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
          >
            <path
              d="M 16 70 Q 22 50 30 36"
              stroke={worldProgressMap.world2?.isWorldUnlocked ? '#34d399' : '#F59E0B'}
              strokeWidth="1.4"
              strokeDasharray={worldProgressMap.world1?.isWorldCleared ? undefined : '2 2'}
              fill="none"
            />
            <path d="M 30 36 L 42 17" stroke="#EC4899" strokeWidth="1.2" strokeDasharray="1.8 1.8" fill="none" />
            <path
              d="M 30 36 Q 40 55 52 72"
              stroke={worldProgressMap.world3?.isWorldUnlocked ? '#34d399' : '#F59E0B'}
              strokeWidth="1.4"
              strokeDasharray={worldProgressMap.world2?.isWorldCleared ? undefined : '2 2'}
              fill="none"
            />
            <path
              d="M 52 72 Q 62 48 70 34"
              stroke={worldProgressMap.world4?.isWorldUnlocked ? '#34d399' : '#F59E0B'}
              strokeWidth="1.4"
              strokeDasharray={worldProgressMap.world3?.isWorldCleared ? undefined : '2 2'}
              fill="none"
            />
            <path
              d="M 70 34 Q 78 48 84 62"
              stroke={worldProgressMap.world5?.isWorldUnlocked ? '#34d399' : '#F59E0B'}
              strokeWidth="1.4"
              strokeDasharray={worldProgressMap.world4?.isWorldCleared ? undefined : '2 2'}
              fill="none"
            />
            <path
              d="M 84 62 Q 89 42 88 22"
              stroke={worldProgressMap.world6?.isWorldUnlocked ? '#34d399' : '#F59E0B'}
              strokeWidth="1.4"
              strokeDasharray={worldProgressMap.world5?.isWorldCleared ? undefined : '2 2'}
              fill="none"
            />
            <path d="M 16 70 L 34 84" stroke="#10B981" strokeWidth="1" strokeDasharray="1.5 1.5" fill="none" />
            <path d="M 42 17 L 68 15 L 70 34" stroke="#FCD34D" strokeWidth="1" strokeDasharray="1.5 1.5" fill="none" />
          </svg>

          {/* Map Legend Pill */}
          <div className="absolute top-2.5 left-2.5 z-10 bg-slate-950/85 border border-slate-700 rounded-xl px-2.5 py-1.5 flex items-center gap-2.5 text-[10px] font-bold text-slate-200">
            <span className="inline-flex items-center gap-1 text-emerald-300">
              <CheckCircle2 className="w-3 h-3" /> Cleared
            </span>
            <span className="inline-flex items-center gap-1 text-amber-300">
              <Unlock className="w-3 h-3" /> Unlocked
            </span>
            <span className="hidden sm:inline text-slate-400">
              Tap a node to inspect stages, double-tap or click &ldquo;Enter&rdquo; to warp
            </span>
          </div>

          {/* Map Level Nodes */}
          {MAP_NODES.map((node) => {
            const isSelected = selectedNode.id === node.id;
            const isActive = activeWorld === node.id;
            const wp = worldProgressMap[node.id];
            const isCleared = Boolean(wp?.isWorldCleared);
            const isUnlocked = wp ? wp.isWorldUnlocked : true;

            return (
              <div
                key={node.id}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
              >
                <button
                  type="button"
                  data-testid={`map-node-${node.id}`}
                  aria-label={`Inspect ${node.levelNumber}: ${node.worldName}`}
                  onClick={() => handleNodeInspect(node)}
                  onDoubleClick={() => onSelectWorld(node.id)}
                  className={`group relative min-w-[48px] min-h-[48px] p-1 flex flex-col items-center focus:outline-none cursor-pointer transition-transform duration-200 ${
                    isActive || isSelected ? 'scale-105 sm:scale-110' : 'hover:scale-105'
                  }`}
                >
                  {(isActive || isSelected) && (
                    <div className="absolute -top-9 sm:-top-10 animate-bounce">
                      <div className="bg-white/95 p-1 rounded-full border-2 border-black shadow-md">
                        <MarioCharacterAvatar
                          character={equippedAvatar}
                          className="w-6 h-6 sm:w-7 sm:h-7"
                        />
                      </div>
                    </div>
                  )}

                  {/* Cleared Star / Lock Corner Badge */}
                  {wp && (
                    <span
                      className={`absolute -top-2 -right-2 z-20 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-black flex items-center justify-center shadow ${
                        isCleared
                          ? 'bg-emerald-400 text-slate-950'
                          : isUnlocked
                          ? 'bg-amber-300 text-slate-950'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                      title={
                        isCleared
                          ? 'World 100% Mastered!'
                          : isUnlocked
                          ? `Unlocked (${wp.completedCount}/${wp.totalCount})`
                          : 'Complete a topic in the previous World to unlock trail'
                      }
                    >
                      {isCleared ? (
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                      ) : isUnlocked ? (
                        <Unlock className="w-3 h-3 stroke-[2.5]" />
                      ) : (
                        <Lock className="w-3 h-3 stroke-[2.5]" />
                      )}
                    </span>
                  )}

                  <div
                    className={`w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border-3 sm:border-4 border-slate-950 transition-all ${
                      isCleared
                        ? 'bg-emerald-500 shadow-[0_0_16px_#10b981]'
                        : isSelected || isActive
                        ? 'bg-amber-400 shadow-[0_0_15px_#f59e0b]'
                        : node.iconType === 'pipe'
                        ? 'bg-emerald-600'
                        : node.iconType === 'holiday'
                        ? 'bg-pink-600'
                        : node.iconType === 'star'
                        ? 'bg-yellow-500'
                        : isUnlocked
                        ? 'bg-red-600'
                        : 'bg-slate-700 opacity-90'
                    }`}
                  >
                    {node.iconType === 'mushroom' && (
                      <MarioMushroomIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                    )}
                    {node.iconType === 'flower' && (
                      <MarioFireFlowerIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                    )}
                    {node.iconType === 'star' && (
                      <MarioStarIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                    )}
                    {node.iconType === 'crown' && (
                      <MarioPeachCrownIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                    )}
                    {node.iconType === '1up' && (
                      <Mario1UpIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                    )}
                    {node.iconType === 'pipe' && (
                      <MarioPipeIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                    )}
                    {node.iconType === 'holiday' && (
                      <Calendar
                        className={`w-5 h-5 sm:w-7 sm:h-7 ${
                          isSelected || isActive ? 'text-slate-950' : 'text-white'
                        }`}
                      />
                    )}
                  </div>

                  <div className="mt-1 px-1.5 sm:px-2.5 py-0.5 rounded-lg bg-slate-950/95 text-white border-2 border-slate-700 shadow font-black text-[9px] sm:text-[10px] whitespace-nowrap flex items-center gap-1">
                    <span>{node.levelNumber}</span>
                    {wp && (
                      <span
                        className={`px-1 rounded text-[8px] sm:text-[9px] font-mono ${
                          isCleared
                            ? 'bg-emerald-400 text-slate-950'
                            : 'bg-slate-800 text-amber-300'
                        }`}
                      >
                        {wp.completedCount}/{wp.totalCount}
                      </span>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Selected Stage Dossier + Interactive Topic Unlock & Completion Checklist */}
        {selectedNode && (
          <div className="mt-5 bg-slate-900 border-3 border-amber-400 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5 w-full md:w-auto">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 bg-red-600 text-white text-[11px] font-black rounded-md border border-black uppercase font-mario leading-none">
                    {selectedNode.levelNumber}
                  </span>
                  <span className="text-lg sm:text-xl font-black text-amber-300 font-display">
                    {selectedNode.name}: {selectedNode.worldName}
                  </span>
                  <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-700">
                    {selectedNode.badge}
                  </span>
                  {selectedWorldProgress && (
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-xs font-black border ${
                        selectedWorldProgress.isWorldCleared
                          ? 'bg-emerald-400 text-slate-950 border-black'
                          : 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                      }`}
                    >
                      {selectedWorldProgress.isWorldCleared
                        ? '★ WORLD CLEARED (100%)'
                        : `${selectedWorldProgress.completedCount}/${selectedWorldProgress.totalCount} Stages Mastered (${selectedWorldProgress.percent}%)`}
                    </span>
                  )}
                </div>
                <p className={`${bodyTextClass} text-slate-200 font-semibold text-xs sm:text-sm`}>
                  {selectedNode.summary}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onSelectWorld(selectedNode.id)}
                className="min-h-[48px] inline-flex items-center justify-center gap-2 px-6 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_4px_0_#000] active:translate-y-0.5 text-sm sm:text-base cursor-pointer transition-transform w-full md:w-auto flex-shrink-0 whitespace-nowrap"
              >
                <span>ENTER {selectedNode.levelNumber}</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              </button>
            </div>

            {/* Interactive Unlocked Topics Map Progression Grid */}
            {selectedWorldProgress && selectedWorldProgress.topics.length > 0 && (
              <div className="pt-3 border-t border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase text-amber-400 font-mario flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>STAGE UNLOCK PROGRESSION — COMPLETE ALL FOR +50 COINS LEVEL-UP!</span>
                  </span>
                  <div className="w-full sm:w-44 h-2.5 bg-slate-950 rounded-full border border-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-transform duration-300 origin-left"
                      style={{ transform: `scaleX(${selectedWorldProgress.percent / 100})` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {selectedWorldProgress.topics.map((topic) => {
                    const isShortcutKey = shortcutMapActive && isShortcutKeyTopic(topic.id);
                    return (
                      <div
                        key={topic.id}
                        data-testid={`map-topic-row-${topic.id}`}
                        className={`rounded-xl p-3 border-2 flex items-center justify-between gap-2.5 transition-all ${
                          isShortcutKey
                            ? 'bg-amber-950/55 border-amber-300 ring-2 ring-amber-400/50 text-white'
                            : topic.isCompleted
                            ? 'bg-emerald-950/45 border-emerald-400/80 text-white'
                            : topic.isUnlocked
                            ? 'bg-slate-800/90 border-amber-400/50 text-white'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            if (onSelectTopic) {
                              onSelectTopic(selectedNode.id, topic.id);
                            } else {
                              onSelectWorld(selectedNode.id);
                            }
                          }}
                          className="min-h-[44px] flex items-center gap-2.5 min-w-0 text-left flex-1 cursor-pointer"
                        >
                          <span
                            className={`w-9 h-9 rounded-lg border border-black flex items-center justify-center shrink-0 font-black text-xs font-mario ${
                              topic.isCompleted
                                ? 'bg-emerald-400 text-slate-950'
                                : topic.isUnlocked
                                ? 'bg-amber-400 text-slate-950'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {topic.isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                            ) : topic.isUnlocked ? (
                              <Unlock className="w-4 h-4" />
                            ) : (
                              <Lock className="w-4 h-4" />
                            )}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                              <span className="font-black font-mono uppercase text-amber-300">
                                Stage {selectedNode.levelNumber.replace('WORLD ', '')}-{topic.stageOrder}
                              </span>
                              <span aria-hidden="true" className="text-slate-500">·</span>
                              <span className="text-slate-300 font-bold">{topic.badge}</span>
                              {isShortcutKey && (
                                <>
                                  <span aria-hidden="true" className="text-amber-400">·</span>
                                  <span className="inline-flex items-center gap-0.5 text-amber-300 font-black uppercase">
                                    <MapPin className="w-3 h-3" /> Key Bar Topic
                                  </span>
                                </>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm font-black truncate mt-0.5">
                              {topic.title}
                            </p>
                            {isShortcutKey && SHORTCUT_MAP_HIGHLIGHTS[topic.id] && (
                              <p className="text-[11px] text-amber-200 font-semibold truncate mt-0.5">
                                ★ {SHORTCUT_MAP_HIGHLIGHTS[topic.id].barShortcutNote}
                              </p>
                            )}
                          </div>
                        </button>

                        {onToggleTopicComplete && (
                          <button
                            type="button"
                            onClick={() => onToggleTopicComplete(topic.id)}
                            data-testid={`map-toggle-complete-${topic.id}`}
                            aria-label={
                              topic.isCompleted
                                ? `Unmark ${topic.title} as complete`
                                : `Mark ${topic.title} as complete`
                            }
                            className={`min-h-[44px] min-w-[44px] px-3 rounded-xl border border-black font-black text-[10px] font-mario inline-flex items-center justify-center gap-1 shrink-0 cursor-pointer transition-colors ${
                              topic.isCompleted
                                ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'
                                : 'bg-slate-700 hover:bg-amber-400 hover:text-slate-950 text-amber-300'
                            }`}
                          >
                            {topic.isCompleted ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">DONE</span>
                              </>
                            ) : (
                              <>
                                <MarioCoinIcon className="w-3.5 h-3.5" />
                                <span>+2</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Group Members / Project Team Showcase Card with Matthew Official Main Creator Attribution */}
      <section
        aria-label="Project Group Members"
        data-testid="group-members-card"
        className="bg-white rounded-3xl mario-card border-4 border-slate-950 p-4 sm:p-6 shadow-[6px_6px_0_#000]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-200 pb-3.5 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 border-2 border-black flex items-center justify-center shrink-0 shadow-[0_2px_0_#000]">
              <Award className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-red-600 font-mario block">
                CREATED BY MATTHEW · MAIN CREATOR OF THIS MEMORY AID
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-950 font-display">
                AUTHORSHIP &amp; PROJECT GROUP MEMBERS
              </h3>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-600 tabular-nums">
            Lead Creator: {MAIN_CREATOR_AUTHOR.shortBadge} · {GROUP_MEMBERS.length} Members
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {GROUP_MEMBERS.map((memberName, idx) => {
            const isMainCreator = memberName === MAIN_CREATOR_AUTHOR.memberListing;
            return (
              <div
                key={memberName}
                className={`flex items-center justify-between gap-2.5 p-3 rounded-2xl border-2 ${
                  isMainCreator
                    ? 'bg-amber-50 border-amber-600 shadow-[2px_2px_0_#0f172a]'
                    : 'bg-slate-50 border-slate-900 shadow-[2px_2px_0_#0f172a]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-7 h-7 rounded-xl border border-black font-black text-xs font-mario inline-flex items-center justify-center shrink-0 ${
                      isMainCreator ? 'bg-amber-400 text-slate-950' : 'bg-red-600 text-white'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <span className="font-black text-xs sm:text-sm text-slate-950 tracking-tight truncate block">
                      {memberName}
                    </span>
                    {isMainCreator && (
                      <span className="text-[10px] font-bold text-amber-900 block">
                        Main Creator of this Memory Aid
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
