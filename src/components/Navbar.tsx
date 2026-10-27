import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Search,
  BookOpen,
  Calculator,
  Grid,
  HelpCircle,
  Trophy,
  Map,
  Gamepad2,
  Eye,
  EyeOff,
  Sliders,
  ShoppingBag,
  Calendar,
  Menu,
  ChevronDown,
  Printer,
  GraduationCap,
  Feather,
  Music,
  Pause,
  Play,
  Sun,
  Moon,
  Award,
  Compass,
  Zap,
} from 'lucide-react';
import { MarioCoinIcon, MarioCharacterAvatar, MarioStarIcon } from './MarioIcons';
import { marioAudio, AudioSettings, SOUND_PACK_DEFINITIONS } from '../utils/audio';
import { AudioSettingsModal } from './AudioSettingsModal';
import { ComplexityMode, MarioAvatar, StudyDifficulty } from '../types/laborLaw';
import { StudyTimer } from './StudyTimer';
import { LoginStreakCounter } from './LoginStreakCounter';
import { PWAInstallButton } from './PWAInstallButton';
import { MARIO_SOUNDSCAPES, MarioSoundscapeId } from '../utils/engagementFeatures';
import { ColorMode } from '../utils/profileAchievements';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  setFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  zenMode: boolean;
  setZenMode: (zen: boolean) => void;
  complexityMode: ComplexityMode;
  setComplexityMode: (mode: ComplexityMode) => void;
  studyDifficulty: StudyDifficulty;
  setStudyDifficulty: (difficulty: StudyDifficulty) => void;
  loginStreak: number;
  isBonusClaimedToday: boolean;
  equippedAvatar?: MarioAvatar;
  colorMode: ColorMode;
  onToggleColorMode: () => void;
  unlockedAchievementsCount?: number;
  totalAchievementsCount?: number;
  onOpenProfile: () => void;
  onOpenWalkthrough: () => void;
  onStudySecondsTick?: (seconds: number) => void;
  onFocusSessionComplete?: () => void;
  onEarnCoins?: (amount: number) => void;
  onOpenShop: () => void;
  onOpenDailyReward: () => void;
  onOpenExportProgress?: () => void;
  onOpenGlobalSearch?: () => void;
  onOpenPrintGuide?: () => void;
  showLegalCitations?: boolean;
  setShowLegalCitations?: (show: boolean) => void;
  onOpenLeaderboard?: () => void;
  onStartQuickStudy?: () => void;
  superStarRemainingLabel?: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  fontSize,
  setFontSize,
  coins,
  zenMode,
  setZenMode,
  complexityMode,
  setComplexityMode,
  studyDifficulty,
  setStudyDifficulty,
  loginStreak,
  isBonusClaimedToday,
  equippedAvatar = 'mario',
  colorMode,
  onToggleColorMode,
  unlockedAchievementsCount = 0,
  totalAchievementsCount = 12,
  onOpenProfile,
  onOpenWalkthrough,
  onStudySecondsTick,
  onFocusSessionComplete,
  onEarnCoins,
  onOpenShop,
  onOpenDailyReward,
  onOpenExportProgress,
  onOpenGlobalSearch,
  onOpenPrintGuide,
  showLegalCitations = true,
  setShowLegalCitations,
  onOpenLeaderboard,
  onStartQuickStudy,
  superStarRemainingLabel = null,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showQuickAudioSliders, setShowQuickAudioSliders] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [audioState, setAudioState] = useState<AudioSettings>({ ...marioAudio.settings });

  useEffect(() => {
    return marioAudio.subscribe((next) => setAudioState(next));
  }, []);

  const handleCoinClick = () => {
    onOpenShop();
    marioAudio.playCoin();
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    marioAudio.playTabSwitch();
  };

  const handleToggleStudyDifficulty = () => {
    const next: StudyDifficulty = studyDifficulty === 'casual' ? 'exam_prep' : 'casual';
    setStudyDifficulty(next);
    if (next === 'exam_prep') {
      marioAudio.playFireball();
    } else {
      marioAudio.playPowerUp();
    }
  };

  const handleToggleBgm = () => {
    marioAudio.toggleBgm();
  };

  const handleSelectSoundscape = (id: MarioSoundscapeId) => {
    marioAudio.setSoundscape(id, true);
  };

  const navCategories = [
    {
      label: 'Study',
      items: [
        { id: 'map', label: 'World Map', icon: <Map className="w-4 h-4 text-amber-300 shrink-0" /> },
        { id: 'modules', label: 'All Modules', icon: <BookOpen className="w-4 h-4 text-red-300 shrink-0" /> },
        { id: 'holidays', label: 'Holidays', icon: <Calendar className="w-4 h-4 text-rose-300 shrink-0" />, badge: '12+' },
        { id: 'wages_matrix', label: '17 Regions', icon: <Grid className="w-4 h-4 text-blue-300 shrink-0" /> },
      ],
    },
    {
      label: 'Practice & Quizzes',
      items: [
        { id: 'flashcards', label: 'Flashcards', icon: <HelpCircle className="w-4 h-4 text-yellow-300 shrink-0" /> },
        { id: 'quiz', label: 'Quest & Boss', icon: <Trophy className="w-4 h-4 text-amber-300 shrink-0" /> },
      ],
    },
    {
      label: 'Games & Tools',
      items: [
        { id: 'vault', label: 'Game Vault', icon: <Gamepad2 className="w-4 h-4 text-emerald-400 shrink-0" />, badge: '17' },
        { id: 'calculator', label: 'Calculator', icon: <Calculator className="w-4 h-4 text-cyan-300 shrink-0" /> },
        { id: 'shop', label: "Toad's Shop", icon: <ShoppingBag className="w-4 h-4 text-pink-300 shrink-0" /> },
      ],
    },
  ];

  const audioActive = audioState.enabled;
  const musicActive = audioState.musicEnabled && audioActive;
  const activeSoundscapeMeta =
    MARIO_SOUNDSCAPES.find((s) => s.id === audioState.soundscape) || MARIO_SOUNDSCAPES[0];

  return (
    <>
      <header className="bg-[#1e293b] border-b-4 border-slate-950 shadow-[0_4px_0_rgba(0,0,0,0.5)] text-white select-none w-full max-w-full overflow-x-clip print:hidden">
        {/* Top Minimal Retro Arcade Status Bar — Zero Horizontal Overflow on 360px+ Mobile */}
        {!zenMode && (
          <div className="bg-[#0f172a] border-b border-slate-700/80 px-2 sm:px-4 py-1 flex items-center justify-between gap-1 sm:gap-2 text-xs font-semibold w-full max-w-full min-w-0">
            {/* Brand Logo & Current Hero Avatar (Opens User Profile & Achievements) */}
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 shrink">
              <button
                type="button"
                onClick={() => {
                  onOpenProfile();
                  marioAudio.playCoin();
                }}
                data-testid="navbar-avatar-profile-btn"
                aria-label="Open User Profile and Achievements"
                title="Open Hero Profile & Milestone Achievements"
                className="w-7 h-7 rounded-lg bg-amber-400 border-2 border-black inline-flex items-center justify-center shrink-0 hover:scale-105 transition-transform cursor-pointer"
              >
                <MarioCharacterAvatar character={equippedAvatar} className="w-5 h-5" />
              </button>
              <span className="hidden min-[380px]:inline sm:hidden font-display font-black text-[11px] tracking-tight uppercase text-amber-400 truncate max-w-[68px] min-[410px]:max-w-[105px] leading-none">
                MARIO LAW
              </span>
              <span className="hidden sm:inline font-mario text-[10px] xl:text-[11px] tracking-wider uppercase text-amber-400 truncate leading-none">
                SUPER MARIO LABOR ADVENTURE
              </span>
            </div>

            {/* Right Status & Global Controls — Clean Fit on 360px Mobile & Full Strip on Desktop */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 min-w-0">
              {/* 1. Daily Login Streak Counter */}
              <LoginStreakCounter
                streak={loginStreak}
                isBonusClaimedToday={isBonusClaimedToday}
                onOpenStreakModal={onOpenDailyReward}
              />

              {/* 2. Global Study Difficulty Toggle: Casual vs Exam Prep (sm+ inline; Mobile Menu Drawer on <sm) */}
              <button
                type="button"
                onClick={handleToggleStudyDifficulty}
                aria-label={`Study Difficulty: ${
                  studyDifficulty === 'exam_prep' ? 'Exam Prep' : 'Casual'
                }. Click to toggle.`}
                title={`Difficulty: ${
                  studyDifficulty === 'exam_prep'
                    ? 'Exam Prep (Harder Multiple-Choice & Bar Scenarios)'
                    : 'Casual (Easy Definitions & Guided Hints)'
                }. Click to switch.`}
                data-testid="navbar-difficulty-toggle"
                className={`hidden sm:inline-flex h-7 px-2.5 items-center justify-center gap-1 rounded-lg border border-black font-black text-[11px] leading-none whitespace-nowrap cursor-pointer transition-colors shrink-0 ${
                  studyDifficulty === 'exam_prep'
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_1px_0_#000]'
                    : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-[0_1px_0_#000]'
                }`}
              >
                {studyDifficulty === 'exam_prep' ? (
                  <GraduationCap className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                ) : (
                  <Feather className="w-3.5 h-3.5 text-emerald-950 shrink-0" />
                )}
                <span>
                  {studyDifficulty === 'exam_prep' ? 'Exam Prep' : 'Casual'}
                </span>
              </button>

              {/* 3. Upgraded Pomodoro Study Timer + Floating Overlay — Visible on BOTH Mobile & Desktop */}
              <StudyTimer
                onEarnCoins={onEarnCoins}
                onStudySecondsTick={onStudySecondsTick}
                onFocusSessionComplete={onFocusSessionComplete}
              />

              {/* 3b. Global Search Quick Trigger (<lg inline; lg+ in Row 2 Search Bar) */}
              {onOpenGlobalSearch && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenGlobalSearch();
                    marioAudio.playCoin();
                  }}
                  data-testid="navbar-search-btn"
                  aria-label="Open Global Search"
                  title="Search doctrines, calculators, and quizzes (Ctrl+K)"
                  className="lg:hidden inline-flex h-7 w-7 sm:w-auto sm:px-2 items-center justify-center gap-1 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-amber-300 font-black text-[10px] leading-none whitespace-nowrap transition-colors cursor-pointer shrink-0"
                >
                  <Search className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              )}

              {/* 4. Dark / Light Mode Toggle — Directly Visible on ALL Viewports */}
              <button
                type="button"
                onClick={() => {
                  onToggleColorMode();
                  marioAudio.playJump();
                }}
                data-testid="navbar-theme-mode-toggle"
                aria-label={
                  colorMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'
                }
                title={
                  colorMode === 'dark'
                    ? 'Dark Mode Active — Click for Sunny Day Light Mode'
                    : 'Light Mode Active — Click for Late-Night Dark Mode'
                }
                className={`inline-flex h-7 w-7 xl:w-auto xl:px-2 items-center justify-center gap-1 rounded-lg border font-black text-[10px] leading-none whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  colorMode === 'dark'
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-amber-200 border-black shadow-[0_1px_0_#000]'
                    : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
                }`}
              >
                {colorMode === 'dark' ? (
                  <Moon className="w-3.5 h-3.5 fill-current shrink-0" />
                ) : (
                  <Sun className="w-3.5 h-3.5 shrink-0" />
                )}
                <span className="hidden xl:inline">
                  {colorMode === 'dark' ? 'Dark' : 'Light'}
                </span>
              </button>

              {/* 5. Ambient Mario BGM Pause/Resume Toggle + Soundscape Indicator */}
              <button
                type="button"
                onClick={handleToggleBgm}
                data-testid="navbar-bgm-toggle"
                aria-label={
                  musicActive
                    ? `Pause ${activeSoundscapeMeta.shortName} Background Music`
                    : `Play ${activeSoundscapeMeta.shortName} Background Music`
                }
                title={
                  musicActive
                    ? `Playing: ${activeSoundscapeMeta.name} — Click to pause`
                    : `Paused (${activeSoundscapeMeta.name}) — Click to play Mario ambient BGM`
                }
                className={`h-7 w-7 md:w-auto md:px-2 inline-flex items-center justify-center gap-1 rounded-lg border font-bold text-[10px] leading-none whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  musicActive
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-black shadow-[0_1px_0_#000]'
                    : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
                }`}
              >
                {musicActive ? (
                  <Pause className="w-3.5 h-3.5 fill-current shrink-0" />
                ) : (
                  <Music className="w-3.5 h-3.5 shrink-0" />
                )}
                <span className="hidden lg:inline font-mario text-[9px]">
                  {musicActive ? activeSoundscapeMeta.shortName.toUpperCase() : 'BGM'}
                </span>
              </button>

              {/* 5. Dedicated Audio Sliders & Soundscapes Quick Mixer (sm+ inline; Mobile Menu Drawer on <sm) */}
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => {
                    setShowQuickAudioSliders(!showQuickAudioSliders);
                    marioAudio.playCoin();
                  }}
                  data-testid="navbar-audio-sliders-btn"
                  aria-label="Open Dedicated Audio Volume Sliders"
                  title="Adjust BGM & SFX volume directly"
                  className={`h-7 px-2 inline-flex items-center justify-center gap-1.5 rounded-lg border text-xs font-bold leading-none whitespace-nowrap transition-all cursor-pointer ${
                    showQuickAudioSliders
                      ? 'bg-amber-400 text-slate-950 border-black shadow-[0_1px_0_#000]'
                      : audioActive
                      ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
                      : 'bg-red-950/60 hover:bg-red-900/60 text-red-300 border-red-700'
                  }`}
                >
                  {audioActive ? (
                    <Volume2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  )}
                  <Sliders className="w-3 h-3 text-slate-300 shrink-0" />
                  <span className="hidden xl:inline text-[10px] font-mario">MIXER</span>
                </button>

                {/* Dedicated Audio Sliders Floating Popover */}
                {showQuickAudioSliders && (
                  <div
                    data-testid="navbar-audio-sliders-popover"
                    className="fixed inset-x-3 top-14 sm:inset-x-auto sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-80 bg-slate-950/95 border-3 border-amber-400 rounded-2xl p-4 shadow-[6px_6px_0_#000] z-50 text-white space-y-3.5 backdrop-blur-md"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-black uppercase text-amber-400 font-mario">
                          AUDIO MIXER
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowQuickAudioSliders(false)}
                        className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    {/* BGM Volume Slider */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold flex items-center gap-1.5 text-slate-200">
                          <Music className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Background Music</span>
                        </span>
                        <span className="font-mono text-amber-300 font-bold tabular-nums">
                          {Math.round((audioState.musicVolume ?? 0.42) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={audioState.musicVolume ?? 0.42}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          marioAudio.updateSettings({ musicVolume: val });
                        }}
                        className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                      />
                    </div>

                    {/* UI Sound Effects (SFX) Volume Slider */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold flex items-center gap-1.5 text-slate-200">
                          <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Sound Effects (SFX)</span>
                        </span>
                        <span className="font-mono text-amber-300 font-bold tabular-nums">
                          {Math.round((audioState.volume ?? 0.8) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={audioState.volume ?? 0.8}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          marioAudio.updateSettings({ volume: val });
                        }}
                        onMouseUp={() => marioAudio.playCoin()}
                        onTouchEnd={() => marioAudio.playCoin()}
                        className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                      />
                    </div>

                    {/* Equipped Audio Pack Selector */}
                    <div className="pt-2 border-t border-slate-800 space-y-1.5" data-testid="navbar-audio-pack-control">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold flex items-center gap-1.5 text-slate-200">
                          <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Active Audio Pack:</span>
                        </span>
                        <span className="font-mono text-amber-300 font-bold text-[10px] font-mario">
                          {SOUND_PACK_DEFINITIONS.find((p) => p.id === (audioState.soundPack || 'sound_default'))?.badge || 'Classic 8-Bit'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <select
                          aria-label="Active Sound Pack"
                          value={audioState.soundPack || 'sound_default'}
                          onChange={(e) => {
                            const val = e.target.value as any;
                            marioAudio.setSoundPack(val, true);
                          }}
                          className="w-full bg-slate-900 border border-slate-700 hover:border-amber-400 rounded-lg text-xs font-bold px-2 py-1.5 text-white cursor-pointer focus:outline-hidden"
                        >
                          {SOUND_PACK_DEFINITIONS.map((pack) => {
                            const unlockedItemIds = (() => {
                              const defaults = ['theme_overworld', 'avatar_mario', 'avatar_luigi', 'avatar_peach', 'sound_default'];
                              try {
                                const saved = localStorage.getItem('mario_unlocked_items');
                                if (saved) return Array.from(new Set([...defaults, ...JSON.parse(saved)]));
                              } catch {}
                              return defaults;
                            })();
                            const isUnlocked = unlockedItemIds.includes(pack.id) || pack.defaultPrice === 0;
                            return (
                              <option key={pack.id} value={pack.id} disabled={!isUnlocked}>
                                {pack.name} {!isUnlocked ? `(${pack.defaultPrice}c in Shop)` : ''}
                              </option>
                            );
                          })}
                        </select>
                        <button
                          type="button"
                          onClick={() =>
                            marioAudio.toggleSoundPackFullTrack(
                              audioState.soundPack || 'sound_default'
                            )
                          }
                          title={musicActive ? 'Pause persistent BGM loop' : 'Play full persistent BGM loop'}
                          aria-label={musicActive ? 'Pause active sound pack loop' : 'Play active sound pack loop'}
                          className={`h-8 px-2.5 rounded-lg border cursor-pointer flex items-center justify-center gap-1 shrink-0 font-bold text-[10px] ${
                            musicActive
                              ? 'bg-emerald-500 text-slate-950 border-black'
                              : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
                          }`}
                        >
                          {musicActive ? (
                            <Pause className="w-3 h-3 fill-current" />
                          ) : (
                            <Play className="w-3 h-3 fill-current" />
                          )}
                          <span>{musicActive ? 'Looping' : 'Loop'}</span>
                        </button>
                      </div>
                      <p className="text-[10px] font-semibold text-emerald-300 truncate">
                        ♫ {marioAudio.getActiveTrackLabel()}
                      </p>
                    </div>

                    {/* Legal Citations Quick Toggle */}
                    {setShowLegalCitations && (
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-300">Legal Citations:</span>
                        <button
                          type="button"
                          onClick={() => {
                            setShowLegalCitations(!showLegalCitations);
                            marioAudio.playCoin();
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black font-mario border cursor-pointer ${
                            showLegalCitations
                              ? 'bg-amber-400 text-slate-950 border-black'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {showLegalCitations ? 'SHOWN' : 'HIDDEN'}
                        </button>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={handleToggleBgm}
                        className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-black rounded-lg border border-slate-700 cursor-pointer"
                      >
                        {musicActive ? 'Pause Music' : 'Play Music'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsSettingsOpen(true);
                          setShowQuickAudioSliders(false);
                          marioAudio.playPipe();
                        }}
                        className="flex-1 py-1.5 px-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-black rounded-lg border border-black cursor-pointer"
                      >
                        More Audio...
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 6. Active Super Star 2x Coin Buff Indicator (when active) */}
              {superStarRemainingLabel && (
                <button
                  type="button"
                  onClick={handleCoinClick}
                  data-testid="navbar-super-star-badge"
                  title="Super Star 2x Coin Multiplier Active!"
                  className="h-7 px-1.5 sm:px-2 inline-flex items-center justify-center gap-1 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black rounded-lg border border-black shadow-[0_1px_0_#000] cursor-pointer text-[10px] leading-none whitespace-nowrap tabular-nums shrink-0"
                >
                  <MarioStarIcon className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-mario sm:hidden">2X</span>
                  <span className="hidden sm:inline font-mario">2X · {superStarRemainingLabel}</span>
                </button>
              )}

              {/* 6b. Coin Counter / Toad's Shop shortcut */}
              <button
                type="button"
                onClick={handleCoinClick}
                aria-label={`Coins: ${coins}. Open Toad's Shop`}
                title="Open Toad's Shop to spend coins!"
                data-testid="navbar-coin-counter"
                className="h-7 px-1.5 sm:px-2.5 inline-flex items-center justify-center gap-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-lg border border-black shadow-[0_1px_0_#000] active:translate-y-0.5 cursor-pointer text-xs leading-none whitespace-nowrap tabular-nums shrink-0"
              >
                <MarioCoinIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span className="text-[9px] sm:text-xs font-mario">
                  x{coins.toString().padStart(2, '0')}
                </span>
              </button>

              {/* 6c. Global Coin Leaderboard Button */}
              {onOpenLeaderboard && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenLeaderboard();
                    marioAudio.playCoin();
                  }}
                  data-testid="navbar-leaderboard-btn"
                  aria-label="Open Global Coin Leaderboard"
                  title="Open Global Coin Leaderboard"
                  className="hidden md:inline-flex h-7 px-2 items-center justify-center gap-1 bg-slate-800 hover:bg-slate-700 text-amber-300 font-black rounded-lg border border-slate-700 active:translate-y-0.5 cursor-pointer text-[11px] leading-none whitespace-nowrap"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="hidden xl:inline">Ranks</span>
                </button>
              )}

              {/* 6d. 5-Min Quick Study Mode Shortcut */}
              {onStartQuickStudy && (
                <button
                  type="button"
                  onClick={() => {
                    onStartQuickStudy();
                    marioAudio.playPowerUp();
                  }}
                  data-testid="navbar-quick-study-btn"
                  aria-label="Start 5-Minute Quick Study Deck"
                  title="Launch 5-Minute Quick Study Flashcard Sprint"
                  className="hidden xl:inline-flex h-7 px-2 items-center justify-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-lg border border-black shadow-[0_1px_0_#000] active:translate-y-0.5 cursor-pointer text-[11px] leading-none whitespace-nowrap"
                >
                  <Zap className="w-3.5 h-3.5 shrink-0" />
                  <span>5m Study</span>
                </button>
              )}

              {/* 7. User Profile & Achievements Button (sm+ Desktop/Tablet; also Avatar & Mobile Drawer) */}
              <button
                type="button"
                onClick={() => {
                  onOpenProfile();
                  marioAudio.playCoin();
                }}
                data-testid="navbar-profile-btn"
                aria-label={`Open User Profile & Achievements (${unlockedAchievementsCount} of ${totalAchievementsCount} unlocked)`}
                title="Open User Profile & Milestone Achievements"
                className="hidden sm:inline-flex h-7 px-2 items-center justify-center gap-1 bg-slate-800 hover:bg-slate-700 text-amber-300 font-black rounded-lg border border-slate-700 active:translate-y-0.5 cursor-pointer text-[11px] leading-none whitespace-nowrap tabular-nums"
              >
                <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  {unlockedAchievementsCount}/{totalAchievementsCount}
                </span>
              </button>

              {/* 8. Interactive App Guide Walkthrough Button */}
              <button
                type="button"
                onClick={() => {
                  onOpenWalkthrough();
                  marioAudio.playCoin();
                }}
                data-testid="navbar-guide-btn"
                aria-label="Open Complete App Guide Walkthrough"
                title="Open Complete 10-Chapter Interactive App Guide"
                className="hidden md:inline-flex h-7 px-2 items-center justify-center gap-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-lg border border-black shadow-[0_1px_0_#000] active:translate-y-0.5 cursor-pointer text-[11px] leading-none whitespace-nowrap"
              >
                <Compass className="w-3.5 h-3.5 shrink-0" />
                <span>Guide</span>
              </button>

              {/* 9. PWA Install Prompt Button (Desktop/Tablet; also in Mobile Drawer) */}
              <div className="hidden md:block">
                <PWAInstallButton compact />
              </div>

              {/* 10. Print Study Guide Feature */}
              {onOpenPrintGuide && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenPrintGuide();
                    marioAudio.playCoin();
                  }}
                  data-testid="navbar-print-btn"
                  title="Print Study Guide or Export PDF"
                  className="hidden lg:inline-flex h-7 px-2.5 items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg border border-black shadow-[0_1px_0_#000] active:translate-y-0.5 cursor-pointer text-[11px] leading-none whitespace-nowrap"
                >
                  <Printer className="w-3.5 h-3.5 text-white shrink-0" />
                  <span className="font-mario text-[9px]">PRINT</span>
                </button>
              )}

              {/* 11. Score Card Export Button */}
              {onOpenExportProgress && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenExportProgress();
                    marioAudio.playFanfare();
                  }}
                  title="Export Progress Player Score Card"
                  className="hidden 2xl:inline-flex h-7 px-2 items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-lg border border-black shadow-[0_1px_0_#000] active:translate-y-0.5 cursor-pointer text-[11px] leading-none whitespace-nowrap"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span className="font-mario text-[9px]">SCORE</span>
                </button>
              )}

              {/* 10. Font Scaler */}
              <div className="hidden 2xl:inline-flex h-7 items-center bg-slate-800 px-0.5 rounded-lg border border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setFontSize('normal');
                    marioAudio.playJump();
                  }}
                  title="Normal font"
                  className={`h-5 px-1.5 inline-flex items-center justify-center rounded font-bold text-[11px] leading-none transition-all cursor-pointer ${
                    fontSize === 'normal' ? 'bg-amber-400 text-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFontSize('large');
                    marioAudio.playJump();
                  }}
                  title="Large font"
                  className={`h-5 px-1.5 inline-flex items-center justify-center rounded font-bold text-[11px] leading-none transition-all cursor-pointer ${
                    fontSize === 'large' ? 'bg-amber-400 text-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  A+
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFontSize('xlarge');
                    marioAudio.playJump();
                  }}
                  title="Extra large font"
                  className={`h-5 px-1.5 inline-flex items-center justify-center rounded font-bold text-[11px] leading-none transition-all cursor-pointer ${
                    fontSize === 'xlarge' ? 'bg-amber-400 text-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  A++
                </button>
              </div>

              {/* 11. Zen Mode Button */}
              <button
                type="button"
                onClick={() => {
                  setZenMode(true);
                  marioAudio.playPipe();
                }}
                aria-label="Enable Zen Mode"
                title="Hide top bar for distraction-free reading"
                className="hidden lg:inline-flex h-7 w-7 items-center justify-center bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-slate-300 hover:text-white cursor-pointer shrink-0"
              >
                <EyeOff className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>
          </div>
        )}

        {/* Main Nav Bar: Clean Segmented Navigation Buttons */}
        <div className="px-2 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between gap-2 sm:gap-3 w-full max-w-full">
          {/* Zen Restore Button */}
          {zenMode && (
            <button
              type="button"
              onClick={() => {
                setZenMode(false);
                marioAudio.playPipe();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-400 text-slate-950 rounded-xl font-black text-xs border-2 border-black shrink-0 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Full HUD</span>
            </button>
          )}

          {/* Desktop Navigation — Single-Row Uniform h-9 Baseline Alignment */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 flex-nowrap overflow-x-auto no-scrollbar flex-1 min-w-0">
            {navCategories.map((cat, catIdx) => (
              <React.Fragment key={cat.label}>
                {catIdx > 0 && <span className="text-slate-600 px-0.5 font-bold select-none shrink-0">|</span>}
                {cat.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTabClick(item.id)}
                    className={`h-9 px-2.5 inline-flex items-center justify-center gap-1.5 rounded-xl font-black text-xs border-2 border-black transition-all cursor-pointer leading-none whitespace-nowrap shrink-0 ${
                      activeTab === item.id
                        ? 'bg-amber-400 text-slate-950 shadow-[0_2px_0_#000]'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded font-mario font-bold leading-none">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </React.Fragment>
            ))}
          </nav>

          {/* Mobile & Tablet Compact Navigation Bar — Zero-Clipping 5-Column Equal Grid on Phones */}
          <div className="grid grid-cols-5 sm:flex lg:hidden items-center sm:justify-between w-full gap-1 sm:gap-1.5 min-w-0">
            <button
              type="button"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="min-h-[44px] px-1.5 sm:px-3 inline-flex items-center justify-center gap-1 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border-2 border-black font-black text-[11px] sm:text-xs cursor-pointer leading-none whitespace-nowrap shrink-0"
            >
              <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
              <span>Menu</span>
              <ChevronDown
                className={`hidden min-[400px]:inline w-3 h-3 text-slate-400 shrink-0 transition-transform ${
                  isMobileMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {[
              { id: 'map', mobileLabel: 'Map', tabletLabel: 'Map' },
              { id: 'modules', mobileLabel: 'Study', tabletLabel: 'Modules' },
              { id: 'flashcards', mobileLabel: 'Cards', tabletLabel: 'Cards' },
              { id: 'quiz', mobileLabel: 'Quiz', tabletLabel: 'Quiz' },
            ].map((quick) => (
              <button
                key={quick.id}
                type="button"
                onClick={() => handleTabClick(quick.id)}
                className={`min-h-[44px] px-1.5 sm:px-3.5 inline-flex items-center justify-center rounded-xl font-black text-[11px] sm:text-xs border-2 border-black leading-none whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === quick.id
                    ? 'bg-amber-400 text-slate-950 shadow-[0_1px_0_#000]'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                <span className="sm:hidden">{quick.mobileLabel}</span>
                <span className="hidden sm:inline">{quick.tabletLabel}</span>
              </button>
            ))}
          </div>

          {/* Quick Search Shortcut Clicker (LG+ Desktop) */}
          <div className="relative hidden lg:flex items-center w-32 xl:w-44 shrink-0">
            <button
              type="button"
              data-testid="navbar-search-desktop-btn"
              onClick={() => {
                if (onOpenGlobalSearch) onOpenGlobalSearch();
              }}
              className="h-9 w-full inline-flex items-center justify-between gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold px-2.5 rounded-xl border-2 border-slate-700 text-xs transition-colors cursor-pointer leading-none"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <Search className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">Search...</span>
              </div>
              <kbd className="hidden xl:inline-block px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300 shrink-0">
                Ctrl+K
              </kbd>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="block lg:hidden bg-slate-900 border-t-2 border-slate-700 p-3 space-y-3 max-h-[80vh] overflow-y-auto">
            {/* Quick Profile Achievements, App Guide, Quick Study & Leaderboard inside Mobile Drawer */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenProfile();
                  marioAudio.playCoin();
                }}
                className="min-h-[44px] px-3 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs border-2 border-black shadow-[0_2px_0_#000] inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Award className="w-4 h-4 shrink-0" />
                <span>Badges ({unlockedAchievementsCount}/{totalAchievementsCount})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenWalkthrough();
                  marioAudio.playCoin();
                }}
                className="min-h-[44px] px-3 py-2 rounded-xl bg-cyan-400 text-slate-950 font-black text-xs border-2 border-black shadow-[0_2px_0_#000] inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Compass className="w-4 h-4 shrink-0" />
                <span>Full App Guide</span>
              </button>

              {onStartQuickStudy && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onStartQuickStudy();
                    marioAudio.playPowerUp();
                  }}
                  className="min-h-[44px] px-3 py-2 rounded-xl bg-emerald-400 text-slate-950 font-black text-xs border-2 border-black shadow-[0_2px_0_#000] inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Zap className="w-4 h-4 shrink-0" />
                  <span>5-Min Quick Study</span>
                </button>
              )}

              {onOpenLeaderboard && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenLeaderboard();
                    marioAudio.playCoin();
                  }}
                  className="min-h-[44px] px-3 py-2 rounded-xl bg-slate-800 text-amber-300 font-black text-xs border-2 border-black shadow-[0_2px_0_#000] inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Trophy className="w-4 h-4 shrink-0" />
                  <span>Coin Leaderboard</span>
                </button>
              )}
            </div>

            {/* Dark / Light Mode Segmented Switcher in Mobile Drawer */}
            <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-black uppercase text-amber-400 font-mario">
                <span>DISPLAY THEME</span>
                <span>{colorMode === 'dark' ? 'LATE-NIGHT DARK' : 'SUNNY DAY LIGHT'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (colorMode !== 'light') onToggleColorMode();
                    marioAudio.playJump();
                  }}
                  className={`min-h-[40px] px-3 rounded-xl font-black text-xs border-2 border-black inline-flex items-center justify-center gap-1.5 cursor-pointer ${
                    colorMode === 'light'
                      ? 'bg-amber-400 text-slate-950 shadow-[0_2px_0_#000]'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  <Sun className="w-4 h-4 shrink-0" />
                  <span>Light Mode</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (colorMode !== 'dark') onToggleColorMode();
                    marioAudio.playJump();
                  }}
                  className={`min-h-[40px] px-3 rounded-xl font-black text-xs border-2 border-black inline-flex items-center justify-center gap-1.5 cursor-pointer ${
                    colorMode === 'dark'
                      ? 'bg-indigo-600 text-white shadow-[0_2px_0_#000]'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  <Moon className="w-4 h-4 shrink-0" />
                  <span>Dark Mode</span>
                </button>
              </div>
            </div>

            {/* Ambient Mario Soundscape Switcher in Mobile Drawer */}
            <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-700 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-black uppercase text-amber-400 font-mario">
                  MARIO AMBIENT MUSIC
                </span>
                <button
                  type="button"
                  onClick={handleToggleBgm}
                  className={`px-2.5 py-1 rounded-lg font-black text-[10px] border border-black inline-flex items-center gap-1 cursor-pointer ${
                    musicActive ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-200'
                  }`}
                >
                  {musicActive ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                  <span>{musicActive ? 'PAUSE' : 'PLAY'}</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {MARIO_SOUNDSCAPES.map((track) => (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => handleSelectSoundscape(track.id)}
                    className={`min-h-[38px] px-2.5 py-1.5 rounded-xl text-xs font-black border text-left cursor-pointer ${
                      audioState.soundscape === track.id
                        ? 'bg-amber-400 text-slate-950 border-black'
                        : 'bg-slate-800 text-slate-200 border-slate-700'
                    }`}
                  >
                    ♫ {track.shortName}
                  </button>
                ))}
              </div>

              {/* Mobile Volume Sliders for BGM and SFX */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-1 font-bold">
                      <Music className="w-3.5 h-3.5 text-emerald-400" /> BGM Volume
                    </span>
                    <span className="font-mono text-amber-300 font-bold tabular-nums">
                      {Math.round((audioState.musicVolume ?? 0.42) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={audioState.musicVolume ?? 0.42}
                    onChange={(e) => marioAudio.updateSettings({ musicVolume: parseFloat(e.target.value) })}
                    className="w-full accent-amber-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-1 font-bold">
                      <Volume2 className="w-3.5 h-3.5 text-amber-400" /> SFX Volume
                    </span>
                    <span className="font-mono text-amber-300 font-bold tabular-nums">
                      {Math.round((audioState.volume ?? 0.8) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={audioState.volume ?? 0.8}
                    onChange={(e) => marioAudio.updateSettings({ volume: parseFloat(e.target.value) })}
                    className="w-full accent-amber-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Mobile Sound Pack Selector */}
            <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-700 space-y-1.5" data-testid="mobile-audio-pack-control">
              <div className="flex items-center justify-between text-[10px] font-black uppercase text-amber-400 font-mario">
                <span>ACTIVE AUDIO PACK</span>
                <span>{SOUND_PACK_DEFINITIONS.find((p) => p.id === (audioState.soundPack || 'sound_default'))?.badge || 'Classic 8-Bit'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <select
                  aria-label="Active Sound Pack (Mobile)"
                  value={audioState.soundPack || 'sound_default'}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    marioAudio.setSoundPack(val, true);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold px-2 py-2 text-white cursor-pointer"
                >
                  {SOUND_PACK_DEFINITIONS.map((pack) => {
                    const unlockedItemIds = (() => {
                      const defaults = ['theme_overworld', 'avatar_mario', 'avatar_luigi', 'avatar_peach', 'sound_default'];
                      try {
                        const saved = localStorage.getItem('mario_unlocked_items');
                        if (saved) return Array.from(new Set([...defaults, ...JSON.parse(saved)]));
                      } catch {}
                      return defaults;
                    })();
                    const isUnlocked = unlockedItemIds.includes(pack.id) || pack.defaultPrice === 0;
                    return (
                      <option key={pack.id} value={pack.id} disabled={!isUnlocked}>
                        {pack.name} {!isUnlocked ? `(${pack.defaultPrice}c in Shop)` : ''}
                      </option>
                    );
                  })}
                </select>
                <button
                  type="button"
                  onClick={() =>
                    marioAudio.toggleSoundPackFullTrack(
                      audioState.soundPack || 'sound_default'
                    )
                  }
                  title={musicActive ? 'Pause persistent BGM loop' : 'Play full persistent BGM loop'}
                  aria-label={musicActive ? 'Pause active sound pack loop' : 'Play active sound pack loop'}
                  className={`h-9 px-3 rounded-lg border flex items-center justify-center gap-1 shrink-0 cursor-pointer font-bold text-xs ${
                    musicActive
                      ? 'bg-emerald-500 text-slate-950 border-black'
                      : 'bg-slate-800 text-amber-300 border-slate-700'
                  }`}
                >
                  {musicActive ? (
                    <Pause className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                  <span>{musicActive ? 'Looping' : 'Play Loop'}</span>
                </button>
              </div>
              <p className="text-[10px] font-semibold text-emerald-300 truncate">
                ♫ {marioAudio.getActiveTrackLabel()}
              </p>
            </div>

            {/* Global Difficulty Segmented Selector inside Mobile Drawer */}
            <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-black uppercase text-amber-400 font-mario">
                <span>QUIZ &amp; FLASHCARD DIFFICULTY</span>
                <span>{studyDifficulty === 'exam_prep' ? 'HARDER / MCQ' : 'EASY / DEFINITIONS'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setStudyDifficulty('casual');
                    marioAudio.playPowerUp();
                  }}
                  className={`min-h-[42px] px-3 rounded-xl font-black text-xs border-2 border-black inline-flex items-center justify-center gap-1.5 cursor-pointer ${
                    studyDifficulty === 'casual'
                      ? 'bg-emerald-400 text-slate-950 shadow-[0_2px_0_#000]'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  <Feather className="w-4 h-4 shrink-0" />
                  <span>Casual</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStudyDifficulty('exam_prep');
                    marioAudio.playFireball();
                  }}
                  className={`min-h-[42px] px-3 rounded-xl font-black text-xs border-2 border-black inline-flex items-center justify-center gap-1.5 cursor-pointer ${
                    studyDifficulty === 'exam_prep'
                      ? 'bg-red-600 text-white shadow-[0_2px_0_#000]'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 shrink-0" />
                  <span>Exam Prep</span>
                </button>
              </div>
            </div>

            {/* Search Button in Mobile Drawer */}
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (onOpenGlobalSearch) onOpenGlobalSearch();
              }}
              className="w-full min-h-[42px] flex items-center justify-between bg-slate-950 text-slate-200 font-bold px-3 py-2 rounded-xl border border-slate-700 text-xs cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Search className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">Search doctrines, calculators, quizzes...</span>
              </div>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-amber-400 shrink-0">
                Search
              </kbd>
            </button>

            <div className="space-y-3">
              {navCategories.map((cat) => (
                <div key={cat.label} className="space-y-1.5">
                  <span className="text-[10px] font-black font-mario text-amber-400 uppercase tracking-wider block">
                    {cat.label}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {cat.items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleTabClick(item.id)}
                        className={`min-h-[44px] flex items-center gap-2 p-2.5 rounded-xl font-black text-xs border-2 border-black text-left cursor-pointer transition-all ${
                          activeTab === item.id
                            ? 'bg-amber-400 text-slate-950 shadow-[0_2px_0_#000]'
                            : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                        }`}
                      >
                        {item.icon}
                        <span className="truncate">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Extra Mobile Actions: PWA Install, Print, & Audio/Settings */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <PWAInstallButton fullWidth />
                <div className="grid grid-cols-2 gap-2">
                  {onOpenPrintGuide && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenPrintGuide();
                        marioAudio.playCoin();
                      }}
                      className="min-h-[42px] flex items-center justify-center gap-1.5 p-2 bg-emerald-600 text-white font-bold text-xs rounded-xl border border-black cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 shrink-0" />
                      <span>Print Guide</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsSettingsOpen(true);
                      marioAudio.playPipe();
                    }}
                    className="min-h-[42px] flex items-center justify-center gap-1.5 p-2 bg-slate-800 text-amber-300 font-bold text-xs rounded-xl border border-slate-700 cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5 shrink-0" />
                    <span>Audio &amp; Mixer</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Soundscape & Complexity Settings Modal */}
      <AudioSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        complexityMode={complexityMode}
        setComplexityMode={setComplexityMode}
        showLegalCitations={showLegalCitations}
        setShowLegalCitations={setShowLegalCitations}
        onOpenShop={onOpenShop}
      />
    </>
  );
};
