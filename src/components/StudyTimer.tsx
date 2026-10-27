import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  X,
  Plus,
  Minus,
  Flame,
  CheckCircle2,
  Pin,
  PinOff,
  Volume2,
  VolumeX,
  Maximize2,
  Coffee,
  RotateCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { marioAudio } from '../utils/audio';
import { MarioCoinIcon, MarioMushroomIcon, MarioStarIcon } from './MarioIcons';
import {
  PomodoroMode,
  POMODORO_PRESETS,
  formatPomodoroSeconds,
  getNextPomodoroModeAfterCompletion,
} from '../utils/engagementFeatures';
import { POMODORO_OVERLAY_PINNED_KEY } from '../utils/profileAchievements';

interface StudyTimerProps {
  onEarnCoins?: (amount: number) => void;
  onTimerComplete?: () => void;
  onStudySecondsTick?: (seconds: number) => void;
  onFocusSessionComplete?: () => void;
}

const POMODORO_SESSIONS_KEY = 'mario_pomodoro_completed_sessions_v1';
const POMODORO_SOUND_ALERTS_KEY = 'mario_pomodoro_sound_alerts_enabled_v1';

interface PomodoroCompletionNotice {
  type: 'break_reminder' | 'focus_ready';
  headline: string;
  message: string;
  coinsEarned: number;
}

