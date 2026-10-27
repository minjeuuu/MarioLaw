import React from 'react';
import { Flame, Gift } from 'lucide-react';
import { marioAudio } from '../utils/audio';

interface LoginStreakCounterProps {
  streak: number;
  isBonusClaimedToday: boolean;
  onOpenStreakModal: () => void;
}

export const LoginStreakCounter: React.FC<LoginStreakCounterProps> = ({
  streak,
  isBonusClaimedToday,
  onOpenStreakModal,
}) => {
  const safeStreak = Math.max(1, streak);

  return (
    <button
      type="button"
      onClick={() => {
        onOpenStreakModal();
        marioAudio.playPowerUp();
      }}
      aria-label={`Login Streak: ${safeStreak} ${safeStreak === 1 ? 'day' : 'days'}${
        !isBonusClaimedToday ? ' (Daily bonus ready)' : ''
      }`}
      title={`Login Streak: ${safeStreak} consecutive study ${
        safeStreak === 1 ? 'day' : 'days'
      }! Click to view streak calendar & daily reward.`}
      data-testid="login-streak-counter"
      className={`h-7 px-1.5 sm:px-2.5 inline-flex items-center justify-center gap-1 rounded-lg border border-black font-black leading-none whitespace-nowrap cursor-pointer transition-transform active:translate-y-0.5 shrink-0 tabular-nums ${
        !isBonusClaimedToday
          ? 'bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-400 hover:to-amber-300 text-slate-950 shadow-[0_1px_0_#000]'
          : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-400/60'
      }`}
    >
      <Flame
        className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${
          !isBonusClaimedToday
            ? 'text-red-700 fill-red-600'
            : 'text-orange-400 fill-orange-500'
        }`}
      />
      <span className="font-mario text-[9px] sm:text-[10px]">
        {safeStreak}D
      </span>
      <span className="hidden md:inline text-[10px] font-extrabold tracking-tight">
        Streak
      </span>
      {!isBonusClaimedToday && (
        <Gift className="w-3 h-3 text-red-800 shrink-0 hidden sm:inline" />
      )}
    </button>
  );
};
