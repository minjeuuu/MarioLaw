import { PRACTICE_QUESTIONS } from '../data/quizQuestionsData';

export interface KartQuestionItem {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  boostReward: string;
}

export interface SlotTriviaItem {
  id: string;
  q: string;
  opts: string[];
  ans: number;
}

export interface LeaveClinicCaseItem {
  id: string;
  scenario: string;
  correctLeave: string;
  options: string[];
  statute: string;
}

export interface ClimberRungItem {
  id: string;
  rung: number;
  reward: number;
  q: string;
  opts: string[];
  ans: number;
}

export interface DeductionPipeTargetItem {
  id: string;
  label: string;
  isIllegal: boolean;
  ruleNote: string;
}

export interface MultiplierMemoryPairItem {
  id: string;
  scenario: string;
  rate: string;
}

export interface ContractorDocketItem {
  id: string;
  agencyName: string;
  capital: string;
  controlHolder: string;
  workRelation: string;
  registration: string;
  isLaborOnly: boolean;
  verdictNote: string;
}

export interface BridgeDoctrineItem {
  id: string;
  word: string;
  clue: string;
}

export interface PayrollCapsuleItem {
  id: string;
  title: string;
  bucket: 'base100' | 'special130' | 'regular200';
  note: string;
}

export interface CourtroomBowserAttackItem {
  id: string;
  title: string;
  dialogue: string;
  damage: number;
  weakness: 'fireball_8hr' | 'maternity_hammer' | 'star_shield' | 'dole_stomp';
}

export interface WarpSorterItem {
  id: string;
  label: string;
  detail: string;
  targetPipe: 'covered' | 'exempt';
}

export interface LawCatcherTemplateItem {
  id: string;
  type: 'coin' | 'mushroom' | 'star' | 'thwomp' | 'poison';
  label: string;
  isBenefit: boolean;
}

interface DeckCursorState {
  queue: number[];
  lastIndex: number | null;
  poolLength: number;
}

const sessionDecks = new Map<string, DeckCursorState>();

function buildShuffledIndices(
  length: number,
  avoidFirstIndex: number | null,
  rng: () => number
): number[] {
  const indices = Array.from({ length }, (_, idx) => idx);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  if (length > 1 && avoidFirstIndex !== null && indices[0] === avoidFirstIndex) {
    const swapIdx = 1 + Math.floor(rng() * (length - 1));
    [indices[0], indices[swapIdx]] = [indices[swapIdx], indices[0]];
  }
  return indices;
}

/**
 * Stateful Fisher-Yates Session Deck Drawer:
 * Deals `count` unique items from `pool` without repeating ANY item across consecutive
 * calls or game restarts until all `pool.length` items have been seen.
 * Also guards cycle boundaries so the last item of Cycle N is never the first item of Cycle N+1.
 */
export function drawUniqueFromDeck<T>(
  deckKey: string,
  pool: readonly T[],
  count: number,
  rng: () => number = Math.random
): T[] {
  if (pool.length === 0 || count <= 0) return [];
  const targetCount = Math.min(count, pool.length);

  let cursor = sessionDecks.get(deckKey);
  if (!cursor || cursor.poolLength !== pool.length) {
    cursor = {
      queue: buildShuffledIndices(pool.length, null, rng),
      lastIndex: null,
      poolLength: pool.length,
    };
    sessionDecks.set(deckKey, cursor);
  }

  const pickedIndices: number[] = [];
  const pickedSet = new Set<number>();

  while (pickedIndices.length < targetCount) {
    if (cursor.queue.length === 0) {
      cursor.queue = buildShuffledIndices(pool.length, cursor.lastIndex, rng);
    }

    // Find the first queued index not already in this current batch
    const nextPos = cursor.queue.findIndex((idx) => !pickedSet.has(idx));
    if (nextPos === -1) {
      // Refill fresh shuffled queue excluding already picked items if needed
      const fresh = buildShuffledIndices(pool.length, cursor.lastIndex, rng).filter(
        (idx) => !pickedSet.has(idx)
      );
      if (fresh.length === 0) break;
      const chosen = fresh[0];
      pickedIndices.push(chosen);
      pickedSet.add(chosen);
      cursor.lastIndex = chosen;
    } else {
      const [chosen] = cursor.queue.splice(nextPos, 1);
      pickedIndices.push(chosen);
      pickedSet.add(chosen);
      cursor.lastIndex = chosen;
    }
  }

  return pickedIndices.map((idx) => pool[idx]);
}

export function drawOneFromDeck<T>(
  deckKey: string,
  pool: readonly T[],
  rng: () => number = Math.random
): T {
  const [item] = drawUniqueFromDeck(deckKey, pool, 1, rng);
  return item;
}

export function resetSessionDecks(prefix?: string): void {
  if (!prefix) {
    sessionDecks.clear();
    return;
  }
  for (const key of Array.from(sessionDecks.keys())) {
    if (key.startsWith(prefix)) {
      sessionDecks.delete(key);
    }
  }
}

/**
 * Shuffles multiple-choice options while accurately tracking the updated `correctIndex`
 * so repeated mastery cycles never keep answers in memorized button slots.
 */
export function shuffleChoiceOptions(
  options: readonly string[],
  correctIndex: number,
  rng: () => number = Math.random
): { options: string[]; correctIndex: number } {
  const tagged = options.map((text, idx) => ({
    text,
    isCorrect: idx === correctIndex,
  }));
  for (let i = tagged.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [tagged[i], tagged[j]] = [tagged[j], tagged[i]];
  }
  return {
    options: tagged.map((t) => t.text),
    correctIndex: Math.max(
      0,
      tagged.findIndex((t) => t.isCorrect)
    ),
  };
}

// ============================================================================
// 1. LABOR KART EXPANDED QUESTION BANK (Curated + Full Practice Integration)
// ============================================================================
const KART_BOOST_REWARDS = [
  'SUPER MUSHROOM TURBO BOOST!',
  'PURPLE ULTRA MINI-TURBO!',
  'INVINCIBILITY STAR HYPERSPEED!',
  'GOLDEN DASH MUSHROOM!',
  'RED SHELL TARGET LOCK!',
  'LIGHTNING BOLT OVERTAKE!',
  'TRIPLE GREEN SHELLS!',
  'FIRE FLOWER SPEED SURGE!',
] as const;

const CURATED_KART_QUESTIONS: KartQuestionItem[] = [
  {
    id: 'kart-1',
    question: 'What is the minimum overtime pay rate for work rendered on an ordinary working day?',
    options: ['125% of hourly rate', '130% of hourly rate', '150% of hourly rate', '200% of hourly rate'],
    correctIndex: 0,
    boostReward: 'SUPER MUSHROOM TURBO BOOST!',
  },
  {
    id: 'kart-2',
    question: 'Between what hours does the statutory 10% Night Shift Differential apply?',
    options: ['8:00 PM to 4:00 AM', '10:00 PM to 6:00 AM', '12:00 MN to 8:00 AM', '9:00 PM to 5:00 AM'],
    correctIndex: 1,
    boostReward: 'RED SHELL TARGET LOCK!',
  },
  {
    id: 'kart-3',
    question: 'Under R.A. 11360, what percentage of collected service charges goes to covered employees?',
    options: ['85%', '90%', '100%', '75%'],
    correctIndex: 2,
    boostReward: 'INVINCIBILITY STAR HYPERSPEED!',
  },
  {
    id: 'kart-4',
    question: 'Under R.A. 11210 (World 6), how many paid days of Maternity Leave apply to a live childbirth?',
    options: ['60 days', '78 days', '105 days (+15 solo parent)', '90 days'],
    correctIndex: 2,
    boostReward: 'PURPLE ULTRA MINI-TURBO!',
  },
  {
    id: 'kart-5',
    question: 'How many days of paid Service Incentive Leave (SIL) accrue after 1 year of service under Art. 95?',
    options: ['3 days', '5 days', '7 days', '10 days'],
    correctIndex: 1,
    boostReward: 'TRIPLE GREEN SHELLS!',
  },
  {
    id: 'kart-6',
    question: 'Can an employer offset Monday’s undertime with Tuesday’s overtime work?',
    options: ['Yes, if agreed in writing', 'No, strictly prohibited by Art. 88', 'Yes, within the same payroll week', 'Yes, for rank-and-file'],
    correctIndex: 1,
    boostReward: 'GOLDEN DASH MUSHROOM!',
  },
  {
    id: 'kart-7',
    question: 'What is the daily rate for work rendered on a Regular Holiday that falls on a Rest Day?',
    options: ['200%', '230%', '260%', '300%'],
    correctIndex: 2,
    boostReward: 'LIGHTNING BOLT OVERTAKE!',
  },
  {
    id: 'kart-8',
    question: 'Under R.A. 11861, what is the minimum service requirement for 7-day Solo Parent Leave?',
    options: ['12 months', '6 months', '3 months', '24 months'],
    correctIndex: 1,
    boostReward: 'FIRE FLOWER SPEED SURGE!',
  },
  {
    id: 'kart-9',
    question: 'Power interruptions (brownouts) not exceeding how many minutes are compensable hours worked?',
    options: ['15 minutes', '20 minutes', '30 minutes', '60 minutes'],
    correctIndex: 1,
    boostReward: 'SUPER MUSHROOM TURBO BOOST!',
  },
  {
    id: 'kart-10',
    question: 'What is the daily wage multiplier when working on a Double Regular Holiday falling on a Rest Day?',
    options: ['300%', '330%', '390%', '400%'],
    correctIndex: 2,
    boostReward: 'INVINCIBILITY STAR HYPERSPEED!',
  },
  {
    id: 'kart-11',
    question: 'Under R.A. 8187, Paternity Leave of 7 calendar days applies up to how many deliveries of the lawful spouse?',
    options: ['First 2 deliveries', 'First 3 deliveries', 'First 4 deliveries', 'Unlimited deliveries'],
    correctIndex: 2,
    boostReward: 'PURPLE ULTRA MINI-TURBO!',
  },
  {
    id: 'kart-12',
    question: 'Under R.A. 9710 (Magna Carta of Women), what is the maximum paid Special Leave for gynecological surgery?',
    options: ['15 days', '30 days', 'Up to 2 months', '105 days'],
    correctIndex: 2,
    boostReward: 'GOLDEN DASH MUSHROOM!',
  },
  {
    id: 'kart-13',
    question: 'Under R.A. 9262 (Anti-VAWC), how many paid leave days are granted upon presenting a Protection Order certification?',
    options: ['Up to 5 days', 'Up to 7 days', 'Up to 10 days (extendible)', 'Up to 30 days'],
    correctIndex: 2,
    boostReward: 'LIGHTNING BOLT OVERTAKE!',
  },
  {
    id: 'kart-14',
    question: 'Under DOLE D.O. 174-17, what is the minimum substantial capital required for legitimate contracting?',
    options: ['₱1,000,000', '₱3,000,000', '₱5,000,000', '₱10,000,000'],
    correctIndex: 2,
    boostReward: 'RED SHELL TARGET LOCK!',
  },
  {
    id: 'kart-15',
    question: 'Under P.D. 851, 13th Month Pay must be paid to rank-and-file employees not later than:',
    options: ['December 15', 'December 24', 'December 30', 'December 31'],
    correctIndex: 1,
    boostReward: 'FIRE FLOWER SPEED SURGE!',
  },
  {
    id: 'kart-16',
    question: 'Under R.A. 10028, compensable lactation breaks for nursing employees must be at least:',
    options: ['15 mins per shift', '20 mins per shift', '40 mins per 8-hour work period', '60 mins unpaid'],
    correctIndex: 2,
    boostReward: 'SUPER MUSHROOM TURBO BOOST!',
  },
];

