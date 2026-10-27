export interface QuizQuestion {
  id: number;
  world: string;
  worldCode: 'w1' | 'w2' | 'w3' | 'w4' | 'w5' | 'w6' | 'holidays';
  scenario: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  legalBasis: string;
}

export const PRACTICE_QUESTIONS: QuizQuestion[] = [
  // ================= WORLD 1: HOURS OF WORK (14 Questions) =================
  {
    id: 1,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'Due to an unexpected power outage, a garment factory experiences a brownout lasting 18 minutes. Management instructs workers to stay at their stations. Is the 18-minute outage compensable?',
    options: [
      'No, because the sewing machines were idle.',
      'Yes, brownouts of short duration not exceeding 20 minutes are treated as hours worked whether used productively or not.',
      'No, brownouts are fortuitous events.',
      'Yes, only if workers swept the floor during the outage.',
    ],
    correctIndex: 1,
    explanation:
      'Brownouts not exceeding twenty (20) minutes are compensable hours worked regardless of whether employees perform productive tasks.',
    legalBasis: 'DOLE Policy Instruction & Omnibus Rules Book III',
  },
  {
    id: 2,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'A power brownout lasts 90 minutes. The supervisor forbids employees from leaving the factory floor because electricity "might return any minute." Are the 90 minutes compensable?',
    options: [
      'No, because it exceeded 20 minutes.',
      'Yes, brownouts exceeding 20 minutes are non-compensable ONLY if employees can leave the premises and use the time effectively for their own interest.',
      'Only the first 20 minutes are paid.',
      'Half of the 90 minutes is compensable.',
    ],
    correctIndex: 1,
    explanation:
      'For brownouts exceeding 20 minutes to be excluded from hours worked, employees must be allowed to leave the workplace and use the time freely for their own interest.',
    legalBasis: 'DOLE Brownout Rules & Art. 84, Labor Code',
  },
  {
    id: 3,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'A private hospital in Quezon City (population > 1M, 250 beds) requires its nurses to work 6 days (48 hours) in a week. What compensation is due for the 6th day?',
    options: [
      'Ordinary 100% daily pay because 48 hours is the standard workweek.',
      'Regular 5-day (40-hour) workweek applies; work on the 6th day entitles health personnel to an additional 30% of regular wage.',
      '200% double pay.',
      'No extra pay if granted free hospital meals.',
    ],
    correctIndex: 1,
    explanation:
      'Under Article 83, health personnel in cities >= 1M population or hospitals >= 100 beds have a normal 8-hour, 5-day (40-hour) workweek. Working the 6th day requires at least +30% additional pay.',
    legalBasis: 'Article 83, Labor Code of the Philippines',
  },
  {
    id: 4,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'A hospital requires resident physicians to render continuous 24-hour duty shifts, invoking "customary medical practice." Is this valid?',
    options: [
      'Valid because resident doctors are trainees.',
      'Invalid; customary practice of requiring resident physicians to work 24 hours a day violates statutory normal hours of work.',
      'Valid if approved by the Hospital Board.',
      'Valid during their first year of residency.',
    ],
    correctIndex: 1,
    explanation:
      'Statutory limitations on normal hours of work prevail over contrary customary hospital practices.',
    legalBasis: 'Article 83, Labor Code & University of Pangasinan Jurisprudence',
  },
  {
    id: 5,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'Delivery drivers report to the depot at 7:00 AM, follow fixed GPS-monitored routes, check in with dispatch hourly, and return by 5:00 PM. Management denies them overtime claiming they are "Field Personnel." Decide.',
    options: [
      'Valid, because they work outside the office.',
      'Invalid; because their time and performance are constantly supervised and determinable with reasonable certainty, they are NOT field personnel.',
      'Valid if they are paid per trip.',
      'Invalid only if they drive refrigerated trucks.',
    ],
    correctIndex: 1,
    explanation:
      'Under Auto Bus Transport v. Bautista, employees whose time and performance are constantly supervised in the field are regular rank-and-file covered by Title I benefits, not field personnel.',
    legalBasis: 'Article 82, Labor Code & Auto Bus Transport v. Bautista',
  },
  {
    id: 6,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'An employee travels from 7:00 PM to 11:00 PM on Sunday night to Cebu for a mandatory Monday 8:00 AM seminar. Her normal work shift is 8:00 AM to 5:00 PM. Is her Sunday night travel compensable?',
    options: [
      'Yes, all overnight travel away from home is compensable.',
      'No, travel away from home is compensable only when it cuts across the employee’s regular working hours (even on non-working days like 8 AM–5 PM Sunday).',
      'Yes, at 130% rest day rate.',
      'Yes, if she traveled by ferry.',
    ],
    correctIndex: 1,
    explanation:
      'Travel away from home counts as hours worked when it cuts across the employee’s normal working hours (e.g., 8 AM–5 PM), including corresponding hours on non-working days, but not outside those hours unless working while traveling.',
    legalBasis: 'Sec. 4(c), Rule I, Book III, Omnibus Rules',
  },
  {
    id: 7,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'HR gives employees two 15-minute coffee breaks daily and deducts 30 minutes per day from their paid hours. Is the deduction valid?',
    options: [
      'Valid because coffee breaks are non-productive.',
      'Unlawful; rest periods of short duration (5 to 20 minutes) are mandatorily counted as compensable hours worked.',
      'Valid if written in the employment contract.',
      'Unlawful only for minimum wage earners.',
    ],
    correctIndex: 1,
    explanation:
      'Short rest periods or coffee breaks lasting from 5 to 20 minutes are counted as compensable working time.',
    legalBasis: 'Article 84 & Sec. 7, Rule I, Book III, Omnibus Rules',
  },
  {
    id: 8,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'In a continuous-operation glass plant, workers’ regular 60-minute lunch break is shortened to 25 minutes so furnaces are never left untended. How must the 25-minute meal break be treated?',
    options: [
      'Unpaid because meal breaks are never compensable.',
      'Fully compensable as working time because meal breaks shortened to less than 60 minutes (minimum 20 minutes) must be paid.',
      'Half-paid at 50%.',
      'Illegal; meal breaks can never be less than 60 minutes under any circumstance.',
    ],
    correctIndex: 1,
    explanation:
      'Under Omnibus Rules Book III, Rule I, Sec. 7, a meal period may be shortened to not less than 20 minutes in continuous non-manual work or urgent cases, provided the shortened meal period is credited as compensable hours worked.',
    legalBasis: 'Article 85 & Sec. 7, Rule I, Book III, Omnibus Rules',
  },
  {
    id: 9,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'Toad arrived 1 hour late on Tuesday (undertime) and worked 1 hour extra on Wednesday (overtime). Payroll offsets the two and pays him straight basic salary. Is this legal?',
    options: [
      'Legal because total weekly hours equal 40.',
      'Illegal; Article 88 strictly prohibits offsetting undertime on one day by overtime work on another day.',
      'Legal if Toad requested the offset.',
      'Legal for monthly-paid employees.',
    ],
    correctIndex: 1,
    explanation:
      'Permitting undertime to be offset by overtime would deprive the employee of the statutory overtime premium (+25% / +30%) earned on the overtime hours.',
    legalBasis: 'Article 88, Labor Code of the Philippines',
  },
  {
    id: 10,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'Yoshi works a graveyard shift from 10:00 PM to 6:00 AM on an ordinary Tuesday. His regular hourly rate is ₱100. How much total pay does he earn for the 8-hour shift?',
    options: [
      '₱800',
      '₱880 (₱800 basic + ₱80 Night Shift Differential at 10%)',
      '₱1,000',
      '₱960',
    ],
    correctIndex: 1,
    explanation:
      'Every covered employee receives not less than 10% Night Shift Differential for each hour worked between 10:00 PM and 6:00 AM (8 hrs × ₱100 × 1.10 = ₱880).',
    legalBasis: 'Article 86, Labor Code of the Philippines',
  },
  {
    id: 11,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'A retail store regularly employing only four (4) salesclerks operates from 9:00 PM to 5:00 AM. Are the salesclerks entitled to Night Shift Differential?',
    options: [
      'Yes, all private workers get NSD.',
      'No; retail and service establishments regularly employing not more than five (5) workers are statutorily exempt from Night Shift Differential.',
      'Yes, at half rate (5%).',
      'Only on weekends.',
    ],
    correctIndex: 1,
    explanation:
      'Under Omnibus Rules Book III, Rule II, Sec. 1(e), retail and service establishments regularly employing not more than five (5) workers are exempt from NSD.',
    legalBasis: 'Rule II, Sec. 1(e), Book III, Omnibus Rules',
  },
  {
    id: 12,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'Seamen aboard a cargo vessel have off-duty cabins on the ship but remain subject to emergency call if rough seas hit. Is their routine uninterrupted sleeping time in their cabins compensable overtime?',
    options: [
      'Yes, 24 hours a day because they cannot leave the ship.',
      'No; seamen are not paid overtime simply because they cannot leave the ship; they are entitled to OT only when actually required to perform work beyond 8 hours.',
      'Yes, at 50% standby pay.',
      'Only when sailing in international waters.',
    ],
    correctIndex: 1,
    explanation:
      'Under settled Supreme Court jurisprudence (National Shipyards /PCL Shipping), the criterion for seamen is whether they actually rendered work in excess of 8 hours, not mere presence aboard the vessel.',
    legalBasis: 'National Shipyards & Steel Corp. v. CIR',
  },
  {
    id: 13,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'Employees attend a voluntary after-hours photography hobby club sponsored by HR with zero relation to their accounting jobs and no attendance penalty. Is club time compensable?',
    options: [
      'Yes, because HR sponsored the snacks.',
      'No; attendance at lectures/meetings is non-compensable when outside regular hours, genuinely voluntary, and the employee performs no productive work.',
      'Yes, up to 2 hours.',
      'Yes, if held inside the conference room.',
    ],
    correctIndex: 1,
    explanation:
      'Under Sec. 6, Rule I, Book III, lectures, meetings, and training programs are not counted as working time if outside regular hours, voluntary, and no productive work is performed.',
    legalBasis: 'Sec. 6, Rule I, Book III, Omnibus Rules',
  },
  {
    id: 14,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'Under DOLE Advisory No. 02-04, what are the strict hour caps for a valid Compressed Work Week (CWW) where daily hours beyond 8 do not trigger overtime pay?',
    options: [
      'Up to 14 hours/day and 56 hours/week.',
      'Not exceeding 12 hours/day and 48 hours/week, with voluntary employee consent and DOLE notice.',
      'Up to 10 hours/day and 40 hours/week only.',
      'Any schedule unilaterally ordered by management.',
    ],
    correctIndex: 1,
    explanation:
      'A valid CWW requires voluntary majority employee agreement, prior DOLE notice, no diminution of weekly pay, and caps of 12 hours/day and 48 hours/week.',
    legalBasis: 'DOLE Department Advisory No. 02, Series of 2004',
  },

  // ================= WORLD 2: REST, SIL, SERVICE CHARGE & 13TH MONTH (11 Questions) =================
  {
    id: 15,
    world: 'World 2: Rest & 13th Month',
    worldCode: 'w2',
    scenario:
      'An employee requests Saturday as her weekly rest day based on Seventh-day Adventist religious grounds. Can the employer force her to take Tuesday instead when Saturday causes no serious business prejudice?',
    options: [
      'Yes, scheduling rest days is absolute management prerogative.',
      'No; under Article 91, the employer MUST respect the employee’s weekly rest day preference when based on religious grounds.',
      'Yes, unless 100% of employees share the same religion.',
      'Only if she takes a 10% wage cut.',
    ],
    correctIndex: 1,
    explanation:
      'While the employer schedules weekly rest days, Article 91 obligates the employer to respect an employee’s preference when grounded on religious beliefs (or grant at least 2 days per month of choice if serious obstruction occurs).',
    legalBasis: 'Article 91, Labor Code & Omnibus Rules',
  },
  {
    id: 16,
    world: 'World 2: Rest & 13th Month',
    worldCode: 'w2',
    scenario:
      'Under Republic Act No. 11360, a hotel collects ₱500,000 in service charges. Management retains 15% for breakages and gives 5% to hotel directors. Is this valid?',
    options: [
      'Valid under the old 85%-15% rule.',
      'Illegal; R.A. 11360 mandates 100% equal distribution of all collected service charges to covered non-managerial employees.',
      'Valid if breakages exceeded ₱50,000.',
      'Valid if approved by majority vote.',
    ],
    correctIndex: 1,
    explanation:
      'R.A. 11360 amended Article 96 so 100% of service charges go completely and equally to covered rank-and-file/supervisory non-managerial workers, with 0% to management.',
    legalBasis: 'Republic Act No. 11360 (Amended Art. 96, Labor Code)',
  },
  {
    id: 17,
    world: 'World 2: Rest & 13th Month',
    worldCode: 'w2',
    scenario:
      'How frequently must collected service charges be distributed to covered hotel and restaurant workers under R.A. 11360 IRR?',
    options: [
      'Once a year in December.',
      'Completely and equally at least once every two (2) weeks or twice a month at intervals not exceeding 16 days.',
      'Quarterly.',
      'Upon resignation.',
    ],
    correctIndex: 1,
    explanation:
      'DOLE D.O. 206-19 requires service charges to be distributed completely and equally based on actual hours/days worked at least twice a month (intervals <= 16 days).',
    legalBasis: 'DOLE Department Order No. 206, Series of 2019',
  },
  {
    id: 18,
    world: 'World 2: Rest & 13th Month',
    worldCode: 'w2',
    scenario:
      'Luigi worked for 10 years without using his 5-day annual Service Incentive Leave (SIL). Upon retirement, he claims 50 days of commuted SIL. Management argues years 1–7 prescribed under the 3-year money-claim bar. Who wins?',
    options: [
      'Management; SIL prescribes every December 31.',
      'Luigi; under Auto Bus Transport v. Bautista, the 3-year prescriptive period for unused SIL starts ONLY upon separation or demand refusal.',
      'SIL is forfeited if unused each year.',
      'Luigi gets only 15 days.',
    ],
    correctIndex: 1,
    explanation:
      'Because the employee has the option to commute SIL upon separation, the cause of action accrues—and the 3-year prescriptive clock starts—only upon termination of employment.',
    legalBasis: 'Auto Bus Transport Systems v. Bautista (G.R. No. 156367)',
  },
  {
    id: 19,
    world: 'World 2: Rest & 13th Month',
    worldCode: 'w2',
    scenario:
      'Which employee is NOT entitled to statutory 5-day Service Incentive Leave under Article 95?',
    options: [
      'A probationary clerk after completing 12 months of total service.',
      'An employee already enjoying at least 5 days of vacation leave with pay under company policy.',
      'A piece-rate factory worker supervised daily.',
      'A part-time cashier who completed 1 year of service.',
    ],
    correctIndex: 1,
    explanation:
      'Employees already enjoying vacation leave with pay of at least five (5) days are expressly exempt from statutory SIL duplication.',
    legalBasis: 'Article 95, Labor Code & Omnibus Rules',
  },
  {
    id: 20,
    world: 'World 2: Rest & 13th Month',
    worldCode: 'w2',
    scenario:
      'Peach earned ₱240,000 total basic salary, ₱24,000 overtime pay, and ₱12,000 night differential during the calendar year. What is her statutory minimum 13th-month pay under P.D. 851?',
    options: [
      '₱23,000 (1/12 of gross earnings)',
      '₱20,000 (1/12 of ₱240,000 basic salary only, excluding OT and NSD)',
      '₱22,000',
      '₱18,000',
    ],
    correctIndex: 1,
    explanation:
      'Under P.D. 851 and San Miguel Corp. v. Inciong, "basic salary" for 13th-month pay excludes overtime, night differential, holiday premium, and COLA unless integrated by CBA/practice.',
    legalBasis: 'P.D. No. 851 & Revised Guidelines on 13th Month Pay',
  },
  {
    id: 21,
    world: 'World 2: Rest & 13th Month',
    worldCode: 'w2',
    scenario:
      'Wario worked from January 1 to April 30 (4 months) at ₱18,000/month basic salary, then resigned voluntarily. Is he entitled to 13th-month pay?',
    options: [
      'No, because he resigned before December 24.',
      'Yes, pro-rated 13th-month pay of ₱6,000 (₱72,000 ÷ 12) because he worked at least one (1) month during the calendar year.',
      'Only if he worked at least 6 months.',
      'No, resignation forfeits P.D. 851 benefits.',
    ],
    correctIndex: 1,
    explanation:
      'Any rank-and-file employee who has worked at least one (1) month during the calendar year is entitled to proportionate 13th-month pay regardless of resignation or dismissal.',
    legalBasis: 'Revised Guidelines on the Implementation of P.D. 851',
  },
  {
    id: 22,
    world: 'World 2: Rest & 13th Month',
    worldCode: 'w2',
    scenario:
      'An employer distributes sacks of rice and grocery vouchers in December and deducts their cost from the workers’ 13th-month pay. Is this valid?',
    options: [
      'Valid if the workers accepted the rice.',
      'Void; non-cash benefits in food, commodities, or electricity cannot substitute for cash 13th-month pay.',
      'Valid up to 50%.',
      'Valid if rice prices rose.',
    ],
    correctIndex: 1,
    explanation:
      '13th-month pay must be paid in legal tender on or before December 24; payment in kind/groceries is prohibited.',
    legalBasis: 'Presidential Decree No. 851 & Kamaya Point Hotel v. NLRC',
  },
  {
    id: 23,
    world: 'World 2: Rest & 13th Month',
    worldCode: 'w2',
    scenario:
      'Are rank-and-file public school teachers employed by the Department of Education covered by P.D. 851 (Labor Code 13th-Month Pay)?',
    options: [
      'Yes, all teachers are covered by P.D. 851.',
      'No; government employees are excluded from P.D. 851 and instead receive year-end bonuses under Civil Service / DBM statutes.',
      'Only if they teach night classes.',
      'Yes, at 50% rate.',
    ],
    correctIndex: 1,
    explanation:
      'The government and its political subdivisions (including GOCCs with original charters) are exempt from P.D. 851 because public sector compensation is governed by R.A. 6686 / SSL.',
    legalBasis: 'Sec. 3(b), Rules Implementing P.D. 851',
  },
  {
    id: 24,
    world: 'World 2: Rest & 13th Month',
    worldCode: 'w2',
    scenario:
      'Daisy worked 8 hours on her scheduled Sunday rest day (not a holiday). Her daily rate is ₱1,000. How much is her total pay for that day?',
    options: [
      '₱1,000 (100%)',
      '₱1,250 (125%)',
      '₱1,300 (130%)',
      '₱2,000 (200%)',
    ],
    correctIndex: 2,
    explanation:
      'Under Article 93(a), work performed on an employee’s scheduled rest day is compensated at regular wage plus at least 30% premium = 130% (₱1,300).',
    legalBasis: 'Article 93(a), Labor Code of the Philippines',
  },
  {
    id: 25,
    world: 'World 2: Rest & 13th Month',
    worldCode: 'w2',
    scenario:
      'What is the overtime hourly multiplier when an employee works beyond 8 hours on a scheduled Rest Day?',
    options: [
      'Hourly basic rate × 1.25',
      'Hourly basic rate × 1.30 × 1.30 (169% of basic hourly rate)',
      'Hourly basic rate × 2.00',
      'Hourly basic rate × 1.50',
    ],
    correctIndex: 1,
    explanation:
      'Overtime on a Rest Day or Special Non-Working Day carries an additional 30% on top of the 130% hourly rate: 1.30 × 1.30 = 1.69 (169%).',
    legalBasis: 'Article 87 & Art. 93, Labor Code',
  },

  // ================= DEDICATED HOLIDAYS QUESTIONS (12 Questions) =================
  {
    id: 26,
    world: 'Holidays: Statutory Rules',
    worldCode: 'holidays',
    scenario:
      'Mario worked 8 hours on December 30 (Rizal Day, a Regular Holiday) which also fell on his scheduled weekly rest day. Daily wage is ₱1,000. Compute his pay.',
    options: [
      '₱2,000 (200%)',
      '₱2,300 (230%)',
      '₱2,600 (260%)',
      '₱3,000 (300%)',
    ],
    correctIndex: 2,
    explanation:
      'Regular Holiday (200%) falling on a Rest Day (+30% of 200% = +60%) equals 260% of basic daily wage (₱2,600).',
    legalBasis: 'Article 94, Labor Code & DOLE Handbook',
  },
  {
    id: 27,
    world: 'Holidays: Statutory Rules',
    worldCode: 'holidays',
    scenario:
      'Araw ng Kagitingan (April 9) coincides with Maundy Thursday (Double Regular Holiday). Luigi did NOT work on that day, and he was present the workday before. If his daily wage is ₱900, how much does he receive?',
    options: [
      '₱0 (No work, no pay)',
      '₱900 (100%)',
      '₱1,800 (200% for unworked Double Regular Holiday)',
      '₱2,700 (300%)',
    ],
    correctIndex: 2,
    explanation:
      'When two Regular Holidays fall on the same date, an eligible employee who does NOT work receives 200% of the daily wage (100% for each regular holiday).',
    legalBasis: 'DOLE Explanatory Bulletin on Double Holidays & Asian Transmission v. CA',
  },
  {
    id: 28,
    world: 'Holidays: Statutory Rules',
    worldCode: 'holidays',
    scenario:
      'Using the same Double Regular Holiday (April 9 + Maundy Thursday), Rosalina WORKED 8 hours, and it was ALSO her scheduled weekly Rest Day! What percentage of her daily wage must she receive?',
    options: [
      '260%',
      '300%',
      '330%',
      '390% (300% Double Holiday + 30% of 300% Rest Day premium)',
    ],
    correctIndex: 3,
    explanation:
      'Worked Double Regular Holiday (300%) + 30% Rest Day premium on 300% (+90%) = 390% total daily pay.',
    legalBasis: 'DOLE Statutory Multiplier Table',
  },
  {
    id: 29,
    world: 'Holidays: Statutory Rules',
    worldCode: 'holidays',
    scenario:
      'Pauline is absent WITHOUT pay on Wednesday, the workday immediately preceding Maundy Thursday and Good Friday (successive Regular Holidays). She does not work on Thursday or Friday either. What holiday pay does she get?',
    options: [
      '100% for both Maundy Thursday and Good Friday.',
      '0% — she forfeits holiday pay for BOTH Maundy Thursday and Good Friday unless she works on Maundy Thursday (which restores Good Friday).',
      '50% for each.',
      '0% for Thursday, 100% for Friday automatically.',
    ],
    correctIndex: 1,
    explanation:
      'Where there are two successive regular holidays, an employee absent without pay on the day immediately preceding the first holiday is not entitled to holiday pay for BOTH, unless they work on the first regular holiday (which entitles them to holiday pay on the second).',
    legalBasis: 'Sec. 10, Rule IV, Book III, Omnibus Rules Implementing the Labor Code',
  },
  {
    id: 30,
    world: 'Holidays: Statutory Rules',
    worldCode: 'holidays',
    scenario:
      'Toadette was on approved Sick Leave WITH PAY on Wednesday before a Thursday Regular Holiday. She did not work on Thursday. Is she entitled to 100% Holiday Pay for Thursday?',
    options: [
      'No, she must physically clock in on Wednesday.',
      'Yes; an employee on leave of absence WITH PAY on the workday immediately preceding a regular holiday is entitled to 100% holiday pay.',
      'Only 50%.',
      'Only if she works Friday.',
    ],
    correctIndex: 1,
    explanation:
      'Presence or leave of absence WITH pay on the workday immediately preceding a regular holiday preserves full 100% unworked regular holiday pay.',
    legalBasis: 'Sec. 6, Rule IV, Book III, Omnibus Rules',
  },
  {
    id: 31,
    world: 'Holidays: Statutory Rules',
    worldCode: 'holidays',
    scenario:
      'August 21 (Ninoy Aquino Day) is a Special Non-Working Day. Birdo did not report for work. No CBA or company policy grants unworked special day pay. How much is Birdo paid (daily-paid worker)?',
    options: [
      '100% basic wage',
      '0% under the "No work, no pay" principle',
      '30% standby pay',
      '130% basic wage',
    ],
    correctIndex: 1,
    explanation:
      'On Special Non-Working Days, the statutory rule is "No work, no pay" unless there is a favorable company policy, practice, or CBA.',
    legalBasis: 'DOLE Labor Advisory on Special Non-Working Days',
  },
  {
    id: 32,
    world: 'Holidays: Statutory Rules',
    worldCode: 'holidays',
    scenario:
      'Donkey Kong worked 8 hours on November 1 (All Saints’ Day, a Special Non-Working Day) which also fell on his scheduled Rest Day. Daily wage is ₱800. How much is his pay?',
    options: [
      '₱1,040 (130%)',
      '₱1,200 (150% of daily rate)',
      '₱1,600 (200%)',
      '₱800 (100%)',
    ],
    correctIndex: 1,
    explanation:
      'Work performed on a Special Non-Working Day that falls on a scheduled Rest Day is paid 150% of basic daily wage (₱800 × 1.50 = ₱1,200).',
    legalBasis: 'Article 93(c), Labor Code & DOLE Multiplier Matrix',
  },
  {
    id: 33,
    world: 'Holidays: Statutory Rules',
    worldCode: 'holidays',
    scenario:
      'Proclamation declares a date as a "Special Working Day." Diddy Kong works 8 hours on that day (an ordinary weekday for him). What rate applies?',
    options: [
      '130% special rate',
      '100% regular daily wage (no statutory premium for the first 8 hours)',
      '150% rate',
      '200% rate',
    ],
    correctIndex: 1,
    explanation:
      'On a Special Working Day, work performed is treated as an ordinary working day paid at 100% basic daily wage for the first 8 hours (125% for overtime).',
    legalBasis: 'DOLE Labor Advisory on Special Working Days',
  },
  {
    id: 34,
    world: 'Holidays: Statutory Rules',
    worldCode: 'holidays',
    scenario:
      'A neighborhood bakery regularly employs 8 workers. Are its bakers statutorily entitled to Regular Holiday Pay under Article 94?',
    options: [
      'Yes, all bakeries are manufacturing.',
      'No; retail and service establishments regularly employing LESS THAN ten (< 10) workers are exempt from Holiday Pay under Article 94(b).',
      'Yes, at 150% rate.',
      'Only on Christmas and New Year.',
    ],
    correctIndex: 1,
    explanation:
      'Article 94(b) exempts retail and service establishments regularly employing less than ten (10) workers from mandatory holiday pay.',
    legalBasis: 'Article 94(b), Labor Code of the Philippines',
  },
  {
    id: 35,
    world: 'Holidays: Statutory Rules',
    worldCode: 'holidays',
    scenario:
      'How is unworked Regular Holiday Pay computed for a supervised piece-rate worker (e.g., garment sewer paid per shirt inside the factory)?',
    options: [
      'Piece-rate workers are never entitled to holiday pay.',
      'Not less than their average daily earnings for the last seven (7) actual working days preceding the regular holiday (never below statutory minimum wage).',
      'Fixed ₱200 flat allowance.',
      'Average earnings over the last 12 months.',
    ],
    correctIndex: 1,
    explanation:
      'Supervised piece-rate workers receive holiday pay equal to at least their average daily earnings for the last 7 actual workdays immediately preceding the regular holiday, provided it is not less than the applicable statutory minimum wage.',
    legalBasis: 'Sec. 8(b), Rule IV, Book III, Omnibus Rules',
  },
  {
    id: 36,
    world: 'Holidays: Statutory Rules',
    worldCode: 'holidays',
    scenario:
      'How are private school faculty paid per lecture hour ("no class, no pay") treated during unworked Regular Holidays vs semestral vacations?',
    options: [
      'Paid during both regular holidays and semestral breaks.',
      'Not entitled during semestral vacations, EXCEPT they MUST be paid during regular holidays and unexpected class suspensions (Jose Rizal College doctrine).',
      'Never entitled to any holiday pay.',
      'Paid 200% even when unworked.',
    ],
    correctIndex: 1,
    explanation:
      'Under Jose Rizal College v. NLRC, hourly-paid private school faculty are entitled to regular holiday pay during expected regular holidays and class suspensions (e.g. typhoons), though not during scheduled semestral breaks.',
    legalBasis: 'Jose Rizal College v. NLRC & Sec. 8(a), Rule IV, Book III',
  },
  {
    id: 37,
    world: 'Holidays: Statutory Rules',
    worldCode: 'holidays',
    scenario:
      'Waluigi works 10 hours (2 hours overtime) on a Regular Holiday (ordinary workday). His daily rate is ₱800 (₱100/hr). Compute his total pay for the 10 hours.',
    options: [
      '₱2,000',
      '₱2,120 (₱1,600 for first 8 hrs + ₱520 for 2 OT hrs at ₱100 × 2.0 × 1.30 = ₱260/hr)',
      '₱2,200',
      '₱1,850',
    ],
    correctIndex: 1,
    explanation:
      'First 8 hours = ₱800 × 200% = ₱1,600. Overtime on Regular Holiday = ₱100 × 200% × 130% = ₱260/hr × 2 hrs = ₱520. Total = ₱2,120.',
    legalBasis: 'Articles 87 & 94, Labor Code',
  },

  // ================= WORLD 3: WAGES, DEDUCTIONS & CONTRACTING (10 Questions) =================
  {
    id: 38,
    world: 'World 3: Wages & Contracting',
    worldCode: 'w3',
    scenario:
      'Under DOLE D.O. 174-17, what is the minimum substantial capital required for a corporation or partnership to qualify as a legitimate contractor?',
    options: [
      '₱1,000,000 paid-up capital',
      '₱3,000,000 paid-up capital',
      '₱5,000,000 paid-up capital',
      '₱10,000,000 authorized capital',
    ],
    correctIndex: 2,
    explanation:
      'Section 3(l) of DOLE D.O. 174-17 defines substantial capital as paid-up capital stock/shares of at least ₱5,000,000 for corporations/partnerships/cooperatives, or net worth of at least ₱5,000,000 for single proprietorships.',
    legalBasis: 'DOLE Department Order No. 174, Series of 2017',
  },
  {
    id: 39,
    world: 'World 3: Wages & Contracting',
    worldCode: 'w3',
    scenario:
      'A legitimate contractor with ₱8M capital fails to pay two months of wages to guards assigned to Peach Bank. Is Peach Bank liable for the unpaid wages?',
    options: [
      'No, because the contractor is legitimate and independent.',
      'Yes; under Articles 106, 107, and 109, the principal is SOLIDARILY liable with the legitimate contractor for unpaid wages to the extent of work performed under the contract.',
      'Peach Bank becomes their permanent employer.',
      'Only up to 10% of the contract fee.',
    ],
    correctIndex: 1,
    explanation:
      'Even in legitimate job contracting, the principal is solidarily liable with the contractor for unpaid wages for work performed (without prejudice to reimbursement from the contractor). In labor-only contracting, the principal becomes the direct employer for ALL purposes.',
    legalBasis: 'Articles 106–109, Labor Code of the Philippines',
  },
  {
    id: 40,
    world: 'World 3: Wages & Contracting',
    worldCode: 'w3',
    scenario:
      'A company provides free specialized flame-retardant uniforms to foundry welders for OSHA compliance and deducts ₱300/month from their minimum wage as a "facility." Valid?',
    options: [
      'Valid if the welders signed a consent form.',
      'Invalid; protective gear and company uniforms are SUPPLEMENTS for the employer’s benefit/business, NEVER deductible from wages.',
      'Valid up to 50% of cost.',
      'Valid after 6 months.',
    ],
    correctIndex: 1,
    explanation:
      'Under Mabeza v. NLRC and Atok-Big Wedge, items primarily for the benefit or convenience of the employer are "supplements" (non-deductible), unlike "facilities" for employee subsistence (which require voluntary written consent + DOLE fair-value evaluation).',
    legalBasis: 'Mabeza v. NLRC & Sec. 5, Rule VII-A, Book III',
  },
  {
    id: 41,
    world: 'World 3: Wages & Contracting',
    worldCode: 'w3',
    scenario:
      'What are the three mandatory legal requisites before an employer may deduct the value of Meals or Lodging ("Facilities") from a minimum-wage employee’s salary?',
    options: [
      'Oral notice to the employee is enough.',
      '1) Proof such facilities are customarily furnished in the trade; 2) Voluntary written acceptance by the employee; and 3) Fair and reasonable value (without profit) charged.',
      'Union vote only.',
      'Barangay clearance.',
    ],
    correctIndex: 1,
    explanation:
      'In Mabeza v. NLRC, the Supreme Court established the strict 3-part test: customary in the trade, voluntary written authorization by the employee, and fair/reasonable value without employer profit.',
    legalBasis: 'Mabeza v. NLRC (G.R. No. 118506)',
  },
  {
    id: 42,
    world: 'World 3: Wages & Contracting',
    worldCode: 'w3',
    scenario:
      'In an UNORGANIZED establishment (no union / no CBA), a regional Wage Order causes a wage distortion. If employer and workers fail to settle it within 10 calendar days before the NCMB, who resolves it?',
    options: [
      'Voluntary Arbitrator.',
      'National Labor Relations Commission (NLRC) through compulsory arbitration.',
      'Supreme Court directly.',
      'RTWPB.',
    ],
    correctIndex: 1,
    explanation:
      'Under Article 124: Organized establishments -> Grievance Machinery -> Voluntary Arbitration. Unorganized establishments -> NCMB conciliation (10 days) -> NLRC compulsory arbitration.',
    legalBasis: 'Article 124, Labor Code of the Philippines',
  },
  {
    id: 43,
    world: 'World 3: Wages & Contracting',
    worldCode: 'w3',
    scenario:
      'A union strikes because management refused to adjust Supervisor wages immediately after a Wage Order raised minimum wages. Is the strike over Wage Distortion legal?',
    options: [
      'Legal, wage distortion is an unfair labor practice.',
      'Illegal; legislative/jurisprudential policy (Ilaw at Buklod ng Manggagawa) prohibits strikes or lockouts over wage distortion disputes, which must follow Art. 124 arbitration.',
      'Legal if 30-day strike notice was filed.',
      'Legal in unorganized firms.',
    ],
    correctIndex: 1,
    explanation:
      'In Ilaw at Buklod ng Manggagawa v. NLRC, the Supreme Court held that strikes/lockouts are prohibited as a means of resolving wage distortion; Art. 124’s grievance/arbitration procedure is exclusive.',
    legalBasis: 'Article 124, Labor Code & Ilaw at Buklod ng Manggagawa v. NLRC',
  },
  {
    id: 44,
    world: 'World 3: Wages & Contracting',
    worldCode: 'w3',
    scenario:
      'Under Article 110, when an employer goes bankrupt and undergoes liquidation, what preference do workers’ unpaid wages enjoy?',
    options: [
      'Subordinate to commercial bank mortgages.',
      'First preference as regards wages and monetary claims over other creditors (after government taxes), subject to formal insolvency/liquidation proceedings.',
      'Last in line after shareholders.',
      'Automatic seizure without court liquidation.',
    ],
    correctIndex: 1,
    explanation:
      'Article 110 grants workers first preference in unpaid wages and monetary claims in case of bankruptcy or liquidation, enforceable within formal insolvency/liquidation proceedings (DBP v. NLRC).',
    legalBasis: 'Article 110, Labor Code & Republic v. Peralta',
  },
  {
    id: 45,
    world: 'World 3: Wages & Contracting',
    worldCode: 'w3',
    scenario:
      'Because of a payroll clerk’s clear mathematical misreading of a new tax circular, employees were overpaid ₱1,500 for two paydays. Management corrects the error on the third payday. Does this violate Non-Diminution of Benefits (Art. 100)?',
    options: [
      'Yes, once paid twice it is vested.',
      'No; correction of an error in the construction or application of a doubtful or difficult question of law (or clear clerical mistake discovered promptly) does not violate Art. 100.',
      'Yes, unless DOLE issues an exemption.',
      'Only new hires can be corrected.',
    ],
    correctIndex: 1,
    explanation:
      'Non-diminution applies only to long, consistent, deliberate, and voluntary grants—not to good-faith mistakes or erroneous legal interpretations corrected promptly (Globe Mackay v. NLRC).',
    legalBasis: 'Article 100, Labor Code & Globe Mackay Cable v. NLRC',
  },
  {
    id: 46,
    world: 'World 3: Wages & Contracting',
    worldCode: 'w3',
    scenario:
      'Where must wages be paid as a general rule under Article 104 of the Labor Code, and where is payment strictly prohibited?',
    options: [
      'Anywhere convenient, including bars if near the office.',
      'At or near the place of undertaking (or via compliant ATM/bank payroll); payment in bars, night/day clubs, drinking establishments, massage clinics, or casinos is prohibited (except for their own employees).',
      'Only at the Barangay Hall.',
      'Only in cash envelopes.',
    ],
    correctIndex: 1,
    explanation:
      'Wages must be paid at/near the workplace (or authorized bank ATM facility), and R.A. 6727 / Labor Code rules prohibit wage payment inside bars, clubs, casinos, or gambling places except for persons employed therein.',
    legalBasis: 'Article 104, Labor Code & Sec. 4, Rule VIII, Book III',
  },
  {
    id: 47,
    world: 'World 3: Wages & Contracting',
    worldCode: 'w3',
    scenario:
      'A factory worker accidentally breaks a ₱4,000 tool due to proven gross negligence after a formal hearing. His weekly wage is ₱3,000. What is the MAXIMUM weekly deduction allowed under Omnibus Rules?',
    options: [
      '₱3,000 (100% of weekly wage)',
      '₱600 (cannot exceed 20% of the employee’s wages in a week)',
      '₱1,500 (50% of weekly wage)',
      '₱0; damage deductions are always banned.',
    ],
    correctIndex: 1,
    explanation:
      'Once employee fault and due process are satisfied under Art. 114, Sec. 11, Rule VIII, Book III caps weekly deductions for loss/damage at 20% of the employee’s weekly wage.',
    legalBasis: 'Art. 114 & Sec. 11, Rule VIII, Book III, Omnibus Rules',
  },

  // ================= WORLD 4: SPECIAL GROUPS OF EMPLOYEES (9 Questions) =================
  {
    id: 48,
    world: 'World 4: Special Groups',
    worldCode: 'w4',
    scenario:
      'An airline Flight Attendant handbook states that female cabin crew who get pregnant or marry shall automatically be considered resigned. Valid?',
    options: [
      'Valid due to cabin safety requirements.',
      'Void and illegal under Articles 134 & 135 (renumbered 136–137), which prohibit stipulations against marriage and dismissal on account of pregnancy.',
      'Valid if signed voluntarily.',
      'Valid for international flights only.',
    ],
    correctIndex: 1,
    explanation:
      'Stipulations against marriage (Art. 136) and discharge on account of pregnancy (Art. 137) violate statutory public policy (PT&T v. NLRC; Saudia v. Moradas).',
    legalBasis: 'Articles 136–137, Labor Code & PT&T v. NLRC',
  },
  {
    id: 49,
    world: 'World 4: Special Groups',
    worldCode: 'w4',
    scenario:
      'Star Paper Corp. enforces a blanket rule banning employees from marrying ANY co-employee, firing an employee who married a coworker in a completely unrelated department without showing business necessity. Valid?',
    options: [
      'Valid management prerogative.',
      'Invalid; under Star Paper Corp. v. Simbol, a no-spouse policy among coworkers is void unless the employer proves a Bona Fide Occupational Qualification (BFOQ) / reasonable business necessity.',
      'Always valid in manufacturing.',
      'Valid if the husband resigns instead of the wife.',
    ],
    correctIndex: 1,
    explanation:
      'Unlike competitor-conflict policies (Glaxo), a blanket ban on marrying co-employees is struck down unless justified by a genuine Bona Fide Occupational Qualification (BFOQ).',
    legalBasis: 'Star Paper Corp. v. Simbol (G.R. No. 164774)',
  },
  {
    id: 50,
    world: 'World 4: Special Groups',
    worldCode: 'w4',
    scenario:
      'Under R.A. 9231, a 13-year-old child actor works on a TV commercial with a valid DOLE Child Working Permit. What are the strict hour limits and night-work curfew?',
    options: [
      '8 hrs/day, 40 hrs/week; no work 10 PM–6 AM.',
      'Not more than 4 hours/day and 20 hours/week; strictly NO work between 8:00 PM and 6:00 AM.',
      '6 hrs/day, 30 hrs/week.',
      '2 hrs/day only.',
    ],
    correctIndex: 1,
    explanation:
      'Children below 15 years old (when allowed under permit) may work max 4 hours/day, 20 hours/week, and never between 8:00 PM and 6:00 AM.',
    legalBasis: 'Section 12-A, Republic Act No. 9231',
  },
  {
    id: 51,
    world: 'World 4: Special Groups',
    worldCode: 'w4',
    scenario:
      'For a working child under R.A. 9231, how may the child’s wages be used by parents, and how much must go into a Trust Fund?',
    options: [
      'Parents own 100% of a minor’s earnings.',
      'At least 30% must be deposited in a Trust Fund in the child’s name, and at most 20% may be used for the collective needs of the family if the child’s needs are first met.',
      '50% to parents, 50% to school.',
      '10% Trust Fund.',
    ],
    correctIndex: 1,
    explanation:
      'R.A. 9231 Sec. 12-B protects the child’s income: collective family needs cannot exceed 20%, and at least 30% must be preserved in a bank trust fund for the child’s education/future.',
    legalBasis: 'Section 12-B, Republic Act No. 9231',
  },
  {
    id: 52,
    world: 'World 4: Special Groups',
    worldCode: 'w4',
    scenario:
      'Under Batas Kasambahay (R.A. 10361), a domestic helper earns ₱4,500/month in a chartered city outside NCR. Who pays the monthly SSS, PhilHealth, and Pag-IBIG contributions?',
    options: [
      'Split 50–50 between employer and Kasambahay.',
      '100% shouldered by the EMPLOYER because the Kasambahay’s monthly wage is less than ₱5,000.',
      '100% deducted from the Kasambahay.',
      'Social coverage is optional.',
    ],
    correctIndex: 1,
    explanation:
      'Under Section 30 of R.A. 10361, if the Kasambahay receives a wage of less than ₱5,000/month, the employer pays the entire SSS, PhilHealth, and Pag-IBIG premium without deducting an employee share.',
    legalBasis: 'Section 30, Republic Act No. 10361 (Batas Kasambahay)',
  },
  {
    id: 53,
    world: 'World 4: Special Groups',
    worldCode: 'w4',
    scenario:
      'Can a Kasambahay’s unused 5-day annual Service Incentive Leave (SIL) be accumulated from year to year and converted to cash upon resignation like industrial SIL?',
    options: [
      'Yes, identical to Article 95.',
      'No; under Section 29 of R.A. 10361, any unused portion of a Kasambahay’s 5-day SIL shall NOT be cumulative or carried over to succeeding years, and unused SIL is not convertible to cash.',
      'Convertible at 50%.',
      'Cumulative up to 30 days.',
    ],
    correctIndex: 1,
    explanation:
      'Critical Bar exam distinction! Industrial SIL (Art. 95) IS cumulative and commutable to cash, whereas Kasambahay SIL (Sec. 29, R.A. 10361) is NOT cumulative and NOT convertible to cash!',
    legalBasis: 'Section 29, Republic Act No. 10361',
  },
  {
    id: 54,
    world: 'World 4: Special Groups',
    worldCode: 'w4',
    scenario:
      'Under R.A. 10151 (Night Workers Law), a pregnant night-shift call center agent presents a medical certificate stating she is unfit for night work for 10 weeks before childbirth. What must the employer do?',
    options: [
      'Terminate her with separation pay.',
      'Transfer her to a similar daytime job if practicable, or extend maternity/social security benefits; she CANNOT be dismissed on account of night-work unfitness due to pregnancy.',
      'Cut her pay by 50%.',
      'Force her to sign a quitclaim.',
    ],
    correctIndex: 1,
    explanation:
      'Under R.A. 10151 (Art. 158), pregnant and nursing night workers must be provided alternatives to night work (transfer to day shift or benefit extension for at least 16 weeks before/after childbirth) and enjoy protection against dismissal.',
    legalBasis: 'Republic Act No. 10151 (Art. 158, Labor Code)',
  },
  {
    id: 55,
    world: 'World 4: Special Groups',
    worldCode: 'w4',
    scenario:
      'Who is NOT classified as a "Kasambahay" under R.A. 10361?',
    options: [
      'A live-in family yaya.',
      'A family driver or children under foster family arrangement.',
      'A household laundrywoman.',
      'A live-in gardener.',
    ],
    correctIndex: 1,
    explanation:
      'Section 3(d) & Sec. 4 of R.A. 10361 expressly exclude service providers, family drivers, children under foster family arrangement, and persons who perform work occasionally/sporadically.',
    legalBasis: 'Section 4, Republic Act No. 10361',
  },
  {
    id: 56,
    world: 'World 4: Special Groups',
    worldCode: 'w4',
    scenario:
      'Under R.A. 10917 (amending R.A. 9547 on SPES), what age range of poor but deserving students or out-of-school youth is eligible for the Special Program for Employment of Students?',
    options: [
      '12 to 18 years old',
      '15 to 30 years old',
      '18 to 25 years old',
      '21 to 35 years old',
    ],
    correctIndex: 1,
    explanation:
      'R.A. 10917 expanded SPES eligibility to students and out-of-school youth aged 15 to 30 years old, with employers paying 60% in cash and DOLE paying 40%.',
    legalBasis: 'Republic Act No. 10917 (Amended SPES Law)',
  },

  // ================= WORLD 5: SPECIAL PROTECTIVE LAWS (9 Questions) =================
  {
    id: 57,
    world: 'World 5: Protective Laws',
    worldCode: 'w5',
    scenario:
      'Under the 105-Day Expanded Maternity Leave Law (R.A. 11210), an unmarried solo-parent employee gives birth via normal delivery. How many total days of PAID maternity leave is she entitled to?',
    options: [
      '60 days',
      '105 days',
      '120 days (105 days base + 15 days additional paid leave for qualified Solo Parents under R.A. 8972)',
      '90 days',
    ],
    correctIndex: 2,
    explanation:
      'R.A. 11210 grants 105 days paid maternity leave regardless of civil status or delivery mode (normal/caesarean), plus an additional 15 days with full pay if she qualifies as a Solo Parent = 120 paid days!',
    legalBasis: 'Section 3, Republic Act No. 11210',
  },
  {
    id: 58,
    world: 'World 5: Protective Laws',
    worldCode: 'w5',
    scenario:
      'Under R.A. 11210, how many days of paid maternity leave are granted in case of miscarriage or emergency termination of pregnancy?',
    options: [
      '30 days',
      '60 days with full pay',
      '78 days',
      '105 days',
    ],
    correctIndex: 1,
    explanation:
      'For miscarriage or emergency termination of pregnancy, R.A. 11210 grants sixty (60) days of maternity leave with full pay.',
    legalBasis: 'Section 3, Republic Act No. 11210',
  },
  {
    id: 59,
    world: 'World 5: Protective Laws',
    worldCode: 'w5',
    scenario:
      'A junior intern sends unwanted sexually explicit messages and lewd gestures to his female department supervisor. Under the Safe Spaces Act (R.A. 11313), is he liable for workplace gender-based sexual harassment?',
    options: [
      'No, because a subordinate lacks moral ascendancy over a supervisor.',
      'Yes; R.A. 11313 expressly penalizes workplace sexual harassment committed between peers AND by a subordinate to a superior.',
      'Only civilly liable for damages.',
      'Only if committed outside office hours.',
    ],
    correctIndex: 1,
    explanation:
      'Unlike R.A. 7877, the Safe Spaces Act (R.A. 11313, Sec. 16) eliminates the requirement of moral ascendancy, covering peer-to-peer and subordinate-to-superior harassment including online messages.',
    legalBasis: 'Section 16, Republic Act No. 11313 (Safe Spaces Act)',
  },
  {
    id: 60,
    world: 'World 5: Protective Laws',
    worldCode: 'w5',
    scenario:
      'Under R.A. 9710 (Magna Carta for Women), a female employee with 8 months aggregate service undergoes surgical hysterectomy. How long is her Special Leave Benefit, and is unused leave convertible to cash?',
    options: [
      '30 days, convertible to cash.',
      'Up to two (2) months with full pay based on gross monthly compensation; non-cumulative and NOT convertible to cash.',
      '60 days unpaid.',
      '15 days, cumulative.',
    ],
    correctIndex: 1,
    explanation:
      'Section 18 of R.A. 9710 grants up to 2 months special leave with full pay following surgery caused by gynecological disorders (after >=6 months aggregate service in the last 12 months), non-cumulative and non-convertible to cash.',
    legalBasis: 'Section 18, Republic Act No. 9710',
  },
  {
    id: 61,
    world: 'World 5: Protective Laws',
    worldCode: 'w5',
    scenario:
      'Under the Expanded Solo Parents Welfare Act (R.A. 11861 amending R.A. 8972), what is the minimum service requirement to avail of the 7-day forfeitable/non-cumulative paid Parental Leave?',
    options: [
      '1 year of continuous service',
      'At least six (6) months of service (reduced from 1 year by R.A. 11861!)',
      '2 years of service',
      'Day 1 of employment',
    ],
    correctIndex: 1,
    explanation:
      'R.A. 11861 reduced the service qualification for the 7-day paid Solo Parent Leave from 1 year down to at least six (6) months of service regardless of employment status!',
    legalBasis: 'Section 8, R.A. 8972 as amended by R.A. 11861',
  },
  {
    id: 62,
    world: 'World 5: Protective Laws',
    worldCode: 'w5',
    scenario:
      'Under R.A. 10911 (Anti-Age Discrimination in Employment Act), an employer publishes a job ad: "Wanted: Bookkeeper, must be 22–28 years old." Valid?',
    options: [
      'Valid freedom of commercial speech.',
      'Unlawful; R.A. 10911 strictly prohibits publishing job notices suggesting age preference/limitation unless age is a proven Bona Fide Occupational Qualification (BFOQ).',
      'Valid if salary is above minimum wage.',
      'Valid for private corporations.',
    ],
    correctIndex: 1,
    explanation:
      'Section 5(a) of R.A. 10911 prohibits printing or publishing any notice or advertisement relating to employment suggesting preferences, limitations, specifications, or discrimination based on age.',
    legalBasis: 'Section 5, Republic Act No. 10911',
  },
  {
    id: 63,
    world: 'World 5: Protective Laws',
    worldCode: 'w5',
    scenario:
      'Under R.A. 7277 (Magna Carta for Persons with Disabilities), what tax incentive is granted to private entities that employ qualified PWDs as regular, apprentice, or learner employees?',
    options: [
      'Full income tax holiday for 5 years.',
      'Additional deduction from gross income equivalent to 25% of the total amount paid as salaries and wages to Persons with Disability.',
      '50% VAT exemption.',
      'Zero local business tax.',
    ],
    correctIndex: 1,
    explanation:
      'Section 8(b) of R.A. 7277 rewards private employers who hire PWDs with an additional deduction from gross income equal to 25% of total salaries/wages paid to PWDs (plus 50% deduction for physical facility modifications).',
    legalBasis: 'Section 8, Republic Act No. 7277',
  },
  {
    id: 64,
    world: 'World 5: Protective Laws',
    worldCode: 'w5',
    scenario:
      'Under R.A. 11165 (Telecommuting Act), a work-from-home software engineer renders authorized work from 10:00 PM to 2:00 AM. Management refuses Night Shift Differential claiming she was "comfortably at home." Decide.',
    options: [
      'Management is right; NSD applies only to physical offices.',
      'Unlawful; under the Fair Treatment standard of R.A. 11165, telecommuting workers are entitled to the exact same rate of pay, overtime, and Night Shift Differential as comparable on-site workers.',
      'She gets half NSD (5%).',
      'Telecommuting waives all Title I rights.',
    ],
    correctIndex: 1,
    explanation:
      'Section 4 (Fair Treatment) of R.A. 11165 guarantees telecommuting employees no less than minimum labor standards, including overtime, holiday pay, and Night Shift Differential.',
    legalBasis: 'Section 4, Republic Act No. 11165 (Telecommuting Act)',
  },
  {
    id: 65,
    world: 'World 5: Protective Laws',
    worldCode: 'w5',
    scenario:
      'Under R.A. 10754 & R.A. 7277, how many positions must government agencies reserve for Persons with Disability (PWDs), and what is encouraged for private corporations with >100 employees?',
    options: [
      '5% for both.',
      'At least 1% of all positions in government agencies; private corporations with more than 100 employees are encouraged to reserve at least 1% of all positions for PWDs.',
      '10% for government.',
      '2% mandatory quota for small shops.',
    ],
    correctIndex: 1,
    explanation:
      'R.A. 10524 (amending Sec. 5 of R.A. 7277) mandates at least 1% reservation of positions in government agencies and encourages private corporations with >100 employees to reserve at least 1%.',
    legalBasis: 'Republic Act No. 10524 (Amending Sec. 5, R.A. 7277)',
  },
  // ================= WORLD 6: STATUTORY LEAVES & WELFARE (IDs 131–155) =================
  {
    id: 131,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Under Article 95 of the Labor Code, what is the minimum length of service required before a covered employee becomes entitled to the 5-day yearly Service Incentive Leave (SIL) with pay?',
    options: [
      'At least 6 months of continuous service.',
      'At least 1 year of service (12 months, whether continuous or broken, reckoned from date of hiring).',
      'At least 3 months of probationary service.',
      'Immediate upon day one of employment.',
    ],
    correctIndex: 1,
    explanation:
      'Every covered employee who has rendered at least one (1) year of service—meaning service within 12 months, whether continuous or broken, reckoned from hiring—is entitled to a yearly SIL of 5 days with pay.',
    legalBasis: 'Article 95, Labor Code; Book III, Rule V, Sec. 3, Omnibus Rules',
  },
  {
    id: 132,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'A retail store regularly employs 8 sales clerks. One clerk completes 2 years of service and demands 10 days of commuted Service Incentive Leave pay. Is the store legally bound to pay SIL?',
    options: [
      'Yes, all private establishments regardless of size must grant SIL.',
      'No, establishments regularly employing less than ten (10) employees are statutorily exempt from granting Service Incentive Leave.',
      'Yes, unless DOLE issues an annual insolvency certificate.',
      'Only 2.5 days per year.',
    ],
    correctIndex: 1,
    explanation:
      'Under Article 95(b) and Book III, Rule V, Sec. 1 of the Omnibus Rules, establishments regularly employing fewer than ten (10) employees are exempt from Service Incentive Leave.',
    legalBasis: 'Article 95, Labor Code; Book III, Rule V, Sec. 1, Omnibus Rules',
  },
  {
    id: 133,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'In Auto Bus Transport Systems, Inc. v. Bautista, when does the 3-year prescriptive period for a money claim for unused commutable Service Incentive Leave (SIL) begin to run?',
    options: [
      'At the end of every calendar year when the 5 days were earned.',
      'From the time the employer refuses the employee’s demand for commutation, OR upon termination/resignation/retirement of employment when final commutation becomes due.',
      'One year from date of hiring.',
      'Ten years from the signing of the employment contract.',
    ],
    correctIndex: 1,
    explanation:
      'Because the employee has the choice to use SIL as leave or commute it to cash upon separation, the cause of action accrues—and the 3-year prescriptive period under Art. 306 [291] begins—only from employer refusal upon demand or upon separation from service.',
    legalBasis: 'Auto Bus Transport Systems, Inc. v. Bautista, G.R. No. 156367 (2005)',
  },
  {
    id: 134,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Company X already grants its rank-and-file employees 7 days of Vacation Leave with pay per year under Company Policy. Must Company X still grant an additional 5 days of statutory SIL?',
    options: [
      'Yes, statutory SIL is always stacked on top of company vacation leave.',
      'No. Establishments already granting vacation leave with pay of at least five (5) days are exempt from granting statutory SIL.',
      'Yes, unless approved by a union plebiscite.',
      'Only during leap years.',
    ],
    correctIndex: 1,
    explanation:
      'Book III, Rule V, Section 1(d) of the Omnibus Rules exempts employers already enjoying/granting vacation leave with pay of at least five (5) days from granting separate statutory SIL.',
    legalBasis: 'Book III, Rule V, Section 1(d), Omnibus Rules Implementing the Labor Code',
  },
  {
    id: 135,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Compare Service Incentive Leave under the Labor Code (Art. 95) with the 5-day SIL of a Kasambahay under R.A. 10361:',
    options: [
      'Both are cumulative and convertible to cash.',
      'Labor Code SIL is commutable to cash if unused; Kasambahay 5-day SIL is NON-cumulative and NON-convertible to cash if unused.',
      'Kasambahay SIL is 15 days and convertible to cash.',
      'Neither is paid during leave.',
    ],
    correctIndex: 1,
    explanation:
      'Under Art. 95, unused SIL of regular employees is commutable to its cash equivalent at year-end/separation. Under Sec. 29 of R.A. 10361, unused Kasambahay SIL cannot be accumulated from year to year and is not convertible to cash.',
    legalBasis: 'Art. 95, Labor Code vs. Sec. 29, R.A. 10361 (Batas Kasambahay)',
  },
  {
    id: 136,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Under R.A. 11210 (105-Day Expanded Maternity Leave Law), how many days of paid maternity leave is a female private-sector worker entitled to for a live childbirth via cesarean section?',
    options: [
      '78 days with full pay.',
      '105 days with full pay, regardless of whether delivery is normal or cesarean.',
      '120 days automatically for all cesarean births.',
      '60 days with full pay.',
    ],
    correctIndex: 1,
    explanation:
      'R.A. 11210 abolished the old 60/78-day distinction and grants 105 days of paid maternity leave for live childbirth regardless of mode of delivery (normal or cesarean).',
    legalBasis: 'Section 3, Republic Act No. 11210 (105-Day Expanded Maternity Leave Law)',
  },
  {
    id: 137,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Maya, a qualified Solo Parent holding a valid Solo Parent ID, gives birth to a live child. How many total paid maternity leave days may she enjoy under R.A. 11210?',
    options: [
      '105 days only.',
      '120 days with full pay (105 base days + an additional 15 days for qualified solo parents).',
      '135 days with full pay.',
      '90 days with full pay.',
    ],
    correctIndex: 1,
    explanation:
      'Under Section 3 of R.A. 11210, a female worker who qualifies as a solo parent under R.A. 8972 / R.A. 11861 is granted an additional fifteen (15) days of paid maternity leave, totaling 120 paid days.',
    legalBasis: 'Section 3, Republic Act No. 11210',
  },
  {
    id: 138,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Under R.A. 11210, how many days of paid maternity leave are granted in cases of miscarriage or emergency termination of pregnancy (ETP), including stillbirth?',
    options: [
      '30 days with full pay.',
      '60 days with full pay.',
      '105 days with full pay.',
      '7 days with full pay.',
    ],
    correctIndex: 1,
    explanation:
      'Section 3 of R.A. 11210 grants sixty (60) days of maternity leave with full pay for miscarriage or emergency termination of pregnancy (including stillbirth).',
    legalBasis: 'Section 3, Republic Act No. 11210',
  },
  {
    id: 139,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Does R.A. 11210 limit paid maternity leave to the first four (4) deliveries or miscarriages?',
    options: [
      'Yes, it strictly caps coverage at the first 4 pregnancies.',
      'No! Maternity leave is granted in EVERY instance of pregnancy, miscarriage, or emergency termination of pregnancy, regardless of frequency.',
      'Yes, up to 3 live births only.',
      'Only for legally married mothers.',
    ],
    correctIndex: 1,
    explanation:
      'R.A. 11210 removed the old 4-delivery cap; paid maternity leave applies to EVERY instance of pregnancy, miscarriage, or ETP regardless of frequency or civil status.',
    legalBasis: 'Section 3, Republic Act No. 11210',
  },
  {
    id: 140,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Elena gives birth to a live child and wants to allocate 7 days of her 105-day maternity leave to Carlo, the child’s biological father, who is NOT married to Elena. Is this valid, and how many total leave days can Carlo have if he were married vs. unmarried?',
    options: [
      'Invalid because allocation is only for married spouses.',
      'Valid! Up to 7 days of the 105-day leave may be allocated to the child’s father WHETHER OR NOT married to the mother (so a married father can get 7 Paternity + 7 Allocated = 14 days; an unmarried father gets the 7 Allocated days).',
      'Up to 15 days may be allocated to any co-worker.',
      'Valid even in cases of miscarriage.',
    ],
    correctIndex: 1,
    explanation:
      'Under Sec. 6 of R.A. 11210, a female worker entitled to 105-day live childbirth leave may allocate up to 7 days to the child’s father, whether or not married to her (over and above 7-day Paternity Leave under R.A. 8187 if married). Allocation is not available in miscarriage.',
    legalBasis: 'Section 6, Republic Act No. 11210',
  },
  {
    id: 141,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'In private-sector employment under R.A. 11210, who shoulders the "Salary Differential" when the employee’s actual full pay exceeds her SSS maternity cash benefit?',
    options: [
      'PhilHealth reimburses the difference.',
      'The employer must pay the salary differential (except distressed establishments, retail/service employing <10 workers, micro-enterprises/BMBEs, and those already granting equal/superior benefits).',
      'The employee absorbs the difference.',
      'Pag-IBIG Fund.',
    ],
    correctIndex: 1,
    explanation:
      'Section 5 of R.A. 11210 mandates private employers to advance full pay within 30 days from filing and shoulder the salary differential between full pay and actual SSS maternity benefits, subject to four narrow statutory exemptions.',
    legalBasis: 'Section 5, Republic Act No. 11210',
  },
  {
    id: 142,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'May a female worker extend her 105-day maternity leave for an additional 30 days under R.A. 11210?',
    options: [
      'No, extensions are prohibited.',
      'Yes, an additional 30 days WITHOUT PAY upon 45 days prior written notice before the end of her maternity leave (unless a medical emergency prevents prior notice).',
      'Yes, 30 days WITH FULL PAY.',
      'Only if approved by the Labor Arbiter.',
    ],
    correctIndex: 1,
    explanation:
      'Section 3 of R.A. 11210 grants the option to extend maternity leave for an additional 30 days without pay, provided the employer is given due notice in writing at least 45 days before the end of maternity leave.',
    legalBasis: 'Section 3, Republic Act No. 11210',
  },
  {
    id: 143,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Under R.A. 8187 (Paternity Leave Act of 1996), which of the following is an INDISPENSABLE requisite for a male employee to claim the 7-day paid Paternity Leave?',
    options: [
      'He must have rendered at least 1 year of service.',
      'He must be legally married to, and cohabiting with, his legitimate spouse at the time of childbirth or miscarriage (up to the first 4 deliveries/miscarriages).',
      'He must be an unmarried live-in partner.',
      'The delivery must be via cesarean section.',
    ],
    correctIndex: 1,
    explanation:
      'R.A. 8187 grants 7 calendar/working days with full pay to every married male employee in the private and public sectors for the first four (4) deliveries (childbirth or miscarriage) of his legitimate spouse with whom he is cohabiting.',
    legalBasis: 'Sections 2 & 3, Republic Act No. 8187 (Paternity Leave Act of 1996)',
  },
  {
    id: 144,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Mark’s legitimate wife suffered a miscarriage on their second pregnancy. Mark did not use 3 of his 7 Paternity Leave days and asks HR to convert those 3 days to cash. Rule on both entitlement and cash conversion:',
    options: [
      'Miscarriage is not covered by Paternity Leave.',
      'Miscarriage IS covered as a "delivery" under R.A. 8187, so Mark was entitled to 7 days; however, unused Paternity Leave is NON-cumulative and NON-convertible to cash.',
      'Mark can convert the 3 unused days to cash at year-end.',
      'Mark can carry the 3 days over to the fifth pregnancy.',
    ],
    correctIndex: 1,
    explanation:
      'Under R.A. 8187, "delivery" includes childbirth or miscarriage (up to the first 4). However, Sec. 7 of the IRR explicitly provides that Paternity Leave is non-cumulative and strictly non-convertible to cash.',
    legalBasis: 'Sections 3 & 5, Republic Act No. 8187 & IRR',
  },
  {
    id: 145,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Under R.A. 11861 (Expanded Solo Parents Welfare Act, amending R.A. 8972), what was the minimum service requirement to qualify for the 7-day paid Parental Leave reduced to?',
    options: [
      'Reduced from 2 years to 1 year.',
      'Reduced from 1 year to at least six (6) months of service (continuous or broken)!',
      'Reduced to 30 days of service.',
      'Increased to 3 years of service.',
    ],
    correctIndex: 1,
    explanation:
      'R.A. 11861 amended Sec. 8 of R.A. 8972 by reducing the service requirement for the 7-day forfeitable/non-cumulative paid Parental Leave from 1 year down to at least six (6) months of service, including Kasambahays!',
    legalBasis: 'Section 8, R.A. 8972 as amended by Republic Act No. 11861',
  },
  {
    id: 146,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Under R.A. 11861 (Expanded Solo Parents Welfare Act), up to what age is an unmarried, unemployed child/dependent covered for Solo Parent qualification?',
    options: [
      'Below 18 years old.',
      'Twenty-two (22) years old or below (or over 22 if unable to fully take care of or protect themselves due to physical/mental disability).',
      'Below 15 years old.',
      'Up to 25 years old.',
    ],
    correctIndex: 1,
    explanation:
      'R.A. 11861 expanded the age threshold of dependent children from below 18 to twenty-two (22) years old or below (provided unmarried and unemployed), or over 22 if with disability.',
    legalBasis: 'Section 3(a), R.A. 8972 as amended by R.A. 11861',
  },
  {
    id: 147,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'An OFW in Dubai belongs to the low/semi-skilled category and has been away from the Philippines continuously for 12 months. Can the spouse or guardian left solely caring for the OFW’s children in the Philippines qualify as a Solo Parent under R.A. 11861?',
    options: [
      'No, because the OFW sends remittances.',
      'Yes! R.A. 11861 explicitly includes the spouse or any family member of a low/semi-skilled OFW who is away from the Philippines for an uninterrupted period of 12 months.',
      'Only if the marriage is annulled.',
      'Only after 5 years abroad.',
    ],
    correctIndex: 1,
    explanation:
      'Section 4(a)(7) of R.A. 11861 expanded Solo Parent categories to include the spouse or family member solely left with parental care of children of low/semi-skilled OFWs away for an uninterrupted 12 months.',
    legalBasis: 'Section 4, Republic Act No. 11861',
  },
  {
    id: 148,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Under Section 18 of R.A. 9710 (Magna Carta of Women) and DOLE D.O. No. 112-11, what are the exact service requirement and maximum duration of the Special Leave Benefit for Women?',
    options: [
      '1 year continuous service; maximum of 30 days at half pay.',
      'At least six (6) months continuous aggregate employment service in the last 12 months; up to two (2) months (60 calendar days) leave with full pay following surgery caused by gynecological disorders.',
      '3 months service; 15 days convertible to cash.',
      '2 years service; 105 days with SSS reimbursement.',
    ],
    correctIndex: 1,
    explanation:
      'Under Sec. 18 of R.A. 9710, a female employee who has rendered continuous aggregate employment service of at least 6 months for the last 12 months is entitled to special leave of up to 2 months with full pay based on gross monthly compensation following surgery caused by gynecological disorders.',
    legalBasis: 'Section 18, R.A. 9710 (Magna Carta of Women); DOLE D.O. No. 112-11',
  },
  {
    id: 149,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Grace underwent non-surgical outpatient medication therapy for dysmenorrhea without any surgical procedure. She files for the 2-month Special Leave Benefit under R.A. 9710. Is she entitled?',
    options: [
      'Yes, any gynecological condition automatically grants 2 months paid leave.',
      'No. Surgical intervention for a certified gynecological disorder is an indispensable prerequisite for the R.A. 9710 Special Leave Benefit (though she may use company sick leave or SIL).',
      'Yes, for 1 month at 50% pay.',
      'Yes, if she has worked for 5 years.',
    ],
    correctIndex: 1,
    explanation:
      'Section 18 of R.A. 9710 and DOLE D.O. 112-11 strictly require that the female employee has undergone SURGERY caused by gynecological disorders, certified by a competent physician.',
    legalBasis: 'Section 18, R.A. 9710 & DOLE D.O. No. 112-11',
  },
  {
    id: 150,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'A pregnant employee suffers an ectopic pregnancy requiring surgical salpingectomy. Can she claim BOTH the 60-day paid Maternity Leave under R.A. 11210 AND the 2-month Special Gynecological Leave under R.A. 9710 for the exact same surgical event?',
    options: [
      'Yes, she gets 120 days double recovery pay.',
      'No. Under DOLE rules against double recovery for the same contingency, when a miscarriage/ectopic surgery is already compensated under R.A. 11210 Maternity Leave, she cannot claim R.A. 9710 on top for the same event (unless R.A. 9710 yields higher pay differential).',
      'She gets neither.',
      'Only if she works in government.',
    ],
    correctIndex: 1,
    explanation:
      'Under DOLE D.O. No. 112-11 (as harmonized with R.A. 11210), a woman who avails of maternity leave benefits for a pregnancy-related event cannot simultaneously double-claim the 2-month gynecological surgery leave for the identical contingency.',
    legalBasis: 'DOLE D.O. No. 112-11 & R.A. 11210 IRR',
  },
  {
    id: 151,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Under Section 43 of R.A. 9262 (Anti-VAWC Act), what document must a woman employee present to her employer to avail of the 10-day paid VAWC Leave, and is it extendable?',
    options: [
      'A final Supreme Court conviction; never extendable.',
      'A certification from the Barangay Punong Barangay/Kagawad, Prosecutor, or Clerk of Court that an action under R.A. 9262 is pending; extendable when necessity is specified in the Protection Order!',
      'A notarized letter from two neighbors; extendable up to 1 year with pay.',
      'An NBI clearance only.',
    ],
    correctIndex: 1,
    explanation:
      'Under Sec. 43 of R.A. 9262, the only documentary requirement is a certification from the Punong Barangay/Kagawad, Prosecutor, or Clerk of Court that an action is pending, and the 10-day paid leave is extendable as specified in the Protection Order.',
    legalBasis: 'Section 43, Republic Act No. 9262 (Anti-VAWC Act of 2004)',
  },
  {
    id: 152,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'An employer denies a victim-survivor’s valid 10-day VAWC Leave application despite her presenting a Barangay Protection Order certification. What liability attaches under Section 43 of R.A. 9262?',
    options: [
      'A polite reminder from HR.',
      'The employer/agency head who prejudices or denies the application shall be penalized for discrimination and violation of R.A. 9262!',
      'No penalty if the office is busy.',
      'Only civil damages after 10 years.',
    ],
    correctIndex: 1,
    explanation:
      'Section 43 of R.A. 9262 mandates that any employer who prejudices the right of the person under this section shall be penalized in accordance with the provisions of the Act and the Labor Code.',
    legalBasis: 'Section 43, Republic Act No. 9262',
  },
  {
    id: 153,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Which of the following statutory leaves under Philippine Labor Law IS commutable/convertible to cash if unused by the employee?',
    options: [
      'Paternity Leave (R.A. 8187) and VAWC Leave (R.A. 9262).',
      'Service Incentive Leave under Article 95 of the Labor Code (for covered regular employees)!',
      'Solo Parent Parental Leave (R.A. 11861) and Gynecological Surgery Leave (R.A. 9710).',
      'Kasambahay 5-Day SIL (R.A. 10361).',
    ],
    correctIndex: 1,
    explanation:
      'Among statutory leaves, ONLY the 5-day Service Incentive Leave under Art. 95 of the Labor Code is commutable to cash if unused. Paternity Leave, Solo Parent Leave, VAWC Leave, R.A. 9710 Gynecological Leave, and Kasambahay SIL are all non-cumulative and non-convertible to cash.',
    legalBasis: 'Art. 95, Labor Code; Omnibus Rules Book III, Rule V, Sec. 5',
  },
  {
    id: 154,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'What wage rate serves as the basis for computing the cash commutation of accumulated unused Service Incentive Leave (SIL) upon an employee’s retirement or separation?',
    options: [
      'The historic minimum wage on the year the employee was hired.',
      'The salary rate at the date of commutation (e.g., latest daily wage upon separation/retirement)!',
      '50% of the regional minimum wage.',
      'The average wage of all apprentices.',
    ],
    correctIndex: 1,
    explanation:
      'Under Book III, Rule V, Sec. 5 of the Omnibus Rules (and jurisprudence such as Auto Bus), the cash equivalent of unused SIL is computed based on the salary rate at the date of commutation.',
    legalBasis: 'Book III, Rule V, Sec. 5, Omnibus Rules Implementing the Labor Code',
  },
  {
    id: 155,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'A Solo Parent loses her Solo Parent status because her only child turned 23 years old, graduated, and became gainfully employed. What happens to her 7-day Solo Parent Leave moving forward?',
    options: [
      'It continues for life once granted.',
      'Termination of Solo Parent eligibility ends future entitlement to the 7-day Parental Leave under R.A. 8972 / R.A. 11861.',
      'It converts into 14 days of Vacation Leave.',
      'It transfers to her child’s employer.',
    ],
    correctIndex: 1,
    explanation:
      'Under R.A. 8972 as amended by R.A. 11861, a change in the status or circumstance of the parent claiming benefits such that they are no longer left alone with parental responsibility or the child exceeds the age/dependency threshold terminates eligibility for Solo Parent benefits.',
    legalBasis: 'Section 3 & Section 8, R.A. 8972 as amended by R.A. 11861',
  },
  // ================= EXPANDED BAR EXAM SCENARIOS ACROSS ALL WORLDS (IDs 201–245) =================
  {
    id: 201,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'In San Miguel Brewery, Inc. v. Democratic Labor Organization, route salesmen who sold beer outside the plant on fixed routes without field timekeeping demanded overtime pay. How did the Supreme Court rule?',
    options: [
      'Entitled to overtime because they wore uniforms.',
      'Exempt as "Field Personnel" under Art. 82 because they performed duties away from the principal place of business and their actual hours of work could not be determined with reasonable certainty.',
      'Entitled to double overtime.',
      'Exempt as domestic helpers.',
    ],
    correctIndex: 1,
    explanation:
      'In San Miguel Brewery, route salesmen whose actual hours in the field could not be determined with reasonable certainty were held to be exempt Field Personnel under Article 82.',
    legalBasis: 'Article 82, Labor Code; San Miguel Brewery v. Democratic Labor Organization',
  },
  {
    id: 202,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'Conversely, in Auto Bus Transport Systems, Inc. v. Bautista, provincial bus drivers-conductors paid on commission were dispatched at scheduled hours and monitored by inspectors at checkpoints along the route. Are they Field Personnel?',
    options: [
      'Yes, because buses travel outside the terminal.',
      'No! Because they were constantly supervised by dispatchers and route inspectors, their hours were determinable with reasonable certainty—making them REGULAR employees entitled to SIL/labor standards!',
      'Yes, because they earn commission.',
      'They are independent contractors.',
    ],
    correctIndex: 1,
    explanation:
      'Working outside the office does NOT automatically make one "field personnel"; where inspectors and dispatch schedules determine actual hours with reasonable certainty, the employee is covered by Title I.',
    legalBasis: 'Auto Bus Transport Systems, Inc. v. Bautista, G.R. No. 156367 (2005)',
  },
  {
    id: 203,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'Under Article 83 of the Labor Code, hospital resident nurses in a city with a population of 1.2 million work 5 days a week, 8 hours a day (40 hrs/week), and are required due to acute exigency to work on the 6th day for 8 hours. What compensation applies for the 6th day?',
    options: [
      'Regular straight-time pay only.',
      'Full pay for 40 hours + additional compensation of at least 30% over regular wage for work on the 6th day!',
      '10% premium only.',
      'Unpaid community service.',
    ],
    correctIndex: 1,
    explanation:
      'Article 83 mandates a normal 40-hour/5-day week (with full 48-hour pay equivalent) for health personnel in cities/municipalities with >=1M population or hospitals with >=100 bed capacity; exigency work on the 6th day requires at least +30% additional compensation.',
    legalBasis: 'Article 83, Labor Code of the Philippines',
  },
  {
    id: 204,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'In Rada v. NLRC, a project driver picked up employees along EDSA every morning in the company coasters and dropped them off every evening before returning the vehicle to the garage. Is that travel time compensable overtime?',
    options: [
      'No, home-to-work travel is never compensable.',
      'Yes! Collecting and transporting fellow workers in the company vehicle was an integral part of his principal job for the employer’s benefit, making the time fully compensable.',
      'Only 50% compensable.',
      'Only if traffic exceeds 3 hours.',
    ],
    correctIndex: 1,
    explanation:
      'While ordinary home-to-work travel is non-compensable, Rada’s pickup and drop-off runs were performed under employer direction and directly benefited operations, rendering them compensable hours worked.',
    legalBasis: 'Rada v. NLRC, G.R. No. 96078 (1992); Article 84, Labor Code',
  },
  {
    id: 205,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'A manufacturing plant shortens the 60-minute lunch break to 30 minutes so workers can go home 30 minutes earlier, with DOLE approval. Must those 30 minutes of meal break be paid?',
    options: [
      'No, any meal break of 20 minutes or more is unpaid.',
      'Meal breaks shortened to less than 60 minutes (down to not less than 20 minutes under valid exceptions) are COMPENSABLE working time; meal breaks below 20 minutes are mere rest periods that are ALWAYS compensable!',
      'Only 10 minutes are paid.',
      'Shortening meal breaks is a criminal felony.',
    ],
    correctIndex: 1,
    explanation:
      'Under Book III, Rule I, Sec. 7 of the Omnibus Rules, an employer may shorten meal time to not less than 20 minutes in specified situations (e.g., non-manual work, 16+ hour plants, prevent spoilage) PROVIDED the shortened meal period is credited as compensable working time.',
    legalBasis: 'Article 85, Labor Code; Book III, Rule I, Sec. 7, Omnibus Rules',
  },
  {
    id: 206,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'In National Shipyards and Steel Corp. (NASSCO) v. CIR, barge crewmen were required to stay aboard the vessel 24 hours a day on rotation, sleeping on board to respond immediately to towing orders. Were standby hours compensable?',
    options: [
      'No, sleeping hours can never be compensated.',
      'Yes, when employees are required to remain on the employer’s premises/vessel "engaged to wait" for immediate duty without freedom to leave for personal pursuits, waiting time is compensable (unless a valid sleeping-time agreement applies to uninterrupted sleep).',
      'Only 2 hours per night.',
      'Never for maritime crews.',
    ],
    correctIndex: 1,
    explanation:
      'Under Art. 84 and NASSCO / Arica doctrines, waiting time spent "engaged to wait" where employees cannot effectively use the time for their own purposes is working time.',
    legalBasis: 'Article 84, Labor Code; Arica v. NLRC / NASSCO v. CIR',
  },
  {
    id: 207,
    world: 'World 1: Hours of Work',
    worldCode: 'w1',
    scenario:
      'An employee works from 8:00 PM to 5:00 AM (with 1-hour unpaid meal break from 12:00 MN to 1:00 AM) on an ordinary working day. For how many hours is she entitled to the 10% Night Shift Differential (NSD)?',
    options: [
      '8 hours.',
      '6 hours (10:00 PM to 12:00 MN = 2 hrs, plus 1:00 AM to 5:00 AM = 4 hrs; the unpaid 12:00 MN–1:00 AM meal break is excluded).',
      '4 hours only.',
      '7 hours.',
    ],
    correctIndex: 1,
    explanation:
      'NSD under Art. 86 covers actual work performed between 10:00 PM and 6:00 AM. Here, 10PM–12MN (2 hrs) + 1AM–5AM (4 hrs) = 6 hours of NSD (excluding the 1-hour unpaid meal break).',
    legalBasis: 'Article 86, Labor Code of the Philippines',
  },
  {
    id: 208,
    world: 'World 2: Rest & 13th Month',
    worldCode: 'w2',
    scenario:
      'Under Article 91(b) of the Labor Code, when MUST an employer respect the employee’s preference as to their weekly rest day?',
    options: [
      'Whenever the employee wants Friday night off for leisure.',
      'When the employee’s preference is based on religious grounds (provided if it causes serious prejudice/obstruction to operations, the employer may schedule the religious rest day at least two [2] days in a month).',
      'Only if the employee is a manager.',
      'Never; employer prerogative is absolute.',
    ],
    correctIndex: 1,
    explanation:
      'Art. 91(b) & Omnibus Rules Book III, Rule III, Sec. 4 require employers to respect rest day preferences based on religious grounds; if serious prejudice results, the chosen religious rest day must still be granted at least 2 days per month.',
    legalBasis: 'Article 91(b), Labor Code; Book III, Rule III, Sec. 4, Omnibus Rules',
  },
  {
    id: 209,
    world: 'World 2: Rest & 13th Month',
    worldCode: 'w2',
    scenario:
      'An employee has NO regular fixed workdays or scheduled rest days (e.g., rotating irregular days). If required to work on a Sunday or holiday, what statutory premium applies under Art. 93(b)?',
    options: [
      'No premium at all.',
      'At least an additional 30% of regular wage for work performed on Sundays and holidays!',
      'At least 50% premium.',
      '10% premium.',
    ],
    correctIndex: 1,
    explanation:
      'Under Article 93(b) of the Labor Code, where the nature of the work is such that the employee has no regular workdays and no scheduled rest days, he shall be paid an additional compensation of at least 30% of his regular wage for work performed on Sundays and holidays.',
    legalBasis: 'Article 93(b), Labor Code of the Philippines',
  },
  {
    id: 210,
    world: 'World 2: Rest & 13th Month',
    worldCode: 'w2',
    scenario:
      'In Asian Transmission Corp. v. Court of Appeals, April 9 happened to be BOTH Araw ng Kagitingan and Maundy Thursday (a Double Regular Holiday). The employee did NOT report for work. How much holiday pay must the employer pay?',
    options: [
      '100% of daily wage because it is only one calendar day.',
      '200% of daily wage (100% for each of the two Regular Holidays), even if unworked!',
      '300% of daily wage even if unworked.',
      '0% under No Work, No Pay.',
    ],
    correctIndex: 1,
    explanation:
      'In Asian Transmission Corp. v. CA, the Supreme Court held that since Art. 94 guarantees holiday pay for every regular holiday, two regular holidays falling on the same date entitle an unworked covered employee to 200% basic pay (and 300% if worked).',
    legalBasis: 'Asian Transmission Corp. v. CA, G.R. No. 144664 (2004)',
  },
  {
    id: 211,
    world: 'World 2: Rest & 13th Month',
    worldCode: 'w2',
    scenario:
      'In Jose Rizal College v. NLRC, private school faculty paid per lecture hour ("collegiate faculty paid by the hour") claimed holiday pay for unworked regular holidays, whereas monthly-paid elementary teachers also claimed. Distinguish the SC ruling:',
    options: [
      'Neither gets holiday pay.',
      'Hourly-paid faculty are entitled to Regular Holiday Pay when regular holidays cancel their scheduled teaching days (preventing them from earning), whereas Special Non-Working days/semestral breaks follow specific rules!',
      'Only Deans get holiday pay.',
      'Schools are exempt from Art. 94.',
    ],
    correctIndex: 1,
    explanation:
      'In Jose Rizal College v. NLRC, hourly-paid faculty deprived of expected lecture income due to a Regular Holiday are entitled to regular holiday pay, while unworked Special Holidays during semestral breaks follow "no work, no pay."',
    legalBasis: 'Jose Rizal College v. NLRC, G.R. No. 65482 (1987)',
  },
  {
    id: 212,
    world: 'World 2: Rest & 13th Month',
    worldCode: 'w2',
    scenario:
      'Under R.A. 11360 (Service Charge Law) and DOLE D.O. No. 206-19, how frequently must distributed service charges be paid out to covered hotel/restaurant employees?',
    options: [
      'Once a year on December 24.',
      'Completely and equally distributed based on actual hours/days of work rendered, paid not less than once every two (2) weeks or twice a month at intervals not exceeding sixteen (16) days!',
      'Every quarter.',
      'Upon retirement only.',
    ],
    correctIndex: 1,
    explanation:
      'DOLE D.O. No. 206-19 implementing R.A. 11360 requires 100% equal distribution to covered non-managerial employees paid at least once every 2 weeks or twice a month at intervals not exceeding 16 days.',
    legalBasis: 'Article 96 as amended by R.A. 11360; DOLE D.O. No. 206-19',
  },
  {
    id: 213,
    world: 'World 2: Rest & 13th Month',
    worldCode: 'w2',
    scenario:
      'A rank-and-file employee worked from January 1 to February 15 (1.5 months) with a monthly basic salary of ₱24,000, then resigned voluntarily. Is she entitled to proportionate 13th Month Pay under P.D. 851?',
    options: [
      'No, because she resigned before December.',
      'Yes! Having worked at least 1 month during the calendar year, a resigned or separated employee is entitled to proportionate 13th Month Pay (= ₱36,000 total basic salary earned ÷ 12 = ₱3,000).',
      'Only if she was illegally dismissed.',
      'Only 50% of proportionate pay.',
    ],
    correctIndex: 1,
    explanation:
      'Under Revised Guidelines on P.D. 851, an employee who has resigned or whose services were terminated at any time before the time of payment of the 13th month pay is entitled to monetary benefit in proportion to the length of time worked during the year (provided >= 1 month).',
    legalBasis: 'Presidential Decree No. 851 & Revised Implementing Guidelines',
  },
  {
    id: 214,
    world: 'World 2: Rest & 13th Month',
    worldCode: 'w2',
    scenario:
      'In Philippine Duplicators, Inc. v. NLRC vs. Boie-Takeda Chemicals v. De la Serna, distinguish when sales commissions ARE included vs. EXCLUDED in computing 13th Month Pay:',
    options: [
      'All commissions are always included.',
      'Direct "wage-type" commissions integrated as part of fixed/guaranteed basic pay tied directly to actual sales units sold (Philippine Duplicators) ARE included; productivity/profit-sharing bonuses or overriding commissions not part of basic salary (Boie-Takeda) are EXCLUDED.',
      'All commissions are always excluded.',
      'Only cash prizes are included.',
    ],
    correctIndex: 1,
    explanation:
      'Commissions that are direct remunerations for actual sales transactions forming an integral part of basic salary (Philippine Duplicators) enter 13th month pay; productivity bonuses/overriding commissions unrelated to basic pay (Boie-Takeda) do not.',
    legalBasis: 'Philippine Duplicators v. NLRC, G.R. No. 110068 (1995)',
  },
  {
    id: 215,
    world: 'Holidays Hub',
    worldCode: 'holidays',
    scenario:
      'An employee works 10 hours (8 regular + 2 overtime) on a Regular Holiday that ALSO falls on his scheduled Rest Day. His daily wage is ₱800 (₱100/hr). Compute his total pay for that day!',
    options: [
      '₱2,080.00',
      '₱2,756.00 (First 8 hrs = ₱800 × 260% = ₱2,080; 2 OT hrs = ₱100 × 260% × 130% × 2 = ₱676; Total = ₱2,756.00)!',
      '₱2,400.00',
      '₱3,120.00',
    ],
    correctIndex: 1,
    explanation:
      'Regular Holiday on Rest Day = 260% for first 8 hours (₱800 × 2.60 = ₱2,080). Overtime hourly rate = Hourly Basic × 2.60 × 1.30 = ₱338/hr × 2 hrs = ₱676. Total = ₱2,756.00.',
    legalBasis: 'Article 87, 93 & 94, Labor Code; DOLE Handbook on Workers’ Statutory Monetary Benefits',
  },
  {
    id: 216,
    world: 'Holidays Hub',
    worldCode: 'holidays',
    scenario:
      'Maundy Thursday and Good Friday are successive Regular Holidays. Employee Juan was ABSENT WITHOUT PAY on Holy Wednesday (the workday immediately preceding Maundy Thursday), did not work Thursday, and WORKED on Good Friday. What is his holiday pay?',
    options: [
      'He forfeits both Thursday and Friday.',
      'He forfeits Maundy Thursday unworked pay, BUT because he WORKED on Good Friday, he receives 200% for working Good Friday!',
      'He gets 100% for both.',
      'He gets 300% for Good Friday.',
    ],
    correctIndex: 1,
    explanation:
      'Under Book III, Rule IV, Sec. 10 of the Omnibus Rules, being absent without pay on Wednesday disqualifies Juan from unworked holiday pay on both Thursday and Friday UNLESS he works on Thursday (entitling him to Friday) or works on Friday itself (entitling him to 200% worked holiday pay for Friday).',
    legalBasis: 'Book III, Rule IV, Section 10, Omnibus Rules Implementing the Labor Code',
  },
  {
    id: 217,
    world: 'Holidays Hub',
    worldCode: 'holidays',
    scenario:
      'How is a Special (Non-Working) Day compensated when UNWORKED versus WORKED for 8 hours on a regular workday (assuming no more favorable CBA)?',
    options: [
      'Unworked = 100%; Worked = 200%.',
      'Unworked = 0% ("No Work, No Pay"); Worked = 130% of basic wage for the first 8 hours (150% if it also falls on a Rest Day)!',
      'Unworked = 50%; Worked = 150%.',
      'Unworked = 0%; Worked = 100%.',
    ],
    correctIndex: 1,
    explanation:
      'On Special (Non-Working) Days, the "No Work, No Pay" principle applies unless a favorable company practice/CBA exists; if worked, the employee earns +30% (130%), or +50% (150%) if falling on their Rest Day.',
    legalBasis: 'Article 93(c), Labor Code; DOLE Statutory Benefits Handbook',
  },
  {
    id: 218,
    world: 'Holidays Hub',
    worldCode: 'holidays',
    scenario:
      'Which of the following is classified as a NATIONWIDE REGULAR HOLIDAY under Executive Order No. 292 as amended by R.A. 9492 / R.A. 9849?',
    options: [
      'Ninoy Aquino Day (August 21) and All Saints’ Day (November 1).',
      'National Heroes Day (Last Monday of August), Eid’l Fitr, and Eid’l Adha!',
      'Feast of the Immaculate Conception (December 8).',
      'December 31 (Last Day of the Year).',
    ],
    correctIndex: 1,
    explanation:
      'National Heroes Day, Eid’l Fitr (R.A. 9177), and Eid’l Adha (R.A. 9849) are Regular Holidays (200% if worked), whereas Aug 21, Nov 1, Dec 8 (R.A. 10966), and Dec 31 are Special Non-Working Days.',
    legalBasis: 'E.O. 292 as amended by R.A. 9492, R.A. 9177 & R.A. 9849',
  },
  {
    id: 219,
    world: 'Holidays Hub',
    worldCode: 'holidays',
    scenario:
      'Under DOLE rules on Muslim Holidays under P.D. 1083 (outside Eid’l Fitr and Eid’l Adha which are nationwide), where are regional Muslim holidays like Amun Jadid and Maulid un-Nabi observed as legal holidays, and who is entitled there?',
    options: [
      'Only Muslims in Metro Manila.',
      'In BARMM and designated provinces/cities under P.D. 1083, BOTH Muslim and Christian/non-Muslim employees working within those areas are entitled to holiday pay; outside those provinces, Muslim employees are excused from work WITH pay!',
      'Unpaid across the entire country.',
      'Only government workers.',
    ],
    correctIndex: 1,
    explanation:
      'Under SMC v. Court of Appeals (G.R. No. 146775), within designated Muslim holiday provinces, both Muslim and non-Muslim employees enjoy the holiday; outside those areas, Muslim workers are excused without diminution of salary.',
    legalBasis: 'P.D. 1083 & San Miguel Corporation v. CA, G.R. No. 146775 (2002)',
  },
  {
    id: 220,
    world: 'World 3: Wages & D.O. 174',
    worldCode: 'w3',
    scenario:
      'In Gaa v. Court of Appeals (interpreting Article 1708 of the Civil Code), a building administrator earning a high monthly managerial compensation had his compensation garnished for a personal debt. Was his pay exempt as "laborer’s wages"?',
    options: [
      'Yes, all pay of any employee is 100% exempt from execution.',
      'No! Art. 1708 exempts "wages" (compensation for manual/skilled rank-and-file labor up to the survival amount), NOT "salary" paid to higher-tier managerial/supervisory officers (except to the extent necessary for family support under Rules of Court).',
      'Yes, up to ₱1,000,000.',
      'Garnishment is illegal in the Philippines.',
    ],
    correctIndex: 1,
    explanation:
      'In Gaa v. CA, the Supreme Court distinguished "wages" (paid for manual/mechanical rank-and-file labor, protected from execution under Art. 1708 Civil Code) from "salary" (paid to white-collar/managerial officers, which is not covered by Art. 1708).',
    legalBasis: 'Article 1708, Civil Code; Gaa v. Court of Appeals, G.R. No. L-44169 (1985)',
  },
  {
    id: 221,
    world: 'World 3: Wages & D.O. 174',
    worldCode: 'w3',
    scenario:
      'In Mabeza v. NLRC, a hotel deducted the cost of meals and lodging provided to hotel staff who were required to stay near the premises for shift responsiveness, without any written authorization from the employee. Was the deduction valid?',
    options: [
      'Yes, food and lodging are always facilities.',
      'No! To deduct the value of "facilities" from wages, three strict requisites must concur: (1) proof that such facilities are customarily furnished in the trade, (2) voluntary written acceptance by the employee, and (3) fair and reasonable value!',
      'Yes, up to 70% of minimum wage.',
      'Valid even if verbal.',
    ],
    correctIndex: 1,
    explanation:
      'Under Mabeza v. NLRC and Our Haus Realty v. Parian, failure to prove customary trade practice, voluntary written authorization by the employee, and DOLE fair valuation bars deducting board/lodging as facilities.',
    legalBasis: 'Mabeza v. NLRC, G.R. No. 118506 (1997); Our Haus Realty v. Parian (2014)',
  },
  {
    id: 222,
    world: 'World 3: Wages & D.O. 174',
    worldCode: 'w3',
    scenario:
      'Under Article 100 of the Labor Code (Non-Diminution of Benefits), when does an unscripted employer bonus ripen into a legally demandable benefit that CANNOT be unilaterally withdrawn?',
    options: [
      'After being given once during a profitable Christmas party.',
      'When proved to have been given consistently, deliberately, and unconditionally over a long period of time, without being contingent on fluctuating profits or error in legal construction!',
      'Whenever mentioned in an informal email.',
      'Never; bonuses are always revocable.',
    ],
    correctIndex: 1,
    explanation:
      'Under Art. 100 jurisprudence (e.g.,Vergara v. Coca-Cola; Globe Mackay), non-diminution applies when the grant is practiced over a long period, shown to be consistent and deliberate, and not due to an error in the construction of a doubtful question of law.',
    legalBasis: 'Article 100, Labor Code of the Philippines',
  },
  {
    id: 223,
    world: 'World 3: Wages & D.O. 174',
    worldCode: 'w3',
    scenario:
      'Under DOLE Department Order No. 174-17, what is the minimum substantial capital required of a corporation, partnership, or cooperative to qualify as a legitimate job contractor?',
    options: [
      '₱1,000,000 paid-up capital.',
      'At least ₱5,000,000.00 in paid-up capital stocks/shares (or at least ₱5,000,000.00 net worth in the case of a single proprietorship)!',
      '₱3,000,000 authorized capital.',
      '₱500,000 cash bond.',
    ],
    correctIndex: 1,
    explanation:
      'Section 3(l) of DOLE D.O. No. 174-17 raised "substantial capital" to paid-up capital stock/shares of at least Five Million Pesos (₱5,000,000.00) for corporations/partnerships/cooperatives, and net worth of at least ₱5,000,000.00 for single proprietorships.',
    legalBasis: 'Section 3(l), DOLE Department Order No. 174, Series of 2017',
  },
  {
    id: 224,
    world: 'World 3: Wages & D.O. 174',
    worldCode: 'w3',
    scenario:
      'Compare the principal’s liability in LEGITIMATE Job Contracting (Art. 106/109) versus prohibited LABOR-ONLY Contracting:',
    options: [
      'The principal has zero liability in legitimate job contracting.',
      'In Legitimate Job Contracting, the principal is SOLIDARILY liable with the contractor ONLY to the extent of unpaid wages/monetary claims for work performed under the contract; in Labor-Only Contracting, the principal is deemed the DIRECT EMPLOYER for ALL purposes (including regularization and illegal dismissal)!',
      'Both have identical liability.',
      'The contractor goes to prison for 20 years.',
    ],
    correctIndex: 1,
    explanation:
      'Under Arts. 106–109 and D.O. 174-17, legitimate contracting creates limited solidary liability for unpaid wages, whereas labor-only contracting pierces the arrangement and makes the principal the direct employer for all labor relations & standards purposes.',
    legalBasis: 'Articles 106–109, Labor Code; DOLE D.O. No. 174-17',
  },
  {
    id: 225,
    world: 'World 3: Wages & D.O. 174',
    worldCode: 'w3',
    scenario:
      'Under Article 110 of the Labor Code (Worker Preference in Case of Bankruptcy), workers enjoy "first preference" as regards unpaid wages and monetary claims. How does this operate under Republic v. Peralta?',
    options: [
      'Workers can seize mortgaged bank buildings without any court proceeding.',
      'Article 110 requires an insolvency/liquidation proceeding (like FRIA R.A. 10142) and grants first preference over UNENCUMBERED assets/ordinary credits (still respecting taxes due the State and specific mortgage liens on specific property).',
      'Workers rank last behind common stockholders.',
      'It applies even to solvent companies.',
    ],
    correctIndex: 1,
    explanation:
      'Under Art. 110 and DBP v. NLRC / Republic v. Peralta, worker preference is invoked in bankruptcy/liquidation proceedings, elevating unpaid wages to first preference among ordinary credits after taxes and special preferred liens over specific encumbered property.',
    legalBasis: 'Article 110, Labor Code; DBP v. NLRC & R.A. 10142 (FRIA)',
  },
  {
    id: 226,
    world: 'World 3: Wages & D.O. 174',
    worldCode: 'w3',
    scenario:
      'Under Article 124 of the Labor Code (as amended by R.A. 6727), if a Regional Wage Order creates a "Wage Distortion" in an UNORGANIZED establishment (no union/CBA), what is the statutory dispute resolution path?',
    options: [
      'Immediate strike.',
      'Employer and workers endeavor to correct it; any dispute goes to the NCMB for conciliation within 10 calendar days, and if unresolved, to the NLRC (Labor Arbiter) for compulsory arbitration within 10 days!',
      'Directly to the Supreme Court.',
      'Wage distortion does not apply to unorganized firms.',
    ],
    correctIndex: 1,
    explanation:
      'In unorganized establishments, Art. 124 routes unresolved wage distortion disputes to NCMB conciliation (10 days) and then NLRC compulsory arbitration; in organized firms, it goes through the CBA grievance machinery and Voluntary Arbitration.',
    legalBasis: 'Article 124, Labor Code (as amended by R.A. 6727)',
  },
  {
    id: 227,
    world: 'World 3: Wages & D.O. 174',
    worldCode: 'w3',
    scenario:
      'Under Article 113 & DOLE Labor Advisory No. 11-14, when may a private employer deduct from an employee’s wages for loss or breakage of tools/equipment?',
    options: [
      'Automatically 50% of salary on payday.',
      'Only when: (1) employee is clearly shown to be responsible, (2) employee is given ample opportunity to be heard (due process), (3) deduction is fair and reasonable, AND (4) deduction does NOT exceed 20% of the employee’s wages in a week!',
      'Never under any circumstance.',
      'Whenever the supervisor signs a memo.',
    ],
    correctIndex: 1,
    explanation:
      'Book III, Rule VIII, Sec. 14 and DOLE LA 11-14 strictly require proof of fault, due process hearing, fair actual loss cap, and a weekly deduction ceiling of 20% of the employee’s weekly wage.',
    legalBasis: 'Article 113–114, Labor Code; DOLE Labor Advisory No. 11-14',
  },
  {
    id: 228,
    world: 'World 3: Wages & D.O. 174',
    worldCode: 'w3',
    scenario:
      'Under Article 102 of the Labor Code, an employer wants to pay factory workers via weekly supermarket grocery vouchers worth 110% of minimum wage. Is this legal?',
    options: [
      'Yes, because 110% is higher than 100% cash.',
      'No! No employer shall pay wages by means of promissory notes, vouchers, coupons, tokens, tickets, chits, or any object other than legal tender, EVEN WHEN EXPRESSLY REQUESTED BY THE EMPLOYEE (penalized under Art. 288 / RPC)!',
      'Yes, if 80% of workers agree.',
      'Yes, outside Metro Manila.',
    ],
    correctIndex: 1,
    explanation:
      'Article 102 strictly mandates payment of wages in Philippine legal tender (or compliant bank/ATM payroll under DOLE rules) and prohibits chits, coupons, or vouchers even if requested by the employee.',
    legalBasis: 'Article 102, Labor Code of the Philippines',
  },
  {
    id: 229,
    world: 'World 3: Wages & D.O. 174',
    worldCode: 'w3',
    scenario:
      'Under R.A. 9178 (Barangay Micro Business Enterprises / BMBE Act), a duly registered BMBE with total assets of ₱2.5 Million (excluding land) claims exemption from the Minimum Wage Law. Are its workers still covered by SSS, PhilHealth, Pag-IBIG, OT, and Holiday Pay?',
    options: [
      'No, BMBEs are exempt from the entire Labor Code.',
      'Yes! Registered BMBEs are exempt ONLY from coverage of the Minimum Wage Law, while their employees remain entitled to the same social security, healthcare, holiday, overtime, and labor standards benefits!',
      'BMBEs have a ₱50 Million asset cap.',
      'Only family members work in BMBEs.',
    ],
    correctIndex: 1,
    explanation:
      'Section 8 of R.A. 9178 exempts registered BMBEs (assets <= ₱3M excluding land) from the Minimum Wage Law, but explicitly preserves SSS, PhilHealth, and other Labor Code benefits.',
    legalBasis: 'Section 8, Republic Act No. 9178 (BMBE Act of 2002)',
  },
  {
    id: 230,
    world: 'World 4: Special Groups',
    worldCode: 'w4',
    scenario:
      'In Star Paper Corp. v. Simbol, a company enforced a strict policy requiring that if two co-employees marry each other, one of them MUST resign. No bona fide occupational qualification (BFOQ) was proven. Is the policy valid?',
    options: [
      'Yes, under absolute management prerogative.',
      'No! Unless the employer proves a Reasonable Business Necessity / BFOQ, a no-spouse employment rule forcing resignation upon marriage violates Article 136 [134] of the Labor Code!',
      'Yes, if both are rank-and-file.',
      'Only valid for male employees.',
    ],
    correctIndex: 1,
    explanation:
      'In Star Paper v. Simbol (and PT&T v. NLRC), policies penalizing marriage are struck down under Art. 136 [134] unless the employer satisfies the strict BFOQ / Reasonable Business Necessity test.',
    legalBasis: 'Article 136 [134], Labor Code; Star Paper Corp. v. Simbol (2006)',
  },
  {
    id: 231,
    world: 'World 4: Special Groups',
    worldCode: 'w4',
    scenario:
      'Compare Duncan Association v. Glaxo Wellcome with Star Paper v. Simbol: Why was Glaxo’s policy against employees marrying employees of a DIRECT COMPETITOR pharmaceutical firm upheld?',
    options: [
      'Because Glaxo is a multinational corporation.',
      'Because preventing disclosure of confidential trade secrets/R&D to a direct competitor satisfied the Reasonable Business Necessity / BFOQ exception, unlike a blanket ban on marrying non-competing co-workers!',
      'Because Article 136 was repealed.',
      'Because pharmaceutical reps are independent contractors.',
    ],
    correctIndex: 1,
    explanation:
      'In Duncan v. Glaxo Wellcome, protecting trade secrets and preventing conflicts of interest with a direct competitor constituted a legitimate business necessity, distinguishing it from blanket anti-marriage rules.',
    legalBasis: 'Duncan Association v. Glaxo Wellcome, G.R. No. 162994 (2004)',
  },
  {
    id: 232,
    world: 'World 4: Special Groups',
    worldCode: 'w4',
    scenario:
      'Under R.A. 9231 (Special Protection of Children Against Child Abuse, Exploitation and Discrimination), what are the MAXIMUM daily and weekly working hours for a child BELOW 15 years old working under a valid DOLE permit (e.g., family enterprise or entertainment)?',
    options: [
      '8 hours a day, 40 hours a week.',
      'Not more than 4 hours in any given day and not more than 20 hours a week; NO work is allowed between 8:00 PM and 6:00 AM of the following day!',
      '6 hours a day, 36 hours a week.',
      '2 hours a day, 10 hours a week.',
    ],
    correctIndex: 1,
    explanation:
      'Section 3 of R.A. 9231 caps children below 15 years old at <=4 hours/day and <=20 hours/week, prohibiting work from 8:00 PM to 6:00 AM (whereas children 15 to below 18 are capped at <=8 hours/day, <=40 hours/week, no work 10:00 PM to 6:00 AM).',
    legalBasis: 'Section 3, Republic Act No. 9231 (Amending R.A. 7610)',
  },
  {
    id: 233,
    world: 'World 4: Special Groups',
    worldCode: 'w4',
    scenario:
      'Under R.A. 9231, how may a working child’s wages be used by the parents or legal guardian?',
    options: [
      'Parents own 100% of a minor child’s income under parental authority.',
      'The child’s wages belong to the child: at least 30% must be set aside in a trust fund for education/future, and at most 20% may be used for the collective needs of the family!',
      '50% goes to the talent manager.',
      '100% goes to family rent.',
    ],
    correctIndex: 1,
    explanation:
      'Section 12-B of R.A. 9231 protects the working child’s income: not more than 20% may be used for collective family needs, and at least 30% must be deposited in a trust fund to be released upon reaching majority.',
    legalBasis: 'Section 12-B, Republic Act No. 9231',
  },
  {
    id: 234,
    world: 'World 4: Special Groups',
    worldCode: 'w4',
    scenario:
      'Under R.A. 10361 (Batas Kasambahay), what are a Kasambahay’s minimum daily aggregate rest hours and weekly rest hours?',
    options: [
      '6 hours daily rest; 12 hours weekly rest.',
      'At least eight (8) hours aggregate daily rest per day, AND at least twenty-four (24) consecutive hours of rest in a week!',
      '10 hours daily rest; 48 hours weekly rest.',
      'No statutory rest hours for live-in workers.',
    ],
    correctIndex: 1,
    explanation:
      'Sections 20 and 21 of R.A. 10361 guarantee every Kasambahay an aggregate daily rest period of eight (8) hours per day and at least twenty-four (24) consecutive hours of rest in a week.',
    legalBasis: 'Sections 20 & 21, Republic Act No. 10361 (Batas Kasambahay)',
  },
  {
    id: 235,
    world: 'World 4: Special Groups',
    worldCode: 'w4',
    scenario:
      'A homeowner hires a family driver who exclusively drives the family children to school and the parents to church. Is this family driver covered by R.A. 10361 (Batas Kasambahay)?',
    options: [
      'Yes, all household staff are Kasambahays.',
      'No! Section 4(d) & Sec. 44 of R.A. 10361 explicitly EXCLUDE family drivers, children under foster family arrangement, and persons performing domestic work only occasionally/sporadically from Batas Kasambahay coverage (family drivers are governed by the Civil Code)!',
      'Yes, after 6 months.',
      'Covered by D.O. 174-17.',
    ],
    correctIndex: 1,
    explanation:
      'R.A. 10361 repealed the Labor Code provisions on househelpers while expressly excluding family drivers, foster children, and sporadic/occasional domestic workers from R.A. 10361 coverage.',
    legalBasis: 'Section 4(d) & Section 44, Republic Act No. 10361',
  },
  {
    id: 236,
    world: 'World 4: Special Groups',
    worldCode: 'w4',
    scenario:
      'Under R.A. 10361, a Kasambahay earns ₱4,500/month in a chartered city outside NCR. Who pays the employee’s share of SSS, PhilHealth, and Pag-IBIG monthly contributions?',
    options: [
      'Split 50-50 between employer and Kasambahay.',
      'The employer shoulders 100% of the premium payments without deducting anything from the Kasambahay’s wage (proportionate sharing applies ONLY if monthly wage is ₱5,000.00 or above)!',
      'Kasambahays below ₱5,000 are exempt from SSS.',
      'Barangay Hall pays it.',
    ],
    correctIndex: 1,
    explanation:
      'Section 30 of R.A. 10361 mandates that if the Kasambahay receives a wage of less than ₱5,000.00/month, the employer shall pay the entire SSS, PhilHealth, and Pag-IBIG premiums.',
    legalBasis: 'Section 30, Republic Act No. 10361 (Batas Kasambahay)',
  },
  {
    id: 237,
    world: 'World 4: Special Groups',
    worldCode: 'w4',
    scenario:
      'Under R.A. 10151 (Night Workers Act, repealing the old blanket night-work ban on women), who qualifies as a "Night Worker" entitled to free health assessment and transfer rights?',
    options: [
      'Anyone who works past 7:00 PM once a month.',
      'Any employed person whose work requires performance of a substantial number of hours of night work exceeding a specified limit (at least seven [7] consecutive hours including the interval from midnight to 5:00 AM)!',
      'Only call center managers.',
      'Only security guards.',
    ],
    correctIndex: 1,
    explanation:
      'Article 154 (inserted by R.A. 10151) and DOLE D.O. 119-12 define night work as a period of not less than 7 consecutive hours, including the interval from midnight (12:00 AM) to 5:00 AM.',
    legalBasis: 'Article 154, Labor Code (as inserted by R.A. 10151); DOLE D.O. No. 119-12',
  },
  {
    id: 238,
    world: 'World 5: Protective Laws',
    worldCode: 'w5',
    scenario:
      'Under R.A. 10028 (Expanded Breastfeeding Promotion Act), how are nursing employees’ lactation periods treated for wage and hours-worked purposes?',
    options: [
      'Unpaid personal breaks deducted from daily pay.',
      'PAID Compensable Break Intervals of NOT LESS THAN 40 minutes for every 8-hour working period, IN ADDITION TO the regular time-off for meals!',
      '20 minutes unpaid per week.',
      'Replaces the 1-hour lunch break.',
    ],
    correctIndex: 1,
    explanation:
      'Section 12 of R.A. 10028 mandates compensable lactation intervals of not less than 40 minutes per 8-hour shift, over and above regular meal breaks, without any wage deduction.',
    legalBasis: 'Section 12, Republic Act No. 10028 (Expanded Breastfeeding Promotion Act)',
  },
  {
    id: 239,
    world: 'World 5: Protective Laws',
    worldCode: 'w5',
    scenario:
      'Compare R.A. 7877 (Anti-Sexual Harassment Act of 1995) with R.A. 11313 (Safe Spaces Act / Bawal Bastos Law) regarding who can commit workplace gender-based sexual harassment:',
    options: [
      'Both require moral ascendancy or authority over the victim.',
      'R.A. 7877 requires authority, influence, or moral ascendancy; R.A. 11313 (Safe Spaces Act) ALSO penalizes workplace harassment committed between PEERS and EVEN BY A SUBORDINATE against a superior (including online)!',
      'Neither applies to remote/online chats.',
      'Only R.A. 7877 covers private offices.',
    ],
    correctIndex: 1,
    explanation:
      'Section 16 of R.A. 11313 closed the moral-ascendancy gap of R.A. 7877 by explicitly penalizing gender-based workplace harassment committed between peers and by a subordinate to a superior, whether physical or online.',
    legalBasis: 'Section 3, R.A. 7877 vs. Section 16, Republic Act No. 11313 (Safe Spaces Act)',
  },
  {
    id: 240,
    world: 'World 5: Protective Laws',
    worldCode: 'w5',
    scenario:
      'Under both R.A. 7877 and R.A. 11313, when is the EMPLOYER or head of office SOLIDARILY LIABLE for damages arising from acts of workplace sexual harassment?',
    options: [
      'Never; harassment is purely personal to the offender.',
      'When the employer/head of office is informed of such acts by the offended party and NO immediate action is taken thereon (or fails to establish the mandatory CODI / preventive policies)!',
      'Always, even before being informed and after swift dismissal of the culprit.',
      'Only if the company has >500 employees.',
    ],
    correctIndex: 1,
    explanation:
      'Under Sec. 5 of R.A. 7877 and Sec. 19 of R.A. 11313, the employer or head of office becomes solidarily liable for damages if informed of the harassment and no immediate action is taken.',
    legalBasis: 'Section 5, R.A. 7877 & Section 19, R.A. 11313',
  },
  {
    id: 241,
    world: 'World 5: Protective Laws',
    worldCode: 'w5',
    scenario:
      'Under R.A. 10917 (amending R.A. 9547 / R.A. 7323 on SPES — Special Program for Employment of Students), what is the age bracket of eligible poor/deserving students and how is their salary split?',
    options: [
      '12 to 21 years old; 50% employer / 50% school.',
      '15 to 30 years of age; the private employer pays 60% in cash (not below applicable minimum wage) and DOLE pays the remaining 40% in cash/education financial assistance!',
      '18 to 25 years old; 80% employer / 20% LGU.',
      'Unpaid internship.',
    ],
    correctIndex: 1,
    explanation:
      'R.A. 10917 expanded SPES eligibility to 15 to 30 years old, with a 60% Employer / 40% DOLE salary share (low-income LGUs may have DOLE shoulder up to 75%).',
    legalBasis: 'Republic Act No. 10917 (Amending R.A. 9547 & R.A. 7323 — SPES Law)',
  },
  {
    id: 242,
    world: 'World 5: Protective Laws',
    worldCode: 'w5',
    scenario:
      'Under R.A. 10911 (Anti-Age Discrimination in Employment Act), an employer publishes a job ad stating "Accounting Clerk Wanted: Must be 21–26 years old, fresh face." Is this lawful?',
    options: [
      'Yes, employers have unlimited hiring freedom.',
      'No! Section 5 of R.A. 10911 prohibits printing or publishing job notices suggesting preferences, limitations, or specifications based on age, unless a valid BFOQ or seniority system exception applies!',
      'Yes, for entry-level jobs.',
      'Only unlawful in government.',
    ],
    correctIndex: 1,
    explanation:
      'R.A. 10911 prohibits age limitations in job ads, hiring, compensation, training, promotion, or forced early retirement unless age is a bona fide occupational qualification (BFOQ) reasonably necessary to normal business operations.',
    legalBasis: 'Sections 5 & 6, Republic Act No. 10911 (Anti-Age Discrimination in Employment Act)',
  },
  {
    id: 243,
    world: 'World 5: Protective Laws',
    worldCode: 'w5',
    scenario:
      'Under R.A. 11058 (Occupational Safety and Health Standards Law), can a worker refuse to enter an unshored trench that poses an imminent danger of cave-in without suffering dismissal or wage loss?',
    options: [
      'No, refusal is willful disobedience.',
      'Yes! Section 6 guarantees the Worker’s Right to Refuse Unsafe Work without threat or reprisal where an imminent danger situation exists until DOLE/safety officer verifies correction!',
      'Only if 100% of the union votes first.',
      'Yes, but without pay for a month.',
    ],
    correctIndex: 1,
    explanation:
      'Section 6 of R.A. 11058 enshrines the worker’s right of refusal to work without threat or reprisal from the employer if an imminent danger situation exists that may result in illness, injury, or death.',
    legalBasis: 'Section 6, Republic Act No. 11058 (OSH Law)',
  },
  {
    id: 244,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Under R.A. 11210, what happens if a female employee dies or becomes permanently incapacitated during her maternity leave period?',
    options: [
      'The remaining maternity leave balance is forfeited immediately.',
      'The balance of her maternity leave benefits shall accrue to the father of the child, OR to a qualified caregiver (alternate caregiver) if the father is dead, absent, or incapacitated!',
      'It reverts to the employer’s general fund.',
      'It converts into 13th month pay.',
    ],
    correctIndex: 1,
    explanation:
      'Section 8 of R.A. 11210 provides that if the female worker dies or becomes permanently incapacitated, the balance of her maternity leave benefits accrues to the child’s father or a qualified caregiver.',
    legalBasis: 'Section 8, Republic Act No. 11210 (105-Day Expanded Maternity Leave Law)',
  },
  {
    id: 245,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Under R.A. 11861 (Expanded Solo Parents Welfare Act), aside from the 7-day forfeitable paid Parental Leave, what workplace scheduling right is granted to Solo Parents?',
    options: [
      'Automatic half-day work at double pay.',
      'Protection against work discrimination AND entitlement to Flexible Work Schedule (provided it does not affect individual and company productivity, subject to DOLE guidelines) plus telecommuting priority!',
      'Mandatory exemption from income tax for all salary brackets.',
      'Unlimited remote leave.',
    ],
    correctIndex: 1,
    explanation:
      'Sections 6 and 7 of R.A. 8972 as amended by R.A. 11861 mandate flexible work schedules, telecommuting priority, and non-discrimination in employment terms for solo parents.',
    legalBasis: 'Sections 6 & 7, R.A. 8972 as amended by Republic Act No. 11861',
  },
  {
    id: 246,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Under Auto Bus Transport Systems, Inc. v. Bautista, a bus driver worked 6 years without ever using or being paid his 5-day annual Service Incentive Leave (SIL), then resigned and sued 2 months later for all 30 days of accumulated SIL. Management claims the first 3 years prescribed under Art. 306. Who wins?',
    options: [
      'Management wins; SIL prescribes at the end of every calendar year.',
      'The driver wins all 6 years (30 days)! The 3-year prescriptive period for SIL runs ONLY from employer refusal upon demand OR from the date of separation from employment!',
      'Management wins; bus drivers are always exempt field personnel.',
      'Only the final year is recoverable.',
    ],
    correctIndex: 1,
    explanation:
      'In Auto Bus Transport Systems, Inc. v. Bautista (G.R. No. 156367), the Supreme Court held that the 3-year prescriptive period for SIL starts upon employer refusal after demand or upon separation, AND bus drivers inspected at dispatch terminals along fixed routes are supervised regular employees entitled to SIL.',
    legalBasis: 'Article 95 & Article 306, Labor Code; Auto Bus Transport Systems, Inc. v. Bautista',
  },
  {
    id: 247,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Which of the following private-sector employers is EXEMPT from paying the Salary Differential on 105-day Expanded Maternity Leave under R.A. 11210 and DOLE D.O. No. 209-20?',
    options: [
      'Any corporation in its first 5 years of incorporation.',
      'A registered Barangay Micro-Business Enterprise (BMBE under R.A. 9178) OR a retail/service enterprise regularly employing not more than ten (≤10) workers!',
      'Any BPO company paying above minimum wage.',
      'Only government agencies.',
    ],
    correctIndex: 1,
    explanation:
      'Section 5(c) of R.A. 11210 and DOLE D.O. 209-20 exempt four categories from paying the maternity salary differential: (1) Distressed establishments, (2) Retail/service firms employing ≤10 workers, (3) BMBEs under R.A. 9178, and (4) Firms already granting equal or superior CBA/policy benefits.',
    legalBasis: 'Section 5(c), R.A. No. 11210 & DOLE D.O. No. 209-20',
  },
  {
    id: 248,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'An unmarried couple has lived together for 4 years and gives birth to a healthy baby boy. The mother allocates 7 days of her 105-day maternity leave to the father, who also files 7 days of R.A. 8187 Paternity Leave with his employer (claiming 14 days total). How many paid days is the father entitled to?',
    options: [
      '14 paid days (7d R.A. 8187 + 7d R.A. 11210).',
      '7 paid days ONLY under the mother’s R.A. 11210 allocation (which requires no marriage); he gets 0 days under R.A. 8187 because Paternity Leave strictly requires lawful marriage to the mother!',
      '0 paid days because he is unmarried.',
      '10 paid days.',
    ],
    correctIndex: 1,
    explanation:
      'R.A. 8187 Sec. 2 strictly requires valid marriage and cohabitation with the legitimate spouse, whereas R.A. 11210 Sec. 6 explicitly allows allocation of up to 7 days to the child’s father regardless of civil status.',
    legalBasis: 'Section 6, R.A. No. 11210 vs. Section 2, R.A. No. 8187',
  },
  {
    id: 249,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'A female employee resigns effective May 1. Ten (10) calendar days later, on May 11, she gives birth prematurely. Does she still qualify for full 105-day Maternity Leave benefits?',
    options: [
      'No, employment ended on May 1.',
      'YES! Under Section 5 of R.A. 11210, full maternity leave still accrues if childbirth, miscarriage, or ETP occurs NOT MORE THAN fifteen (15) calendar days after termination of service!',
      'She gets half (52.5 days) only.',
      'Only if she was illegally dismissed.',
    ],
    correctIndex: 1,
    explanation:
      'Section 5 of R.A. 11210 protects accrued maternity benefits when childbirth, miscarriage, or ETP occurs within 15 calendar days after termination of service (and without any 15-day cap if dismissed without just cause).',
    legalBasis: 'Section 5, Republic Act No. 11210',
  },
  {
    id: 250,
    world: 'World 6: Statutory Leaves',
    worldCode: 'w6',
    scenario:
      'Among ALL statutory annual leaves in Philippine Labor Law (Art. 95 SIL, R.A. 8187 Paternity, R.A. 11861 Solo Parent, R.A. 9710 Gynecological Surgery, R.A. 9262 VAWC, and R.A. 10361 Kasambahay SIL), which ONE is statutorily cumulative and convertible to cash if unused?',
    options: [
      'All of them convert to cash in December.',
      'ONLY regular Article 95 Service Incentive Leave (SIL)! All the others (including Kasambahay SIL) are statutorily non-cumulative and non-convertible to cash if unused.',
      'Both Art. 95 SIL and Solo Parent Leave.',
      'Only VAWC Leave.',
    ],
    correctIndex: 1,
    explanation:
      'Only regular Art. 95 SIL is commutable to cash under Omnibus Rules Book III, Rule V, Sec. 5. Paternity, Solo Parent, Gynecological, VAWC, and Kasambahay SIL are all non-cumulative and non-convertible unless upgraded by CBA or voluntary employer policy.',
    legalBasis: 'Art. 95 Labor Code vs. R.A. 8187, R.A. 11861, R.A. 9710, R.A. 9262 & R.A. 10361',
  },
];

