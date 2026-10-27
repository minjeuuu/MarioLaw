import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ALL_LAW_TOPICS,
  WORLDS_METADATA,
} from './data/laborLawData';
import { Navbar } from './components/Navbar';
import { WorldMap } from './components/WorldMap';
import { TopicCard } from './components/TopicCard';
import { StageProgressBar } from './components/StageProgressBar';
import { BenefitsCalculator } from './components/Calculator';
import { RegionalWageMatrix } from './components/RegionalWageMatrix';
import { FlashcardsView } from './components/FlashcardsView';
import { BarQuizQuest } from './components/BarQuizQuest';
import { Game2D } from './components/Game2D';
import { Game3D } from './components/Game3D';
import { GameVault } from './components/GameVault';
import { ToadShop } from './components/ToadShop';
import { HolidaysView } from './components/HolidaysView';
import { DailyRewardModal } from './components/DailyRewardModal';
import { AutoScrollController } from './components/AutoScrollController';
import { ExportProgressModal } from './components/ExportProgressModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { PrintStudyGuideModal } from './components/PrintStudyGuideModal';
import { StudyNotesDrawer } from './components/StudyNotesDrawer';
import { LevelUpModal } from './components/LevelUpModal';
import { OfflineIndicator } from './components/PWAInstallButton';
import { UserProfileModal } from './components/UserProfileModal';
import { AppWalkthroughModal } from './components/AppWalkthroughModal';
import { CoinLeaderboardModal } from './components/CoinLeaderboardModal';
import {
  MarioMushroomIcon,
  MarioFireFlowerIcon,
  MarioStarIcon,
  MarioPeachCrownIcon,
  Mario1UpIcon,
  MarioCoinIcon,
  MarioCharacterAvatar,
} from './components/MarioIcons';
import { marioAudio } from './utils/audio';
import {
  syncDailyLoginStreak,
  readStoredStudyDifficulty,
  STUDY_DIFFICULTY_KEY,
  STREAK_COUNT_KEY,
} from './utils/studyModes';
import {
  CLAIMED_WORLD_LEVELUPS_KEY,
  evaluateWorldLevelUp,
  GROUP_MEMBERS,
  MAIN_CREATOR_AUTHOR,
  SUPER_STAR_EXPIRY_STORAGE_KEY,
  SHORTCUT_MAP_ACTIVE_STORAGE_KEY,
  activateSuperStarBuff,
  getSuperStarBuffStatus,
  computeEffectiveCoinReward,
  loadStudyNotes,
  StudyNoteItem,
} from './utils/engagementFeatures';
import {
  ColorMode,
  readStoredColorMode,
  saveStoredColorMode,
  shouldAutoOpenWalkthrough,
  markWalkthroughCompleted,
  loadPlayerProfileStats,
  savePlayerProfileStats,
  recordStudySeconds,
  recordPomodoroFocusFinish,
  recordCompletedQuizRun,
  toggleNeedsImprovementTopic,
  toggleNeedsImprovementWorld,
  evaluateAchievements,
  EvaluatedAchievement,
  PlayerProfileStats,
  QuizCompletionPayload,
} from './utils/profileAchievements';
import {
  MarioTheme,
  MarioAvatar,
  ComplexityMode,
  StudyDifficulty,
  StudyCompanionId,
  CardFrameId,
} from './types/laborLaw';
import {
  ArrowRight,
  ShoppingBag,
  Flame,
  Calendar,
  Users,
  Award,
  X,
  Compass,
  BookOpen,
  HelpCircle,
  Trophy,
  Gamepad2,
  Zap,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('map');
  const [activeWorld, setActiveWorld] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [coins, setCoins] = useState<number>(35);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [zenMode, setZenMode] = useState<boolean>(false);

  // Modals & Persistent Drawers
  const [isDailyRewardOpen, setIsDailyRewardOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState<boolean>(false);
  const [isPrintGuideOpen, setIsPrintGuideOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [quickStudyLaunchId, setQuickStudyLaunchId] = useState<number>(0);
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return shouldAutoOpenWalkthrough(window.location.search, window.localStorage);
    }
    return false;
  });

  // Dark / Light Mode state synced with <html class="dark">
  const [colorMode, setColorMode] = useState<ColorMode>(() => {
    if (typeof window !== 'undefined') {
      return readStoredColorMode(window.localStorage);
    }
    return 'light';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', colorMode === 'dark');
    }
    if (typeof window !== 'undefined') {
      saveStoredColorMode(colorMode, window.localStorage);
    }
  }, [colorMode]);

  const handleToggleColorMode = (explicitMode?: ColorMode) => {
    setColorMode((prev) =>
      explicitMode ? explicitMode : prev === 'dark' ? 'light' : 'dark'
    );
  };

  // Persistent Player Profile Stats & Achievements
  const [profileStats, setProfileStats] = useState<PlayerProfileStats>(() =>
    typeof window !== 'undefined'
      ? loadPlayerProfileStats(window.localStorage)
      : loadPlayerProfileStats(null)
  );
  const [achievementBanner, setAchievementBanner] = useState<EvaluatedAchievement | null>(
    null
  );

  const [studyNotes, setStudyNotes] = useState<StudyNoteItem[]>(() =>
    typeof window !== 'undefined' ? loadStudyNotes(window.localStorage) : []
  );
  const [claimedWorldIds, setClaimedWorldIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(CLAIMED_WORLD_LEVELUPS_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const [levelUpCelebration, setLevelUpCelebration] = useState<{
    worldId: string | null;
    bonusCoins: number;
  }>({ worldId: null, bonusCoins: 0 });

  // Global Ctrl+K / Cmd+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsGlobalSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Unlocked Themes & Avatars
  const [activeTheme, setActiveTheme] = useState<MarioTheme>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mario_active_theme') as MarioTheme;
        return saved || 'overworld';
      } catch {
        return 'overworld';
      }
    }
    return 'overworld';
  });

  const [equippedAvatar, setEquippedAvatar] = useState<MarioAvatar>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mario_equipped_avatar') as MarioAvatar;
        return saved || 'mario';
      } catch {
        return 'mario';
      }
    }
    return 'mario';
  });

  // Super Star Power-Up (2x Coins for 10m), Shortcut Map, Companions & Card Frames
  const [superStarEndsAt, setSuperStarEndsAt] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        return Number(localStorage.getItem(SUPER_STAR_EXPIRY_STORAGE_KEY) || '0') || 0;
      } catch {
        return 0;
      }
    }
    return 0;
  });
  const [buffNowMs, setBuffNowMs] = useState<number>(() => Date.now());

  useEffect(() => {
    if (superStarEndsAt <= Date.now()) return;
    setBuffNowMs(Date.now());
    const id = window.setInterval(() => {
      const now = Date.now();
      setBuffNowMs(now);
      if (now >= superStarEndsAt) {
        window.clearInterval(id);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [superStarEndsAt]);

  const superStarStatus = useMemo(
    () => getSuperStarBuffStatus(superStarEndsAt, buffNowMs),
    [superStarEndsAt, buffNowMs]
  );

  const [shortcutMapActive, setShortcutMapActive] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem(SHORTCUT_MAP_ACTIVE_STORAGE_KEY) === 'true';
      } catch {
        return false;
      }
    }
    return false;
  });

  const [equippedCompanion, setEquippedCompanion] = useState<StudyCompanionId>(() => {
    const validCompanions: StudyCompanionId[] = [
      'comp_none',
      'comp_luma',
      'comp_baby_yoshi',
      'comp_polterpup',
      'comp_counsel_toad',
      'comp_chain_chomp',
      'comp_lakitu',
    ];
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('mario_equipped_companion') as StudyCompanionId | null;
        return stored && validCompanions.includes(stored) ? stored : 'comp_none';
      } catch {
        return 'comp_none';
      }
    }
    return 'comp_none';
  });

  const [equippedCardFrame, setEquippedCardFrame] = useState<CardFrameId>(() => {
    const validFrames: CardFrameId[] = [
      'frame_default',
      'frame_royal_gold',
      'frame_starlight_prism',
      'frame_retro_brick',
      'frame_emerald_pipe',
      'frame_supreme_crimson',
    ];
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('mario_equipped_card_frame') as CardFrameId | null;
        return stored && validFrames.includes(stored) ? stored : 'frame_default';
      } catch {
        return 'frame_default';
      }
    }
    return 'frame_default';
  });

  const hasMushroomCoinCharm = () => {
    if (typeof window === 'undefined') return false;
    try {
      const raw = localStorage.getItem('mario_unlocked_items');
      const arr: string[] = raw ? JSON.parse(raw) : [];
      return arr.includes('booster_coin_charm');
    } catch {
      return false;
    }
  };

  const handleActivateSuperStar = (durationMinutes: number) => {
    const now = Date.now();
    const nextExpiry = activateSuperStarBuff(superStarEndsAt, now, durationMinutes * 60 * 1000);
    setSuperStarEndsAt(nextExpiry);
    setBuffNowMs(now);
    try {
      localStorage.setItem(SUPER_STAR_EXPIRY_STORAGE_KEY, String(nextExpiry));
    } catch {
      // ignore
    }
  };

  const handleToggleShortcutMap = (active: boolean) => {
    setShortcutMapActive(active);
    try {
      localStorage.setItem(SHORTCUT_MAP_ACTIVE_STORAGE_KEY, String(active));
    } catch {
      // ignore
    }
  };

  const handleEquipCompanion = (id: StudyCompanionId) => {
    setEquippedCompanion(id);
    try {
      localStorage.setItem('mario_equipped_companion', id);
    } catch {
      // ignore
    }
  };

  const handleEquipCardFrame = (id: CardFrameId) => {
    setEquippedCardFrame(id);
    try {
      localStorage.setItem('mario_equipped_card_frame', id);
    } catch {
      // ignore
    }
  };

  // Complexity Mode: 'beginner' vs 'advanced'
  const [complexityMode, setComplexityMode] = useState<ComplexityMode>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mario_complexity_mode') as ComplexityMode;
        return saved || 'beginner';
      } catch {
        return 'beginner';
      }
    }
    return 'beginner';
  });

  const handleSetComplexityMode = (mode: ComplexityMode) => {
    setComplexityMode(mode);
    try {
      localStorage.setItem('mario_complexity_mode', mode);
    } catch {
      // fallback
    }
  };

  // Global Study Difficulty ('casual' vs 'exam_prep') for Flashcards & Quizzes
  const [studyDifficulty, setStudyDifficultyState] = useState<StudyDifficulty>(() => {
    if (typeof window !== 'undefined') {
      try {
        return readStoredStudyDifficulty(window.localStorage);
      } catch {
        return 'exam_prep';
      }
    }
    return 'exam_prep';
  });

  const handleSetStudyDifficulty = (diff: StudyDifficulty) => {
    setStudyDifficultyState(diff);
    try {
      localStorage.setItem(STUDY_DIFFICULTY_KEY, diff);
    } catch {
      // fallback
    }
  };

  // Global Legal Citations Toggle for Bar students
  const [showLegalCitations, setShowLegalCitationsState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mario_legal_citations');
        return saved !== null ? saved === 'true' : true;
      } catch {
        return true;
      }
    }
    return true;
  });

  const handleSetShowLegalCitations = (show: boolean) => {
    setShowLegalCitationsState(show);
    try {
      localStorage.setItem('mario_legal_citations', String(show));
    } catch {
      // ignore
    }
  };

  // Daily Login Streak Counter synced with localStorage
  const [loginStreak, setLoginStreak] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        return syncDailyLoginStreak(window.localStorage).streak;
      } catch {
        return 1;
      }
    }
    return 1;
  });

  const [isBonusClaimedToday, setIsBonusClaimedToday] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        return syncDailyLoginStreak(window.localStorage).isBonusClaimedToday;
      } catch {
        return false;
      }
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const synced = syncDailyLoginStreak(window.localStorage);
      setLoginStreak(synced.streak);
      setIsBonusClaimedToday(synced.isBonusClaimedToday);
    } catch {
      // fallback
    }
  }, []);

  // Completed / Studied topics persistence
  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mario_completed_topics');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const handleToggleTopicComplete = (topicId: string) => {
    const isNowDone = !completedTopicIds.includes(topicId);
    let next: string[];

    if (isNowDone) {
      next = [...completedTopicIds, topicId];
      // Coin collection SFX when topic is marked complete
      marioAudio.playCoin();

      const levelUpCheck = evaluateWorldLevelUp({
        toggledTopicId: topicId,
        previousCompletedIds: completedTopicIds,
        nextCompletedIds: next,
        allTopics: ALL_LAW_TOPICS,
        claimedWorldIds,
      });

      if (levelUpCheck.triggered && levelUpCheck.worldId) {
        const effectiveReward = computeEffectiveCoinReward(
          2 + levelUpCheck.bonusCoins,
          {
            isSuperStarActive: getSuperStarBuffStatus(superStarEndsAt).isActive,
            hasMushroomCoinCharm: hasMushroomCoinCharm(),
          }
        );
        setCoins((c) => c + effectiveReward);
        setClaimedWorldIds(levelUpCheck.updatedClaimedWorlds);
        try {
          localStorage.setItem(
            CLAIMED_WORLD_LEVELUPS_KEY,
            JSON.stringify(levelUpCheck.updatedClaimedWorlds)
          );
        } catch {
          // fallback
        }
        setLevelUpCelebration({
          worldId: levelUpCheck.worldId,
          bonusCoins: levelUpCheck.bonusCoins,
        });
      } else {
        const effectiveReward = computeEffectiveCoinReward(2, {
          isSuperStarActive: getSuperStarBuffStatus(superStarEndsAt).isActive,
          hasMushroomCoinCharm: hasMushroomCoinCharm(),
        });
        setCoins((c) => c + effectiveReward);
      }
    } else {
      next = completedTopicIds.filter((id) => id !== topicId);
      marioAudio.playJump();
    }

    setCompletedTopicIds(next);
    try {
      localStorage.setItem('mario_completed_topics', JSON.stringify(next));
    } catch {
      // fallback
    }
  };

  const handleResetProgress = () => {
    setCompletedTopicIds([]);
    try {
      localStorage.removeItem('mario_completed_topics');
    } catch {
      // fallback
    }
    marioAudio.playPipe();
  };

  const handleMarkAllComplete = () => {
    const allIds = ALL_LAW_TOPICS.map((t) => t.id);
    setCompletedTopicIds(allIds);
    try {
      localStorage.setItem('mario_completed_topics', JSON.stringify(allIds));
    } catch {
      // fallback
    }
    marioAudio.playQuizComplete();
  };

  // Helper for world icons
  const renderWorldIcon = (iconType: string, className = 'w-5 h-5') => {
    switch (iconType) {
      case 'mushroom':
        return <MarioMushroomIcon className={className} />;
      case 'flower':
        return <MarioFireFlowerIcon className={className} />;
      case 'star':
        return <MarioStarIcon className={className} />;
      case 'crown':
        return <MarioPeachCrownIcon className={className} />;
      case '1up':
        return <Mario1UpIcon className={className} />;
      default:
        return <MarioMushroomIcon className={className} />;
    }
  };

  // Filter topics based on active world and search query
  const displayedTopics = useMemo(() => {
    return ALL_LAW_TOPICS.filter((topic) => {
      const matchesWorld = activeWorld === 'all' || topic.worldId === activeWorld;
      if (!matchesWorld) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const titleMatch = topic.title.toLowerCase().includes(q);
      const summaryMatch = topic.summary.toLowerCase().includes(q);
      const badgeMatch = topic.badge.toLowerCase().includes(q);
      const docMatch = topic.keyDoctrines.some((d) => d.toLowerCase().includes(q));
      const rulesMatch = topic.rules.some(
        (r) =>
          r.heading.toLowerCase().includes(q) ||
          (r.items && r.items.some((i) => i.toLowerCase().includes(q))) ||
          (r.description && r.description.toLowerCase().includes(q))
      );
      const tipsMatch = topic.barTips && topic.barTips.some((t) => t.toLowerCase().includes(q));

      return titleMatch || summaryMatch || badgeMatch || docMatch || rulesMatch || tipsMatch;
    });
  }, [activeWorld, searchQuery]);

  const hasInitializedAudioSyncRef = useRef<boolean>(false);

  // Automatically sync persistent module/world BGM whenever activeTab or activeWorld changes
  useEffect(() => {
    const resolvedModuleId = (() => {
      if (activeTab === 'modules' || activeTab === 'flashcards') {
        return activeWorld !== 'all' ? activeWorld : 'world1';
      }
      if (activeTab === 'map') {
        return activeWorld !== 'all' ? activeWorld : 'world1';
      }
      if (
        activeTab === 'holidays' ||
        activeTab === 'wages_matrix' ||
        activeTab === 'calculator' ||
        activeTab === 'quiz' ||
        activeTab === 'vault' ||
        activeTab === 'shop'
      ) {
        return activeTab;
      }
      return 'world1';
    })();

    if (!hasInitializedAudioSyncRef.current) {
      hasInitializedAudioSyncRef.current = true;
      marioAudio.syncModuleAudio(resolvedModuleId, false);
      return;
    }

    marioAudio.syncModuleAudio(resolvedModuleId, false);
  }, [activeTab, activeWorld]);

  const handleWorldSelect = (worldId: string) => {
    setActiveWorld(worldId);
    if (worldId !== 'all') {
      marioAudio.syncModuleAudio(worldId, true);
    } else {
      marioAudio.syncModuleAudio('world1', false);
      marioAudio.playTabSwitch();
    }
  };

  const handleMapWorldSelect = (worldId: string) => {
    if (worldId === 'warp_calc') {
      setActiveTab('calculator');
      marioAudio.syncModuleAudio('calculator', false);
      marioAudio.playTabSwitch();
    } else if (worldId === 'wages_matrix') {
      setActiveTab('wages_matrix');
      marioAudio.syncModuleAudio('wages_matrix', false);
      marioAudio.playTabSwitch();
    } else if (worldId === 'holidays') {
      setActiveTab('holidays');
      marioAudio.syncModuleAudio('holidays', true);
    } else {
      setActiveWorld(worldId);
      setActiveTab('modules');
      marioAudio.syncModuleAudio(worldId, true);
    }
  };

  const handleEarnCoin = () => {
    const reward = computeEffectiveCoinReward(1, {
      isSuperStarActive: getSuperStarBuffStatus(superStarEndsAt).isActive,
      hasMushroomCoinCharm: hasMushroomCoinCharm(),
    });
    setCoins((c) => c + reward);
  };

  const handleEarnCoins = (amount: number) => {
    if (amount <= 0) return;
    const reward = computeEffectiveCoinReward(amount, {
      isSuperStarActive: getSuperStarBuffStatus(superStarEndsAt).isActive,
      hasMushroomCoinCharm: false,
    });
    setCoins((c) => c + reward);
  };

  // Wrapper for GameVault so arcade coin pickups also receive the Super Star 2x buff
  const handleArcadeSetCoins: React.Dispatch<React.SetStateAction<number>> = (updater) => {
    setCoins((prev) => {
      const rawNext = typeof updater === 'function' ? updater(prev) : updater;
      const delta = rawNext - prev;
      if (delta > 0 && getSuperStarBuffStatus(superStarEndsAt).isActive) {
        return prev + delta * 2;
      }
      return rawNext;
    });
  };

  const handleStartQuickStudy = () => {
    setActiveTab('flashcards');
    setQuickStudyLaunchId((n) => n + 1);
    marioAudio.playPowerUp();
  };

  const handleToggleNeedsImprovementTopic = (topicId: string) => {
    setProfileStats((prev) => toggleNeedsImprovementTopic(prev, topicId));
  };

  const handleToggleNeedsImprovementWorld = (worldId: string) => {
    setProfileStats((prev) => toggleNeedsImprovementWorld(prev, worldId));
  };

  const handleBoostStreak = (days: number) => {
    setLoginStreak((prev) => {
      const next = Math.max(1, prev + days);
      try {
        localStorage.setItem(STREAK_COUNT_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Persist profile stats whenever updated
  useEffect(() => {
    if (typeof window !== 'undefined') {
      savePlayerProfileStats(profileStats, window.localStorage);
    }
  }, [profileStats]);

  // Passive active-study heartbeat (credits 15s every 15s while document is visible on study/quiz/calc tabs)
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        setProfileStats((prev) => recordStudySeconds(prev, 15));
      }
    }, 15000);
    return () => window.clearInterval(interval);
  }, []);

  const handlePomodoroStudySeconds = (secs: number) => {
    setProfileStats((prev) => recordStudySeconds(prev, secs));
  };

  const handlePomodoroFocusComplete = () => {
    setProfileStats((prev) => recordPomodoroFocusFinish(prev, 0));
  };

  const handleQuizCompleted = (payload: QuizCompletionPayload) => {
    setProfileStats((prev) => recordCompletedQuizRun(prev, payload));
  };

  const handleUpdatePlayerName = (name: string) => {
    setProfileStats((prev) => ({ ...prev, playerName: name }));
  };

  const handleSelectAvatarPersist = (avatar: MarioAvatar) => {
    setEquippedAvatar(avatar);
    try {
      localStorage.setItem('mario_equipped_avatar', avatar);
    } catch {
      // ignore
    }
  };

  const handleCompleteWalkthrough = (navigateToTab?: string) => {
    const firstGraduation = !profileStats.walkthroughCompleted;
    if (typeof window !== 'undefined') {
      markWalkthroughCompleted(window.localStorage);
    }
    if (firstGraduation) {
      setProfileStats((prev) => ({
        ...prev,
        walkthroughCompleted: true,
      }));
    }
    if (navigateToTab) {
      setActiveTab(navigateToTab);
    }
    setIsWalkthroughOpen(false);
  };

  const world1TopicIds = useMemo(
    () => ALL_LAW_TOPICS.filter((t) => t.worldId === 'world1').map((t) => t.id),
    []
  );

  const achievementSync = useMemo(
    () =>
      evaluateAchievements({
        stats: profileStats,
        completedTopicIds,
        totalTopicsCount: ALL_LAW_TOPICS.length,
        world1TopicIds,
        loginStreak,
        notesCount: studyNotes.length,
      }),
    [profileStats, completedTopicIds, world1TopicIds, loginStreak, studyNotes.length]
  );

  // Sync newly unlocked achievement dates & reward coins automatically
  useEffect(() => {
    if (achievementSync.newlyUnlocked.length > 0) {
      setProfileStats(achievementSync.updatedStats);
      if (achievementSync.totalBonusCoinsEarned > 0) {
        setCoins((c) => c + achievementSync.totalBonusCoinsEarned);
      }
      setAchievementBanner(achievementSync.newlyUnlocked[0]);
      marioAudio.playAchievementUnlock();
    }
  }, [achievementSync]);

  useEffect(() => {
    if (achievementBanner) {
      const timer = setTimeout(() => {
        setAchievementBanner(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [achievementBanner]);

  const unlockedAchievementsCount = useMemo(
    () => achievementSync.achievements.filter((a) => a.unlocked).length,
    [achievementSync.achievements]
  );

  // Font styling class
  const bodyTextClass =
    fontSize === 'xlarge' ? 'text-xl' : fontSize === 'large' ? 'text-lg' : 'text-base';

  return (
    <div className={`min-h-screen flex flex-col text-slate-900 dark:text-slate-100 pb-16 antialiased theme-${activeTheme} w-full max-w-full`}>
      {/* Main Navigation Container — Safe Top Padding so UI is never cropped on mobile */}
      <div className="sticky top-0 z-40 w-full bg-[#0f172a] safe-top-nav">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          fontSize={fontSize}
          setFontSize={setFontSize}
          coins={coins}
          setCoins={setCoins}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          zenMode={zenMode}
          setZenMode={setZenMode}
          complexityMode={complexityMode}
          setComplexityMode={handleSetComplexityMode}
          studyDifficulty={studyDifficulty}
          setStudyDifficulty={handleSetStudyDifficulty}
          loginStreak={loginStreak}
          isBonusClaimedToday={isBonusClaimedToday}
          equippedAvatar={equippedAvatar}
          colorMode={colorMode}
          onToggleColorMode={() => handleToggleColorMode()}
          unlockedAchievementsCount={unlockedAchievementsCount}
          totalAchievementsCount={achievementSync.achievements.length}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenWalkthrough={() => setIsWalkthroughOpen(true)}
          onStudySecondsTick={handlePomodoroStudySeconds}
          onFocusSessionComplete={handlePomodoroFocusComplete}
          onEarnCoins={handleEarnCoins}
          onOpenShop={() => {
            setActiveTab('shop');
            marioAudio.playCoin();
          }}
          onOpenDailyReward={() => setIsDailyRewardOpen(true)}
          onOpenExportProgress={() => setIsExportModalOpen(true)}
          onOpenGlobalSearch={() => setIsGlobalSearchOpen(true)}
          onOpenPrintGuide={() => setIsPrintGuideOpen(true)}
          showLegalCitations={showLegalCitations}
          setShowLegalCitations={handleSetShowLegalCitations}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          onStartQuickStudy={handleStartQuickStudy}
          superStarRemainingLabel={
            superStarStatus.isActive ? superStarStatus.formattedRemaining : null
          }
        />
      </div>

      {/* Main Container with Mobile Bottom Nav Padding */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 pt-4 sm:pt-6 md:pt-8 pb-24 lg:pb-8 overflow-x-hidden">
        {/* Tab 0: Super Mario World Overworld Interactive Map */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <WorldMap
              onSelectWorld={handleMapWorldSelect}
              onSelectTopic={(worldId, topicId) => {
                setActiveWorld(worldId);
                setActiveTab('modules');
                marioAudio.syncModuleAudio(worldId, true);
                setTimeout(() => {
                  const el = document.getElementById(`topic-card-${topicId}`);
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 150);
              }}
              activeWorld={activeWorld}
              fontSize={fontSize}
              equippedAvatar={equippedAvatar}
              setEquippedAvatar={setEquippedAvatar}
              completedTopicIds={completedTopicIds}
              onToggleTopicComplete={handleToggleTopicComplete}
              onOpenWalkthrough={() => setIsWalkthroughOpen(true)}
              onOpenProfile={() => setIsProfileOpen(true)}
              unlockedAchievementsCount={unlockedAchievementsCount}
              loginStreak={loginStreak}
              onStartQuickStudy={handleStartQuickStudy}
              onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
              shortcutMapActive={shortcutMapActive}
              needsImprovementCount={
                (profileStats.needsImprovementTopicIds?.length || 0) +
                (profileStats.needsImprovementWorlds?.length || 0)
              }
              onEarnCoins={handleEarnCoins}
              superStarActive={superStarStatus.isActive}
            />

            {/* Quick Access Portal Banners — Equal Height & Aligned Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('modules');
                  setActiveWorld('all');
                  marioAudio.playTabSwitch();
                }}
                className="h-full text-left bg-white rounded-2xl p-4 border-4 border-slate-950 shadow-[4px_4px_0_#000] hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 bg-red-100 border-2 border-red-700 rounded-xl flex items-center justify-center shrink-0">
                    <MarioMushroomIcon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-slate-950 text-sm sm:text-base font-display truncate">All 6 Worlds</h3>
                    <p className="text-xs font-bold text-slate-600 truncate">Full statutory guide</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-red-600 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('holidays');
                  marioAudio.playTabSwitch();
                }}
                className="h-full text-left bg-white rounded-2xl p-4 border-4 border-slate-950 shadow-[4px_4px_0_#000] hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 bg-rose-100 border-2 border-rose-700 rounded-xl flex items-center justify-center shrink-0">
                    <Calendar className="w-6 h-6 text-rose-700" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-slate-950 text-sm sm:text-base font-display truncate">Holidays Hub</h3>
                    <p className="text-xs font-bold text-slate-600 truncate">12 Regular & Special</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-rose-600 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('shop');
                  marioAudio.playCoin();
                }}
                className="h-full text-left bg-white rounded-2xl p-4 border-4 border-slate-950 shadow-[4px_4px_0_#000] hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 bg-emerald-100 border-2 border-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-6 h-6 text-emerald-800" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-slate-950 text-sm sm:text-base font-display truncate">Toad&apos;s Shop</h3>
                    <p className="text-xs font-bold text-slate-600 truncate">34 Heroes &amp; Perks</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('vault');
                  marioAudio.playCardAction();
                }}
                className="h-full text-left bg-white rounded-2xl p-4 border-4 border-slate-950 shadow-[4px_4px_0_#000] hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 bg-amber-100 border-2 border-amber-600 rounded-xl flex items-center justify-center shrink-0">
                    <MarioStarIcon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-slate-950 text-sm sm:text-base font-display truncate">Game Vault</h3>
                    <p className="text-xs font-bold text-slate-600 truncate">17 Arcade Games</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-600 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('quiz');
                  marioAudio.playCardAction();
                }}
                className="h-full text-left bg-white rounded-2xl p-4 border-4 border-slate-950 shadow-[4px_4px_0_#000] hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 bg-red-100 border-2 border-red-800 rounded-xl flex items-center justify-center shrink-0">
                    <Flame className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-slate-950 text-sm sm:text-base font-display truncate">Boss &amp; Quiz</h3>
                    <p className="text-xs font-bold text-slate-600 truncate">189+ Bar Scenarios</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-red-700 shrink-0" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: All Unabridged Modules View */}
        {activeTab === 'modules' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Breadcrumb Navigation Trail */}
            <nav
              aria-label="Module Breadcrumb Navigation"
              data-testid="modules-breadcrumb-nav"
              className="bg-white rounded-2xl border-3 border-slate-950 p-2 sm:p-2.5 shadow-[3px_3px_0_#000] flex items-center gap-1.5 sm:gap-2 flex-wrap text-xs font-black text-slate-800"
            >
              <button
                type="button"
                onClick={() => {
                  setActiveWorld('all');
                  marioAudio.playCoin();
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeWorld === 'all'
                    ? 'bg-amber-400 text-slate-950 border-2 border-black shadow-[0_1px_0_#000]'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <MarioMushroomIcon className="w-3.5 h-3.5 shrink-0" />
                <span>Labor Standards (All)</span>
              </button>

              <span className="text-slate-400 font-bold select-none">/</span>

              <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                {WORLDS_METADATA.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => {
                      setActiveWorld(w.id);
                      marioAudio.playPipe();
                    }}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                      activeWorld === w.id
                        ? 'bg-red-600 text-white border-2 border-black shadow-[0_1px_0_#000] font-black'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold'
                    }`}
                  >
                    <span>W{w.worldNumber}:</span>
                    <span className="truncate max-w-[100px] sm:max-w-none">{w.shortTitle}</span>
                  </button>
                ))}
              </div>
            </nav>

            {/* Visual Progress Bar with Equipped Avatar */}
            <StageProgressBar
              completedCount={completedTopicIds.length}
              totalTopics={ALL_LAW_TOPICS.length}
              completedTopicIds={completedTopicIds}
              onSelectWorld={(worldId) => {
                setActiveWorld(worldId);
                marioAudio.syncModuleAudio(worldId, true);
              }}
              onResetProgress={handleResetProgress}
              onMarkAllComplete={handleMarkAllComplete}
              fontSize={fontSize}
              avatar={equippedAvatar}
              onOpenExportProgress={() => setIsExportModalOpen(true)}
            />

            {/* Stage Select Banner */}
            <div className="bg-white rounded-3xl mario-card border-4 border-slate-950 p-4 sm:p-6 md:p-8 shadow-[6px_6px_0_#000]">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-2 border-slate-200 pb-4 mb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-600 text-white font-black rounded-lg border border-black text-[11px] uppercase mb-1.5 font-mario">
                    <MarioMushroomIcon className="w-3.5 h-3.5" />
                    <span>PHILIPPINE LABOR STANDARDS</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 tracking-tight font-display">
                    LABOR STANDARDS & PROTECTIVE LAWS
                  </h1>
                  <p className={`${bodyTextClass} text-slate-700 font-bold mt-1 max-w-2xl text-xs sm:text-sm`}>
                    100% Unabridged memory aid with zero omissions: statutory provisions, standards, exceptions, and wage formulas.
                  </p>
                </div>

                {/* Complexity Quick Switcher in Modules Header */}
                <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border-2 border-black self-start md:self-auto">
                  <span className="text-[10px] font-black uppercase text-amber-400 font-mario pl-2">MODE:</span>
                  <button
                    onClick={() => handleSetComplexityMode('beginner')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      complexityMode === 'beginner'
                        ? 'bg-amber-400 text-slate-950 shadow-[0_2px_0_#000]'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <MarioMushroomIcon className="w-3.5 h-3.5" />
                    <span>Beginner</span>
                  </button>
                  <button
                    onClick={() => handleSetComplexityMode('advanced')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      complexityMode === 'advanced'
                        ? 'bg-red-600 text-white shadow-[0_2px_0_#000]'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Advanced</span>
                  </button>
                </div>
              </div>

              {/* World Selector Stage Buttons - Mobile Responsive Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 sm:gap-2.5">
                <button
                  onClick={() => handleWorldSelect('all')}
                  className={`p-2.5 sm:p-3 rounded-2xl border-2 sm:border-3 border-black text-left transition-all cursor-pointer ${
                    activeWorld === 'all'
                      ? 'bg-amber-400 text-slate-950 shadow-[0_3px_0_#000] -translate-y-0.5'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <span className="text-[10px] font-black uppercase text-slate-600 block font-mario">ALL WORLDS</span>
                  <span className="font-black text-xs sm:text-sm flex items-center justify-between mt-1">
                    <span>Complete View</span>
                    <MarioStarIcon className="w-4 h-4 flex-shrink-0" />
                  </span>
                </button>

                {WORLDS_METADATA.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => handleWorldSelect(w.id)}
                    className={`p-2.5 sm:p-3 rounded-2xl border-2 sm:border-3 border-black text-left transition-all cursor-pointer ${
                      activeWorld === w.id
                        ? 'bg-amber-400 text-slate-950 shadow-[0_3px_0_#000] -translate-y-0.5'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase text-slate-600 block font-mario">
                      WORLD {w.worldNumber}
                    </span>
                    <span className="font-black text-xs sm:text-sm flex items-center justify-between mt-1">
                      <span className="truncate">{w.shortTitle}</span>
                      {renderWorldIcon(w.iconType, 'w-4 h-4 flex-shrink-0')}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active World Spotlight Banner */}
            {activeWorld !== 'all' && (
              <div className="bg-[#1e293b] text-white rounded-2xl p-4 sm:p-5 border-3 border-black shadow-[4px_4px_0_#000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-400 rounded-xl border-2 border-black flex items-center justify-center flex-shrink-0">
                    {renderWorldIcon(
                      WORLDS_METADATA.find((w) => w.id === activeWorld)?.iconType || 'mushroom',
                      'w-6 h-6'
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-amber-300 font-display">
                      {WORLDS_METADATA.find((w) => w.id === activeWorld)?.title}
                    </h2>
                    <p className="text-xs sm:text-sm font-semibold text-slate-300">
                      {WORLDS_METADATA.find((w) => w.id === activeWorld)?.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleWorldSelect('all')}
                  className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-black rounded-xl border border-white/40 cursor-pointer self-end sm:self-auto flex-shrink-0"
                >
                  Show All Worlds
                </button>
              </div>
            )}

            {/* Topics Stream with Studied & Need Improvement Tracking */}
            {displayedTopics.length > 0 ? (
              <div className="space-y-6">
                {displayedTopics.map((topic) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    fontSize={fontSize}
                    searchQuery={searchQuery}
                    isCompleted={completedTopicIds.includes(topic.id)}
                    onToggleComplete={() => handleToggleTopicComplete(topic.id)}
                    complexityMode={complexityMode}
                    showLegalCitations={showLegalCitations}
                    needsImprovement={Boolean(
                      profileStats.needsImprovementTopicIds?.includes(topic.id)
                    )}
                    onToggleNeedsImprovement={() => handleToggleNeedsImprovementTopic(topic.id)}
                    shortcutMapActive={shortcutMapActive}
                    equippedCardFrame={equippedCardFrame}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl mario-card border-4 border-slate-900 p-8 sm:p-12 text-center space-y-4">
                <div className="w-14 h-14 bg-red-100 rounded-full border-2 border-red-500 mx-auto flex items-center justify-center">
                  <MarioMushroomIcon className="w-8 h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                  No doctrines matched &quot;{searchQuery}&quot;
                </h3>
                <p className="text-slate-600 font-semibold max-w-md mx-auto text-sm">
                  Try searching for keywords like &quot;overtime&quot;, &quot;maternity&quot;, &quot;kasambahay&quot;, &quot;service charge&quot;, &quot;lactation&quot;, or &quot;distortion&quot;.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="min-h-[44px] px-6 py-2.5 bg-amber-400 text-slate-950 font-black rounded-xl border-2 border-black cursor-pointer shadow-[0_2px_0_#000]"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Toad's Item Shop */}
        {activeTab === 'shop' && (
          <ToadShop
            coins={coins}
            setCoins={setCoins}
            activeTheme={activeTheme}
            setActiveTheme={setActiveTheme}
            equippedAvatar={equippedAvatar}
            setEquippedAvatar={setEquippedAvatar}
            superStarEndsAt={superStarEndsAt}
            onActivateSuperStar={handleActivateSuperStar}
            shortcutMapActive={shortcutMapActive}
            onToggleShortcutMap={handleToggleShortcutMap}
            equippedCompanion={equippedCompanion}
            onEquipCompanion={handleEquipCompanion}
            equippedCardFrame={equippedCardFrame}
            onEquipCardFrame={handleEquipCardFrame}
            onBoostStreak={handleBoostStreak}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          />
        )}

        {/* Tab 3: Warp Zone Multiplier & Wage Calculator */}
        {activeTab === 'calculator' && (
          <BenefitsCalculator fontSize={fontSize} />
        )}

        {/* Tab 4: Regional Wage Matrix */}
        {activeTab === 'wages_matrix' && (
          <RegionalWageMatrix fontSize={fontSize} />
        )}

        {/* Tab 5: [ ? ] Mystery Block Flashcards & 5-Min Quick Study Mode */}
        {activeTab === 'flashcards' && (
          <FlashcardsView
            fontSize={fontSize}
            onEarnCoin={handleEarnCoin}
            onEarnCoins={handleEarnCoins}
            studyDifficulty={studyDifficulty}
            setStudyDifficulty={handleSetStudyDifficulty}
            activeWorld={activeWorld}
            profileStats={profileStats}
            completedTopicIds={completedTopicIds}
            onToggleNeedsImprovementWorld={handleToggleNeedsImprovementWorld}
            onOpenProfile={() => setIsProfileOpen(true)}
            quickStudyLaunchId={quickStudyLaunchId}
          />
        )}

        {/* Tab 6: Mario Arcade Game Vault (17 Total Games) */}
        {(activeTab === 'vault' || activeTab === 'game2d' || activeTab === 'game3d') && (
          <GameVault
            equippedAvatar={equippedAvatar}
            setEquippedAvatar={setEquippedAvatar}
            coins={coins}
            setCoins={handleArcadeSetCoins}
            fontSize={fontSize}
          />
        )}

        {/* Tab 7: Dedicated Philippine Holidays Hub */}
        {activeTab === 'holidays' && (
          <HolidaysView fontSize={fontSize} onEarnCoins={handleEarnCoins} />
        )}

        {/* Tab 8: Castle Quest & Boss Battle */}
        {activeTab === 'quiz' && (
          <BarQuizQuest
            fontSize={fontSize}
            onEarnCoins={handleEarnCoins}
            activeWorld={activeWorld}
            onChangeActiveWorld={setActiveWorld}
            studyDifficulty={studyDifficulty}
            setStudyDifficulty={handleSetStudyDifficulty}
            onQuizCompleted={handleQuizCompleted}
            onOpenProfile={() => setIsProfileOpen(true)}
            unlockedAchievementsCount={unlockedAchievementsCount}
          />
        )}
      </main>

      {/* Achievement Unlocked Celebration Toast */}
      {achievementBanner && (
        <div
          role="status"
          data-testid="achievement-unlocked-toast"
          className="fixed top-24 right-3 left-3 sm:left-auto sm:top-24 sm:right-6 z-40 sm:max-w-sm bg-[#0f172a] text-white rounded-2xl border-3 border-amber-400 shadow-[6px_6px_0_#000] p-3.5 flex items-start gap-3 print:hidden"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 border-2 border-black flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1 space-y-0.5">
            <span className="text-[10px] font-black uppercase text-amber-400 font-mario block">
              ACHIEVEMENT UNLOCKED!
            </span>
            <p className="text-sm font-black text-white font-display truncate">
              {achievementBanner.title}
            </p>
            <p className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
              <span>{achievementBanner.milestoneLabel}</span>
              <span className="inline-flex items-center gap-0.5 text-amber-300 font-black">
                <MarioCoinIcon className="w-3 h-3" />+{achievementBanner.coinReward}
              </span>
            </p>
            <button
              type="button"
              onClick={() => {
                setAchievementBanner(null);
                setIsProfileOpen(true);
              }}
              className="text-xs font-black text-emerald-300 hover:text-emerald-200 pt-0.5 cursor-pointer"
            >
              View Profile Badges →
            </button>
          </div>
          <button
            type="button"
            onClick={() => setAchievementBanner(null)}
            aria-label="Dismiss Achievement Notification"
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* User Profile & Milestone Achievements Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        stats={profileStats}
        onUpdatePlayerName={handleUpdatePlayerName}
        achievements={achievementSync.achievements}
        equippedAvatar={equippedAvatar}
        onSelectAvatar={handleSelectAvatarPersist}
        coins={coins}
        loginStreak={loginStreak}
        completedTopicsCount={completedTopicIds.length}
        totalTopicsCount={ALL_LAW_TOPICS.length}
        onNavigateAction={(tab, worldId) => {
          setActiveTab(tab);
          if (worldId) setActiveWorld(worldId);
          marioAudio.playTabSwitch();
        }}
        onOpenWalkthrough={() => setIsWalkthroughOpen(true)}
        onOpenExportScoreCard={() => setIsExportModalOpen(true)}
        onToggleNeedsImprovementTopic={handleToggleNeedsImprovementTopic}
        onToggleNeedsImprovementWorld={handleToggleNeedsImprovementWorld}
        onStartQuickStudy={() => {
          setIsProfileOpen(false);
          handleStartQuickStudy();
        }}
        onOpenLeaderboard={() => {
          setIsProfileOpen(false);
          setIsLeaderboardOpen(true);
        }}
      />

      {/* Global Coin Leaderboard Modal */}
      <CoinLeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        playerName={profileStats.playerName}
        onUpdatePlayerName={handleUpdatePlayerName}
        equippedAvatar={equippedAvatar}
        coins={coins}
        streakDays={loginStreak}
        completedTopicsCount={completedTopicIds.length}
      />

      {/* First-Time & On-Demand Complete 10-Chapter App Walkthrough Guide */}
      <AppWalkthroughModal
        isOpen={isWalkthroughOpen}
        onClose={() => handleCompleteWalkthrough()}
        onCompleteWalkthrough={handleCompleteWalkthrough}
        colorMode={colorMode}
        onToggleColorMode={(m) => handleToggleColorMode(m)}
        studyDifficulty={studyDifficulty}
        onSelectDifficulty={handleSetStudyDifficulty}
        equippedAvatar={equippedAvatar}
        onSelectAvatar={handleSelectAvatarPersist}
        alreadyGraduated={profileStats.walkthroughCompleted}
      />

      {/* Daily Login Reward Modal */}
      <DailyRewardModal
        isOpen={isDailyRewardOpen}
        onClose={() => setIsDailyRewardOpen(false)}
        coins={coins}
        setCoins={setCoins}
        streak={loginStreak}
        isBonusClaimedToday={isBonusClaimedToday}
        onClaimSuccess={(updatedStreak) => {
          setLoginStreak(updatedStreak);
          setIsBonusClaimedToday(true);
        }}
      />

      {/* Export Player Score Card Modal */}
      <ExportProgressModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        completedTopicIds={completedTopicIds}
        coins={coins}
      />

      {/* Global Search Modal (Ctrl+K) */}
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        onSelectResult={(tab, targetId) => {
          setActiveTab(tab);
          if (targetId) {
            setActiveWorld('all');
            setTimeout(() => {
              const el = document.getElementById(`topic-card-${targetId}`);
              el?.scrollIntoView({ behavior: 'smooth' });
            }, 150);
          }
        }}
        onOpenPrintGuide={() => setIsPrintGuideOpen(true)}
        onOpenShop={() => {
          setActiveTab('shop');
          marioAudio.playCoin();
        }}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onStartQuickStudy={handleStartQuickStudy}
      />

      {/* Print Study Guide & PDF Generator Modal */}
      <PrintStudyGuideModal
        isOpen={isPrintGuideOpen}
        onClose={() => setIsPrintGuideOpen(false)}
        completedTopicIds={completedTopicIds}
        coins={coins}
        studyNotes={studyNotes}
      />

      {/* World Completion 'Level Up' Celebration Modal */}
      <LevelUpModal
        worldId={levelUpCelebration.worldId}
        bonusCoins={levelUpCelebration.bonusCoins}
        onClose={() => setLevelUpCelebration({ worldId: null, bonusCoins: 0 })}
        onOpenWorldMap={() => {
          setActiveTab('map');
          marioAudio.playTabSwitch();
        }}
      />

      {/* Persistent Floating Right-Side 'Study Notes' Drawer */}
      <StudyNotesDrawer
        activeWorld={activeWorld}
        activeTab={activeTab}
        onNotesChange={setStudyNotes}
      />

      {/* PWA Offline Connectivity Indicator */}
      <OfflineIndicator />

      {/* Floating Auto-Scroll Speed Controller */}
      <AutoScrollController />

      {/* Summoned Study Companion Desk Widget (when equipped in Toad's Shop) */}
      {equippedCompanion !== 'comp_none' && (
        <button
          type="button"
          onClick={handleStartQuickStudy}
          data-testid="study-companion-widget"
          title="Study Companion Active — Click to launch a 5-Min Quick Study Sprint!"
          className="hidden sm:flex fixed bottom-20 left-4 lg:bottom-5 z-30 bg-[#0f172a] hover:bg-slate-900 text-white border-2 border-amber-400 rounded-2xl px-3 py-2 shadow-[4px_4px_0_#000] items-center gap-2.5 cursor-pointer transition-transform hover:-translate-y-0.5 print:hidden"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-400 border border-black flex items-center justify-center shrink-0">
            <MarioCharacterAvatar
              character={
                equippedCompanion === 'comp_baby_yoshi'
                  ? 'goldenyoshi'
                  : equippedCompanion === 'comp_luma'
                  ? 'cosmicrosalina'
                  : equippedCompanion === 'comp_counsel_toad'
                  ? 'lawyertoad'
                  : equippedCompanion === 'comp_polterpup'
                  ? 'boo'
                  : equippedCompanion === 'comp_lakitu'
                  ? 'koopatroopa'
                  : 'bowserjr'
              }
              className="w-6 h-6"
            />
          </div>
          <div className="text-left">
            <span className="text-[9px] font-black uppercase text-amber-300 font-mario block leading-none">
              STUDY COMPANION
            </span>
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1 mt-0.5">
              <Zap className="w-3 h-3 text-emerald-400" />
              <span>5-Min Quick Study</span>
            </span>
          </div>
        </button>
      )}

      {/* Mario Ground Footer with Discreet Official 'Created by Matthew' Credit & Group Members */}
      <footer className="mt-16 bg-[#1e293b] border-t-4 border-black text-amber-100 py-8 px-4 pb-24 lg:pb-8 shadow-[0_-4px_0_rgba(0,0,0,0.3)] print:hidden">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-bold text-sm border-b border-slate-700 pb-5">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <MarioMushroomIcon className="w-6 h-6 flex-shrink-0" />
              <span className="text-white font-black text-sm sm:text-base font-display">
                SUPER MARIO LABOR ADVENTURE
              </span>
              <span className="text-amber-300 font-semibold hidden sm:inline">
                · Philippine Labor Standards Memory Aid
              </span>
              <span
                data-testid="footer-matthew-credit"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-slate-900/90 border border-slate-700 rounded-lg px-2.5 py-1"
              >
                <MarioStarIcon className="w-3.5 h-3.5 shrink-0" />
                <span>{MAIN_CREATOR_AUTHOR.shortBadge}</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-200">Main Creator</span>
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 text-xs font-semibold text-slate-300 flex-wrap justify-center">
              <span>Hours of Work</span>
              <span aria-hidden="true">·</span>
              <span>Rest &amp; Holidays</span>
              <span aria-hidden="true">·</span>
              <span>Wages &amp; D.O. 174</span>
              <span aria-hidden="true">·</span>
              <span>Special Groups</span>
              <span aria-hidden="true">·</span>
              <span>Protective Laws</span>
              <span aria-hidden="true">·</span>
              <span>Statutory Leaves</span>
            </div>
          </div>

          {/* Group Members Roster in Global Footer */}
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-300 font-mario">
                <Users className="w-4 h-4 text-amber-400 shrink-0" />
                <span>GROUP MEMBERS &amp; AUTHORSHIP</span>
              </div>
              <span className="text-xs font-semibold text-slate-300">
                {MAIN_CREATOR_AUTHOR.fullCredit}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs font-bold text-slate-100">
              {GROUP_MEMBERS.map((member, index) => {
                const isMainCreator = member === MAIN_CREATOR_AUTHOR.memberListing;
                return (
                  <div
                    key={member}
                    className={`rounded-xl px-3 py-2.5 flex items-center justify-between gap-2 border ${
                      isMainCreator
                        ? 'bg-slate-900 border-amber-400/80 text-amber-200'
                        : 'bg-slate-900/80 border-slate-700 text-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[11px] font-mono text-amber-400 tabular-nums shrink-0">
                        {String(index + 1).padStart(2, '0')}.
                      </span>
                      <span className="truncate">{member}</span>
                    </div>
                    {isMainCreator && (
                      <span className="text-[10px] font-black text-emerald-300 whitespace-nowrap shrink-0">
                        Main Creator
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile-Friendly Bottom Navigation Bar (>=44px touch targets & notch safe-area padding) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        data-testid="mobile-bottom-nav"
        className="fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 border-t-2 border-amber-400 px-2 py-1.5 flex items-center justify-around gap-1 lg:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.6)] select-none safe-bottom-dock print:hidden"
      >
        {[
          { id: 'map', label: 'Map', icon: <Compass className="w-5 h-5 shrink-0" /> },
          { id: 'modules', label: 'Modules', icon: <BookOpen className="w-5 h-5 shrink-0" /> },
          { id: 'flashcards', label: 'Cards', icon: <HelpCircle className="w-5 h-5 shrink-0" /> },
          { id: 'quiz', label: 'Boss Quest', icon: <Trophy className="w-5 h-5 shrink-0" /> },
          { id: 'vault', label: 'Arcade', icon: <Gamepad2 className="w-5 h-5 shrink-0" /> },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                marioAudio.playTabSwitch();
              }}
              className={`min-h-[48px] flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-slate-950 font-black shadow-[0_2px_0_#000]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {tab.icon}
              <span className="text-[10px] font-black uppercase font-mario mt-0.5 leading-none whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
