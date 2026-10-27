import { formatLocalDayKey, StorageLike } from '../utils/studyModes';

export const DAILY_CHALLENGE_STORAGE_KEY = 'mario_daily_bar_challenge_v1';
export const DAILY_CHALLENGE_BASE_COINS = 75;
export const DAILY_CHALLENGE_REVIEW_COINS = 20;

export interface DailyChallengeScenario {
  id: string;
  worldId: 'world1' | 'world2' | 'world3' | 'world4' | 'world5' | 'world6' | 'holidays';
  worldLabel: string;
  difficultyLabel: 'Bar Exam High-Difficulty' | 'Supreme Court Doctrine Trap' | 'Multi-Issue Statutory Math';
  title: string;
  factPattern: string;
  questionPrompt: string;
  options: [string, string, string, string];
  correctIndex: number;
  statutoryBasis: string;
  doctrinalExplanation: string;
  barTakeaway: string;
}

export interface DailyChallengeRecord {
  dateKey: string;
  challengeId: string;
  completed: boolean;
  selectedOptionIndex: number | null;
  isCorrect: boolean;
  coinsAwarded: number;
  completedAtIso: string | null;
  totalSolvedCount: number;
}

export interface DailyChallengeCountdown {
  hours: number;
  minutes: number;
  seconds: number;
  totalSecondsRemaining: number;
  formatted: string;
}