// ================= 30 RAPID-FIRE BOWSER BOSS QUESTIONS =================
export const BOWSER_BOSS_QUESTIONS: QuizQuestion[] = [
  {
    id: 101,
    world: 'Bowser Keep • CWW',
    worldCode: 'w1',
    scenario:
      'Bowser Corp. institutes a 4-day Compressed Work Week (12 hrs/day = 48 hrs) unilaterally without employee consent. Must Bowser pay daily overtime beyond 8 hours?',
    options: [
      'No, because weekly hours do not exceed 48.',
      'Yes! Without voluntary employee agreement and DOLE notice, the CWW is invalid and hours beyond 8/day require overtime pay.',
      'No, if lunch is free.',
      'Only on Fridays.',
    ],
    correctIndex: 1,
    explanation:
      'Voluntary employee consent and DOLE notification are indispensable for a valid CWW waiver of daily overtime.',
    legalBasis: 'DOLE Advisory No. 02-04 & Bisig Manggagawa sa Tryco v. NLRC',
  },
  {
    id: 102,
    world: 'Bowser Keep • Double Holiday',
    worldCode: 'holidays',
    scenario:
      'Koopa works 8 hours on a Double Regular Holiday that ALSO falls on his scheduled Rest Day! Daily wage is ₱1,000. Compute statutory pay!',
    options: ['₱2,600 (260%)', '₱3,000 (300%)', '₱3,600 (360%)', '₱3,900 (390%)'],
    correctIndex: 3,
    explanation: '300% Double Regular Holiday + 30% of 300% (90%) Rest Day premium = 390% (₱3,900).',
    legalBasis: 'DOLE Statutory Multiplier Matrix',
  },
  {
    id: 103,
    world: 'Bowser Keep • Art. 88',
    worldCode: 'w1',
    scenario:
      'Shy Guy is 45 minutes late on Monday, so Bowser makes him work 45 minutes overtime on Wednesday at straight pay. Valid?',
    options: [
      'Valid net balance.',
      'Invalid! Article 88 strictly forbids offsetting undertime with overtime.',
      'Valid if Shy Guy agrees.',
      'Valid once a month.',
    ],
    correctIndex: 1,
    explanation: 'Article 88 prohibits offsetting undertime on any day by overtime on another day.',
    legalBasis: 'Article 88, Labor Code',
  },
  {
    id: 104,
    world: 'Bowser Keep • Wage Distortion',
    worldCode: 'w3',
    scenario:
      'A Wage Order compresses the intentional pay gap between Rank 1 and Rank 2 workers in a unionized factory. What is the mandatory remedy?',
    options: [
      'Immediate union strike.',
      'CBA Grievance Machinery, and if unresolved, Voluntary Arbitration under Article 124.',
      'Criminal lawsuit.',
      'No remedy exists.',
    ],
    correctIndex: 1,
    explanation: 'Organized establishments must use CBA Grievance Machinery -> Voluntary Arbitration under Art. 124.',
    legalBasis: 'Article 124, Labor Code',
  },
  {
    id: 105,
    world: 'Bowser Keep • Lactation',
    worldCode: 'w5',
    scenario:
      'Under R.A. 10028, what is the minimum compensable lactation break per 8-hour shift for nursing employees?',
    options: [
      '15 minutes unpaid',
      'Not less than 40 minutes total, counted as compensable hours worked',
      '60 minutes unpaid',
      '20 minutes unpaid',
    ],
    correctIndex: 1,
    explanation: 'Section 12 of R.A. 10028 grants at least 40 minutes compensable lactation time per 8-hour shift.',
    legalBasis: 'Section 12, R.A. 10028',
  },
  {
    id: 106,
    world: 'Bowser Keep • VAWC Leave',
    worldCode: 'w5',
    scenario:
      'Bowser fires an employee for taking her 10-day paid VAWC leave supported by a Barangay Protection Order. Consequence?',
    options: [
      '₱500 fine only.',
      'Illegal dismissal + criminal liability/contempt under Section 43 of R.A. 9262!',
      'Valid management prerogative.',
      'Deductible from salary.',
    ],
    correctIndex: 1,
    explanation: 'Penalizing or dismissing a VAWC victim-employee for availing 10-day leave violates Sec. 43 of R.A. 9262.',
    legalBasis: 'Section 43, R.A. 9262',
  },
  {
    id: 107,
    world: 'Bowser Keep • Retirement',
    worldCode: 'w5',
    scenario:
      'Under Article 302, how many days of pay per year of service comprise statutory "one-half month salary" retirement pay?',
    options: ['15 days', '22.5 days (15 basic + 2.5 13th mo. + 5 SIL)', '30 days', '20 days'],
    correctIndex: 1,
    explanation: 'Statutory 1/2 month retirement salary equals 22.5 days per year of service (>=6 months counts as 1 full year).',
    legalBasis: 'Article 302, Labor Code & Elegance Textile Doctrine',
  },
  {
    id: 108,
    world: 'Bowser Keep • Legal Tender',
    worldCode: 'w3',
    scenario:
      'Bowser pays workers half in cash and half in "Bowser Mart Coupons." Does this violate the Labor Code?',
    options: [
      'No, if Bowser Mart sells rice.',
      'Yes! Article 102 outlaws payment of wages in tokens, chits, coupons, or promissory notes (criminal offense under Art. 303!).',
      'No, if workers sign waivers.',
      'Only illegal for supervisors.',
    ],
    correctIndex: 1,
    explanation: 'Article 102 mandates legal tender even if employees expressly request tokens/coupons.',
    legalBasis: 'Article 102, Labor Code & Congson v. NLRC',
  },
  {
    id: 109,
    world: 'Bowser Keep • Underground Miners',
    worldCode: 'w5',
    scenario:
      'Under R.A. 10741 (Underground Mine Workers Retirement Law), what are the optional and compulsory retirement ages for underground miners with >=5 years service?',
    options: [
      '60 optional / 65 compulsory',
      '50 optional / 60 compulsory',
      '45 optional / 55 compulsory',
      '55 optional / 65 compulsory',
    ],
    correctIndex: 1,
    explanation: 'Underground and surface mine workers enjoy lowered retirement ages: 50 optional and 60 compulsory!',
    legalBasis: 'Republic Act No. 10741 (Amending Art. 302)',
  },
  {
    id: 110,
    world: 'Bowser Keep • Racehorse Jockeys',
    worldCode: 'w5',
    scenario:
      'Under R.A. 10789, what is the compulsory retirement age for professional Racehorse Jockeys?',
    options: ['50 years old', '55 years old (with 5 years minimum service)', '60 years old', '65 years old'],
    correctIndex: 1,
    explanation: 'R.A. 10789 sets compulsory retirement for professional racehorse jockeys at age 55.',
    legalBasis: 'Republic Act No. 10789',
  },
  {
    id: 111,
    world: 'Bowser Keep • Service Charge',
    worldCode: 'w2',
    scenario:
      'If Bowser’s Castle Hotel completely abolishes its 10% service charge, what happens to the employees’ historical average share?',
    options: [
      'Lost forever.',
      'Must be considered integrated into the covered employees’ basic wages based on their average share for the past 12 months!',
      'Converted to gift checks.',
      'Paid once at 50%.',
    ],
    correctIndex: 1,
    explanation: 'When service charges are abolished, the 12-month average share of covered workers must be integrated into basic wages.',
    legalBasis: 'Article 96, Labor Code & R.A. 11360 IRR',
  },
  {
    id: 112,
    world: 'Bowser Keep • Exemption Trap',
    worldCode: 'w3',
    scenario:
      'A retail shop regularly employs EXACTLY ten (10) workers. Which exemption can it apply for, and which can it NOT claim?',
    options: [
      'Exempt from Holiday Pay, SIL, and Minimum Wage.',
      'May apply for Minimum Wage exemption (<= 10 workers), but is NOT exempt from Holiday Pay or SIL (which require < 10 workers, i.e., 9 or fewer)!',
      'Exempt from NSD (<= 5).',
      'Exempt from 13th Month Pay.',
    ],
    correctIndex: 1,
    explanation: 'Classic Bar Exam trap! Minimum Wage exemption = "not more than 10" (<=10); Holiday Pay & SIL = "less than 10" (<10); NSD = "not more than 5" (<=5).',
    legalBasis: 'R.A. 6727 vs. Art. 94(b) & Art. 95(b), Labor Code',
  },
  {
    id: 113,
    world: 'Bowser Keep • Paternity Allocation',
    worldCode: 'w5',
    scenario:
      'Under R.A. 11210 + R.A. 8187, up to how many TOTAL paid days can a married father enjoy upon his wife’s 2nd childbirth if she allocates maximum transferable maternity days to him?',
    options: [
      '7 days total',
      '14 days total (7 days Paternity Leave under R.A. 8187 + 7 allocated days from the mother’s 105-day Maternity Leave under R.A. 11210)',
      '21 days total',
      '30 days total',
    ],
    correctIndex: 1,
    explanation: 'Up to 7 days of the mother’s 105-day maternity leave can be allocated to the child’s father on top of his 7-day Paternity Leave = 14 days!',
    legalBasis: 'Section 6, R.A. 11210 & R.A. 8187',
  },
  {
    id: 114,
    world: 'Bowser Keep • Cabo System',
    worldCode: 'w3',
    scenario:
      'What is the "Cabo System" under DOLE D.O. 174-17?',
    options: [
      'A valid maritime union.',
      'A person or group/labor organization that, under the guise of a labor organization or cooperative, supplies workers to an employer — strictly PROHIBITED!',
      'A legitimate stevedoring corporation with ₱10M capital.',
      'A wage formula.',
    ],
    correctIndex: 1,
    explanation: 'Supplying workers under the guise of a labor union or "cabo" is unconditionally prohibited.',
    legalBasis: 'Section 3(b) & Sec. 6, DOLE D.O. 174-17',
  },
  {
    id: 115,
    world: 'Bowser Keep • Kasambahay Debt',
    worldCode: 'w4',
    scenario:
      'Bowser lends a Kasambahay ₱10,000 and forces her to sign a pledge not to resign until the loan is fully paid off. Valid?',
    options: [
      'Valid civil contract.',
      'Void and illegal Debt Bondage under Section 15 of R.A. 10361 (Batas Kasambahay)!',
      'Valid up to 1 year.',
      'Valid if notarized.',
    ],
    correctIndex: 1,
    explanation: 'Section 15 of R.A. 10361 strictly outlaws debt bondage—using an advance/loan as collateral to keep a Kasambahay from leaving employment.',
    legalBasis: 'Section 15, R.A. 10361',
  },
  {
    id: 116,
    world: 'Bowser Keep • Kasambahay Min Age',
    worldCode: 'w4',
    scenario:
      'What is the minimum employable age for a Kasambahay under R.A. 10361 & R.A. 9231?',
    options: ['12 years old', '14 years old', '15 years old', '18 years old'],
    correctIndex: 2,
    explanation: 'Under Sec. 16 of R.A. 10361, it is unlawful to employ any person below fifteen (15) years of age as a domestic worker.',
    legalBasis: 'Section 16, R.A. 10361',
  },
  {
    id: 117,
    world: 'Bowser Keep • Muslim Eid Holidays',
    worldCode: 'holidays',
    scenario:
      'Are Christian and non-Muslim employees nationwide entitled to Regular Holiday Pay on Eid’l Fitr and Eid’l Adha?',
    options: [
      'No, only Muslim employees in BARMM.',
      'Yes! Under R.A. 9177 and R.A. 9849, Eid’l Fitr and Eid’l Adha are NATIONAL Regular Holidays enjoyed by ALL covered workers regardless of religion!',
      'Only as Special Working Days.',
      'Only at 130%.',
    ],
    correctIndex: 1,
    explanation: 'Both Eid’l Fitr and Eid’l Adha are national Regular Holidays (200% worked / 100% unworked) for all covered employees nationwide.',
    legalBasis: 'R.A. 9177, R.A. 9849 & DOLE Advisories',
  },
  {
    id: 118,
    world: 'Bowser Keep • NSD on Regular Holiday',
    worldCode: 'holidays',
    scenario:
      'Kamek works from 10:00 PM to 6:00 AM on a Regular Holiday (ordinary workday). Hourly basic rate = ₱100. What is his hourly rate during those night hours?',
    options: [
      '₱210/hr (200% + 10%)',
      '₱220/hr (₱100 × 200% Regular Holiday × 1.10 NSD = 220% of basic hourly rate)',
      '₱260/hr',
      '₱200/hr',
    ],
    correctIndex: 1,
    explanation: 'Night Shift Differential on a holiday is 10% of the wage rate FOR THAT DAY: ₱100 × 2.00 × 1.10 = ₱220/hr (220%).',
    legalBasis: 'DOLE Handbook on Workers’ Statutory Monetary Benefits',
  },
  {
    id: 119,
    world: 'Bowser Keep • Emergency OT',
    worldCode: 'w1',
    scenario:
      'A typhoon floods the warehouse, threatening perishable rice stocks. Dry Bones refuses to render 2 hours of overtime to move the sacks. Can management compel overtime?',
    options: [
      'Never; all overtime is voluntary.',
      'Yes; Article 89 authorizes compulsory emergency overtime to prevent loss or damage to perishable goods or due to imminent calamity/typhoon (with full OT pay).',
      'Yes, without paying OT.',
      'Only with a court order.',
    ],
    correctIndex: 1,
    explanation: 'Article 89 enumerates the specific instances (war/calamity, urgent machine repair, perishable goods, necessary completion of started work) where emergency overtime is mandatory.',
    legalBasis: 'Article 89, Labor Code',
  },
  {
    id: 120,
    world: 'Bowser Keep • Wage Withholding',
    worldCode: 'w3',
    scenario:
      'An employee resigns, and Bowser withholds her final 2 months of earned basic salary for 9 months because she hasn’t returned an old ID lanyard worth ₱50. Lawful?',
    options: [
      'Lawful unlimited clearance hold.',
      'Unlawful under Article 116 (Withholding of Wages) & DOLE Labor Advisory 06-20 (Final Pay must be released within 30 days, subject only to proved commensurate accountability).',
      'Lawful up to 2 years.',
      'Forfeits all backpay.',
    ],
    correctIndex: 1,
    explanation: 'While reasonable clearance procedures are valid (Milan v. NLRC), withholding disproportionate earned wages indefinitely violates Art. 116 and DOLE LA 06-20 (30-day final pay rule).',
    legalBasis: 'Article 116, Labor Code, Milan v. NLRC & DOLE LA 06-20',
  },
  {
    id: 121,
    world: 'Bowser Keep • Commission & 13th Mo',
    worldCode: 'w2',
    scenario:
      'Are "overriding commissions" of a sales manager (not tied to personal direct sales productivity) included in basic salary for 13th-month pay?',
    options: [
      'Yes, all commissions are basic pay.',
      'No; first, managers are excluded from P.D. 851, and second, overriding/profit-bonus commissions not forming direct wage-for-work are excluded (Boie-Takeda / Philippine Duplicators doctrine).',
      'Yes, at 50%.',
      'Only in leap years.',
    ],
    correctIndex: 1,
    explanation: 'Under Philippine Duplicators v. NLRC, direct sales commissions integrated into basic pay of rank-and-file salesmen count, whereas productivity/overriding bonuses and managerial staff do not.',
    legalBasis: 'Philippine Duplicators v. NLRC & P.D. 851',
  },
  {
    id: 122,
    world: 'Bowser Keep • Apprentice Wage',
    worldCode: 'w5',
    scenario:
      'Bowser hires "apprentices" at 75% minimum wage WITHOUT prior TESDA approval of the apprenticeship program. What is their legal status?',
    options: [
      'Valid trainees for 6 months.',
      'They become REGULAR EMPLOYEES from Day 1 entitled to 100% full statutory minimum wage!',
      'Probationary workers at 80% pay.',
      'Volunteers.',
    ],
    correctIndex: 1,
    explanation: 'Prior TESDA registration/approval is a sine qua non condition; without it, putative apprentices are regular employees entitled to 100% minimum wage (Nitto Enterprises v. NLRC).',
    legalBasis: 'Article 61, Labor Code & Nitto Enterprises v. NLRC',
  },
  {
    id: 123,
    world: 'Bowser Keep • Learner Commit-to-Hire',
    worldCode: 'w5',
    scenario:
      'What distinguishes a "Learnerhip Agreement" (Art. 75) from an "Apprenticeship" regarding regularization?',
    options: [
      'Learners are unpaid.',
      'A Learnership Agreement MUST contain an express commitment by the employer to employ the learners as REGULAR employees if they so desire upon completion of the learnership (max 3 months)!',
      'Learnership lasts 2 years.',
      'Learners can be aged 12.',
    ],
    correctIndex: 1,
    explanation: 'Learnership covers semi-skilled/non-apprenticeable occupations (<= 3 months) and requires a mandatory commitment to hire as regular upon completion; learners dismissed after 2 months without fault are deemed regular!',
    legalBasis: 'Article 75, Labor Code of the Philippines',
  },
  {
    id: 124,
    world: 'Bowser Keep • CODI Duty',
    worldCode: 'w5',
    scenario:
      'Bowser Corp. ignores a written sexual harassment complaint and has no Committee on Decorum and Investigation (CODI). What is Bowser Corp.’s liability?',
    options: [
      'None, harassment is purely personal to the offender.',
      'Solidarily liable for damages arising from the acts of sexual harassment + administrative fines under R.A. 7877 and R.A. 11313!',
      'Verbal warning only.',
      'Union pays the fine.',
    ],
    correctIndex: 1,
    explanation: 'Under Sec. 5 of R.A. 7877 and Sec. 19 of R.A. 11313, the employer is solidarily liable for damages if informed of the harassment and no immediate action is taken.',
    legalBasis: 'R.A. 7877 Sec. 5 & R.A. 11313 Sec. 19',
  },
  {
    id: 125,
    world: 'Bowser Keep • Mental Health',
    worldCode: 'w5',
    scenario:
      'Under R.A. 11036 (Mental Health Act) & DOLE D.O. 208-20, can an employer reject a qualified job applicant solely due to a history of managed clinical depression?',
    options: [
      'Yes, to avoid sick leaves.',
      'No; employers must formulate workplace mental health policies and are prohibited from discriminating against workers/applicants with mental health conditions.',
      'Yes, in BPO firms.',
      'Only if under age 25.',
    ],
    correctIndex: 1,
    explanation: 'R.A. 11036 Sec. 25 and DOLE D.O. 208-20 mandate non-discrimination and reasonable accommodation for workers with mental health conditions.',
    legalBasis: 'Section 25, R.A. 11036 & DOLE D.O. 208-20',
  },
  {
    id: 126,
    world: 'Bowser Keep • HIV Non-Discrimination',
    worldCode: 'w5',
    scenario:
      'Under R.A. 11166 (Philippine HIV and AIDS Policy Act), can Bowser require mandatory HIV testing as a pre-employment condition for office clerks?',
    options: [
      'Yes, part of standard medical exam.',
      'Strictly UNLAWFUL! Compulsory HIV testing as a precondition to employment and termination based on actual/perceived HIV status are criminal offenses under R.A. 11166.',
      'Yes, if Bowser pays for the lab test.',
      'Allowed for probationary staff.',
    ],
    correctIndex: 1,
    explanation: 'R.A. 11166 prohibits compulsory HIV testing and any workplace discrimination from hiring to promotion/termination based on HIV status.',
    legalBasis: 'Sections 29 & 49, Republic Act No. 11166',
  },
  {
    id: 127,
    world: 'Bowser Keep • First Aid / OSH',
    worldCode: 'w5',
    scenario:
      'Under R.A. 11058 (OSH Law), a scaffold starts collapsing with imminent danger of death. Workers halt work and step off. Can Bowser fire them for insubordination?',
    options: [
      'Yes, refusal to work is abandonment.',
      'No! Section 6 of R.A. 11058 grants workers the statutory Right to Refuse Unsafe Work without threat or reprisal when imminent danger exists!',
      'Yes, unless DOLE arrives first.',
      'They lose 1 month pay.',
    ],
    correctIndex: 1,
    explanation: 'Workers have the statutory right to refuse unsafe work in situations of imminent danger, and administrative fines up to ₱100,000/day apply to willful OSH violations.',
    legalBasis: 'Section 6, Republic Act No. 11058 (OSH Law)',
  },
  {
    id: 128,
    world: 'Bowser Keep • PPE Cost',
    worldCode: 'w5',
    scenario:
      'Under R.A. 11058, who bears the cost of Personal Protective Equipment (hard hats, harnesses, respirators) on a construction site?',
    options: [
      'Deducted at 10% per week from workers.',
      '100% FREE OF CHARGE provided by the employer!',
      '50–50 cost share.',
      'Union funds.',
    ],
    correctIndex: 1,
    explanation: 'Section 8 of R.A. 11058 mandates that every employer shall provide workers their PPE FREE OF CHARGE.',
    legalBasis: 'Section 8, Republic Act No. 11058',
  },
  {
    id: 129,
    world: 'Bowser Keep • Temporary Closure Holiday',
    worldCode: 'holidays',
    scenario:
      'Bowser temporarily suspends factory operations for 3 weeks of annual inventory/maintenance. Christmas Day and Rizal Day fall during that shutdown. Are regular workers entitled to Holiday Pay?',
    options: [
      'No, because the plant was closed.',
      'Yes! Under Omnibus Rules Book III, Rule IV, Sec. 7(a), in cases of temporary or periodic shutdown/cessation of work (inventory, repair), regular holidays falling within the period MUST still be compensated!',
      'Only 50%.',
      'Only if the shutdown lasted 2 days.',
    ],
    correctIndex: 1,
    explanation: 'Temporary/periodic shutdowns for inventory or repairs do NOT excuse the employer from paying regular holidays; only cessation due to business reverses authorized by the DOLE Secretary suspends holiday pay.',
    legalBasis: 'Sec. 7, Rule IV, Book III, Omnibus Rules',
  },
  {
    id: 130,
    world: 'Bowser Keep • Monthly-Paid Holiday',
    worldCode: 'holidays',
    scenario:
      'A monthly-paid employee whose monthly salary uses a 365-day factor does NOT work on Labor Day (May 1). Does she receive an extra 100% on top of her monthly pay?',
    options: [
      'Yes, extra 100%.',
      'No extra pay if unworked, because a 365-day monthly factor ALREADY includes payment for all 12 unworked Regular Holidays and rest days (if she works on May 1, she gets an extra 100% to reach 200%)!',
      'Monthly employees are exempt from holidays.',
      'She gets 300%.',
    ],
    correctIndex: 1,
    explanation: 'Monthly-paid employees paid for all days of the year (365 factor) already have 100% of regular holidays built into their monthly salary; working on a regular holiday adds +100% (total 200%).',
    legalBasis: 'Insular Bank of Asia & America Employees’ Union v. Inciong',
  },
  // ================= EXPANDED BOWSER BOSS QUESTIONS (Worlds 1-6 + Holidays, id: 301 to 324) =================
  {
    id: 301,
    world: 'Bowser Keep • Art. 95 SIL Prescription',
    worldCode: 'w6',
    scenario:
      'Bowser claims an employee’s 10 years of accumulated unused Service Incentive Leave (SIL) prescribed 3 years after each calendar year ended. Under Auto Bus v. Bautista, is Bowser right?',
    options: [
      'Yes, SIL prescribes annually.',
      'NO! The 3-year prescription for SIL cash conversion starts ONLY from employer refusal upon demand OR upon separation from employment!',
      'SIL prescribes in 1 year.',
      'Only the last 2 years can be claimed.',
    ],
    correctIndex: 1,
    explanation:
      'Under Auto Bus Transport Systems v. Bautista, the employee can claim all uncommuted SIL upon separation because the cause of action accrues only upon demand/refusal or termination.',
    legalBasis: 'Auto Bus Transport Systems v. Bautista, G.R. No. 156367',
  },
  {
    id: 302,
    world: 'Bowser Keep • R.A. 11210 Solo Mother',
    worldCode: 'w6',
    scenario:
      'A certified Solo Parent mother gives birth via normal delivery. How many TOTAL paid days of Maternity Leave does she receive under R.A. 11210?',
    options: [
      '105 days',
      '120 days with full pay (105 standard + 15 solo parent days)!',
      '90 days (normal delivery)',
      '135 days with full pay',
    ],
    correctIndex: 1,
    explanation:
      'Mode of delivery (normal vs C-section) no longer matters: 105 days + 15 additional days for solo parents = 120 days with full pay!',
    legalBasis: 'Section 3, Republic Act No. 11210',
  },
  {
    id: 303,
    world: 'Bowser Keep • Unmarried Father Allocation',
    worldCode: 'w6',
    scenario:
      'Mario and Peach are NOT married. Peach gives birth and allocates 7 days of her 105-day Maternity Leave to Mario. Bowser denies Mario’s 7-day leave because Mario is unmarried. Valid denial?',
    options: [
      'Valid; unmarried fathers get zero leave.',
      'INVALID! While R.A. 8187 Paternity Leave requires marriage, the 7-day Maternity Allocation under Sec. 6 of R.A. 11210 applies WHETHER OR NOT the father is married to the mother!',
      'Valid unless they marry within 30 days.',
      'Mario gets 3 days only.',
    ],
    correctIndex: 1,
    explanation:
      'Section 6 of R.A. 11210 explicitly allows allocation of up to 7 days to the child’s father, married or unmarried!',
    legalBasis: 'Section 6, Republic Act No. 11210',
  },
  {
    id: 304,
    world: 'Bowser Keep • Solo Parent Child Age',
    worldCode: 'w6',
    scenario:
      'Under R.A. 11861 (Expanded Solo Parents Welfare Act), what is the maximum qualifying age for an unmarried, unemployed dependent child?',
    options: [
      '18 years old',
      '22 years old or below (or any age if with physical/mental disability)!',
      '21 years old',
      '15 years old',
    ],
    correctIndex: 1,
    explanation:
      'R.A. 11861 raised the dependent child age cap from 18 to 22 years old or below.',
    legalBasis: 'Section 3, Republic Act No. 11861',
  },
  {
    id: 305,
    world: 'Bowser Keep • Gynecological Surgery',
    worldCode: 'w6',
    scenario:
      'What is the maximum paid Special Leave for women who undergo surgery caused by gynecological disorders under R.A. 9710 (Magna Carta of Women)?',
    options: [
      '15 days basic pay',
      'Up to two (2) months with full pay based on GROSS monthly compensation (after >=6 months aggregate service in last 12 months)!',
      '30 days unpaid',
      '105 days SSS benefit',
    ],
    correctIndex: 1,
    explanation:
      'Section 18 of R.A. 9710 grants up to 2 months special leave with full gross monthly pay following gynecological surgery.',
    legalBasis: 'Section 18, Republic Act No. 9710',
  },
  {
    id: 306,
    world: 'Bowser Keep • VAWC Proof',
    worldCode: 'w6',
    scenario:
      'Bowser demands a final criminal court conviction of the abusive husband before approving a female worker’s 10-day paid VAWC Leave. Lawful?',
    options: [
      'Lawful anti-fraud measure.',
      'UNLAWFUL! A mere certification from the Barangay Captain/Kagawad, Prosecutor, or Clerk of Court that an action is pending (or a Protection Order) suffices!',
      'Requires NBI investigation first.',
      'Requires 5 years tenure.',
    ],
    correctIndex: 1,
    explanation:
      'Under R.A. 9262 Sec. 43, certification of a pending VAWC action or protection order is sufficient; criminal conviction is never a precondition.',
    legalBasis: 'Section 43, Republic Act No. 9262',
  },
  {
    id: 307,
    world: 'Bowser Keep • Kasambahay SIL Trap',
    worldCode: 'w4',
    scenario:
      'Quick! Is a Kasambahay’s unused 5-day annual Service Incentive Leave (SIL) under R.A. 10361 convertible to cash?',
    options: [
      'Yes, just like Article 95.',
      'NO! Under Sec. 29 of R.A. 10361, Kasambahay SIL is NON-cumulative and NON-convertible to cash!',
      'Yes, at 50% rate.',
      'Yes, after 3 years.',
    ],
    correctIndex: 1,
    explanation:
      'Section 29 of R.A. 10361 expressly states that unused Kasambahay SIL shall not be cumulative or carried over, nor convertible to cash.',
    legalBasis: 'Section 29, Republic Act No. 10361',
  },
  {
    id: 308,
    world: 'Bowser Keep • Brownout 20-Min Rule',
    worldCode: 'w1',
    scenario:
      'Power goes out at Bowser’s Castle Plant for eighteen (18) minutes! Can Bowser deduct 18 minutes from workers’ wages?',
    options: [
      'Yes, no electricity means no output.',
      'NO! Power interruptions/brownouts NOT exceeding twenty (<= 20) minutes are ALWAYS treated as compensable hours worked!',
      'Yes, if generator broke.',
      'Deduct 50%.',
    ],
    correctIndex: 1,
    explanation:
      'Brownouts of 20 minutes or less are unconditionally compensable working time.',
    legalBasis: 'Omnibus Rules / Policy Instructions on Brownouts & Art. 84',
  },
  {
    id: 309,
    world: 'Bowser Keep • Health Personnel 40h',
    worldCode: 'w1',
    scenario:
      'A private clinic has only 40 beds, BUT is located in Quezon City (population > 1,000,000). What is the normal weekly hours cap for its nurses under Article 83?',
    options: [
      '48 hours / 6 days because bed capacity is below 100.',
      '40 hours / 5 days! Article 83 uses "OR" — >= 1,000,000 population OR >= 100 bed capacity triggers the 40-hour / 5-day workweek (+30% on 6th day)!',
      '44 hours.',
      '36 hours.',
    ],
    correctIndex: 1,
    explanation:
      'Meeting EITHER the >=1,000,000 city/municipality population threshold OR the >=100 bed capacity threshold activates the 40-hour / 5-day health personnel rule.',
    legalBasis: 'Article 83, Labor Code',
  },
  {
    id: 310,
    world: 'Bowser Keep • 13th Month Tax Cap',
    worldCode: 'w2',
    scenario:
      'Under the TRAIN Law (R.A. 10963), what is the income-tax-exempt ceiling for 13th Month Pay and other benefits?',
    options: ['₱30,000', '₱82,000', '₱90,000', '₱120,000'],
    correctIndex: 2,
    explanation:
      'R.A. 10963 raised the tax-exempt cap on 13th Month Pay and other benefits from ₱82,000 to ₱90,000.',
    legalBasis: 'Section 32(B)(7)(e), NIRC (R.A. 10963)',
  },
  {
    id: 311,
    world: 'Bowser Keep • Service Charge Agency Staff',
    worldCode: 'w2',
    scenario:
      'Under DOLE D.O. No. 242-24 (R.A. 11360), do deployed agency housekeepers in a hotel share in the 100% Service Charge pool?',
    options: [
      'No, direct hires only.',
      'YES! DOLE D.O. 242-24 includes ALL non-managerial workers performing work in the establishment, including deployed contractor workers!',
      'Only managers get 15%.',
      'Only after 5 years.',
    ],
    correctIndex: 1,
    explanation:
      'DOLE D.O. 242-24 ensures equal distribution of 100% service charges to all covered non-managerial employees, whether direct or deployed.',
    legalBasis: 'DOLE Department Order No. 242, Series of 2024 & R.A. 11360',
  },
  {
    id: 312,
    world: 'Bowser Keep • D.O. 174 Capital Threshold',
    worldCode: 'w3',
    scenario:
      'What is the minimum "Substantial Capital" threshold (paid-up capital for corporations / net worth for single proprietorships) under DOLE D.O. 174-17?',
    options: ['₱1,000,000', '₱3,000,000', '₱5,000,000', '₱10,000,000'],
    correctIndex: 2,
    explanation:
      'Section 3(l) of DOLE D.O. 174-17 defines substantial capital as at least ₱5,000,000.00.',
    legalBasis: 'Section 3(l), DOLE D.O. 174-17',
  },
  {
    id: 313,
    world: 'Bowser Keep • COE & Final Pay Deadlines',
    worldCode: 'w3',
    scenario:
      'Under DOLE Labor Advisory 06-20, how many days does Bowser have to issue a Certificate of Employment (COE) vs. release Final Pay?',
    options: [
      '15 days COE / 60 days Final Pay',
      '3 days for COE / 30 days for Final Pay!',
      '7 days COE / 45 days Final Pay',
      '30 days for both',
    ],
    correctIndex: 1,
    explanation:
      'COE must be issued within 3 days from request; Final Pay within 30 days from separation.',
    legalBasis: 'DOLE Labor Advisory No. 06, Series of 2020',
  },
  {
    id: 314,
    world: 'Bowser Keep • Loss Deduction 20% Cap',
    worldCode: 'w3',
    scenario:
      'After due process proves an employee broke a tool, what is the MAXIMUM percentage of weekly wages an employer may deduct per week under Art. 115 Rules?',
    options: ['10% of weekly wage', '20% of weekly wage', '50% of weekly wage', '30% of weekly wage'],
    correctIndex: 1,
    explanation:
      'Deductions for proved loss or damage cannot exceed 20% of the employee’s wages in a week.',
    legalBasis: 'Omnibus Rules Book III, Rule VIII, Sec. 11 & DOLE LA 11-14',
  },
  {
    id: 315,
    world: 'Bowser Keep • Double Indemnity',
    worldCode: 'w3',
    scenario:
      'Bowser defies an RTWPB Wage Order and underpays minimum wage by ₱50,000 total. Under R.A. 8188, how much wage indemnity must Bowser pay the worker?',
    options: ['₱50,000', '₱75,000', '₱100,000 (Double Indemnity = 2x unpaid wage increase)!', '₱25,000'],
    correctIndex: 2,
    explanation:
      'R.A. 8188 imposes Double Indemnity (2x the unpaid prescribed wage increase) upon non-compliant employers.',
    legalBasis: 'Republic Act No. 8188',
  },
  {
    id: 316,
    world: 'Bowser Keep • Family Driver Law',
    worldCode: 'w4',
    scenario:
      'Which law governs the unjust dismissal of a personal Family Driver (who is excluded from Batas Kasambahay)?',
    options: [
      'Labor Code Art. 294 (Reinstatement + full backwages)',
      'Civil Code Art. 1697 (Wages earned + 15 days salary indemnity)!',
      'R.A. 10361 Batas Kasambahay',
      'Maritime Code',
    ],
    correctIndex: 1,
    explanation:
      'Family drivers are governed by Civil Code provisions on Household Service (Art. 1697: 15-day indemnity), per Atienza v. Saluta.',
    legalBasis: 'Sec. 3(d), R.A. 10361 & Art. 1697, Civil Code',
  },
  {
    id: 317,
    world: 'Bowser Keep • Working Child Curfew',
    worldCode: 'w4',
    scenario:
      'Under R.A. 9231, a 16-year-old working teen (15 to below 18) is strictly prohibited from working during which night hours?',
    options: ['6:00 PM to 6:00 AM', '8:00 PM to 6:00 AM', '10:00 PM to 6:00 AM!', '12:00 MN to 5:00 AM'],
    correctIndex: 2,
    explanation:
      'Children aged 15 to below 18 cannot work more than 8h/day (40h/wk) and are barred from working between 10:00 PM and 6:00 AM (whereas <15 is barred 8:00 PM to 6:00 AM).',
    legalBasis: 'Section 3, Republic Act No. 9231',
  },
  {
    id: 318,
    world: 'Bowser Keep • Secular Morality',
    worldCode: 'w4',
    scenario:
      'Can Bowser fire an unmarried clerk for consensual premarital pregnancy with her unmarried fiancé?',
    options: [
      'Yes, for immorality.',
      'NO! Under Leus & Capin-Cadiz (Secular Morality Rule) plus Art. 135(2) / R.A. 9710, dismissing an unmarried woman for pregnancy without legal impediment is ILLEGAL DISMISSAL!',
      'Yes, if handbook says so.',
      'Only in schools.',
    ],
    correctIndex: 1,
    explanation:
      'Consensual premarital pregnancy between unmarried adults free to marry is not immoral under secular law, and firing a woman due to pregnancy violates Art. 135 and R.A. 9710.',
    legalBasis: 'Leus v. St. Scholastica’s College & Art. 135, Labor Code',
  },
  {
    id: 319,
    world: 'Bowser Keep • Two-Test Drug Rule',
    worldCode: 'w5',
    scenario:
      'Can Bowser fire an employee based on a single positive Urine Drug Screening Test without a Confirmatory Test?',
    options: [
      'Yes, zero tolerance.',
      'NO! Both a Screening Test AND a Confirmatory Test by a DOH-accredited lab on the same specimen are mandatory!',
      'Yes, for drivers.',
      'Yes, during probation.',
    ],
    correctIndex: 1,
    explanation:
      'Dismissing a worker without a positive confirmatory test violates statutory due process and R.A. 9165 / DOLE D.O. 53-03.',
    legalBasis: 'R.A. 9165 Sec. 36(d) & Mirant Philippines v. Josue',
  },
  {
    id: 320,
    world: 'Bowser Keep • Age Discrimination',
    worldCode: 'w5',
    scenario:
      'Bowser posts a job ad: "Accounting Clerk Wanted — Must be 21 to 28 years old only!" What law does this violate?',
    options: [
      'None, hiring is management prerogative.',
      'R.A. 10911 (Anti-Age Discrimination in Employment Act)!',
      'R.A. 6727.',
      'P.D. 851.',
    ],
    correctIndex: 1,
    explanation:
      'Section 5(a) of R.A. 10911 prohibits printing or publishing any job notice or advertisement suggesting age preference, limitation, or specification (absent a strict BFOQ).',
    legalBasis: 'Section 5(a), Republic Act No. 10911',
  },
  {
    id: 321,
    world: 'Bowser Keep • OSH Daily Penalty',
    worldCode: 'w5',
    scenario:
      'What is the maximum DAILY administrative fine for willful refusal to comply with OSH standards under R.A. 11058?',
    options: ['₱10,000/day', '₱50,000/day', '₱100,000/day until corrected!', '₱5,000 flat'],
    correctIndex: 2,
    explanation:
      'Section 28 of R.A. 11058 imposes an administrative fine not exceeding ₱100,000.00 per day until the violation is corrected.',
    legalBasis: 'Section 28, Republic Act No. 11058',
  },
  {
    id: 322,
    world: 'Bowser Keep • Telecommuting Fair Treatment',
    worldCode: 'w5',
    scenario:
      'Bowser pays Work-From-Home coders 0% Night Shift Differential for working 11:00 PM–5:00 AM, claiming NSD applies only inside office buildings. Valid?',
    options: [
      'Valid because electricity at home is theirs.',
      'INVALID! Under Section 5 of R.A. 11165 (Telecommuting Act), WFH workers enjoy Fair Treatment—including Overtime and Night Shift Differential on par with comparable on-site workers!',
      'Valid if WFH is 3 days/week.',
      'NSD is halved to 5%.',
    ],
    correctIndex: 1,
    explanation:
      'Section 5(a) of R.A. 11165 guarantees telecommuting employees rate of pay, overtime, and night shift differential not less than comparable on-site employees.',
    legalBasis: 'Section 5, Republic Act No. 11165',
  },
  {
    id: 323,
    world: 'Bowser Keep • Preceding Absence Worked Holiday',
    worldCode: 'holidays',
    scenario:
      'Koopa was AWOL (absent without pay) on April 30, BUT reported and worked 8 full hours on May 1 (Labor Day, Regular Holiday). What pay does Koopa earn for May 1?',
    options: [
      '100% only because he was AWOL on April 30.',
      'Full 200% Regular Holiday rate! Unpaid absence on the preceding day forfeits UNWORKED holiday pay only—actually working on a Regular Holiday ALWAYS earns 200%!',
      '130% special rate.',
      'Zero pay.',
    ],
    correctIndex: 1,
    explanation:
      'Under DOLE Handbook & Art. 94 rules, an employee who is on leave without pay the day before a regular holiday is disqualified only from unworked 100% holiday pay; if he actually works on the holiday, he earns 200%!',
    legalBasis: 'Article 94, Labor Code & DOLE Statutory Benefits Handbook',
  },
  {
    id: 324,
    world: 'Bowser Keep • Unworked Double Holiday',
    worldCode: 'holidays',
    scenario:
      'Araw ng Kagitingan and Good Friday fall on the exact same date (Double Regular Holiday). Peach was present the workday before and RESTS at home on the Double Holiday. How much pay does she earn?',
    options: [
      '100% daily wage',
      '200% daily wage (Asian Transmission Corp. v. CA)!',
      '300% daily wage',
      '130% daily wage',
    ],
    correctIndex: 1,
    explanation:
      'Under Asian Transmission Corp. v. CA, an unworked Double Regular Holiday entitles a covered employee to 200% of basic daily wage (and 300% if worked).',
    legalBasis: 'Asian Transmission Corp. v. CA, G.R. No. 144664',
  },
  {
    id: 325,
    world: 'Bowser Keep • World 6 SIL',
    worldCode: 'w6',
    scenario:
      'Bowser grants 5 days of paid Vacation Leave per year (forfeitable if unused). Can employees STILL demand an additional 5 days of commutable Art. 95 Service Incentive Leave?',
    options: [
      'Yes, VL and SIL are always separate.',
      'NO! Under Art. 95(b) & Omnibus Rules, employees already enjoying Vacation Leave with pay of at least 5 days are EXCLUDED from mandatory SIL!',
      'Yes, if unionized.',
      'Only half (2.5 days).',
    ],
    correctIndex: 1,
    explanation:
      'Omnibus Rules Book III, Rule V, Sec. 1(d) excludes employees already enjoying vacation leave with pay of at least five (5) days from claiming an extra 5-day statutory SIL.',
    legalBasis: 'Article 95, Labor Code & Book III, Rule V, Sec. 1(d), Omnibus Rules',
  },
  {
    id: 326,
    world: 'Bowser Keep • World 6 Maternity',
    worldCode: 'w6',
    scenario:
      'Princess Peach (a qualified Solo Parent) gives birth via cesarean section to her 5th child. How many PAID maternity leave days does R.A. 11210 grant her?',
    options: [
      '0 days because R.A. 11210 caps at 4 deliveries.',
      '120 calendar days with full pay (105 base + 15 Solo Parent days; delivery mode and 5th pregnancy do not reduce or bar entitlement)!',
      '78 days for cesarean.',
      '105 days only.',
    ],
    correctIndex: 1,
    explanation:
      'R.A. 11210 applies to EVERY pregnancy regardless of frequency or delivery mode (105 days), plus an additional 15 paid days for qualified Solo Parents = 120 paid days!',
    legalBasis: 'Section 3, Republic Act No. 11210',
  },
  {
    id: 327,
    world: 'Bowser Keep • World 6 Solo Parent',
    worldCode: 'w6',
    scenario:
      'Under R.A. 11861 (Expanded Solo Parents Welfare Act), what is the minimum length of service required to avail of the 7-day paid Parental Leave?',
    options: [
      '1 full year (12 months)',
      'At least six (6) months of service (lowered from 1 year by R.A. 11861)!',
      '2 years of regular tenure',
      '3 months probationary',
    ],
    correctIndex: 1,
    explanation:
      'R.A. 11861 reduced the service requirement for the 7-day forfeitable Parental Leave from 1 year down to at least 6 months of service.',
    legalBasis: 'Section 8, R.A. 8972 as amended by R.A. No. 11861',
  },
  {
    id: 328,
    world: 'Bowser Keep • World 6 Gynecological',
    worldCode: 'w6',
    scenario:
      'Rosalina (8 months continuous service) undergoes surgical myomectomy for uterine fibroids. What paid leave does Sec. 18 of R.A. 9710 grant?',
    options: [
      '5 days SIL only.',
      'Up to two (2) months Special Leave with FULL PAY based on gross monthly compensation!',
      '60 days SSS maternity leave.',
      '15 days unpaid leave.',
    ],
    correctIndex: 1,
    explanation:
      'Section 18 of R.A. 9710 (Magna Carta of Women) grants up to 2 months leave with full gross monthly pay following surgery caused by gynecological disorders for women with ≥6 months aggregate service in the last 12 months.',
    legalBasis: 'Section 18, Republic Act No. 9710 & DOLE D.O. No. 112-11',
  },
];

