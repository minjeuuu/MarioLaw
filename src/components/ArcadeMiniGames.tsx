import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { MarioAvatar } from '../types/laborLaw';
import { getHeroMeta } from '../data/heroesData';
import { marioAudio } from '../utils/audio';
import {
  MarioCharacterAvatar,
  MarioCoinIcon,
  MarioStarIcon,
  MarioBowserIcon,
  MarioFireballIcon,
  MarioAxeIcon,
  MarioQuestionBlockIcon,
} from './MarioIcons';
import {
  Play,
  RotateCcw,
  Hammer,
  Grid,
  ShieldCheck,
  ShieldAlert,
  Flame,
  Trophy,
  Clock,
  Heart,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowDown,
} from 'lucide-react';
import {
  drawGoombaTargets,
  drawMultiplierMemoryPairs,
  drawContractorDockets,
  drawBridgePuzzle,
  drawPayrollCapsules,
  DeductionPipeTargetItem,
  ContractorDocketItem,
  BridgeDoctrineItem,
  PayrollCapsuleItem,
} from '../utils/gameQuestionDeck';

interface MiniGameProps {
  equippedAvatar: MarioAvatar;
  onEarnCoins: (amount: number) => void;
}

/* ============================================================================
   GAME 4: WHACK-A-GOOMBA: ILLEGAL DEDUCTION SMASHER (Art. 113-116)
   ============================================================================ */
