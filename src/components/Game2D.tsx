import React, { useRef, useEffect, useState } from 'react';
import { marioAudio } from '../utils/audio';
import { MarioAvatar } from '../types/laborLaw';
import { getHeroMeta } from '../data/heroesData';
import { stepPlatformer2DPhysics, Platformer2DState } from '../utils/gamePhysics';
import { MarioCharacterAvatar, MarioCoinIcon } from './MarioIcons';
import { Play, RotateCcw, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import { drawPlatformer2DDoctrine } from '../utils/gameQuestionDeck';

interface Game2DProps {
  fontSize?: 'normal' | 'large' | 'xlarge';
  equippedAvatar?: MarioAvatar;
  onEarnCoins: (amount: number) => void;
}

export const Game2D: React.FC<Game2DProps> = ({ equippedAvatar = 'mario', onEarnCoins }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const initialAutoStart =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('autostart') === '1';

  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover' | 'victory'>(
    initialAutoStart ? 'playing' : 'start'
  );
  const gameStateRef = useRef(gameState);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [lives, setLives] = useState(3);
  const [latestFact, setLatestFact] = useState<string>(
    'Tap JUMP for a low hop or HOLD JUMP for a high arc! Hit [?] blocks from below!'
  );

  const onEarnCoinsRef = useRef(onEarnCoins);
  useEffect(() => {
    onEarnCoinsRef.current = onEarnCoins;
  }, [onEarnCoins]);

  useEffect(() => {
    gameStateRef.current = gameState;
    if (typeof document !== 'undefined') {
      document.body.dataset.state =
        gameState === 'start'
          ? 'title'
          : gameState === 'playing'
          ? 'playing'
          : 'gameover';
    }
  }, [gameState]);

  const keysRef = useRef<{
    left: boolean;
    right: boolean;
    jumpHeld: boolean;
    jumpJustPressed: boolean;
  }>({
    left: false,
    right: false,
    jumpHeld: false,
    jumpJustPressed: false,
  });

  const resetWorldRef = useRef<(() => void) | null>(null);

  const startGame = () => {
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    keysRef.current = {
      left: false,
      right: false,
      jumpHeld: false,
      jumpJustPressed: false,
    };
    if (resetWorldRef.current) resetWorldRef.current();
    setGameState('playing');
    setLives(3);
    setScore(0);
    setCoins(0);
    setLatestFact('Hold JUMP longer for higher Mario leaps! Hit [?] blocks for Labor Law doctrines!');
    marioAudio.playPowerUp();
  };

  useEffect(() => {
    const clearKeys = () => {
      keysRef.current.left = false;
      keysRef.current.right = false;
      keysRef.current.jumpHeld = false;
      keysRef.current.jumpJustPressed = false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStateRef.current === 'start' && (e.code === 'Enter' || e.code === 'Space')) {
        e.preventDefault();
        startGame();
        return;
      }
      if (['ArrowLeft', 'KeyA'].includes(e.code)) keysRef.current.left = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) keysRef.current.right = true;
      if (['ArrowUp', 'KeyW', 'Space'].includes(e.code)) {
        if (!keysRef.current.jumpHeld) {
          keysRef.current.jumpJustPressed = true;
        }
        keysRef.current.jumpHeld = true;
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) keysRef.current.left = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) keysRef.current.right = false;
      if (['ArrowUp', 'KeyW', 'Space'].includes(e.code)) keysRef.current.jumpHeld = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', clearKeys);
    document.addEventListener('visibilitychange', clearKeys);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', clearKeys);
      document.removeEventListener('visibilitychange', clearKeys);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let lastTime = performance.now();

    const groundY = 330;
    const flagpoleX = 2100;

    let player: Platformer2DState = {
      x: 60,
      y: groundY - 38,
      width: 28,
      height: 38,
      vx: 0,
      vy: 0,
      grounded: true,
      direction: 1,
      coyoteTimer: 0,
      jumpBufferTimer: 0,
      jumpCutApplied: false,
    };

    let scaleX = 1;
    let scaleY = 1;
    let cameraX = 0;
    let localScore = 0;
    let localCoins = 0;

    const createBlocks = () => [
      { x: 180, y: 230, w: 36, h: 36, type: 'q', hit: false, bumpY: 0 },
      { x: 216, y: 230, w: 36, h: 36, type: 'brick', hit: false, bumpY: 0 },
      { x: 252, y: 230, w: 36, h: 36, type: 'q', hit: false, bumpY: 0 },
      { x: 400, y: 196, w: 36, h: 36, type: 'q', hit: false, bumpY: 0 },
      { x: 436, y: 196, w: 36, h: 36, type: 'brick', hit: false, bumpY: 0 },
      { x: 600, y: 230, w: 36, h: 36, type: 'brick', hit: false, bumpY: 0 },
      { x: 636, y: 230, w: 36, h: 36, type: 'q', hit: false, bumpY: 0 },
      { x: 820, y: 190, w: 36, h: 36, type: 'q', hit: false, bumpY: 0 },
      { x: 856, y: 190, w: 36, h: 36, type: 'brick', hit: false, bumpY: 0 },
      { x: 892, y: 190, w: 36, h: 36, type: 'q', hit: false, bumpY: 0 },
      { x: 1100, y: 220, w: 36, h: 36, type: 'q', hit: false, bumpY: 0 },
      { x: 1300, y: 188, w: 36, h: 36, type: 'q', hit: false, bumpY: 0 },
      { x: 1500, y: 220, w: 36, h: 36, type: 'q', hit: false, bumpY: 0 },
      { x: 1750, y: 185, w: 36, h: 36, type: 'q', hit: false, bumpY: 0 },
    ];

    const pipes = [
      { x: 320, y: 270, w: 46, h: 60 },
      { x: 720, y: 250, w: 46, h: 80 },
      { x: 1200, y: 260, w: 46, h: 70 },
      { x: 1600, y: 250, w: 46, h: 80 },
    ];

    const createAirCoins = () => [
      { x: 140, y: 280, collected: false },
      { x: 480, y: 260, collected: false },
      { x: 515, y: 245, collected: false },
      { x: 780, y: 265, collected: false },
      { x: 960, y: 265, collected: false },
      { x: 1400, y: 260, collected: false },
      { x: 1900, y: 265, collected: false },
    ];

    const createEnemies = () => [
      { x: 480, y: 304, w: 26, h: 26, vx: -1.2, alive: true },
      { x: 880, y: 304, w: 26, h: 26, vx: -1.2, alive: true },
      { x: 1350, y: 304, w: 26, h: 26, vx: -1.2, alive: true },
      { x: 1700, y: 304, w: 26, h: 26, vx: -1.2, alive: true },
    ];

    let blocks = createBlocks();
    let airCoins = createAirCoins();
    let enemies = createEnemies();

    resetWorldRef.current = () => {
      player = {
        x: 60,
        y: groundY - 38,
        width: 28,
        height: 38,
        vx: 0,
        vy: 0,
        grounded: true,
        direction: 1,
        coyoteTimer: 0,
        jumpBufferTimer: 0,
        jumpCutApplied: false,
      };
      scaleX = 1;
      scaleY = 1;
      cameraX = 0;
      localScore = 0;
      localCoins = 0;
      blocks = createBlocks();
      airCoins = createAirCoins();
      enemies = createEnemies();
    };

    const gameLoop = (currentTime: number) => {
      const dtMs = Math.min(40, Math.max(8, currentTime - lastTime));
      lastTime = currentTime;
      const stepScale = dtMs / 16.6667;

      if (gameStateRef.current === 'playing') {
        const wasGrounded = player.grounded;
        const prevY = player.y;

        const stepRes = stepPlatformer2DPhysics(
          player,
          {
            left: keysRef.current.left,
            right: keysRef.current.right,
            jumpHeld: keysRef.current.jumpHeld,
            jumpJustPressed: keysRef.current.jumpJustPressed,
          },
          stepScale
        );
        keysRef.current.jumpJustPressed = false;
        player = stepRes.state;

        if (stepRes.didTriggerJump) {
          scaleX = 0.84;
          scaleY = 1.18;
          marioAudio.playJump();
        }

        if (player.x < cameraX) {
          player.x = cameraX;
          if (player.vx < 0) player.vx = 0;
        }

        player.grounded = false;

        // Ground landing
        if (player.y + player.height >= groundY) {
          player.y = groundY - player.height;
          if (!wasGrounded && player.vy > 2.5) {
            scaleX = 1.2;
            scaleY = 0.82;
          }
          player.vy = 0;
          player.grounded = true;
        }

        // Block collisions
        blocks.forEach((block) => {
          if (block.bumpY < 0) {
            block.bumpY = Math.min(0, block.bumpY + 1.2 * stepScale);
          }

          // Head bump from underneath
          if (
            player.x + player.width > block.x + 3 &&
            player.x < block.x + block.w - 3 &&
            player.y <= block.y + block.h &&
            prevY >= block.y + block.h - 10 &&
            player.vy < 0
          ) {
            player.y = block.y + block.h;
            player.vy = 0.5;
            block.bumpY = -7;
            if (block.type === 'q' && !block.hit) {
              block.hit = true;
              localCoins += 1;
              localScore += 200;
              setCoins(localCoins);
              setScore(localScore);
              onEarnCoinsRef.current(1);
              marioAudio.playQuestionBlock();
              setLatestFact(drawPlatformer2DDoctrine());
            } else {
              marioAudio.playJump();
            }
          }

          // Top landing
          if (
            player.x + player.width > block.x + 4 &&
            player.x < block.x + block.w - 4 &&
            player.y + player.height >= block.y &&
            prevY + player.height <= block.y + 12 &&
            player.vy >= 0
          ) {
            player.y = block.y - player.height;
            if (!wasGrounded && player.vy > 2.5) {
              scaleX = 1.18;
              scaleY = 0.84;
            }
            player.vy = 0;
            player.grounded = true;
          }
        });

        // Pipe collisions
        pipes.forEach((pipe) => {
          if (
            player.x + player.width > pipe.x &&
            player.x < pipe.x + pipe.w &&
            player.y + player.height > pipe.y
          ) {
            if (prevY + player.height <= pipe.y + 12 && player.vy >= 0) {
              player.y = pipe.y - player.height;
              player.vy = 0;
              player.grounded = true;
            } else {
              if (player.x + player.width / 2 < pipe.x + pipe.w / 2) {
                player.x = pipe.x - player.width;
              } else {
                player.x = pipe.x + pipe.w;
              }
              player.vx = 0;
            }
          }
        });

        // Squash & stretch exponential recovery
        scaleX += (1 - scaleX) * Math.min(1, 0.22 * stepScale);
        scaleY += (1 - scaleY) * Math.min(1, 0.22 * stepScale);

        // Air Coins
        airCoins.forEach((c) => {
          if (
            !c.collected &&
            Math.hypot(player.x + player.width / 2 - c.x, player.y + player.height / 2 - c.y) < 30
          ) {
            c.collected = true;
            localCoins += 1;
            localScore += 100;
            setCoins(localCoins);
            setScore(localScore);
            onEarnCoinsRef.current(1);
            marioAudio.playCoin();
          }
        });

        // Enemies Update
        enemies.forEach((enemy) => {
          if (!enemy.alive) return;
          enemy.x += enemy.vx * stepScale;
          if (enemy.x < cameraX - 80) enemy.alive = false;

          if (
            player.x + player.width > enemy.x &&
            player.x < enemy.x + enemy.w &&
            player.y + player.height > enemy.y &&
            player.y < enemy.y + enemy.h
          ) {
            if (player.vy > 0 && prevY + player.height <= enemy.y + 14) {
              enemy.alive = false;
              player.vy = keysRef.current.jumpHeld ? -10.5 : -7.8;
              scaleX = 1.22;
              scaleY = 0.8;
              localScore += 300;
              setScore(localScore);
              marioAudio.playPowerUp();
            } else {
              marioAudio.playPipe();
              setLives((l) => {
                const next = l - 1;
                if (next <= 0) {
                  setGameState('gameover');
                } else {
                  player.x = Math.max(cameraX + 12, player.x - 80);
                  player.y = groundY - player.height;
                  player.vx = 0;
                  player.vy = 0;
                }
                return next;
              });
            }
          }
        });

        // Flagpole Victory Check
        if (player.x >= flagpoleX) {
          marioAudio.playOneUp();
          setGameState('victory');
          onEarnCoinsRef.current(20);
          try {
            confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
          } catch {
            // ignore
          }
        }

        // Smooth camera follow
        const targetCamX = Math.max(cameraX, player.x - 280);
        cameraX += (targetCamX - cameraX) * Math.min(1, 0.25 * stepScale);
      }

      // RENDER
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
      skyGrad.addColorStop(0, '#38bdf8');
      skyGrad.addColorStop(1, '#bae6fd');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, groundY);

      ctx.fillStyle = '#7c2d12';
      ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(0, groundY, canvas.width, 8);

      ctx.save();
      ctx.translate(-cameraX, 0);

      // Clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
      [120, 500, 950, 1400, 1850].forEach((cx) => {
        ctx.beginPath();
        ctx.arc(cx, 60, 22, 0, Math.PI * 2);
        ctx.arc(cx + 22, 54, 26, 0, Math.PI * 2);
        ctx.arc(cx + 46, 60, 20, 0, Math.PI * 2);
        ctx.fill();
      });

      // Flagpole
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(flagpoleX + 12, 110, 6, 220);
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(flagpoleX + 15, 110, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(flagpoleX + 12, 115);
      ctx.lineTo(flagpoleX - 35, 130);
      ctx.lineTo(flagpoleX + 12, 145);
      ctx.fill();

      // Pipes
      pipes.forEach((p) => {
        ctx.fillStyle = '#15803d';
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(p.x + 6, p.y, 6, p.h);
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 3;
        ctx.strokeRect(p.x, p.y, p.w, p.h);
        ctx.fillStyle = '#16a34a';
        ctx.fillRect(p.x - 4, p.y, p.w + 8, 14);
        ctx.strokeRect(p.x - 4, p.y, p.w + 8, 14);
      });

      // Blocks
      blocks.forEach((b) => {
        const drawY = b.y + b.bumpY;
        if (b.type === 'q') {
          ctx.fillStyle = b.hit ? '#94a3b8' : '#f59e0b';
          ctx.fillRect(b.x, drawY, b.w, b.h);
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 3;
          ctx.strokeRect(b.x, drawY, b.w, b.h);
          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 20px monospace';
          ctx.fillText(b.hit ? '•' : '?', b.x + 11, drawY + 26);
        } else {
          ctx.fillStyle = '#9a3412';
          ctx.fillRect(b.x, drawY, b.w, b.h);
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 3;
          ctx.strokeRect(b.x, drawY, b.w, b.h);
          ctx.fillStyle = '#431407';
          ctx.fillRect(b.x + 4, drawY + 16, b.w - 8, 3);
        }
      });

      // Air Coins
      airCoins.forEach((c) => {
        if (c.collected) return;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, 8, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Enemies
      enemies.forEach((e) => {
        if (!e.alive) return;
        ctx.fillStyle = '#854d0e';
        ctx.beginPath();
        ctx.arc(e.x + 13, e.y + 13, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(e.x + 6, e.y + 6, 4, 6);
        ctx.fillRect(e.x + 16, e.y + 6, 4, 6);
        ctx.fillStyle = '#000000';
        ctx.fillRect(e.x + 7, e.y + 8, 2, 4);
        ctx.fillRect(e.x + 17, e.y + 8, 2, 4);
      });

      // Player Character with bottom-center squash & stretch
      const heroColors = getHeroMeta(equippedAvatar);
      ctx.save();
      ctx.translate(player.x + player.width / 2, player.y + player.height);
      ctx.scale(scaleX, scaleY);
      ctx.translate(-player.width / 2, -player.height);

      ctx.fillStyle = heroColors.primaryColor;
      ctx.fillRect(0, 0, player.width, player.height * 0.4);
      ctx.fillRect(player.direction === 1 ? 8 : -4, 4, 20, 6);
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(4, 12, player.width - 8, 12);
      ctx.fillStyle = '#451a03';
      ctx.fillRect(player.direction === 1 ? 12 : 4, 18, 10, 4);
      ctx.fillStyle = heroColors.secondaryColor;
      ctx.fillRect(2, 22, player.width - 4, player.height - 22);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(6, 24, 3, 3);
      ctx.fillRect(player.width - 9, 24, 3, 3);
      ctx.restore();

      ctx.restore();

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [equippedAvatar]);

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="bg-[#1e293b] rounded-3xl mario-card border-4 border-slate-950 p-4 sm:p-6 text-white space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-slate-700 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-amber-400 rounded-xl border-2 border-black flex items-center justify-center shrink-0">
              <MarioCharacterAvatar character={equippedAvatar} className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider font-mario block">
                2D MOMENTUM &amp; VARIABLE JUMP PLATFORMER
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-display text-white">
                SUPER MARIO LABOR RUNNER
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2.5 sm:gap-4 bg-slate-900 px-3.5 py-2 rounded-2xl border-2 border-slate-700 w-full sm:w-auto tabular-nums">
            <div className="flex items-center gap-1 font-mario text-[10px] sm:text-xs text-amber-300">
              <MarioCoinIcon className="w-4 h-4 shrink-0" />
              <span>x{coins.toString().padStart(2, '0')}</span>
            </div>
            <div className="font-mario text-[10px] sm:text-xs text-white">
              SCORE: <span className="text-emerald-400">{score.toString().padStart(5, '0')}</span>
            </div>
            <div className="font-mario text-[10px] sm:text-xs text-rose-400">
              LIVES: {Array(Math.max(0, lives)).fill('♥').join(' ')}
            </div>
          </div>
        </div>

        {/* Doctrine Ticker */}
        <div className="bg-amber-400 text-slate-950 p-3 rounded-xl border-2 border-black font-bold text-xs sm:text-sm flex items-center gap-2">
          <span className="font-mario text-[10px] bg-red-600 text-white px-2 py-0.5 rounded shrink-0">
            DOCTRINE
          </span>
          <span className="font-black truncate">{latestFact}</span>
        </div>

        {/* Canvas Viewport (Zero backdrop-filter over active Canvas2D) */}
        <div
          data-testid="game2d-viewport"
          className="relative rounded-2xl border-4 border-slate-950 overflow-hidden bg-slate-950 shadow-2xl h-[340px] sm:h-[380px]"
        >
          <canvas
            ref={canvasRef}
            width={760}
            height={380}
            className="w-full h-full block object-cover"
          />

          {gameState === 'start' && (
            <div className="absolute inset-0 bg-slate-950/88 flex flex-col items-center justify-center text-center p-6 space-y-4 text-white">
              <span className="font-mario text-amber-400 text-xs tracking-wider">
                STAGE 1-1 • VARIABLE JUMP ARCADE ENGINE
              </span>
              <h3 className="text-3xl sm:text-4xl font-black font-display text-white">
                SUPER MARIO LEGAL RUN
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md font-semibold leading-relaxed">
                Tap Jump for quick low hops or hold Jump for full high-arc leaps! Hit [?] blocks from underneath to unlock World 1–6 Labor Law doctrines and coins!
              </p>
              <button
                type="button"
                data-start="true"
                onClick={startGame}
                className="min-h-[48px] flex items-center gap-2 px-8 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_4px_0_#000] active:translate-y-0.5 text-sm sm:text-base cursor-pointer font-mario whitespace-nowrap"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>START RUN</span>
              </button>
            </div>
          )}

          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-red-950/92 flex flex-col items-center justify-center text-center p-6 space-y-4 text-white">
              <span className="font-mario text-amber-400 text-lg">GAME OVER</span>
              <p className="text-sm text-slate-200 font-bold tabular-nums">
                Final Score: {score} · Coins: {coins}
              </p>
              <button
                type="button"
                data-start="true"
                onClick={startGame}
                className="min-h-[48px] flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_4px_0_#000] cursor-pointer font-mario text-xs whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4" />
                <span>TRY AGAIN</span>
              </button>
            </div>
          )}

          {gameState === 'victory' && (
            <div className="absolute inset-0 bg-emerald-950/92 flex flex-col items-center justify-center text-center p-6 space-y-4 text-white">
              <span className="font-mario text-amber-300 text-xl">COURSE CLEARED!</span>
              <div className="bg-amber-400 text-slate-950 p-4 rounded-2xl border-3 border-black max-w-md space-y-1">
                <span className="font-black text-base sm:text-lg block">SUPER JURIS DOCTOR RANK!</span>
                <p className="text-xs sm:text-sm font-bold tabular-nums">
                  You cleared the course with {score} points! +20 Bonus Coins earned!
                </p>
              </div>
              <button
                type="button"
                data-start="true"
                onClick={startGame}
                className="min-h-[48px] flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_4px_0_#000] cursor-pointer font-mario text-xs whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4" />
                <span>PLAY AGAIN</span>
              </button>
            </div>
          )}
        </div>

        {/* Touch-Friendly Mobile & Virtual Controls (>= 48px tap targets) */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Move Left"
              onMouseDown={() => (keysRef.current.left = true)}
              onMouseUp={() => (keysRef.current.left = false)}
              onMouseLeave={() => (keysRef.current.left = false)}
              onTouchStart={(e) => {
                e.preventDefault();
                keysRef.current.left = true;
              }}
              onTouchEnd={() => (keysRef.current.left = false)}
              onTouchCancel={() => (keysRef.current.left = false)}
              className="min-h-[48px] min-w-[52px] p-3 bg-slate-800 active:bg-amber-400 active:text-black rounded-xl border-2 border-slate-600 font-black flex items-center justify-center cursor-pointer"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              aria-label="Move Right"
              onMouseDown={() => (keysRef.current.right = true)}
              onMouseUp={() => (keysRef.current.right = false)}
              onMouseLeave={() => (keysRef.current.right = false)}
              onTouchStart={(e) => {
                e.preventDefault();
                keysRef.current.right = true;
              }}
              onTouchEnd={() => (keysRef.current.right = false)}
              onTouchCancel={() => (keysRef.current.right = false)}
              className="min-h-[48px] min-w-[52px] p-3 bg-slate-800 active:bg-amber-400 active:text-black rounded-xl border-2 border-slate-600 font-black flex items-center justify-center cursor-pointer"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>

          <div className="text-xs text-slate-400 font-semibold hidden md:block">
            WASD / Arrows Move · Tap Space = Short Hop · Hold Space = High Jump
          </div>

          <button
            type="button"
            aria-label="Jump (Hold for High Jump)"
            onMouseDown={() => {
              keysRef.current.jumpJustPressed = true;
              keysRef.current.jumpHeld = true;
            }}
            onMouseUp={() => (keysRef.current.jumpHeld = false)}
            onMouseLeave={() => (keysRef.current.jumpHeld = false)}
            onTouchStart={(e) => {
              e.preventDefault();
              keysRef.current.jumpJustPressed = true;
              keysRef.current.jumpHeld = true;
            }}
            onTouchEnd={() => (keysRef.current.jumpHeld = false)}
            onTouchCancel={() => (keysRef.current.jumpHeld = false)}
            className="min-h-[48px] px-6 py-3 bg-amber-400 active:bg-amber-300 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_3px_0_#000] active:translate-y-0.5 flex items-center gap-1.5 cursor-pointer font-mario text-xs whitespace-nowrap"
          >
            <ArrowUp className="w-5 h-5 stroke-[3]" />
            <span>HOLD JUMP</span>
          </button>
        </div>
      </div>
    </div>
  );
};
