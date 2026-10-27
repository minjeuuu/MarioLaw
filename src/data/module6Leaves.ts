import { LawTopic } from '../types/laborLaw';

export const MODULE_6_LEAVES: LawTopic[] = [
  {
    id: 'm6-service-incentive-leave',
    worldId: 'world6',
    title: 'Service Incentive Leave (SIL)',
    badge: 'Art. 95 Labor Code',
    iconName: 'Super Mushroom',
    summary:
      'Statutory minimum 5 days paid leave per year for employees with at least 1 year of service (continuous or broken). Unused SIL is commutable to cash at year-end or upon separation. Vacation Leave (VL) and Sick Leave (SL) are voluntary employer grants or CBA benefits.',
    beginnerSummary:
      'After working 1 year (continuous or broken), you are entitled to at least 5 days of paid leave each year. If unused by year-end or upon resignation, it must be converted into cash!',
    practicalTakeaway:
      'In computing backwages or final pay, always check whether the establishment employs at least 10 regular workers and whether the worker already receives at least 5 days of paid Vacation Leave; if not, accumulated unused SIL from hiring date is payable upon demand/refusal or separation under Auto Bus Transport Systems v. Bautista.',
    keyDoctrines: [
      'Every employee who has rendered at least one (1) year of service shall be entitled to a yearly service incentive leave of five (5) days with pay (Art. 95[a], Labor Code).',
      'Auto Bus Transport Systems, Inc. v. Bautista (G.R. No. 156367): The 3-year prescriptive period under Art. 306 for SIL money claims commences NOT at the end of each calendar year, but from the time the employer refuses to pay upon demand OR upon termination/resignation of employment.',
      'JPL Marketing Promotions v. CA: Service Incentive Leave accrues only AFTER rendering 12 months of service; employees dismissed or resigning prior to completing 1 full year cannot claim proportionate SIL unless company policy/CBA grants it.',
      'Kasambahay Distinction (Sec. 29, R.A. 10361): While Kasambahays also receive 5 days annual SIL after 1 year of service, unused Kasambahay SIL is NON-CUMULATIVE and NON-CONVERTIBLE to cash—unlike regular Art. 95 SIL!',
    ],
    rules: [
      {
        heading: 'Mandatory Coverage & Entitlement (Art. 95)',
        items: [
          'Service Requirement: At least one (1) year of service ("one year of service" means service within 12 months, whether continuous or broken, reckoned from the date the employee started working, including authorized absences and paid regular holidays).',
          'Duration & Pay: Yearly service incentive leave of five (5) days with full regular daily pay.',
          'Commutation to Cash: Unused SIL at the end of the year is commutable to its money equivalent based on the salary rate at the date of commutation/conversion.',
          'Distinction from VL/SL: The Labor Code mandates only 5-day SIL. Vacation Leave (VL) and Sick Leave (SL) are voluntary employer grants or CBA stipulations, though once established by long practice they are protected against unilateral withdrawal under Art. 100 (Non-Diminution of Benefits).',
        ],
      },
      {
        heading: 'Employees Excluded from SIL Coverage',
        description:
          'Under Art. 95(b) and Book III, Rule V, Sec. 1 of the Omnibus Rules, SIL does not apply to:',
        items: [
          '1. Government employees and employees of GOCCs with original charters (governed by Civil Service Rules granting 15 VL + 15 SL).',
          '2. Persons in the personal service of another (Domestic Workers/Kasambahays are governed instead by R.A. 10361 Sec. 29 non-convertible 5-day SIL).',
          '3. Managerial employees and officers/members of the managerial staff as defined in Book III, Rule I.',
          '4. Field personnel and other employees whose time and performance are unsupervised by the employer (including purely commission/task-based workers who are unsupervised).',
          '5. Those already enjoying the benefit (SIL or equivalent paid leave).',
          '6. Those already enjoying vacation leave with pay of at least five (5) days.',
          '7. Those employed in establishments regularly employing LESS THAN TEN (<10, i.e., 9 or fewer) employees.',
        ],
      },
      {
        heading: 'Cash Conversion Formula, Part-Time Workers & Prescription',
        items: [
          'Cash Commutation Formula: Daily Basic Rate (at time of commutation) × Number of Unused SIL Days.',
          'Part-Time Employees (DOLE Explanatory Bulletin): Part-time workers ARE entitled to the full 5 days SIL benefit after 1 year of service, proportionate in daily monetary pay to their part-time daily hours.',
          'Separation Pay vs. SIL: Resigned and validly dismissed employees still recover all earned/accumulated unused SIL in their final pay because SIL is an earned statutory benefit, not a gratuity.',
          'Prescription (Auto Bus Rule): 3 years reckoned from employer’s refusal upon demand OR from date of separation from service.',
        ],
        tableData: {
          headers: ['Criterion', 'Regular SIL (Art. 95 Labor Code)', 'Kasambahay SIL (Sec. 29, R.A. 10361)'],
          rows: [
            ['Annual Entitlement', '5 days with pay per year', '5 days with pay per year'],
            ['Minimum Tenure', 'At least 1 year (continuous or broken)', 'At least 1 year of service'],
            ['Small Employer Exemption', 'Exempt if < 10 regular workers', 'Applies to ALL households (no headcount exemption)'],
            ['Carry-Over / Cumulative?', 'YES — accumulates if unpaid/unused', 'NO — strictly non-cumulative'],
            ['Convertible to Cash?', 'YES — commutable to cash at year-end/separation', 'NO — unused leaves forfeited at year-end'],
          ],
        },
      },
    ],
    exceptions: [
      {
        generalRule: 'All rank-and-file private sector employees with ≥1 year of service earn 5 days commutable SIL.',
        exceptions: [
          'Establishments regularly employing fewer than 10 workers (≤9 workers).',
          'Employees already receiving at least 5 days of paid Vacation Leave.',
          'Unsupervised field personnel (Auto Bus: bus drivers/conductors paid on commission WITH inspectors/dispatchers at terminals are NOT field personnel and ARE entitled to SIL!).',
        ],
      },
    ],
    barTips: [
      'Bar Tip: If an employer already grants at least 5 days of paid Vacation Leave (VL), statutory SIL under Art. 95 is deemed complied with—even if that VL is forfeitable when unused!',
      'Bar Tip: Bus drivers/conductors inspected along fixed routes with time schedules are regular supervised workers, NOT field personnel (Auto Bus Transport Systems v. Bautista).',
    ],
  },
  {
    id: 'm6-maternity-leave',
    worldId: 'world6',
    title: '105-Day Expanded Maternity Leave Law',
    badge: 'R.A. No. 11210',
    iconName: 'Princess Peach Crown',
    summary:
      '105 days paid maternity leave for live childbirth (regardless of civil status, delivery mode, or frequency), +15 paid days for Solo Parents (120 days total), optional +30 days unpaid extension, and 60 days paid leave for miscarriage or emergency termination of pregnancy.',
    beginnerSummary:
      'Female workers receive 105 days of full pay for every live childbirth (normal or cesarean) and can transfer up to 7 days to the child’s father! Solo mothers get 120 paid days, and miscarriage/ETP grants 60 paid days.',
    practicalTakeaway:
      'In the private sector, SSS reimburses 100% of the average daily salary credit, AND the employer must pay the Salary Differential (actual full pay minus SSS maternity benefit) unless the employer qualifies under the 4 statutory exemptions.',
    keyDoctrines: [
      'Universal Coverage & Frequency: Granted to ALL covered female workers (public, private, informal economy, voluntary SSS, national athletes) in EVERY instance of pregnancy, miscarriage, or emergency termination of pregnancy (ETP), completely repealing the old 4-delivery limit.',
      'Delivery Mode Irrelevant: Live childbirth grants 105 days whether normal (vaginal) or cesarean delivery.',
      'Compulsory Postnatal Floor: Enjoyment cannot be deferred and must be continuous and uninterrupted; prenatal leave may be taken, provided postnatal leave is NOT LESS THAN sixty (60) days.',
      'Salary Differential Rule (Sec. 5[c], R.A. 11210): Private employers shall advance full pay within 30 days from filing and shoulder the difference between full pay and actual SSS maternity benefits.',
    ],
    rules: [
      {
        heading: 'Maternity Leave Duration, Extensions & Credits Matrix',
        items: [
          'Live Childbirth (Normal or Cesarean): 105 calendar days with full pay.',
          'Qualified Solo Parent Mother (R.A. 8972 / R.A. 11861): +15 additional days with full pay = 120 calendar days total.',
          'Miscarriage or Emergency Termination of Pregnancy (ETP, including stillbirth): 60 calendar days with full pay.',
          'Optional Unpaid Extension (Live Childbirth): Up to 30 additional calendar days WITHOUT pay, upon written notice to the employer at least 45 days before the end of maternity leave (except in medical emergencies).',
          'SSS Contribution Qualification (Private Sector): At least three (3) monthly SSS contributions in the twelve-month (12-month) period immediately preceding the semester of childbirth, miscarriage, or ETP.',
        ],
        tableData: {
          headers: ['Contingency / Status', 'Paid Leave Days', 'Optional Extension', 'Transferable to Father/Caregiver?'],
          rows: [
            ['Live Childbirth (Regular Female Worker)', '105 calendar days (Full Pay)', '+30 days without pay (45d prior notice)', 'YES — up to 7 days'],
            ['Live Childbirth (Qualified Solo Parent)', '120 calendar days (105 + 15 Full Pay)', '+30 days without pay', 'YES — up to 7 days (leaving 113d)'],
            ['Miscarriage / Emergency Termination / Stillbirth', '60 calendar days (Full Pay)', 'None under statute', 'NO — allocation applies only to live childbirth'],
            ['Death / Permanent Incapacity of Mother', 'Remaining unavailed balance', 'N/A', 'Accrues in FULL to father or qualified alternate caregiver'],
          ],
        },
      },
      {
        heading: 'Allocation of 7 Maternity Leave Credits (Sec. 6)',
        items: [
          'Allocation to Child’s Father: Mother may optionally allocate up to seven (7) days of her 105/120-day benefit to the child’s father, WHETHER OR NOT he is married to her (giving a married father 7d RA 8187 + 7d RA 11210 = 14 paid days!).',
          'Alternate Caregiver (only if father is dead, absent, or incapacitated): Relative within the 4th civil degree of consanguinity OR current partner (regardless of gender) sharing the same household with the female worker.',
          'Live Childbirth Only: Under the IRR of R.A. 11210, the 7-day allocation option applies only to live childbirth (not miscarriage).',
        ],
      },
      {
        heading: 'Salary Differential & 4 Exempt Establishments (DOLE D.O. 209-20)',
        items: [
          'General Rule: Employer pays the Salary Differential = (Full Monthly Salary + Mandatory Allowances) minus SSS Maternity Benefit.',
          'Exemption 1: Distressed establishments meeting DOLE financial loss standards.',
          'Exemption 2: Retail/service establishments and other enterprises employing NOT MORE THAN TEN (≤10) regular workers.',
          'Exemption 3: Micro-business enterprises (BMBEs) registered under R.A. 9178 with total assets ≤ ₱3,000,000.',
          'Exemption 4: Establishments already granting similar or more than the benefits provided in R.A. 11210 under a CBA or company policy.',
        ],
      },
      {
        heading: 'Post-Termination Childbirth & Non-Discrimination',
        items: [
          '15-Calendar-Day Post-Separation Rule: Full maternity leave still accrues if childbirth, miscarriage, or ETP occurs NOT MORE THAN fifteen (15) calendar days after termination of service.',
          'Illegal Dismissal Exception: If the pregnant woman is dismissed WITHOUT just cause, the 15-day limit does NOT apply—the employer is liable for the full 105/120/60 days pay in addition to illegal dismissal remedies!',
          'Consecutive Pregnancies / Overlapping Leaves: If a worker becomes pregnant again while on leave, she receives the maternity benefit corresponding to the new delivery/miscarriage consecutively.',
        ],
      },
    ],
    barTips: [
      'Bar Tip: Memorize the 4 Salary Differential exemptions (Distressed, ≤10 workers retail/service, BMBEs, Already granting equal/superior CBA benefits)—outside these 4, private employers MUST top up the SSS benefit to 100% full pay!',
      'Bar Tip: Maternity leave is counted in CALENDAR days (inclusive of Saturdays, Sundays, and Holidays) because it must be continuous and uninterrupted.',
    ],
  },
  {
    id: 'm6-paternity-leave',
    worldId: 'world6',
    title: 'Paternity Leave Act of 1996',
    badge: 'R.A. No. 8187',
    iconName: 'Fire Flower',
    summary:
      '7 calendar days leave with full pay for married male employees in private and public sectors for the first four (4) deliveries (childbirth or miscarriage) of his legitimate spouse with whom he is cohabiting.',
    beginnerSummary:
      'Married working fathers get 7 days of paid leave to support their legitimate wife and newborn for each of the first 4 deliveries or miscarriages (up to 14 days if the mother allocates 7 days under R.A. 11210!).',
    practicalTakeaway:
      'Always verify civil marriage first in Bar questions: an unmarried live-in father gets ZERO days under R.A. 8187, though his partner can still allocate up to 7 days of her maternity leave to him under R.A. 11210.',
    keyDoctrines: [
      'Every married male employee in the private and public sectors shall be entitled to a paternity leave of seven (7) days with full pay for the first four (4) deliveries of the legitimate spouse with whom he is cohabiting (Sec. 2, R.A. 8187).',
      'Delivery includes live childbirth (normal or cesarean) OR any miscarriage / abortion.',
      'Cohabitation includes constructive cohabitation where spouses are temporarily living apart due to job assignment or overseas/provincial work.',
      'Paid 100% directly by the EMPLOYER (unlike maternity leave, Paternity Leave is NOT reimbursed by SSS).',
    ],
    rules: [
      {
        heading: '5 Mandatory Requisites for Entitlement',
        description: 'Under R.A. 8187 & its Joint CSC-DOH-DOLE IRR, all 5 conditions must concur:',
        items: [
          '1. Legitimate Marriage: Male worker is legally married to the woman who gave birth or miscarried.',
          '2. Employment Status: He is an employee (regular, probationary, casual, or project) at the time of delivery.',
          '3. Cohabitation: He is cohabiting with his legitimate wife at the time of delivery/miscarriage.',
          '4. Prior Notification: He has notified his employer of his wife’s pregnancy and expected delivery date within a reasonable time (except in unforeseen miscarriages/emergencies).',
          '5. Delivery Cap: The childbirth or miscarriage is within the FIRST FOUR (4) deliveries of that legitimate spouse.',
        ],
      },
      {
        heading: 'Availment Window, Pay Rate & Non-Conversion',
        items: [
          'Availment Window: Enjoyed after delivery (typically within 60 days from delivery date), without prejudice to employer policy allowing availment before or during actual delivery for medical accompaniment.',
          'Full Pay: Basic salary + mandatory allowances for 7 days, shouldered wholly by the employer.',
          'Non-Cumulative & Non-Convertible: Unused paternity leave cannot be carried over to future deliveries and cannot be converted into cash.',
        ],
        tableData: {
          headers: ['Feature', 'R.A. 8187 Paternity Leave', 'R.A. 11210 Allocated Father Leave'],
          rows: [
            ['Number of Paid Days', '7 days', 'Up to 7 days (deducted from mother’s 105/120d)'],
            ['Marriage Required?', 'YES — must be legally married spouse', 'NO — applies regardless of civil status'],
            ['Delivery Limit', 'First 4 deliveries (incl. miscarriages)', 'Unlimited (every live childbirth)'],
            ['Applies to Miscarriage?', 'YES — covers childbirth or miscarriage', 'NO — live childbirth only'],
            ['Funding Source (Private)', '100% Employer-paid', 'SSS Maternity Benefit + Employer Differential'],
          ],
        },
      },
    ],
    barTips: [
      'Bar Tip: Can a married father enjoy 14 paid days for his wife’s 1st live childbirth? YES! 7 days under R.A. 8187 + 7 allocated days under R.A. 11210 (reducing the mother’s 105 days to 98 days). What about their 5th live childbirth? He gets 0 under R.A. 8187, plus up to 7 allocated days under R.A. 11210!',
    ],
  },
  {
    id: 'm6-solo-parents-leave',
    worldId: 'world6',
    title: 'Solo Parents Parental Leave & Expanded Welfare',
    badge: 'R.A. No. 8972 & R.A. No. 11861',
    iconName: 'Super Star',
    summary:
      '7 working days forfeitable paid parental leave per year for solo parent employees with at least 6 months of service (lowered from 1 year by R.A. 11861) and a valid Solo Parent ID, plus flexible work schedules, telecommuting priority, and non-discrimination.',
    beginnerSummary:
      'Solo parents with at least 6 months of work and a Solo Parent ID get 7 paid working days off each year to attend to parental duties, plus protected flexible schedules and child scholarships.',
    practicalTakeaway:
      'Watch out for the two big R.A. 11861 amendments tested in exams: (1) minimum service requirement dropped from 1 year to 6 MONTHS, and (2) dependent child age ceiling rose from 18 to 22 YEARS OLD or below (unmarried and unemployed).',
    keyDoctrines: [
      'A forfeitable and non-cumulative parental leave of not more than seven (7) working days with pay every year shall be granted to any solo parent employee, regardless of employment status, who has rendered service of at least six (6) months (Sec. 8, R.A. 8972 as amended by R.A. 11861).',
      'Applies to both public and private sector employees holding a valid Solo Parent Identification Card (SPIC).',
      'Anti-Discrimination & Flexible Work (Secs. 6 & 7): Employers cannot discriminate against solo parents and must provide flexible work schedules (provided company productivity is unaffected) and telecommuting priority.',
      'Occasional/Seasonal Gifts Rule: Sporadic gifts or insufficient hand-outs from the other parent that fall short of legal Family Code support do NOT strip a solo parent of solo-parent status.',
    ],
    rules: [
      {
        heading: '6 Statutory Categories of Solo Parents (R.A. 11861)',
        description: 'Under Sec. 4 of the Expanded Solo Parents Welfare Act, solo parents encompass:',
        items: [
          'Category 1 (Sole Parental Care Events): Parent left solo due to (a) birth from rape (even without final conviction); (b) death of spouse; (c) spouse detained ≥3 months or serving criminal sentence; (d) certified physical/mental incapacity of spouse; (e) legal or de facto separation ≥6 months with sole care; (f) nullity/annulment/recognized divorce with sole care; (g) abandonment ≥6 months.',
          'Category 2 (OFW Spouse/Family Member): Spouse or family member caring for children of a low/semi-skilled OFW abroad continuously for ≥12 months.',
          'Category 3 (Unmarried Parent): Unmarried mother or father who solely keeps and rears the child.',
          'Category 4 (Legal Guardian / Adoptive / Foster Parent): Solely providing parental care and support.',
          'Category 5 (4th-Degree Relative / Senior Grandparent): Assuming sole care for ≥6 months after parents’ death, abandonment, or disappearance (dependent unmarried/unemployed ≤22 yrs old, or any age if PWD incapable of self-support).',
          'Category 6 (Pregnant Woman): Providing sole parental care and support to her unborn child.',
        ],
      },
      {
        heading: 'Conditions for 7-Day Parental Leave & Termination of Status',
        items: [
          '1. Rendered at least six (6) months of service (continuous or broken, regardless of probationary/project/regular status).',
          '2. Notified employer within a reasonable period prior to leave (or immediately in emergencies).',
          '3. Presented a valid LGU-issued Solo Parent Identification Card (SPIC, renewable yearly).',
          'Forfeitable Nature: Strictly non-cumulative and NOT convertible to cash if unavailed within the year (unless a CBA or company policy grants cash conversion).',
          'Termination of Eligibility: Ceases upon remarriage, cohabitation, or resumption of shared parental support.',
        ],
      },
      {
        heading: 'Additional Economic & Educational Benefits (R.A. 11861)',
        items: [
          'Monthly Cash Subsidy (₱1,000/month from LGU) + 10% Discount & VAT Exemption on baby milk, diapers, medicines, and micronutrient supplements (for solo parents earning minimum wage or below with child ≤6 yrs old).',
          'Full Scholarship: DepEd/CHED/TESDA full scholarship for one (1) qualified child (≤22 years old, unmarried, unemployed).',
        ],
      },
    ],
    barTips: [
      'Bar Tip: Note the unit difference! Solo Parent Leave is "7 WORKING days", whereas Paternity Leave is "7 CALENDAR days" and Maternity Leave is "105/60 CALENDAR days"!',
      'Bar Tip: Absence of marriage alone does NOT make cohabiting partners "solo parents"—if unmarried partners live together and share child-rearing, neither qualifies as a solo parent.',
    ],
  },
  {
    id: 'm6-gynecological-leave',
    worldId: 'world6',
    title: 'Special Leave for Women (Gynecological Surgery)',
    badge: 'R.A. No. 9710 (Magna Carta of Women)',
    iconName: '1-Up Mushroom',
    summary:
      'Up to two (2) months paid special leave based on gross monthly compensation following surgery caused by gynecological disorders, for female employees with at least 6 months continuous aggregate service in the last 12 months.',
    beginnerSummary:
      'Female workers who undergo surgical operations for reproductive/gynecological disorders get up to 2 months of recovery leave with 100% full pay.',
    practicalTakeaway:
      'Distinguish carefully in exam problems: Surgical curettage (D&C) due to MISCARRIAGE falls under the 60-day Expanded Maternity Leave (R.A. 11210), whereas surgical operation for MYOMA, OVARIAN CYST, or HYSTERECTOMY (non-pregnancy gynecological disorder) falls under the 2-month R.A. 9710 Special Leave!',
    keyDoctrines: [
      'A woman employee having rendered continuous aggregate employment service of at least six (6) months for the last twelve (12) months shall be entitled to a special leave benefit of up to two (2) months with full pay based on her gross monthly compensation following surgery caused by gynecological disorders (Sec. 18, R.A. 9710; DOLE D.O. No. 112-11).',
      'Gynecological disorders refer to disorders that would require surgical procedures such as dilatation and curettage (non-pregnancy related) and those involving female reproductive organs (vagina, cervix, uterus, fallopian tubes, ovaries, breast adnexa) certified by a competent physician.',
      'Full Pay = Gross Monthly Compensation (monthly basic pay PLUS mandatory allowances fixed by Regional Wage Orders).',
    ],
    rules: [
      {
        heading: 'Eligibility, Duration & Employer Payment Rule',
        items: [
          'Service Requirement: At least six (6) months continuous aggregate employment service within the twelve (12) months immediately preceding the surgery.',
          'Surgical Requirement: Actual surgical procedure certified by a competent medical specialist (non-surgical medication/bed rest alone uses regular SL/SSS sickness, not R.A. 9710).',
          'Maximum Duration: Up to two (2) months (60 calendar days) per year depending on the recuperation period certified by the attending surgeon.',
          'Pay Source: Paid directly by the employer; in the private sector, if the employee also qualifies for SSS Sickness Benefit, the employer tops up or coordinates per DOLE D.O. 112-11 so she receives 100% gross monthly compensation without double recovery.',
        ],
      },
      {
        heading: 'Non-Commutation & Interplay with Maternity Leave',
        items: [
          'Non-Cumulative & Non-Convertible: Unused special leave benefit cannot be accumulated or converted to cash.',
          'No Double Availment for Same Contingency: Where the woman already availed of Maternity Leave under R.A. 11210 for a miscarriage/ETP, she cannot simultaneously claim R.A. 9710 Special Leave for the exact same obstetrical event.',
          'Earned Leave Preservation: Availing of R.A. 9710 Special Leave does NOT deduct from the employee’s statutory 5-day SIL or company Vacation Leave.',
        ],
      },
    ],
    barTips: [
      'Bar Tip: Remember the keywords for R.A. 9710 Sec. 18: (1) 6 months continuous aggregate service in last 12 months, (2) SURGERY for gynecological disorder, (3) Up to 2 months GROSS monthly pay, (4) Non-convertible to cash!',
    ],
  },
  {
    id: 'm6-vawc-leave',
    worldId: 'world6',
    title: 'VAWC Victim Leave (Anti-Violence Against Women & Children)',
    badge: 'R.A. No. 9262 (Sec. 43)',
    iconName: 'Star Power Shield',
    summary:
      'Up to 10 days paid leave (in addition to other statutory/CBA leaves) for female employees who are victims of physical, sexual, psychological, or economic violence, extendible when necessity arises as specified in a Protection Order (BPO, TPO, PPO).',
    beginnerSummary:
      'Woman employees experiencing domestic or intimate partner violence get up to 10 paid days off (extendible by Protection Order) to attend to medical and legal safety needs—with zero minimum tenure required!',
    practicalTakeaway:
      'Unlike SIL (1 year) or Solo Parent / Gynecological Leave (6 months), VAWC Leave has ZERO minimum service requirement—even a newly hired Day-1 probationary woman employee is protected!',
    keyDoctrines: [
      'Victims under R.A. 9262 shall be entitled to take a paid leave of absence up to ten (10) days in addition to other paid leaves under the Labor Code and Civil Service Rules and Regulations, extendible when the necessity arises as specified in the protection order (Sec. 43, R.A. 9262).',
      'Sole Documentary Requirement: Certification from the Punong Barangay or Barangay Kagawad, Prosecutor, or Clerk of Court that an action relative to VAWC is pending (final conviction is NEVER required).',
      'Strict Confidentiality & Anti-Retaliation: Any employer who prejudices, discriminates against, or terminates an employee for availing of VAWC leave is liable for discrimination and contempt of court under Sec. 43.',
    ],
    rules: [
      {
        heading: 'Entitlement, Zero-Tenure Protection & Extension',
        items: [
          'Covered Persons: Any woman employee who is a victim of physical, sexual, psychological, or economic abuse (or whose child is a victim of VAWC) committed by a spouse, former spouse, dating partner, sexual partner, or person with whom she has a common child.',
          'No Tenure Requirement: Applies immediately regardless of length of service or employment status.',
          'Duration & Pay: Up to ten (10) working days with full pay (basic salary + mandatory allowances).',
          'Statutory Extension: Extendible beyond 10 days when the necessity arises AS SPECIFIED IN THE PROTECTION ORDER (BPO, TPO, or PPO).',
          'Non-Cumulative & Non-Convertible: Unused VAWC leave cannot be accumulated or converted to cash.',
        ],
      },
      {
        heading: 'Employer Duties & Penal Sanctions',
        items: [
          'Additionality: Must NEVER be deducted from the employee’s 5-day SIL, Solo Parent Leave, or company VL/SL.',
          'Strict Confidentiality: Employer and HR officers must keep all VAWC records strictly confidential.',
          'Battered Woman Syndrome (Sec. 26) & Offender Intoxication (Sec. 27): Being under the influence of alcohol/illicit drugs is NOT a valid defense for the perpetrator.',
        ],
      },
    ],
    barTips: [
      'Bar Tip: VAWC Leave is the ONLY special leave in World 6 that can be EXTENDED WITH PAY beyond its base 10 days when expressly specified in a Protection Order!',
    ],
  },
  {
    id: 'm6-statutory-leave-matrix-special',
    worldId: 'world6',
    title: 'Master Statutory Leaves Matrix, Adoptive Leaves & Prescription',
    badge: 'Arts. 95, 100 & 306 · R.A. 11210, 8187, 11861, 9710, 9262, 11642',
    iconName: 'Royal Star',
    summary:
      'Unified Bar Exam comparison across all 6 Philippine statutory leaves, Adoptive Parent Leave rights under R.A. 11642 / CSC-DOLE rules, voluntary company leaves (Bereavement, Emergency, Study) protected by Art. 100 Non-Diminution, and 3-year money claim prescription rules.',
    beginnerSummary:
      'Your ultimate side-by-side cheat sheet comparing every Philippine paid leave law: who qualifies, how many days you get, who pays, and which leaves convert to cash!',
    practicalTakeaway:
      'Memorize the golden rule for Bar MCQ & Essay exams: Out of ALL statutory annual leaves in Philippine Labor Law, ONLY regular Art. 95 Service Incentive Leave (SIL) is cumulative and convertible to cash at year-end or resignation!',
    keyDoctrines: [
      'Golden Rule on Cash Commutation: Among statutory leaves, ONLY regular Art. 95 Service Incentive Leave (SIL) is commutable to cash if unused; Paternity Leave, Solo Parent Leave, Gynecological Surgery Leave, VAWC Leave, and Kasambahay SIL are all NON-CUMULATIVE and NON-CONVERTIBLE to cash (unless upgraded by CBA/company policy).',
      'Adoptive Parents Leave (R.A. 8552 / R.A. 11642 Domestic Administrative Adoption and Alternative Child Care Act): Qualified adoptive parents are entitled to adoption leave benefits analogous to maternity and paternity leaves to allow bonding with the pre-adoptive child.',
      'Company-Granted Leaves & Art. 100 Non-Diminution: Emergency leave, bereavement leave, birthday leave, and union leave are not mandated by statute, but once voluntarily granted by CBA or established company practice over a considerable period, they cannot be unilaterally withdrawn or reduced (Art. 100, Labor Code).',
    ],
    rules: [
      {
        heading: 'Complete 6-Statute Philippine Leave Comparison Matrix',
        description:
          'Master comparative table of all mandatory leaves tested in the Philippine Bar Examinations:',
        tableData: {
          headers: [
            'Statutory Leave',
            'Duration',
            'Minimum Service',
            'Key Qualification',
            'Cash Convertible?',
          ],
          rows: [
            [
              'Service Incentive Leave (Art. 95)',
              '5 days / year',
              '12 months (continuous/broken)',
              'Rank-and-file in firm with ≥10 workers; not enjoying ≥5d VL',
              'YES (Commutable & Cumulative)',
            ],
            [
              'Expanded Maternity (R.A. 11210)',
              '105d live (+15d solo) / 60d miscarriage',
              '3 SSS mos. in 12-mo. period before semester',
              'All female workers; every pregnancy; up to 7d transferable',
              'Paid cash benefit (Continuous leave)',
            ],
            [
              'Paternity Leave (R.A. 8187)',
              '7 calendar days',
              'Employed at time of delivery',
              'Legally married male cohabiting with wife; first 4 deliveries',
              'NO (Forfeited if unused)',
            ],
            [
              'Solo Parent Leave (R.A. 8972 / 11861)',
              '7 working days / year',
              'At least 6 months service',
              'Valid Solo Parent ID (SPIC) + sole parental care (child ≤22)',
              'NO (Forfeitable & Non-cumulative)',
            ],
            [
              'Gynecological Surgery (R.A. 9710)',
              'Up to 2 months (Gross Pay)',
              '6 mos. aggregate in last 12 mos.',
              'Certified surgical operation for gynecological disorder',
              'NO (Non-convertible)',
            ],
            [
              'VAWC Victim Leave (R.A. 9262)',
              'Up to 10 days (+PO extension)',
              'NONE (Applies from Day 1)',
              'Woman VAWC victim + Barangay/Prosecutor/Court cert.',
              'NO (Non-convertible)',
            ],
          ],
        },
      },
      {
        heading: 'Adoptive Parents, Special Sectoral & Company-Initiated Leaves',
        items: [
          'Adoptive Parents Leave (R.A. 11642 Sec. 43 / CSC Rules): Pre-adoptive parents holding a Pre-Adoption Placement Authority (PAPA) from NACC enjoy paid adoption leave benefits to foster adjustment and bonding.',
          'Quarantine / Public Health Leave & Calamity Leave: In the private sector, DOLE encourages paid calamity/quarantine leaves or flexible crediting against existing company leaves; in the public sector, CSC grants 5-day Special Emergency (Calamity) Leave.',
          'Voluntary Company Leaves (VL, SL, Bereavement, Paternity Top-Up): Governed by employment contract, company handbook, or CBA; unused VL/SL convert to cash ONLY if stipulated in policy/CBA or proven as consistent, deliberate company practice (Art. 100).',
        ],
      },
      {
        heading: 'Prescriptive Periods for Leave & Money Claims (Art. 306)',
        items: [
          'General Money Claims Rule (Art. 306): All money claims arising from employer-employee relations accrue and must be filed within THREE (3) YEARS from the time the cause of action accrued; otherwise they are forever barred.',
          'Special SIL Accrual Exception (Auto Bus Transport Systems v. Bautista): Because an employee has the option to hold onto SIL credits until separation, the 3-year clock for unpaid accumulated SIL starts ONLY upon employer’s refusal after demand OR upon separation from employment.',
          'Illegal Dismissal + Leave Claims: An action for illegal dismissal prescribes in FOUR (4) YEARS under Art. 1146 of the Civil Code (injury to rights), while ancillary pure money claims follow Art. 306 / Auto Bus rules.',
        ],
      },
    ],
    barTips: [
      'Bar Tip: Watch the tenure ladder across World 6! VAWC & Paternity = 0 months (Day 1) | Solo Parent & Gynecological = 6 months | Regular SIL & Kasambahay SIL = 12 months (1 year)!',
      'Bar Tip: Watch how days are counted! SIL = 5 days | Solo Parent = 7 WORKING days | Paternity = 7 CALENDAR days | VAWC = 10 days (+PO extension) | Maternity = 105 / 120 / 60 CALENDAR days!',
    ],
  },
];