export const KART_QUESTION_BANK: KartQuestionItem[] = [
  ...CURATED_KART_QUESTIONS,
  ...PRACTICE_QUESTIONS.slice(0, 24).map((pq, idx) => ({
    id: `kart-pq-${pq.id}`,
    question: pq.scenario,
    options: pq.options,
    correctIndex: pq.correctIndex,
    boostReward: KART_BOOST_REWARDS[idx % KART_BOOST_REWARDS.length],
  })),
];

export function drawKartQuestion(rng: () => number = Math.random): KartQuestionItem {
  const raw = drawOneFromDeck('labor_kart_questions', KART_QUESTION_BANK, rng);
  const shuffled = shuffleChoiceOptions(raw.options, raw.correctIndex, rng);
  return {
    ...raw,
    options: shuffled.options,
    correctIndex: shuffled.correctIndex,
  };
}

// ============================================================================
// 2. TOAD HOUSE TREASURY SLOTS TRIVIA BANK (20 Distinct Questions)
// ============================================================================
export const SLOTS_TRIVIA_BANK: SlotTriviaItem[] = [
  {
    id: 'slot-1',
    q: 'Under R.A. 11210, how many additional paid days does a qualified Solo Parent mother get on top of 105 days?',
    opts: ['7 days', '15 days', '30 days'],
    ans: 1,
  },
  {
    id: 'slot-2',
    q: 'Under Art. 95 (Auto Bus), when does the 3-year prescriptive period for unpaid SIL start to run?',
    opts: ['Every Dec 31', 'Upon demand/refusal or separation', 'First day of work'],
    ans: 1,
  },
  {
    id: 'slot-3',
    q: 'Under R.A. 11861, what is the dependent child age threshold for Solo Parents Welfare coverage?',
    opts: ['Below 18 years', '22 years old or below', '25 years old'],
    ans: 1,
  },
  {
    id: 'slot-4',
    q: 'Under D.O. 174-17, what is the minimum paid-up capital or net worth for legitimate job contracting?',
    opts: ['₱1,000,000', '₱3,000,000', '₱5,000,000'],
    ans: 2,
  },
  {
    id: 'slot-5',
    q: 'Up to how many days of R.A. 11210 Maternity Leave can a mother allocate to the child’s father?',
    opts: ['Up to 5 days', 'Up to 7 days', 'Up to 15 days'],
    ans: 1,
  },
  {
    id: 'slot-6',
    q: 'How many paid days of Maternity Leave apply to miscarriage or emergency termination of pregnancy?',
    opts: ['45 days', '60 days', '78 days'],
    ans: 1,
  },
  {
    id: 'slot-7',
    q: 'What is the minimum regular meal-off period mandated under Article 85 of the Labor Code?',
    opts: ['Not less than 30 mins', 'Not less than 60 mins', 'Not less than 45 mins'],
    ans: 1,
  },
  {
    id: 'slot-8',
    q: 'After 24 consecutive hours of normal workdays, what is the minimum weekly rest period under Art. 91?',
    opts: ['At least 12 consecutive hrs', 'At least 24 consecutive hrs', 'At least 36 consecutive hrs'],
    ans: 1,
  },
  {
    id: 'slot-9',
    q: 'Retail & service establishments regularly employing fewer than how many workers are exempt from Holiday Pay?',
    opts: ['Fewer than 5 workers', 'Fewer than 10 workers', 'Fewer than 20 workers'],
    ans: 1,
  },
  {
    id: 'slot-10',
    q: 'Retail & service establishments employing NOT MORE than how many workers are exempt from Night Shift Differential?',
    opts: ['5 workers', '10 workers', '15 workers'],
    ans: 0,
  },
  {
    id: 'slot-11',
    q: 'What is the daily pay rate for working 8 hours on a Special Non-Working Day falling on a Rest Day?',
    opts: ['130% daily rate', '150% daily rate', '200% daily rate'],
    ans: 1,
  },
  {
    id: 'slot-12',
    q: 'Under R.A. 9231, a working child below 15 years old may work at most how many hours per day?',
    opts: ['4 hours / day', '6 hours / day', '8 hours / day'],
    ans: 0,
  },
  {
    id: 'slot-13',
    q: 'Under Batas Kasambahay (R.A. 10361), what is the minimum aggregate daily rest period of a domestic worker?',
    opts: ['6 hours per day', '8 hours per day', '10 hours per day'],
    ans: 1,
  },
  {
    id: 'slot-14',
    q: 'Which harassment law punishes peer-to-peer and subordinate-to-superior workplace harassment without requiring moral ascendancy?',
    opts: ['R.A. 7877 (1995)', 'R.A. 11313 (Safe Spaces Act)', 'P.D. 851'],
    ans: 1,
  },
  {
    id: 'slot-15',
    q: 'Under Art. 114, weekly deductions for proven employee loss/damage cannot exceed what share of weekly wage?',
    opts: ['10% of weekly wage', '20% of weekly wage', '50% of weekly wage'],
    ans: 1,
  },
  {
    id: 'slot-16',
    q: 'In the Four-Fold Test of employment relationship, which element is the most decisive?',
    opts: ['Payment of wages', 'Power of Control over means & methods', 'Power of selection'],
    ans: 1,
  },
  {
    id: 'slot-17',
    q: 'Is unused Paternity Leave (R.A. 8187) convertible to cash if the father does not avail of it?',
    opts: ['Yes, at year-end', 'No, strictly non-convertible to cash', 'Half-convertible'],
    ans: 1,
  },
  {
    id: 'slot-18',
    q: 'Under R.A. 11165 (Telecommuting Act), work-from-home employees are entitled to what statutory standard?',
    opts: ['Reduced WFH rates', 'Fair Treatment parity with on-site workers', 'Exempt from overtime'],
    ans: 1,
  },
  {
    id: 'slot-19',
    q: 'Under R.A. 9710 Sec. 18, how much aggregate employment service in the past 12 months qualifies for Special Gynecological Leave?',
    opts: ['At least 3 months', 'At least 6 months', 'At least 12 months'],
    ans: 1,
  },
  {
    id: 'slot-20',
    q: 'Under R.A. 10911 (Anti-Age Discrimination), can job ads specify an arbitrary age ceiling without a BFOQ?',
    opts: ['Yes, employer prerogative', 'No, strictly prohibited', 'Allowed for offices'],
    ans: 1,
  },
];

export function drawSlotTriviaQuestion(rng: () => number = Math.random): SlotTriviaItem {
  const raw = drawOneFromDeck('slots_trivia', SLOTS_TRIVIA_BANK, rng);
  const shuffled = shuffleChoiceOptions(raw.opts, raw.ans, rng);
  return {
    ...raw,
    opts: shuffled.options,
    ans: shuffled.correctIndex,
  };
}

