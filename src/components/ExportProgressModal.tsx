import React, { useRef, useState } from 'react';
import { ALL_LAW_TOPICS, WORLDS_METADATA } from '../data/laborLawData';
import {
  MarioStarIcon,
  MarioMushroomIcon,
  MarioFireFlowerIcon,
  MarioPeachCrownIcon,
  Mario1UpIcon,
  MarioCoinIcon,
} from './MarioIcons';
import { marioAudio } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Download,
  Copy,
  Check,
  Share2,
  Trophy,
  Award,
  X,
  Printer,
  Sparkles,
} from 'lucide-react';

interface ExportProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedTopicIds: string[];
  coins: number;
}

export const ExportProgressModal: React.FC<ExportProgressModalProps> = ({
  isOpen,
  onClose,
  completedTopicIds,
  coins,
}) => {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  const totalTopics = ALL_LAW_TOPICS.length;
  const completedCount = completedTopicIds.length;
  const overallPercent = Math.min(100, Math.round((completedCount / totalTopics) * 100));

  // Compute stats per world
  const worldStats = WORLDS_METADATA.map((w) => {
    const worldTopics = ALL_LAW_TOPICS.filter((t) => t.worldId === w.id);
    const worldCompleted = worldTopics.filter((t) => completedTopicIds.includes(t.id)).length;
    const percent = worldTopics.length > 0 ? Math.round((worldCompleted / worldTopics.length) * 100) : 0;
    return {
      ...w,
      total: worldTopics.length,
      completed: worldCompleted,
      percent,
    };
  });

  // Player Rank
  const playerRank =
    overallPercent >= 100
      ? 'INVINCIBLE STAR MASTER (100% CLEAR)'
      : overallPercent >= 75
      ? 'FIRE MARIO STATUTORY SPECIALIST'
      : overallPercent >= 45
      ? 'SUPER MARIO LABOR ADVOCATE'
      : 'ROOKIE PLUMBER (STAGE 1-1)';

  // Copy shareable text summary
  const handleCopyText = () => {
    const lines = [
      '★ SUPER MARIO LABOR ADVENTURE - PLAYER SCORE CARD ★',
      `Rank: ${playerRank}`,
      `Total Modules Completed: ${completedCount} / ${totalTopics} (${overallPercent}%)`,
      `Coins in Wallet: x${coins}`,
      '',
      '--- WORLD BY WORLD PROGRESS ---',
      ...worldStats.map(
        (ws) =>
          `World ${ws.worldNumber} (${ws.shortTitle}): [${'■'.repeat(
            Math.round(ws.percent / 10)
          )}${'-'.repeat(10 - Math.round(ws.percent / 10))}] ${ws.percent}% (${ws.completed}/${ws.total})`
      ),
      '',
      'Unabridged Philippine Labor Standards Guide (Worlds 1–6): Hours of Work, Rest & Holidays, Wages, Special Groups, Protective Laws & Statutory Leaves.',
      'Created by Matthew (Matthew Cesar Corpuz) — Main Creator of this Memory Aid.',
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    marioAudio.playCoin();
    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    } catch {
      // ignore
    }
    setTimeout(() => setCopied(false), 2500);
  };

  // Generate and download Score Card as PNG using HTML5 Canvas (supports all 6 Worlds cleanly)
  const handleDownloadImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 780;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background Gradient (Vibrant Sunny Mario Sky to Warm Gold)
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 780);
    bgGrad.addColorStop(0, '#0284c7');
    bgGrad.addColorStop(0.5, '#0ea5e9');
    bgGrad.addColorStop(1, '#f59e0b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 780);

    // Decorative Clouds & Hill Accents
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(200, 90, 45, 0, Math.PI * 2);
    ctx.arc(245, 75, 55, 0, Math.PI * 2);
    ctx.arc(290, 90, 45, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(950, 100, 40, 0, Math.PI * 2);
    ctx.arc(990, 85, 50, 0, Math.PI * 2);
    ctx.arc(1030, 100, 40, 0, Math.PI * 2);
    ctx.fill();

    // Main Score Card Frame (sized for all 6 Worlds + creator attribution)
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.roundRect(60, 60, 1080, 660, [32]);
    ctx.fill();
    ctx.stroke();

    // Top Header Banner
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.roundRect(80, 80, 1040, 90, [20]);
    ctx.fill();

    // Header Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('SUPER MARIO LABOR ADVENTURE - OFFICIAL SCORE CARD', 110, 138);

    // Subtitle & Rank
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(`PLAYER RANK: ${playerRank}`, 90, 220);

    ctx.fillStyle = '#475569';
    ctx.font = '600 18px sans-serif';
    ctx.fillText(
      `OVERALL PROGRESS: ${completedCount} OF ${totalTopics} TOPICS COMPLETED (${overallPercent}%) • COINS: x${coins}`,
      90,
      250
    );

    // Overall Progress Bar
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.roundRect(90, 265, 1020, 20, [10]);
    ctx.fill();

    const overallFill = ctx.createLinearGradient(90, 0, 90 + 1020 * (overallPercent / 100), 0);
    overallFill.addColorStop(0, '#dc2626');
    overallFill.addColorStop(0.5, '#f59e0b');
    overallFill.addColorStop(1, '#16a34a');
    ctx.fillStyle = overallFill;
    ctx.beginPath();
    ctx.roundRect(90, 265, Math.max(20, 1020 * (overallPercent / 100)), 20, [10]);
    ctx.fill();

    // World by World Breakdown Bars
    let startY = 320;
    worldStats.forEach((ws, idx) => {
      // Label
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`World ${ws.worldNumber}: ${ws.shortTitle}`, 90, startY + idx * 56 + 18);

      // Percentage Text
      ctx.fillStyle = ws.percent === 100 ? '#15803d' : '#0369a1';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`${ws.percent}% (${ws.completed}/${ws.total})`, 1000, startY + idx * 56 + 18);

      // Progress Track
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.roundRect(90, startY + idx * 56 + 26, 1020, 14, [7]);
      ctx.fill();

      // Filled bar
      const fillW = Math.max(14, (1020 * ws.percent) / 100);
      ctx.fillStyle =
        ws.percent === 100 ? '#16a34a' : ws.percent >= 50 ? '#f59e0b' : '#3b82f6';
      ctx.beginPath();
      ctx.roundRect(90, startY + idx * 56 + 26, fillW, 14, [7]);
      ctx.fill();
    });

    // Footer Attribution
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(
      '100% Unabridged Philippine Labor Standards (Worlds 1–6) · Created by Matthew (Main Creator)',
      90,
      695
    );

    // Trigger Download
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `Super-Mario-Labor-ScoreCard-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();

    marioAudio.playPowerUp();
    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 select-none overflow-y-auto print:hidden">
      <div className="bg-[#1e293b] text-white w-full max-w-2xl h-[100dvh] sm:h-auto sm:max-h-[92vh] rounded-none sm:rounded-3xl border-0 sm:border-4 border-slate-950 shadow-[8px_8px_0_#000] overflow-hidden my-auto flex flex-col safe-top-nav safe-bottom-dock">
        {/* Header */}
        <div className="bg-[#0f172a] p-4 sm:p-5 border-b-2 border-slate-700 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 border-2 border-black flex items-center justify-center shadow-[0_2px_0_#000]">
              <Trophy className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-400 font-mario block">
                OFFICIAL CERTIFICATE
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white font-display">
                EXPORT PLAYER SCORE CARD
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Export Score Card Modal"
            className="min-w-[44px] min-h-[44px] rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Visual Score Card Preview */}
        <div className="p-4 sm:p-6 space-y-5 flex-1 overflow-y-auto min-h-0">
          {/* Visual Certificate Card */}
          <div
            ref={cardRef}
            className="bg-white text-slate-950 rounded-2xl p-5 sm:p-6 border-4 border-slate-950 shadow-[6px_6px_0_#000] space-y-4"
          >
            {/* Certificate Header Banner */}
            <div className="bg-gradient-to-r from-red-600 to-amber-500 text-white p-4 rounded-xl border-3 border-black flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider font-mario block text-amber-200">
                  PHILIPPINE LABOR STANDARDS
                </span>
                <h3 className="text-lg sm:text-xl font-black font-display text-white">
                  RECORD OF STATUTORY MASTERY
                </h3>
              </div>
              <div className="w-10 h-10 bg-amber-400 rounded-xl border-2 border-black flex items-center justify-center text-slate-950 font-black shadow-xs flex-shrink-0">
                <MarioStarIcon className="w-6 h-6" />
              </div>
            </div>

            {/* Player Status & Wallet */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-slate-200 pb-3">
              <div>
                <span className="text-xs font-black uppercase text-slate-500 font-mario block">
                  HERO RANK:
                </span>
                <span className="text-base sm:text-lg font-black text-slate-950 font-display">
                  {playerRank}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-amber-100 border-2 border-black rounded-xl px-3 py-1 shadow-xs self-start sm:self-auto">
                <MarioCoinIcon className="w-4 h-4" />
                <span className="text-xs font-black font-mario text-slate-950">x{coins} Coins</span>
              </div>
            </div>

            {/* Overall Data Visualization Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-black font-mario">
                <span className="text-slate-700">OVERALL PROGRESS:</span>
                <span className="text-emerald-700">{completedCount}/{totalTopics} ({overallPercent}%)</span>
              </div>
              <div className="w-full h-5 bg-slate-200 rounded-full border-2 border-slate-950 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-600 via-amber-400 to-emerald-500 transition-all duration-500"
                  style={{ width: `${overallPercent}%` }}
                />
              </div>
            </div>

            {/* World by World Breakdown Data Bars */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-black uppercase text-slate-600 tracking-wider font-mario block">
                WORLD-BY-WORLD BREAKDOWN:
              </span>
              <div className="space-y-2.5">
                {worldStats.map((ws) => (
                  <div key={ws.id} className="bg-slate-50 p-2.5 rounded-xl border border-slate-300 space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-900">
                      <span className="font-extrabold">World {ws.worldNumber}: {ws.shortTitle}</span>
                      <span className="font-mario text-[11px] text-slate-700">{ws.percent}% ({ws.completed}/{ws.total})</span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full border border-slate-400 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          ws.percent === 100
                            ? 'bg-emerald-500'
                            : ws.percent >= 50
                            ? 'bg-amber-400'
                            : 'bg-blue-500'
                        }`}
                        style={{ width: `${ws.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-slate-500">
              <span>Worlds 1–6 Statutory Mastery Record</span>
              <span>Created by Matthew · Main Creator of this Memory Aid</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-[#0f172a] p-4 sm:p-5 border-t-2 border-slate-700 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="min-h-[44px] flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-600 active:translate-y-0.5 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="hidden sm:flex min-h-[44px] items-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs rounded-xl border border-slate-600 cursor-pointer"
              title="Print Score Card"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleDownloadImage}
            className="min-h-[44px] flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl border-2 border-black shadow-[0_3px_0_#000] active:translate-y-0.5 cursor-pointer ml-auto"
          >
            <Download className="w-4 h-4" />
            <span>Download Image (PNG)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
