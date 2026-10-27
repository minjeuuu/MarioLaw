import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ChevronDown, FastForward, Gauge, X } from 'lucide-react';
import { marioAudio } from '../utils/audio';
import { getAutoScrollMobilePosition } from '../utils/engagementFeatures';

export type ScrollSpeed = 1 | 2 | 3 | 4;

export const AutoScrollController: React.FC = () => {
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [speed, setSpeed] = useState<ScrollSpeed>(2);
  const [isMinimized, setIsMinimized] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : true
  );
  const [pomodoroState, setPomodoroState] = useState<{
    active: boolean;
    hasNotice: boolean;
    isExpanded: boolean;
  }>(() => {
    if (typeof document !== 'undefined') {
      return {
        active: document.documentElement.getAttribute('data-pomodoro-active') === 'true',
        hasNotice: document.documentElement.getAttribute('data-pomodoro-notice') === 'true',
        isExpanded: document.documentElement.getAttribute('data-pomodoro-modal') === 'true',
      };
    }
    return { active: false, hasNotice: false, isExpanded: false };
  });

  const scrollAnimRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const handleState = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        setPomodoroState(detail);
      }
    };
    window.addEventListener('mario-pomodoro-state-change', handleState);
    return () => window.removeEventListener('mario-pomodoro-state-change', handleState);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(max-width: 639px)');
    if (mq.matches) setIsMinimized(true);
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setIsMinimized(true);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Speed in pixels per second
  const speedMap: Record<ScrollSpeed, { pxPerSec: number; label: string; name: string }> = {
    1: { pxPerSec: 22, label: '1x', name: 'Slow' },
    2: { pxPerSec: 45, label: '2x', name: 'Normal' },
    3: { pxPerSec: 85, label: '3x', name: 'Fast' },
    4: { pxPerSec: 140, label: '4x', name: 'Turbo' },
  };

  useEffect(() => {
    if (!isScrolling) {
      if (scrollAnimRef.current) cancelAnimationFrame(scrollAnimRef.current);
      return;
    }

    lastTimeRef.current = performance.now();

    const scrollLoop = (now: number) => {
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      const pxToScroll = speedMap[speed].pxPerSec * delta;
      window.scrollBy({ top: pxToScroll, behavior: 'instant' });

      // Check if reached bottom of page
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
        setIsScrolling(false);
        marioAudio.playFanfare();
        return;
      }

      scrollAnimRef.current = requestAnimationFrame(scrollLoop);
    };

    scrollAnimRef.current = requestAnimationFrame(scrollLoop);

    return () => {
      if (scrollAnimRef.current) cancelAnimationFrame(scrollAnimRef.current);
    };
  }, [isScrolling, speed]);

  const handleToggleScroll = () => {
    if (!isScrolling) {
      marioAudio.playPipe();
    } else {
      marioAudio.playJump();
    }
    setIsScrolling(!isScrolling);
  };

  const handleCycleSpeed = () => {
    setSpeed((prev) => {
      const next = (prev % 4) + 1 as ScrollSpeed;
      marioAudio.playCoin();
      return next;
    });
  };

  // Compute dynamic mobile positioning so AutoScroll sits safely above the Pomodoro overlay
  const mobilePosition = getAutoScrollMobilePosition(pomodoroState);
  if (mobilePosition.hidden) {
    return null;
  }
  const mobileBottomClass = mobilePosition.bottomClass;

  if (isMinimized) {
    return (
      <button
        id="floating-autoscroll"
        onClick={() => setIsMinimized(false)}
        title="Open Auto-Scroll Control"
        data-testid="floating-autoscroll-btn"
        className={`fixed ${mobileBottomClass} right-3 lg:bottom-4 lg:right-4 z-40 p-2 sm:p-2.5 ${
          isScrolling
            ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 animate-pulse'
            : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
        } font-black rounded-2xl border-3 border-black shadow-[0_4px_0_#000] cursor-pointer flex items-center gap-1.5 text-xs font-mario print:hidden transition-[bottom,transform] duration-300 ease-out`}
      >
        <ChevronDown className="w-4 h-4 stroke-[3]" />
        <span>SCROLL</span>
      </button>
    );
  }

  return (
    <div
      id="floating-autoscroll"
      className={`fixed ${mobileBottomClass} right-3 lg:bottom-4 lg:right-4 z-40 bg-[#1e293b] text-white border-3 border-slate-950 rounded-2xl p-2 sm:p-2.5 shadow-[4px_4px_0_#000] flex items-center gap-1.5 sm:gap-2 font-mario text-xs select-none print:hidden transition-[bottom,transform] duration-300 ease-out`}
    >
      <span className="text-[10px] text-amber-400 font-black uppercase pl-1 hidden sm:inline">
        AUTO-SCROLL:
      </span>

      {/* Play/Pause Button */}
      <button
        onClick={handleToggleScroll}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs cursor-pointer shadow-[0_2px_0_#000] active:translate-y-0.5 transition-all ${
          isScrolling
            ? 'bg-rose-500 hover:bg-rose-400 text-white animate-pulse'
            : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
        }`}
      >
        {isScrolling ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
        <span>{isScrolling ? 'PAUSE' : 'READ'}</span>
      </button>

      {/* Speed Button */}
      <button
        onClick={handleCycleSpeed}
        title="Click to toggle speed: 1x, 2x, 3x, 4x"
        className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl border border-slate-600 font-bold text-xs cursor-pointer"
      >
        <Gauge className="w-3.5 h-3.5" />
        <span>{speedMap[speed].label}</span>
      </button>

      {/* Minimize Button */}
      <button
        onClick={() => setIsMinimized(true)}
        className="p-1 text-slate-400 hover:text-white cursor-pointer ml-0.5"
        title="Minimize"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
