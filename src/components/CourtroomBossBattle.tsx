import React, { useState } from 'react';
import { MarioAvatar } from '../types/laborLaw';
import { getHeroMeta } from '../data/heroesData';
import {
  MarioCharacterAvatar,
  MarioCoinIcon,
  MarioFireFlowerIcon,
  MarioStarIcon,
  MarioMushroomIcon,
  MarioBowserIcon,
  MarioFireballIcon,
} from './MarioIcons';
import { marioAudio } from '../utils/audio';
import {
  Shield,
  Zap,
  RotateCcw,
  Trophy,
  Scale,
  Hammer,
  AlertTriangle,
  Flame,
  Heart,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  drawBowserCourtroomAttack,
  CourtroomBowserAttackItem,
} from '../utils/gameQuestionDeck';

interface CourtroomBossBattleProps {
  equippedAvatar: MarioAvatar;
  onEarnCoins: (amount: number) => void;
}

interface BattleMove {
  id: string;
  name: string;
  lawBasis: string;
  type: 'attack' | 'defense' | 'ultimate';
  damage: number;
  heal: number;
  description: string;
  icon: React.ReactNode;
}

interface BowserAttack {
  id: string;
  title: string;
  dialogue: string;
  damage: number;
  weakness: string;
}

const PLAYER_MOVES: BattleMove[] = [
  {
    id: 'fireball_8hr',
    name: 'Art. 83 8-Hour Fireball',
    lawBasis: 'Labor Code Article 83 & 87',
    type: 'attack',
    damage: 35,
    heal: 0,
    description: 'Hurls a blazing statutory fireball against excessive hours and unpaid overtime!',
    icon: <Flame className="w-5 h-5 text-orange-500" />,
  },
  {
    id: 'maternity_hammer',
    name: 'R.A. 11210 Maternity Hammer',
    lawBasis: '105-Day Expanded Maternity Leave',
    type: 'attack',
    damage: 45,
    heal: 0,
    description: 'Smashes unfair termination with the full force of 105 days paid maternity protection!',
    icon: <Hammer className="w-5 h-5 text-pink-500" />,
  },
  {
    id: 'star_shield',
    name: 'Art. 113 Non-Diminution Shield',
    lawBasis: 'Art. 113 Authorized Deductions & Art. 100',
    type: 'defense',
    damage: 10,
    heal: 30,
    description: 'Deploys an invincibility barrier against illegal deductions and restores 30 HP!',
    icon: <Shield className="w-5 h-5 text-amber-400" />,
  },
  {
    id: 'dole_stomp',
    name: 'DOLE D.O. 174 Ultra Stomp',
    lawBasis: 'D.O. 174-17 Labor-Only Contracting Ban',
    type: 'ultimate',
    damage: 65,
    heal: 0,
    description: 'Delivers a devastating DOLE compliance order smashing sham fly-by-night subcontractors!',
    icon: <Zap className="w-5 h-5 text-yellow-400" />,
  },
];