export const WhackAGoombaGame: React.FC<MiniGameProps> = ({ equippedAvatar, onEarnCoins }) => {
  const hero = getHeroMeta(equippedAvatar);
  const [phase, setPhase] = useState<'title' | 'playing' | 'done'>('title');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(35);
  const [activePipes, setActivePipes] = useState<(DeductionPipeTargetItem | null)[]>(Array(9).fill(null));
  const [feedback, setFeedback] = useState<string>('Smash RED Goombas (Illegal Practices) — Spare GREEN Toads (Lawful Art. 113 Deductions)!');

  useEffect(() => {
    if (phase !== 'playing') return;

    const spawnInterval = setInterval(() => {
      setActivePipes(() => {
        const next: (DeductionPipeTargetItem | null)[] = Array(9).fill(null);
        const count = 2 + Math.floor(Math.random() * 2);
        const chosenIndices = new Set<number>();
        while (chosenIndices.size < count) {
          chosenIndices.add(Math.floor(Math.random() * 9));
        }
        const drawnTargets = drawGoombaTargets(count);
        Array.from(chosenIndices).forEach((pipeIdx, idx) => {
          next[pipeIdx] = drawnTargets[idx] ?? null;
        });
        return next;
      });
    }, 1450);

    const clockInterval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setPhase('done');
          marioAudio.playQuizComplete();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(clockInterval);
    };
  }, [phase]);

  const startRound = () => {
    setScore(0);
    setLives(3);
    setTimeLeft(35);
    setActivePipes(Array(9).fill(null));
    setFeedback('Smash Illegal Deductions! Do NOT hit Lawful Statutory Deductions!');
    setPhase('playing');
    marioAudio.playPowerUp();
  };

  const handleWhack = (idx: number) => {
    const target = activePipes[idx];
    if (!target || phase !== 'playing') return;

    const updated = [...activePipes];
    updated[idx] = null;
    setActivePipes(updated);

    if (target.isIllegal) {
      setScore((s) => s + 150);
      onEarnCoins(2);
      setFeedback(`SMASHED! +2 Coins — ${target.ruleNote}`);
      marioAudio.playStomp();
      marioAudio.playCoin();
    } else {
      setFeedback(`OOPS! That was LAWFUL: ${target.ruleNote}`);
      marioAudio.playBowserHit();
      setLives((l) => {
        const nextL = l - 1;
        if (nextL <= 0) setPhase('done');
        return nextL;
      });
    }
  };

  return (
    <div className="bg-[#1e293b] rounded-3xl mario-card border-4 border-slate-950 p-4 sm:p-6 text-white space-y-4 max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-700 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-amber-400 rounded-xl border-2 border-black flex items-center justify-center shrink-0">
            <MarioCharacterAvatar character={equippedAvatar} className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-amber-400 font-mario block">
              ARTICLES 102 & 112–116 • {hero.name.toUpperCase()}
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-display text-white">
              WHACK-A-GOOMBA: DEDUCTION SMASHER
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-900 px-3.5 py-2 rounded-xl border-2 border-slate-700 tabular-nums">
          <span className="font-mario text-xs text-amber-300 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {timeLeft}s
          </span>
          <span className="font-mario text-xs text-emerald-400">PTS: {score}</span>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3].map((h) => (
              <Heart
                key={h}
                className={`w-4 h-4 ${h <= lives ? 'text-rose-500 fill-rose-500' : 'text-slate-600'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-amber-400 text-slate-950 px-3.5 py-2.5 rounded-xl border-2 border-black font-bold text-xs sm:text-sm flex items-center gap-2">
        <Hammer className="w-4 h-4 shrink-0 text-red-700" />
        <span className="truncate">{feedback}</span>
      </div>

      {phase === 'title' && (
        <div className="bg-slate-900 rounded-2xl border-3 border-black p-8 text-center space-y-4">
          <Hammer className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="text-2xl sm:text-3xl font-black font-display">SMASH ILLEGAL WAGE DEDUCTIONS!</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto font-semibold">
            Goombas pop out of 9 Warp Pipes carrying illegal wage deductions (cashier reserves without hearing, forced grocery cuts, undertime offsets). Smash them for +2 Coins, and spare green lawful Art. 113 deductions!
          </p>
          <button
            type="button"
            onClick={startRound}
            className="h-11 px-8 inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_4px_0_#000] cursor-pointer font-mario text-xs leading-none whitespace-nowrap"
          >
            <Play className="w-4 h-4 fill-current shrink-0" />
            <span>START SMASHING</span>
          </button>
        </div>
      )}

      {phase === 'playing' && (
        <div className="grid grid-cols-3 gap-3 sm:gap-4 bg-slate-950 p-4 rounded-2xl border-3 border-black">
          {activePipes.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleWhack(idx)}
              className={`h-32 sm:h-36 rounded-2xl border-3 border-black p-2.5 flex flex-col items-center justify-between transition-all cursor-pointer ${
                item
                  ? item.isIllegal
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_4px_0_#000] -translate-y-1'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_4px_0_#000] -translate-y-1'
                  : 'bg-slate-900 text-slate-500'
              }`}
            >
              {item ? (
                <>
                  <span className="text-[9px] font-black font-mario uppercase px-2 py-0.5 rounded bg-black/40">
                    {item.isIllegal ? 'SMASH GOOMBA!' : 'LAWFUL • SPARE!'}
                  </span>
                  <span className="text-xs sm:text-sm font-black leading-snug text-center line-clamp-3">
                    {item.label}
                  </span>
                  <div className="w-full h-3 mario-green-pipe rounded-md" />
                </>
              ) : (
                <>
                  <span className="text-[10px] font-mario text-slate-600 mt-3">PIPE {idx + 1}</span>
                  <div className="w-full h-6 mario-green-pipe rounded-lg" />
                </>
              )}
            </button>
          ))}
        </div>
      )}

      {phase === 'done' && (
        <div className="bg-slate-900 rounded-2xl border-3 border-amber-400 p-8 text-center space-y-4">
          <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="text-2xl font-black font-display text-amber-300">SHIFT COMPLETE!</h3>
          <p className="text-sm font-bold text-slate-200">
            Final Deduction Audit Score: <span className="text-emerald-400 font-black">{score} PTS</span>
          </p>
          <button
            type="button"
            onClick={startRound}
            className="h-11 px-7 inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_4px_0_#000] cursor-pointer font-mario text-xs leading-none whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4 shrink-0" />
            <span>PLAY AGAIN</span>
          </button>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
   GAME 5: MARIO PARTY: MULTIPLIER MEMORY MATCH (16 Flipping [?] Blocks)
   ============================================================================ */
interface MemoryCard {
  uid: string;
  pairId: string;
  text: string;
  kind: 'scenario' | 'rate';
}

const MEMORY_PAIR_COUNT = 8;

export const MultiplierMemoryGame: React.FC<MiniGameProps> = ({ equippedAvatar, onEarnCoins }) => {
  const [deck, setDeck] = useState<MemoryCard[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const lockRef = useRef(false);

  const initDeck = () => {
    const selectedPairs = drawMultiplierMemoryPairs(MEMORY_PAIR_COUNT);
    const raw: MemoryCard[] = [];
    selectedPairs.forEach((p) => {
      raw.push({ uid: `${p.id}-s`, pairId: p.id, text: p.scenario, kind: 'scenario' });
      raw.push({ uid: `${p.id}-r`, pairId: p.id, text: p.rate, kind: 'rate' });
    });
    for (let i = raw.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [raw[i], raw[j]] = [raw[j], raw[i]];
    }
    setDeck(raw);
    setFlipped([]);
    setMatchedPairIds([]);
    setMoves(0);
    lockRef.current = false;
  };

  useEffect(() => {
    initDeck();
  }, []);

  const handleCardFlip = (idx: number) => {
    if (lockRef.current) return;
    if (flipped.includes(idx)) return;
    const card = deck[idx];
    if (!card || matchedPairIds.includes(card.pairId)) return;

    marioAudio.playJump();
    const nextFlipped = [...flipped, idx];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = nextFlipped;
      const first = deck[firstIdx];
      const second = deck[secondIdx];

      if (first.pairId === second.pairId) {
        const updatedMatches = [...matchedPairIds, first.pairId];
        setMatchedPairIds(updatedMatches);
        setFlipped([]);
        onEarnCoins(3);
        marioAudio.playCoin();
        if (updatedMatches.length === MEMORY_PAIR_COUNT) {
          onEarnCoins(20);
          marioAudio.playQuizComplete();
          try {
            confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
          } catch {
            // ignore
          }
        }
      } else {
        lockRef.current = true;
        setTimeout(() => {
          setFlipped([]);
          lockRef.current = false;
        }, 780);
      }
    }
  };

  const allCleared = matchedPairIds.length === MEMORY_PAIR_COUNT && deck.length > 0;

  return (
    <div className="bg-[#1e293b] rounded-3xl mario-card border-4 border-slate-950 p-4 sm:p-6 text-white space-y-4 max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-700 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-amber-400 rounded-xl border-2 border-black flex items-center justify-center shrink-0">
            <MarioCharacterAvatar character={equippedAvatar} className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-amber-400 font-mario block">
              MARIO PARTY MEMORY TABLE • DOLE MULTIPLIERS
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-display text-white">
              MULTIPLIER MEMORY MATCH
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900 px-3.5 py-2 rounded-xl border-2 border-slate-700 font-mario text-xs tabular-nums flex items-center gap-3">
            <span className="text-amber-300">PAIRS: {matchedPairIds.length}/8</span>
            <span className="text-cyan-300">MOVES: {moves}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              initDeck();
              marioAudio.playPowerUp();
            }}
            className="h-10 px-4 inline-flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl border-2 border-black shadow-[0_3px_0_#000] cursor-pointer text-xs leading-none whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span>Shuffle</span>
          </button>
        </div>
      </div>

      {allCleared && (
        <div className="bg-emerald-900/90 border-3 border-amber-400 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <MarioStarIcon className="w-8 h-8 shrink-0" />
            <div>
              <h3 className="font-black text-amber-300 font-display text-lg">ALL 8 STATUTORY MULTIPLIERS MATCHED!</h3>
              <p className="text-xs font-bold text-emerald-100">Completed in {moves} moves • +20 Bonus Mario Coins awarded!</p>
            </div>
          </div>
          <button
            type="button"
            onClick={initDeck}
            className="h-10 px-5 inline-flex items-center justify-center gap-1.5 bg-amber-400 text-slate-950 font-black rounded-xl border-2 border-black cursor-pointer font-mario text-xs leading-none whitespace-nowrap"
          >
            NEW BOARD
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {deck.map((card, idx) => {
          const isRevealed = flipped.includes(idx) || matchedPairIds.includes(card.pairId);
          const isMatched = matchedPairIds.includes(card.pairId);
          return (
            <button
              key={card.uid}
              type="button"
              onClick={() => handleCardFlip(idx)}
              className={`h-24 sm:h-28 rounded-2xl border-3 border-black p-3 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                isMatched
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_3px_0_#000]'
                  : isRevealed
                  ? card.kind === 'rate'
                    ? 'bg-amber-300 text-slate-950 shadow-[0_3px_0_#000]'
                    : 'bg-white text-slate-950 shadow-[0_3px_0_#000]'
                  : 'mario-question-block text-slate-950 hover:-translate-y-0.5'
              }`}
            >
              {isRevealed ? (
                <>
                  <span className="text-[9px] font-black font-mario uppercase opacity-75 mb-1">
                    {card.kind === 'rate' ? 'MULTIPLIER' : 'DAY SCENARIO'}
                  </span>
                  <span className="text-xs sm:text-sm font-black leading-tight">{card.text}</span>
                </>
              ) : (
                <span className="font-mario text-2xl font-black text-slate-950">?</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================================
   GAME 6: LUIGI'S MANSION: CONTRACTOR BUSTER (DOLE D.O. 174-17 Inspector)
   ============================================================================ */
export const ContractorBusterGame: React.FC<MiniGameProps> = ({ equippedAvatar, onEarnCoins }) => {
  const [cases, setCases] = useState<ContractorDocketItem[]>(() => drawContractorDockets(6));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<null | { correct: boolean; message: string }>(null);
  const [completed, setCompleted] = useState(false);

  const current = cases[idx] ?? cases[0];

  const handleInspect = (declareLaborOnly: boolean) => {
    if (answered || !current) return;
    const isCorrect = declareLaborOnly === current.isLaborOnly;
    if (isCorrect) {
      setScore((s) => s + 1);
      onEarnCoins(5);
      marioAudio.playCoin();
    } else {
      marioAudio.playBowserHit();
    }
    setAnswered({ correct: isCorrect, message: current.verdictNote });
  };

  const nextCase = () => {
    if (idx < cases.length - 1) {
      setIdx((i) => i + 1);
      setAnswered(null);
      marioAudio.playPipe();
    } else {
      setCompleted(true);
      onEarnCoins(15);
      marioAudio.playQuizComplete();
    }
  };

  const resetCases = () => {
    setCases(drawContractorDockets(6));
    setIdx(0);
    setScore(0);
    setAnswered(null);
    setCompleted(false);
    marioAudio.playPowerUp();
  };

  return (
    <div className="bg-[#1e293b] rounded-3xl mario-card border-4 border-slate-950 p-4 sm:p-6 text-white space-y-4 max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-700 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-emerald-400 rounded-xl border-2 border-black flex items-center justify-center shrink-0">
            <MarioCharacterAvatar character={equippedAvatar} className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-400 font-mario block">
              DOLE D.O. 174-17 • POLTERGUST AUDIT
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-display text-white">
              LUIGI&apos;S MANSION: CONTRACTOR BUSTER
            </h2>
          </div>
        </div>

        <div className="bg-slate-900 px-3.5 py-2 rounded-xl border-2 border-slate-700 font-mario text-xs tabular-nums">
          CASE {idx + 1}/{cases.length} • SCORE: <span className="text-emerald-400">{score}</span>
        </div>
      </div>

      {!completed ? (
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-2xl border-3 border-emerald-500/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mario text-emerald-300 uppercase">DOLE INSPECTION DOCKET #{idx + 101}</span>
              <span className="text-xs font-bold text-amber-300">₱5,000,000 Capital Rule</span>
            </div>
            <h3 className="text-xl font-black font-display text-white">{current.agencyName}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Capital & Equipment:</span>
                <span className="text-white font-black">{current.capital}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">DOLE Registry Status:</span>
                <span className="text-white font-black">{current.registration}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Right of Control:</span>
                <span className="text-white font-black">{current.controlHolder}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Nature of Work:</span>
                <span className="text-white font-black">{current.workRelation}</span>
              </div>
            </div>
          </div>

          {!answered ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleInspect(true)}
                className="h-12 px-5 inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl border-3 border-black shadow-[0_4px_0_#000] cursor-pointer text-xs sm:text-sm leading-none whitespace-nowrap"
              >
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span>BUST GHOST! (Labor-Only / Prohibited)</span>
              </button>
              <button
                type="button"
                onClick={() => handleInspect(false)}
                className="h-12 px-5 inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_4px_0_#000] cursor-pointer text-xs sm:text-sm leading-none whitespace-nowrap"
              >
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span>CERTIFY VALID (Legitimate D.O. 174)</span>
              </button>
            </div>
          ) : (
            <div className={`p-4 rounded-2xl border-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              answered.correct ? 'bg-emerald-950 border-emerald-400' : 'bg-rose-950 border-rose-500'
            }`}>
              <div className="space-y-1">
                <span className="font-mario text-xs text-amber-300 block">
                  {answered.correct ? 'ACCURATE INSPECTION! +5 COINS' : 'INSPECTION ERROR!'}
                </span>
                <p className="text-xs sm:text-sm font-bold text-white">{answered.message}</p>
              </div>
              <button
                type="button"
                onClick={nextCase}
                className="h-10 px-5 inline-flex items-center justify-center gap-1.5 bg-amber-400 text-slate-950 font-black rounded-xl border-2 border-black cursor-pointer font-mario text-xs shrink-0 leading-none whitespace-nowrap"
              >
                <span>NEXT DOCKET</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-900 rounded-2xl border-3 border-emerald-400 p-8 text-center space-y-4">
          <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="text-2xl font-black font-display text-emerald-300">MANSION CLEARED!</h3>
          <p className="text-sm font-bold text-slate-200">
            You accurately adjudicated {score} of {cases.length} D.O. 174 contracting dockets! +15 Bonus Coins!
          </p>
          <button
            type="button"
            onClick={resetCases}
            className="h-11 px-7 inline-flex items-center justify-center gap-2 bg-amber-400 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_4px_0_#000] cursor-pointer font-mario text-xs leading-none whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4 shrink-0" />
            <span>INSPECT AGAIN</span>
          </button>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
   GAME 7: BOWSER'S BRIDGE: DOCTRINE RESCUE (Statutory Term Decoder)
   ============================================================================ */
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const BowsersBridgeGame: React.FC<MiniGameProps> = ({ equippedAvatar, onEarnCoins }) => {
  const [puzzle, setPuzzle] = useState<BridgeDoctrineItem>(() => drawBridgePuzzle());
  const [guessed, setGuessed] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const maxMistakes = 6;

  const letters = puzzle.word.split('');
  const isSolved = letters.every((ch) => guessed.includes(ch));
  const isLost = mistakes >= maxMistakes;

  const handleGuess = (letter: string) => {
    if (guessed.includes(letter) || isSolved || isLost) return;
    const next = [...guessed, letter];
    setGuessed(next);
    if (puzzle.word.includes(letter)) {
      marioAudio.playJump();
      if (letters.every((ch) => next.includes(ch))) {
        onEarnCoins(8);
        marioAudio.playQuizComplete();
      }
    } else {
      setMistakes((m) => m + 1);
      marioAudio.playBowserHit();
    }
  };

  const nextPuzzle = () => {
    setPuzzle(drawBridgePuzzle());
    setGuessed([]);
    setMistakes(0);
    marioAudio.playPowerUp();
  };

  return (
    <div className="bg-[#1e293b] rounded-3xl mario-card border-4 border-slate-950 p-4 sm:p-6 text-white space-y-4 max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-700 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-red-500 rounded-xl border-2 border-black flex items-center justify-center shrink-0">
            <MarioCharacterAvatar character={equippedAvatar} className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-amber-400 font-mario block">
              CASTLE LAVA BRIDGE • STATUTORY DECODER
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-display text-white">
              BOWSER&apos;S BRIDGE: DOCTRINE RESCUE
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-900 px-3.5 py-2 rounded-xl border-2 border-slate-700 font-mario text-xs tabular-nums">
          <MarioBowserIcon className="w-5 h-5 shrink-0" />
          <span className="text-rose-400">BRIDGE INTEGRITY: {maxMistakes - mistakes}/{maxMistakes}</span>
        </div>
      </div>

      {/* Bridge Visual Meter */}
      <div className="bg-slate-950 rounded-2xl border-3 border-black p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-1">
            {Array.from({ length: maxMistakes }).map((_, i) => (
              <div
                key={i}
                className={`h-4 flex-1 rounded border-2 border-black transition-all ${
                  i < maxMistakes - mistakes ? 'bg-amber-500' : 'bg-red-950 opacity-35'
                }`}
              />
            ))}
          </div>
          <MarioAxeIcon className="w-7 h-7 shrink-0" />
        </div>

        <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-3.5 text-center space-y-2">
          <span className="text-[10px] font-mario text-amber-400 uppercase block">STATUTORY CLUE:</span>
          <p className="text-xs sm:text-sm font-bold text-slate-100">{puzzle.clue}</p>
        </div>

        {/* Letter Slots */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 py-2">
          {letters.map((ch, idx) => {
            const show = guessed.includes(ch) || isLost;
            return (
              <div
                key={idx}
                className={`w-8 h-10 sm:w-10 sm:h-12 rounded-xl border-2 border-black flex items-center justify-center font-mario text-sm sm:text-base font-black ${
                  show ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {show ? ch : '_'}
              </div>
            );
          })}
        </div>
      </div>

      {(isSolved || isLost) && (
        <div className={`p-4 rounded-2xl border-3 flex flex-wrap items-center justify-between gap-3 ${
          isSolved ? 'bg-emerald-950 border-amber-400' : 'bg-rose-950 border-rose-500'
        }`}>
          <span className="font-bold text-xs sm:text-sm">
            {isSolved
              ? `BRIDGE AXE ACTIVATED! You decoded "${puzzle.word}"! +8 Mario Coins!`
              : `BRIDGE COLLAPSED! The statutory term was "${puzzle.word}".`}
          </span>
          <button
            type="button"
            onClick={nextPuzzle}
            className="h-10 px-5 inline-flex items-center justify-center gap-1.5 bg-amber-400 text-slate-950 font-black rounded-xl border-2 border-black cursor-pointer font-mario text-xs leading-none whitespace-nowrap"
          >
            <span>NEXT BRIDGE</span>
          </button>
        </div>
      )}

      {/* Keyboard */}
      <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5">
        {ALPHABET.map((letter) => {
          const used = guessed.includes(letter);
          const hit = used && puzzle.word.includes(letter);
          return (
            <button
              key={letter}
              type="button"
              disabled={used || isSolved || isLost}
              onClick={() => handleGuess(letter)}
              className={`h-10 rounded-xl border-2 border-black font-mario text-xs font-black inline-flex items-center justify-center transition-all cursor-pointer ${
                used
                  ? hit
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-600 opacity-50'
                  : 'bg-white hover:bg-amber-300 text-slate-950 shadow-[0_2px_0_#000]'
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================================
   GAME 8: DR. MARIO: HOLIDAY & WAGE PIPE SORTER
   ============================================================================ */
export const HolidayWageSorterGame: React.FC<MiniGameProps> = ({ equippedAvatar, onEarnCoins }) => {
  const [capsules, setCapsules] = useState<PayrollCapsuleItem[]>(() => drawPayrollCapsules(8));
  const [capsuleIdx, setCapsuleIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [statusMsg, setStatusMsg] = useState('Route each Payroll Capsule into the matching Statutory Warp Pipe!');
  const [finished, setFinished] = useState(false);

  const capsule = capsules[capsuleIdx] ?? capsules[0];

  const handleSort = (chosen: PayrollCapsuleItem['bucket']) => {
    if (finished || !capsule) return;
    if (chosen === capsule.bucket) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setScore((s) => s + 100 + nextStreak * 20);
      onEarnCoins(3);
      setStatusMsg(`CORRECT PIPE! +3 Coins — ${capsule.note}`);
      marioAudio.playCoin();
    } else {
      setStreak(0);
      setStatusMsg(`WRONG PIPE! ${capsule.note}`);
      marioAudio.playBowserHit();
    }

    if (capsuleIdx < capsules.length - 1) {
      setCapsuleIdx((i) => i + 1);
    } else {
      setFinished(true);
      onEarnCoins(15);
      marioAudio.playQuizComplete();
    }
  };

  const restartSorter = () => {
    setCapsules(drawPayrollCapsules(8));
    setCapsuleIdx(0);
    setScore(0);
    setStreak(0);
    setFinished(false);
    setStatusMsg('Route each Payroll Capsule into the matching Statutory Warp Pipe!');
    marioAudio.playPowerUp();
  };

  return (
    <div className="bg-[#1e293b] rounded-3xl mario-card border-4 border-slate-950 p-4 sm:p-6 text-white space-y-4 max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-700 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-cyan-400 rounded-xl border-2 border-black flex items-center justify-center shrink-0">
            <MarioCharacterAvatar character={equippedAvatar} className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-cyan-300 font-mario block">
              DR. MARIO PAYROLL CLINIC • HOLIDAY & REST PIPES
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-display text-white">
              HOLIDAY & WAGE PIPE SORTER
            </h2>
          </div>
        </div>

        <div className="bg-slate-900 px-3.5 py-2 rounded-xl border-2 border-slate-700 font-mario text-xs tabular-nums flex items-center gap-3">
          <span className="text-amber-300">CAPSULE {Math.min(capsules.length, capsuleIdx + 1)}/{capsules.length}</span>
          <span className="text-emerald-400">SCORE: {score}</span>
        </div>
      </div>

      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-amber-200">
        {statusMsg}
      </div>

      {!finished ? (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-slate-950 rounded-2xl border-3 border-black p-6 text-center space-y-2 shadow-[0_4px_0_#000]">
            <span className="text-[10px] font-mario uppercase bg-black text-amber-300 px-2.5 py-1 rounded inline-block">
              INCOMING PAYROLL CAPSULE
            </span>
            <h3 className="text-lg sm:text-xl font-black font-display">{capsule.title}</h3>
            <p className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1">
              <ArrowDown className="w-4 h-4" /> Drop into the correct statutory multiplier pipe below:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleSort('base100')}
              className="h-24 rounded-2xl border-3 border-black bg-sky-500 hover:bg-sky-400 text-slate-950 p-3 flex flex-col items-center justify-between font-black shadow-[0_4px_0_#000] cursor-pointer"
            >
              <span className="font-mario text-xs">PIPE A • 100%</span>
              <span className="text-xs font-extrabold">100% Basic Daily Rate</span>
              <div className="w-full h-3 mario-green-pipe rounded" />
            </button>

            <button
              type="button"
              onClick={() => handleSort('special130')}
              className="h-24 rounded-2xl border-3 border-black bg-amber-400 hover:bg-amber-300 text-slate-950 p-3 flex flex-col items-center justify-between font-black shadow-[0_4px_0_#000] cursor-pointer"
            >
              <span className="font-mario text-xs">PIPE B • 130%–150%</span>
              <span className="text-xs font-extrabold">Rest / Special Non-Working</span>
              <div className="w-full h-3 mario-green-pipe rounded" />
            </button>

            <button
              type="button"
              onClick={() => handleSort('regular200')}
              className="h-24 rounded-2xl border-3 border-black bg-rose-500 hover:bg-rose-400 text-white p-3 flex flex-col items-center justify-between font-black shadow-[0_4px_0_#000] cursor-pointer"
            >
              <span className="font-mario text-xs">PIPE C • 200%–390%</span>
              <span className="text-xs font-extrabold">Regular / Double Holiday</span>
              <div className="w-full h-3 mario-green-pipe rounded" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 rounded-2xl border-3 border-cyan-400 p-8 text-center space-y-4">
          <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="text-2xl font-black font-display text-cyan-300">ALL CAPSULES SORTED!</h3>
          <p className="text-sm font-bold text-slate-200">
            Total Clinic Score: <span className="text-emerald-400">{score} PTS</span> • +15 Bonus Coins!
          </p>
          <button
            type="button"
            onClick={restartSorter}
            className="h-11 px-7 inline-flex items-center justify-center gap-2 bg-amber-400 text-slate-950 font-black rounded-xl border-3 border-black shadow-[0_4px_0_#000] cursor-pointer font-mario text-xs leading-none whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4 shrink-0" />
            <span>SORT AGAIN</span>
          </button>
        </div>
      )}
    </div>
  );
};
