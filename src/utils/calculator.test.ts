import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeHourlyRate,
  computeDailyFromMonthly,
  computeMonthlyFromDaily,
  computePayBreakdown,
  compute13thMonthPay,
  computeProRated13thMonth,
  computeWageDistortionAdjustment,
} from './calculator';

test('computeHourlyRate calculates Daily Wage / 8', () => {
  assert.equal(computeHourlyRate(640), 80);
  assert.equal(computeHourlyRate(800), 100);
});

test('computeDailyFromMonthly using factor 365', () => {
  // 15,000 * 12 / 365 = 180,000 / 365 = 493.15
  assert.equal(computeDailyFromMonthly(15000, 365), 493.15);
});

test('computeMonthlyFromDaily using factor 365', () => {
  // 500 * 365 / 12 = 182,500 / 12 = 15208.33
  assert.equal(computeMonthlyFromDaily(500, 365), 15208.33);
});

test('Ordinary Day with 2 hours Overtime', () => {
  const result = computePayBreakdown({
    dailyWage: 800,
    workScenario: 'ordinary',
    regularHoursWorked: 8,
    otHours: 2,
    nightDiffHours: 0,
  });
  // Hourly rate: 100
  // Base pay: 800
  // OT pay: 100 * 1.25 * 2 = 250
  // Total: 1050
  assert.equal(result.hourlyRate, 100);
  assert.equal(result.baseDayPay, 800);
  assert.equal(result.otPay, 250);
  assert.equal(result.totalPay, 1050);
});

test('Worked Rest Day (130%)', () => {
  const result = computePayBreakdown({
    dailyWage: 800,
    workScenario: 'rest_day',
    regularHoursWorked: 8,
    otHours: 0,
    nightDiffHours: 0,
  });
  // 800 * 1.3 = 1040
  assert.equal(result.baseDayPay, 1040);
  assert.equal(result.totalPay, 1040);
});

test('Worked Regular Holiday on Rest Day (260%)', () => {
  const result = computePayBreakdown({
    dailyWage: 1000,
    workScenario: 'regular_holiday_rest_day_worked',
    regularHoursWorked: 8,
    otHours: 0,
    nightDiffHours: 0,
  });
  // 1000 * 2.6 = 2600
  assert.equal(result.baseDayPay, 2600);
  assert.equal(result.totalPay, 2600);
});

test('Worked Double Holiday (300%)', () => {
  const result = computePayBreakdown({
    dailyWage: 1000,
    workScenario: 'double_regular_holiday_worked',
    regularHoursWorked: 8,
    otHours: 0,
    nightDiffHours: 0,
  });
  // 1000 * 3.0 = 3000
  assert.equal(result.baseDayPay, 3000);
  assert.equal(result.totalPay, 3000);
});

test('Unworked Regular Holiday yields 100% daily wage', () => {
  const result = computePayBreakdown({
    dailyWage: 750,
    workScenario: 'regular_holiday_unworked',
    regularHoursWorked: 0,
    otHours: 0,
    nightDiffHours: 0,
  });
  assert.equal(result.totalPay, 750);
});

test('13th month pay computation', () => {
  const yearSalaries = Array(12).fill(25000);
  assert.equal(compute13thMonthPay(yearSalaries), 25000);

  // Pro-rated for 6 months
  assert.equal(computeProRated13thMonth(24000, 6), 12000);
});

test('Wage distortion formula calculates correct restore adjustment', () => {
  // Minimum wage = 500, actual salary = 600, prescribed increase = 50
  // Ratio = 500 / 600 = 0.8333... * 50 = 41.67
  const adjustment = computeWageDistortionAdjustment(500, 600, 50);
  assert.equal(adjustment, 41.67);
});