export const DAILY_CHALLENGE_BANK: readonly DailyChallengeScenario[] = [
  {
    id: 'dc-01-maternity-paternity-allocation',
    worldId: 'world6',
    worldLabel: 'World 6: Statutory Leaves',
    difficultyLabel: 'Bar Exam High-Difficulty',
    title: 'The 14-Day New Father Allocation & Unmarried Cohabitation Trap',
    factPattern:
      'Atty. Sofia and Marco are unmarried partners living together for 6 years. Sofia gives birth to their first child in a private hospital. Sofia executes a written notice allocating seven (7) days of her 105-day Expanded Maternity Leave to Marco, and Marco also files for seven (7) days of statutory Paternity Leave under R.A. 8187 with his employer, Peach Logistics Inc., claiming 14 paid days total.',
    questionPrompt:
      'How many total paid leave days is Marco legally entitled to demand from Peach Logistics Inc.?',
    options: [
      '14 days paid leave (7 days R.A. 8187 Paternity Leave + 7 days R.A. 11210 allocated leave).',
      '7 days paid leave ONLY (under R.A. 11210 allocation, which applies regardless of civil status; he is disqualified from R.A. 8187 Paternity Leave because it strictly requires lawful marriage to the mother).',
      '0 days paid leave because both R.A. 8187 and R.A. 11210 allocation require a valid marriage certificate.',
      '7 days under R.A. 8187 only, because R.A. 11210 allocation is limited to legal spouses.',
    ],
    correctIndex: 1,
    statutoryBasis: 'Sec. 6, R.A. No. 11210 vs. Sec. 2, R.A. No. 8187',
    doctrinalExplanation:
      'Under Sec. 6 of R.A. 11210 (105-Day Expanded Maternity Leave Law), a female worker may allocate up to 7 days of her maternity leave to the child’s father WHETHER OR NOT he is married to her. Conversely, Sec. 2 of R.A. 8187 (Paternity Leave Act) strictly grants the 7-day Paternity Leave ONLY to a MARRIED male employee cohabiting with his legitimate spouse. Because Marco and Sofia are unmarried, Marco gets the 7 allocated days under R.A. 11210, but NOT the 7 days under R.A. 8187.',
    barTakeaway:
      'Married father = up to 14 days (7d RA 8187 + 7d RA 11210). Unmarried father = up to 7 days ONLY via RA 11210 mother’s allocation!',
  },
  {
    id: 'dc-02-sil-prescription-autobus',
    worldId: 'world6',
    worldLabel: 'World 6: Statutory Leaves',
    difficultyLabel: 'Supreme Court Doctrine Trap',
    title: 'Prescription of Unused Service Incentive Leave (Auto Bus Doctrine)',
    factPattern:
      'Luigi worked as a regular warehouseman (not a field personnel) for Koopa Freight Corp. (employing 45 workers) from January 2018 until his resignation on March 1, 2025. Throughout his 7 years of service, he never used his 5-day annual Service Incentive Leave (SIL) and was never paid its cash commutation. On June 1, 2025, Luigi filed a complaint claiming cash conversion of ALL 35 days of unused SIL from 2018 to 2024. Koopa Freight invokes the 3-year prescriptive period under Article 306, arguing claims prior to June 2022 have prescribed.',
    questionPrompt:
      'Rule on Koopa Freight Corp.’s defense of prescription.',
    options: [
      'Sustained: Money claims prescribe strictly 3 years from the end of each calendar year (2018–2021 SIL claims are barred).',
      'Overruled: Under Auto Bus Transport Systems, Inc. v. Bautista, the 3-year prescriptive period for SIL commences NOT at the end of each year, but from the time the employer refuses to pay upon demand OR upon separation from employment (Luigi gets all 7 years)!',
      'Sustained in part: Only the last 5 years are recoverable under the Civil Code.',
      'Overruled: Service Incentive Leave is imprescriptible even 20 years after resignation.',
    ],
    correctIndex: 1,
    statutoryBasis: 'Art. 95 & Art. 306, Labor Code; Auto Bus Transport Systems, Inc. v. Bautista (G.R. No. 156367)',
    doctrinalExplanation:
      'In Auto Bus Transport Systems, Inc. v. Bautista, the Supreme Court held that because an employee may choose either to use SIL or commute it to cash at the end of service, the cause of action for accumulated SIL accrues only when the employer refuses a demand for payment OR upon termination/resignation of employment. Since Luigi resigned on March 1, 2025 and filed on June 1, 2025 (within 3 months), NONE of his 2018–2024 SIL claims have prescribed!',
    barTakeaway:
      '3-year prescription for SIL runs from DEMAND/REFUSAL or SEPARATION from service—not year-by-year!',
  },
  {
    id: 'dc-03-double-holiday-restday-ot',
    worldId: 'holidays',
    worldLabel: 'Holidays & Multipliers',
    difficultyLabel: 'Multi-Issue Statutory Math',
    title: 'Double Regular Holiday Coinciding with Scheduled Rest Day + Overtime',
    factPattern:
      'Toadette earns a basic daily wage of ₱800.00 (₱100.00/hour) for an 8-hour shift. Araw ng Kagitingan (April 9) coincides with Good Friday (a Double Regular Holiday), which also happens to be Toadette’s scheduled weekly Rest Day. At management’s urgent request, Toadette works ten (10) hours from 8:00 AM to 7:00 PM (with a 1-hour meal break).',
    questionPrompt:
      'Compute Toadette’s exact statutory gross pay for that 10-hour shift.',
    options: [
      '₱3,900.00 total (₱3,120.00 for first 8 hours + ₱780.00 for 2 OT hours).',
      '₱4,134.00 total (₱3,120.00 for first 8 hours at 390% + ₱1,014.00 for 2 OT hours at ₱507/hr [507%]).',
      '₱3,180.00 total (₱2,400.00 for first 8 hours at 300% + ₱780.00 for 2 OT hours).',
      '₱2,756.00 total (₱2,080.00 for first 8 hours at 260% + ₱676.00 for 2 OT hours).',
    ],
    correctIndex: 1,
    statutoryBasis: 'Art. 87, 93 & 94, Labor Code; DOLE Statutory Benefits Handbook',
    doctrinalExplanation:
      'Step 1 (First 8 Hours): Double Regular Holiday worked = 300%. Because it also falls on her scheduled Rest Day, add +30% of 300% (+90%) = 390%. ₱800 × 3.90 = ₱3,120.00 (effective hourly rate on that day = ₱390.00/hr). Step 2 (2 Hours Overtime): Holiday/Rest Day OT adds +30% on top of the 390% hourly rate: ₱100 × 3.90 × 1.30 = ₱507.00/hr (507%). For 2 OT hours: ₱507 × 2 = ₱1,014.00. Total = ₱3,120.00 + ₱1,014.00 = ₱4,134.00!',
    barTakeaway:
      'Double Reg Holiday + Rest Day = 390% first 8 hrs; Overtime rate = 390% × 1.30 = 507% per hour!',
  },
  {
    id: 'dc-04-exact-headcount-exemption-trap',
    worldId: 'world3',
    worldLabel: 'World 3: Wages & Thresholds',
    difficultyLabel: 'Bar Exam High-Difficulty',
    title: 'The 5 / 9 / 10 Retail Worker Headcount Statutory Trap',
    factPattern:
      'Yoshi Bakeshop is a neighborhood retail pastry store employing EXACTLY ten (10) regular rank-and-file bakers and cashiers. It applies with the RTWPB for a minimum wage exemption and simultaneously stops paying Regular Holiday Pay, Service Incentive Leave (SIL), and Night Shift Differential (NSD), claiming small retail establishments with 10 workers are exempt from all four.',
    questionPrompt:
      'Which statutory exemptions may Yoshi Bakeshop validly invoke with EXACTLY ten (10) regular workers?',
    options: [
      'Exempt from all four: Minimum Wage, Holiday Pay, SIL, and NSD.',
      'May apply ONLY for Minimum Wage exemption ("not more than 10" = ≤10 workers upon RTWPB approval); it is NOT exempt from Holiday Pay or SIL (both require "less than 10" = ≤9 workers) nor NSD ("not more than 5" = ≤5 workers)!',
      'Exempt from Minimum Wage, Holiday Pay, and SIL, but liable for NSD.',
      'Exempt from none because retail exemptions were repealed by R.A. 6727.',
    ],
    correctIndex: 1,
    statutoryBasis: 'Art. 82/86 (NSD ≤5), Art. 94 (Holiday <10), Art. 95 (SIL <10), R.A. 6727 Sec. 4 (Min Wage ≤10)',
    doctrinalExplanation:
      'One of the sharpest Bar Exam distinctions in Philippine Labor Standards: (1) Night Shift Differential exempts retail/service establishments regularly employing NOT MORE THAN FIVE (≤5) workers; (2) Regular Holiday Pay (Art. 94) and Service Incentive Leave (Art. 95) exempt retail/service establishments regularly employing LESS THAN TEN (<10, meaning at most 9) workers; (3) R.A. 6727 allows retail/service establishments employing NOT MORE THAN TEN (≤10) workers to apply with the RTWPB for minimum wage exemption. At 10 workers, ONLY R.A. 6727 (upon RTWPB application) is available!',
    barTakeaway:
      'NSD = ≤ 5 workers | Holiday Pay & SIL = < 10 workers (max 9!) | R.A. 6727 Min Wage application = ≤ 10 workers!',
  },
  {
    id: 'dc-05-do174-labor-only-contracting',
    worldId: 'world3',
    worldLabel: 'World 3: D.O. 174 Contracting',
    difficultyLabel: 'Supreme Court Doctrine Trap',
    title: 'Substantial Capital Alone vs. Right of Control in D.O. 174',
    factPattern:
      'ShyGuy Manpower Inc. has ₱8,000,000.00 in verified paid-up capital (exceeding the ₱5M D.O. 174 threshold) and holds a DOLE Certificate of Registration. It deploys 40 assembly-line operators to Bowser Electronics Corp. Inside the plant, Bowser’s own floor supervisors set the operators’ daily quotas, discipline them, approve leaves, and dictate assembly methods using Bowser’s conveyor machines.',
    questionPrompt:
      'What is the legal status of ShyGuy Manpower Inc. and its deployed operators?',
    options: [
      'Legitimate Job Contractor because it exceeds the ₱5,000,000 paid-up capital requirement and holds a DOLE registration.',
      'Prohibited Labor-Only Contractor! Even with ≥₱5M capital, lacking the Right of Control over the performance of the work renders the arrangement Labor-Only Contracting, making Bowser Electronics the DIRECT EMPLOYER of the 40 workers for all purposes!',
      'Legitimate Job Contractor; Bowser is only subsidiarily liable for unpaid minimum wages.',
      'Independent Freelance Agency governed solely by the Civil Code.',
    ],
    correctIndex: 1,
    statutoryBasis: 'Art. 106, Labor Code; Sec. 5(b), DOLE D.O. No. 174-17; Alilin v. Petron Corp.',
    doctrinalExplanation:
      'Under Section 5 of DOLE D.O. No. 174-17, Labor-Only Contracting exists under EITHER of two independent prongs: Prong (a) lack of substantial capital/investment + work directly related to principal’s main business, OR Prong (b) the contractor DOES NOT EXERCISE THE RIGHT OF CONTROL over the performance of the work of the employee! Even ₱8M paid-up capital and DOLE registration (which is not conclusive, only disputable) cannot save an arrangement where the principal exercises control. Bowser becomes the direct employer ab initio.',
    barTakeaway:
      'D.O. 174 has TWO fatal prongs:Even with ₱5M+ capital, if the PRINCIPAL exercises Control, it is Prohibited Labor-Only Contracting!',
  },
  {
    id: 'dc-06-kasambahay-sil-vs-regular-sil',
    worldId: 'world4',
    worldLabel: 'World 4 & World 6 Interplay',
    difficultyLabel: 'Bar Exam High-Difficulty',
    title: 'Kasambahay 5-Day SIL vs. Labor Code Art. 95 5-Day SIL',
    factPattern:
      'Nana Daisy worked for 3 continuous years as a live-in family cook (Kasambahay) in Quezon City, while her brother Mario worked for 3 years as a cook in a commercial restaurant in Quezon City. Neither used any of their 5 annual Service Incentive Leave (SIL) days during their 3 years of service. Both resign today and demand cash conversion of 15 accumulated SIL days.',
    questionPrompt:
      'Who is legally entitled to cash conversion of accumulated unused SIL?',
    options: [
      'Both Daisy and Mario get 15 days of SIL cash conversion.',
      'Mario gets all 15 days of unused SIL converted to cash (Art. 95), whereas Daisy gets ZERO cash conversion because under Sec. 29 of R.A. 10361 (Batas Kasambahay), unused Kasambahay SIL is strictly NON-CUMULATIVE and NON-CONVERTIBLE to cash!',
      'Daisy gets 5 days for the current year and Mario gets 15 days.',
      'Neither gets cash conversion unless stipulated in a CBA.',
    ],
    correctIndex: 1,
    statutoryBasis: 'Sec. 29, R.A. No. 10361 (Batas Kasambahay) vs. Art. 95, Labor Code',
    doctrinalExplanation:
      'While both regular rank-and-file employees (Art. 95, after 1 year of service) and Kasambahays (Sec. 29, R.A. 10361, after 1 year of service) are entitled to 5 days of annual Service Incentive Leave with pay, their legal treatment of UNUSED leave is diametrically opposite: Regular Art. 95 SIL is COMMUTABLE to cash if unused, whereas R.A. 10361 Sec. 29 explicitly provides that unused Kasambahay SIL "shall not be cumulative or carried over to the succeeding years" and "Unused leaves shall not be convertible to cash."',
    barTakeaway:
      'Regular Art. 95 SIL = Cumulative & Cash-Convertible | Kasambahay R.A. 10361 SIL = Non-Cumulative & Non-Convertible to Cash!',
  },
  {
    id: 'dc-07-solo-parent-ra11861-amendment',
    worldId: 'world6',
    worldLabel: 'World 6: Statutory Leaves',
    difficultyLabel: 'Bar Exam High-Difficulty',
    title: 'Expanded Solo Parents Welfare Act (R.A. 11861) Tenure & Cash Rules',
    factPattern:
      'Rosalina, a single mother holding a valid LGU-issued Solo Parent Identification Card (SPIC), has rendered seven (7) months of service (broken into 4 months probationary + 3 months regular) at Star Observatory BPO. She applies for 7 working days of paid Parental Leave to attend her child’s pediatric therapy. HR denies the leave, arguing R.A. 8972 requires at least one (1) full year of service.',
    questionPrompt:
      'Evaluate HR’s denial of Rosalina’s 7-day Parental Leave.',
    options: [
      'Valid denial: Parental leave requires 12 months of continuous service.',
      'Invalid denial! R.A. 11861 (Expanded Solo Parents Welfare Act) lowered the minimum service requirement from 1 year down to SIX (6) MONTHS (continuous or broken), making Rosalina fully entitled to the 7-day forfeitable paid Parental Leave!',
      'Invalid denial, and if Rosalina does not use the 7 days, HR must pay them in cash in December.',
      'Valid denial because probationary months never count toward statutory leave tenure.',
    ],
    correctIndex: 1,
    statutoryBasis: 'Sec. 8, R.A. No. 8972 as amended by R.A. No. 11861',
    doctrinalExplanation:
      'R.A. No. 11861 amended R.A. 8972 by reducing the service qualification for the 7-day paid Parental Leave from one (1) year down to at least SIX (6) MONTHS of service (regardless of employment status, continuous or broken) and presenting a valid Solo Parent ID. Note, however, that the 7-day leave remains forfeitable—non-cumulative and non-convertible to cash unless otherwise agreed upon.',
    barTakeaway:
      'R.A. 11861 Solo Parent Leave = 7 working days/year after just 6 MONTHS of service + valid SPIC (non-convertible to cash)!',
  },
  {
    id: 'dc-08-safe-spaces-vs-ra7877',
    worldId: 'world5',
    worldLabel: 'World 5: Protective Laws',
    difficultyLabel: 'Supreme Court Doctrine Trap',
    title: 'Subordinate-to-Superior Online Harassment & Employer Solidarity',
    factPattern:
      'During a remote work week, Junior Analyst Wario repeatedly sends unsolicited sexually explicit messages and lewd memes in the company Slack group directed at his Female Department Director, Pauline. Pauline formally reports the screenshots to the CEO, who laughs it off and takes no action for 4 months, saying "You’re his boss—harassment only happens top-down!"',
    questionPrompt:
      'Assess the criminal/administrative liability of Wario AND the civil liability of the company/CEO.',
    options: [
      'Neither is liable because R.A. 7877 requires moral ascendancy or authority over the victim.',
      'Wario is liable for Gender-Based Workplace Sexual Harassment under Sec. 16 of R.A. 11313 (which covers peer-to-peer AND subordinate-to-superior acts, including online), AND the employer/CEO is SOLIDARILY LIABLE for damages for taking no immediate action after being informed!',
      'Only Wario is liable for unjust vexation; the employer is immune from peer/subordinate online chats.',
      'Liability attaches only if Wario demanded a promotion in exchange.',
    ],
    correctIndex: 1,
    statutoryBasis: 'Secs. 16 & 19, R.A. No. 11313 (Safe Spaces Act) vs. R.A. No. 7877',
    doctrinalExplanation:
      'While R.A. 7877 (1995) required authority, influence, or moral ascendancy, Section 16 of R.A. 11313 (Safe Spaces Act) expressly expanded Gender-Based Sexual Harassment in the Workplace to acts committed "between peers and those committed to a superior officer by a subordinate," whether physical or online! Moreover, under Sec. 19 of R.A. 11313, if the employer/head of office is informed by the offended party and takes no immediate action (or fails to constitute an independent CODI), the employer is SOLIDARILY LIABLE for damages.',
    barTakeaway:
      'R.A. 11313 covers peer & subordinate-to-superior harassment (physical + online), with employer solidary liability upon inaction!',
  },
  {
    id: 'dc-09-service-charge-ra11360',
    worldId: 'world2',
    worldLabel: 'World 2: Service Charges & 13th Month',
    difficultyLabel: 'Bar Exam High-Difficulty',
    title: 'R.A. 11360 100% Service Charge Distribution & Abolition Rule',
    factPattern:
      'Grand Star Resort collects ₱500,000 in monthly 10% service charges. Management retains 15% (₱75,000) to cover crystal glasswarepilferage/breakage, includes the Hotel General Manager in the remaining 85% pool, and announces that next quarter it will abolish the service charge entirely without adjusting basic wages.',
    questionPrompt:
      'Identify ALL statutory violations committed by Grand Star Resort under Article 96 (as amended by R.A. 11360).',
    options: [
      'No violation; management retains 15% for losses/breakage under the Labor Code.',
      'Three violations: (1) 100% of service charges must go equally to covered employees (the old 85%-15% split was repealed by R.A. 11360); (2) Managerial employees are strictly EXCLUDED; and (3) if service charges are abolished, the employees’ 12-month average share MUST be integrated into their basic wages!',
      'Only the General Manager’s inclusion is unlawful; abolishing service charges forfeits the benefit.',
      'Service charges are voluntary tips exempt from DOLE regulation.',
    ],
    correctIndex: 1,
    statutoryBasis: 'Art. 96, Labor Code as amended by R.A. No. 11360 & DOLE D.O. No. 206-19',
    doctrinalExplanation:
      'R.A. 11360 repealed the old 85%–15% management retention rule and mandated that 100% of all service charges collected by hotels, restaurants, and similar establishments be distributed COMPLETELY and EQUALLY among covered employees (all direct and agency workers EXCEPT managerial employees). Furthermore, under Art. 96 / IRR, if the service charge is abolished, the share of covered employees shall be considered integrated into their basic wages based on the average monthly share for the preceding 12 months.',
    barTakeaway:
      'R.A. 11360 = 100% equal distribution (0% management cut), Managerial excluded, 12-month average integrated if abolished!',
  },
  {
    id: 'dc-10-gynecological-leave-ra9710',
    worldId: 'world6',
    worldLabel: 'World 6: Statutory Leaves',
    difficultyLabel: 'Bar Exam High-Difficulty',
    title: 'Magna Carta of Women 2-Month Special Leave vs. Maternity Leave',
    factPattern:
      'Daisy, a regular accountant who has worked 8 continuous months over the past year at Mushroom Audit LLP, undergoes an emergency hysterectomy (surgical removal of the uterus due to severe myoma, unrelated to pregnancy). Her attending OB-GYN certifies a 60-day recovery period. HR tells her she only gets 5 days of SIL and must file unpaid leave for the rest because she was not pregnant.',
    questionPrompt:
      'What statutory leave benefit is Daisy entitled to demand directly from her employer?',
    options: [
      '60 days Expanded Maternity Leave under R.A. 11210.',
      'Special Leave Benefit for Women under Sec. 18 of R.A. 9710 (Magna Carta of Women): up to two (2) months with FULL PAY based on gross monthly compensation following surgery caused by gynecological disorders!',
      'Only SSS Sickness Daily Allowance at 90% of average daily salary credit.',
      '10 days paid medical leave under R.A. 9262.',
    ],
    correctIndex: 1,
    statutoryBasis: 'Sec. 18, R.A. No. 9710 (Magna Carta of Women) & DOLE D.O. No. 112-11',
    doctrinalExplanation:
      'Under Section 18 of R.A. 9710 and DOLE D.O. 112-11, any female employee who has rendered continuous aggregate employment service of at least six (6) months for the last twelve (12) months is entitled to a Special Leave Benefit of up to two (2) months WITH FULL PAY (basic salary + mandatory allowances) following surgery caused by gynecological disorders (e.g. myoma, endometriosis, ovarian cyst, hysterectomy). Note: If she instead suffered a miscarriage/EOP, she would claim 60-day Maternity Leave under R.A. 11210 (not both simultaneously for the same surgical event).',
    barTakeaway:
      'R.A. 9710 Sec. 18 = Up to 2 months FULL PAY after gynecological surgery (requires 6 mos aggregate service in last 12 mos)!',
  },
  {
    id: 'dc-11-preceding-absence-successive-holidays',
    worldId: 'holidays',
    worldLabel: 'Holidays & Preceding Day Rule',
    difficultyLabel: 'Supreme Court Doctrine Trap',
    title: 'Successive Regular Holidays (Maundy Thursday & Good Friday) Preceding Absence Trap',
    factPattern:
      'Bowser Logistics operates Monday to Saturday. Waluigi went AWOL (absent without pay) on Holy Wednesday. He did NOT work on Maundy Thursday (Regular Holiday #1), NOR did he work on Good Friday (Regular Holiday #2), OR wait—in Scenario B, suppose instead he rested on Maundy Thursday and ACTUALLY WORKED 8 hours on Good Friday!',
    questionPrompt:
      'Under Omnibus Rules Book III, Rule IV, Sec. 10, compare Waluigi’s holiday pay if he rested both days vs. if he actually worked on Good Friday:',
    options: [
      'He gets 100% for both holidays regardless of Holy Wednesday AWOL.',
      'If he rested both days after Wednesday AWOL, he forfeits unworked holiday pay for BOTH Maundy Thursday and Good Friday; HOWEVER, if he actually worked on Maundy Thursday (earning 200%), he automatically regains 100% unworked holiday pay for Good Friday—and if he works on Good Friday despite Wednesday/Thursday absence, he earns full 200% for Good Friday!',
      'He forfeits Maundy Thursday only and automatically gets 100% for Good Friday even if unworked.',
      'Working on Good Friday only pays 100% straight wage because of Wednesday AWOL.',
    ],
    correctIndex: 1,
    statutoryBasis: 'Book III, Rule IV, Sec. 10, Omnibus Rules Implementing the Labor Code',
    doctrinalExplanation:
      'Where there are two (2) successive regular holidays (like Maundy Thursday and Good Friday), an employee who is absent without pay on the day immediately preceding the FIRST holiday may not be paid for BOTH holidays UNLESS he works on the first holiday, in which case he is entitled to holiday pay on the second holiday! Furthermore, whenever an employee ACTUALLY WORKS on any Regular Holiday, he ALWAYS earns 200% for that worked holiday regardless of prior unpaid absence.',
    barTakeaway:
      'AWOL before 2 successive Regular Holidays = forfeits BOTH unworked; working Holiday #1 restores unworked 100% on Holiday #2!',
  },
  {
    id: 'dc-12-facilities-vs-supplements-mabeza',
    worldId: 'world3',
    worldLabel: 'World 3: Wages & Deductions',
    difficultyLabel: 'Supreme Court Doctrine Trap',
    title: 'Facilities vs. Supplements: The 3-Requisite Deductibility Test (Mabeza v. NLRC)',
    factPattern:
      'At Ghost House Inn, front-desk clerks are required to stay on premises overnight during typhoon alerts and eat meals from the hotel kitchen so they never leave the lobby unattended. Management deducts ₱120/meal and ₱150/lodging per shift from their minimum wage without any written authorization, arguing food and lodging are intrinsically "Facilities."',
    questionPrompt:
      'Are the meal and lodging deductions from the clerks’ wages legally valid?',
    options: [
      'Valid, because meals and lodging are always classified as deductible Facilities as a matter of law.',
      'Invalid! First, the purpose test shows the overnight stay/meals were primarily for the hotel’s business convenience (making them non-deductible SUPPLEMENTS); second, even true Facilities CANNOT be deducted without ALL 3 Mabeza requisites: (1) proof of custom, (2) voluntary WRITTEN acceptance by the employee, and (3) fair and reasonable value!',
      'Valid up to 50% of minimum wage.',
      'Invalid only as to lodging, but valid as to meals.',
    ],
    correctIndex: 1,
    statutoryBasis: 'Art. 97(f), Labor Code; Mabeza v. NLRC (G.R. No. 118506); Our Haus Realty v. Parian',
    doctrinalExplanation:
      'In Mabeza v. NLRC and Our Haus Realty Development Corp. v. Parian, the Supreme Court established two strict barriers: (1) Under the PURPOSE TEST, the decisive factor is not the kind of item (food/lodging) but its PURPOSE—since staying on-site served the hotel’s operational convenience, they are non-deductible SUPPLEMENTS; and (2) even if an item qualifies as a Facility, deduction from wages is illegal unless the employer proves ALL THREE requisites: customary in the trade, voluntary WRITTEN authorization by the employee, and fair/reasonable value.',
    barTakeaway:
      'Purpose Test controls Facility vs. Supplement; even Facilities require Custom + Written Employee Consent + Fair Value!',
  },
  {
    id: 'dc-13-compressed-work-week-undertime',
    worldId: 'world1',
    worldLabel: 'World 1: Hours of Work',
    difficultyLabel: 'Bar Exam High-Difficulty',
    title: 'Brownouts, Undertime Offsetting (Art. 88) & Unilateral Compressed Work Week',
    factPattern:
      'On Monday, a 15-minute power brownout hit Toadstool Factory, and Captain Toad also left 30 minutes early (undertime) for a dental appointment. On Tuesday, management ordered him to work 9 hours (1 hour past his 8-hour shift), deducted the 15-minute Monday brownout, and offset his 30-minute Monday undertime against 30 minutes of Tuesday’s extra hour at straight pay.',
    questionPrompt:
      'Identify the correct statutory computation for Monday and Tuesday.',
    options: [
      'Management is right on both counts because weekly hours stayed under 48.',
      'Both deductions/offsets are ILLEGAL: (1) Brownouts ≤ 20 minutes are COMPENSABLE hours worked; and (2) Art. 88 strictly prohibits offsetting undertime on Monday with overtime on Tuesday—Captain Toad suffers 30m undertime deduction on Monday, gets paid for the 15m brownout, AND earns full +25% Overtime Pay for the entire 1 hour on Tuesday!',
      'Brownout is unpaid, but overtime must be paid at +25%.',
      'Offsetting is valid if done within the same payroll week.',
    ],
    correctIndex: 1,
    statutoryBasis: 'Art. 84 & Art. 88, Labor Code; Omnibus Rules Book III, Rule I, Sec. 4(d)',
    doctrinalExplanation:
      'First, power interruptions or brownouts of twenty (20) minutes or less are treated as compensable hours worked. Second, Article 88 of the Labor Code categorically mandates that undertime work on any particular day SHALL NOT BE OFFSET by overtime work on any other day (because allowing offset would deprive the worker of the +25%/+30% overtime premium!).',
    barTakeaway:
      'Brownouts ≤ 20 mins = Compensable! Art. 88 = Undertime can NEVER be offset by Overtime (even on the same day or week)!',
  },
  {
    id: 'dc-14-vawc-leave-protection-order',
    worldId: 'world6',
    worldLabel: 'World 6: Statutory Leaves',
    difficultyLabel: 'Bar Exam High-Difficulty',
    title: 'R.A. 9262 VAWC Leave Extension & Proof Requirements',
    factPattern:
      'Pauline, a probationary bank teller in her 3rd month of work, suffers psychological and economic abuse from her former live-in partner. She presents a Certification from the Punong Barangay confirming a pending Barangay Protection Order (BPO) application and requests 10 days of paid VAWC Leave, followed by a 5-day extension expressly specified in the issued TPO for court hearings. The bank denies both, claiming: (a) she is still probationary (<1 year), (b) no criminal conviction exists yet, and (c) VAWC leave is strictly capped at 10 days.',
    questionPrompt:
      'Rule on all three grounds raised by the bank.',
    options: [
      'The bank is correct that VAWC leave requires 1 year of service.',
      'All three grounds are BASELESS! Under Sec. 43 of R.A. 9262: (a) VAWC Leave has NO 1-year or regularization requirement; (b) a Punong Barangay/Kagawad/Prosecutor/Clerk of Court certification of a pending action suffices (no conviction needed); and (c) the 10-day paid leave is EXTENDIBLE when necessity arises as specified in the Protection Order!',
      'Pauline gets 10 days paid, but extensions under a TPO are always unpaid.',
      'VAWC leave applies only if Pauline was legally married to the offender.',
    ],
    correctIndex: 1,
    statutoryBasis: 'Sec. 43, R.A. No. 9262 (Anti-VAWC Act of 2004)',
    doctrinalExplanation:
      'Section 43 of R.A. 9262 entitles woman-victims of VAWC (whether married, dating, or sharing a common child with the perpetrator) to up to ten (10) days paid leave in addition to other leaves, EXTENDIBLE when the necessity arises as specified in the protection order (BPO/TPO/PPO). There is NO minimum length of service requirement, and the sole documentary requirement is a certification from the Punong Barangay/Kagawad, Prosecutor, or Clerk of Court that an action is pending. Penalizing or denying her exposes the employer to liability for discrimination and contempt.',
    barTakeaway:
      'VAWC Leave (R.A. 9262 Sec. 43) = 10 days paid + EXTENDIBLE per Protection Order; ZERO tenure requirement; Barangay/Court cert suffices!',
  },
] as const;

