import { LawTopic } from '../types/laborLaw';

export const MODULE_3_WAGES: LawTopic[] = [
  {
    id: 'm3-wage-principles',
    worldId: 'world3',
    title: 'Wage Principles, Facilities vs Supplements & Minimum Wage',
    badge: 'Art. 97-101 Labor Code',
    iconName: 'Super Star',
    summary: 'No Work-No Pay principle, Equal Pay for Equal Work, Wage vs Salary, Facilities vs Supplements, COLA, and the 12 statutory minimum wage exemptions.',
    keyDoctrines: [
      'No Work-No Pay Principle: Fair day’s wage for a fair day’s work. Exception: when the worker was able, willing, and ready to work but was illegally locked out, suspended, or dismissed.',
      'Equal Pay for Equal Work: Persons with substantially equal qualifications, skill, effort, and responsibility under similar conditions should receive equal pay.',
      'Wage is paid for manual labor and exempt from execution/attachment except for necessities; Salary is paid to white-collar workers and NOT exempt.',
      'Facilities (board and lodging) are deductible only if customary, voluntarily accepted in writing, and charged at fair value. Tools of trade are NOT facilities.',
      'Retail/service <= 10 workers are exempt from minimum wage; < 10 are exempt from holiday pay and SIL. With 9 or fewer workers, exempt from all 3!',
    ],
    rules: [
      {
        heading: 'No Work-No Pay Principle',
        items: [
          'General Principle: A fair day’s wage for a fair day’s work governs the relation between labor and capital. If there is no work performed by the employee, there can be no wage or pay.',
          'Economic Loss: Where the failure of workers to work was not due to the employer’s fault, the burden of economic loss suffered by employees should not be shifted to the employer.',
          'Exception: When the worker was able, willing, and ready to work but was illegally locked out, suspended or dismissed, or otherwise illegally prevented from working.',
        ],
      },
      {
        heading: 'Equal Pay for Equal Work & 5 Exclusions',
        items: [
          'Core Doctrine: Persons who work with substantially equal qualifications, skill, effort, and responsibility, under similar conditions, should be paid similar salaries.',
          'Presumption: If an employer accords employees the same position and rank, the presumption is that these employees perform equal work.',
          '5 Exclusions from Equal Work for Equal Pay:',
          '1. Farm tenancy or leasehold.',
          '2. Household or domestic helpers, including family drivers and other persons in the personal service of another.',
          '3. Homeworkers engaged in needlework.',
          '4. Workers in registered cottage industries who actually work at home.',
          '5. Workers in registered cooperatives when so recommended by the Bureau of Cooperative Development.',
          'Note on BMBE: Workers in registered Barangay Micro-Business Enterprises (BMBEs) are exempt ONLY from the Minimum Wage Law.',
        ],
      },
      {
        heading: 'Wage vs. Salary Distinction',
        subSections: [
          {
            title: 'Comparative Criteria',
            items: [
              'Wage: Paid for skilled or unskilled manual labor. NOT subject to execution, garnishment, or attachment, except for debts incurred for food, shelter, clothing, and medical attendance (necessities).',
              'Salary: Paid to white-collar workers and denotes a higher grade of employment. NOT exempt from execution, garnishment, or attachment.',
            ],
          },
        ],
      },
      {
        heading: 'Facilities vs. Supplements',
        items: [
          'Facilities Definition: Articles or services, such as board and lodging, customarily furnished by the employer for the benefit of the employee or his family. Fair and reasonable value forms part of the wage.',
          'Supplements Definition: Extra remuneration, special privileges, or benefits given over and above the ordinary earnings or wages of the worker (primarily for employee benefit, not deductible).',
          'Tools of Trade Excluded: The term facility does NOT include tools of the trade or articles/services primarily for the benefit of the employer or necessary to the conduct of the business.',
          '3 Mandatory Requirements for Facilities Deduction from Wages:',
          '1. Proof must be shown that the trade customarily furnishes such facilities.',
          '2. The provision of deductible facilities must be voluntarily accepted in writing by the employee.',
          '3. Facilities must be charged at a fair and reasonable value.',
        ],
      },
      {
        heading: 'Daily-Paid vs. Monthly-Paid Employees',
        items: [
          'Daily-Paid Worker: Gets paid only for the days he actually worked.',
          'Monthly-Paid Worker: Monthly rate covers all days of the month (worked and unworked days, including rest days and holidays).',
          'Statutory Presumption: Employees uniformly paid by the month, irrespective of the number of working days therein, with salary not less than minimum wage, are presumed paid for all days of the month.',
          'Formula for Monthly Pay: Minimum Wage Rate x 365 / 12.',
          'Formula for Daily Pay: Monthly Pay x 12 / 365 (Employers sometimes use 304 taking into account leave credits and Sundays).',
          'Agricultural vs Industrial Rates: Agricultural rates are generally lower than industrial. It is the nature of the work that classifies the worker (land preparation to harvest = agricultural; manufacturing/processing = industrial).',
          'Cost of Living Allowance (COLA): Intended to cover increases in cost of living; becomes part of basic wage only if integrated into it by order of the Regional Wage Board.',
        ],
      },
      {
        heading: '12 Exemptions to Minimum Wage Coverage',
        description: 'Under the Labor Code and Wage Rationalization rules, the following are exempt from statutory minimum wage:',
        items: [
          '1. Household or domestic helpers (covered separately under Batas Kasambahay).',
          '2. Homeworkers engaged in needlework.',
          '3. Workers in establishments registered with the National Cottage Industries and Development Authority (NACIDA).',
          '4. Workers in duly registered cooperatives upon recommendation of BCD and approval of DOLE Secretary.',
          '5. Retail and service establishments regularly employing not more than ten (10) workers, upon application and determination by the Regional Wage Board.',
          '6. Distressed establishments (exempt only upon formal board approval).',
          '7. New business enterprises (exempt only upon formal board approval).',
          '8. Establishments adversely affected by natural calamities (exempt only upon formal board approval).',
          '9. Workers of registered Barangay Micro-Business Enterprises (BMBEs).',
          '10. Learners.',
          '11. Apprentices.',
          '12. Handicapped workers.',
        ],
      },
      {
        heading: 'Retail vs Service Exemption Threshold Analysis',
        items: [
          'Retail Enterprise: Engaged in the sale of goods commonly bought by private individuals for personal/household use, characterized by small sales.',
          'Service Enterprise: Engaged predominantly in providing personal service to individuals for personal or household use.',
          'Exemption Threshold Rule: Minimum wage exemption specifies NOT MORE THAN 10 workers (<= 10). Exemption from holiday pay and SIL applies to LESS THAN 10 workers (< 10).',
          'Critical Conclusion: With nine (9) or fewer employees, a retail or service establishment is exempt from ALL THREE: Minimum Wage, Holiday Pay, and Service Incentive Leave.',
        ],
      },
      {
        heading: 'Non-Diminution of Benefits & Bonus Doctrine',
        items: [
          'Non-Diminution Rule: Benefits given to employees cannot be taken back or reduced unilaterally by the employer once they have become part of employment contract.',
          '4 Requisites for Non-Diminution of Benefits:',
          '1. The benefit is founded on an employer policy which has ripened into a practice over a long period of time.',
          '2. The practice is consistent and deliberate.',
          '3. The grant is not due to an error in the construction or application of a doubtful or difficult question of law.',
          '4. The diminution or discontinuance is done unilaterally by the employer.',
          'Bonus Doctrine: A bonus is an act of generosity (ex gratia), but becomes an enforceable legal obligation when made part of wage or promised without condition. If dependent on profits or target productivity, it is not part of basic wage.',
          'Piece-Rate Output Safeguard: For output rates not yet approved by DOLE, if worker output earnings fall below legal daily minimum rate, the employer bears the difference!',
        ],
      },
    ],
    barTips: [
      'Bar Tip: Distressed and calamity-affected establishments are NOT automatically exempt—exemption takes effect only upon formal application and written approval by the Regional Wage Board!',
      'Bar Tip: If a company mistakenly gave a benefit due to misinterpretation of law, correcting the mistake does NOT violate the non-diminution rule because it was not deliberate.',
    ],
  },
  {
    id: 'm3-payment-contracting-distortion',
    worldId: 'world3',
    title: 'Payment of Wages, Contracting (D.O. 174) & Wage Distortion',
    badge: 'D.O. 174 & Art. 102-129',
    iconName: 'Mushroom',
    summary: 'Payment forms and intervals, D.O. 174 contracting vs labor-only contracting, 10 allowable deductions, and wage distortion remedies.',
    keyDoctrines: [
      'Wages must be paid in legal tender. Payment by check or ATM is allowed under specific conditions. Burden of proving wage payment rests on the employer.',
      'Wages must be paid at intervals not exceeding 16 days. Cash flow difficulty or defaulting clients are NOT legal reasons for delayed payment.',
      'Labor-only contracting is TOTALLY PROHIBITED. The contractor is deemed a mere agent and principal is held as direct employer.',
      'Under D.O. 174, failure to register raises the legal presumption that the contractor is engaged in prohibited labor-only contracting.',
      'Worker Preference: In bankruptcy/liquidation, employee unpaid wages enjoy absolute priority and are satisfied ahead of all other claims.',
      'Deductions for lost/damaged tools cannot exceed 20% of weekly wages and require proof of fault and opportunity to show cause.',
      'Wage Distortion Formula: Minimum Wage / Actual Salary = % x Prescribed Increase.',
    ],
    rules: [
      {
        heading: 'Payment of Wages Rules & Protections',
        items: [
          'Form of Payment: By legal tender. Check or money order allowed where customary or stipulated in CBA. Payment through ATMs is permitted.',
          'Burden of Proof: Where employee alleges non-payment of wages, the employer has the burden to prove payment. Doubts are tilted in favor of the employee.',
          'Time of Payment: At least once every two (2) weeks or twice a month at intervals not exceeding sixteen (16) days. In force majeure, paid immediately after cessation. Cash flow difficulty or defaulting clients are NOT valid excuses.',
          'Place of Payment: At or near the place of undertaking.',
          'Direct Payment General Rule: Wages paid directly to the workers due. 2 Exceptions: (1) Force majeure with written authority; (2) Worker has died, paid to heirs without intestate proceedings.',
        ],
      },
      {
        heading: 'Contracting and Subcontracting (Department Order No. 174)',
        subSections: [
          {
            title: 'Trilateral Relationship',
            items: [
              'Involves Principal (farms out job), Contractor (direct employer of workers), and Employees (perform work). Principal is indirect employer solidarily liable if contractor defaults.',
            ],
          },
          {
            title: 'Legitimate Job Contractor: 4 Requisites',
            items: [
              '1. Contractor engages in a distinct and independent business, undertaking to perform the job according to its own manner and method.',
              '2. Has substantial capital or investment in tools, equipment, machinery, work premises, and supervision.',
              '3. Free from the control of the principal in all matters of work performance except as to the result.',
              '4. Service Agreement ensures full compliance with all rights and benefits for contractor employees.',
            ],
          },
          {
            title: 'Labor-Only Contracting (TOTALLY PROHIBITED)',
            items: [
              'Occurs where: (a) Contractor lacks substantial capital/investment in tools/machinery/premises, AND employees perform activities directly related to the main business of principal; OR (b) Contractor does not exercise right of control over work performance.',
              'Legal Effect: Principal becomes direct employer solidarily liable with labor-only contractor.',
            ],
          },
          {
            title: 'Mandatory Registration under D.O. 174',
            items: [
              'Certificate of Registration valid for two (2) years. Failure to register gives rise to legal presumption of labor-only contracting.',
              'Cannot be renewed if SSS, PhilHealth, or other labor standards have been violated.',
            ],
          },
          {
            title: '10 Grounds for Cancellation of Registration',
            items: [
              '1. Misrepresentation of facts in application.',
              '2. Submission of falsified or tampered application or supporting documents.',
              '3. Non-submission of Service Agreement between principal and contractor when required.',
              '4. Non-submission of required semi-annual report.',
              '5. Final findings of engagement in labor-only contracting or illicit employment arrangements.',
              '6. Non-compliance with labor standards and working conditions.',
              '7. Violation of employee rights and required contracts.',
              '8. Non-compliance with SSS, HDMF (Pag-IBIG), PhilHealth, and ECC laws.',
              '9. Collecting unauthorized fees.',
              '10. Violations of any provisions of the Labor Code.',
            ],
          },
          {
            title: '5 Inalienable Rights of Contractor’s Employees',
            items: [
              '1. Safe and healthful working conditions.',
              '2. Labor standards (SIL, rest days, overtime, holiday pay, 13th month pay, separation pay).',
              '3. Retirement benefits under SSS or contractor retirement plans.',
              '4. Social security and welfare benefits.',
              '5. Self-organization, collective bargaining, and peaceful concerted activities including strike.',
            ],
          },
        ],
      },
      {
        heading: 'Worker Preference & 7 Wage Prohibitions',
        items: [
          'Worker Preference: During bankruptcy or liquidation, unpaid wages and monetary claims of employees shall be satisfied ahead of all other claims, including taxes and mortgages (requires declaration of bankruptcy/liquidation).',
          '7 Statutory Prohibitions Regarding Wages:',
          '1. Non-interference in the disposal of wages (cannot force worker to buy goods).',
          '2. Unlawful wage deductions.',
          '3. Unlawful deposits for loss or damage.',
          '4. Withholding of wages and kickbacks (earned wages must be paid in full; cannot withhold due to missing report or rule infraction).',
          '5. Deduction to ensure employment.',
          '6. Retaliatory measures against reporting employees.',
          '7. False reporting of wages.',
        ],
      },
      {
        heading: '10 Allowable Wage Deductions',
        description: 'General Rule: No employer shall make deductions from wages. The 10 specific legal exceptions are:',
        items: [
          '1. Indebtedness to employer that has become due and demandable.',
          '2. Court awards for debts incurred for food, shelter, clothing, and medical attendance.',
          '3. Withholding tax required by law.',
          '4. Salary deductions of a member of a legally established cooperative.',
          '5. Deductions for payment to third persons upon written authorization of employee.',
          '6. Union dues (check-off recognized or authorized in writing).',
          '7. Agency fees.',
          '8. Deductions for deductible facilities.',
          '9. Deductions for loss or damage to equipment/tools.',
          '10. SSS, PhilHealth, and Pag-IBIG statutory contributions.',
          'Lost/Damaged Equipment Deduction Conditions: (1) Employee shown responsible; (2) Ample opportunity to show cause; (3) Amount is fair and reasonable; (4) Total deduction does not exceed 20% of employee weekly wages.',
        ],
      },
      {
        heading: 'Wage Distortion: Concept, Elements & Resolution',
        items: [
          'Definition: Severe contraction or elimination of intentional quantitative differences in wage rates between employee groups as to obliterate distinctions embodied in the wage structure.',
          '4 Elements of Wage Distortion: (1) Existing hierarchy of positions with corresponding salary rates; (2) Significant change in salary of lower pay class without concomitant increase in higher class; (3) Elimination of distinction between the two levels; (4) Distortion exists within the same region.',
          'Formula for Restoration Adjustment: (Minimum Wage / Actual Salary) = % x Prescribed Increase.',
          'Wage Order Rules: Frequency: Wage orders may not be disturbed for 12 months from effectivity (except new congressional act or supervening emergency). Effectivity: 15 days after complete publication in newspaper of general circulation.',
          'Resolution in Organized Establishments (with Union): Negotiate distortion -> Grievance machinery -> Voluntary arbitration.',
          'Resolution in Unorganized Establishments (no Union): Endeavor to settle -> NCMB conciliation (10 calendar days) -> NLRC Compulsory Arbitration. Employer cannot declare lockout; union cannot strike; historical salary differential need not be maintained in full.',
        ],
      },
    ],
    barTips: [
      'Bar Tip: Can an employer withhold an employee’s final paycheck because he failed to submit clearance or turnover report? NO. Earned wages cannot be withheld as leverage or punishment.',
      'Bar Tip: In unorganized establishments, failure to resolve wage distortion leads to NCMB conciliation for 10 calendar days, then compulsory arbitration by the NLRC.',
    ],
  },
];
