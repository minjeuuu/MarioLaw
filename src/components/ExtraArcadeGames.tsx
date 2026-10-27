import React, { useState } from 'react';
import { MarioAvatar } from '../types/laborLaw';
import { marioAudio } from '../utils/audio';
import {
  MarioCharacterAvatar,
  MarioCoinIcon,
  MarioStarIcon,
  MarioFireFlowerIcon,
  MarioMushroomIcon,
} from './MarioIcons';
import { Coins, Sparkles, Shield, RotateCcw, CheckCircle2, XCircle, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  drawSlotTriviaQuestion,
  drawWorld6LeaveCase,
  drawClimberTowerRun,
  SlotTriviaItem,
  LeaveClinicCaseItem,
  ClimberRungItem,
  WORLD6_LEAVE_CLINIC_BANK,
} from '../utils/gameQuestionDeck';

interface ExtraGameProps {
  equippedAvatar: MarioAvatar;
  coins: number;
  onAdjustCoins: (delta: number) => void;
}

// ============================================================================
// 1. TOAD'S STATUTORY COIN TREASURY SLOTS (Spend Coins & Double via Bar Trivia!)
// ============================================================================
const SLOT_REELS = [
  { id: 'star', label: '390% Double Holiday + RD', payoutMult: 5 },
  { id: 'flower', label: '105d Maternity Leave', payoutMult: 4 },
  { id: 'mushroom', label: '200% Regular Holiday', payoutMult: 3 },
  { id: 'coin', label: '100% Service Charge', payoutMult: 2 },
] as const;