/**
 * Deterministically picks today's Daily Challenge scenario using local calendar date YYYY-MM-DD.
 * Guarantees every student sees the same challenge on a given date and a fresh scenario every 24h!
 */
export function getDailyChallengeForDate(now: Date = new Date()): DailyChallengeScenario {
  const dayKey = formatLocalDayKey(now);
  const [y, m, d] = dayKey.split('-').map((n) => parseInt(n, 10));
  const epochDays = Math.floor(Date.UTC(y, (m || 1) - 1, d || 1) / 86_400_000);
  const idx = ((epochDays % DAILY_CHALLENGE_BANK.length) + DAILY_CHALLENGE_BANK.length) % DAILY_CHALLENGE_BANK.length;
  return DAILY_CHALLENGE_BANK[idx];
}

/**
 * Computes exact countdown until local midnight (next 24-hour Daily Challenge refresh).
 */
export function getNextDailyChallengeCountdown(now: Date = new Date()): DailyChallengeCountdown {
  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0,
    0
  );
  const diffMs = Math.max(0, nextMidnight.getTime() - now.getTime());
  const totalSecondsRemaining = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSecondsRemaining / 3600);
  const minutes = Math.floor((totalSecondsRemaining % 3600) / 60);
  const seconds = totalSecondsRemaining % 60;

  const formatted = [hours, minutes, seconds]
    .map((v) => String(v).padStart(2, '0'))
    .join(':');

  return {
    hours,
    minutes,
    seconds,
    totalSecondsRemaining,
    formatted,
  };
}

