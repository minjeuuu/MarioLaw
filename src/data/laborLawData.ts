import { MODULE_1_HOURS_OF_WORK } from './module1HoursOfWork';
import { MODULE_2_REST_HOLIDAYS_13TH } from './module2RestHolidays13th';
import { MODULE_3_WAGES } from './module3Wages';
import { MODULE_4_SPECIAL_GROUPS } from './module4SpecialGroups';
import { MODULE_5_PROTECTIVE_LAWS } from './module5ProtectiveLaws';
import { MODULE_6_LEAVES } from './module6Leaves';
import { REGIONAL_MINIMUM_WAGES, KASAMBAHAY_MINIMUM_WAGES } from './regionalWages';
import { LABOR_BENEFITS_MULTIPLIER_LIST } from './multiplierTable';
import { FLASHCARDS_DATA } from './flashcardsData';
import { LawTopic } from '../types/laborLaw';

export interface WorldMeta {
  id: string;
  worldNumber: number;
  title: string;
  shortTitle: string;
  themeColor: string;
  accentBg: string;
  iconType: 'mushroom' | 'flower' | 'star' | 'crown' | '1up';
  description: string;
  itemCount: number;
}

export const WORLDS_METADATA: WorldMeta[] = [
  {
    id: 'world1',
    worldNumber: 1,
    title: 'WORLD 1: HOURS OF WORK',
    shortTitle: 'Hours of Work',
    themeColor: '#e52521', // Mario Red
    accentBg: 'bg-red-500',
    iconType: 'mushroom',
    description: 'Articles 82-90: Coverage, Managerial & Field Tests, Compensable Hours, Brownouts, Travel Time, CWW, Overtime & Night Shift Differential',
    itemCount: MODULE_1_HOURS_OF_WORK.length,
  },
  {
    id: 'world2',
    worldNumber: 2,
    title: 'WORLD 2: REST, HOLIDAYS & 13TH MONTH',
    shortTitle: 'Rest & Holidays',
    themeColor: '#00a13a', // Luigi Green
    accentBg: 'bg-emerald-600',
    iconType: 'flower',
    description: 'Weekly Rest Periods, 12 Regular & 9 Special Holidays, Double Holidays, R.A. 11360 Service Charge (100%), and P.D. 851 13th Month Pay',
    itemCount: MODULE_2_REST_HOLIDAYS_13TH.length,
  },
  {
    id: 'world3',
    worldNumber: 3,
    title: 'WORLD 3: WAGES & CONTRACTING',
    shortTitle: 'Wages & D.O. 174',
    themeColor: '#0055a5', // Mario Blue
    accentBg: 'bg-blue-600',
    iconType: 'star',
    description: 'No Work-No Pay, Wage vs Salary, Facilities vs Supplements, 12 Exemptions, D.O. 174 Job vs Labor-Only Contracting, Allowable Deductions & Wage Distortion',
    itemCount: MODULE_3_WAGES.length,
  },
  {
    id: 'world4',
    worldNumber: 4,
    title: 'WORLD 4: SPECIAL GROUPS OF EMPLOYEES',
    shortTitle: 'Special Groups',
    themeColor: '#c84c0c', // Fire Mario Orange
    accentBg: 'bg-amber-600',
    iconType: 'crown',
    description: 'Women Facilities & Discrimination, Minor Employment (Below 15 / 15-18), Batas Kasambahay (R.A. 10361), Homeworkers, and Night Workers (R.A. 10151)',
    itemCount: MODULE_4_SPECIAL_GROUPS.length,
  },
  {
    id: 'world5',
    worldNumber: 5,
    title: 'WORLD 5: PROTECTIVE LAWS & STATUTES',
    shortTitle: 'Protective Laws',
    themeColor: '#7c3aed', // Wario Purple / Star Power
    accentBg: 'bg-purple-600',
    iconType: '1up',
    description: 'Breastfeeding Act (R.A. 10028), R.A. 7192, Magna Carta (R.A. 9710), Sexual Harassment (R.A. 7877), Safe Spaces Act (R.A. 11313), Anti-VAWC (R.A. 9262), SPES & Telecommuting',
    itemCount: MODULE_5_PROTECTIVE_LAWS.length,
  },
  {
    id: 'world6',
    worldNumber: 6,
    title: 'WORLD 6: STATUTORY LEAVES & WELFARE',
    shortTitle: 'Statutory Leaves',
    themeColor: '#db2777', // Princess Peach Pink
    accentBg: 'bg-pink-600',
    iconType: 'crown',
    description: 'Service Incentive Leave (Art. 95), 105-Day Maternity Leave (R.A. 11210), Paternity Leave (R.A. 8187), Solo Parents Welfare (R.A. 11861), Gynecological Leave (R.A. 9710), and VAWC Leave (R.A. 9262)',
    itemCount: MODULE_6_LEAVES.length,
  },
];

export const ALL_LAW_TOPICS: LawTopic[] = [
  ...MODULE_1_HOURS_OF_WORK,
  ...MODULE_2_REST_HOLIDAYS_13TH,
  ...MODULE_3_WAGES,
  ...MODULE_4_SPECIAL_GROUPS,
  ...MODULE_5_PROTECTIVE_LAWS,
  ...MODULE_6_LEAVES,
];

export {
  MODULE_1_HOURS_OF_WORK,
  MODULE_2_REST_HOLIDAYS_13TH,
  MODULE_3_WAGES,
  MODULE_4_SPECIAL_GROUPS,
  MODULE_5_PROTECTIVE_LAWS,
  MODULE_6_LEAVES,
  REGIONAL_MINIMUM_WAGES,
  KASAMBAHAY_MINIMUM_WAGES,
  LABOR_BENEFITS_MULTIPLIER_LIST,
  FLASHCARDS_DATA,
};
