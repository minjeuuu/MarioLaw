import React, { useState, useEffect } from 'react';
import {
  marioAudio,
  AudioSettings,
  DEFAULT_AUDIO_SETTINGS,
  SOUND_PACK_DEFINITIONS,
  TabSfxType,
  CardSfxType,
  QuizSfxType,
} from '../utils/audio';
import {
  MARIO_SOUNDSCAPES,
  MarioSoundscapeId,
} from '../utils/engagementFeatures';
import {
  Volume2,
  VolumeX,
  X,
  Play,
  Pause,
  RotateCcw,
  Check,
  Music,
  Sliders,
  Disc3,
  ShoppingBag,
} from 'lucide-react';
import {
  MarioMushroomIcon,
  MarioCoinIcon,
  MarioPipeIcon,
  MarioStarIcon,
  MarioFireballIcon,
  Mario1UpIcon,
} from './MarioIcons';
import { ComplexityMode } from '../types/laborLaw';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  complexityMode?: ComplexityMode;
  setComplexityMode?: (mode: ComplexityMode) => void;
  showLegalCitations?: boolean;
  setShowLegalCitations?: (show: boolean) => void;
  onOpenShop?: () => void;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({
  isOpen,
  onClose,
  complexityMode = 'beginner',
  setComplexityMode,
  showLegalCitations = true,
  setShowLegalCitations,
  onOpenShop,
}) => {
  const [settings, setSettings] = useState<AudioSettings>({ ...marioAudio.settings });

  useEffect(() => {
    setSettings({ ...marioAudio.settings });
    return marioAudio.subscribe((next) => setSettings(next));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleEnabled = () => {
    const next = !settings.enabled;
    marioAudio.updateSettings({ enabled: next });
    if (next) marioAudio.playCoin();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    marioAudio.updateSettings({ volume: vol });
  };

  const handleTabSfxChange = (sfx: TabSfxType) => {
    marioAudio.updateSettings({ tabSfx: sfx });
  };

  const handleCardSfxChange = (sfx: CardSfxType) => {
    marioAudio.updateSettings({ cardSfx: sfx });
  };

  const handleQuizSfxChange = (sfx: QuizSfxType) => {
    marioAudio.updateSettings({ quizSfx: sfx });
  };

  const handleToggleSfx = () => {
    const next = !settings.sfxEnabled;
    marioAudio.updateSettings({ sfxEnabled: next });
    if (next) marioAudio.playCoin();
  };

  const handleToggleMusic = () => {
    const next = marioAudio.toggleBgm();
    if (next) marioAudio.playPowerUp();
  };

  const handleSelectSoundscape = (id: MarioSoundscapeId) => {
    marioAudio.setSoundscape(id, true);
  };

  const handleMusicVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    marioAudio.updateSettings({ musicVolume: vol });
  };

  const handleResetDefaults = () => {
    marioAudio.updateSettings({ ...DEFAULT_AUDIO_SETTINGS });
    marioAudio.playPowerUp();
  };

  const isMusicActive = settings.enabled && settings.musicEnabled;

  return (
    <div
      role="dialog"
      aria-label="Mushroom Sound Settings"
      data-testid="audio-settings-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none print:hidden"
    >
      <div className="bg-[#1e293b] text-white w-full max-w-lg rounded-3xl border-4 border-slate-950 shadow-[8px_8px_0_#000] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#0f172a] p-4 sm:p-5 border-b-3 border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-400 rounded-xl border-2 border-black flex items-center justify-center shadow-[0_2px_0_#000]">
              <Sliders className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <span className="text-xs font-black uppercase text-amber-400 font-mario block">
                SOUNDSCAPES &amp; SFX MIXER
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-display">
                MUSHROOM SOUND SETTINGS
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Sound Settings"
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
            title="Close Settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Master Sound Switch */}
          <div className="bg-slate-900/90 rounded-2xl p-4 border-2 border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center ${
                  settings.enabled ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'
                }`}
              >
                {settings.enabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div>
                <span className="font-black text-base block">Master Audio</span>
                <span className="text-xs font-semibold text-slate-400">
                  {settings.enabled ? 'Synthesizer & soundscapes ready' : 'All audio globally muted'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleEnabled}
              className={`px-4 py-2 rounded-xl font-black text-sm border-2 border-black cursor-pointer shadow-[0_2px_0_#000] active:translate-y-0.5 transition-all ${
                settings.enabled
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
              }`}
            >
              {settings.enabled ? 'ON' : 'MUTED'}
            </button>
          </div>

          {/* Global Legal Citations Toggle for Advanced / Bar Review Students */}
          {setShowLegalCitations && (
            <div
              data-testid="legal-citations-setting-card"
              className="bg-slate-900/90 rounded-2xl p-4 border-2 border-amber-400/70 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 border-2 border-black flex items-center justify-center shrink-0 shadow-[0_2px_0_#000]">
                  <MarioStarIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm sm:text-base text-white">Legal Citations Display</span>
                    <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-mario leading-none">
                      BAR STUDY
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    Reveal or hide explicit Article numbers (e.g. Art. 83) and Republic Acts in topic cards.
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowLegalCitations(!showLegalCitations);
                  marioAudio.playCoin();
                }}
                className={`px-4 py-2 rounded-xl font-black text-xs font-mario border-2 border-black cursor-pointer shadow-[0_2px_0_#000] active:translate-y-0.5 transition-all ${
                  showLegalCitations
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                {showLegalCitations ? 'SHOWN' : 'HIDDEN'}
              </button>
            </div>
          )}

          {/* Ambient Mario Soundscape Selector + BGM Player */}
          <div className="bg-slate-900/95 rounded-2xl p-4 border-2 border-amber-400/60 space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Disc3
                  className={`w-5 h-5 text-amber-400 shrink-0 ${
                    isMusicActive ? 'animate-spin' : ''
                  }`}
                />
                <div>
                  <span className="text-xs font-black uppercase text-amber-400 font-mario block">
                    MARIO AMBIENT SOUNDSCAPES
                  </span>
                  <span className="text-xs text-slate-300 font-semibold">
                    Choose a themed background study soundtrack
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleToggleMusic}
                data-testid="modal-bgm-toggle"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs border-2 border-black cursor-pointer shadow-[0_2px_0_#000] transition-all ${
                  isMusicActive
                    ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                }`}
              >
                {isMusicActive ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>PAUSE BGM</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>PLAY BGM</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {MARIO_SOUNDSCAPES.map((track) => {
                const isSelected = settings.soundscape === track.id;
                return (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => handleSelectSoundscape(track.id)}
                    data-testid={`soundscape-${track.id}`}
                    className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400/20 border-amber-400 text-white shadow-[0_2px_0_#000]'
                        : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-black text-xs sm:text-sm font-display text-white">
                        {track.name}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-black font-mario border border-black ${track.accentClass}`}
                      >
                        {isSelected && isMusicActive ? 'LIVE' : track.shortName.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-medium leading-snug">
                      {track.subtitle}
                    </p>
                    <span className="text-[10px] font-mono text-amber-300/90 mt-1 block">
                      {track.bpmLabel}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Independent Music & SFX Volume Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span className="inline-flex items-center gap-1">
                    <Music className="w-3.5 h-3.5 text-emerald-400" />
                    Music Volume
                  </span>
                  <span>{Math.round((settings.musicVolume ?? 0.42) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="1"
                  step="0.05"
                  aria-label="Background Music Volume"
                  value={settings.musicVolume ?? 0.42}
                  onChange={handleMusicVolumeChange}
                  disabled={!settings.enabled}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 disabled:opacity-40"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span className="inline-flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    SFX Volume
                  </span>
                  <div className="flex items-center gap-2">
                    <span>{Math.round((settings.volume ?? 0.8) * 100)}%</span>
                    <button
                      type="button"
                      onClick={handleToggleSfx}
                      disabled={!settings.enabled}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-black font-mario cursor-pointer ${
                        settings.sfxEnabled && settings.enabled
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {settings.sfxEnabled && settings.enabled ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="1"
                  step="0.05"
                  aria-label="Sound Effects Volume"
                  value={settings.volume}
                  onChange={handleVolumeChange}
                  disabled={!settings.enabled || !settings.sfxEnabled}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 disabled:opacity-40"
                />
              </div>
            </div>
          </div>

          {/* Content Complexity Mode Toggle */}
          <div className="bg-slate-900/90 rounded-2xl p-4 border-2 border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase text-amber-400 tracking-wider block font-mario">
                  CONTENT COMPLEXITY MODE
                </span>
                <span className="text-xs text-slate-300 font-semibold block">
                  Switch summary style for all memory aid modules
                </span>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-black text-amber-300 border border-amber-400/50 font-mario">
                {complexityMode === 'beginner' ? 'BEGINNER' : 'ADVANCED'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  if (setComplexityMode) setComplexityMode('beginner');
                  marioAudio.playPowerUp();
                }}
                className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  complexityMode === 'beginner'
                    ? 'bg-amber-400 text-slate-950 border-black shadow-[0_2px_0_#000]'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5 font-black text-xs font-mario mb-1">
                  <MarioMushroomIcon className="w-4 h-4" />
                  <span>Mushroom Kingdom</span>
                </div>
                <p className="text-[11px] font-medium leading-tight opacity-90">
                  Beginner: Plain-English practical takeaways &amp; easy rules of thumb.
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (setComplexityMode) setComplexityMode('advanced');
                  marioAudio.playFireball();
                }}
                className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  complexityMode === 'advanced'
                    ? 'bg-red-600 text-white border-black shadow-[0_2px_0_#000]'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5 font-black text-xs font-mario mb-1">
                  <MarioStarIcon className="w-4 h-4" />
                  <span>Bowser&apos;s Castle</span>
                </div>
                <p className="text-[11px] font-medium leading-tight opacity-90">
                  Advanced: Full codified articles, jurisprudence &amp; exhaustive exceptions.
                </p>
              </button>
            </div>
          </div>

          {/* Section 1: Tab Switch SFX */}
          <div className="space-y-3">
            <span className="text-xs font-black uppercase text-amber-400 tracking-wider block font-mario">
              1. TAB SWITCH SOUND
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'pipe', label: 'Warp Pipe', icon: <MarioPipeIcon className="w-4 h-4" />, play: () => marioAudio.playPipe() },
                { id: 'jump', label: 'Mario Jump', icon: <MarioMushroomIcon className="w-4 h-4" />, play: () => marioAudio.playJump() },
                { id: 'coin', label: 'Coin Clink', icon: <MarioCoinIcon className="w-4 h-4" />, play: () => marioAudio.playCoin() },
                { id: 'stomp', label: 'Enemy Stomp', icon: <MarioStarIcon className="w-4 h-4" />, play: () => marioAudio.playStomp() },
              ].map((opt) => (
                <div
                  key={opt.id}
                  className={`flex items-center justify-between p-2.5 rounded-xl border-2 transition-all ${
                    settings.tabSfx === opt.id
                      ? 'bg-amber-400/20 border-amber-400 text-white'
                      : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleTabSfxChange(opt.id as TabSfxType)}
                    className="flex items-center gap-2 font-bold text-sm cursor-pointer flex-1 text-left"
                  >
                    {opt.icon}
                    <span>{opt.label}</span>
                  </button>
                  <button
                    type="button"
                    onClick={opt.play}
                    aria-label={`Sample ${opt.label}`}
                    title="Sample Sound"
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-600 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Topic Completion / Quiz Celebration SFX */}
          <div className="space-y-3">
            <span className="text-xs font-black uppercase text-amber-400 tracking-wider block font-mario">
              2. TOPIC COMPLETION &amp; QUIZ SOUND
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'coin', label: 'Coin Collect', icon: <MarioCoinIcon className="w-4 h-4" />, play: () => marioAudio.playCoin() },
                { id: 'powerup', label: 'Super Mushroom', icon: <MarioMushroomIcon className="w-4 h-4" />, play: () => marioAudio.playPowerUp() },
                { id: 'fireball', label: 'Fireball', icon: <MarioFireballIcon className="w-4 h-4" />, play: () => marioAudio.playFireball() },
                { id: 'oneup', label: '1-Up Jingle', icon: <Mario1UpIcon className="w-4 h-4" />, play: () => marioAudio.playOneUp() },
              ].map((opt) => (
                <div
                  key={opt.id}
                  className={`flex items-center justify-between p-2.5 rounded-xl border-2 transition-all ${
                    settings.cardSfx === opt.id
                      ? 'bg-amber-400/20 border-amber-400 text-white'
                      : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleCardSfxChange(opt.id as CardSfxType)}
                    className="flex items-center gap-2 font-bold text-sm cursor-pointer flex-1 text-left"
                  >
                    {opt.icon}
                    <span>{opt.label}</span>
                  </button>
                  <button
                    type="button"
                    onClick={opt.play}
                    aria-label={`Sample ${opt.label}`}
                    title="Sample Sound"
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-600 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { id: 'fanfare' as const, label: 'Fanfare', play: () => marioAudio.playFanfare() },
                { id: 'star' as const, label: 'Star Theme', play: () => marioAudio.playStarTheme() },
                { id: 'oneup' as const, label: '1-Up Clear', play: () => marioAudio.playOneUp() },
              ].map((qOpt) => (
                <button
                  key={qOpt.id}
                  type="button"
                  onClick={() => {
                    handleQuizSfxChange(qOpt.id);
                    qOpt.play();
                  }}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-bold cursor-pointer ${
                    settings.quizSfx === qOpt.id
                      ? 'bg-emerald-500 text-slate-950 border-black font-black'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {qOpt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Dedicated 8-Bit Sound Board */}
          <div className="space-y-3 pt-2 border-t-2 border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase text-amber-400 tracking-wider block font-mario">
                  3. INTERACTION SFX SOUND BOARD
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  Preview coin collection, level-up, wrong-answer &amp; game-over cues
                </span>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-black text-amber-300 font-mario border border-amber-400/40">
                8-BIT MIXER
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { key: 'coin' as const, label: 'Coin Collect', play: () => marioAudio.playCoin() },
                { key: 'jump' as const, label: 'Jump', play: () => marioAudio.playJump() },
                { key: 'powerup' as const, label: 'Power-Up', play: () => marioAudio.playPowerUp() },
                { key: 'pipe' as const, label: 'Warp Pipe', play: () => marioAudio.playPipe() },
                { key: 'stomp' as const, label: 'Quiz Miss', play: () => marioAudio.playWrongAnswer() },
                { key: 'boss' as const, label: 'Game Over', play: () => marioAudio.playGameOver() },
                { key: 'fireball' as const, label: 'Fireball', play: () => marioAudio.playFireball() },
                { key: 'fanfare' as const, label: 'Level Up', play: () => marioAudio.playLevelUp() },
              ].map((item) => {
                const isEnabled = settings.soundToggles?.[item.key] ?? true;

                return (
                  <div
                    key={item.key}
                    className={`p-2.5 rounded-xl border-2 transition-all flex flex-col justify-between gap-2 ${
                      isEnabled
                        ? 'bg-slate-900 border-amber-400/80 text-white'
                        : 'bg-slate-900/40 border-slate-700 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs truncate">{item.label}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const current = settings.soundToggles?.[item.key] ?? true;
                          const next = !current;
                          marioAudio.updateSettings({
                            soundToggles: {
                              ...settings.soundToggles,
                              [item.key]: next,
                            },
                          });
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-black font-mario cursor-pointer transition-all ${
                          isEnabled
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {isEnabled ? 'ON' : 'OFF'}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={item.play}
                      disabled={!settings.enabled}
                      title={`Sample ${item.label} Sound`}
                      className="flex items-center justify-center gap-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-bold border border-slate-600 disabled:opacity-40 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Test SFX</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Equipped Audio Pack & Synthesizer Timbre */}
          <div className="space-y-3 pt-2 border-t-2 border-slate-700" data-testid="audio-packs-section">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase text-amber-400 tracking-wider block font-mario">
                  4. ACTIVE AUDIO PACK &amp; TIMBRE
                </span>
                <span className="text-xs text-slate-300 font-semibold">
                  Equip soundpacks unlocked in Toad&apos;s Store to modify synthesized instruments
                </span>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-mario border border-black">
                STORE AUDIO PACKS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SOUND_PACK_DEFINITIONS.map((pack) => {
                const unlockedItemIds = (() => {
                  const defaults = [
                    'theme_overworld',
                    'avatar_mario',
                    'avatar_luigi',
                    'avatar_peach',
                    'sound_default',
                  ];
                  if (typeof window !== 'undefined') {
                    try {
                      const saved = localStorage.getItem('mario_unlocked_items');
                      if (saved) {
                        const parsed = JSON.parse(saved) as string[];
                        return Array.from(new Set([...defaults, ...parsed]));
                      }
                    } catch {
                      // fallback
                    }
                  }
                  return defaults;
                })();

                const isEquipped = settings.soundPack === pack.id;
                const isUnlocked = unlockedItemIds.includes(pack.id) || pack.defaultPrice === 0;

                return (
                  <div
                    key={pack.id}
                    data-testid={`settings-soundpack-${pack.id}`}
                    className={`p-3 rounded-2xl border-2 transition-all flex flex-col justify-between gap-2.5 ${
                      isEquipped
                        ? 'bg-amber-400/15 border-amber-400 text-white shadow-[0_2px_0_#000]'
                        : 'bg-slate-900/80 border-slate-700 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-black text-xs sm:text-sm text-white font-display">
                          {pack.name}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-indigo-900 text-amber-300 border border-black font-mario">
                            {pack.badge}
                          </span>
                          {isEquipped && (
                            <span className="text-[9px] font-black uppercase text-emerald-900 bg-emerald-300 px-1.5 py-0.5 rounded font-mario flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                              EQUIPPED
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        {pack.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-slate-800">
                      {isUnlocked ? (
                        <button
                          type="button"
                          onClick={() => marioAudio.toggleSoundPackFullTrack(pack.id)}
                          disabled={!settings.enabled}
                          data-testid={`settings-loop-soundpack-${pack.id}`}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black border cursor-pointer disabled:opacity-40 transition-colors ${
                            isEquipped && isMusicActive
                              ? 'bg-emerald-400 text-slate-950 border-black'
                              : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-600'
                          }`}
                        >
                          {isEquipped && isMusicActive ? (
                            <>
                              <Pause className="w-3 h-3 fill-current" />
                              <span>Pause Loop</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 fill-current" />
                              <span>Play Full Loop</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => marioAudio.previewSoundPack(pack.id)}
                          disabled={!settings.enabled}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-bold border border-slate-600 cursor-pointer disabled:opacity-40"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Sample Tone</span>
                        </button>
                      )}

                      {isUnlocked ? (
                        <button
                          type="button"
                          onClick={() => marioAudio.setSoundPack(pack.id, true)}
                          disabled={isEquipped && isMusicActive}
                          className={`px-3 py-1 rounded-lg font-black text-xs border cursor-pointer transition-all ${
                            isEquipped && isMusicActive
                              ? 'bg-emerald-500 text-slate-950 border-black cursor-default'
                              : 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-black shadow-[0_1px_0_#000]'
                          }`}
                        >
                          {isEquipped && isMusicActive ? 'Looping Live' : 'Equip & Loop'}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            if (onOpenShop) {
                              onClose();
                              onOpenShop();
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg font-black text-[11px] bg-red-600 hover:bg-red-500 text-white border border-black cursor-pointer shadow-[0_1px_0_#000]"
                        >
                          Store ({pack.defaultPrice}c)
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#0f172a] p-4 sm:p-5 border-t-2 border-slate-700 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-slate-600 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-xl border-2 border-black shadow-[0_2px_0_#000] cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Save &amp; Return</span>
          </button>
        </div>
      </div>
    </div>
  );
};