/**
 * Loads persistent Daily Challenge progress, automatically resetting completion status
 * whenever the local calendar date YYYY-MM-DD advances to a new 24h cycle while preserving
 * lifetime `totalSolvedCount`.
 */
export function loadDailyChallengeState(
  storage?: StorageLike | null,
  now: Date = new Date()
): DailyChallengeRecord {
  const todayKey = formatLocalDayKey(now);
  const todayScenario = getDailyChallengeForDate(now);

  const freshDefault: DailyChallengeRecord = {
    dateKey: todayKey,
    challengeId: todayScenario.id,
    completed: false,
    selectedOptionIndex: null,
    isCorrect: false,
    coinsAwarded: 0,
    completedAtIso: null,
    totalSolvedCount: 0,
  };

  if (!storage) return freshDefault;

  try {
    const raw = storage.getItem(DAILY_CHALLENGE_STORAGE_KEY);
    if (!raw) return freshDefault;
    const parsed = JSON.parse(raw) as Partial<DailyChallengeRecord>;
    const lifetimeSolved =
      typeof parsed.totalSolvedCount === 'number' && parsed.totalSolvedCount >= 0
        ? parsed.totalSolvedCount
        : 0;

    if (parsed.dateKey === todayKey && parsed.completed) {
      return {
        dateKey: todayKey,
        challengeId: parsed.challengeId || todayScenario.id,
        completed: true,
        selectedOptionIndex:
          typeof parsed.selectedOptionIndex === 'number' ? parsed.selectedOptionIndex : null,
        isCorrect: Boolean(parsed.isCorrect),
        coinsAwarded: typeof parsed.coinsAwarded === 'number' ? parsed.coinsAwarded : 0,
        completedAtIso: parsed.completedAtIso || null,
        totalSolvedCount: lifetimeSolved,
      };
    }

    // New 24-hour calendar day -> unlock fresh Daily Challenge while keeping lifetime solved counter!
    return {
      ...freshDefault,
      totalSolvedCount: lifetimeSolved,
    };
  } catch {
    return freshDefault;
  }
}