export const StudyTimer: React.FC<StudyTimerProps> = ({
  onEarnCoins,
  onTimerComplete,
  onStudySecondsTick,
  onFocusSessionComplete,
}) => {
  const [mode, setMode] = useState<PomodoroMode>('focus');
  const [customTotalSeconds, setCustomTotalSeconds] = useState<number>(
    POMODORO_PRESETS.focus.minutes * 60
  );
  const [timeLeft, setTimeLeft] = useState<number>(
    POMODORO_PRESETS.focus.minutes * 60
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(false);

  // Sound alert toggle for completion notifications (Mario chime)
  const [soundAlertsEnabled, setSoundAlertsEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(POMODORO_SOUND_ALERTS_KEY);
        return saved !== null ? saved === 'true' : true;
      } catch {
        return true;
      }
    }
    return true;
  });

  const toggleSoundAlerts = () => {
    setSoundAlertsEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(POMODORO_SOUND_ALERTS_KEY, String(next));
      } catch {
        // ignore
      }
      if (next) {
        marioAudio.playCoin();
      }
      return next;
    });
  };

  const [isOverlayPinned, setIsOverlayPinned] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem(POMODORO_OVERLAY_PINNED_KEY) === 'true';
      } catch {
        return false;
      }
    }
    return false;
  });
  const [overlayDismissedWhileRunning, setOverlayDismissedWhileRunning] =
    useState<boolean>(false);
  const [completionNotice, setCompletionNotice] =
    useState<PomodoroCompletionNotice | null>(null);

  const [completedSessions, setCompletedSessions] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        return Number(localStorage.getItem(POMODORO_SESSIONS_KEY) || '0') || 0;
      } catch {
        return 0;
      }
    }
    return 0;
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const callbacksRef = useRef({
    onEarnCoins,
    onTimerComplete,
    onStudySecondsTick,
    onFocusSessionComplete,
  });
  callbacksRef.current = {
    onEarnCoins,
    onTimerComplete,
    onStudySecondsTick,
    onFocusSessionComplete,
  };

  const togglePinOverlay = (nextVal?: boolean) => {
    const resolved = nextVal !== undefined ? nextVal : !isOverlayPinned;
    setIsOverlayPinned(resolved);
    if (resolved) {
      setOverlayDismissedWhileRunning(false);
    }
    try {
      localStorage.setItem(POMODORO_OVERLAY_PINNED_KEY, resolved ? 'true' : 'false');
    } catch {
      // ignore
    }
    if (soundAlertsEnabled) {
      marioAudio.playJump();
    }
  };

  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      if (mode === 'focus' || mode === 'sprint') {
        callbacksRef.current.onStudySecondsTick?.(1);
      }

      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleIntervalFinished();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, autoAdvance, completedSessions]);

  const handleIntervalFinished = () => {
    const preset = POMODORO_PRESETS[mode];
    const isFocusBlock = mode === 'focus' || mode === 'sprint';
    let nextCompleted = completedSessions;

    if (isFocusBlock) {
      nextCompleted = completedSessions + 1;
      setCompletedSessions(nextCompleted);
      try {
        localStorage.setItem(POMODORO_SESSIONS_KEY, String(nextCompleted));
      } catch {
        // ignore
      }
      if (preset.coinReward > 0) {
        callbacksRef.current.onEarnCoins?.(preset.coinReward);
      }
      callbacksRef.current.onFocusSessionComplete?.();

      if (soundAlertsEnabled) {
        marioAudio.playPomodoroFocusComplete();
      }

      try {
        confetti({ particleCount: 75, spread: 75, origin: { y: 0.6 } });
      } catch {
        // ignore
      }

      const nextBreakMode = getNextPomodoroModeAfterCompletion(mode, nextCompleted);
      const breakMins = POMODORO_PRESETS[nextBreakMode].minutes;
      setCompletionNotice({
        type: 'break_reminder',
        headline: 'Stage Clear! Time for a Break',
        message: `Awesome study block! Take your ${breakMins}-minute Mushroom Break to recharge memory retention.`,
        coinsEarned: preset.coinReward,
      });
    } else {
      if (soundAlertsEnabled) {
        marioAudio.playPomodoroBreakComplete();
      }
      setCompletionNotice({
        type: 'focus_ready',
        headline: 'Break Complete! Ready for 25m Focus?',
        message: 'Power-Up recharged! Jump back into a 25-minute Labor Law focus stage.',
        coinsEarned: 0,
      });
    }

    callbacksRef.current.onTimerComplete?.();

    const nextMode = getNextPomodoroModeAfterCompletion(mode, nextCompleted);
    const nextSecs = POMODORO_PRESETS[nextMode].minutes * 60;
    setMode(nextMode);
    setCustomTotalSeconds(nextSecs);
    setTimeLeft(nextSecs);
    setIsRunning(autoAdvance);
    setOverlayDismissedWhileRunning(false);
  };

  const handleTogglePlay = () => {
    if (!isRunning) {
      setCompletionNotice(null);
      setOverlayDismissedWhileRunning(false);
      if (soundAlertsEnabled) marioAudio.playPowerUp();
    } else {
      if (soundAlertsEnabled) marioAudio.playJump();
    }
    setIsRunning((r) => !r);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(customTotalSeconds);
    if (soundAlertsEnabled) marioAudio.playPipe();
  };

  // Dedicated Quick Reset: immediately stops current session and resets timer to 25-minute default
  const handleQuickReset = () => {
    setIsRunning(false);
    setMode('focus');
    const defaultSecs = POMODORO_PRESETS.focus.minutes * 60;
    setCustomTotalSeconds(defaultSecs);
    setTimeLeft(defaultSecs);
    setCompletionNotice(null);
    setOverlayDismissedWhileRunning(false);
    if (soundAlertsEnabled) marioAudio.playPipe();
  };

  const handleSelectMode = (newMode: PomodoroMode, startImmediately: boolean = false) => {
    setIsRunning(startImmediately);
    setCompletionNotice(null);
    setMode(newMode);
    const secs = POMODORO_PRESETS[newMode].minutes * 60;
    setCustomTotalSeconds(secs);
    setTimeLeft(secs);
    if (startImmediately) {
      marioAudio.playPowerUp();
    } else {
      marioAudio.playPipe();
    }
  };

  const handleAdjustMinutes = (deltaMinutes: number) => {
    if (isRunning) return;
    const nextTotal = Math.min(90 * 60, Math.max(60, customTotalSeconds + deltaMinutes * 60));
    setCustomTotalSeconds(nextTotal);
    setTimeLeft(nextTotal);
    marioAudio.playJump();
  };

  const handlePreviewAlertSound = () => {
    if (mode === 'focus' || mode === 'sprint') {
      marioAudio.playPomodoroFocusComplete();
    } else {
      marioAudio.playPomodoroBreakComplete();
    }
  };

  const progressRatio =
    customTotalSeconds > 0
      ? Math.min(1, Math.max(0, (customTotalSeconds - timeLeft) / customTotalSeconds))
      : 0;
  const ringRadius = 68;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = ringCircumference * (1 - progressRatio);
  const cycleDots = completedSessions % 4;
  const isBreakMode = mode === 'shortBreak' || mode === 'longBreak';

  const showFloatingOverlay =
    !isExpanded &&
    (isOverlayPinned || (isRunning && !overlayDismissedWhileRunning) || Boolean(completionNotice));

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (showFloatingOverlay) {
      document.documentElement.setAttribute('data-pomodoro-active', 'true');
      if (completionNotice) {
        document.documentElement.setAttribute('data-pomodoro-notice', 'true');
      } else {
        document.documentElement.removeAttribute('data-pomodoro-notice');
      }
    } else {
      document.documentElement.removeAttribute('data-pomodoro-active');
      document.documentElement.removeAttribute('data-pomodoro-notice');
    }

    if (isExpanded) {
      document.documentElement.setAttribute('data-pomodoro-modal', 'true');
    } else {
      document.documentElement.removeAttribute('data-pomodoro-modal');
    }

    window.dispatchEvent(
      new CustomEvent('mario-pomodoro-state-change', {
        detail: {
          active: showFloatingOverlay,
          hasNotice: Boolean(completionNotice),
          isExpanded,
        },
      })
    );

    return () => {
      document.documentElement.removeAttribute('data-pomodoro-active');
      document.documentElement.removeAttribute('data-pomodoro-notice');
      document.documentElement.removeAttribute('data-pomodoro-modal');
    };
  }, [showFloatingOverlay, completionNotice, isExpanded]);

  return (
    <>
      {/* 1. Compact Navbar Pomodoro Trigger — Visible on BOTH Mobile & Desktop */}
      <div className="inline-flex items-center gap-1 shrink-0 print:hidden">
        <button
          type="button"
          onClick={() => {
            setIsExpanded(true);
            marioAudio.playPipe();
          }}
          data-testid="navbar-pomodoro-btn"
          aria-label={`Pomodoro Timer ${formatPomodoroSeconds(timeLeft)}. Click to open Pomodoro Study Timer`}
          title="Open 25m Study / 5m Break Pomodoro Timer & Floating Overlay"
          className={`h-7 px-1.5 sm:px-2.5 inline-flex items-center justify-center gap-1 rounded-lg border font-mario text-[9px] sm:text-[10px] leading-none whitespace-nowrap tabular-nums active:translate-y-0.5 cursor-pointer transition-all ${
            isRunning
              ? isBreakMode
                ? 'bg-emerald-400 text-slate-950 border-black shadow-[0_1px_0_#000]'
                : 'bg-amber-400 text-slate-950 border-black shadow-[0_1px_0_#000]'
              : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
          }`}
        >
          <Clock
            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${
              isRunning
                ? isBreakMode
                  ? 'text-emerald-950 animate-spin'
                  : 'text-red-700 animate-spin'
                : 'text-amber-400'
            }`}
          />
          <span>{formatPomodoroSeconds(timeLeft)}</span>
        </button>

        {/* Quick Play/Pause on md+ screens */}
        <button
          type="button"
          onClick={handleTogglePlay}
          aria-label={isRunning ? 'Pause Pomodoro Timer' : 'Start Pomodoro Timer'}
          title={isRunning ? 'Pause Pomodoro' : 'Start Focus Block'}
          className={`hidden md:inline-flex h-7 w-7 items-center justify-center rounded-lg border border-black cursor-pointer shadow-[0_1px_0_#000] transition-all shrink-0 ${
            isRunning
              ? 'bg-rose-500 hover:bg-rose-400 text-white'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
          }`}
        >
          {isRunning ? (
            <Pause className="w-3.5 h-3.5 fill-current shrink-0" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current shrink-0" />
          )}
        </button>
      </div>

      {/* 2. Floating Screen Overlay Widget + 5-Minute Break Reminder Toast (Bottom-Left clear of Auto-Scroll & Notes) */}
      {showFloatingOverlay &&
        typeof document !== 'undefined' &&
        createPortal(
          <aside
            aria-label="Floating Pomodoro Study Timer Overlay"
            data-testid="pomodoro-floating-overlay"
            className="fixed bottom-20 left-3 lg:bottom-5 lg:left-5 z-40 w-[calc(100vw-1.5rem)] sm:w-[340px] max-w-[340px] bg-[#0f172a]/95 backdrop-blur-md text-white rounded-2xl border-3 border-slate-950 shadow-[5px_5px_0_#000] overflow-hidden select-none print:hidden transition-all duration-200"
          >
            {/* Progress Strip */}
            <div className="w-full h-1.5 bg-slate-800">
              <div
                className={`h-full transition-all duration-300 ${
                  isBreakMode ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
                style={{ width: `${Math.round(progressRatio * 100)}%` }}
              />
            </div>

            {/* Break Reminder / Stage Clear Banner */}
            {completionNotice && (
              <div className="bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 px-3 py-2.5 border-b-2 border-black space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {completionNotice.type === 'break_reminder' ? (
                      <MarioMushroomIcon className="w-4 h-4 shrink-0" />
                    ) : (
                      <MarioStarIcon className="w-4 h-4 shrink-0" />
                    )}
                    <span className="font-black text-xs font-display leading-tight">
                      {completionNotice.headline}
                    </span>
                  </div>
                  {completionNotice.coinsEarned > 0 && (
                    <span className="inline-flex items-center gap-1 bg-slate-950 text-amber-300 px-1.5 py-0.5 rounded text-[10px] font-mario shrink-0">
                      +{completionNotice.coinsEarned}
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-bold text-slate-900 leading-snug">
                  {completionNotice.message}
                </p>
                <div className="flex items-center gap-1.5">
                  {completionNotice.type === 'break_reminder' ? (
                    <button
                      type="button"
                      onClick={() => handleSelectMode('shortBreak', true)}
                      className="flex-1 py-1.5 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs border-2 border-black cursor-pointer whitespace-nowrap"
                    >
                      Start 5m Break
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSelectMode('focus', true)}
                      className="flex-1 py-1.5 px-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-300 font-black text-xs border-2 border-black cursor-pointer whitespace-nowrap"
                    >
                      Start 25m Study
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setCompletionNotice(null)}
                    className="py-1.5 px-2.5 rounded-xl bg-white/70 hover:bg-white text-slate-900 font-bold text-xs border border-black cursor-pointer whitespace-nowrap"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* Compact Overlay Controls */}
            <div className="p-2 sm:p-2.5 space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 shrink-0">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl border-2 border-black flex items-center justify-center shrink-0 ${
                      isBreakMode ? 'bg-emerald-400 text-slate-950' : 'bg-amber-400 text-slate-950'
                    }`}
                  >
                    {isBreakMode ? (
                      <Coffee className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    )}
                  </div>
                  <div className="min-w-0 shrink-0">
                    <span className="text-[8px] sm:text-[9px] font-black uppercase text-amber-400 font-mario block whitespace-nowrap">
                      {isBreakMode ? '5M BREAK' : '25M FOCUS'}
                    </span>
                    <span className="text-xs sm:text-sm font-black font-mario text-white tabular-nums leading-tight whitespace-nowrap block">
                      {formatPomodoroSeconds(timeLeft)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    aria-label={isRunning ? 'Pause Floating Timer' : 'Start Floating Timer'}
                    className={`h-7 sm:h-8 px-2 sm:px-2.5 rounded-xl border-2 border-black font-black text-[11px] sm:text-xs inline-flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap active:translate-y-0.5 ${
                      isRunning
                        ? 'bg-rose-500 hover:bg-rose-400 text-white'
                        : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'
                    }`}
                  >
                    {isRunning ? (
                      <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current shrink-0" />
                    ) : (
                      <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current shrink-0" />
                    )}
                    <span>{isRunning ? 'Pause' : 'Start'}</span>
                  </button>

                  {/* Sound Alert Toggle Switch on Floating Overlay */}
                  <button
                    type="button"
                    onClick={toggleSoundAlerts}
                    data-testid="overlay-sound-toggle-btn"
                    aria-label={soundAlertsEnabled ? 'Silence Pomodoro Sound Alerts' : 'Enable Pomodoro Sound Alerts'}
                    title={soundAlertsEnabled ? 'Sound Alerts: ON (Click to Silence Mario Chimes)' : 'Sound Alerts: MUTED (Click to Enable)'}
                    className={`h-7 w-7 sm:h-8 sm:w-8 rounded-xl border inline-flex items-center justify-center cursor-pointer transition-colors ${
                      soundAlertsEnabled
                        ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-600'
                        : 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border-rose-700'
                    }`}
                  >
                    {soundAlertsEnabled ? (
                      <Volume2 className="w-3.5 h-3.5" />
                    ) : (
                      <VolumeX className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Quick Reset Button on Floating Overlay (Visible on sm+ screens; on mobile row 2 has 25m Reset) */}
                  <button
                    type="button"
                    onClick={handleQuickReset}
                    data-testid="overlay-quick-reset-btn"
                    aria-label="Quick Reset to 25m Focus"
                    title="Quick Reset: Stop session and return to 25m Focus"
                    className="hidden sm:inline-flex h-8 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 items-center justify-center gap-1 text-[11px] font-bold text-slate-300 hover:text-white cursor-pointer whitespace-nowrap"
                  >
                    <RotateCcw className="w-3 h-3 text-amber-400" />
                    <span>Reset</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsExpanded(true)}
                    aria-label="Expand Pomodoro Command Modal"
                    title="Expand Full Timer"
                    className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 inline-flex items-center justify-center text-slate-200 cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCompletionNotice(null);
                      if (isOverlayPinned) {
                        togglePinOverlay(false);
                      } else {
                        setOverlayDismissedWhileRunning(true);
                      }
                    }}
                    aria-label="Dock Pomodoro Overlay to Navbar"
                    title="Minimize to Navbar"
                    className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 inline-flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quick 25m Study / 5m Break Pill Switcher + Quick 25m Reset */}
              <div className="grid grid-cols-3 gap-1 sm:gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => handleSelectMode('focus')}
                  className={`py-1 px-1.5 rounded-lg text-[9px] sm:text-[10px] font-black border cursor-pointer transition-colors whitespace-nowrap truncate text-center ${
                    mode === 'focus'
                      ? 'bg-amber-400 text-slate-950 border-black shadow-[0_1px_0_#000]'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  25m Study
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectMode('shortBreak')}
                  className={`py-1 px-1.5 rounded-lg text-[9px] sm:text-[10px] font-black border cursor-pointer transition-colors whitespace-nowrap truncate text-center ${
                    mode === 'shortBreak'
                      ? 'bg-emerald-400 text-slate-950 border-black shadow-[0_1px_0_#000]'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  5m Break
                </button>
                <button
                  type="button"
                  onClick={handleQuickReset}
                  title="Immediate Stop & 25-Min Reset"
                  className="py-1 px-1.5 rounded-lg text-[9px] sm:text-[10px] font-black bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 hover:border-amber-400 cursor-pointer whitespace-nowrap inline-flex items-center justify-center gap-1"
                >
                  <RotateCcw className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                  <span>25m Reset</span>
                </button>
              </div>
            </div>
          </aside>,
          document.body
        )}

      {/* 3. Full Pomodoro Command Deck Modal */}
      {isExpanded &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-label="Mario Pomodoro Study Timer"
            data-testid="pomodoro-modal"
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs select-none overflow-y-auto print:hidden"
          >
            <div className="bg-[#1e293b] text-white w-full max-w-md max-h-[92vh] rounded-3xl border-4 border-slate-950 shadow-[8px_8px_0_#000] overflow-hidden flex flex-col my-auto">
              {/* Header */}
              <div className="bg-[#0f172a] p-3 sm:p-4 border-b-2 border-slate-700 flex items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-400 border-2 border-black flex items-center justify-center shadow-[0_2px_0_#000] shrink-0">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase text-amber-400 font-mario block truncate whitespace-nowrap">
                      25M STUDY · 5M BREAK
                    </span>
                    <h3 className="text-sm sm:text-lg font-black text-white font-display truncate">
                      MARIO POMODORO TIMER
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                  {/* Sound Alerts Toggle Switch for Mario-Themed Completion Alerts */}
                  <button
                    type="button"
                    onClick={toggleSoundAlerts}
                    data-testid="pomodoro-sound-toggle-btn"
                    title={
                      soundAlertsEnabled
                        ? 'Silence Mario Completion Sound Alerts'
                        : 'Enable Mario Completion Sound Alerts'
                    }
                    aria-label={
                      soundAlertsEnabled
                        ? 'Silence Mario Completion Sound Alerts'
                        : 'Enable Mario Completion Sound Alerts'
                    }
                    className={`h-8 px-2 sm:px-2.5 rounded-xl border text-[11px] sm:text-xs font-black inline-flex items-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
                      soundAlertsEnabled
                        ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-600'
                        : 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border-rose-700'
                    }`}
                  >
                    {soundAlertsEnabled ? (
                      <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                    )}
                    <span className="hidden sm:inline">{soundAlertsEnabled ? 'Sound: On' : 'Muted'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => togglePinOverlay()}
                    data-testid="pomodoro-pin-overlay-btn"
                    title={
                      isOverlayPinned
                        ? 'Unpin Floating Screen Overlay'
                        : 'Pin Floating Timer Overlay on Screen'
                    }
                    className={`h-8 px-2 sm:px-2.5 rounded-xl border text-[11px] sm:text-xs font-black inline-flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                      isOverlayPinned
                        ? 'bg-amber-400 text-slate-950 border-black'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600'
                    }`}
                  >
                    {isOverlayPinned ? (
                      <PinOff className="w-3.5 h-3.5" />
                    ) : (
                      <Pin className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span className="hidden sm:inline">{isOverlayPinned ? 'Pinned' : 'Overlay'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    aria-label="Close Pomodoro Modal"
                    className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {/* Completion Alert Banner inside Modal if triggered */}
              {completionNotice && (
                <div className="bg-amber-400 text-slate-950 rounded-2xl p-3 border-2 border-black flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-black text-xs font-display">{completionNotice.headline}</p>
                    <p className="text-[11px] font-bold text-slate-900">{completionNotice.message}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCompletionNotice(null)}
                    className="px-2.5 py-1 bg-slate-950 text-amber-300 rounded-lg text-xs font-black cursor-pointer shrink-0"
                  >
                    OK
                  </button>
                </div>
              )}

              {/* 4 Mode Presets */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-900 p-1.5 rounded-2xl border-2 border-slate-700">
                {(
                  [
                    { id: 'focus' as const, activeCls: 'bg-amber-400 text-slate-950' },
                    { id: 'shortBreak' as const, activeCls: 'bg-emerald-400 text-slate-950' },
                    { id: 'sprint' as const, activeCls: 'bg-orange-400 text-slate-950' },
                    { id: 'longBreak' as const, activeCls: 'bg-cyan-400 text-slate-950' },
                  ]
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectMode(item.id)}
                    className={`py-2 px-2 rounded-xl text-[10px] font-black font-mario transition-all cursor-pointer whitespace-nowrap ${
                      mode === item.id
                        ? `${item.activeCls} border border-black shadow-[0_2px_0_#000]`
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {POMODORO_PRESETS[item.id].shortLabel}
                  </button>
                ))}
              </div>

              {/* Circular SVG Progress Ring + Digital Readout */}
              <div className="bg-slate-950/90 p-5 rounded-3xl border-3 border-slate-800 flex flex-col items-center space-y-3">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-44 h-44 -rotate-90" viewBox="0 0 160 160">
                    <circle
                      cx="80"
                      cy="80"
                      r={ringRadius}
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="10"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r={ringRadius}
                      fill="none"
                      stroke={
                        mode === 'focus' || mode === 'sprint' ? '#fbbf24' : '#34d399'
                      }
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={ringCircumference}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-300"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3">
                    <span className="text-[9px] font-black uppercase text-amber-400 font-mario whitespace-nowrap">
                      {POMODORO_PRESETS[mode].label.split(' ')[1]}
                    </span>
                    <span className="text-xl sm:text-2xl font-black font-mario text-white tracking-wide mt-1.5 whitespace-nowrap tabular-nums">
                      {formatPomodoroSeconds(timeLeft)}
                    </span>
                  </div>
                </div>

                {/* Custom Minute Adjusters + Coin Reward Tag */}
                <div className="flex items-center justify-between w-full gap-2 pt-1">
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={isRunning}
                      onClick={() => handleAdjustMinutes(-1)}
                      aria-label="Decrease Timer by 1 Minute"
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 border border-slate-600 inline-flex items-center justify-center text-slate-200 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-bold text-slate-400 px-1 tabular-nums">
                      {Math.round(customTotalSeconds / 60)} min
                    </span>
                    <button
                      type="button"
                      disabled={isRunning}
                      onClick={() => handleAdjustMinutes(1)}
                      aria-label="Increase Timer by 1 Minute"
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 border border-slate-600 inline-flex items-center justify-center text-slate-200 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {POMODORO_PRESETS[mode].coinReward > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-400/15 border border-amber-400/50 text-amber-300 text-xs font-black whitespace-nowrap">
                      <MarioCoinIcon className="w-3.5 h-3.5" />
                      <span>+{POMODORO_PRESETS[mode].coinReward} Coins on Finish</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-400/15 border border-emerald-400/50 text-emerald-300 text-xs font-black whitespace-nowrap">
                      <MarioMushroomIcon className="w-3.5 h-3.5" />
                      <span>5m Break Reminder</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Primary Action Controls */}
              <div className="flex items-center justify-center gap-1.5 sm:gap-2.5">
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className={`flex-1 min-h-[46px] inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-3 rounded-2xl font-black font-mario text-[11px] sm:text-xs border-3 border-black shadow-[0_3px_0_#000] active:translate-y-0.5 cursor-pointer transition-all whitespace-nowrap ${
                    isRunning
                      ? 'bg-rose-500 hover:bg-rose-400 text-white'
                      : isBreakMode
                      ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'
                      : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                  }`}
                >
                  {isRunning ? (
                    <Pause className="w-4 h-4 fill-current shrink-0" />
                  ) : (
                    <Play className="w-4 h-4 fill-current shrink-0" />
                  )}
                  <span>
                    {isRunning
                      ? 'PAUSE'
                      : isBreakMode
                      ? 'BREAK'
                      : 'FOCUS'}
                  </span>
                </button>

                {/* Quick Reset: Immediately stops session and restores 25-minute default state */}
                <button
                  type="button"
                  onClick={handleQuickReset}
                  data-testid="pomodoro-quick-reset-btn"
                  aria-label="Quick Reset to 25m Focus"
                  title="Quick Reset: Stop session and return timer to 25m Focus"
                  className="min-h-[46px] px-2.5 sm:px-3.5 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white rounded-2xl border-2 border-slate-600 cursor-pointer inline-flex items-center justify-center gap-1 text-[11px] sm:text-xs font-black shadow-[0_2px_0_#000] active:translate-y-0.5 whitespace-nowrap"
                >
                  <RotateCcw className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="hidden min-[400px]:inline">Quick </span>
                  <span>Reset</span>
                </button>

                <button
                  type="button"
                  onClick={toggleSoundAlerts}
                  aria-label={soundAlertsEnabled ? 'Mute Pomodoro Mario Alerts' : 'Unmute Pomodoro Mario Alerts'}
                  title={soundAlertsEnabled ? 'Sound Alerts: ON (Click to Silence Mario Chime)' : 'Sound Alerts: MUTED (Click to Enable)'}
                  className={`min-h-[46px] w-11 sm:w-auto px-0 sm:px-3 rounded-2xl border-2 cursor-pointer inline-flex items-center justify-center gap-1 text-xs font-bold whitespace-nowrap transition-colors ${
                    soundAlertsEnabled
                      ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-600'
                      : 'bg-rose-950 hover:bg-rose-900 text-rose-300 border-rose-700'
                  }`}
                >
                  {soundAlertsEnabled ? (
                    <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span className="hidden sm:inline">{soundAlertsEnabled ? 'Sound On' : 'Muted'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  aria-label="Restart Current Interval"
                  title="Restart Current Interval"
                  className="min-h-[46px] w-11 px-0 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-2xl border-2 border-slate-600 cursor-pointer inline-flex items-center justify-center"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>

              {/* Session Cycle Tracker + Auto-Advance */}
              <div className="bg-slate-900 rounded-2xl p-3 border border-slate-700 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-bold text-slate-200 tabular-nums">
                    Focus Blocks: <strong className="text-amber-300">{completedSessions}</strong>
                  </span>
                  <div className="inline-flex items-center gap-1 ml-1" title="4 Focus blocks = 1 Long Break">
                    {[0, 1, 2, 3].map((dot) => (
                      <span
                        key={dot}
                        className={`w-2.5 h-2.5 rounded-full border border-black ${
                          dot < cycleDots ? 'bg-amber-400' : 'bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-300 font-bold whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={autoAdvance}
                    onChange={(e) => setAutoAdvance(e.target.checked)}
                    className="accent-amber-400"
                  />
                  <span>Auto-next</span>
                </label>
              </div>
            </div>

            {/* Footer with Live Sound Status */}
            <div className="bg-[#0f172a] px-4 py-2.5 border-t border-slate-700 flex items-center justify-between text-[11px] text-slate-400 font-semibold gap-2">
              <span className="inline-flex items-center gap-1.5 truncate">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  {soundAlertsEnabled
                    ? 'Mario Chime Alerts: Active'
                    : 'Mario Chime: Silenced (Visual Timer Running)'}
                </span>
              </span>
              <span className="text-amber-300 font-bold whitespace-nowrap shrink-0">25m / 5m Cycle</span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