export const CourtroomBossBattle: React.FC<CourtroomBossBattleProps> = ({
  equippedAvatar,
  onEarnCoins,
}) => {
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [bowserHp, setBowserHp] = useState<number>(200);
  const [turn, setTurn] = useState<'player' | 'bowser' | 'gameover' | 'victory'>('player');
  const [battleLog, setBattleLog] = useState<string[]>([
    'Bowser takes the stand as Employer! Object to his labor violations with statutory motions!',
  ]);
  const [lastBowserAttack, setLastBowserAttack] = useState<CourtroomBowserAttackItem | null>(null);
  const [comboCount, setComboCount] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const heroMeta = getHeroMeta(equippedAvatar);

  const handlePlayerMove = (move: BattleMove) => {
    if (turn !== 'player' || isAnimating) return;
    setIsAnimating(true);

    // Check if counter move matches Bowser's weakness
    const isCritical = lastBowserAttack && lastBowserAttack.weakness === move.id;
    const finalDamage = isCritical ? Math.round(move.damage * 1.5) : move.damage;

    // Apply sounds
    if (move.type === 'defense') {
      marioAudio.playPowerUp();
    } else if (move.type === 'ultimate') {
      marioAudio.playFireball();
      marioAudio.playFanfare();
    } else {
      marioAudio.playJump();
    }

    const nextBowserHp = Math.max(0, bowserHp - finalDamage);
    const nextPlayerHp = Math.min(100, playerHp + move.heal);

    setBowserHp(nextBowserHp);
    setPlayerHp(nextPlayerHp);

    const logEntry = isCritical
      ? `CRITICAL LEGAL HIT! ${heroMeta.name} used ${move.name} for ${finalDamage} DMG! Countered Bowser's violation!`
      : `${heroMeta.name} executed ${move.name}! (${finalDamage} DMG${move.heal > 0 ? `, +${move.heal} HP` : ''})`;

    setBattleLog((prev) => [logEntry, ...prev.slice(0, 5)]);

    if (nextBowserHp <= 0) {
      setTimeout(() => {
        setTurn('victory');
        setIsAnimating(false);
        marioAudio.playQuizComplete();
        onEarnCoins(75);
        try {
          confetti({ particleCount: 80, spread: 100, origin: { y: 0.6 } });
        } catch {
          // ignore
        }
      }, 700);
      return;
    }

    // Bowser's Turn
    setTurn('bowser');
    setTimeout(() => {
      executeBowserTurn(nextPlayerHp);
    }, 1200);
  };

  const executeBowserTurn = (currentPlayerHp: number) => {
    const randomAttack = drawBowserCourtroomAttack();
    setLastBowserAttack(randomAttack);

    marioAudio.playBowserHit();

    const nextPlayerHp = Math.max(0, currentPlayerHp - randomAttack.damage);
    setPlayerHp(nextPlayerHp);

    setBattleLog((prev) => [
      `Bowser unleashes ${randomAttack.title} (-${randomAttack.damage} HP)! "${randomAttack.dialogue}"`,
      ...prev.slice(0, 5),
    ]);

    if (nextPlayerHp <= 0) {
      setTimeout(() => {
        setTurn('gameover');
        setIsAnimating(false);
        marioAudio.playPipe();
      }, 700);
      return;
    }

    setTimeout(() => {
      setTurn('player');
      setIsAnimating(false);
    }, 800);
  };

  const handleRestart = () => {
    setPlayerHp(100);
    setBowserHp(200);
    setTurn('player');
    setLastBowserAttack(null);
    setComboCount(0);
    setIsAnimating(false);
    setBattleLog(['Bowser takes the stand as Employer! Object to his labor violations with statutory motions!']);
    marioAudio.playCoin();
  };

  return (
    <div className="bg-slate-900 border-4 border-slate-950 rounded-3xl p-4 sm:p-6 text-white space-y-6 shadow-[6px_6px_0_#000]">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-600 rounded-2xl border-2 border-black flex items-center justify-center shadow-[0_3px_0_#000]">
            <Scale className="w-7 h-7 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-red-400 font-mario">
                COURTROOM BOSS BATTLE
              </span>
              <span className="text-xs bg-red-950 text-red-300 border border-red-700 px-2 py-0.5 rounded font-mono font-bold">
                PH LABOR STANDARDS TRIBUNAL
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display">
              LEGAL COUNSEL VS. EMPLOYER BOWSER
            </h2>
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="h-9 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border-2 border-slate-700 rounded-xl font-black text-xs inline-flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Trial</span>
        </button>
      </div>

      {/* Arena Stage: Player vs Bowser */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-4 sm:p-6 rounded-2xl border-3 border-slate-800">
        {/* Player Side */}
        <div className="space-y-3 bg-slate-900/90 p-4 rounded-xl border-2 border-emerald-600/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-amber-400 rounded-xl border-2 border-black flex items-center justify-center shrink-0">
                <MarioCharacterAvatar character={equippedAvatar} className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-black text-amber-300 font-display block">
                  {heroMeta.name}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Lead Labor Counsel</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-emerald-400 font-mono tabular-nums">
                {playerHp} / 100 HP
              </span>
            </div>
          </div>

          {/* Player HP Bar */}
          <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden border border-slate-700 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                playerHp > 50 ? 'bg-emerald-500' : playerHp > 25 ? 'bg-amber-400' : 'bg-red-500'
              }`}
              style={{ width: `${Math.max(0, playerHp)}%` }}
            />
          </div>
        </div>

        {/* Bowser Boss Side */}
        <div className="space-y-3 bg-slate-900/90 p-4 rounded-xl border-2 border-red-600/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-red-600 rounded-xl border-2 border-black flex items-center justify-center shrink-0">
                <MarioBowserIcon className="w-7 h-7 text-amber-300" />
              </div>
              <div>
                <span className="text-xs font-black text-red-400 font-display block">
                  Employer Bowser
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Managing Director, Koopa Corp</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-red-400 font-mono tabular-nums">
                {bowserHp} / 200 HP
              </span>
            </div>
          </div>

          {/* Bowser HP Bar */}
          <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden border border-slate-700 p-0.5">
            <div
              className="h-full bg-red-600 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(0, (bowserHp / 200) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Battle Announcement & Dialogue Card */}
      {lastBowserAttack && turn === 'player' && (
        <div className="bg-amber-950/40 border-2 border-amber-500/80 p-3.5 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase text-amber-300 font-mario">
              ACTIVE BOWSER CHARGE:
            </span>
            <p className="text-sm font-black text-white">{lastBowserAttack.title}</p>
            <p className="text-xs text-amber-200/90 italic">&quot;{lastBowserAttack.dialogue}&quot;</p>
          </div>
        </div>
      )}

      {/* Victory / Defeat Overlay Screens */}
      {turn === 'victory' && (
        <div className="bg-emerald-950 border-3 border-emerald-400 rounded-2xl p-6 text-center space-y-4">
          <div className="inline-flex p-3 bg-emerald-500 rounded-2xl border-2 border-black shadow">
            <Trophy className="w-10 h-10 text-slate-950" />
          </div>
          <h3 className="text-2xl font-black text-white font-display">
            COURT DECISION: SUMMARY JUDGMENT FOR LABOR!
          </h3>
          <p className="text-sm font-semibold text-emerald-200 max-w-lg mx-auto">
            Bowser has been held fully liable for unfair labor practices, illegal deductions, and overtime violations! You earned +75 Mario Coins!
          </p>
          <button
            onClick={handleRestart}
            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-2 border-black cursor-pointer shadow-[0_3px_0_#000]"
          >
            Play Next Trial
          </button>
        </div>
      )}

      {turn === 'gameover' && (
        <div className="bg-red-950 border-3 border-red-500 rounded-2xl p-6 text-center space-y-4">
          <h3 className="text-2xl font-black text-white font-display">
            CASE DISMISSED: OUT OF HEALTH!
          </h3>
          <p className="text-sm font-semibold text-red-200 max-w-lg mx-auto">
            Bowser overwhelmed your legal defenses! Review your labor standards and re-file your motion!
          </p>
          <button
            onClick={handleRestart}
            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-2 border-black cursor-pointer shadow-[0_3px_0_#000]"
          >
            Retry Court Battle
          </button>
        </div>
      )}

      {/* Action Command Moves Grid */}
      {turn === 'player' && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-amber-400 font-mario">
              CHOOSE YOUR STATUTORY COUNTER-MOVE:
            </span>
            <span className="text-[11px] font-bold text-slate-400">
              Matching Bowser&apos;s weakness deals +50% Critical Damage!
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PLAYER_MOVES.map((move) => {
              const isRecommended = lastBowserAttack?.weakness === move.id;
              return (
                <button
                  key={move.id}
                  onClick={() => handlePlayerMove(move)}
                  disabled={isAnimating}
                  className={`p-3.5 rounded-2xl border-3 text-left transition-all cursor-pointer relative flex flex-col justify-between gap-2 ${
                    isRecommended
                      ? 'bg-amber-500/20 border-amber-400 hover:bg-amber-500/30 shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                      : 'bg-slate-800/90 border-slate-700 hover:bg-slate-700/90'
                  }`}
                >
                  {isRecommended && (
                    <span className="absolute -top-2.5 right-3 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-[9px] font-black font-mario border border-black uppercase">
                      CRITICAL COUNTER!
                    </span>
                  )}
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-slate-900 rounded-xl border border-slate-700">
                      {move.icon}
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-white font-display leading-tight">
                        {move.name}
                      </h4>
                      <span className="text-[10px] text-amber-300 font-mono font-bold block">
                        {move.lawBasis}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 font-medium leading-snug">
                    {move.description}
                  </p>
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-700/60 text-[11px] font-bold font-mono">
                    <span className="text-red-400">⚔️ {move.damage} DMG</span>
                    {move.heal > 0 && <span className="text-emerald-400">💚 +{move.heal} HP</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Live Courtroom Battle Log */}
      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
        <span className="text-[10px] font-black uppercase text-slate-400 font-mario block">
          OFFICIAL COURT TRANSCRIPT:
        </span>
        <div className="space-y-1 max-h-24 overflow-y-auto no-scrollbar font-mono text-xs">
          {battleLog.map((log, idx) => (
            <p
              key={idx}
              className={idx === 0 ? 'text-amber-300 font-bold' : 'text-slate-400 text-[11px]'}
            >
              › {log}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