// ============================================================================
// 3. WORLD 6 STATUTORY LEAVE CLINIC BANK (18 Distinct Cases)
// ============================================================================
export const WORLD6_LEAVE_CLINIC_BANK: LeaveClinicCaseItem[] = [
  {
    id: 'w6c-1',
    scenario: 'Rank-and-file employee completes 12 months of service (including authorized absences) and wants unused leave converted to cash at year-end.',
    correctLeave: '5 Days SIL (Art. 95)',
    options: ['5 Days SIL (Art. 95)', '7 Days Paternity Leave', '10 Days VAWC Leave', '60 Days Magna Carta'],
    statute: 'Labor Code Art. 95 — Commutable to cash at year-end based on current wage rate!',
  },
  {
    id: 'w6c-2',
    scenario: 'Female private-sector worker gives live childbirth and is a qualified Solo Parent with a valid Solo Parent ID.',
    correctLeave: '120 Days Paid Maternity (R.A. 11210)',
    options: ['60 Days Miscarriage Leave', '105 Days Standard Leave', '120 Days Paid Maternity (R.A. 11210)', '7 Days Parental Leave'],
    statute: 'R.A. 11210 — 105 days live childbirth + 15 additional paid days for solo parents!',
  },
  {
    id: 'w6c-3',
    scenario: 'Married male employee cohabiting with his legitimate spouse attends her 3rd delivery.',
    correctLeave: '7 Calendar Days Paternity (R.A. 8187)',
    options: ['5 Working Days SIL', '7 Calendar Days Paternity (R.A. 8187)', '15 Days Solo Leave', '10 Days VAWC Leave'],
    statute: 'R.A. 8187 — Covers the first 4 deliveries or miscarriages of the legitimate cohabiting spouse!',
  },
  {
    id: 'w6c-4',
    scenario: 'Solo parent employee with 6 months of service needs paid time off to attend parental duties for a 19-year-old dependent child.',
    correctLeave: '7 Working Days Solo Parent (R.A. 11861)',
    options: ['5 Days SIL (Art. 95)', '7 Working Days Solo Parent (R.A. 11861)', '15 Days Solo Maternity', 'Unpaid Personal Leave'],
    statute: 'R.A. 11861 — Minimum service lowered from 1 year to 6 months; dependent child age raised to <= 22 years!',
  },
  {
    id: 'w6c-5',
    scenario: 'Female employee undergoes major surgery caused by a gynecological disorder after 8 months aggregate service in the past year.',
    correctLeave: 'Up to 2 Months Special Leave (R.A. 9710)',
    options: ['Up to 2 Months Special Leave (R.A. 9710)', '60 Days Miscarriage Leave', '10 Days VAWC Leave', '5 Days SIL'],
    statute: 'R.A. 9710 Sec. 18 — Full pay based on gross monthly compensation; non-convertible to cash!',
  },
  {
    id: 'w6c-6',
    scenario: 'Female employee presents a Barangay Protection Order certification to attend medical and legal proceedings for violence against her and her child.',
    correctLeave: 'Up to 10 Paid Days VAWC Leave (R.A. 9262)',
    options: ['5 Days SIL', '7 Days Solo Parent Leave', 'Up to 10 Paid Days VAWC Leave (R.A. 9262)', '30 Days Unpaid Leave'],
    statute: 'R.A. 9262 Sec. 43 — Paid leave up to 10 days, extendible as specified in the BPO/TPO/PPO!',
  },
  {
    id: 'w6c-7',
    scenario: 'Unmarried female worker suffers an emergency termination of pregnancy (miscarriage) on her 5th pregnancy.',
    correctLeave: '60 Days Paid Maternity Leave (R.A. 11210)',
    options: ['60 Days Paid Maternity Leave (R.A. 11210)', 'No Leave (Exceeds 4-Delivery Cap)', '105 Days Live Birth Leave', '7 Days Parental Leave'],
    statute: 'R.A. 11210 — 60 days full pay for miscarriage/ETP in EVERY pregnancy regardless of civil status or frequency!',
  },
  {
    id: 'w6c-8',
    scenario: 'Married father receives 7 allocated maternity leave days from his wife in addition to his own Paternity Leave.',
    correctLeave: '14 Total Paid Days (7d RA 8187 + 7d RA 11210)',
    options: ['7 Calendar Days Maximum', '14 Total Paid Days (7d RA 8187 + 7d RA 11210)', '21 Paid Days', '10 Paid Days'],
    statute: 'R.A. 11210 Sec. 6 — Up to 7 allocated days stack ON TOP of 7-day Paternity Leave!',
  },
  {
    id: 'w6c-9',
    scenario: 'Unmarried partner of a mother giving live birth is allocated 7 days from her 105-day maternity leave.',
    correctLeave: '7 Allocated Days (R.A. 11210 Transfer)',
    options: ['0 Days (Unmarried Father Barred)', '7 Allocated Days (R.A. 11210 Transfer)', '7 Days Paternity Leave (R.A. 8187)', '14 Paid Days'],
    statute: 'R.A. 11210 — Mother may allocate up to 7 days to the child’s father WHETHER OR NOT married to her!',
  },
  {
    id: 'w6c-10',
    scenario: 'Domestic worker (Kasambahay) completes 1 full year of household service with the same employer and asks about leave.',
    correctLeave: '5 Days Kasambahay SIL (Non-Convertible)',
    options: ['5 Days Kasambahay SIL (Non-Convertible)', '5 Days Cash-Commutable SIL', '7 Days Parental Leave', 'No Leave for Kasambahay'],
    statute: 'R.A. 10361 Sec. 29 — Kasambahay gets 5 days paid SIL, but unlike Art. 95 it is non-cumulative & non-convertible to cash!',
  },
  {
    id: 'w6c-11',
    scenario: 'Bus driver paid purely by commission retires after 10 years without ever receiving Service Incentive Leave and files a claim.',
    correctLeave: 'All 10 Years Accrued SIL (Auto Bus Rule)',
    options: ['Only Last 3 Years SIL', 'All 10 Years Accrued SIL (Auto Bus Rule)', 'Exempt Piece-Rate Worker', 'Forfeited Annually'],
    statute: 'Auto Bus Transport v. Bautista — 3-year prescription runs from demand/refusal or retirement, not each year-end!',
  },
  {
    id: 'w6c-12',
    scenario: 'Company already grants 10 days of paid Vacation Leave per year to all rank-and-file workers; worker demands +5 days statutory SIL.',
    correctLeave: 'Exempt from Extra SIL (Already >= 5 VL Days)',
    options: ['Must Grant +5 Extra SIL Days', 'Exempt from Extra SIL (Already >= 5 VL Days)', 'Must Convert All 10 VL Days', 'Must Pay Double'],
    statute: 'Art. 95 Implementing Rules — Establishments already granting at least 5 days paid vacation leave are exempt!',
  },
  {
    id: 'w6c-13',
    scenario: 'Female worker delivers via Caesarean section (CS) in a private hospital and asks whether CS increases her 105-day maternity leave.',
    correctLeave: '105 Days Uniform Live-Birth Benefit',
    options: ['120 Days Because of CS', '78 Days CS Rate', '105 Days Uniform Live-Birth Benefit', '60 Days CS Rate'],
    statute: 'R.A. 11210 — 105 days applies uniformly to both normal and Caesarean deliveries (+15d only if Solo Parent)!',
  },
  {
    id: 'w6c-14',
    scenario: 'Legal guardian bearing sole parental responsibility for a 10-year-old nephew for 8 months applies for 7-day Solo Parent Leave.',
    correctLeave: 'Qualified for 7 Working Days (R.A. 11861)',
    options: ['Disqualified (Biological Parents Only)', 'Qualified for 7 Working Days (R.A. 11861)', 'Needs 12 Months Service First', 'Entitled to 5 Days Only'],
    statute: 'R.A. 11861 — Legal guardians/foster parents solely providing parental care with a Solo Parent ID and >=6 mos service qualify!',
  },
  {
    id: 'w6c-15',
    scenario: 'Employee of a sari-sari retail store regularly employing 6 workers demands 5-day statutory Service Incentive Leave.',
    correctLeave: 'Exempt (<10 Workers Retail/Service Exemption)',
    options: ['Entitled to 5 Days SIL', 'Exempt (<10 Workers Retail/Service Exemption)', 'Entitled to 3 Days SIL', 'Entitled to 7 Days SIL'],
    statute: 'Art. 95 — Retail and service establishments regularly employing fewer than 10 workers are exempt from SIL!',
  },
  {
    id: 'w6c-16',
    scenario: 'Private employer pays SSS maternity reimbursement to a female worker on live-birth leave but refuses to pay the gap between SSS ceiling and her full pay.',
    correctLeave: 'Employer Must Pay Full Salary Differential',
    options: ['SSS Benefit Alone Suffices', 'Employer Must Pay Full Salary Differential', 'Half Differential Only', 'Optional Bonus Only'],
    statute: 'R.A. 11210 Sec. 5 — Private employers must pay the salary differential unless specifically qualified as an exempt distressed/micro enterprise!',
  },
  {
    id: 'w6c-17',
    scenario: 'Married male worker’s lawful wife suffers a sad miscarriage on their 2nd pregnancy; he applies for Paternity Leave.',
    correctLeave: '7 Calendar Days Paternity Leave Applies',
    options: ['Denied (Live Birth Only)', '7 Calendar Days Paternity Leave Applies', '3 Days Bereavement Only', '60 Days Leave'],
    statute: 'R.A. 8187 Sec. 3 — Paternity Leave covers childbirth OR miscarriage for the first 4 deliveries/miscarriages!',
  },
  {
    id: 'w6c-18',
    scenario: 'Solo parent marries a partner and ceases to hold sole parental responsibility after notifying HR.',
    correctLeave: '7-Day Solo Parent Leave Terminates Upon Status Change',
    options: ['Continues Permanently Forever', '7-Day Solo Parent Leave Terminates Upon Status Change', 'Converts to Cash Bonus', 'Doubles to 14 Days'],
    statute: 'R.A. 8972 / R.A. 11861 — A change in status ceasing solo parenthood terminates future Solo Parent Leave eligibility!',
  },
];

