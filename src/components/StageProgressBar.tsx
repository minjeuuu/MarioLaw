import React, { useMemo } from 'react';
import { MarioStageSprite, MarioFlagIcon } from './MarioIcons';
import { MarioAvatar } from '../types/laborLaw';
import { getHeroMeta } from '../data/heroesData';
import { ALL_LAW_TOPICS, WORLDS_METADATA } from '../data/laborLawData';
import { marioAudio } from '../utils/audio';
import { CheckCircle2, RotateCcw, Trophy } from 'lucide-react';

interface StageProgressBarProps {
  completedCount: number;
  totalTopics: number;
  completedTopicIds?: string[];
  onSelectWorld?: (worldId: string) => void;
  onResetProgress: () => void;
  onMarkAllComplete: () => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  avatar?: MarioAvatar;
  onOpenExportProgress?: () => void;
}

export const StageProgressBar: React.FC<StageProgressBarProps> = ({
  completedCount,
  totalTopics,
  completedTopicIds = [],
  onSelectWorld,
  onResetProgress,
  onMarkAllComplete,
  avatar = 'mario',
  onOpenExportProgress,
}) => {
  const percentage = Math.min(100, Math.round((completedCount / Math.max(1, totalTopics)) * 100));

  const worldBreakdowns = useMemo(() => {
    const completedSet = new Set(completedTopicIds);
    return WORLDS_METADATA.map((w) => {
      const topics = ALL_LAW_TOPICS.filter((t) => t.worldId === w.id);
      const done = topics.filter((t) => completedSet.has(t.id)).length;
      return {
        id: w.id,
        worldNumber: w.worldNumber,
        shortTitle: w.shortTitle,
        done,
        total: topics.length,
        isCleared: topics.length > 0 && done >= topics.length,
      };
    });
  }, [completedTopicIds]);

  const clearedWorldsCount = worldBreakdowns.filter((w) => w.isCleared).length;

  const tier: 'small' | 'super' | 'fire' | 'star' =
    percentage >= 100
      ? 'star'
      : percentage >= 70
      ? 'fire'
      : percentage >= 33
      ? 'super'
      : 'small';

  const heroMeta = getHeroMeta(avatar);
  const avatarName = heroMeta.name.toUpperCase();

  const tierTitle =
    percentage >= 100
      ? `${avatarName} • ALL 6 WORLDS CLEARED!`
      : percentage >= 75
      ? `${avatarName} • WORLD 6 PEACH CASTLE APPROACH`
      : percentage >= 33
      ? `${avatarName} • MID-STAGE EXPLORER (${clearedWorldsCount}/6 WORLDS)`
      : `${avatarName} • STAGE 1-1 ROOKIE`;

  return (
    <div
      data-testid="stage-progress-tracker"
      className="bg-[#1e293b] rounded-3xl border-4 border-slate-950 p-4 sm:p-5 shadow-[6px_6px_0_#000] text-white select-none"
    >
      {/* Top Stage Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b-2 border-slate-700 pb-3.5 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-amber-400 border-2 border-black flex items-center justify-center shadow-[0_2px_0_#000] flex-shrink-0">
            <MarioStageSprite tier={tier} avatar={avatar} className="w-7 h-7" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs font-black uppercase text-amber-400 tracking-wider font-mario block leading-snug break-words">
              {tierTitle}
            </span>
            <h3 className="text-base sm:text-xl font-black text-white font-display">
              SIX-WORLD PROGRESSION TRACKER
            </h3>
          </div>
        </div>

        {/* Aligned Stats & Controls */}
        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-center justify-end">
          <div className="h-9 bg-slate-900 px-3 rounded-xl border-2 border-slate-700 inline-flex items-center gap-2 tabular-nums">
            <span className="text-[10px] font-black text-slate-400 uppercase font-mario">DONE:</span>
            <span className="text-amber-400 font-black font-mario text-xs">
              {completedCount}/{totalTopics}
            </span>
            <span className="text-xs font-black text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/50">
              {percentage}%
            </span>
          </div>

          <button
            type="button"
            onClick={onMarkAllComplete}
            title="Mark all topics across Worlds 1-6 complete"
            className="min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs border-2 border-black shadow-[0_2px_0_#000] active:translate-y-0.5 cursor-pointer whitespace-nowrap"
          >
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Mark All</span>
          </button>

          {onOpenExportProgress && (
            <button
              type="button"
              onClick={() => {
                onOpenExportProgress();
                marioAudio.playFanfare();
              }}
              title="Export Player Score Card"
              className="min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs border-2 border-black shadow-[0_2px_0_#000] active:translate-y-0.5 cursor-pointer font-mario whitespace-nowrap"
            >
              <Trophy className="w-3.5 h-3.5 shrink-0" />
              <span>SCORE CARD</span>
            </button>
          )}

          <button
            type="button"
            onClick={onResetProgress}
            aria-label="Reset study progress"
            title="Reset Progress"
            className="min-h-[40px] w-10 inline-flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-2 border-slate-600 cursor-pointer shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Visual Interactive Progress Track */}
      <div className="relative pt-6 pb-1 px-2">
        <div
          className="absolute -top-1 transition-all duration-500 ease-out transform -translate-x-1/2 flex flex-col items-center pointer-events-none z-10"
          style={{ left: `${Math.max(4, Math.min(96, percentage))}%` }}
        >
          <div className="animate-bounce">
            <MarioStageSprite tier={tier} avatar={avatar} className={tier === 'small' ? 'w-6 h-6' : 'w-8 h-8'} />
          </div>
          <span className="text-[9px] font-black font-mario text-amber-300 bg-black/90 px-1.5 py-0.5 rounded border border-amber-400/50 mt-0.5 whitespace-nowrap shadow-sm tabular-nums">
            {percentage}%
          </span>
        </div>

        <div className="w-full h-4 sm:h-5 bg-[#0f172a] rounded-full border-2 border-slate-950 overflow-hidden relative shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-red-600 via-amber-400 to-emerald-500 border-r-2 border-black transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
          <div className="absolute inset-0 flex justify-between px-6 items-center pointer-events-none opacity-30">
            <div className="w-1.5 h-3 bg-white rounded-full" />
            <div className="w-1.5 h-3 bg-white rounded-full" />
            <div className="w-1.5 h-3 bg-white rounded-full" />
            <div className="w-1.5 h-3 bg-white rounded-full" />
            <div className="w-1.5 h-3 bg-white rounded-full" />
          </div>
        </div>

        {/* All 6 Worlds Live Completion Strip (Worlds 1 through 6) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 mt-3">
          {worldBreakdowns.map((wb) => (
            <button
              key={wb.id}
              type="button"
              onClick={() => onSelectWorld?.(wb.id)}
              data-testid={`tracker-world-chip-${wb.id}`}
              className={`min-h-[38px] px-2.5 py-1.5 rounded-xl border text-left flex items-center justify-between gap-1.5 text-[11px] font-bold transition-colors ${
                onSelectWorld ? 'cursor-pointer hover:border-amber-400' : 'cursor-default'
              } ${
                wb.isCleared
                  ? 'bg-emerald-950/75 border-emerald-400/80 text-emerald-200'
                  : wb.done > 0
                  ? 'bg-slate-900 border-amber-400/50 text-amber-200'
                  : 'bg-slate-900/70 border-slate-700 text-slate-300'
              }`}
            >
              <span className="truncate">
                W{wb.worldNumber}: {wb.shortTitle}
              </span>
              <span className="font-mono text-[10px] font-black shrink-0 tabular-nums flex items-center gap-0.5">
                {wb.isCleared && <MarioFlagIcon className="w-3 h-3 shrink-0" />}
                {wb.done}/{wb.total}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

