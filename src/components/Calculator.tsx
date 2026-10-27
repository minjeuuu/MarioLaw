import React, { useState } from 'react';
import {
  computeHourlyRate,
  computeDailyFromMonthly,
  computeMonthlyFromDaily,
  computePayBreakdown,
  computeProRated13thMonth,
  computeWageDistortionAdjustment,
} from '../utils/calculator';
import { LABOR_BENEFITS_MULTIPLIER_LIST } from '../data/multiplierTable';
import { marioAudio } from '../utils/audio';
import { Calculator, ArrowRight, Zap, RefreshCw, Check, BookOpen } from 'lucide-react';
import { MarioCoinIcon, MarioMushroomIcon } from './MarioIcons';

interface CalculatorProps {
  fontSize: 'normal' | 'large' | 'xlarge';
}

export const BenefitsCalculator: React.FC<CalculatorProps> = ({ fontSize }) => {
  // Wage input states
  const [dailyWage, setDailyWage] = useState<number>(640);
  const [monthlyWage, setMonthlyWage] = useState<number>(19466.67);
  const [calcFactor, setCalcFactor] = useState<number>(365);

  // Scenario states
  const [scenario, setScenario] = useState<
    | 'ordinary'
    | 'rest_day'
    | 'special_holiday'
    | 'special_holiday_rest_day'
    | 'regular_holiday_unworked'
    | 'regular_holiday_worked'
    | 'regular_holiday_rest_day_worked'
    | 'double_regular_holiday_unworked'
    | 'double_regular_holiday_worked'
  >('ordinary');

  const [regularHours, setRegularHours] = useState<number>(8);
  const [otHours, setOtHours] = useState<number>(2);
  const [nightHours, setNightHours] = useState<number>(0);
  const [isNightDuringOT, setIsNightDuringOT] = useState<boolean>(false);

  // 13th Month Pay states
  const [thirteenthBasic, setThirteenthBasic] = useState<number>(25000);
  const [thirteenthMonths, setThirteenthMonths] = useState<number>(12);

  // Wage Distortion states
  const [distortionPrevMin, setDistortionPrevMin] = useState<number>(610);
  const [distortionActual, setDistortionActual] = useState<number>(670);
  const [distortionIncrease, setDistortionIncrease] = useState<number>(35);

  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  const handleDailyWageChange = (val: number) => {
    setDailyWage(val);
    setMonthlyWage(computeMonthlyFromDaily(val, calcFactor));
  };

  const handleMonthlyWageChange = (val: number) => {
    setMonthlyWage(val);
    setDailyWage(computeDailyFromMonthly(val, calcFactor));
  };

  const handleFactorChange = (f: number) => {
    setCalcFactor(f);
    setMonthlyWage(computeMonthlyFromDaily(dailyWage, f));
  };

  // Compute live breakdown
  const payResult = computePayBreakdown({
    dailyWage: Number(dailyWage) || 0,
    workScenario: scenario,
    regularHoursWorked: Number(regularHours) || 0,
    otHours: Number(otHours) || 0,
    nightDiffHours: Number(nightHours) || 0,
    isNightDiffDuringOT: isNightDuringOT,
  });

  const thirteenthResult = computeProRated13thMonth(
    Number(thirteenthBasic) || 0,
    Number(thirteenthMonths) || 0
  );

  const distortionAdjustment = computeWageDistortionAdjustment(
    Number(distortionPrevMin) || 0,
    Number(distortionActual) || 0,
    Number(distortionIncrease) || 0
  );

  const bodyTextClass =
    fontSize === 'xlarge' ? 'text-xl' : fontSize === 'large' ? 'text-lg' : 'text-base';

  return (
    <div className="space-y-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-3xl p-5 sm:p-6 md:p-8 mario-card border-4 border-slate-950">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400 text-slate-950 font-black rounded-lg border border-black text-xs uppercase font-mario">
              <span>WARP ZONE PIPE #1</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white font-display">
              LABOR MULTIPLIER &amp; WAGE CALCULATOR
            </h2>
            <p className={`${bodyTextClass} text-emerald-100 max-w-2xl font-semibold text-sm sm:text-base`}>
              Interactive simulation engine powered directly by the official Philippine Labor Code Multiplier Table.
              Test regular workdays, rest days, special holidays, regular holidays, double holidays, overtime, and night differentials with step-by-step statutory formulas.
            </p>
          </div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-400 border-4 border-black rounded-2xl flex items-center justify-center shadow-[4px_4px_0_#000] shrink-0">
            <MarioCoinIcon className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
        </div>
      </div>

      {/* Main Grid: Calculator Inputs & Result Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Input Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl mario-card border-4 border-slate-900 p-4 sm:p-6 md:p-7 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-b-2 border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-emerald-600 rounded-xs border border-black shrink-0" />
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display">1. Wage &amp; Shift Configuration</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-600">Factor:</span>
              <button
                type="button"
                onClick={() => handleFactorChange(365)}
                className={`min-h-[38px] px-3 py-1 rounded-lg text-sm font-black border border-black cursor-pointer ${
                  calcFactor === 365 ? 'bg-amber-400 text-black shadow-sm' : 'bg-slate-100 text-slate-700'
                }`}
              >
                365 Days
              </button>
              <button
                type="button"
                onClick={() => handleFactorChange(304)}
                className={`min-h-[38px] px-3 py-1 rounded-lg text-sm font-black border border-black cursor-pointer ${
                  calcFactor === 304 ? 'bg-amber-400 text-black shadow-sm' : 'bg-slate-100 text-slate-700'
                }`}
              >
                304 Days
              </button>
            </div>
          </div>

          {/* Wage Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-800 font-extrabold text-base mb-1.5">
                Daily Wage Rate (PHP)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={dailyWage}
                onChange={(e) => handleDailyWageChange(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border-3 border-slate-800 rounded-xl px-4 py-2.5 font-black text-xl text-slate-900 focus:bg-amber-50 focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all"
              />
              <span className="text-xs font-bold text-slate-500 mt-1 block">
                Hourly Base: PHP {computeHourlyRate(dailyWage).toFixed(2)}/hr
              </span>
            </div>

            <div>
              <label className="block text-slate-800 font-extrabold text-base mb-1.5">
                Equivalent Monthly Pay (PHP)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={monthlyWage}
                onChange={(e) => handleMonthlyWageChange(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border-3 border-slate-800 rounded-xl px-4 py-2.5 font-black text-xl text-slate-900 focus:bg-amber-50 focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all"
              />
              <span className="text-xs font-bold text-slate-500 mt-1 block">
                Converted using factor {calcFactor}
              </span>
            </div>
          </div>

          {/* Scenario Selector */}
          <div>
            <label className="block text-slate-900 font-black text-lg mb-2 flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-xs border border-black" />
              <span>Day / Work Scenario (Statutory Multiplier)</span>
            </label>
            <select
              value={scenario}
              onChange={(e) => {
                setScenario(e.target.value as typeof scenario);
                marioAudio.playPipe();
              }}
              className="w-full bg-amber-50 border-3 border-slate-900 rounded-xl px-4 py-3 font-extrabold text-lg text-slate-900 focus:outline-none focus:ring-4 focus:ring-amber-400 cursor-pointer"
            >
              <option value="ordinary">Ordinary Regular Workday (100% Day Rate | OT 125%)</option>
              <option value="rest_day">Worked Scheduled Rest Day (130% Day Rate | OT 169%)</option>
              <option value="special_holiday">Worked Special Holiday (130% Day Rate | OT 169%)</option>
              <option value="special_holiday_rest_day">Worked Special Holiday on Rest Day (150% Day Rate | OT 195%)</option>
              <option value="regular_holiday_unworked">Unworked Regular Holiday (100% Daily Wage)</option>
              <option value="regular_holiday_worked">Worked Regular Holiday (200% Day Rate | OT 260%)</option>
              <option value="regular_holiday_rest_day_worked">Worked Regular Holiday on Rest Day (260% Day Rate | OT 338%)</option>
              <option value="double_regular_holiday_unworked">Unworked Double Regular Holiday (200% Daily Wage)</option>
              <option value="double_regular_holiday_worked">Worked Double Regular Holiday (300% Day Rate | OT 390%)</option>
            </select>
          </div>

          {/* Hours inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-800 font-bold text-sm mb-1">
                Regular Hours Worked
              </label>
              <input
                type="number"
                min="0"
                max="8"
                value={regularHours}
                onChange={(e) => setRegularHours(Math.min(8, Math.max(0, parseFloat(e.target.value) || 0)))}
                className="w-full bg-slate-50 border-2 border-slate-800 rounded-xl px-3 py-2 font-black text-lg text-slate-900"
              />
              <span className="text-xs text-slate-500 font-bold">Standard 8 hrs</span>
            </div>

            <div>
              <label className="block text-slate-800 font-bold text-sm mb-1">
                Overtime Hours
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={otHours}
                onChange={(e) => setOtHours(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full bg-slate-50 border-2 border-slate-800 rounded-xl px-3 py-2 font-black text-lg text-slate-900"
              />
              <span className="text-xs text-slate-500 font-bold">Excess beyond 8h</span>
            </div>

            <div>
              <label className="block text-slate-800 font-bold text-sm mb-1">
                Night Diff Hours (10PM-6AM)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                max="8"
                value={nightHours}
                onChange={(e) => setNightHours(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full bg-slate-50 border-2 border-slate-800 rounded-xl px-3 py-2 font-black text-lg text-slate-900"
              />
              <span className="text-xs text-slate-500 font-bold">+10% differential</span>
            </div>
          </div>

          {/* Night Diff During OT Checkbox */}
          {nightHours > 0 && (
            <div className="flex items-center gap-3 bg-indigo-50 border-2 border-indigo-300 rounded-xl p-3">
              <input
                type="checkbox"
                id="nightOtCheckbox"
                checked={isNightDuringOT}
                onChange={(e) => setIsNightDuringOT(e.target.checked)}
                className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
              />
              <label htmlFor="nightOtCheckbox" className="text-sm font-bold text-indigo-950 cursor-pointer">
                Night differential hours were performed DURING overtime (applies 10% on top of overtime rate)
              </label>
            </div>
          )}
        </div>

        {/* Right Column: Live Computation Result (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-2xl nes-card border-4 border-black p-6 md:p-7 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-white/20 pb-3 mb-4">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                LIVE PAYROLL SUMMARY
              </span>
              <span className="text-sm font-extrabold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500">
                Multiplier: {(payResult.multiplierUsed * 100).toFixed(0)}%
              </span>
            </div>

            <div className="space-y-4">
              {/* Base Pay */}
              <div className="flex items-center justify-between">
                <span className={`${bodyTextClass} text-slate-300`}>Base Day Pay (8 hrs)</span>
                <span className={`${bodyTextClass} font-black text-white`}>
                  PHP {payResult.baseDayPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* OT Pay */}
              <div className="flex items-center justify-between">
                <span className={`${bodyTextClass} text-slate-300`}>
                  Overtime Pay ({otHours} hrs)
                </span>
                <span className={`${bodyTextClass} font-black text-amber-300`}>
                  PHP {payResult.otPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Night Diff Pay */}
              <div className="flex items-center justify-between">
                <span className={`${bodyTextClass} text-slate-300`}>
                  Night Differential ({nightHours} hrs)
                </span>
                <span className={`${bodyTextClass} font-black text-cyan-300`}>
                  PHP {payResult.nightDiffPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="border-t-2 border-white/30 pt-4 flex flex-wrap items-end justify-between gap-2">
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block">
                    TOTAL ESTIMATED PAY
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400 tabular-nums">
                    PHP {payResult.totalPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400 font-semibold block">Hourly Rate</span>
                  <span className="text-lg font-black text-amber-200 tabular-nums">
                    PHP {payResult.hourlyRate.toFixed(2)}/hr
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Statutory Formula Card */}
          <div className="bg-white/10 rounded-xl p-4 border border-white/20 space-y-1.5">
            <span className="text-xs font-black uppercase text-amber-300 block">
              STATUTORY FORMULA APPLIED:
            </span>
            <p className="text-xs sm:text-sm font-mono text-emerald-200 break-words">
              {payResult.formulaDescription}
            </p>
            <p className="text-xs text-slate-300 italic">
              Note: Regular Daily Pay, Rest Day Pay, and Holiday Pay are already good for 8 hours of regular work time.
            </p>
          </div>
        </div>
      </div>

      {/* Secondary Tools: 13th Month Pay & Wage Distortion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 13th Month Pay Estimator */}
        <div className="bg-white rounded-2xl mario-card border-4 border-slate-900 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-slate-200 pb-3">
            <MarioCoinIcon className="w-6 h-6" />
            <div>
              <h3 className="text-xl font-black text-slate-900 font-display">2. 13th Month Pay Estimator</h3>
              <span className="text-xs font-bold text-slate-500 uppercase">P.D. 851 • 1/12 Rule</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Monthly Basic Salary (PHP)
              </label>
              <input
                type="number"
                min="0"
                value={thirteenthBasic}
                onChange={(e) => setThirteenthBasic(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border-2 border-slate-800 rounded-xl px-3 py-2 font-black text-lg text-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Months Worked in Year
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={thirteenthMonths}
                onChange={(e) => setThirteenthMonths(Math.min(12, Math.max(1, parseFloat(e.target.value) || 1)))}
                className="w-full bg-slate-50 border-2 border-slate-800 rounded-xl px-3 py-2 font-black text-lg text-slate-900"
              />
            </div>
          </div>

          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 flex items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-amber-900 uppercase block">
                {thirteenthMonths === 12 ? 'Full 13th Month Pay' : `Pro-Rated (${thirteenthMonths}/12 Months)`}
              </span>
              <span className="text-2xl font-black text-red-700 font-display tabular-nums">
                PHP {thirteenthResult.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <MarioCoinIcon className="w-8 h-8 shrink-0" />
          </div>
          <p className="text-xs text-slate-600 font-semibold italic">
            Excludes overtime, premium, night shift differential, holiday pay, COLA, and unused leave credits.
          </p>
        </div>

        {/* Wage Distortion Calculator */}
        <div className="bg-white rounded-2xl mario-card border-4 border-slate-900 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-slate-200 pb-3">
            <div className="w-3.5 h-3.5 bg-blue-600 rounded-xs border border-black shrink-0" />
            <div>
              <h3 className="text-xl font-black text-slate-900 font-display">3. Wage Distortion Restorer</h3>
              <span className="text-xs font-bold text-slate-500 uppercase">
                (Min Wage / Actual) x Prescribed Increase
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Prev Min Wage</label>
              <input
                type="number"
                value={distortionPrevMin}
                onChange={(e) => setDistortionPrevMin(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border-2 border-slate-800 rounded-lg px-2.5 py-2 font-bold text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Actual Salary</label>
              <input
                type="number"
                value={distortionActual}
                onChange={(e) => setDistortionActual(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border-2 border-slate-800 rounded-lg px-2.5 py-2 font-bold text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Increase Amount</label>
              <input
                type="number"
                value={distortionIncrease}
                onChange={(e) => setDistortionIncrease(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border-2 border-slate-800 rounded-lg px-2.5 py-2 font-bold text-sm"
              />
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-blue-900 uppercase block">
                Recommended Wage Increase
              </span>
              <span className="text-2xl font-black text-blue-700 font-display tabular-nums">
                +PHP {distortionAdjustment.toFixed(2)}/day
              </span>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-500 font-semibold block">Adjusted Salary</span>
              <span className="text-lg font-black text-slate-900 tabular-nums">
                PHP {(distortionActual + distortionAdjustment).toFixed(2)}/day
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-600 font-semibold italic">
            Preserves intentional quantitative gap between wage levels following regional wage orders.
          </p>
        </div>
      </div>

      {/* Complete Labor Benefits Multiplier Reference Matrix */}
      <div className="bg-white rounded-2xl mario-card border-4 border-slate-900 overflow-hidden">
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <h3 className="text-xl sm:text-2xl font-black font-display">Official Multiplier Table Reference</h3>
              <p className="text-slate-300 text-xs sm:text-sm font-semibold">
                Complete verbatim formulas from the Labor Benefits Multiplier Table
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Stacked Formula Cards */}
        <div className="block md:hidden divide-y divide-slate-200">
          {LABOR_BENEFITS_MULTIPLIER_LIST.map((item, idx) => (
            <div key={idx} className="p-4 space-y-2 hover:bg-amber-50/60">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-black uppercase text-slate-500 block">{item.benefit}</span>
                  <span className="text-sm font-black text-slate-950 block mt-0.5">{item.scenario}</span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${item.benefit} - ${item.scenario}: ${item.formula}`);
                    setCopiedFormula(item.scenario);
                    marioAudio.playCoin();
                    setTimeout(() => setCopiedFormula(null), 1500);
                  }}
                  className="min-h-[36px] px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg border border-black text-xs shadow-sm cursor-pointer shrink-0"
                >
                  {copiedFormula === item.scenario ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold text-red-700 text-xs break-words">
                {item.formula}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table with guaranteed min-width and no vertical text collapse */}
        <div className="hidden md:block overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[820px]">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-300 text-slate-900 font-black text-sm lg:text-base">
                <th className="p-4 border-r border-slate-300 min-w-[200px] whitespace-nowrap">BENEFIT</th>
                <th className="p-4 border-r border-slate-300 min-w-[240px] whitespace-nowrap">SCENARIO</th>
                <th className="p-4 border-r border-slate-300 min-w-[280px] whitespace-nowrap">EXACT STATUTORY FORMULA</th>
                <th className="p-4 text-center min-w-[100px] whitespace-nowrap">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {LABOR_BENEFITS_MULTIPLIER_LIST.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-amber-50 transition-colors font-medium text-slate-900"
                >
                  <td className="p-4 font-bold border-r border-slate-200 whitespace-nowrap text-sm lg:text-base min-w-[200px]">
                    {item.benefit}
                  </td>
                  <td className="p-4 border-r border-slate-200 text-sm lg:text-base min-w-[240px] whitespace-normal break-normal">
                    {item.scenario}
                  </td>
                  <td className="p-4 font-mono font-bold text-red-700 border-r border-slate-200 text-xs lg:text-sm min-w-[280px] whitespace-normal break-normal">
                    {item.formula}
                  </td>
                  <td className="p-4 text-center whitespace-nowrap min-w-[100px]">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${item.benefit} - ${item.scenario}: ${item.formula}`);
                        setCopiedFormula(item.scenario);
                        marioAudio.playCoin();
                        setTimeout(() => setCopiedFormula(null), 1500);
                      }}
                      className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg border border-black text-xs shadow-sm cursor-pointer whitespace-nowrap"
                    >
                      {copiedFormula === item.scenario ? 'Copied!' : 'Copy'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