export function drawWorld6LeaveCase(rng: () => number = Math.random): LeaveClinicCaseItem {
  const raw = drawOneFromDeck('world6_leave_clinic', WORLD6_LEAVE_CLINIC_BANK, rng);
  const shuffled = shuffleChoiceOptions(raw.options, raw.options.indexOf(raw.correctLeave), rng);
  return {
    ...raw,
    options: shuffled.options,
  };
}

// ============================================================================
// 4. LAKITU CLOUD CLIMBER TIERED BANKS (5 Rungs x 5 Questions = 25 Items)
// ============================================================================
export const CLIMBER_TIER_BANKS: Record<number, Omit<ClimberRungItem, 'rung' | 'reward'>[]> = {
  1: [
    { id: 'c1-1', q: 'Rest period of short duration (5 to 20 mins) is:', opts: ['Compensable hours worked', 'Deductible from pay'], ans: 0 },
    { id: 'c1-2', q: 'Normal hours of work of an employee per day under Art. 83:', opts: ['Shall not exceed 8 hours', 'Shall not exceed 10 hours'], ans: 0 },
    { id: 'c1-3', q: 'Minimum statutory non-compensable regular meal break under Art. 85:', opts: ['Not less than 60 minutes', 'Not less than 20 minutes'], ans: 0 },
    { id: 'c1-4', q: 'Statutory Night Shift Differential window under Art. 86:', opts: ['10:00 PM to 6:00 AM', '8:00 PM to 4:00 AM'], ans: 0 },
    { id: 'c1-5', q: 'Deadline for paying mandatory 13th Month Pay under P.D. 851:', opts: ['Not later than December 24', 'January 15 of next year'], ans: 0 },
  ],
  2: [
    { id: 'c2-1', q: 'Ordinary working day Overtime multiplier under Art. 87 is:', opts: ['125% hourly rate', '130% hourly rate'], ans: 0 },
    { id: 'c2-2', q: 'Work rendered on a scheduled Weekly Rest Day (first 8 hours) pays:', opts: ['130% daily rate', '150% daily rate'], ans: 0 },
    { id: 'c2-3', q: 'Unworked Regular Holiday when employee was present the workday prior pays:', opts: ['100% daily wage', '0% no work no pay'], ans: 0 },
    { id: 'c2-4', q: 'Can undertime on Monday be offset by overtime rendered on Tuesday?', opts: ['No, prohibited by Art. 88', 'Yes, within same week'], ans: 0 },
    { id: 'c2-5', q: 'Service Incentive Leave (Art. 95) after 1 year of service grants:', opts: ['5 commutable days', '7 non-commutable days'], ans: 0 },
  ],
  3: [
    { id: 'c3-1', q: 'Service Charge distribution to covered employees under R.A. 11360:', opts: ['85% employees / 15% management', '100% covered employees'], ans: 1 },
    { id: 'c3-2', q: 'Minimum substantial capital / net worth for legitimate contracting (D.O. 174):', opts: ['At least ₱5,000,000', 'At least ₱1,000,000'], ans: 0 },
    { id: 'c3-3', q: 'Paid Maternity Leave for live childbirth under R.A. 11210 (non-solo parent):', opts: ['105 days with full pay', '60 days with full pay'], ans: 0 },
    { id: 'c3-4', q: 'Minimum service required for 7-day Solo Parent Leave under R.A. 11861:', opts: ['At least 6 months', 'At least 12 months'], ans: 0 },
    { id: 'c3-5', q: 'Maximum daily hours for a working child below 15 years old (R.A. 9231):', opts: ['4 hours/day (20 hrs/wk)', '8 hours/day (40 hrs/wk)'], ans: 0 },
  ],
  4: [
    { id: 'c4-1', q: 'Can Kasambahay unused 5-day SIL (R.A. 10361) be converted to cash?', opts: ['No, non-cumulative & non-convertible', 'Yes, commutable every Dec'], ans: 0 },
    { id: 'c4-2', q: 'Are Facilities (meals/lodging) deductible without written employee authorization?', opts: ['Never — written consent is mandatory', 'Yes, if fair value'], ans: 0 },
    { id: 'c4-3', q: 'Does the Safe Spaces Act (R.A. 11313) require moral ascendancy in workplace harassment?', opts: ['No — covers peers & subordinates too', 'Yes — superiors only'], ans: 0 },
    { id: 'c4-4', q: 'When does the 3-year prescription for unpaid SIL begin (Auto Bus doctrine)?', opts: ['From employer refusal upon demand / separation', 'Automatically every Dec 31'], ans: 0 },
    { id: 'c4-5', q: 'How many Maternity Leave days may a mother allocate to an unmarried father (R.A. 11210)?', opts: ['Up to 7 days', '0 days if unmarried'], ans: 0 },
  ],
  5: [
    { id: 'c5-1', q: 'Double Regular Holiday worked on a scheduled Rest Day pays:', opts: ['300% daily wage', '390% daily wage'], ans: 1 },
    { id: 'c5-2', q: 'Overtime hourly multiplier on a Regular Holiday falling on a Rest Day:', opts: ['260% × 130% = 338% hourly', '200% × 125% = 250% hourly'], ans: 0 },
    { id: 'c5-3', q: 'Two successive Regular Holidays: absent WITHOUT pay day before, did not work either holiday:', opts: ['Disentitled to BOTH holidays', 'Paid 100% for 2nd holiday'], ans: 0 },
    { id: 'c5-4', q: 'Special Leave for Women after gynecological surgery (R.A. 9710 Sec. 18):', opts: ['Up to 2 months full pay (6 mos service in last 12m)', 'Up to 10 days commutable'], ans: 0 },
    { id: 'c5-5', q: 'Liability of Principal in prohibited Labor-Only Contracting under Art. 106 / D.O. 174:', opts: ['Direct Employer for ALL purposes', 'Solidary for unpaid wages only'], ans: 0 },
  ],
};

const CLIMBER_REWARDS = [10, 22, 40, 70, 120] as const;

export function drawClimberTowerRun(rng: () => number = Math.random): ClimberRungItem[] {
  return ([1, 2, 3, 4, 5] as const).map((rungNum, idx) => {
    const raw = drawOneFromDeck(`climber_rung_${rungNum}`, CLIMBER_TIER_BANKS[rungNum], rng);
    const shuffled = shuffleChoiceOptions(raw.opts, raw.ans, rng);
    return {
      id: raw.id,
      rung: rungNum,
      reward: CLIMBER_REWARDS[idx],
      q: raw.q,
      opts: shuffled.options,
      ans: shuffled.correctIndex,
    };
  });
}