export const ToadHouseCoinSlots: React.FC<ExtraGameProps> = ({
  equippedAvatar,
  coins,
  onAdjustCoins,
}) => {
  const [wager, setWager] = useState<5 | 15 | 30>(15);
  const [reels, setReels] = useState<[number, number, number]>([0, 1, 2]);
  const [spinning, setSpinning] = useState(false);
  const [lastResult, setLastResult] = useState<string>(
    'Select your coin wager (5c, 15c, or 30c) and pull Toad’s Treasury Lever!'
  );
  const [pendingTriviaWin, setPendingTriviaWin] = useState<number>(0);
  const [activeTrivia, setActiveTrivia] = useState<SlotTriviaItem>(() => drawSlotTriviaQuestion());

  const renderSymbol = (idx: number) => {
    const item = SLOT_REELS[idx] ?? SLOT_REELS[0];
    if (item.id === 'star') return <MarioStarIcon className="w-10 h-10" />;
    if (item.id === 'flower') return <MarioFireFlowerIcon className="w-10 h-10" />;
    if (item.id === 'mushroom') return <MarioMushroomIcon className="w-10 h-10" />;
    return <MarioCoinIcon className="w-10 h-10" />;
  };

  const handleSpin = () => {
    if (spinning || coins < wager) return;
    onAdjustCoins(-wager);
    setPendingTriviaWin(0);
    setSpinning(true);
    marioAudio.playQuestionBlock();

    setTimeout(() => {
      const r1 = Math.floor(Math.random() * SLOT_REELS.length);
      const r2 = Math.floor(Math.random() * SLOT_REELS.length);
      const r3 = Math.random() < 0.42 ? r1 : Math.floor(Math.random() * SLOT_REELS.length);
      setReels([r1, r2, r3]);
      setSpinning(false);

      if (r1 === r2 && r2 === r3) {
        const win = wager * SLOT_REELS[r1].payoutMult;
        onAdjustCoins(win);
        setPendingTriviaWin(win);
        setActiveTrivia(drawSlotTriviaQuestion());
        setLastResult(`JACKPOT! 3x ${SLOT_REELS[r1].label} — Won +${win} Coins!`);
        marioAudio.playOneUp();
        try {
          confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        } catch {
          // ignore
        }
      } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        const matchIdx = r1 === r2 ? r1 : r3;
        const win = Math.round(wager * 1.8);
        onAdjustCoins(win);
        setPendingTriviaWin(Math.max(5, Math.round(wager * 0.8)));
        setActiveTrivia(drawSlotTriviaQuestion());
        setLastResult(`PAIR MATCH (${SLOT_REELS[matchIdx].label})! Won +${win} Coins!`);
        marioAudio.playPowerUp();
      } else {
        setLastResult('No match this spin! Answer the Rescue Question below to win back +8 Coins!');
        setPendingTriviaWin(8);
        setActiveTrivia(drawSlotTriviaQuestion());
      }
    }, 320);
  };

  const handleAnswerBonus = (choice: number) => {
    if (choice === activeTrivia.ans) {
      onAdjustCoins(pendingTriviaWin);
      marioAudio.playCoin();
      setLastResult(`CORRECT BAR DOCTRINE! Bonus +${pendingTriviaWin} Coins added to your wallet!`);
    } else {
      marioAudio.playBowserHit();
      setLastResult(`Review Tip: Correct answer was "${activeTrivia.opts[activeTrivia.ans]}". Spin again!`);
    }
    setPendingTriviaWin(0);
  };

  return (
    <div className="bg-[#1e293b] text-white rounded-3xl p-5 sm:p-7 border-4 border-slate-950 shadow-[6px_6px_0_#000] max-w-3xl mx-auto space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-700 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-amber-400 rounded-xl border-2 border-black flex items-center justify-center shrink-0">
            <MarioCharacterAvatar character={equippedAvatar} className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-black font-mario text-amber-400 uppercase block">
              TOAD HOUSE COIN WAGER ARCADE
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-display text-white">
              STATUTORY TREASURY SLOTS
            </h2>
          </div>
        </div>
        <div className="bg-slate-900 px-3.5 py-2 rounded-xl border-2 border-amber-400 flex items-center gap-2 font-mario text-xs text-amber-300 tabular-nums">
          <MarioCoinIcon className="w-4 h-4" />
          <span>{coins} COINS</span>
        </div>
      </div>

      {/* Wager Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-3.5 rounded-2xl border-2 border-slate-700">
        <span className="text-xs font-bold text-slate-300">Choose Coin Wager:</span>
        <div className="flex items-center gap-2">
          {([5, 15, 30] as const).map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => {
                setWager(amt);
                marioAudio.playClick();
              }}
              className={`min-h-[44px] px-4 py-2 rounded-xl font-mario text-xs border-2 cursor-pointer transition-colors whitespace-nowrap ${
                wager === amt
                  ? 'bg-amber-400 text-slate-950 border-black font-black'
                  : 'bg-slate-800 text-slate-200 border-slate-600 hover:bg-slate-700'
              }`}
            >
              {amt} Coins
            </button>
          ))}
        </div>
      </div>

      {/* 3 Reels */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 bg-slate-950 p-4 sm:p-6 rounded-2xl border-3 border-amber-400">
        {reels.map((symbolIdx, i) => (
          <div
            key={i}
            className="bg-slate-900 border-2 border-slate-700 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-center min-h-[120px]"
          >
            <div className={spinning ? 'scale-110 transition-transform' : ''}>
              {renderSymbol(symbolIdx)}
            </div>
            <span className="text-[11px] font-bold text-amber-200 leading-tight">
              {SLOT_REELS[symbolIdx].label}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm font-bold text-amber-300 text-center">
        {lastResult}
      </div>

      {pendingTriviaWin > 0 && (
        <div className="bg-indigo-950/90 border-2 border-amber-400 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mario text-amber-300 uppercase">
              BAR TRIVIA BONUS (+{pendingTriviaWin} COINS)
            </span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-white">
            {activeTrivia.q}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {activeTrivia.opts.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAnswerBonus(idx)}
                className="min-h-[44px] px-3 py-2 rounded-xl bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-white font-bold text-xs border border-slate-600 cursor-pointer"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        disabled={spinning || coins < wager}
        onClick={handleSpin}
        className="w-full min-h-[50px] py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-400 text-slate-950 font-black rounded-2xl border-3 border-black shadow-[0_4px_0_#000] active:translate-y-0.5 font-mario text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2"
      >
        <Coins className="w-5 h-5" />
        <span>
          {coins < wager
            ? `NEED ${wager} COINS TO SPIN`
            : spinning
            ? 'SPINNING REELS...'
            : `SPIN TREASURY REELS (-${wager} COINS)`}
        </span>
      </button>
    </div>
  );
};

// ============================================================================
// 2. WORLD 6 STATUTORY LEAVE CLINIC (Dedicated Module 6 Mastery Arcade!)
// ============================================================================
export const World6LeaveMatcherGame: React.FC<ExtraGameProps> = ({
  equippedAvatar,
  coins,
  onAdjustCoins,
}) => {
  const [caseNumber, setCaseNumber] = useState(1);
  const [current, setCurrent] = useState<LeaveClinicCaseItem>(() => drawWorld6LeaveCase());
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [hintUnlocked, setHintUnlocked] = useState(false);

  const handleSelect = (opt: string) => {
    if (opt === current.correctLeave) {
      const reward = 6 + Math.min(10, streak * 2);
      onAdjustCoins(reward);
      setStreak((s) => s + 1);
      setFeedback({ ok: true, text: `Correct! +${reward} Coins • ${current.statute}` });
      marioAudio.playCoin();
    } else {
      setStreak(0);
      setFeedback({ ok: false, text: `Not quite! Answer: ${current.correctLeave} (${current.statute})` });
      marioAudio.playBowserHit();
    }
  };

  const nextCase = () => {
    setCaseNumber((n) => n + 1);
    setCurrent(drawWorld6LeaveCase());
    setFeedback(null);
    setHintUnlocked(false);
    marioAudio.playClick();
  };

  const buyHint = () => {
    if (coins < 5 || hintUnlocked) return;
    onAdjustCoins(-5);
    setHintUnlocked(true);
    marioAudio.playPowerUp();
  };

  return (
    <div className="bg-[#1e293b] text-white rounded-3xl p-5 sm:p-7 border-4 border-slate-950 shadow-[6px_6px_0_#000] max-w-3xl mx-auto space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-700 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-pink-500 rounded-xl border-2 border-black flex items-center justify-center shrink-0">
            <MarioCharacterAvatar character={equippedAvatar} className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-black font-mario text-pink-300 uppercase block">
              WORLD 6 • STATUTORY LEAVES &amp; WELFARE CLINIC
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-display text-white">
              PEACH&apos;S LEAVE BENEFIT DISPATCH
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mario text-xs tabular-nums">
          <span className="bg-slate-900 px-3 py-2 rounded-xl border border-slate-700 text-emerald-400">
            STREAK x{streak}
          </span>
        </div>
      </div>

      <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-mono text-pink-300 font-bold tabular-nums">
            CASE #{caseNumber} • {WORLD6_LEAVE_CLINIC_BANK.length}-CASE DECK
          </span>
          <button
            type="button"
            disabled={coins < 5 || hintUnlocked}
            onClick={buyHint}
            className="min-h-[38px] px-3 py-1 rounded-xl bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-black text-xs border border-black cursor-pointer"
          >
            {hintUnlocked ? 'Statutory Hint Active' : 'Buy Codal Hint (-5 Coins)'}
          </button>
        </div>
        <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
          {current.scenario}
        </p>
        {hintUnlocked && (
          <p className="text-xs text-amber-300 bg-slate-950 p-2.5 rounded-xl border border-amber-400/50">
            Codal Clue: {current.statute}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {current.options.map((opt) => (
          <button
            key={opt}
            type="button"
            disabled={Boolean(feedback)}
            onClick={() => handleSelect(opt)}
            className="min-h-[48px] text-left p-3.5 rounded-2xl bg-slate-800 hover:bg-pink-500 hover:text-slate-950 disabled:opacity-75 text-white font-bold text-xs sm:text-sm border-2 border-slate-600 transition-colors cursor-pointer"
          >
            {opt}
          </button>
        ))}
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-2xl border-2 flex flex-wrap items-center justify-between gap-3 ${
            feedback.ok
              ? 'bg-emerald-950 border-emerald-400 text-emerald-200'
              : 'bg-rose-950 border-rose-400 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
            {feedback.ok ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            type="button"
            onClick={nextCase}
            className="min-h-[44px] px-4 py-2 bg-amber-400 text-slate-950 font-black rounded-xl border-2 border-black font-mario text-xs cursor-pointer whitespace-nowrap"
          >
            NEXT CASE ▶
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 3. LAKITU'S BAR CLIMBER TOWER (High-Stakes Coin Ladder + Cloud Shield!)
// ============================================================================
export const LakituCloudClimberGame: React.FC<ExtraGameProps> = ({
  equippedAvatar,
  coins,
  onAdjustCoins,
}) => {
  const [rungs, setRungs] = useState<ClimberRungItem[]>(() => drawClimberTowerRun());
  const [rungIdx, setRungIdx] = useState(0);
  const [bankedPot, setBankedPot] = useState(0);
  const [cloudShield, setCloudShield] = useState(false);
  const [status, setStatus] = useState<'climbing' | 'won' | 'fell'>('climbing');

  const currentRung = rungs[rungIdx] ?? rungs[0];

  const buyShield = () => {
    if (coins < 12 || cloudShield) return;
    onAdjustCoins(-12);
    setCloudShield(true);
    marioAudio.playPowerUp();
  };

  const answerRung = (choice: number) => {
    if (status !== 'climbing') return;
    if (choice === currentRung.ans) {
      const nextPot = currentRung.reward;
      setBankedPot(nextPot);
      marioAudio.playCoin();
      if (rungIdx + 1 >= rungs.length) {
        onAdjustCoins(nextPot);
        setStatus('won');
        marioAudio.playQuizComplete();
      } else {
        setRungIdx((r) => r + 1);
      }
    } else if (cloudShield) {
      setCloudShield(false);
      marioAudio.playPipe();
    } else {
      setBankedPot(0);
      setStatus('fell');
      marioAudio.playBowserHit();
    }
  };

  const cashOut = () => {
    if (bankedPot <= 0) return;
    onAdjustCoins(bankedPot);
    marioAudio.playOneUp();
    setStatus('won');
  };

  const resetClimb = () => {
    setRungs(drawClimberTowerRun());
    setRungIdx(0);
    setBankedPot(0);
    setStatus('climbing');
    marioAudio.playClick();
  };

  return (
    <div className="bg-[#1e293b] text-white rounded-3xl p-5 sm:p-7 border-4 border-slate-950 shadow-[6px_6px_0_#000] max-w-3xl mx-auto space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-700 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-sky-400 rounded-xl border-2 border-black flex items-center justify-center shrink-0">
            <MarioCharacterAvatar character={equippedAvatar} className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-black font-mario text-sky-300 uppercase block">
              RISK-AND-REWARD SKY TOWER
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-display text-white">
              LAKITU&apos;S BAR JACKPOT CLIMBER
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={coins < 12 || cloudShield || status !== 'climbing'}
            onClick={buyShield}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-sky-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-black text-xs border-2 border-black flex items-center gap-1.5 cursor-pointer"
          >
            <Shield className="w-4 h-4" />
            <span>{cloudShield ? 'Cloud Shield ON' : 'Cloud Shield (-12c)'}</span>
          </button>
        </div>
      </div>

      {/* Progress Rungs */}
      <div className="grid grid-cols-5 gap-2 tabular-nums">
        {rungs.map((r, i) => (
          <div
            key={r.rung}
            className={`p-2 rounded-xl border text-center text-xs font-bold ${
              i === rungIdx && status === 'climbing'
                ? 'bg-amber-400 text-slate-950 border-black font-black'
                : i < rungIdx || status === 'won'
                ? 'bg-emerald-600 text-white border-emerald-300'
                : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}
          >
            <span className="block text-[10px]">Floor {r.rung}</span>
            <span>+{r.reward}c</span>
          </div>
        ))}
      </div>

      {status === 'climbing' && (
        <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-mario text-amber-300">
              FLOOR {currentRung.rung}/5 • POT: {bankedPot} COINS
            </span>
            {bankedPot > 0 && (
              <button
                type="button"
                onClick={cashOut}
                className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs border-2 border-black cursor-pointer"
              >
                Cash Out +{bankedPot} Coins
              </button>
            )}
          </div>
          <p className="text-sm sm:text-base font-bold text-white">{currentRung.q}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentRung.opts.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => answerRung(idx)}
                className="min-h-[48px] p-3.5 rounded-xl bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-white font-bold text-xs sm:text-sm border-2 border-slate-600 cursor-pointer text-left"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {status !== 'climbing' && (
        <div className="bg-slate-900 border-2 border-amber-400 rounded-2xl p-6 text-center space-y-3">
          <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="text-xl font-black font-display">
            {status === 'won'
              ? `SUMMIT CLAIMED! +${bankedPot} COINS BANKED!`
              : 'THWOMP KNOCKOUT! POT LOST!'}
          </h3>
          <p className="text-xs text-slate-300">
            {status === 'won'
              ? 'Your Mario Coins have been added directly to your wallet for Toad’s Shop!'
              : 'Tip: Equip Lakitu’s Cloud Shield (-12c) to survive one wrong answer on high floors!'}
          </p>
          <button
            type="button"
            onClick={resetClimb}
            className="min-h-[46px] px-6 py-2.5 bg-amber-400 text-slate-950 font-black rounded-xl border-2 border-black font-mario text-xs inline-flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>CLIMB AGAIN</span>
          </button>
        </div>
      )}
    </div>
  );
};
