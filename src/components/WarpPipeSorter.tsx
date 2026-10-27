import React, { useState, useEffect, useRef } from 'react';
import { MarioAvatar } from '../types/laborLaw';
import { MarioCharacterAvatar, MarioCoinIcon, MarioPipeIcon, MarioStarIcon } from './MarioIcons';
import { marioAudio } from '../utils/audio';
import { RotateCcw, Trophy, Check, X, ArrowLeft, ArrowRight, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { drawWarpPipeSorterDeck, WarpSorterItem } from '../utils/gameQuestionDeck';

interface WarpPipeSorterProps {
  equippedAvatar: MarioAvatar;
  onEarnCoins: (amount: number) => void;
}

export const WarpPipeSorter: React.FC<WarpPipeSorterProps> = ({
  equippedAvatar,
  onEarnCoins,
}) => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [deck, setDeck] = useState<WarpSorterItem[]>([]);
  const [lastFeedback, setLastFeedback] = useState<{
    correct: boolean;
    text: string;
  } | null>(null);

  // Deal fresh non-repeating 12-item round from 24-item statutory deck
  const startNewGame = () => {
    const shuffled = drawWarpPipeSorterDeck(12);
    setDeck(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setTimeLeft(45);
    setLastFeedback(null);
    setGameState('playing');
    marioAudio.playPowerUp();
  };

  useEffect(() => {
    if (gameState !== 'playing') return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setGameState('gameover');
          marioAudio.playQuizComplete();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  const handleSort = (pipe: 'covered' | 'exempt') => {
    if (gameState !== 'playing' || !deck[currentIndex]) return;
    const item = deck[currentIndex];
    const isCorrect = item.targetPipe === pipe;

    if (isCorrect) {
      marioAudio.playCoin();
      const points = 10 + streak * 2;
      setScore((s) => s + points);
      setStreak((st) => st + 1);
      setLastFeedback({ correct: true, text: `CORRECT! ${item.detail}` });
    } else {
      marioAudio.playPipe();
      setStreak(0);
      setLastFeedback({ correct: false, text: `INCORRECT! ${item.detail}` });
    }

    if (currentIndex + 1 >= deck.length) {
      const nextDeck = drawWarpPipeSorterDeck(12);
      setDeck(nextDeck);
      setCurrentIndex(0);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      if (e.key === 'ArrowLeft' || e.key === 'KeyA') {
        handleSort('covered');
      } else if (e.key === 'ArrowRight' || e.key === 'KeyD') {
        handleSort('exempt');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, currentIndex, deck]);

  const currentItem = deck[currentIndex];

  return (
    <div className="bg-slate-900 border-4 border-slate-950 rounded-3xl p-4 sm:p-6 text-white space-y-6 shadow-[6px_6px_0_#000]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl border-2 border-black flex items-center justify-center shadow-[0_3px_0_#000]">
            <MarioPipeIcon className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 font-mario">
              SPEED CLASSIFIER ARCADE
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display">
              WARP PIPE LABOR SORTER
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {gameState === 'playing' && (
            <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-700 font-mono text-xs font-bold text-amber-300">
              TIME: {timeLeft}s | SCORE: {score}
            </div>
          )}
          <button
            onClick={startNewGame}
            className="h-9 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white border-2 border-black rounded-xl font-black text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-[0_2px_0_#000]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{gameState === 'start' ? 'Start Game' : 'Restart'}</span>
          </button>
        </div>
      </div>

      {gameState === 'start' && (
        <div className="bg-slate-950 p-6 rounded-2xl border-2 border-slate-800 text-center space-y-4 max-w-lg mx-auto">
          <MarioPipeIcon className="w-16 h-16 mx-auto text-emerald-400" />
          <h3 className="text-xl font-black text-white font-display">
            SORT WORKERS & PRACTICES INTO THE RIGHT PIPES!
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Flick incoming labor practices into the <strong className="text-emerald-400">Green Pipe (COVERED / MANDATORY)</strong> or <strong className="text-red-400">Red Pipe (EXEMPT / PROHIBITED)</strong> before time runs out!
          </p>
          <button
            onClick={startNewGame}
            className="px-8 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-2xl border-3 border-black text-sm uppercase cursor-pointer shadow-[0_4px_0_#000] font-mario"
          >
            START SORTING NOW
          </button>
        </div>
      )}

      {gameState === 'playing' && currentItem && (
        <div className="space-y-6">
          {/* Active Card to Sort */}
          <div className="bg-slate-950 border-3 border-amber-400 p-6 rounded-2xl text-center space-y-2 max-w-xl mx-auto shadow-[0_0_20px_rgba(251,191,36,0.15)] animate-in fade-in">
            <span className="text-[10px] font-black uppercase text-amber-400 font-mario">
              CLASSIFY THIS STATUTORY SUBJECT:
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white font-display">
              {currentItem.label}
            </h3>
            <p className="text-xs text-slate-400 font-medium">{currentItem.detail}</p>
          </div>

          {/* Feedback Strip */}
          {lastFeedback && (
            <div
              className={`p-2.5 rounded-xl border text-center text-xs font-bold ${
                lastFeedback.correct
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                  : 'bg-red-950/80 border-red-500 text-red-300'
              }`}
            >
              {lastFeedback.text}
            </div>
          )}

          {/* Big Two Pipes Action Buttons (Ergonomic Touch Targets for Mobile) */}
          <div className="grid grid-cols-2 gap-3 sm:gap-6 pt-2">
            {/* Green Left Pipe */}
            <button
              onClick={() => handleSort('covered')}
              className="p-5 sm:p-7 rounded-3xl bg-emerald-700 hover:bg-emerald-600 active:scale-95 transition-all border-4 border-slate-950 shadow-[0_6px_0_#000] text-center space-y-2 cursor-pointer group"
            >
              <div className="w-14 h-14 mx-auto bg-emerald-500 rounded-2xl border-2 border-black flex items-center justify-center group-hover:scale-105 transition-transform">
                <ArrowLeft className="w-8 h-8 text-white stroke-[3]" />
              </div>
              <h4 className="text-sm sm:text-base font-black text-white font-display">
                GREEN PIPE
              </h4>
              <span className="text-[10px] sm:text-xs font-black bg-emerald-900/80 text-emerald-200 px-2 py-0.5 rounded font-mario uppercase block">
                COVERED / MANDATORY
              </span>
            </button>

            {/* Red Right Pipe */}
            <button
              onClick={() => handleSort('exempt')}
              className="p-5 sm:p-7 rounded-3xl bg-red-700 hover:bg-red-600 active:scale-95 transition-all border-4 border-slate-950 shadow-[0_6px_0_#000] text-center space-y-2 cursor-pointer group"
            >
              <div className="w-14 h-14 mx-auto bg-red-500 rounded-2xl border-2 border-black flex items-center justify-center group-hover:scale-105 transition-transform">
                <ArrowRight className="w-8 h-8 text-white stroke-[3]" />
              </div>
              <h4 className="text-sm sm:text-base font-black text-white font-display">
                RED PIPE
              </h4>
              <span className="text-[10px] sm:text-xs font-black bg-red-900/80 text-red-200 px-2 py-0.5 rounded font-mario uppercase block">
                EXEMPT / PROHIBITED
              </span>
            </button>
          </div>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="bg-slate-950 p-6 rounded-2xl border-3 border-amber-400 text-center space-y-4 max-w-lg mx-auto">
          <Trophy className="w-14 h-14 mx-auto text-amber-400" />
          <h3 className="text-2xl font-black text-white font-display">TIME&apos;S UP!</h3>
          <p className="text-sm text-slate-300">
            Final Score: <strong className="text-amber-300 text-lg">{score} Points</strong>
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                onEarnCoins(Math.max(5, Math.round(score / 5)));
                startNewGame();
              }}
              className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-2 border-black cursor-pointer shadow-[0_3px_0_#000]"
            >
              Collect Rewards & Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