// ============================================================================
// 5. WHACK-A-GOOMBA DEDUCTION TARGETS (22 Distinct Items)
// ============================================================================
export const GOOMBA_DEDUCTION_BANK: DeductionPipeTargetItem[] = [
  { id: 'gd-1', label: '5% Cash Shortage Reserve (No Hearing)', isIllegal: true, ruleNote: 'Illegal under Art. 114 without proving fault & due process!' },
  { id: 'gd-2', label: 'Forced Company Store Grocery Cut', isIllegal: true, ruleNote: 'Prohibited by Art. 112 (Non-Interference in Disposal of Wages)!' },
  { id: 'gd-3', label: 'Promissory Chits / Bowser Tokens', isIllegal: true, ruleNote: 'Void under Art. 102 — wages must be paid in legal tender!' },
  { id: 'gd-4', label: 'Rice & Ham Deducted from 13th Month', isIllegal: true, ruleNote: 'Substitute payment for 13th Month Pay is void under P.D. 851!' },
  { id: 'gd-5', label: '15% Management Cut from Service Charge', isIllegal: true, ruleNote: 'Illegal! R.A. 11360 mandates 100% distribution to covered workers!' },
  { id: 'gd-6', label: 'Deducting 15-Min Coffee Rest Break', isIllegal: true, ruleNote: 'Short breaks (5–20 mins) are compensable hours worked!' },
  { id: 'gd-7', label: 'Offsetting Undertime Against Overtime', isIllegal: true, ruleNote: 'Strictly prohibited by Article 88 of the Labor Code!' },
  { id: 'gd-8', label: '50% Weekly Deduction for Lost Tool', isIllegal: true, ruleNote: 'Exceeds the 20% weekly wage deduction ceiling under Art. 114!' },
  { id: 'gd-9', label: 'Meal Deduction Without Written Consent', isIllegal: true, ruleNote: 'Facilities cannot be deducted without written employee consent!' },
  { id: 'gd-10', label: 'Deducting Company Safety Helmet Cost', isIllegal: true, ruleNote: 'PPE & work tools are employer Supplements — never deductible!' },
  { id: 'gd-11', label: 'Kickback Fee for Job Retention', isIllegal: true, ruleNote: 'Wage kickbacks are unlawful under Article 115 / 116!' },
  { id: 'gd-12', label: 'Withholding Final Pay as Retaliation', isIllegal: true, ruleNote: 'Unlawful withholding of wages violates Article 116!' },
  { id: 'gd-13', label: 'Deducting 40-Min Nursing Break (RA 10028)', isIllegal: true, ruleNote: 'Lactation breaks are compensable working time under R.A. 10028!' },
  { id: 'gd-14', label: 'Placement Fee Deducted from Kasambahay', isIllegal: true, ruleNote: 'R.A. 10361 forbids charging recruitment fees to a Kasambahay!' },
  { id: 'gd-15', label: 'SSS, PhilHealth & Pag-IBIG Contributions', isIllegal: false, ruleNote: 'Lawful statutory deduction mandated by social legislation!' },
  { id: 'gd-16', label: 'Union Dues with Written Check-Off', isIllegal: false, ruleNote: 'Lawful deduction expressly authorized under Art. 113(b)!' },
  { id: 'gd-17', label: 'Insurance Premium (Employee Written Consent)', isIllegal: false, ruleNote: 'Lawful deduction authorized under Art. 113(a)!' },
  { id: 'gd-18', label: 'BIR Withholding Income Tax', isIllegal: false, ruleNote: 'Lawful statutory tax withholding mandated by NIRC!' },
  { id: 'gd-19', label: 'Co-op Loan Payment (Written Authorization)', isIllegal: false, ruleNote: 'Valid third-party payment authorized in writing with zero employer fee!' },
  { id: 'gd-20', label: 'Agency Fee Assessed on Non-Union Beneficiaries', isIllegal: false, ruleNote: 'Lawful CBA agency fee recognized under the Labor Code!' },
  { id: 'gd-21', label: 'Fair-Value Meals with Written Voluntary Consent', isIllegal: false, ruleNote: 'Lawful Facility deduction when customary, fair-value & authorized!' },
  { id: 'gd-22', label: '15% Weekly Cut for Proven Fault After Hearing', isIllegal: false, ruleNote: 'Valid under Art. 114 (proven fault + due process + <=20% weekly wage)!' },
];

export function drawGoombaTargets(
  count: number,
  rng: () => number = Math.random
): DeductionPipeTargetItem[] {
  return drawUniqueFromDeck('whack_a_goomba', GOOMBA_DEDUCTION_BANK, count, rng);
}

// ============================================================================
// 6. MULTIPLIER MEMORY MATCH BANK (16 Distinct Pairs -> Deal 8 Per Board)
// ============================================================================
export const MULTIPLIER_MEMORY_BANK: MultiplierMemoryPairItem[] = [
  { id: 'mp-1', scenario: 'Ordinary Day Overtime', rate: '125% Hourly' },
  { id: 'mp-2', scenario: 'Worked Special Non-Working Day', rate: '130% Daily' },
  { id: 'mp-3', scenario: 'Special Day + Rest Day', rate: '150% Daily' },
  { id: 'mp-4', scenario: 'Worked Regular Holiday', rate: '200% Daily' },
  { id: 'mp-5', scenario: 'Regular Holiday + Rest Day', rate: '260% Daily' },
  { id: 'mp-6', scenario: 'Worked Double Regular Holiday', rate: '300% Daily' },
  { id: 'mp-7', scenario: 'Double Holiday + Rest Day', rate: '390% Daily' },
  { id: 'mp-8', scenario: 'Night Shift Differential (10PM–6AM)', rate: '+10% Hourly' },
  { id: 'mp-9', scenario: 'Expanded Maternity (Live Birth)', rate: '105 Paid Days' },
  { id: 'mp-10', scenario: 'Solo Parent Maternity Total', rate: '120 Paid Days' },
  { id: 'mp-11', scenario: 'Miscarriage / ETP Maternity', rate: '60 Paid Days' },
  { id: 'mp-12', scenario: 'Service Incentive Leave (Art. 95)', rate: '5 Commutable Days' },
  { id: 'mp-13', scenario: 'Solo Parent Leave (R.A. 11861)', rate: '7 Working Days' },
  { id: 'mp-14', scenario: 'Anti-VAWC Victim Leave (R.A. 9262)', rate: '10 Paid Days' },
  { id: 'mp-15', scenario: 'Service Charge Share (R.A. 11360)', rate: '100% Employees' },
  { id: 'mp-16', scenario: 'Rest Day Overtime Hourly Rate', rate: '169% Hourly' },
];

export function drawMultiplierMemoryPairs(
  pairCount = 8,
  rng: () => number = Math.random
): MultiplierMemoryPairItem[] {
  return drawUniqueFromDeck('multiplier_memory_pairs', MULTIPLIER_MEMORY_BANK, pairCount, rng);
}

// ============================================================================
// 7. CONTRACTOR BUSTER DOCKETS (14 Distinct D.O. 174 Cases -> Deal 6 Per Run)
// ============================================================================
export const CONTRACTOR_DOCKET_BANK: ContractorDocketItem[] = [
  {
    id: 'cd-1',
    agencyName: 'Boo Ghost Manpower Services',
    capital: '₱850,000 Paid-Up Capital',
    controlHolder: 'Principal factory supervisor dictates assembly methods & discipline',
    workRelation: 'Directly related to principal assembly line',
    registration: 'Unregistered with DOLE',
    isLaborOnly: true,
    verdictNote: 'LABOR-ONLY CONTRACTING! Capital is below ₱5M, unregistered, and principal exercises direct control.',
  },
  {
    id: 'cd-2',
    agencyName: 'Toadstool Tech IT Solutions Inc.',
    capital: '₱12,000,000 Paid-Up Capital + Own Servers & Laptops',
    controlHolder: 'Toadstool IT Project Lead supervises methods; Principal checks final deliverables only',
    workRelation: 'Specialized cloud software maintenance',
    registration: 'Valid DOLE D.O. 174 Certificate of Registration',
    isLaborOnly: false,
    verdictNote: 'LEGITIMATE JOB CONTRACTING! Exceeds ₱5M substantial capital, registered, and retains free control over means & methods.',
  },
  {
    id: 'cd-3',
    agencyName: 'Koopa Shell Merchandising Co.',
    capital: '₱1,500,000 Net Worth (No tools or equipment)',
    controlHolder: 'Department store manager assigns schedules and store rules',
    workRelation: 'Cashiers & sales clerks performing core retail operations',
    registration: 'Expired DOLE Registration',
    isLaborOnly: true,
    verdictNote: 'LABOR-ONLY CONTRACTING! Lacks ₱5M substantial capital/investment and workers perform core business under principal control.',
  },
  {
    id: 'cd-4',
    agencyName: 'Starlight Shield Security Agency',
    capital: '₱8,500,000 Paid-Up Capital + Licensed Firearms & Radios',
    controlHolder: 'Agency Detachment Commander controls guard deployment & SOPs',
    workRelation: 'Perimeter facility security services',
    registration: 'Active DOLE D.O. 174 & SOSIA Registration',
    isLaborOnly: false,
    verdictNote: 'LEGITIMATE CONTRACTING! Substantial capital >= ₱5M, distinct equipment, and independent control.',
  },
  {
    id: 'cd-5',
    agencyName: 'Shy Guy In-House Placement Corp.',
    capital: '₱6,000,000 Capital (In-House Agency created by Principal)',
    controlHolder: 'Managed by Principal HR Director exclusively for Principal’s own plant',
    workRelation: 'Plant machine operators',
    registration: 'Registered, but operates as an In-House Agency',
    isLaborOnly: true,
    verdictNote: 'ILLEGAL UNDER D.O. 174 Sec. 6! In-house agencies operating exclusively for the principal are strictly prohibited!',
  },
  {
    id: 'cd-6',
    agencyName: 'Yoshi Express Logistics & Fleet Corp.',
    capital: '₱18,000,000 Paid-Up Capital + 24 Refrigerated Trucks',
    controlHolder: 'Yoshi Fleet Dispatchers control driver routes & safety protocols',
    workRelation: 'Multi-client cold-chain delivery across Luzon',
    registration: 'Active DOLE D.O. 174 Registration',
    isLaborOnly: false,
    verdictNote: 'LEGITIMATE JOB CONTRACTING! Independent business, >= ₱5M capital, owns fleet, serves multiple clients.',
  },
  {
    id: 'cd-7',
    agencyName: 'Kamek Cabo Labor Cooperative',
    capital: '₱300,000 Subscribed Share Capital (Zero tools)',
    controlHolder: 'Port stevedoring boss ("Cabo") supplies gang under Principal Wharf Supervisor',
    workRelation: 'Core cargo loading & stevedoring',
    registration: 'Unregistered Cabo Group',
    isLaborOnly: true,
    verdictNote: 'PROHIBITED CABO SYSTEM! Supplying workers under the guise of a labor group without capital or independent control is illegal.',
  },
  {
    id: 'cd-8',
    agencyName: 'Rosalina CleanRoom Facilities Corp.',
    capital: '₱9,200,000 Paid-Up Capital + Industrial Scrubbers & HEPA Gear',
    controlHolder: 'Rosalina Site Engineers supervise sanitation SOPs across 14 hospitals',
    workRelation: 'Specialized hospital bio-sanitation maintenance',
    registration: 'Valid DOLE D.O. 174 Registration',
    isLaborOnly: false,
    verdictNote: 'LEGITIMATE JOB CONTRACTING! Owns specialized tools, >= ₱5M paid-up capital, and exercises independent control.',
  },
  {
    id: 'cd-9',
    agencyName: 'Dry Bones 5-5-5 Endo Staffing',
    capital: '₱5,200,000 Capital, but forces 5-month repeated resignations',
    controlHolder: 'Agency & Principal collude to re-hire same line cooks every 5 months to block regularization',
    workRelation: 'Core restaurant kitchen operations',
    registration: 'DOLE Registered (Violating Sec. 6)',
    isLaborOnly: true,
    verdictNote: 'PROHIBITED CONTRACTING (D.O. 174 Sec. 6)! Repeatedly hiring workers under short 5-5-5 contracts to circumvent security of tenure is illegal!',
  },
  {
    id: 'cd-10',
    agencyName: 'Peach Culinary Canteen Concessions Inc.',
    capital: '₱7,500,000 Net Worth + Industrial Ovens & Commissary',
    controlHolder: 'Peach Executive Chef hires, pays, and directs all canteen staff independently',
    workRelation: 'Employee cafeteria concession for BPO tower',
    registration: 'Valid DOLE D.O. 174 Registration',
    isLaborOnly: false,
    verdictNote: 'LEGITIMATE CONTRACTING! Distinct catering business with own commissary equipment, >= ₱5M net worth, and full control.',
  },
  {
    id: 'cd-11',
    agencyName: 'Waluigi Blank-Waiver Temp Agency',
    capital: '₱2,100,000 Paid-Up Capital',
    controlHolder: 'Requires recruits to sign undated resignation letters & quitclaims before deployment',
    workRelation: 'Warehouse packers supervised by Principal',
    registration: 'Unregistered',
    isLaborOnly: true,
    verdictNote: 'ILLEGAL & LABOR-ONLY! Below ₱5M capital AND requiring ante-dated resignation letters violates D.O. 174 Sec. 6!',
  },
  {
    id: 'cd-12',
    agencyName: 'Captain Toad Elevator Engineering Corp.',
    capital: '₱25,000,000 Paid-Up Capital + Diagnostic Rigs & Crane Trucks',
    controlHolder: 'Licensed Captain Toad Mechanical Engineers control all lift repairs',
    workRelation: 'High-rise elevator overhaul & certification',
    registration: 'Valid DOLE D.O. 174 & PCAB License',
    isLaborOnly: false,
    verdictNote: 'LEGITIMATE SPECIALIZED CONTRACTING! High capital, specialized engineering equipment, and independent technical control.',
  },
];

