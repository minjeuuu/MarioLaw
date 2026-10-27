import { LawTopic } from '../types/laborLaw';

export const MODULE_2_REST_HOLIDAYS_13TH: LawTopic[] = [
  {
    id: 'm2-rest-days',
    worldId: 'world2',
    title: 'Weekly Rest Periods & Emergency Rest Day Work',
    badge: 'Art. 91-93 Labor Code',
    iconName: '1-Up Mushroom',
    summary: 'Statutory rest days, religious preference scheduling, 6 emergency work exceptions, and premium pay formulas.',
    keyDoctrines: [
      'Every employee is entitled to not less than twenty-four (24) consecutive hours of rest after every six (6) consecutive normal work days.',
      'Religious preference: written notice at least 7 days before preferred day; employer may schedule at least two (2) days a month if operations would be prejudiced.',
      'Work rendered on a rest day or special holiday entitles the employee to 100% regular remuneration plus at least 30% premium pay (130% total).',
    ],
    rules: [
      {
        heading: 'Weekly Rest Periods (Art. 91)',
        items: [
          'Mandatory Duration: Not less than twenty-four (24) consecutive hours after every six (6) consecutive normal work days.',
          'Religious Preference: If an employee, for religious reasons, prefers a particular day as his rest day, he should make it known in writing at least seven (7) days before the preferred day.',
          'Operational Prejudice Exception: Where employee choice prejudices operations and employer cannot resort to other remedial measures, the employer may schedule the weekly rest day to meet the employee’s choice for at least two (2) days in a month.',
        ],
      },
      {
        heading: '6 Instances When Employer May Compel Rest Day Work',
        description: 'Under Art. 92, an employer may require employees to work on their scheduled rest day only in the following emergency cases:',
        items: [
          '1. In case of actual or impending emergencies caused by serious accident, fire, flood, typhoon, earthquake, epidemic, or other disaster or calamity to prevent loss of life and property, or imminent danger to public safety.',
          '2. In cases of urgent work to be performed on the machinery, equipment, or installation, to avoid serious loss which the employer would otherwise suffer.',
          '3. In the event of abnormal pressure of work due to special circumstances, where the employer cannot ordinarily be expected to resort to other measures.',
          '4. To prevent loss or damage to perishable goods.',
          '5. Where the nature of the work requires continuous operations and the stoppage of work may result in irreparable injury or loss to the employer.',
          '6. Other circumstances analogous or similar to the abovementioned.',
        ],
      },
      {
        heading: 'Compensation for Rest Day, Sunday, or Special Holiday Work',
        items: [
          'Standard Premium: For work done on a rest day and special holidays, the employer must pay the regular remuneration (100%), and an additional sum (premium pay) of at least 30% (total 130%).',
          'Monthly-Paid Employees: The first 100% corresponding to regular remuneration may or may not already be part of monthly salary. If already included, employee collects the 30% premium only. If not included, employee receives the entire 130%.',
        ],
      },
    ],
    barTips: [
      'Bar Tip: When a special holiday falls on the employee’s scheduled rest day and the employee works, the premium is 50% (total 150% for first 8 hours), not 30%!',
    ],
  },
  {
    id: 'm2-holiday-pay',
    worldId: 'world2',
    title: 'Holiday Pay, Double Holidays & Special Days',
    badge: 'Art. 94 Labor Code',
    iconName: 'Super Star',
    summary: 'The statutory gift of a day’s pay, 12 Regular Holidays, 9 Special Holidays, Double Holidays, Bad Weather rules, and leave precedents.',
    keyDoctrines: [
      'Holiday pay is a day’s pay given by law even if an employee does not work on a regular holiday.',
      'Unworked Regular Holiday = 100%; Worked Regular Holiday = 200% for first 8 hours; excess OT = +30% of hourly rate on that day.',
      'Worked Regular Holiday on Rest Day = 260% (200% + 30% of 200%).',
      'Worked Double Holiday = 300%; Unworked Double Holiday = 200% (if present or on paid leave preceding day).',
      'Leave with pay preceding holiday gives holiday pay entitlement; leave without pay preceding holiday forfeits holiday pay unless worked.',
      'Special Holidays: "No work, no pay" principle applies unless company policy/CBA provides otherwise.',
    ],
    rules: [
      {
        heading: '12 Regular Holidays (Listed by Law)',
        items: [
          '1. New Year’s Day – January 1',
          '2. Maundy Thursday – Movable Date',
          '3. Good Friday – Movable Date',
          '4. Araw ng Kagitingan – April 9',
          '5. Labor Day – May 1',
          '6. Independence Day – June 12',
          '7. National Heroes Day – Last Sunday of August',
          '8. Bonifacio Day – November 30',
          '9. Eid al-Fitr – Movable Date',
          '10. Eid al-Adha – Movable Date',
          '11. Christmas Day – December 25',
          '12. Rizal Day – December 30',
        ],
      },
      {
        heading: '9 Special Holidays (Special Non-Working Days)',
        items: [
          '1. Chinese New Year – February 19',
          '2. EDSA Revolution – February 25',
          '3. Black Saturday – Movable Date',
          '4. Ninoy Aquino Day – August 21',
          '5. All Saints’ Day – November 1',
          '6. Last Day of the Year – December 31',
          '7. Special Non-Working Holiday',
          '8. Special Public Holiday',
          '9. Special National Holiday',
        ],
      },
      {
        heading: 'Rules for Regular Holidays',
        subSections: [
          {
            title: 'On Employee Regular Workday',
            items: [
              'If did not work: 100% of daily wage.',
              'If worked: 200% for the first eight (8) hours, with an additional 30% of hourly rate on said day if in excess of 8 hours.',
            ],
          },
          {
            title: 'On Employee Scheduled Rest Day',
            items: [
              'If did not work: 100% of daily wage.',
              'If worked: 200% + 30% of 200% (total 260%) for the first eight (8) hours, with an additional 30% of hourly rate on said day if in excess of 8 hours.',
            ],
          },
        ],
      },
      {
        heading: 'Rules for Special Holidays',
        items: [
          'If did not work: No pay ("no work, no pay"), unless there is a favorable company policy, practice, or CBA granting wages even if unworked.',
          'If worked: Regular daily rate (100%) plus 30% premium (total 130%) for first 8 hours, with additional 30% hourly rate on said day for excess OT hours.',
          'If worked and falls on Rest Day: Regular daily rate (100%) plus 50% premium (total 150%) for first 8 hours, with additional 30% hourly rate on said day for excess OT hours.',
          'Special Working Holidays: Employee entitled only to basic rate; no premium pay required since treated as an ordinary working day.',
        ],
      },
      {
        heading: 'Double Regular Holiday & Holiday-Sunday Rules',
        items: [
          'Double Regular Holiday (2 regular holidays on same day): Entitled to at least 200% of basic wage even if unworked (provided worked or on leave with pay preceding day). If worked, entitled to 300% of basic wage.',
          'Regular Holiday Falling on Sunday: The following Monday shall NOT be a holiday unless a presidential proclamation is issued declaring it a special holiday.',
          'Successive Holidays: An employee is entitled to Holiday Pay for both days if he works on the first holiday, which entitles him to pay on the second holiday.',
        ],
      },
      {
        heading: 'Absences, Weather & Temporary Shutdowns',
        items: [
          'Bad Weather Days: Suspension lies in the sound judgment of the employer. No salary deduction if company practice/CBA grants wages during calamities; otherwise, employer may charge absence against accrued or future leave credits.',
          'Non-Working / Scheduled Rest Day Preceding Holiday: Employee shall not be deemed on leave of absence; entitled to holiday pay if worked on day immediately preceding the non-working day or rest day.',
          'Leave of Absence With Pay Preceding Holiday: Entitled to holiday pay.',
          'Leave of Absence Without Pay Preceding Holiday: NOT entitled to holiday pay unless employee actually works on the regular holiday.',
          'Temporary Cessation (Inventory/Repairs): Entitled to holiday pay during temporary shutdowns for annual inventory or machinery repairs/cleaning.',
          'Business Reverses: Employer may NOT pay employees for regular holidays during suspension if cessation of operation is due to severe business reverses.',
        ],
      },
      {
        heading: 'Special Categories of Workers for Holiday Pay',
        items: [
          'Hourly-Paid Teachers: In private schools, obliged to work and consent to be paid only for work actually done, except in emergency/fortuitous events. Not paid for regular holidays during semesters or vacations, but MUST be paid regular hourly rate on days declared as special holidays.',
          'Workers Paid by Results / Output: Holiday pay shall not be less than average daily earnings for the last seven (7) actual working days preceding the regular holiday; in no case less than statutory minimum wage.',
          'Seasonal Workers: May not be paid holiday pay during off-season when not at work.',
          'Seafarers: Watch-keeping or hours of work on rest days/holidays must be paid rest day or holiday pay.',
        ],
      },
    ],
    barTips: [
      'Bar Tip: Unworked Double Holiday = 200%. Worked Double Holiday = 300%. Double Holiday on rest day worked with OT reaches up to 557.7% with night differential!',
      'Bar Tip: A day preceding holiday is Sunday (rest day). Employee worked on Saturday. Is employee entitled to Monday regular holiday pay? YES, because Saturday was the day immediately preceding the non-working rest day.',
    ],
  },
  {
    id: 'm2-service-charge',
    worldId: 'world2',
    title: 'Service Charge Distribution',
    badge: 'R.A. No. 11360',
    iconName: 'Coin Block',
    summary: 'The 100% full distribution rule for service charges, covered establishments, managerial exclusion, frequency, and integration into wages.',
    keyDoctrines: [
      '100% of collected service charges shall be distributed completely to covered employees, and management receives 0% (Republic Act No. 11360).',
      'Covers ALL rank-and-file employees, including regular, non-regular, contractual, and agency-hired workers.',
      'Managerial employees are strictly excluded from sharing in service charges.',
      'Shares must be distributed not less than once every 2 weeks or twice a month at intervals not exceeding 15 days.',
      'Service charges cannot be used to offset any increases in the mandated minimum wage.',
      'If service charge is abolished, the average share is deemed integrated into basic wages.',
    ],
    rules: [
      {
        heading: 'Covered Establishments (RA 11360)',
        items: [
          '1. Hotels, restaurants, lodging houses, night clubs, cocktail lounges, massage clinics, bars, casinos, and gambling houses, and similar enterprises.',
          '2. Entities operating primarily as private subsidiaries of the government.',
        ],
      },
      {
        heading: 'Beneficiaries & Managerial Exclusion',
        items: [
          'Covered Employees: All rank-and-file employees, regardless of positions, designations, employment status (regular, probationary, contractual, casual), and irrespective of method of wage payment (including agency-hired workers).',
          'Strict Exception: Managerial employees (vested with powers to lay down management policies, hire, transfer, suspend, lay off, discharge, or discipline) are barred from receiving service charge shares.',
        ],
      },
      {
        heading: 'Distribution Mandate & Protection of Wages',
        items: [
          'Distribution Ratio: 100% of service charges collected shall go to covered employees; management receives 0%.',
          'Manner of Distribution: Distributed not less than once every two (2) weeks or twice a month at intervals not exceeding fifteen (15) days.',
          'Integration Rule: If the service charge is abolished, the shares of covered employees shall be considered integrated into their basic wages.',
          'Wage Offset Prohibition: Service charges cannot be used by an employer to offset or credit against any increases in the mandated minimum wage.',
        ],
      },
    ],
    barTips: [
      'Bar Tip: Under the old law, the ratio was 85%-15%. Under R.A. No. 11360, it is 100% to rank-and-file employees, 0% to management. Contractual and agency workers are entitled!',
    ],
  },
  {
    id: 'm2-13th-month',
    worldId: 'world2',
    title: '13th Month Pay',
    badge: 'Presidential Decree No. 851',
    iconName: 'Coin Block',
    summary: 'Mandatory 13th month pay, December 24 deadline, basic wage definition, exclusions, pro-rata separation computations, and bonus distinctions.',
    keyDoctrines: [
      'All employers are required to pay all rank-and-file employees a 13th month pay not later than December 24 of each year, provided they worked for at least 1 month during the calendar year.',
      'The formula is 1/12 of the total basic salary earned by an employee within a calendar year.',
      'Basic salary excludes: unused vacation/sick leaves, overtime, premium, night shift differential, holiday pay, and cost of living allowances (COLA).',
      'Substitute payment in the form of groceries, food, or free electricity is ILLEGAL and void.',
      'Resigned or terminated employees are entitled to pro-rated 13th month pay upon cessation of employment.',
    ],
    rules: [
      {
        heading: 'Coverage & Deadline (PD 851)',
        items: [
          'General Mandate: All employers must pay all rank-and-file employees 13th month pay not later than December 24 of each year, provided they have worked for at least one (1) month during the calendar year.',
          'Payment Schedule: General Rule: Not later than December 24. Exception: Employer may give half (1/2) before school opening and the other half on or before December 24, or as agreed in a CBA.',
        ],
      },
      {
        heading: '3 Exempted Employers',
        items: [
          '1. The Government, its political subdivisions, including GOCCs (except those operating essentially as private subsidiaries of the government).',
          '2. Employers already paying their employees a 13th month pay or more in a calendar year, or its equivalent.',
          '3. Employers of those who are paid on purely commission, boundary, or task basis and performing specific work, regardless of time consumed.',
          'Concept of Equivalent: Christmas bonus, mid-year bonus, cash bonuses amounting to not less than 1/12 of basic salary. Excludes: cash/stock dividends, COLA, allowances, and non-monetary benefits.',
        ],
      },
      {
        heading: 'Basic Salary: Inclusions vs Exclusions',
        items: [
          'Inclusions: All remunerations or earnings paid by employer for services rendered, including COLA integrated into basic salary.',
          'Exclusions (CANNOT be included in 13th month base): (a) Unused vacation and sick leave credits; (b) Overtime pay; (c) Premium pay; (d) Night shift differential; (e) Holiday pay; (f) Cost of living allowances (COLA).',
        ],
      },
      {
        heading: '6 Special Cases in 13th Month Pay',
        subSections: [
          {
            title: '1. Workers Paid by Results (Piece-Rate Workers)',
            items: ['Entitled to 1/12 of total basic salary earned during the calendar year.'],
          },
          {
            title: '2. Workers with Fixed or Guaranteed Wage + Commission',
            items: ['Basis for computation is their fixed/guaranteed wage plus commission if commission is an integral part of basic salary.'],
          },
          {
            title: '3. Workers with Multiple Employers',
            items: [
              'Government employees working part-time in private institutions, or employees with 2+ private employers (full-time or part-time), are entitled to 13th month pay from ALL private employers regardless of total earnings from each.',
            ],
          },
          {
            title: '4. Private School Teachers',
            items: [
              'Entitled regardless of months taught or paid within a year, provided they served at least 1 month. Overload pay is excluded (overload is not overtime).',
            ],
          },
          {
            title: '5. Resigned or Separated Employees',
            items: [
              'Entitled to 13th month pay in proportion to length of time worked during the calendar year (from start date or Jan 1 to date of resignation/separation).',
            ],
          },
          {
            title: '6. Terminated Employees',
            items: ['Demandable upon the cessation of the employer-employee relationship.'],
          },
        ],
      },
      {
        heading: 'Commissions, Substitute Payment & Productivity Bonuses',
        items: [
          'Commissions: If commissions are properly considered part of basic salary, they are included; if not an integral part, they are excluded.',
          'Substitute Payment Strictly Prohibited: Substitute payment is NOT allowed. Benefits in the form of food, rice, or free electricity are NOT proper substitutes for 13th month pay. Year-end loyalty rewards also cannot substitute.',
          'Productivity Bonuses: Have no direct relation to work done, granted ex gratia by employer; not deemed basic salary and excluded from 13th month computation.',
        ],
      },
    ],
    barTips: [
      'Bar Tip: Giving sacks of rice or gift baskets in lieu of 13th month pay is a labor violation! 13th month pay must be paid in legal tender or cash equivalent.',
      'Bar Tip: For separated employees: Pro-rated 13th month = (Total basic salary earned during the year) / 12.',
    ],
  },
];
