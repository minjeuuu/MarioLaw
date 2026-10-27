/**
 * Labor Law Benefits & Wage Calculation Utilities
 * Based on the Philippine Labor Code & Multiplier Rules
 */

export interface CalculationInput {
  dailyWage: number;
  workScenario:
    | 'ordinary'
    | 'rest_day'
    | 'special_holiday'
    | 'special_holiday_rest_day'
    | 'regular_holiday_unworked'
    | 'regular_holiday_worked'
    | 'regular_holiday_rest_day_worked'
    | 'double_regular_holiday_unworked'
    | 'double_regular_holiday_worked'
    | 'double_regular_holiday_rest_day_worked';
  regularHoursWorked: number; // usually 8
  otHours: number;
  nightDiffHours: number;
  isNightDiffDuringOT?: boolean;
}

export interface CalculationResult {
  hourlyRate: number;
  baseDayPay: number;
  otPay: number;
  nightDiffPay: number;
  totalPay: number;
  multiplierUsed: number;
  formulaDescription: string;
}

export function computeHourlyRate(dailyWage: number): number {
  return Number((dailyWage / 8).toFixed(4));
}

export function computeDailyFromMonthly(monthlyWage: number, factor: number = 365): number {
  return Number(((monthlyWage * 12) / factor).toFixed(2));
}

export function computeMonthlyFromDaily(dailyWage: number, factor: number = 365): number {
  return Number(((dailyWage * factor) / 12).toFixed(2));
}

export function computePayBreakdown(input: CalculationInput): CalculationResult {
  const {
    dailyWage,
    workScenario,
    regularHoursWorked = 8,
    otHours = 0,
    nightDiffHours = 0,
    isNightDiffDuringOT = false,
  } = input;

  const hourlyRate = computeHourlyRate(dailyWage);

  let dayMultiplier = 1.0;
  let otMultiplier = 1.25;
  let formulaDescription = '';

  switch (workScenario) {
    case 'ordinary':
      dayMultiplier = 1.0;
      otMultiplier = 1.25;
      formulaDescription = 'Regular Day: 100% Base Rate | OT: 125%';
      break;
    case 'rest_day':
      dayMultiplier = 1.3;
      otMultiplier = 1.3 * 1.3; // Hourly Rate * 130% * 130% for OT on rest day
      formulaDescription = 'Rest Day Worked: 130% Base Rate | OT: 130% of rest day rate';
      break;
    case 'special_holiday':
      dayMultiplier = 1.3;
      otMultiplier = 1.3 * 1.3;
      formulaDescription = 'Special Holiday: 130% Base Rate | OT: 130% of special holiday rate';
      break;
    case 'special_holiday_rest_day':
      dayMultiplier = 1.5;
      otMultiplier = 1.5 * 1.3;
      formulaDescription = 'Special Holiday + Rest Day: 150% Base Rate | OT: 130% of 150%';
      break;
    case 'regular_holiday_unworked':
      dayMultiplier = 1.0;
      otMultiplier = 0;
      formulaDescription = 'Unworked Regular Holiday: 100% of Daily Wage';
      return {
        hourlyRate,
        baseDayPay: dailyWage,
        otPay: 0,
        nightDiffPay: 0,
        totalPay: dailyWage,
        multiplierUsed: 1.0,
        formulaDescription,
      };
    case 'regular_holiday_worked':
      dayMultiplier = 2.0;
      otMultiplier = 2.0 * 1.3;
      formulaDescription = 'Regular Holiday Worked: 200% Base Rate | OT: 200% * 130%';
      break;
    case 'regular_holiday_rest_day_worked':
      dayMultiplier = 2.6; // 200% + 30% of 200% = 260%
      otMultiplier = 2.6 * 1.3;
      formulaDescription = 'Regular Holiday + Rest Day: 260% Base Rate | OT: 260% * 130%';
      break;
    case 'double_regular_holiday_unworked':
      dayMultiplier = 2.0;
      otMultiplier = 0;
      formulaDescription = 'Double Regular Holiday Unworked: 200% of Daily Wage';
      return {
        hourlyRate,
        baseDayPay: dailyWage * 2.0,
        otPay: 0,
        nightDiffPay: 0,
        totalPay: dailyWage * 2.0,
        multiplierUsed: 2.0,
        formulaDescription,
      };
    case 'double_regular_holiday_worked':
      dayMultiplier = 3.0; // 300%
      otMultiplier = 3.0 * 1.3;
      formulaDescription = 'Double Regular Holiday Worked: 300% Base Rate | OT: 300% * 130%';
      break;
    case 'double_regular_holiday_rest_day_worked':
      dayMultiplier = 3.9; // 300% + 30% of 300% = 390%
      otMultiplier = 3.9 * 1.3;
      formulaDescription = 'Double Regular Holiday + Rest Day: 390% | OT: 390% * 130%';
      break;
  }

  // Base day pay: for 8 hours (or proportional if worked less than 8)
  const baseDayPay = Number((dailyWage * dayMultiplier * (Math.min(regularHoursWorked, 8) / 8)).toFixed(2));

  // Overtime pay
  const otPay = Number((hourlyRate * otMultiplier * otHours).toFixed(2));

  // Night shift differential (10% extra on top of rate)
  // Rate depends on whether ND falls on regular time or overtime
  let ndBaseHourly = hourlyRate * dayMultiplier;
  if (isNightDiffDuringOT) {
    ndBaseHourly = hourlyRate * otMultiplier;
  }
  const nightDiffPay = Number((ndBaseHourly * 0.1 * nightDiffHours).toFixed(2));

  const totalPay = Number((baseDayPay + otPay + nightDiffPay).toFixed(2));

  return {
    hourlyRate,
    baseDayPay,
    otPay,
    nightDiffPay,
    totalPay,
    multiplierUsed: dayMultiplier,
    formulaDescription,
  };
}

export function compute13thMonthPay(basicSalariesEarned: number[]): number {
  const sum = basicSalariesEarned.reduce((acc, curr) => acc + curr, 0);
  return Number((sum / 12).toFixed(2));
}

export function computeProRated13thMonth(monthlyBasic: number, monthsWorked: number): number {
  return Number(((monthlyBasic * monthsWorked) / 12).toFixed(2));
}

export function computeWageDistortionAdjustment(
  previousMinWage: number,
  actualSalary: number,
  prescribedIncrease: number
): number {
  // Formula: Minimum Wage / Actual Salary = % x Prescribed Increase
  if (actualSalary <= 0) return 0;
  const percentage = previousMinWage / actualSalary;
  return Number((percentage * prescribedIncrease).toFixed(2));
}