export function drawContractorDockets(
  count = 6,
  rng: () => number = Math.random
): ContractorDocketItem[] {
  return drawUniqueFromDeck('contractor_buster_dockets', CONTRACTOR_DOCKET_BANK, count, rng);
}

// ============================================================================
// 8. BOWSER'S BRIDGE STATUTORY DECODER (20 Distinct Terms)
// ============================================================================
export const BRIDGE_DOCTRINE_BANK: BridgeDoctrineItem[] = [
  { id: 'bb-1', word: 'KASAMBAHAY', clue: 'Domestic worker entitled to 5 days non-commutable SIL after 1 year under R.A. 10361' },
  { id: 'bb-2', word: 'DISTORTION', clue: 'Severe contraction of intentional quantitative wage differences between pay groups (Art. 124)' },
  { id: 'bb-3', word: 'FACILITIES', clue: 'Articles/services for worker & family subsistence deductible only with written consent' },
  { id: 'bb-4', word: 'SUPPLEMENTS', clue: 'Extra conveniences furnished for employer benefit — NEVER deductible from wages' },
  { id: 'bb-5', word: 'LACTATION', clue: 'Compensable nursing break of not less than 40 minutes per 8-hour shift (R.A. 10028)' },
  { id: 'bb-6', word: 'PATERNITY', clue: 'Seven calendar days full-pay leave for first 4 deliveries of lawful cohabiting spouse' },
  { id: 'bb-7', word: 'TELECOMMUTING', clue: 'Work-from-home arrangement governed by Fair Treatment parity under R.A. 11165' },
  { id: 'bb-8', word: 'UNDERTIME', clue: 'Cannot be offset by overtime rendered on another day under Article 88' },
  { id: 'bb-9', word: 'MATERNITY', clue: '105 days paid childbirth leave (+15 days for solo parents) under R.A. 11210' },
  { id: 'bb-10', word: 'COMMUTABLE', clue: 'Feature of unused Art. 95 Service Incentive Leave allowing cash conversion at year-end' },
  { id: 'bb-11', word: 'CONTROL', clue: 'Most decisive element of the Four-Fold Test examining means and methods of work' },
  { id: 'bb-12', word: 'SOLIDARY', clue: 'Joint liability of Principal and Legitimate Contractor strictly for unpaid wages (Art. 106)' },
  { id: 'bb-13', word: 'BROWNOUT', clue: 'Power interruption compensable as hours worked when not exceeding 20 minutes' },
  { id: 'bb-14', word: 'GYNECOLOGICAL', clue: 'Disorder surgery granting up to 2 months special full-pay leave under R.A. 9710 Sec. 18' },
  { id: 'bb-15', word: 'DIMINUTION', clue: 'Unilateral reduction or withdrawal of long-established employee benefits barred by Art. 100' },
  { id: 'bb-16', word: 'MANAGERIAL', clue: 'Employees vested with powers to lay down management policies, exempt from Art. 82–90' },
  { id: 'bb-17', word: 'MISCARRIAGE', clue: 'Emergency pregnancy termination entitled to 60 days full-pay leave under R.A. 11210' },
  { id: 'bb-18', word: 'CHECKOFF', clue: 'Lawful deduction of union dues from wages authorized under Article 113(b)' },
  { id: 'bb-19', word: 'PROTECTION', clue: 'Barangay or Court Order certifying eligibility for 10-day paid Anti-VAWC leave (R.A. 9262)' },
  { id: 'bb-20', word: 'APPRENTICE', clue: 'Trainee in an apprenticeable trade whose wage starts at not less than 75% of minimum wage' },
];

export function drawBridgePuzzle(rng: () => number = Math.random): BridgeDoctrineItem {
  return drawOneFromDeck('bowsers_bridge_puzzles', BRIDGE_DOCTRINE_BANK, rng);
}

// ============================================================================
// 9. DR. MARIO HOLIDAY & WAGE PIPE SORTER (18 Distinct Capsules -> Deal 8)
// ============================================================================
export const PAYROLL_CAPSULE_BANK: PayrollCapsuleItem[] = [
  { id: 'pc-1', title: 'Worked Special Working Day (e.g., EDSA Regular Working Day)', bucket: 'base100', note: 'Special Working Days are paid 100% regular daily wage!' },
  { id: 'pc-2', title: 'Unworked Regular Holiday (Present Last Workday Before)', bucket: 'base100', note: 'Unworked Regular Holiday pays 100% daily wage under Art. 94!' },
  { id: 'pc-3', title: 'Ordinary Tuesday 8-Hour Shift (6AM–2PM)', bucket: 'base100', note: 'Ordinary 8-hour shift pays 100% basic daily wage!' },
  { id: 'pc-4', title: 'Paid Service Incentive Leave Day Taken (Art. 95)', bucket: 'base100', note: 'Each availed SIL day pays 100% full basic daily wage!' },
  { id: 'pc-5', title: 'Unworked Special Non-Working Day (Monthly-Paid Worker)', bucket: 'base100', note: 'Monthly-paid employees receive 100% uninterrupted monthly salary!' },
  { id: 'pc-6', title: 'Paid Solo Parent Leave Day Taken (R.A. 11861)', bucket: 'base100', note: 'Solo Parent Leave pays 100% full daily wage including allowances!' },
  { id: 'pc-7', title: 'Worked Scheduled Weekly Rest Day (First 8 Hours)', bucket: 'special130', note: 'Worked Rest Day pays 130% of basic daily rate!' },
  { id: 'pc-8', title: 'Worked Ninoy Aquino Day (Special Non-Working)', bucket: 'special130', note: 'Worked Special Non-Working Day pays 130%!' },
  { id: 'pc-9', title: 'Worked Special Non-Working Day Falling on Rest Day', bucket: 'special130', note: 'Special Non-Working Day + Rest Day pays 150%!' },
  { id: 'pc-10', title: 'Worked All Saints’ Day (Nov 1 Special Non-Working)', bucket: 'special130', note: 'Worked Nov 1 Special Non-Working Day pays 130%!' },
  { id: 'pc-11', title: 'Worked Feast of Immaculate Conception (Dec 8)', bucket: 'special130', note: 'Dec 8 (R.A. 10966) is a Special Non-Working Day paying 130% if worked!' },
  { id: 'pc-12', title: 'Worked Sunday Rest Day Where Nature of Work Has No Regular Schedule', bucket: 'special130', note: 'Work on Sunday/Rest Day pays 130% premium rate under Art. 93!' },
  { id: 'pc-13', title: 'Worked Bonifacio Day (Nov 30 Regular Holiday)', bucket: 'regular200', note: 'Worked Regular Holiday pays 200% for the first 8 hours!' },
  { id: 'pc-14', title: 'Worked Rizal Day Falling on Scheduled Rest Day', bucket: 'regular200', note: 'Worked Regular Holiday + Rest Day pays 260%!' },
  { id: 'pc-15', title: 'Worked Double Regular Holiday (Araw ng Kagitingan + Good Friday)', bucket: 'regular200', note: 'Worked Double Regular Holiday pays 300% daily wage!' },
  { id: 'pc-16', title: 'Worked Double Regular Holiday Falling on Rest Day', bucket: 'regular200', note: 'Double Regular Holiday + Rest Day pays 390% daily wage!' },
  { id: 'pc-17', title: 'Unworked Double Regular Holiday (Qualified Employee)', bucket: 'regular200', note: 'Unworked Double Regular Holiday pays 200% daily wage!' },
  { id: 'pc-18', title: 'Worked National Heroes Day (Last Monday of August)', bucket: 'regular200', note: 'National Heroes Day is a Regular Holiday paying 200% when worked!' },
];

