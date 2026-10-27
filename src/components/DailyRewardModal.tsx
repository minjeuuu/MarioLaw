import React, { useState, useEffect } from 'react';
import {
  MarioCoinIcon,
  MarioStarIcon,
  MarioMushroomIcon,
  Mario1UpIcon,
} from './MarioIcons';
import { marioAudio } from '../utils/audio';
import {
  syncDailyLoginStreak,
  LEGACY_LOGIN_DATE_KEY,
  STREAK_COUNT_KEY,
  STREAK_STUDY_DATE_KEY,
  formatLocalDayKey,
} from '../utils/studyModes';
import confetti from 'canvas-confetti';
import { Calendar, X, Flame } from 'lucide-react';

interface DailyRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  streak?: number;
  isBonusClaimedToday?: boolean;
  onClaimSuccess?: (updatedStreak: number) => void;
}

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({
  isOpen,
  onClose,
  setCoins,
  streak: externalStreak,
  isBonusClaimedToday: externalClaimed,
  onClaimSuccess,
}) => {
  const [streak, setStreak] = useState<number>(externalStreak ?? 1);
  const [isClaimedToday, setIsClaimedToday] = useState<boolean>(externalClaimed ?? false);
  const [isOpening, setIsOpening] = useState<boolean>(false);
  const [hasRevealed, setHasRevealed] = useState<boolean>(externalClaimed ?? false);
  const [rewardAmount, setRewardAmount] = useState<number>(15);

  useEffect(() => {
    if (typeof window === 'undefined' || !isOpen) return;

    try {
      const synced = syncDailyLoginStreak(window.localStorage);
      setStreak(externalStreak ?? synced.streak);
      const claimed = externalClaimed ?? synced.isBonusClaimedToday;
      setIsClaimedToday(claimed);
      setHasRevealed(claimed);
    } catch {
      setStreak(externalStreak ?? 1);
    }
  }, [isOpen, externalStreak, externalClaimed]);

  // Compute reward based on streak
  useEffect(() => {
    let amt = 15;
    if (streak === 2) amt = 20;
    else if (streak === 3) amt = 25;
    else if (streak === 4) amt = 35;
    else if (streak >= 5) amt = 50;
    setRewardAmount(amt);
  }, [streak]);

  if (!isOpen) return null;

  const handleHitBlock = () => {
    if (isClaimedToday || isOpening || hasRevealed) return;

    setIsOpening(true);
    marioAudio.playPowerUp();

    setTimeout(() => {
      marioAudio.playQuizComplete();
      setCoins((c) => c + rewardAmount);
      setIsClaimedToday(true);
      setHasRevealed(true);
      setIsOpening(false);

      try {
        const now = new Date();
        localStorage.setItem(LEGACY_LOGIN_DATE_KEY, now.toDateString());
        localStorage.setItem(STREAK_COUNT_KEY, streak.toString());
        localStorage.setItem(STREAK_STUDY_DATE_KEY, formatLocalDayKey(now));
      } catch {
        // fallback
      }

      if (onClaimSuccess) {
        onClaimSuccess(streak);
      }

      // Confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#dc2626', '#10b981', '#3b82f6', '#facc15'],
        });
      } catch {
        // ignore
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs select-none overflow-y-auto">
      <div className="bg-[#1e293b] text-white w-full max-w-md rounded-3xl border-4 border-slate-950 shadow-[6px_6px_0_#000] overflow-hidden relative my-auto">
        {/* Modal Header */}
        <div className="bg-[#0f172a] p-4 sm:p-5 border-b-3 border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-amber-400 rounded-xl border-2 border-black flex items-center justify-center">
              <Calendar className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-400 font-mario block">
                MUSHROOM KINGDOM
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white font-display">
                DAILY LOGIN BONUS
              </h2>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close Daily Login Bonus"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 inline-flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4 shrink-0" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-center space-y-5">
          {/* Streak Indicator Banner */}
          <div className="inline-flex items-center gap-2 bg-slate-900 border-2 border-amber-400/80 px-4 py-1.5 rounded-full shadow-sm">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-black uppercase tracking-wider text-amber-300 font-mario">
              {streak}-DAY LOGIN STREAK!
            </span>
          </div>

          {/* Interactive Mystery Block Area */}
          <div className="py-4">
            {!hasRevealed ? (
              <div className="flex flex-col items-center space-y-4">
                <button
                  type="button"
                  onClick={handleHitBlock}
                  disabled={isOpening}
                  aria-label="Tap Daily Mystery Block"
                  data-testid="daily-mystery-block"
                  className={`w-28 h-28 mario-question-block rounded-3xl flex items-center justify-center text-5xl font-black text-slate-950 shadow-[0_8px_0_#000] cursor-pointer transition-transform ${
                    isOpening ? '-translate-y-3 scale-105' : 'hover:-translate-y-1 active:translate-y-1'
                  }`}
                  title="Click to smash the Mystery Block!"
                >
                  <span className="inline-block animate-bounce pointer-events-none">?</span>
                </button>
                <div className="space-y-1">
                  <p className="font-black text-white text-base sm:text-lg font-display">
                    TAP THE MYSTERY BLOCK!
                  </p>
                  <p className="text-xs font-semibold text-slate-300 max-w-xs mx-auto">
                    Hit the block from below to release your daily coin bounty.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                <div className="w-24 h-24 bg-amber-400 border-4 border-black rounded-3xl mx-auto flex items-center justify-center shadow-[0_6px_0_#000] animate-bounce">
                  <MarioStarIcon className="w-14 h-14" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase text-amber-400 font-mario block mb-1">
                    REWARD CLAIMED!
                  </span>
                  <div className="text-3xl font-black text-amber-300 font-mario flex items-center justify-center gap-2">
                    <MarioCoinIcon className="w-8 h-8" />
                    <span>+{rewardAmount} COINS</span>
                  </div>
                  <p className="text-xs font-bold text-slate-300 mt-2">
                    Consecutive login recorded! Keep your streak alive tomorrow for bigger multiplier payouts.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 5-Day Streak Progress Track */}
          <div className="bg-slate-900/80 p-3.5 rounded-2xl border-2 border-slate-700 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-mario text-left">
              STREAK REWARDS CALENDAR
            </span>
            <div className="grid grid-cols-5 gap-1.5 text-center">
              {[
                { day: 1, reward: '+15' },
                { day: 2, reward: '+20' },
                { day: 3, reward: '+25' },
                { day: 4, reward: '+35' },
                { day: 5, reward: '+50 Gold' },
              ].map((step) => {
                const isCurrent = streak === step.day;
                const isPassed = streak > step.day;

                return (
                  <div
                    key={step.day}
                    className={`p-2 rounded-xl border-2 transition-all ${
                      isCurrent
                        ? 'bg-amber-400 text-slate-950 border-black shadow-[0_2px_0_#000] -translate-y-0.5'
                        : isPassed
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span className="text-[10px] font-black block font-mario">D{step.day}</span>
                    <span className="text-[11px] font-black block mt-0.5">{step.reward}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#0f172a] p-4 border-t-2 border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            data-testid="daily-reward-close"
            className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-xl border-2 border-black shadow-[0_2px_0_#000] cursor-pointer"
          >
            {hasRevealed ? 'Awesome, Continue!' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
