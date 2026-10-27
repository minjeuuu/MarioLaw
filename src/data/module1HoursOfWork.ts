import { LawTopic } from '../types/laborLaw';

export const MODULE_1_HOURS_OF_WORK: LawTopic[] = [
  {
    id: 'm1-coverage',
    worldId: 'world1',
    title: 'Coverage & Exclusions of Minimum Employment Benefits',
    badge: 'Art. 82 Labor Code',
    iconName: 'Mushroom',
    summary: 'Rules on who is entitled to the minimum conditions of employment and statutory working standards under Title I, Book III of the Labor Code.',
    keyDoctrines: [
      'Legal coverage for statutory benefits starts on the first day of employment for every employee, whether temporary or permanent.',
      'The conditions and standards of employment apply ONLY if there exists an employer-employee relationship between the parties.',
      'Field personnel test: actual hours of work in the field cannot be determined with reasonable certainty and are not constantly supervised.',
      'Establishments of retail and service regularly employing fewer than 10 workers are exempt from Holiday Pay and Service Incentive Leave.',
    ],
    rules: [
      {
        heading: '8 Minimum Employment Benefits',
        description: 'Statutory minimum standards guaranteed by the Labor Code from day one of employment:',
        items: [
          '1. Overtime Pay (compensation for work performed beyond 8 hours a day).',
          '2. Meal Break (at least 60 minutes time-off for regular meals).',
          '3. Night Shift Differential (additional 10% for work between 10:00 PM and 6:00 AM).',
          '4. Rest Day (not less than 24 consecutive hours after every 6 consecutive normal workdays).',
          '5. Additional pay for working on rest days or special holidays (premium pay of at least 30%).',
          '6. Holiday Pay (full regular daily wage for unworked regular holidays).',
          '7. Service Incentive Leave (5 days with pay after 1 year of service).',
          '8. Share in service charges (100% full distribution to rank-and-file employees).',
        ],
      },
      {
        heading: '7 Excluded Groups from Coverage',
        description: 'The following groups are outside the coverage of Title I Book III (Working Conditions and Rest Periods):',
        items: [
          '1. Government Employees (governed by Civil Service laws, rules, and regulations).',
          '2. Managerial Employees (vested with powers or prerogatives to lay down management policies or hire/fire).',
          '3. Field Personnel (non-agricultural employees whose work hours away from office cannot be determined with reasonable certainty).',
          '4. Members of the family of the employer who are dependent on him for support.',
          '5. Domestic Helpers (Kasambahay - covered by Republic Act No. 10361).',
          '6. Persons in the personal service of another (performing purely personal comfort/convenience in private home).',
          '7. Workers who are paid by results (piece-rate workers with compensation based on units finished, not time spent).',
        ],
      },
      {
        heading: 'Managerial Employees: Criteria & Conditions',
        description: 'Defined as one whose primary duty consists of the management of the establishment in which they are employed or of a department/subdivision thereof.',
        subSections: [
          {
            title: '4 Conditions of Managerial Positions (Art. 82 / Omnibus Rules)',
            items: [
              '1. Their primary duty consists of the management of the establishment or of a department or subdivision thereof.',
              '2. They customarily and regularly direct the work of two (2) or more employees therein.',
              '3. They have the authority to hire or fire other employees of lower rank.',
              '4. Their suggestions and recommendations as to the hiring and firing and as to the promotion or any other change of status of other employees are given particular weight.',
            ],
          },
        ],
      },
      {
        heading: 'Field Personnel: Definition & Test',
        description: 'Non-agricultural employees who regularly perform their duties away from the principal place of business or branch office of the employer and whose actual hours of work in the field cannot be determined with reasonable certainty.',
        items: [
          'Test of Control & Supervision: To determine whether an employee is a field employee, it is necessary to ascertain if actual hours of work in the field can be determined with reasonable certainty by the employer.',
          'Inquiry: An inquiry must be made as to whether the employee’s time and performance are constantly supervised by the employer. If constantly monitored (via GPS, strict reporting checkpoints, continuous oversight), they are NOT field personnel and ARE entitled to overtime and benefits.',
        ],
      },
      {
        heading: 'Dependent Family Members & Domestic Service',
        description: 'Rules governing family dependents and household personnel:',
        items: [
          'Dependent Family Members: Workers who are family members of the employer, and who are dependent on him for their support, are outside the coverage of the Labor Code on working conditions and rest periods.',
          'Domestic Helpers (Kasambahay): Refers to any person engaged in domestic work within an employment relationship, such as but not limited to: (1) general househelp; (2) nursemaid or "yaya"; (3) cook; (4) gardener; or (5) laundry person.',
          'Excluded from Kasambahay definition: Any person who performs domestic work only occasionally or sporadically and not on an occupational basis.',
          'Persons in the Personal Service of Another: Domestic servants and persons performing services in the employer’s home which are necessary or desirable for maintenance/enjoyment or minister to personal comfort, convenience, or safety of the employer and family.',
        ],
      },
      {
        heading: 'Doctrinal Classifications: Non-Domestic Employees',
        description: 'Supreme Court doctrines on workers performing non-domestic work:',
        items: [
          'Doctrine 1 (Staff House Personnel): House personnel hired by a ranking company official but paid by the company itself to maintain a staff house provided for the official are NOT domestic employees, but regular company workers.',
          'Doctrine 2 (Family Cook Reassigned): A family cook who is later assigned to work as a watcher and cleaner of the employer’s business establishment becomes an industrial worker entitled to receive the wages and benefits flowing from such status.',
        ],
      },
      {
        heading: 'Workers Paid by Result vs Commission Agents vs Contractors',
        description: 'Key distinctions in employment and compensation models:',
        subSections: [
          {
            title: 'Workers Paid by Result (Piece-Rate Workers)',
            items: [
              'Under piece-rate employment, workers have no fixed salaries; compensation is computed based on accomplished tasks or finished units.',
              'Pay is dependent on units of product finished or work completed and NOT on time spent in working.',
            ],
          },
          {
            title: 'Commission Agents (When NOT Employees)',
            items: [
              'Are NOT employees if agents are not required to report for work at any time.',
              'Do not have to devote their time exclusively to or work solely for principal.',
              'Time and effort spent depend entirely upon their own will and initiative.',
              'Not required to account for time nor submit a record of activities.',
              'Shoulder their own selling and transportation expenses.',
              'Paid commission based strictly on a certain percentage of their sales.',
            ],
          },
          {
            title: 'Contractor vs Employee',
            items: [
              'A contractor is NOT an employee. He is self-employed, an expert professional, or a businessman with capital of his own, operating independently from client/principal.',
              'An employee is covered by the Labor Code; an independent contractor is not.',
              'If the contractor hires other workers to do the job, they are HIS employees; contractor becomes an employer covered by the Labor Code.',
              'If contractor merely recruits and supplies workers under the control of the principal, the law treats him as a prohibited labor-only contractor.',
            ],
          },
        ],
      },
      {
        heading: 'Employee Ranks & Working Conditions',
        items: [
          '1. Managerial Employees: Vested with powers or prerogatives to lay down and execute management policies and/or hire, transfer, suspend, lay off, recall, discharge, assign, or discipline employees.',
          '2. Supervisory Employees: Those who, in the interest of the employer, effectively recommend such managerial actions if the exercise of such authority is not merely routinary or clerical in nature but requires the use of independent judgment.',
          '3. Rank-and-File Employees: All employees who do not fall within the definition of managerial and supervisory employees.',
          'Working Conditions Definition: The terms and circumstances affecting the employment of an employee, including policies, programs, and regulations governing employment status, work, work relationships, salary, and benefits.',
          'Management Prerogative: An employer is free to regulate, according to his own discretion, all aspects of employment, except as limited by special laws.',
        ],
      },
      {
        heading: 'Statutory vs. Voluntary Benefits',
        items: [
          'Statutory / Mandatory Benefits: Employment benefits required by law.',
          'Voluntary Benefit: A benefit originated and governed by policy or practice initiated unilaterally by the employer.',
          'Voluntary Contractual Benefit: A non-statutory benefit based on and governed by negotiated stipulations (e.g. CBA).',
          'Enhancement Rule: A statutory benefit may be enhanced or improved by voluntary employer policy or by collective contract.',
        ],
      },
    ],
    barTips: [
      'Bar Tip: Always apply the Test of Control to verify if an employee is truly Field Personnel. Mere outside work is insufficient if their itinerary or output hours are monitored.',
      'Bar Tip: A cook reassigned to clean the company premises transforms from domestic to industrial worker immediately.',
    ],
  },
  {
    id: 'm1-hours-worked',
    worldId: 'world1',
    title: 'Hours of Work, Compensable Time & Travel Time',
    badge: 'Art. 83-84 Labor Code',
    iconName: 'Fire Flower',
    summary: 'The 8-hour workday rule, general principles of compensable hours, waiting time, brownout rules, and travel time classifications.',
    keyDoctrines: [
      'Normal hours of work shall not exceed eight (8) hours a day.',
      'The customary practice of requiring resident physicians to work 24 hours a day violates normal hours of work.',
      'Hospital personnel are no longer entitled to 7 days pay for a workweek of 5 days.',
      'Rest periods or coffee breaks running from 5 to 20 minutes shall be considered compensable working time.',
      'Brownouts <= 20 minutes are compensable hours worked; brownouts > 20 minutes are non-compensable only if employees can leave and use time effectively for own interest.',
      'Undertime on any particular day cannot be offset by overtime on any other day.',
    ],
    rules: [
      {
        heading: 'Normal Hours of Work & Health Personnel',
        items: [
          'General Limit: Normal hours of work should not exceed eight (8) hours a day.',
          'Resident Physicians: The customary practice of requiring resident physicians to work for twenty-four (24) hours a day violates the statutory limitations of normal hours of work.',
          'Hospital Personnel: Hospital personnel are no longer entitled to seven (7) days pay for a workweek of five (5) days.',
          'Employer Right: The right to fix work schedules of employees rests principally with the employer as a management prerogative.',
        ],
      },
      {
        heading: 'Compensable Hours of Work (Art. 84)',
        items: [
          '1. All the time during which an employee is required to be on duty or to be at a prescribed workplace.',
          '2. All the time during which an employee is suffered or permitted to work.',
          'Short Rest Periods: Rest periods of short duration during working hours shall be counted as hours worked.',
        ],
      },
      {
        heading: '4 General Principles in Determining Hours Worked',
        items: [
          '1. All hours are hours worked which the employee is required to give his employer, regardless of whether such hours are spent in productive labor or involve physical or mental exertion.',
          '2. An employee need not leave the premises of the workplace for his rest period to not be counted. It is enough that he stops working, may rest completely, or may leave his workplace to go elsewhere, whether within or outside the premises.',
          '3. If the work performed was necessary, or it benefited the employer, or the employee could not abandon his work at the end of normal hours because he had no replacement, all time spent for such work shall be considered hours worked if the work was with knowledge of employer or immediate supervisor.',
          '4. Time during which an employee is inactive by reason of work interruptions beyond his control is working time IF: (a) the imminence of work resumption requires employee presence at workplace, OR (b) the interval is too brief to be utilized effectively and gainfully in the employee’s own interest.',
        ],
      },
      {
        heading: 'Coffee Breaks, Work Interruptions & Brownouts',
        items: [
          'Short Duration / Coffee Breaks: Running from five (5) to twenty (20) minutes shall be considered as compensable working time.',
          'Leaving Premises: An employee need not leave work premises for rest period to count; it is enough that he stops working, rests completely, and may leave to go elsewhere.',
          'Brownout of Short Duration (<= 20 minutes): Shall be treated as hours worked, whether used productively by employees or not.',
          'Brownout Lasting > 20 minutes: May NOT be treated as hours worked if employees can leave workplace to go elsewhere (within or outside premises), or can use the time effectively for their own interest.',
        ],
      },
      {
        heading: 'Lectures, Meetings, Trainings & Semestral Breaks',
        items: [
          'Lectures/Meetings/Trainings are NOT counted as working time if ALL 3 conditions are met: (a) Attendance is outside regular working hours; (b) Attendance is in fact voluntary; AND (c) The employee does not perform any productive work during attendance.',
          'Sanctioned Attendance: Attendance in lectures, meetings, and training periods sanctioned or required by employer is considered hours worked.',
          'CBA / Grievance Meetings: Attendance at Collective Bargaining Agreement negotiations or grievance meetings is compensable hours worked.',
          'Employee-Filed Hearings: Attendance in hearings in cases filed by the employee is NOT compensable hours worked.',
          'Private School Teachers Semestral Break: Regular full-time teachers are entitled to salary during semestral breaks. These are work interruptions beyond employee control and CANNOT be treated as absences for deduction.',
          'Idle Time: Idle time spent resting/dining where employee may leave work spot (though not premises) is not counted as working time only where work is broken or non-continuous.',
        ],
      },
      {
        heading: 'Travel Time: 3 Specific Categories',
        subSections: [
          {
            title: '1. Travel From Home to Work',
            items: [
              'General Rule: Travel from home to work is NOT compensable worktime.',
              '4 Exceptions (Compensable): (a) When called to travel during an emergency; (b) When travel is done through a conveyance furnished by the employer; (c) Travel is done under vexing and dangerous circumstances; (d) Travel is done under the supervision and control of the employer.',
            ],
          },
          {
            title: '2. Travel That Is All in the Day’s Work',
            items: [
              'Time spent by an employee traveling from jobsite to jobsite during the workday must be counted as hours worked.',
              'Where an employee is required to report at a designated meeting place to receive instructions or perform preparatory work, travel from designated place to workplace is part of the day’s work.',
            ],
          },
          {
            title: '3. Travel Away From Home',
            items: [
              'Travel that keeps an employee away from home overnight is travel away from home.',
              'Travel away from home is worktime when it cuts across the employee’s regular workday. Said time is hours worked not only on regular working hours, but also during corresponding hours on non-working days.',
            ],
          },
        ],
      },
      {
        heading: 'Seamen & Waiting Time / On-Call Rules',
        items: [
          'Work Hours of Seamen: Seamen are provided free living quarters on board. The test for overtime pay is NOT whether they are on board and cannot leave ship, but whether they ACTUALLY rendered service in excess of eight (8) hours.',
          'Waiting Time is Working Time IF: (1) Waiting is an integral part of work; OR (2) Employee is required or engaged by employer to wait.',
          'On-Call Rules: An employee is considered working while on call if required to remain at home or designated location ready to respond. An employee who is NOT required to leave work at home or with company officials where he may be reached is NOT working while on call.',
          'Controlling Factor: Whether waiting time spent in idleness is so spent predominantly for the employer’s benefit or for the employee’s.',
        ],
      },
    ],
    barTips: [
      'Bar Tip: Attendance at CBA grievance meetings = COMPENSABLE. Attendance at employee-filed hearings against employer = NON-COMPENSABLE.',
      'Bar Tip: Brownout threshold is exactly 20 minutes! Up to 20 minutes is compensable regardless of productivity.',
    ],
  },
  {
    id: 'm1-fwa-cww-meals-ot',
    worldId: 'world1',
    title: 'FWA, Compressed Work Week, Meal Periods & Overtime',
    badge: 'Art. 85-87 Labor Code',
    iconName: 'Super Star',
    summary: 'Flexible work schemes, the Compressed Work Week, statutory meal period rules with exceptions, overtime computation, and emergency overtime.',
    keyDoctrines: [
      'Compressed Work Week: work exceeding 8 hours/day waives overtime pay because employees save transport expenses on the 6th day; maximum 12 hours/day or 48 hours/week.',
      'Meal period general rule: not less than 60 minutes time off (non-compensable).',
      'Shortened meal period upon employee request (30 minutes) is non-compensable only when 6 strict conditions are met.',
      'Overtime work rate: 25% of regular wage on regular days, 30% on holidays or rest days.',
      'Undertime cannot be offset by overtime on another day. Right to overtime cannot be waived.',
      'Composite or Package pay is valid only if freely agreed in writing and separately computed amounts equal or exceed legal wage and overtime due.',
    ],
    rules: [
      {
        heading: 'Flexible Work Arrangements (FWA)',
        description: 'Temporary arrangements adopted by employers, requiring prior notice to the DOLE Regional Office having jurisdiction over the workplace:',
        items: [
          '1. Reduction of Work Days: Normal workdays per week are reduced; should not last for more than six (6) months.',
          '2. Rotation of Workers: Employees are rotated or alternatively provided work within the workweek.',
          '3. Forced Leave: Employees are required to go on leave for several days or weeks utilizing leave credits if available.',
          '4. Broken-Time Schedule: Work schedule is not continuous, but total work hours within the day or week remain intact.',
          '5. Flexi-Holidays: Employees agree to avail holidays on other days, provided there is no diminution of existing benefits.',
          '6. Compressed Work Week (CWW): Workweek compressed into fewer than 6 days.',
        ],
      },
      {
        heading: 'Compressed Work Week (CWW) Rules & Conditions',
        items: [
          'Structure: Employees work 5 days instead of 6, each workday exceeding 8 hours because excess hours are taken from the 6th day.',
          'Overtime Waiver: Employees freely agree to waive overtime pay for daily hours exceeding 8 because they no longer incur transport and meal expenses on the 6th day.',
          'Maximum Limits: Total hours of work shall NOT exceed twelve (12) hours a day or forty-eight (48) hours a week.',
          'Condition 1: Undertaken as a result of an express and voluntary agreement of the majority of covered employees or authorized representatives.',
          'Condition 2 (Hazardous firms): In firms using airborne contaminants, human carcinogens, or noise where prolonged exposure poses hazards, there must be a certification from an accredited safety organization or firm safety committee that work beyond 8 hours is within threshold limits.',
          'Condition 3 (DOLE Notice): Employer must notify DOLE Regional Office prior to implementation.',
        ],
      },
      {
        heading: 'Meal Periods (Art. 85)',
        subSections: [
          {
            title: 'General Rule & Standard',
            items: [
              'Every employer shall give employees not less than sixty (60) minutes of time off for regular meals (time off / non-compensable).',
              'The 8-hour workday period does not include the meal break.',
              'Employees are not prohibited from leaving premises during meal breaks as long as they return to their posts on time.',
              'Shortened meal time should be with full pay, and time when employee cannot eat must also be paid.',
            ],
          },
          {
            title: '4 Exceptions: Shortened Meal Period of >= 20 Min Credited as Compensable',
            items: [
              '1. Where work is non-manual in nature or does not involve strenuous physical exertion.',
              '2. Where the establishment regularly operates less than sixteen (16) hours a day.',
              '3. In case of actual or impending emergencies, or urgent work on machinery/installations to avoid serious loss.',
              '4. Where work is necessary to prevent serious loss of perishable goods.',
            ],
          },
          {
            title: 'When Meal Periods are Compensable (Exceptions to General Rule)',
            items: [
              '1. Where lunch period or meal time is predominantly spent for the employer’s benefit.',
              '2. Meal periods of one (1) hour are deemed compensable when the employee is on a continuous shift.',
              '3. Shortened meal period of less than one (1) hour must be compensable.',
            ],
          },
          {
            title: 'Exception to Exception: 30-Minute Meal Period Upon Employee Request (Non-Compensable)',
            items: [
              'Shortened meal break (30 min) upon employee request is NON-COMPENSABLE if all 6 conditions are met:',
              '1. Employees voluntarily agree in writing to shortened 30-minute meal period and waive overtime pay for said period.',
              '2. No diminution whatsoever in salary and fringe benefits existing prior to effectivity.',
              '3. Work does not involve strenuous physical exertion and adequate coffee breaks are provided morning and afternoon.',
              '4. Value of benefits derived from arrangement is equal to or commensurate with compensation due for shortened meal period and 30-min overtime pay as determined by employees.',
              '5. Overtime pay becomes due and demandable if ever employees are permitted or required to work.',
              '6. Arrangement must be of temporary duration.',
            ],
          },
        ],
      },
      {
        heading: 'Overtime Work (Art. 87)',
        items: [
          'Definition: Work exceeding eight (8) hours within the worker’s 24-hour workday. Extra labor taxing the endurance of the worker.',
          'Rates: 25% of regular wage if performed on an ordinary workday; 30% of regular wage if performed on a holiday or rest day.',
          'Proof Requirement: Entitlement to overtime pay must first be established by proof that overtime work was actually performed.',
          'Basis of Computation: Regular wage means regular base pay, excluding Christmas bonus and other fringe benefits. When overtime is done on a rest day or holiday, premium pay must be included in the computation basis.',
          'Premium Pay Definition: Additional compensation required by law for work performed within eight (8) hours on non-working days (rest days or holidays).',
        ],
      },
      {
        heading: 'Emergency Overtime Work (5 Compelling Cases)',
        description: 'Employer may lawfully compel employees to render overtime work only in these 5 instances:',
        items: [
          '1. When the country is at war or when national/local emergency is declared by the National Assembly or Chief Executive.',
          '2. When necessary to prevent loss of life or property, or in imminent danger to public safety due to serious accidents, fire, flood, typhoon, earthquake, epidemic, or other disaster or calamity.',
          '3. When there is urgent work to be performed on machines, installations, or equipment, to avoid serious loss or damage to employer or similar causes.',
          '4. When work is necessary to prevent loss or damage to perishable goods.',
          '5. Where completion or continuation of work started before the 8th hour is necessary to prevent serious obstruction or prejudice to the business or operations of the employer.',
        ],
      },
      {
        heading: 'Undertime & Package Pay Synthesis',
        items: [
          'Undertime Cannot Offset Overtime: Regular pay rate is lower than overtime rate. Undertime hours must be deducted from accrued leave credits; if exhausted, deducted from daily wage. Employee remains entitled to full overtime pay earned.',
          'Waiver Prohibited: The right to overtime pay cannot be waived.',
          'Composite / Package Pay Validity: Package pay is not per se illegal IF: (1) there is a clear written agreement knowingly and freely entered into by employee, AND (2) mathematical calculation proves that agreed wage and overtime pay, computed separately, equal or exceed amounts legally due.',
          'Synthesis of Overtime Rules: (1) Cannot compel except emergency; (2) Demands employer knowledge/consent (except if work was necessary/benefited employer, or employee could not abandon post due to lack of substitute); (3) Ordinary day unless rest day/holiday; (4) Undertime cannot offset overtime.',
        ],
      },
      {
        heading: 'Night Shift Differential (Art. 86) & Night Workers (RA 10151)',
        items: [
          'Night Shift Differential: 10% of regular wage for every hour worked between 10:00 PM and 6:00 AM, whether or not part of regular shift.',
          'Overtime at Night: If work between 10:00 PM and 6:00 AM is overtime, the night differential is computed on the overtime rate.',
          'Exemption from NSD: Retail and service establishments regularly employing not more than five (5) workers.',
          'Night Worker Definition (RA 10151): Any employed person whose work covers the period from 10 PM to 6 AM performing no less than 7 consecutive hours of work.',
          'Mandatory Facilities for Night Workers: Suitable first-aid facilities, sleeping/resting quarters in establishment, and transportation to nearest point of residence.',
          'Free Health Assessment: At worker’s request, free health assessment before assignment, at regular intervals, and if health problems arise. Unfitness findings cannot be used to their detriment.',
          'Transfer: Night workers certified unfit for health reasons shall be transferred to similar daytime job for which fit; if impracticable, granted benefits of workers unable to work. Protection against dismissal.',
          'Weekly Night-Off: Weekly rest period of 24 consecutive hours beginning at start of night shift (usually Saturday evening).',
          'Work on Special Days: Calendar days starting and ending at midnight, unless agreed otherwise.',
          'Part-time Work: Regular/voluntary work substantially shorter than normal; pay and benefits proportional.',
          'Contract for Piece of Work vs Sale: Goods manufactured for general market = sale; goods manufactured especially for customer upon special order = piece of work.',
        ],
      },
    ],
    barTips: [
      'Bar Tip: Maximum hours under Compressed Work Week are 12 hours/day and 48 hours/week.',
      'Bar Tip: Offsetting undertime on Monday with overtime on Tuesday is ILLEGAL. The employer must pay full OT and deduct UT from leaves or basic salary.',
    ],
  },
];