export function drawPayrollCapsules(
  count = 8,
  rng: () => number = Math.random
): PayrollCapsuleItem[] {
  return drawUniqueFromDeck('payroll_capsules', PAYROLL_CAPSULE_BANK, count, rng);
}

// ============================================================================
// 10. COURTROOM BOSS BATTLE BOWSER ATTACKS (12 Distinct Employer Violations)
// ============================================================================
export const COURTROOM_BOWSER_ATTACK_BANK: CourtroomBowserAttackItem[] = [
  {
    id: 'ba-1',
    title: 'FORCED 16-HOUR SHIFT WITHOUT OVERTIME!',
    dialogue: 'Bwahaha! Overtime is a privilege, counsel! Work all night for free!',
    damage: 22,
    weakness: 'fireball_8hr',
  },
  {
    id: 'ba-2',
    title: 'UNDERTIME OFFSET AGAINST TUESDAY OVERTIME!',
    dialogue: 'You were 1 hour late Monday, so your Tuesday overtime is ERASED!',
    damage: 20,
    weakness: 'fireball_8hr',
  },
  {
    id: 'ba-3',
    title: 'UNPAID 18-MINUTE CASTLE BROWNOUT!',
    dialogue: 'The torches flickered out for 18 minutes — I am docking your hourly pay!',
    damage: 19,
    weakness: 'fireball_8hr',
  },
  {
    id: 'ba-4',
    title: 'ILLEGAL PREGNANCY DISMISSAL!',
    dialogue: 'You requested 105-day maternity leave?! You are FIRED from Bowser Keep!',
    damage: 26,
    weakness: 'maternity_hammer',
  },
  {
    id: 'ba-5',
    title: 'REFUSAL TO PAY MATERNITY SALARY DIFFERENTIAL!',
    dialogue: 'Take your SSS check and scram — zero salary differential from my treasury!',
    damage: 24,
    weakness: 'maternity_hammer',
  },
  {
    id: 'ba-6',
    title: 'DENIAL OF 15-DAY SOLO PARENT MATERNITY EXTENSION!',
    dialogue: 'Solo Parent ID?! Never heard of R.A. 11210! Back to work on Day 105!',
    damage: 23,
    weakness: 'maternity_hammer',
  },
  {
    id: 'ba-7',
    title: 'UNAUTHORIZED UNIFORM & BREAKAGE DEDUCTION!',
    dialogue: 'I am deducting 50% of your wage for broken castle bricks and lava boots!',
    damage: 18,
    weakness: 'star_shield',
  },
  {
    id: 'ba-8',
    title: 'UNILATERAL WITHDRAWAL OF ANNUAL RICE ALLOWANCE!',
    dialogue: 'After 8 years of customary benefits, I am cancelling everything today!',
    damage: 21,
    weakness: 'star_shield',
  },
  {
    id: 'ba-9',
    title: 'MANAGEMENT POCKETS 15% OF SERVICE CHARGES!',
    dialogue: 'Your restaurant service charges belong to my royal throne now!',
    damage: 20,
    weakness: 'star_shield',
  },
  {
    id: 'ba-10',
    title: 'SHAM LABOR-ONLY GHOST CONTRACTING!',
    dialogue: 'My shell agency has ₱500 capital and zero tools! You have NO tenure here!',
    damage: 28,
    weakness: 'dole_stomp',
  },
  {
    id: 'ba-11',
    title: 'IN-HOUSE CABO PLACEMENT AGENCY SCHEME!',
    dialogue: 'My HR chief runs a fake manpower coop exclusively for my own lava factory!',
    damage: 26,
    weakness: 'dole_stomp',
  },
  {
    id: 'ba-12',
    title: 'REPEATED 5-5-5 ENDO CONTRACT CYCLING!',
    dialogue: 'Sign another 5-month waiver so you NEVER become a regular Koopa worker!',
    damage: 25,
    weakness: 'dole_stomp',
  },
];

export function drawBowserCourtroomAttack(
  rng: () => number = Math.random
): CourtroomBowserAttackItem {
  return drawOneFromDeck('courtroom_bowser_attacks', COURTROOM_BOWSER_ATTACK_BANK, rng);
}

// ============================================================================
// 11. WARP PIPE SORTER BANK (24 Distinct Items -> Deal 12 Per Round)
// ============================================================================
export const WARP_PIPE_SORTER_BANK: WarpSorterItem[] = [
  { id: 'ws-1', label: '18-Minute Power Outage', detail: 'Short brownouts <= 20 minutes are compensable hours worked.', targetPipe: 'covered' },
  { id: 'ws-2', label: 'Managerial Staff (Power to Hire & Fire)', detail: 'Officers of managerial staff are exempt from Articles 82–90.', targetPipe: 'exempt' },
  { id: 'ws-3', label: 'Offsetting Monday Undertime with Tuesday OT', detail: 'Article 88 strictly prohibits offsetting undertime with overtime.', targetPipe: 'exempt' },
  { id: 'ws-4', label: '100% Service Charge to Covered Workers', detail: 'Mandatory 100% distribution under Republic Act No. 11360.', targetPipe: 'covered' },
  { id: 'ws-5', label: 'Mandatory Pregnancy Testing of Applicants', detail: 'Strictly prohibited under R.A. 11210 and Magna Carta of Women.', targetPipe: 'exempt' },
  { id: 'ws-6', label: '105-Day Paid Maternity Leave', detail: 'Mandatory benefit for covered female workers regardless of civil status.', targetPipe: 'covered' },
  { id: 'ws-7', label: 'Substituting 13th Month Pay with Ham / Rice', detail: 'Non-cash substitute payments for 13th Month Pay are void under P.D. 851.', targetPipe: 'exempt' },
  { id: 'ws-8', label: 'Kasambahay 5-Day Paid Service Incentive Leave', detail: 'Mandatory statutory entitlement after 1 year under R.A. 10361.', targetPipe: 'covered' },
  { id: 'ws-9', label: 'Field Personnel (Unsupervised Field Hours)', detail: 'Exempt from Title I hours-of-work & SIL when hours cannot be determined with certainty.', targetPipe: 'exempt' },
  { id: 'ws-10', label: '10 Days Paid VAWC Protective Leave', detail: 'Mandatory paid leave for victim-survivors under R.A. 9262 Sec. 43.', targetPipe: 'covered' },
  { id: 'ws-11', label: 'Unworked Regular Holiday 100% Daily Pay', detail: 'Mandatory holiday pay under Article 94 when present or on paid leave prior.', targetPipe: 'covered' },
  { id: 'ws-12', label: '₱500 Agency Without ₱5M Capital', detail: 'Prohibited Labor-Only Contracting under DOLE D.O. 174-17.', targetPipe: 'exempt' },
  { id: 'ws-13', label: '40-Minute Paid Lactation Break (R.A. 10028)', detail: 'Compensable nursing interval counted as hours worked per 8-hour shift.', targetPipe: 'covered' },
  { id: 'ws-14', label: '7 Working Days Solo Parent Leave (6 Mos Service)', detail: 'Mandatory parental leave under R.A. 11861 with valid Solo Parent ID.', targetPipe: 'covered' },
  { id: 'ws-15', label: 'Up to 2 Months Gynecological Surgery Leave', detail: 'Special full-pay benefit under R.A. 9710 Sec. 18 after 6 mos aggregate service.', targetPipe: 'covered' },
  { id: 'ws-16', label: '7 Calendar Days Paternity Leave (First 4 Deliveries)', detail: 'Mandatory full-pay leave for married male cohabiting with legitimate spouse (R.A. 8187).', targetPipe: 'covered' },
  { id: 'ws-17', label: 'Retail Store with 4 Workers (NSD Claim)', detail: 'Retail/service establishments regularly employing <= 5 workers are exempt from NSD.', targetPipe: 'exempt' },
  { id: 'ws-18', label: 'Paying Wages in Promissory Notes / Coupons', detail: 'Prohibited under Article 102 — wages must be paid in legal tender.', targetPipe: 'exempt' },
  { id: 'ws-19', label: 'Age Ceiling in Job Ad Without BFOQ', detail: 'Prohibited under R.A. 10911 (Anti-Age Discrimination in Employment Act).', targetPipe: 'exempt' },
  { id: 'ws-20', label: 'Child Under 18 Assigned to Hazardous Mining', detail: 'Strictly prohibited worst/hazardous child labor under R.A. 9231.', targetPipe: 'exempt' },
  { id: 'ws-21', label: '15-Minute Short Coffee Rest Period', detail: 'Rest periods of 5 to 20 minutes are compensable hours worked.', targetPipe: 'covered' },
  { id: 'ws-22', label: '13th Month Pay for Resigned Worker (Served 2 Mos)', detail: 'Entitled to proportionate 13th Month Pay after working at least 1 month.', targetPipe: 'covered' },
  { id: 'ws-23', label: 'Government Civil Service Employees (Labor Code Title I)', detail: 'Governed by Civil Service rules and exempt from Labor Code Art. 82.', targetPipe: 'exempt' },
  { id: 'ws-24', label: 'Telecommuting Worker Overtime & Leave Parity', detail: 'Protected by Fair Treatment parity under R.A. 11165.', targetPipe: 'covered' },
];

