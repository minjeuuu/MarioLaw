import React, { useRef, useEffect, useState } from 'react';
import { MarioAvatar } from '../types/laborLaw';
import { getHeroMeta } from '../data/heroesData';
import { MarioCharacterAvatar, MarioCoinIcon, MarioStarIcon, MarioMushroomIcon } from './MarioIcons';
import { marioAudio } from '../utils/audio';
import { RotateCcw, Trophy, ArrowLeft, ArrowRight, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { drawLawCatcherItem } from '../utils/gameQuestionDeck';

interface LawCatcherGameProps {
  equippedAvatar: MarioAvatar;
  onEarnCoins: (amount: number) => void;
}

interface FallingItem {
  id: number;
  x: number;
  y: number;
  speed: number;
  type: 'coin' | 'mushroom' | 'star' | 'thwomp' | 'poison';
  label: string;
  isBenefit: boolean;
}

export const LawCatcherGame: React.FC<LawCatcherGameProps> = ({
  equippedAvatar,
  onEarnCoins,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [latestCaught, setLatestCaught] = useState<string>('Catch statutory rights; dodge illegal practices!');

  const playerRef = useRef<{ x: number; width: number; speed: number }>({
    x: 220,
    width: 44,
    speed: 7,
  });

  const keysRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });
  const itemsRef = useRef<FallingItem[]>([]);
  const nextItemIdRef = useRef<number>(1);
  const spawnTimerRef = useRef<number>(0);

  const heroMeta = getHeroMeta(equippedAvatar);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) keysRef.current.left = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) keysRef.current.right = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) keysRef.current.left = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) keysRef.current.right = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    playerRef.current.x = 220;
    itemsRef.current = [];
    setLatestCaught('Catch statutory benefits, dodge unfair labor thwomps!');
    marioAudio.playPowerUp();
  };

  useEffect(() => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;

    const loop = () => {
      const width = canvas.width;
      const height = canvas.height;

      // 1. Player Movement
      if (keysRef.current.left) {
        playerRef.current.x = Math.max(10, playerRef.current.x - playerRef.current.speed);
      }
      if (keysRef.current.right) {
        playerRef.current.x = Math.min(width - playerRef.current.width - 10, playerRef.current.x + playerRef.current.speed);
      }

      // 2. Spawn Items from 26-item non-repeating session decks
      spawnTimerRef.current++;
      if (spawnTimerRef.current > 42) {
        spawnTimerRef.current = 0;
        const isHazard = Math.random() < 0.35;
        const template = drawLawCatcherItem(isHazard);

        itemsRef.current.push({
          id: nextItemIdRef.current++,
          x: 20 + Math.random() * (width - 60),
          y: -20,
          speed: 2.5 + Math.random() * 2.2,
          type: template.type,
          label: template.label,
          isBenefit: template.isBenefit,
        });
      }

      // 3. Update & Collision
      const playerY = height - 50;
      const p = playerRef.current;

      const remaining: FallingItem[] = [];
      for (const item of itemsRef.current) {
        item.y += item.speed;

        // Collision with player
        if (
          item.y + 20 >= playerY &&
          item.y <= playerY + 40 &&
          item.x + 20 >= p.x &&
          item.x <= p.x + p.width
        ) {
          if (item.isBenefit) {
            marioAudio.playCoin();
            setScore((s) => s + (item.type === 'star' ? 25 : 15));
            setLatestCaught(`CAUGHT: ${item.label}! (+Points)`);
          } else {
            marioAudio.playBowserHit();
            setLatestCaught(`HIT BY VIOLATION: ${item.label}! (-1 Life)`);
            setLives((l) => {
              if (l <= 1) {
                setGameState('gameover');
                marioAudio.playPipe();
                return 0;
              }
              return l - 1;
            });
          }
          continue;
        }

        // Offscreen bottom
        if (item.y < height) {
          remaining.push(item);
        }
      }
      itemsRef.current = remaining;

      // 4. Render
      ctx.clearRect(0, 0, width, height);

      // Background Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#38bdf8');
      skyGrad.addColorStop(1, '#93c5fd');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(80, 40, 24, 0, Math.PI * 2);
      ctx.arc(110, 36, 30, 0, Math.PI * 2);
      ctx.arc(140, 40, 24, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(360, 60, 22, 0, Math.PI * 2);
      ctx.arc(390, 56, 28, 0, Math.PI * 2);
      ctx.arc(420, 60, 22, 0, Math.PI * 2);
      ctx.fill();

      // Ground bricks
      ctx.fillStyle = '#b45309';
      ctx.fillRect(0, height - 20, width, 20);
      ctx.fillStyle = '#15803d';
      ctx.fillRect(0, height - 24, width, 4);

      // Draw Falling Items
      for (const item of itemsRef.current) {
        if (item.type === 'coin') {
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(item.x + 10, item.y + 10, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else if (item.type === 'mushroom') {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(item.x + 10, item.y + 8, 11, Math.PI, 0, false);
          ctx.fill();
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(item.x + 4, item.y + 8, 12, 10);
        } else if (item.type === 'star') {
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(item.x + 10, item.y + 10, 11, 0, Math.PI * 2);
          ctx.fill();
        } else if (item.type === 'thwomp') {
          ctx.fillStyle = '#475569';
          ctx.fillRect(item.x, item.y, 22, 22);
          ctx.strokeStyle = '#0f172a';
          ctx.strokeRect(item.x, item.y, 22, 22);
        } else {
          ctx.fillStyle = '#7e22ce';
          ctx.beginPath();
          ctx.arc(item.x + 10, item.y + 8, 11, Math.PI, 0, false);
          ctx.fill();
          ctx.fillStyle = '#1e1b4b';
          ctx.fillRect(item.x + 4, item.y + 8, 12, 10);
        }

        // Small tag
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText(item.label.slice(0, 15), Math.max(5, item.x - 14), item.y - 3);
      }

      // Draw Player Cart / Avatar Basket
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(p.x, playerY, p.width, 24);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(p.x + 4, playerY + 4, p.width - 8, 16);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('MARIO', p.x + 7, playerY + 16);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState]);

  return (
    <div className="bg-slate-900 border-4 border-slate-950 rounded-3xl p-4 sm:p-6 text-white space-y-4 shadow-[6px_6px_0_#000]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-amber-400 rounded-xl border-2 border-black flex items-center justify-center">
            <MarioStarIcon className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 font-mario">
              SKY CATCH ARCADE
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display">
              SUPER MARIO LAW CATCHER
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-700 font-mono text-xs font-bold text-amber-300">
            <span>SCORE: {score}</span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-0.5 text-red-400">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-3.5 h-3.5 ${i < lives ? 'fill-red-500 text-red-500' : 'text-slate-700'}`}
                />
              ))}
            </span>
          </div>

          <button
            onClick={startGame}
            className="h-8 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 border-2 border-black rounded-xl font-black text-xs inline-flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{gameState === 'start' ? 'Play' : 'Restart'}</span>
          </button>
        </div>
      </div>

      {/* Latest event banner */}
      <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-bold text-center text-amber-300 font-mono truncate">
        {latestCaught}
      </div>

      {/* Canvas Area */}
      <div className="relative mx-auto max-w-xl aspect-[4/3] rounded-2xl overflow-hidden border-3 border-black shadow-inner">
        <canvas
          ref={canvasRef}
          width={480}
          height={360}
          className="w-full h-full block bg-sky-300"
        />

        {gameState === 'start' && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-3">
            <h3 className="text-2xl font-black text-white font-display">
              CATCH STATUTORY RIGHTS!
            </h3>
            <p className="text-xs text-slate-300 max-w-md">
              Use Left / Right Arrows or Touch Controls to catch 13th Month coins, 105-Day leaves, and Service Charges while dodging Thwomps & Diminution poisons!
            </p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-2 border-black font-mario text-xs uppercase cursor-pointer"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-3">
            <Trophy className="w-12 h-12 text-amber-400" />
            <h3 className="text-2xl font-black text-white font-display">GAME OVER!</h3>
            <p className="text-sm font-bold text-slate-300">
              Total Score: <span className="text-amber-300 text-lg">{score}</span>
            </p>
            <button
              onClick={() => {
                onEarnCoins(Math.max(5, Math.round(score / 4)));
                startGame();
              }}
              className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-2 border-black text-xs font-mario uppercase cursor-pointer"
            >
              Collect Coins & Play Again
            </button>
          </div>
        )}
      </div>

      {/* Ergonomic Mobile Controls */}
      <div className="grid grid-cols-2 gap-3 max-w-xl mx-auto pt-1">
        <button
          onMouseDown={() => (keysRef.current.left = true)}
          onMouseUp={() => (keysRef.current.left = false)}
          onTouchStart={() => (keysRef.current.left = true)}
          onTouchEnd={() => (keysRef.current.left = false)}
          className="h-14 bg-slate-800 hover:bg-slate-700 active:bg-amber-400 active:text-slate-950 rounded-2xl border-2 border-slate-700 flex items-center justify-center font-black text-sm cursor-pointer select-none gap-2 shadow"
        >
          <ArrowLeft className="w-6 h-6" />
          <span>MOVE LEFT</span>
        </button>

        <button
          onMouseDown={() => (keysRef.current.right = true)}
          onMouseUp={() => (keysRef.current.right = false)}
          onTouchStart={() => (keysRef.current.right = true)}
          onTouchEnd={() => (keysRef.current.right = false)}
          className="h-14 bg-slate-800 hover:bg-slate-700 active:bg-amber-400 active:text-slate-950 rounded-2xl border-2 border-slate-700 flex items-center justify-center font-black text-sm cursor-pointer select-none gap-2 shadow"
        >
          <span>MOVE RIGHT</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
