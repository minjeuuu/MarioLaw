import React, { useState } from 'react';
import { computePayBreakdown } from '../utils/calculator';
import { marioAudio } from '../utils/audio';
import {
  MarioCoinIcon,
  MarioStarIcon,
  MarioMushroomIcon,
  MarioFireFlowerIcon,
  Mario1UpIcon,
} from './MarioIcons';
import {
  Calendar,
  Calculator,
  CheckCircle2,
  XCircle,
  Sparkles,
  Scale,
  AlertTriangle,
  Clock,
  Users,
  Award,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface HolidaysViewProps {
  fontSize: 'normal' | 'large' | 'xlarge';
  onEarnCoins?: (amount: number) => void;
}

interface HolidayEntry {
  number: number;
  name: string;
  dateRule: string;
  category: 'Regular Holiday' | 'Special Non-Working' | 'Special Working';
  unworkedPay: string;
  workedPay: string;
  restDayWorkedPay: string;
  notes: string;
}

const REGULAR_HOLIDAYS: HolidayEntry[] = [
  {
    number: 1,
    name: "New Year's Day",
    dateRule: 'January 1 (Fixed)',
    category: 'Regular Holiday',
    unworkedPay: '100%',
    workedPay: '200%',
    restDayWorkedPay: '260%',
    notes: 'First regular holiday of the calendar year under Art. 94 & E.O. 292.',
  },
  {
    number: 2,
    name: 'Maundy Thursday',
    dateRule: 'Movable Date (Holy Week)',
    category: 'Regular Holiday',
    unworkedPay: '100%',
    workedPay: '200%',
    restDayWorkedPay: '260%',
    notes: 'Successive holiday rule applies together with Good Friday; if coinciding with April 9, becomes Double Regular Holiday.',
  },
  {
    number: 3,
    name: 'Good Friday',
    dateRule: 'Movable Date (Holy Week)',
    category: 'Regular Holiday',
    unworkedPay: '100%',
    workedPay: '200%',
    restDayWorkedPay: '260%',
    notes: 'Absent without pay on Wednesday before Maundy Thursday forfeits both holidays unless employee works on Maundy Thursday or Good Friday.',
  },
  {
    number: 4,
    name: 'Araw ng Kagitingan',
    dateRule: 'April 9 (Bataan & Corregidor Day)',
    category: 'Regular Holiday',
    unworkedPay: '100%',
    workedPay: '200%',
    restDayWorkedPay: '260%',
    notes: 'Historically overlaps with Maundy Thursday or Good Friday in certain years (Double Holiday: 200% unworked / 300% worked).',
  },
  {
    number: 5,
    name: 'Labor Day',
    dateRule: 'May 1 (Fixed)',
    category: 'Regular Holiday',
    unworkedPay: '100%',
    workedPay: '200%',
    restDayWorkedPay: '260%',
    notes: 'Statutory national tribute to Filipino workers; full regular holiday rules govern.',
  },
  {
    number: 6,
    name: 'Independence Day',
    dateRule: 'June 12 (Fixed)',
    category: 'Regular Holiday',
    unworkedPay: '100%',
    workedPay: '200%',
    restDayWorkedPay: '260%',
    notes: 'Commemorates Philippine Proclamation of Independence.',
  },
  {
    number: 7,
    name: 'National Heroes Day',
    dateRule: 'Last Monday of August (R.A. 9492)',
    category: 'Regular Holiday',
    unworkedPay: '100%',
    workedPay: '200%',
    restDayWorkedPay: '260%',
    notes: 'Observed on the last Monday of August under Holiday Economics (R.A. 9492; originally last Sunday in older codals).',
  },
  {
    number: 8,
    name: "Eid'l Fitr (Feast of Ramadhan)",
    dateRule: 'Movable Date (Proclaimed via R.A. 9177)',
    category: 'Regular Holiday',
    unworkedPay: '100%',
    workedPay: '200%',
    restDayWorkedPay: '260%',
    notes: 'Nationwide regular holiday for ALL Filipino workers (Muslim and non-Muslim alike) under R.A. 9177.',
  },
  {
    number: 9,
    name: "Eid'l Adha (Feast of Sacrifice)",
    dateRule: 'Movable Date (Proclaimed via R.A. 9849)',
    category: 'Regular Holiday',
    unworkedPay: '100%',
    workedPay: '200%',
    restDayWorkedPay: '260%',
    notes: 'Nationwide regular holiday for ALL employees upon Presidential Proclamation.',
  },
  {
    number: 10,
    name: 'Bonifacio Day',
    dateRule: 'November 30 (Fixed)',
    category: 'Regular Holiday',
    unworkedPay: '100%',
    workedPay: '200%',
    restDayWorkedPay: '260%',
    notes: 'Honors birth anniversary of Andres Bonifacio.',
  },
  {
    number: 11,
    name: 'Christmas Day',
    dateRule: 'December 25 (Fixed)',
    category: 'Regular Holiday',
    unworkedPay: '100%',
    workedPay: '200%',
    restDayWorkedPay: '260%',
    notes: '13th-month pay under P.D. 851 must already be paid on or before December 24.',
  },
  {
    number: 12,
    name: 'Rizal Day',
    dateRule: 'December 30 (Fixed)',
    category: 'Regular Holiday',
    unworkedPay: '100%',
    workedPay: '200%',
    restDayWorkedPay: '260%',
    notes: 'Followed by December 31 (Last Day of the Year, a Special Non-Working Day).',
  },
];

const SPECIAL_HOLIDAYS: HolidayEntry[] = [
  {
    number: 1,
    name: 'Chinese New Year',
    dateRule: 'Movable (Jan/Feb by Proclamation)',
    category: 'Special Non-Working',
    unworkedPay: '0% (No work, no pay)',
    workedPay: '130%',
    restDayWorkedPay: '150%',
    notes: 'Unless favorable company policy, practice, or CBA grants payment when unworked.',
  },
  {
    number: 2,
    name: 'EDSA People Power Anniversary',
    dateRule: 'February 25 (By Proclamation)',
    category: 'Special Non-Working',
    unworkedPay: '0% (No work, no pay)',
    workedPay: '130%',
    restDayWorkedPay: '150%',
    notes: 'Check annual Presidential Proclamation whether classified as Special Non-Working or Special Working.',
  },
  {
    number: 3,
    name: 'Black Saturday',
    dateRule: 'Movable (Day after Good Friday)',
    category: 'Special Non-Working',
    unworkedPay: '0% (No work, no pay)',
    workedPay: '130%',
    restDayWorkedPay: '150%',
    notes: 'Falls immediately after two successive Regular Holidays (Maundy Thursday & Good Friday).',
  },
  {
    number: 4,
    name: 'Ninoy Aquino Day',
    dateRule: 'August 21 (R.A. 9256)',
    category: 'Special Non-Working',
    unworkedPay: '0% (No work, no pay)',
    workedPay: '130%',
    restDayWorkedPay: '150%',
    notes: 'Statutory national special non-working day.',
  },
  {
    number: 5,
    name: "All Saints' Day",
    dateRule: 'November 1 (Fixed)',
    category: 'Special Non-Working',
    unworkedPay: '0% (No work, no pay)',
    workedPay: '130%',
    restDayWorkedPay: '150%',
    notes: 'Nationwide special non-working day under E.O. 292.',
  },
  {
    number: 6,
    name: 'Feast of the Immaculate Conception',
    dateRule: 'December 8 (R.A. 10966)',
    category: 'Special Non-Working',
    unworkedPay: '0% (No work, no pay)',
    workedPay: '130%',
    restDayWorkedPay: '150%',
    notes: 'Enacted as a nationwide special non-working holiday via Republic Act No. 10966.',
  },
  {
    number: 7,
    name: 'Christmas Eve & All Souls Day',
    dateRule: 'Dec 24 / Nov 2 (Proclaimed)',
    category: 'Special Non-Working',
    unworkedPay: '0% (No work, no pay)',
    workedPay: '130%',
    restDayWorkedPay: '150%',
    notes: 'Depending on annual proclamation, may be Special Non-Working (130%) or Special Working (100%).',
  },
  {
    number: 8,
    name: 'Last Day of the Year',
    dateRule: 'December 31 (Fixed)',
    category: 'Special Non-Working',
    unworkedPay: '0% (No work, no pay)',
    workedPay: '130%',
    restDayWorkedPay: '150%',
    notes: 'Statutory nationwide special day under E.O. 292.',
  },
  {
    number: 9,
    name: 'Local Charter Days & Proclaimed Special Days',
    dateRule: 'City / Province Charter Dates',
    category: 'Special Non-Working',
    unworkedPay: '0% (No work, no pay)',
    workedPay: '130%',
    restDayWorkedPay: '150%',
    notes: 'Applies strictly to establishments physically located within the proclaimed city, municipality, or province.',
  },
  {
    number: 10,
    name: 'Special Working Days',
    dateRule: 'As Proclaimed by President / Congress',
    category: 'Special Working',
    unworkedPay: '0% (No work, no pay)',
    workedPay: '100% (Basic Wage)',
    restDayWorkedPay: '130% (Rest Day Rate)',
    notes: 'Treated as an ordinary working day: no 30% holiday premium unless it falls on employee rest day.',
  },
];

interface HolidayMiniQuestion {
  q: string;
  options: string[];
  correct: number;
  explain: string;
}

const HOLIDAY_QUIZ_ITEMS: HolidayMiniQuestion[] = [
  {
    q: 'Mario was on LEAVE WITHOUT PAY on Wednesday before Maundy Thursday and Good Friday, and did not work on either holiday. How much holiday pay does he get?',
    options: ['200% (100% for each day)', '100% (for Good Friday only)', '0% (forfeited both unless worked)', '50% compassionate pay'],
    correct: 2,
    explain: 'An employee on leave of absence without pay on the day immediately preceding a regular holiday is NOT entitled to holiday pay for both successive regular holidays unless he works on the first holiday.',
  },
  {
    q: 'Peach worked on Saturday, rested on Sunday (her scheduled rest day), and did not work on Monday (National Heroes Day, a Regular Holiday). Is she entitled to Monday holiday pay?',
    options: ['No, because she did not work on Sunday.', 'Yes, 100% holiday pay because she worked on Saturday, the workday immediately preceding her rest day.', 'Only 50% holiday pay.', 'Only if she is monthly-paid.'],
    correct: 1,
    explain: 'Where the day immediately preceding the holiday is a non-working day or scheduled rest day, the employee is entitled to holiday pay if they worked or were on paid leave on the workday immediately preceding that rest day!',
  },
  {
    q: 'Luigi worked 8 hours on a Double Regular Holiday (Maundy Thursday + Araw ng Kagitingan) that ALSO fell on his scheduled Rest Day. Daily wage is ₱1,000. Total pay?',
    options: ['₱2,600 (260%)', '₱3,000 (300%)', '₱3,300 (330%)', '₱3,900 (390%)'],
    correct: 3,
    explain: 'Worked Double Regular Holiday = 300%. Because it fell on his scheduled rest day, add 30% of 300% (+90%) = 390% (₱3,900)!',
  },
  {
    q: 'A retail store regularly employs 8 rank-and-file salesclerks. On June 12 (Independence Day), the store closes. Are the 8 salesclerks entitled to 100% unworked holiday pay?',
    options: ['Yes, all private workers get holiday pay.', 'No, retail and service establishments regularly employing FEWER than 10 workers (<10) are statutorily exempt from Holiday Pay under Art. 94.', 'Yes, unless they apply to RTWPB.', 'Only 50% of daily rate.'],
    correct: 1,
    explain: 'Under Article 94(a) of the Labor Code, retail and service establishments regularly employing less than ten (<10) workers are automatically exempt from Holiday Pay!',
  },
  {
    q: 'How is regular holiday pay computed for a piece-rate (paid by results) worker?',
    options: ['Pieces produced on holiday × 2', 'Not less than average daily earnings for the last seven (7) actual working days preceding the regular holiday, and never below statutory minimum wage.', 'Zero, piece-rate workers are always excluded.', 'Monthly minimum wage divided by 30.'],
    correct: 1,
    explain: 'Supervised piece-rate workers receive holiday pay of not less than their average daily earnings for the last 7 actual workdays preceding the regular holiday, which in no case shall be less than the applicable statutory minimum wage.',
  },
];

export const HolidaysView: React.FC<HolidaysViewProps> = ({ fontSize, onEarnCoins }) => {
  const [subTab, setSubTab] = useState<'directory' | 'doctrines' | 'simulator' | 'quiz'>('directory');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'Regular Holiday' | 'Special Non-Working' | 'Special Working'>('all');

  // Simulator state
  const [dailyWage, setDailyWage] = useState<number>(645);
  const [simScenario, setSimScenario] = useState<
    | 'regular_holiday_unworked'
    | 'regular_holiday_worked'
    | 'regular_holiday_rest_day_worked'
    | 'special_holiday'
    | 'special_holiday_rest_day'
    | 'double_regular_holiday_unworked'
    | 'double_regular_holiday_worked'
    | 'double_regular_holiday_rest_day_worked'
    | 'ordinary'
  >('regular_holiday_worked');
  const [otHours, setOtHours] = useState<number>(0);
  const [nightHours, setNightHours] = useState<number>(0);

  // Quiz state
  const [quizIdx, setQuizIdx] = useState(0);
  const [pickedOpt, setPickedOpt] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const simBreakdown = computePayBreakdown({
    dailyWage: Number(dailyWage) || 0,
    workScenario: simScenario,
    regularHoursWorked: 8,
    otHours: Number(otHours) || 0,
    nightDiffHours: Number(nightHours) || 0,
    isNightDiffDuringOT: false,
  });

  const allHolidays = [...REGULAR_HOLIDAYS, ...SPECIAL_HOLIDAYS];
  const filteredHolidays =
    categoryFilter === 'all'
      ? allHolidays
      : allHolidays.filter((h) => h.category === categoryFilter);

  const bodyTextClass =
    fontSize === 'xlarge' ? 'text-xl' : fontSize === 'large' ? 'text-lg' : 'text-sm sm:text-base';

  const activeQuiz = HOLIDAY_QUIZ_ITEMS[quizIdx];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Dedicated Holidays Hero Banner */}
      <div className="bg-gradient-to-r from-rose-700 via-red-600 to-amber-500 text-white rounded-3xl p-5 sm:p-8 mario-card border-4 border-slate-950 shadow-[6px_6px_0_#000]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-950 text-amber-300 font-black rounded-lg border border-black text-[10px] uppercase font-mario leading-relaxed">
              <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>STATUTORY HOLIDAYS HUB • ART. 93–94 &amp; E.O. 292</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white font-display">
              PHILIPPINE HOLIDAYS MASTER GUIDE
            </h1>
            <p className={`${bodyTextClass} text-amber-50 font-bold max-w-2xl`}>
              Complete directory of all 12 Regular Holidays, Special Non-Working Days, Special Working Days, Double Holidays (300% / 390%), Preceding-Day Absence Doctrines, and Live Holiday Pay Simulator.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 w-full md:w-auto shrink-0">
            <div className="bg-slate-950/90 border-2 border-amber-400 rounded-2xl px-4 py-3 text-center">
              <span className="text-2xl font-black text-amber-400 font-mario block leading-none">12</span>
              <span className="text-[10px] font-black uppercase text-white mt-1 block">Regular Holidays</span>
            </div>
            <div className="bg-slate-950/90 border-2 border-cyan-400 rounded-2xl px-4 py-3 text-center">
              <span className="text-2xl font-black text-cyan-300 font-mario block leading-none">200%–390%</span>
              <span className="text-[10px] font-black uppercase text-white mt-1 block">Worked Multipliers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Perfectly Aligned Sub-Navigation Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-center gap-2 bg-[#1e293b] p-2 rounded-2xl border-3 border-slate-950 shadow-[4px_4px_0_#000]">
        {[
          { id: 'directory', label: 'Holiday Calendar & Multipliers', shortLabel: 'Holiday Calendar', icon: <Calendar className="w-4 h-4 shrink-0" /> },
          { id: 'doctrines', label: 'Rules, Absences & Special Cases', shortLabel: 'Rules & Absences', icon: <Scale className="w-4 h-4 shrink-0" /> },
          { id: 'simulator', label: 'Holiday Pay Calculator', shortLabel: 'Holiday Calculator', icon: <Calculator className="w-4 h-4 shrink-0" /> },
          { id: 'quiz', label: 'Holiday Mini-Quiz (+Coins)', shortLabel: 'Holiday Mini-Quiz', icon: <Award className="w-4 h-4 shrink-0" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setSubTab(tab.id as any);
              marioAudio.playTabSwitch();
            }}
            className={`min-h-[42px] inline-flex items-center justify-center gap-2 px-3.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
              subTab === tab.id
                ? 'bg-amber-400 text-slate-950 border-2 border-black shadow-[0_2px_0_#000]'
                : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white border-2 border-transparent'
            }`}
          >
            {tab.icon}
            <span className="sm:hidden">{tab.shortLabel}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* SUB-TAB 1: COMPLETE HOLIDAY DIRECTORY */}
      {subTab === 'directory' && (
        <div className="space-y-6">
          {/* Quick Comparison Strip */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch">
            <div className="bg-white rounded-2xl mario-card border-4 border-slate-950 p-4 flex flex-col justify-between">
              <div>
                <span className="inline-flex px-2.5 py-1 rounded-md bg-red-600 text-white text-[10px] font-black font-mario uppercase leading-none">
                  REGULAR HOLIDAY
                </span>
                <h3 className="text-lg font-black text-slate-950 font-display mt-2">12 Nationwide Days</h3>
                <p className="text-xs font-semibold text-slate-600 mt-1">
                  Paid 100% even if unworked! Doubling to 200% if worked, and 260% if worked on rest day.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-black text-red-700">
                <span>Unworked: 100%</span>
                <span>Worked: 200%</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl mario-card border-4 border-slate-950 p-4 flex flex-col justify-between">
              <div>
                <span className="inline-flex px-2.5 py-1 rounded-md bg-indigo-600 text-white text-[10px] font-black font-mario uppercase leading-none">
                  SPECIAL NON-WORKING
                </span>
                <h3 className="text-lg font-black text-slate-950 font-display mt-2">&ldquo;No Work, No Pay&rdquo;</h3>
                <p className="text-xs font-semibold text-slate-600 mt-1">
                  Unpaid if unworked (unless CBA/practice grants pay). Paid 130% if worked, 150% on rest day.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-black text-indigo-700">
                <span>Unworked: 0%</span>
                <span>Worked: 130%</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl mario-card border-4 border-slate-950 p-4 flex flex-col justify-between">
              <div>
                <span className="inline-flex px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[10px] font-black font-mario uppercase leading-none">
                  SPECIAL WORKING DAY
                </span>
                <h3 className="text-lg font-black text-slate-950 font-display mt-2">Ordinary Workday Rule</h3>
                <p className="text-xs font-semibold text-slate-600 mt-1">
                  Treated like a regular workday: 100% basic daily wage for 8 hours; +25% ordinary overtime.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-black text-emerald-700">
                <span>Unworked: 0%</span>
                <span>Worked: 100%</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl mario-card border-4 border-slate-950 p-4 flex flex-col justify-between">
              <div>
                <span className="inline-flex px-2.5 py-1 rounded-md bg-amber-500 text-slate-950 border border-black text-[10px] font-black font-mario uppercase leading-none">
                  DOUBLE HOLIDAY
                </span>
                <h3 className="text-lg font-black text-slate-950 font-display mt-2">2 Regular Holidays Coincide</h3>
                <p className="text-xs font-semibold text-slate-600 mt-1">
                  E.g., April 9 + Maundy Thursday/Good Friday. Paid 200% unworked, 300% worked, 390% on rest day!
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-black text-amber-800">
                <span>Unworked: 200%</span>
                <span>Worked: 300%</span>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="bg-white rounded-2xl border-4 border-slate-950 p-3.5 shadow-[4px_4px_0_#000] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase font-mario text-slate-700 px-1">FILTER:</span>
              {(['all', 'Regular Holiday', 'Special Non-Working', 'Special Working'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`h-9 inline-flex items-center justify-center px-3.5 rounded-xl text-xs font-black border-2 border-black transition-all cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-amber-400 text-slate-950 shadow-[0_2px_0_#000]'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all' ? `All Holidays (${allHolidays.length})` : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Master Holiday Table */}
          <div className="bg-white rounded-3xl mario-card border-4 border-slate-950 overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between flex-wrap gap-2 border-b-4 border-slate-950">
              <div className="flex items-center gap-2">
                <MarioStarIcon className="w-5 h-5 shrink-0" />
                <h2 className="text-lg sm:text-xl font-black font-display">
                  COMPLETE STATUTORY HOLIDAYS &amp; PAY RATES TABLE
                </h2>
              </div>
              <span className="text-xs font-bold text-amber-300 font-mario">
                {filteredHolidays.length} ENTRIES
              </span>
            </div>

            {/* Mobile Stacked Holiday Cards */}
            <div className="block md:hidden divide-y divide-slate-200">
              {filteredHolidays.map((h) => (
                <div key={`mobile-${h.category}-${h.number}-${h.name}`} className="p-4 space-y-2.5 hover:bg-amber-50/40">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-black text-slate-950 text-sm leading-snug">{h.name}</h3>
                      <span className="text-xs font-semibold text-slate-600 block mt-0.5">{h.dateRule}</span>
                    </div>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-black border shrink-0 ${
                        h.category === 'Regular Holiday'
                          ? 'bg-red-100 text-red-900 border-red-400'
                          : h.category === 'Special Non-Working'
                          ? 'bg-indigo-100 text-indigo-900 border-indigo-400'
                          : 'bg-emerald-100 text-emerald-900 border-emerald-400'
                      }`}
                    >
                      {h.category}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2">
                      <span className="text-[9px] font-black uppercase text-emerald-900 block">Unworked</span>
                      <span className="text-xs font-black text-emerald-800 tabular-nums">{h.unworkedPay}</span>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                      <span className="text-[9px] font-black uppercase text-red-900 block">Worked 8h</span>
                      <span className="text-xs font-black text-red-700 tabular-nums">{h.workedPay}</span>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
                      <span className="text-[9px] font-black uppercase text-amber-900 block">+ Rest Day</span>
                      <span className="text-xs font-black text-amber-800 tabular-nums">{h.restDayWorkedPay}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 font-semibold leading-relaxed">{h.notes}</p>
                </div>
              ))}
            </div>

            {/* Desktop 7-Column Holiday Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100 border-b-2 border-slate-900 text-slate-900 font-black uppercase text-xs">
                    <th className="p-3.5">Holiday Name</th>
                    <th className="p-3.5">Statutory Date</th>
                    <th className="p-3.5">Classification</th>
                    <th className="p-3.5">Unworked</th>
                    <th className="p-3.5">Worked (8h)</th>
                    <th className="p-3.5">Worked + Rest Day</th>
                    <th className="p-3.5">Statutory Rule / Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-semibold text-slate-800">
                  {filteredHolidays.map((h) => (
                    <tr key={`${h.category}-${h.number}-${h.name}`} className="hover:bg-amber-50/50">
                      <td className="p-3.5 font-black text-slate-950 whitespace-nowrap">{h.name}</td>
                      <td className="p-3.5 whitespace-nowrap text-slate-700">{h.dateRule}</td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-md text-[11px] font-black border ${
                            h.category === 'Regular Holiday'
                              ? 'bg-red-100 text-red-900 border-red-400'
                              : h.category === 'Special Non-Working'
                              ? 'bg-indigo-100 text-indigo-900 border-indigo-400'
                              : 'bg-emerald-100 text-emerald-900 border-emerald-400'
                          }`}
                        >
                          {h.category}
                        </span>
                      </td>
                      <td className="p-3.5 font-black text-emerald-800 whitespace-nowrap tabular-nums">{h.unworkedPay}</td>
                      <td className="p-3.5 font-black text-red-700 whitespace-nowrap tabular-nums">{h.workedPay}</td>
                      <td className="p-3.5 font-black text-amber-800 whitespace-nowrap tabular-nums">{h.restDayWorkedPay}</td>
                      <td className="p-3.5 text-xs text-slate-600 min-w-[240px]">{h.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: DOCTRINES, ABSENCES & SPECIAL WORKER RULES */}
      {subTab === 'doctrines' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
          <div className="bg-white rounded-3xl mario-card border-4 border-slate-950 p-5 sm:p-6 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b-2 border-slate-200 pb-2.5">
                <Clock className="w-5 h-5 text-red-600 shrink-0" />
                <h3 className="text-lg font-black text-slate-950 font-display">
                  PRECEDING-DAY PRESENCE &amp; LEAVE RULES
                </h3>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50 border-2 border-emerald-300 space-y-1">
                <span className="text-[10px] font-black font-mario text-emerald-900 uppercase">ENTITLED TO 100% HOLIDAY PAY</span>
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  Employee worked OR was on <strong>Leave of Absence WITH Pay</strong> on the workday immediately preceding the regular holiday.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-rose-50 border-2 border-rose-300 space-y-1">
                <span className="text-[10px] font-black font-mario text-rose-900 uppercase">FORFEITS UNWORKED HOLIDAY PAY</span>
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  Employee was absent <strong>WITHOUT Pay (AWOL / LWOP)</strong> on the workday immediately preceding the regular holiday — UNLESS the employee actually works on the holiday itself (then paid 200%).
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-50 border-2 border-amber-300 space-y-1">
                <span className="text-[10px] font-black font-mario text-amber-900 uppercase">REST DAY PRECEDING MONDAY HOLIDAY</span>
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  If Sunday is the employee&apos;s rest day before a Monday regular holiday, look back to <strong>Saturday</strong> (the workday immediately preceding the rest day). If present or on paid leave Saturday, Monday holiday pay is GRANTED!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl mario-card border-4 border-slate-950 p-5 sm:p-6 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b-2 border-slate-200 pb-2.5">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
                <h3 className="text-lg font-black text-slate-950 font-display">
                  SUCCESSIVE HOLIDAYS &amp; SHUTDOWNS
                </h3>
              </div>
              <div className="p-3.5 rounded-xl bg-indigo-50 border-2 border-indigo-300 space-y-1">
                <span className="text-[10px] font-black font-mario text-indigo-900 uppercase">MAUNDY THURSDAY + GOOD FRIDAY RULE</span>
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  Where there are two (2) successive regular holidays, an employee absent without pay on Wednesday is NOT entitled to holiday pay for BOTH days — UNLESS they work on Maundy Thursday, in which case they earn holiday pay for Good Friday too!
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50 border-2 border-emerald-300 space-y-1">
                <span className="text-[10px] font-black font-mario text-emerald-900 uppercase">TEMPORARY INVENTORY / REPAIR SHUTDOWN</span>
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  Regular holidays occurring during temporary cessation for annual inventory or machine cleaning/repairs MUST still be paid at 100%!
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-100 border-2 border-slate-300 space-y-1">
                <span className="text-[10px] font-black font-mario text-slate-700 uppercase">SEVERE BUSINESS REVERSES</span>
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  If temporary suspension of operations is bona fide due to severe business losses/reverses approved/reported to DOLE, regular holiday pay during suspension may not be demanded.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl mario-card border-4 border-slate-950 p-5 sm:p-6 space-y-3 lg:col-span-2">
            <div className="flex items-center gap-2 border-b-2 border-slate-200 pb-2.5">
              <Users className="w-5 h-5 text-emerald-700 shrink-0" />
              <h3 className="text-lg font-black text-slate-950 font-display">
                SPECIAL WORKER CATEGORIES &amp; EXEMPTIONS (ART. 94)
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-1.5">
                <span className="font-black text-sm text-slate-950 font-display block">Monthly-Paid vs Daily-Paid</span>
                <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                  <strong>Monthly-paid</strong> workers (365-day factor) already have all 12 unworked regular holidays &amp; special days built into their monthly salary (no extra deduction on unworked holidays; +100% additional if worked on regular holiday). <strong>Daily-paid</strong> workers receive 100% on unworked regular holidays, 0% on unworked special days.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-1.5">
                <span className="font-black text-sm text-slate-950 font-display block">Piece-Rate, Seasonal &amp; Teachers</span>
                <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                  <strong>Piece-rate</strong>: average daily earnings for last 7 actual working days (never below minimum wage). <strong>Seasonal</strong>: no holiday pay during off-season. <strong>Hourly-paid faculty</strong>: no pay for regular holidays during semestral/vacation breaks, but paid for proclaimed special non-working class suspensions (Jose Rizal College doctrine).
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-1.5">
                <span className="font-black text-sm text-amber-950 font-display block">Who Are Exempt from Art. 94?</span>
                <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                  Government workers, managerial employees, officers/members of managerial staff, field personnel (unsupervised hours), domestic helpers/persons in personal service, family dependents, and <strong>retail &amp; service establishments regularly employing FEWER than 10 workers (&lt; 10)</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: HOLIDAY PAY QUICK SIMULATOR */}
      {subTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-white rounded-3xl mario-card border-4 border-slate-950 p-5 sm:p-7 space-y-5">
            <div className="flex items-center gap-2 border-b-2 border-slate-200 pb-3">
              <Calculator className="w-5 h-5 text-red-600 shrink-0" />
              <h3 className="text-xl font-black text-slate-950 font-display">
                INTERACTIVE HOLIDAY PAY SIMULATOR
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="holiday-sim-wage" className="text-xs font-black uppercase text-slate-700 block">
                  Basic Daily Wage (PHP)
                </label>
                <input
                  id="holiday-sim-wage"
                  type="number"
                  min={0}
                  value={dailyWage}
                  onChange={(e) => setDailyWage(Number(e.target.value))}
                  className="w-full h-11 px-3.5 rounded-xl border-3 border-slate-900 font-black text-slate-950 bg-slate-50"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="holiday-sim-scenario" className="text-xs font-black uppercase text-slate-700 block">
                  Holiday Scenario
                </label>
                <select
                  id="holiday-sim-scenario"
                  value={simScenario}
                  onChange={(e) => setSimScenario(e.target.value as typeof simScenario)}
                  className="w-full h-11 px-3 rounded-xl border-3 border-slate-900 font-bold text-sm text-slate-950 bg-amber-50"
                >
                  <option value="regular_holiday_unworked">Regular Holiday — Unworked (100%)</option>
                  <option value="regular_holiday_worked">Regular Holiday — Worked 8h (200%)</option>
                  <option value="regular_holiday_rest_day_worked">Regular Holiday + Rest Day Worked (260%)</option>
                  <option value="special_holiday">Special Non-Working Day — Worked (130%)</option>
                  <option value="special_holiday_rest_day">Special Non-Working + Rest Day Worked (150%)</option>
                  <option value="double_regular_holiday_unworked">Double Regular Holiday — Unworked (200%)</option>
                  <option value="double_regular_holiday_worked">Double Regular Holiday — Worked (300%)</option>
                  <option value="double_regular_holiday_rest_day_worked">Double Holiday + Rest Day Worked (390%)</option>
                  <option value="ordinary">Special Working Day — Worked (100%)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="holiday-sim-ot" className="text-xs font-black uppercase text-slate-700 block">
                  Overtime Hours Beyond 8h
                </label>
                <input
                  id="holiday-sim-ot"
                  type="number"
                  min={0}
                  max={12}
                  value={otHours}
                  onChange={(e) => setOtHours(Number(e.target.value))}
                  className="w-full h-11 px-3.5 rounded-xl border-3 border-slate-900 font-black text-slate-950 bg-slate-50"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="holiday-sim-nd" className="text-xs font-black uppercase text-slate-700 block">
                  Night Shift Hours (10PM–6AM)
                </label>
                <input
                  id="holiday-sim-nd"
                  type="number"
                  min={0}
                  max={8}
                  value={nightHours}
                  onChange={(e) => setNightHours(Number(e.target.value))}
                  className="w-full h-11 px-3.5 rounded-xl border-3 border-slate-900 font-black text-slate-950 bg-slate-50"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#1e293b] text-white rounded-3xl mario-card border-4 border-slate-950 p-5 sm:p-7 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-700 pb-3">
              <span className="text-xs font-black uppercase text-amber-400 font-mario">
                STATUTORY PAYOUT
              </span>
              <MarioCoinIcon className="w-6 h-6" />
            </div>

            <div className="bg-slate-900 rounded-2xl p-4 border-2 border-amber-400 text-center space-y-1">
              <span className="text-xs font-bold text-slate-400 block">Total Gross Holiday Pay</span>
              <span className="text-3xl sm:text-4xl font-black text-amber-300 font-display block tabular-nums">
                ₱{simBreakdown.totalPay.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="space-y-2 text-xs sm:text-sm font-semibold tabular-nums">
              <div className="flex justify-between py-1.5 border-b border-slate-700">
                <span className="text-slate-300">First 8 Hours / Holiday Base:</span>
                <span className="font-black text-white">₱{simBreakdown.baseDayPay.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-700">
                <span className="text-slate-300">Holiday Overtime Pay ({otHours}h):</span>
                <span className="font-black text-emerald-400">₱{simBreakdown.otPay.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-700">
                <span className="text-slate-300">Night Differential ({nightHours}h):</span>
                <span className="font-black text-cyan-300">₱{simBreakdown.nightDiffPay.toFixed(2)}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-700">
              {simBreakdown.formulaDescription}
            </p>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: HOLIDAY MINI-QUIZ */}
      {subTab === 'quiz' && (
        <div className="bg-white rounded-3xl mario-card border-4 border-slate-950 p-5 sm:p-8 space-y-5 max-w-4xl mx-auto">
          <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3 flex-wrap gap-2">
            <span className="text-xs font-black font-mario text-red-600">
              HOLIDAY QUESTION {quizIdx + 1} OF {HOLIDAY_QUIZ_ITEMS.length}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-400 text-xs font-black">
              Score: {quizScore} / {HOLIDAY_QUIZ_ITEMS.length}
            </span>
          </div>

          <p className={`${bodyTextClass} font-black text-slate-950 bg-slate-50 p-4 rounded-2xl border-2 border-slate-800`}>
            &ldquo;{activeQuiz.q}&rdquo;
          </p>

          <div className="space-y-2.5">
            {activeQuiz.options.map((opt, idx) => {
              let cls = 'bg-white hover:bg-slate-50 border-slate-800 text-slate-900';
              if (pickedOpt === idx) cls = 'bg-amber-100 border-amber-600 text-slate-950 ring-2 ring-amber-400';
              if (submitted) {
                if (idx === activeQuiz.correct) cls = 'bg-emerald-100 border-emerald-700 text-emerald-950 ring-2 ring-emerald-400';
                else if (pickedOpt === idx) cls = 'bg-rose-100 border-rose-600 text-rose-950';
              }
              return (
                <button
                  key={idx}
                  disabled={submitted}
                  onClick={() => {
                    setPickedOpt(idx);
                    marioAudio.playJump();
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-all ${cls}`}
                >
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-950 text-amber-300 text-xs font-black font-mario shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="font-bold text-sm">{opt}</span>
                </button>
              );
            })}
          </div>

          {submitted && (
            <div className={`p-4 rounded-2xl border-2 ${pickedOpt === activeQuiz.correct ? 'bg-emerald-50 border-emerald-500' : 'bg-rose-50 border-rose-500'}`}>
              <div className="flex items-center gap-2 font-black text-sm mb-1">
                {pickedOpt === activeQuiz.correct ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="text-emerald-900">CORRECT! +5 COINS!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span className="text-rose-900">CHECK STATUTORY DOCTRINE:</span>
                  </>
                )}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-800">{activeQuiz.explain}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            <button
              onClick={() => {
                setQuizIdx(0);
                setPickedOpt(null);
                setSubmitted(false);
                setQuizScore(0);
              }}
              className="h-10 inline-flex items-center justify-center gap-1.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs border-2 border-slate-900 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Quiz</span>
            </button>

            {!submitted ? (
              <button
                disabled={pickedOpt === null}
                onClick={() => {
                  if (pickedOpt === null) return;
                  setSubmitted(true);
                  if (pickedOpt === activeQuiz.correct) {
                    setQuizScore((s) => s + 1);
                    onEarnCoins?.(5);
                    marioAudio.playCoin();
                    try {
                      confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
                    } catch {
                      // ignore
                    }
                  } else {
                    marioAudio.playWrongAnswer();
                  }
                }}
                className="h-10 inline-flex items-center justify-center gap-2 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 font-black text-xs sm:text-sm border-2 border-black shadow-[0_3px_0_#000] cursor-pointer"
              >
                <span>Submit Holiday Answer</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setQuizIdx((i) => (i + 1) % HOLIDAY_QUIZ_ITEMS.length);
                  setPickedOpt(null);
                  setSubmitted(false);
                  marioAudio.playPipe();
                }}
                className="h-10 inline-flex items-center justify-center gap-2 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs sm:text-sm border-2 border-black shadow-[0_3px_0_#000] cursor-pointer"
              >
                <span>Next Holiday Scenario</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