export function drawWarpPipeSorterDeck(
  count = 12,
  rng: () => number = Math.random
): WarpSorterItem[] {
  return drawUniqueFromDeck('warp_pipe_sorter', WARP_PIPE_SORTER_BANK, count, rng);
}

// ============================================================================
// 12. LAW CATCHER BENEFITS & HAZARDS BANKS (26 Distinct Falling Items)
// ============================================================================
export const LAW_CATCHER_BENEFITS_BANK: LawCatcherTemplateItem[] = [
  { id: 'lcb-1', type: 'coin', label: '13th Month Pay (PD 851)', isBenefit: true },
  { id: 'lcb-2', type: 'mushroom', label: '105-Day Maternity (RA 11210)', isBenefit: true },
  { id: 'lcb-3', type: 'mushroom', label: '5-Day Commutable SIL (Art. 95)', isBenefit: true },
  { id: 'lcb-4', type: 'star', label: '100% Service Charge (RA 11360)', isBenefit: true },
  { id: 'lcb-5', type: 'coin', label: '+10% Night Shift Diff', isBenefit: true },
  { id: 'lcb-6', type: 'star', label: '200% Regular Holiday Pay', isBenefit: true },
  { id: 'lcb-7', type: 'mushroom', label: '7-Day Solo Parent Leave', isBenefit: true },
  { id: 'lcb-8', type: 'mushroom', label: '10-Day VAWC Paid Leave', isBenefit: true },
  { id: 'lcb-9', type: 'star', label: '2-Mo Gynecological Leave', isBenefit: true },
  { id: 'lcb-10', type: 'coin', label: '7-Day Paternity Leave', isBenefit: true },
  { id: 'lcb-11', type: 'coin', label: '40-Min Paid Lactation Break', isBenefit: true },
  { id: 'lcb-12', type: 'star', label: '390% Double Holiday + RD', isBenefit: true },
  { id: 'lcb-13', type: 'coin', label: '125% Ordinary Overtime', isBenefit: true },
  { id: 'lcb-14', type: 'mushroom', label: '24-Hr Weekly Rest Day', isBenefit: true },
];

export const LAW_CATCHER_HAZARDS_BANK: LawCatcherTemplateItem[] = [
  { id: 'lch-1', type: 'thwomp', label: 'Mandatory Pregnancy Test', isBenefit: false },
  { id: 'lch-2', type: 'poison', label: 'Diminution of Benefits', isBenefit: false },
  { id: 'lch-3', type: 'thwomp', label: 'Offsetting Undertime w/ OT', isBenefit: false },
  { id: 'lch-4', type: 'poison', label: 'Labor-Only Ghost Agency', isBenefit: false },
  { id: 'lch-5', type: 'thwomp', label: 'Promissory Chit Wages', isBenefit: false },
  { id: 'lch-6', type: 'poison', label: 'Forced Grocery Deduction', isBenefit: false },
  { id: 'lch-7', type: 'thwomp', label: 'Hazardous Minor Night Work', isBenefit: false },
  { id: 'lch-8', type: 'poison', label: 'Kasambahay Placement Fee', isBenefit: false },
  { id: 'lch-9', type: 'thwomp', label: 'Arbitrary Age Ad Ceiling', isBenefit: false },
  { id: 'lch-10', type: 'poison', label: 'Unconsented Meal Deduction', isBenefit: false },
  { id: 'lch-11', type: 'thwomp', label: '5-5-5 Endo Waiver Scheme', isBenefit: false },
  { id: 'lch-12', type: 'poison', label: '15% Mgmt Service Charge Cut', isBenefit: false },
];

export function drawLawCatcherItem(
  isHazard: boolean,
  rng: () => number = Math.random
): LawCatcherTemplateItem {
  return isHazard
    ? drawOneFromDeck('law_catcher_hazards', LAW_CATCHER_HAZARDS_BANK, rng)
    : drawOneFromDeck('law_catcher_benefits', LAW_CATCHER_BENEFITS_BANK, rng);
}

// ============================================================================
// 13. 2D PLATFORMER [?] QUESTION BLOCK DOCTRINES (28 Distinct Doctrines)
// ============================================================================
export const PLATFORMER_2D_DOCTRINES_BANK: string[] = [
  'World 1: Coverage for statutory labor standards starts on Day 1 of employment!',
  'World 1: Field personnel test — actual hours in the field cannot be determined with reasonable certainty.',
  'World 1: Power brownouts of 20 minutes or less are compensable working hours!',
  'World 1: Short rest breaks of 5 to 20 minutes count as compensable hours worked.',
  'World 1: Undertime on one day can NEVER be offset by overtime on another day (Art. 88).',
  'World 1: Night Shift Differential (+10%) applies between 10:00 PM and 6:00 AM (Art. 86).',
  'World 1: Compressed Workweek (CWW) waives daily OT up to 12h/day if voluntary & <=48h/week!',
  'World 2: Worked Regular Holiday = 200% daily wage for the first 8 hours (Art. 94).',
  'World 2: Worked Regular Holiday falling on a Rest Day = 260% daily wage!',
  'World 2: Double Regular Holiday worked on a Rest Day = 390% daily wage!',
  'World 2: Special Non-Working Day follows "No Work, No Pay" unless worked (130% or 150% on RD).',
  'World 2: 13th Month Pay (P.D. 851) = Total Basic Salary Earned / 12, payable on or before Dec 24!',
  'World 3: 100% of collected service charges go to rank-and-file & supervisory workers (R.A. 11360).',
  'World 3: Facilities require 3 requisites to deduct: customary, voluntary written consent, and fair value.',
  'World 3: Supplements (tools, uniforms for employer convenience) are NEVER deductible from wages!',
  'World 3: DOLE D.O. 174 requires at least ₱5,000,000 paid-up capital/net worth for legitimate contracting.',
  'World 3: Labor-only contracting makes the Principal the DIRECT EMPLOYER for all legal purposes!',
  'World 4: Working child below 15 yrs: max 4h/day, 20h/week, no work 8PM–6AM (R.A. 9231).',
  'World 4: Kasambahay (R.A. 10361): 5 days paid SIL after 1 year is non-cumulative & non-convertible to cash.',
  'World 4: Telecommuting employees enjoy full Fair Treatment parity with on-site peers (R.A. 11165).',
  'World 5: Safe Spaces Act (R.A. 11313) penalizes peer-to-peer & subordinate-to-superior harassment!',
  'World 5: Nursing employees get >= 40 mins paid lactation breaks per 8-hour shift (R.A. 10028).',
  'World 6: SIL (Art. 95) 3-year prescription runs from demand/refusal or separation (Auto Bus v. Bautista)!',
  'World 6: Expanded Maternity Leave (R.A. 11210): 105 days live birth (+15 solo parent) or 60d miscarriage!',
  'World 6: Mother may allocate up to 7 Maternity Leave days to the father — married or unmarried!',
  'World 6: Paternity Leave (R.A. 8187): 7 calendar days full pay for first 4 deliveries of legitimate spouse.',
  'World 6: Expanded Solo Parent Leave (R.A. 11861): 7 working days after just 6 months of service!',
  'World 6: Magna Carta Sec. 18 grants up to 2 months full-pay leave after gynecological surgery; RA 9262 grants 10d VAWC leave!',
];

export function drawPlatformer2DDoctrine(rng: () => number = Math.random): string {
  return drawOneFromDeck('platformer_2d_doctrines', PLATFORMER_2D_DOCTRINES_BANK, rng);
}
