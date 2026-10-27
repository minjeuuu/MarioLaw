import React, { useRef, useEffect, useState } from 'react';
import { marioAudio } from '../utils/audio';
import { MarioAvatar } from '../types/laborLaw';
import { getHeroMeta } from '../data/heroesData';
import {
  stepKartArcadePhysics,
  KartArcadeState,
  DriftSparkTier,
} from '../utils/gamePhysics';
import { MarioCharacterAvatar, MarioCoinIcon } from './MarioIcons';
import { drawKartQuestion, KartQuestionItem } from '../utils/gameQuestionDeck';
import { Play, RotateCcw, Zap, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LaborKartProps {
  equippedAvatar: MarioAvatar;
  onEarnCoins: (amount: number) => void;
}

interface KartRival {
  id: string;
  name: string;
  character: MarioAvatar;
  distance: number;
  speed: number;
  x: number;
  color: string;
}

export const LaborKart: React.FC<LaborKartProps> = ({ equippedAvatar, onEarnCoins }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const initialAutoStart =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('autostart') === '1';

  const [gameState, setGameState] = useState<'menu' | 'racing' | 'question' | 'gameover' | 'victory'>(
    initialAutoStart ? 'racing' : 'menu'
  );
  const gameStateRef = useRef(gameState);
  const [currentLap, setCurrentLap] = useState<number>(1);
  const [position, setPosition] = useState<number>(2);
  const [speedMph, setSpeedMph] = useState<number>(0);
  const [driftTierHud, setDriftTierHud] = useState<DriftSparkTier>('none');
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<KartQuestionItem | null>(null);
  const [coinsGathered, setCoinsGathered] = useState<number>(0);
  const [engineClass, setEngineClass] = useState<'50cc' | '100cc' | '150cc'>('100cc');
  const engineClassRef = useRef(engineClass);
  const [inventoryItem, setInventoryItem] = useState<
    'mushroom' | 'star' | 'greenshell' | 'redshell' | 'banana' | null
  >('mushroom');

  useEffect(() => {
    engineClassRef.current = engineClass;
  }, [engineClass]);

  useEffect(() => {
    gameStateRef.current = gameState;
    if (typeof document !== 'undefined') {
      document.body.dataset.state =
        gameState === 'menu'
          ? 'title'
          : gameState === 'victory' || gameState === 'gameover'
          ? 'gameover'
          : 'playing';
    }
  }, [gameState]);

  const onEarnCoinsRef = useRef(onEarnCoins);
  useEffect(() => {
    onEarnCoinsRef.current = onEarnCoins;
  }, [onEarnCoins]);

  // Unified Keyboard & Touch Controls (including Drift Hold!)
  const keysRef = useRef<{
    left: boolean;
    right: boolean;
    accel: boolean;
    brake: boolean;
    driftHeld: boolean;
  }>({
    left: false,
    right: false,
    accel: false,
    brake: false,
    driftHeld: false,
  });

  const raceRef = useRef<{
    kart: KartArcadeState;
    invincibleRemaining: number;
    lap: number;
    lapLength: number;
    rivals: (KartRival & { spinout: number })[];
    itemBoxes: { dist: number; x: number; hit: boolean }[];
    coins: { dist: number; x: number; hit: boolean }[];
    totalCoins: number;
  }>({
    kart: {
      playerDist: 0,
      playerX: 0,
      playerSpeed: 0,
      steerVelocity: 0,
      isDrifting: false,
      driftDirection: 0,
      driftCharge: 0,
      driftSparkTier: 'none',
      hopProgress: 0,
      visualSlipAngle: 0,
      boostRemaining: 0,
      spinoutRemaining: 0,
    },
    invincibleRemaining: 0,
    lap: 1,
    lapLength: 3600,
    rivals: [
      { id: 'bowser', name: 'Bowser', character: 'bowser', distance: 100, speed: 15.0, x: 0.2, color: '#dc2626', spinout: 0 },
      { id: 'dk', name: 'Donkey Kong', character: 'donkeykong', distance: 50, speed: 14.5, x: -0.3, color: '#78350f', spinout: 0 },
      { id: 'wario', name: 'Wario', character: 'wario', distance: 20, speed: 14.0, x: 0.1, color: '#facc15', spinout: 0 },
    ],
    itemBoxes: [
      { dist: 600, x: -0.3, hit: false },
      { dist: 600, x: 0.3, hit: false },
      { dist: 1500, x: -0.4, hit: false },
      { dist: 1500, x: 0.4, hit: false },
      { dist: 2400, x: 0.0, hit: false },
      { dist: 3100, x: -0.2, hit: false },
      { dist: 3100, x: 0.2, hit: false },
    ],
    coins: [
      { dist: 300, x: -0.2, hit: false },
      { dist: 350, x: -0.2, hit: false },
      { dist: 1000, x: 0.2, hit: false },
      { dist: 1050, x: 0.2, hit: false },
      { dist: 1900, x: -0.1, hit: false },
      { dist: 1950, x: -0.1, hit: false },
      { dist: 2800, x: 0.3, hit: false },
    ],
    totalCoins: 0,
  });

  const handleStartRace = () => {
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    keysRef.current = { left: false, right: false, accel: false, brake: false, driftHeld: false };
    raceRef.current.kart = {
      playerDist: 0,
      playerX: 0,
      playerSpeed: 0,
      steerVelocity: 0,
      isDrifting: false,
      driftDirection: 0,
      driftCharge: 0,
      driftSparkTier: 'none',
      hopProgress: 0,
      visualSlipAngle: 0,
      boostRemaining: 0,
      spinoutRemaining: 0,
    };
    raceRef.current.lap = 1;
    raceRef.current.rivals[0].distance = 40;
    raceRef.current.rivals[1].distance = 25;
    raceRef.current.rivals[2].distance = 10;
    raceRef.current.rivals.forEach((r) => (r.spinout = 0));
    raceRef.current.itemBoxes.forEach((b) => (b.hit = false));
    raceRef.current.coins.forEach((c) => (c.hit = false));
    setCurrentLap(1);
    setDriftTierHud('none');
    setGameState('racing');
    marioAudio.playPowerUp();
  };

  const useInventoryItem = () => {
    if (!inventoryItem) return;
    const race = raceRef.current;

    if (inventoryItem === 'mushroom') {
      race.kart.boostRemaining = 140;
      setActiveItem('TURBO DASH MUSHROOM!');
      marioAudio.playDriftBoost('orange');
    } else if (inventoryItem === 'star') {
      race.invincibleRemaining = 220;
      race.kart.boostRemaining = 200;
      setActiveItem('INVINCIBLE STAR HYPERSPEED!');
      marioAudio.playStarTheme();
    } else if (inventoryItem === 'greenshell') {
      const ahead = race.rivals
        .filter((r) => r.distance > race.kart.playerDist)
        .sort((a, b) => a.distance - b.distance)[0];
      if (ahead) {
        ahead.spinout = 90;
        ahead.distance -= 60;
        setActiveItem(`GREEN SHELL SNIPED ${ahead.name.toUpperCase()}!`);
      } else {
        setActiveItem('GREEN SHELL LAUNCHED!');
      }
      marioAudio.playBowserHit();
    } else if (inventoryItem === 'redshell') {
      const leader = [...race.rivals].sort((a, b) => b.distance - a.distance)[0];
      if (leader && leader.distance > race.kart.playerDist) {
        leader.spinout = 120;
        leader.distance -= 100;
        setActiveItem(`RED SHELL HIT LEADER ${leader.name.toUpperCase()}!`);
      } else {
        setActiveItem('RED SHELL SECURED 1ST PLACE!');
      }
      marioAudio.playBowserHit();
    } else if (inventoryItem === 'banana') {
      const behind = race.rivals
        .filter((r) => r.distance < race.kart.playerDist)
        .sort((a, b) => b.distance - a.distance)[0];
      if (behind) {
        behind.spinout = 90;
        behind.distance -= 50;
      }
      setActiveItem('BANANA PEEL DROPPED BEHIND!');
      marioAudio.playPipe();
    }

    setInventoryItem(null);
  };

  useEffect(() => {
    const clearKeys = () => {
      keysRef.current = { left: false, right: false, accel: false, brake: false, driftHeld: false };
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStateRef.current === 'menu' && (e.code === 'Enter' || e.code === 'Space')) {
        e.preventDefault();
        handleStartRace();
        return;
      }
      if (['ArrowLeft', 'KeyA'].includes(e.code)) keysRef.current.left = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) keysRef.current.right = true;
      if (['ArrowUp', 'KeyW'].includes(e.code)) keysRef.current.accel = true;
      if (['ArrowDown', 'KeyS'].includes(e.code)) keysRef.current.brake = true;
      if (['ShiftLeft', 'ShiftRight', 'KeyE'].includes(e.code)) {
        keysRef.current.driftHeld = true;
      }
      if (e.code === 'Space' && gameStateRef.current === 'racing') {
        e.preventDefault();
        useInventoryItem();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) keysRef.current.left = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) keysRef.current.right = false;
      if (['ArrowUp', 'KeyW'].includes(e.code)) keysRef.current.accel = false;
      if (['ArrowDown', 'KeyS'].includes(e.code)) keysRef.current.brake = false;
      if (['ShiftLeft', 'ShiftRight', 'KeyE'].includes(e.code)) {
        keysRef.current.driftHeld = false;
      }
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
  }, [inventoryItem]);

  const triggerLaborQuestion = () => {
    setGameState('question');
    setActiveQuestion(drawKartQuestion());
    marioAudio.playQuestionBlock();
  };

  const handleAnswerQuestion = (selectedIdx: number) => {
    if (!activeQuestion) return;

    if (selectedIdx === activeQuestion.correctIndex) {
      raceRef.current.kart.boostRemaining = 150;
      setActiveItem(activeQuestion.boostReward);
      marioAudio.playDriftBoost('purple');
      onEarnCoinsRef.current(5);
      raceRef.current.totalCoins += 5;
      setCoinsGathered(raceRef.current.totalCoins);

      const items: ('mushroom' | 'star' | 'redshell' | 'greenshell')[] = [
        'mushroom',
        'star',
        'redshell',
        'greenshell',
      ];
      setInventoryItem(items[Math.floor(Math.random() * items.length)]);

      try {
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
      } catch {
        // ignore
      }
    } else {
      raceRef.current.kart.spinoutRemaining = 55;
      setActiveItem('SLIPPED ON OIL SLICK!');
      marioAudio.playBowserHit();
    }

    setGameState('racing');
    setActiveQuestion(null);
  };

  // Main 60 FPS Arcade Drift Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let lastTime = performance.now();
    let hudSyncCounter = 0;

    const loop = (now: number) => {
      const dtMs = Math.min(40, Math.max(8, now - lastTime));
      lastTime = now;
      const stepScale = dtMs / 16.6667;
      const race = raceRef.current;

      if (gameStateRef.current === 'racing') {
        const localCurve = Math.sin(race.kart.playerDist * 0.002) * 0.0065;
        const stepRes = stepKartArcadePhysics(
          race.kart,
          keysRef.current,
          engineClassRef.current,
          localCurve,
          stepScale
        );
        race.kart = stepRes.state;

        if (stepRes.didHopStart) {
          marioAudio.playJump();
        }
        if (stepRes.upgradedSparkTier && stepRes.upgradedSparkTier !== 'none') {
          marioAudio.playDriftSpark(stepRes.upgradedSparkTier);
        }
        if (stepRes.releasedBoostTier !== 'none') {
          marioAudio.playDriftBoost(stepRes.releasedBoostTier);
          const label =
            stepRes.releasedBoostTier === 'purple'
              ? 'ULTRA MINI-TURBO DRIFT BOOST!'
              : stepRes.releasedBoostTier === 'orange'
              ? 'SUPER MINI-TURBO DRIFT BOOST!'
              : 'MINI-TURBO DRIFT BOOST!';
          setActiveItem(label);
        }

        // Lap progression (3 Laps)
        const currentLapNum = Math.floor(race.kart.playerDist / race.lapLength) + 1;
        if (currentLapNum > race.lap) {
          race.lap = currentLapNum;
          setCurrentLap(currentLapNum);
          race.itemBoxes.forEach((b) => (b.hit = false));
          race.coins.forEach((c) => (c.hit = false));
          marioAudio.playOneUp();
          if (currentLapNum > 3) {
            setGameState('victory');
            marioAudio.playQuizComplete();
            onEarnCoinsRef.current(50);
          }
        }

        // Rivals rubberbanding
        const rivalBaseSpeed =
          engineClassRef.current === '50cc'
            ? 12.2
            : engineClassRef.current === '100cc'
            ? 14.5
            : 16.4;
        const myTotalDist = race.kart.playerDist;

        race.rivals.forEach((rival) => {
          if (rival.spinout > 0) {
            rival.spinout = Math.max(0, rival.spinout - stepScale);
            rival.distance += 4.0 * stepScale;
            return;
          }
          const distDiff = rival.distance - myTotalDist;
          let factor = 1.0;
          if (distDiff > 120) factor = 0.82;
          else if (distDiff < -140) factor = 1.08;
          rival.distance +=
            (rivalBaseSpeed * factor + Math.sin(myTotalDist * 0.001) * 0.4) * stepScale;
          rival.x = Math.max(-0.75, Math.min(0.75, rival.x + Math.sin(rival.distance * 0.01) * 0.004));
        });

        // Throttled HUD updates (~10Hz) so React never stalls 60fps Canvas
        hudSyncCounter += 1;
        if (hudSyncCounter % 6 === 0) {
          let place = 1;
          race.rivals.forEach((r) => {
            if (r.distance > myTotalDist) place += 1;
          });
          setPosition(place);
          setSpeedMph(Math.round(race.kart.playerSpeed * 4.2));
          setDriftTierHud(race.kart.driftSparkTier);
        }

        // Item Box & Coin Collisions
        const playerRelativeDist = race.kart.playerDist % race.lapLength;
        race.itemBoxes.forEach((box) => {
          if (
            !box.hit &&
            Math.abs(playerRelativeDist - box.dist) < 52 &&
            Math.abs(race.kart.playerX - box.x) < 0.32
          ) {
            box.hit = true;
            triggerLaborQuestion();
          }
        });

        race.coins.forEach((c) => {
          if (
            !c.hit &&
            Math.abs(playerRelativeDist - c.dist) < 52 &&
            Math.abs(race.kart.playerX - c.x) < 0.28
          ) {
            c.hit = true;
            race.totalCoins += 1;
            setCoinsGathered(race.totalCoins);
            onEarnCoinsRef.current(1);
            marioAudio.playCoin();
          }
        });
      }

      // RENDER PSEUDO-3D MODE-7 TRACK
      const w = canvas.width;
      const h = canvas.height;
      const kart = race.kart;

      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.45);
      skyGrad.addColorStop(0, '#0284c7');
      skyGrad.addColorStop(1, '#7dd3fc');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h * 0.45);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      const cloudOffset = (kart.playerDist * 0.05) % w;
      for (let i = -1; i <= 2; i++) {
        const cx = i * 280 + cloudOffset;
        ctx.beginPath();
        ctx.arc(cx, 40, 20, 0, Math.PI * 2);
        ctx.arc(cx + 25, 34, 25, 0, Math.PI * 2);
        ctx.arc(cx + 50, 40, 18, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.ellipse(w * 0.3, h * 0.45, w * 0.25, 45, 0, Math.PI, 0, true);
      ctx.fill();
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.ellipse(w * 0.75, h * 0.45, w * 0.35, 55, 0, Math.PI, 0, true);
      ctx.fill();

      const horizonY = h * 0.45;
      const roadBottomY = h;

      for (let y = horizonY; y < roadBottomY; y += 3) {
        const perspective = (y - horizonY) / (roadBottomY - horizonY);
        const curve =
          Math.sin((kart.playerDist + (1 - perspective) * 500) * 0.002) * (1 - perspective) * 125;

        const roadWidth = w * 0.15 + w * 0.65 * perspective;
        const roadCenterX = w * 0.5 + curve - kart.playerX * (w * 0.35) * perspective;

        const stripe = Math.sin(kart.playerDist * 0.05 + y * 0.15) > 0;
        ctx.fillStyle = stripe ? '#22c55e' : '#16a34a';
        ctx.fillRect(0, y, w, 3);

        const curbWidth = 14 * perspective + 4;
        ctx.fillStyle = stripe ? '#dc2626' : '#ffffff';
        ctx.fillRect(roadCenterX - roadWidth / 2 - curbWidth, y, curbWidth, 3);
        ctx.fillRect(roadCenterX + roadWidth / 2, y, curbWidth, 3);

        ctx.fillStyle = stripe ? '#334155' : '#1e293b';
        ctx.fillRect(roadCenterX - roadWidth / 2, y, roadWidth, 3);

        if (stripe) {
          ctx.fillStyle = '#facc15';
          const dashWidth = 8 * perspective + 2;
          ctx.fillRect(roadCenterX - dashWidth / 2, y, dashWidth, 3);
        }
      }

      const playerRel = kart.playerDist % race.lapLength;

      // Item Boxes
      race.itemBoxes.forEach((box) => {
        if (box.hit) return;
        const distFromPlayer = box.dist - playerRel;
        if (distFromPlayer > 0 && distFromPlayer < 1200) {
          const depth = 1 - distFromPlayer / 1200;
          const boxY = horizonY + (roadBottomY - horizonY) * (depth * depth);
          const roadWidth = w * 0.15 + w * 0.65 * depth;
          const curve =
            Math.sin((kart.playerDist + (1 - depth) * 500) * 0.002) * (1 - depth) * 125;
          const roadCenterX = w * 0.5 + curve - kart.playerX * (w * 0.35) * depth;
          const boxX = roadCenterX + box.x * (roadWidth / 2);
          const boxSize = 14 + 28 * depth;

          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(boxX - boxSize / 2, boxY - boxSize, boxSize, boxSize);
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2;
          ctx.strokeRect(boxX - boxSize / 2, boxY - boxSize, boxSize, boxSize);
          ctx.fillStyle = '#ffffff';
          ctx.font = `bold ${Math.max(10, Math.round(boxSize * 0.65))}px monospace`;
          ctx.fillText('?', boxX - boxSize * 0.22, boxY - boxSize * 0.25);
        }
      });

      // Road Coins
      race.coins.forEach((coin) => {
        if (coin.hit) return;
        const distFromPlayer = coin.dist - playerRel;
        if (distFromPlayer > 0 && distFromPlayer < 1200) {
          const depth = 1 - distFromPlayer / 1200;
          const coinY = horizonY + (roadBottomY - horizonY) * (depth * depth);
          const roadWidth = w * 0.15 + w * 0.65 * depth;
          const curve =
            Math.sin((kart.playerDist + (1 - depth) * 500) * 0.002) * (1 - depth) * 125;
          const roadCenterX = w * 0.5 + curve - kart.playerX * (w * 0.35) * depth;
          const coinX = roadCenterX + coin.x * (roadWidth / 2);
          const r = 6 + 12 * depth;

          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.ellipse(coinX, coinY - r, r * 0.72, r, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      // Rival Karts
      race.rivals.forEach((rival) => {
        const distFromPlayer = rival.distance - kart.playerDist;
        if (distFromPlayer > 0 && distFromPlayer < 1200) {
          const depth = 1 - distFromPlayer / 1200;
          const rivalY = horizonY + (roadBottomY - horizonY) * (depth * depth);
          const roadWidth = w * 0.15 + w * 0.65 * depth;
          const curve =
            Math.sin((kart.playerDist + (1 - depth) * 500) * 0.002) * (1 - depth) * 125;
          const roadCenterX = w * 0.5 + curve - kart.playerX * (w * 0.35) * depth;
          const rivalX = roadCenterX + rival.x * (roadWidth / 2);
          const kartScale = 0.5 + depth * 0.7;

          ctx.fillStyle = rival.color;
          ctx.fillRect(
            rivalX - 22 * kartScale,
            rivalY - 18 * kartScale,
            44 * kartScale,
            18 * kartScale
          );
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(
            rivalX - 26 * kartScale,
            rivalY - 12 * kartScale,
            8 * kartScale,
            14 * kartScale
          );
          ctx.fillRect(
            rivalX + 18 * kartScale,
            rivalY - 12 * kartScale,
            8 * kartScale,
            14 * kartScale
          );
          ctx.fillStyle = '#ffffff';
          ctx.font = `bold ${Math.max(9, Math.round(10 * kartScale))}px sans-serif`;
          ctx.fillText(rival.name, rivalX - 20 * kartScale, rivalY - 24 * kartScale);
        }
      });

      // Player Kart with Hop-into-Drift & Slip Angle Yaw
      const hopLift = Math.sin(kart.hopProgress * Math.PI) * 15;
      const playerScreenX = w * 0.5;
      const playerScreenY = h * 0.86 - hopLift;

      ctx.save();
      ctx.translate(playerScreenX, playerScreenY);
      ctx.rotate(kart.visualSlipAngle * 0.32);

      // Drift Tire Sparks (Blue -> Orange -> Purple Mini-Turbo!)
      if (kart.isDrifting && kart.driftSparkTier !== 'none') {
        const sparkColor =
          kart.driftSparkTier === 'purple'
            ? '#e879f9'
            : kart.driftSparkTier === 'orange'
            ? '#fb923c'
            : '#38bdf8';
        const sparkCore =
          kart.driftSparkTier === 'purple'
            ? '#f0abfc'
            : kart.driftSparkTier === 'orange'
            ? '#fde047'
            : '#e0f2fe';
        const sparkRadius =
          kart.driftSparkTier === 'purple' ? 16 : kart.driftSparkTier === 'orange' ? 13 : 9;

        [-36, 36].forEach((wheelX) => {
          ctx.fillStyle = sparkColor;
          ctx.beginPath();
          ctx.arc(wheelX, 20, sparkRadius + Math.sin(now * 0.04) * 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = sparkCore;
          ctx.beginPath();
          ctx.arc(wheelX, 20, sparkRadius * 0.5, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Exhaust Boost Flames
      if (kart.boostRemaining > 0) {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(-20, 16, 13 + Math.sin(now * 0.06) * 4, 0, Math.PI * 2);
        ctx.arc(20, 16, 13 + Math.cos(now * 0.06) * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(-20, 16, 7, 0, Math.PI * 2);
        ctx.arc(20, 16, 7, 0, Math.PI * 2);
        ctx.fill();
      }

      // Kart Wheels
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-44, 2, 16, 26);
      ctx.fillRect(28, 2, 16, 26);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-40, 8, 8, 14);
      ctx.fillRect(32, 8, 8, 14);

      // Kart Chassis
      const heroPalette = getHeroMeta(equippedAvatar);
      ctx.fillStyle = heroPalette.primaryColor;
      ctx.fillRect(-32, -6, 64, 28);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 3;
      ctx.strokeRect(-32, -6, 64, 28);

      // Rear Spoiler
      ctx.fillStyle = heroPalette.secondaryColor;
      ctx.fillRect(-36, 16, 72, 8);
      ctx.strokeRect(-36, 16, 72, 8);

      // Driver Head / Cap
      ctx.fillStyle = heroPalette.primaryColor;
      ctx.beginPath();
      ctx.arc(0, -22, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(-12, -18, 24, 12);
      ctx.fillStyle = '#451a03';
      ctx.fillRect(-10, -10, 20, 5);

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [equippedAvatar]);

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="bg-[#1e293b] rounded-3xl p-4 sm:p-5 border-4 border-slate-950 shadow-[6px_6px_0_#000] text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-slate-700 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-amber-400 rounded-xl border-2 border-black flex items-center justify-center shrink-0">
              <MarioCharacterAvatar character={equippedAvatar} className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider font-mario block">
                DRIFT-BOOST ARCADE KART ENGINE
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-display">
                MUSHROOM CIRCUIT GP
              </h2>
            </div>
          </div>

          {/* Race Readout Strip */}
          <div className="flex items-center gap-2 sm:gap-3.5 bg-slate-900 px-3.5 py-2 rounded-2xl border-2 border-slate-700 flex-wrap w-full sm:w-auto justify-between sm:justify-start tabular-nums">
            <div className="flex items-center gap-1 font-mario text-[10px] sm:text-xs text-amber-300">
              <MarioCoinIcon className="w-4 h-4 shrink-0" />
              <span>x{coinsGathered.toString().padStart(2, '0')}</span>
            </div>
            <div className="font-mario text-[10px] sm:text-xs text-white">
              LAP <span className="text-emerald-400">{Math.min(3, currentLap)}/3</span>
            </div>
            <div className="font-mario text-[10px] sm:text-xs text-amber-400">
              POS{' '}
              <span className={position === 1 ? 'text-emerald-400' : 'text-amber-300'}>
                {position === 1 ? '1ST' : position === 2 ? '2ND' : position === 3 ? '3RD' : '4TH'}
              </span>
            </div>
            <div className="font-mario text-[10px] sm:text-xs text-cyan-300">{speedMph} MPH</div>
            {driftTierHud !== 'none' && (
              <div
                className={`font-mario text-[10px] px-2 py-0.5 rounded border border-black font-black ${
                  driftTierHud === 'purple'
                    ? 'bg-fuchsia-400 text-slate-950'
                    : driftTierHud === 'orange'
                    ? 'bg-orange-400 text-slate-950'
                    : 'bg-sky-400 text-slate-950'
                }`}
              >
                {driftTierHud.toUpperCase()} SPARK
              </div>
            )}
          </div>
        </div>

        {activeItem && (
          <div className="mt-3 bg-amber-400 text-slate-950 px-3 py-1.5 rounded-xl border-2 border-black font-mario text-xs flex items-center justify-between">
            <span className="flex items-center gap-1.5 truncate">
              <Zap className="w-4 h-4 fill-current text-red-600 shrink-0" />
              <span className="truncate">{activeItem}</span>
            </span>
            <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-bold shrink-0">
              BOOST
            </span>
          </div>
        )}

        {/* Canvas Viewport (Zero backdrop-filter over Canvas2D) */}
        <div
          data-testid="laborkart-viewport"
          className="relative mt-4 rounded-2xl border-4 border-slate-950 overflow-hidden bg-slate-950 shadow-2xl h-[340px] sm:h-[410px]"
        >
          <canvas
            ref={canvasRef}
            width={760}
            height={420}
            className="w-full h-full block object-cover"
          />

          {gameState === 'menu' && (
            <div className="absolute inset-0 bg-slate-950/88 flex flex-col items-center justify-center text-center p-6 space-y-4 text-white">
              <span className="font-mario text-amber-400 text-xs tracking-wider">
                ARCADE DRIFT &amp; MINI-TURBO EDITION
              </span>
              <h3 className="text-3xl sm:text-4xl font-black font-display text-white">
                LABOR KART GP
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md font-semibold leading-relaxed">
                Hold Shift / E (or DRIFT button) while steering into corners to hop, slide, and charge Blue, Orange, and Purple Mini-Turbo sparks! Release Drift to rocket ahead!
              </p>
              <button
                type="button"
                data-start="true"
                onClick={handleStartRace}
                className="min-h-[48px] flex items-center gap-2 px-8 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_4px_0_#000] active:translate-y-0.5 text-sm sm:text-base cursor-pointer font-mario whitespace-nowrap"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>START RACE</span>
              </button>
            </div>
          )}

          {gameState === 'question' && activeQuestion && (
            <div className="absolute inset-0 bg-slate-950/92 flex flex-col items-center justify-center p-4 sm:p-5 text-white z-30 overflow-y-auto">
              <div className="bg-slate-900 border-4 border-amber-400 rounded-3xl p-4 sm:p-6 max-w-lg w-full space-y-3.5 shadow-2xl">
                <div className="flex items-center justify-between border-b-2 border-slate-700 pb-2">
                  <span className="text-amber-400 font-mario text-xs sm:text-sm">
                    [ ? ] ITEM BOX CHALLENGE
                  </span>
                  <span className="text-[10px] bg-red-600 text-white font-black px-2 py-0.5 rounded font-mario">
                    TURBO ITEM
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-amber-400 font-mario uppercase block">
                    REWARD: {activeQuestion.boostReward}
                  </span>
                  <p className="text-xs sm:text-base font-extrabold text-white leading-snug">
                    {activeQuestion.question}
                  </p>
                </div>

                <div className="space-y-2">
                  {activeQuestion.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleAnswerQuestion(oIdx)}
                      className="min-h-[44px] w-full text-left p-2.5 sm:p-3 rounded-xl bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-white text-xs sm:text-sm font-bold border-2 border-slate-600 transition-colors flex items-center gap-2.5 cursor-pointer"
                    >
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-black text-amber-400 text-xs font-black font-mario shrink-0">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {gameState === 'victory' && (
            <div className="absolute inset-0 bg-emerald-950/92 flex flex-col items-center justify-center text-center p-6 space-y-4 text-white">
              <Trophy className="w-14 h-14 text-amber-300" />
              <h3 className="text-2xl sm:text-4xl font-black font-display text-white">
                1ST PLACE GRAND PRIX CHAMPION!
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 font-bold max-w-md">
                You carved every drift corner and mastered the Labor Law item boxes! +50 Mario Coins earned!
              </p>
              <button
                type="button"
                data-start="true"
                onClick={handleStartRace}
                className="min-h-[48px] flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_4px_0_#000] cursor-pointer font-mario text-xs whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4" />
                <span>RACE AGAIN</span>
              </button>
            </div>
          )}
        </div>

        {/* Touch-Friendly Mobile & Virtual Drift Controls (>= 44px tap targets) */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onMouseDown={() => (keysRef.current.left = true)}
              onMouseUp={() => (keysRef.current.left = false)}
              onMouseLeave={() => (keysRef.current.left = false)}
              onTouchStart={(e) => {
                e.preventDefault();
                keysRef.current.left = true;
              }}
              onTouchEnd={() => (keysRef.current.left = false)}
              onTouchCancel={() => (keysRef.current.left = false)}
              aria-label="Steer Left"
              className="min-h-[46px] px-3.5 py-2.5 bg-slate-800 active:bg-amber-400 active:text-black rounded-xl border-2 border-slate-600 font-black font-mario text-[10px] sm:text-xs whitespace-nowrap cursor-pointer"
            >
              ◀ LEFT
            </button>
            <button
              type="button"
              onMouseDown={() => (keysRef.current.right = true)}
              onMouseUp={() => (keysRef.current.right = false)}
              onMouseLeave={() => (keysRef.current.right = false)}
              onTouchStart={(e) => {
                e.preventDefault();
                keysRef.current.right = true;
              }}
              onTouchEnd={() => (keysRef.current.right = false)}
              onTouchCancel={() => (keysRef.current.right = false)}
              aria-label="Steer Right"
              className="min-h-[46px] px-3.5 py-2.5 bg-slate-800 active:bg-amber-400 active:text-black rounded-xl border-2 border-slate-600 font-black font-mario text-[10px] sm:text-xs whitespace-nowrap cursor-pointer"
            >
              RIGHT ▶
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-semibold hidden lg:block">
            WASD/Arrows Steer &amp; Gas · Hold Shift/E = Hop &amp; Drift Spark · Space = Item
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {inventoryItem && (
              <button
                type="button"
                onClick={useInventoryItem}
                aria-label={`Use ${inventoryItem}`}
                className="min-h-[46px] px-3.5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_3px_0_#000] active:translate-y-0.5 font-mario text-[10px] cursor-pointer whitespace-nowrap"
              >
                ★ {inventoryItem.toUpperCase()}
              </button>
            )}

            <button
              type="button"
              onMouseDown={() => (keysRef.current.driftHeld = true)}
              onMouseUp={() => (keysRef.current.driftHeld = false)}
              onMouseLeave={() => (keysRef.current.driftHeld = false)}
              onTouchStart={(e) => {
                e.preventDefault();
                keysRef.current.driftHeld = true;
              }}
              onTouchEnd={() => (keysRef.current.driftHeld = false)}
              onTouchCancel={() => (keysRef.current.driftHeld = false)}
              aria-label="Hold to Drift and Charge Mini-Turbo"
              className="min-h-[46px] px-4 py-2.5 bg-sky-400 hover:bg-sky-300 active:bg-fuchsia-400 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_3px_0_#000] active:translate-y-0.5 font-mario text-[10px] sm:text-xs cursor-pointer whitespace-nowrap"
            >
              DRIFT ⚡
            </button>

            <button
              type="button"
              onMouseDown={() => (keysRef.current.accel = true)}
              onMouseUp={() => (keysRef.current.accel = false)}
              onMouseLeave={() => (keysRef.current.accel = false)}
              onTouchStart={(e) => {
                e.preventDefault();
                keysRef.current.accel = true;
              }}
              onTouchEnd={() => (keysRef.current.accel = false)}
              onTouchCancel={() => (keysRef.current.accel = false)}
              aria-label="Accelerate"
              className="min-h-[46px] px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_3px_0_#000] active:translate-y-0.5 font-mario text-[10px] sm:text-xs cursor-pointer whitespace-nowrap"
            >
              GAS ▲
            </button>
          </div>
        </div>

        {/* Engine Class Selector Bar */}
        <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap text-xs">
          <span className="text-[10px] font-black uppercase text-slate-400 font-mario">
            ENGINE CLASS:
          </span>
          <div className="flex items-center gap-1.5">
            {(['50cc', '100cc', '150cc'] as const).map((cc) => (
              <button
                key={cc}
                type="button"
                onClick={() => {
                  setEngineClass(cc);
                  marioAudio.playCoin();
                }}
                className={`min-h-[38px] px-3 py-1 rounded-lg font-mario text-[10px] font-black border transition-colors cursor-pointer whitespace-nowrap ${
                  engineClass === cc
                    ? 'bg-amber-400 text-slate-950 border-black shadow-[0_2px_0_#000]'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                {cc}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