/**
 * Submits an answer for today's Daily Challenge (idempotent within the same 24h dateKey).
 * Returns the updated persistent record and base coins to grant (caller passes through Super Star 2x multiplier if active).
 */
export function submitDailyChallengeAnswer(
  storage: StorageLike | null | undefined,
  selectedOptionIndex: number,
  now: Date = new Date()
): {
  record: DailyChallengeRecord;
  scenario: DailyChallengeScenario;
  baseCoinsEarned: number;
  alreadyCompletedToday: boolean;
} {
  const current = loadDailyChallengeState(storage, now);
  const scenario = getDailyChallengeForDate(now);

  if (current.completed) {
    return {
      record: current,
      scenario,
      baseCoinsEarned: 0,
      alreadyCompletedToday: true,
    };
  }

  const isCorrect = selectedOptionIndex === scenario.correctIndex;
  const baseCoinsEarned = isCorrect
    ? DAILY_CHALLENGE_BASE_COINS
    : DAILY_CHALLENGE_REVIEW_COINS;

  const updated: DailyChallengeRecord = {
    dateKey: formatLocalDayKey(now),
    challengeId: scenario.id,
    completed: true,
    selectedOptionIndex,
    isCorrect,
    coinsAwarded: baseCoinsEarned,
    completedAtIso: now.toISOString(),
    totalSolvedCount: current.totalSolvedCount + (isCorrect ? 1 : 0),
  };

  if (storage) {
    try {
      storage.setItem(DAILY_CHALLENGE_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore storage quota errors
    }
  }

  return {
    record: updated,
    scenario,
    baseCoinsEarned,
    alreadyCompletedToday: false,
  };
}
