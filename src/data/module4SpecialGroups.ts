import { LawTopic } from '../types/laborLaw';

export const MODULE_4_SPECIAL_GROUPS: LawTopic[] = [
  {
    id: 'm4-women-workers',
    worldId: 'world4',
    title: 'Women Workers: Facilities, Discrimination & Pregnancy',
    badge: 'Art. 130-136 Labor Code',
    iconName: 'Peach Crown',
    summary: 'Mandatory facilities for women, anti-discrimination provisions, stipulation against marriage, relationship with competitor, and pregnancy protections.',
    keyDoctrines: [
      'Employers must provide suitable seats, separate toilet/lavatories and dressing rooms, and nurseries for women workers.',
      'Stipulation against marriage is unlawful and void: employers cannot condition employment on staying single or deem women resigned upon marriage.',
      'An employer policy prohibiting marriage or romantic relationships with employees of a business competitor is VALID and enforceable.',
      'Expulsion of female faculty or students on account of pregnancy outside of wedlock is strictly prohibited.',
      'Discharge on account of pregnancy occurs during pregnancy/leave; discharge on account of testimony includes refusing re-admission for fear of repeated pregnancy.',
    ],
    rules: [
      {
        heading: '4 Required Facilities for Women',
        items: [
          '1. Seats: Provide seats suitable for women and permit them to use such seats when free from work and during working hours, provided duties can be performed without detriment to efficiency.',
          '2. Restrooms: Establish separate toilet rooms and lavatories for men and women and provide at least a dressing room for women.',
          '3. Nursery: Establish a nursery in the workplace for the benefit of women employees therein.',
          '4. Standards: Determine appropriate minimum age and other standards for retirement or termination in special occupations such as flight attendants and the like.',
        ],
      },
      {
        heading: 'Provisions Against Discrimination Solely on Account of Sex',
        items: [
          'General Mandate: Unlawful for any employer to discriminate against any woman employee with respect to terms and conditions of employment solely on account of her sex.',
          'Specific Acts of Discrimination:',
          '1. Payment of lesser compensation, including wages, salary, or other forms of remuneration and fringe benefits to female employees as against male employees, for work of equal value.',
          '2. Favoring a male employee over a female employee with respect to promotion, training opportunities, study and scholarship grants solely on account of their sexes.',
        ],
      },
      {
        heading: 'Stipulation Against Marriage (Unlawful Acts)',
        description: 'Under Art. 134, it shall be unlawful for an employer to:',
        items: [
          '1. Require as a condition of employment or continuation of employment that a woman employee shall not get married.',
          '2. Stipulate expressly or impliedly that upon getting married, a woman employee shall be deemed resigned or terminated.',
          '3. Actually dismiss, discharge, discriminate, or otherwise prejudice a woman employee merely by reason of her marriage.',
        ],
      },
      {
        heading: 'Policy on Relationship with Competitor (Supreme Court Doctrine)',
        items: [
          'Validity: An employer policy prohibiting an employee from having a personal or marital relationship with an employee of a competitor is VALID.',
          'Rationale: The prohibition is reasonable under the circumstances because relationships of such nature might compromise trade secrets, proprietary strategies, and the vital commercial interests of the company.',
        ],
      },
      {
        heading: 'Discharge on Account of Pregnancy vs. Testimony',
        subSections: [
          {
            title: 'Discharge on Account of Pregnancy',
            items: ['To discharge a woman on account of her pregnancy, while on leave or in confinement due to her pregnancy.'],
          },
          {
            title: 'Discharge on Account of Testimony',
            items: ['To discharge or refuse the admission of such woman upon returning to her work for fear that she may become pregnant again.'],
          },
        ],
      },
      {
        heading: 'Expulsion Due to Pregnancy Outside Wedlock (Prohibited)',
        items: [
          'Women Faculty: Expulsion and non-readmission of women faculty due to pregnancy outside of marriage shall be prohibited.',
          'Female Students: No school shall refuse admission or expel a female student solely on account of her having contracted pregnancy outside of marriage during her term in school.',
        ],
      },
    ],
    barTips: [
      'Bar Tip: Distinguish non-marriage stipulation (VOID) from no-dating-competitor policy (VALID, Star Paper doctrine).',
      'Bar Tip: Refusing to re-admit a woman returning from maternity leave for fear that she will get pregnant again constitutes unlawful discrimination!',
    ],
  },
  {
    id: 'm4-minors-kasambahay-homework',
    worldId: 'world4',
    title: 'Minors, Kasambahay (R.A. 10361) & Industrial Homeworkers',
    badge: 'Art. 137-155 & R.A. 10361',
    iconName: 'Yoshi Egg',
    summary: 'Child labor rules, allowable minor employment exceptions, Kasambahay 8 core rights, debt bondage ban, homeworkers protections, and night worker standards.',
    keyDoctrines: [
      'Children below 15 shall NOT be employed, except: (1) family undertaking under sole responsibility of parents without moral/physical hazard and with schooling; (2) public entertainment with DOLE-approved contract.',
      'Working hours: below 15 = max 4 hrs/day, 20 hrs/week; 15 to under 18 = max 8 hrs/day, 40 hrs/week.',
      'Night work ban: below 15 = 8 PM to 6 AM (10 hrs); 15 to under 18 = 10 PM to 6 AM (8 hrs).',
      'Kasambahay must receive at least 3 meals a day, humane sleeping quarters, SSS/PhilHealth/Pag-IBIG at 1 month, and 5 days SIL after 1 year.',
      'Requiring Kasambahay deposits for loss/damage and debt bondage are criminal and prohibited.',
      'Industrial homeworkers: joint and several liability between principal and contractor for unpaid wages; weekly deductions capped at 20%.',
    ],
    rules: [
      {
        heading: 'Minor Workers & Child Labor Standards',
        items: [
          'Child Definition: Any person under eighteen (18) years of age.',
          'Child Labor Definition: Any work or economic activity performed by a child that subjects him to any form of exploitation or is harmful to his health, safety, or physical, mental, or psychological development.',
          'General Rule on Below 15: Children below fifteen (15) shall NOT be employed.',
          '2 Exceptions for Employing Children Below 15:',
          'Exception 1: Child works directly under sole responsibility of parents/guardian where only members of family are employed, provided: (a) Does not endanger life, safety, health, and morals; (b) Normal development is not impaired; (c) Parent/guardian provides prescribed primary/secondary education.',
          'Exception 2: Employment in public entertainment/information (cinema, theater, radio, TV) is essential, provided: (a) No commercials promoting alcohol, tobacco, or violence; (b) Contract concluded by parents and approved by DOLE; (c) Employer ensures protection, safety, and morals; (d) Formulates continuing skills/training program.',
          'Employment of Children 15 to 18: Allowed but strictly restricted to non-hazardous work.',
          'Hazardous Workplaces (Prohibited for Minors): (1) Dangerous environmental elements/contaminants; (2) Construction, logging, firefighting, mining, quarrying, blasting, stevedoring, dock work, deep-sea fishing, mechanized farming; (3) Explosives and pyrotechnics; (4) Heavy power-driven machinery; (5) Power-driven tools.',
        ],
      },
      {
        heading: 'Minor Working Hours & Night Work Restrictions',
        items: [
          'Working Hours Matrix:',
          '• Below 15 years old: Maximum 4 hours a day, Maximum 20 hours a week.',
          '• 15 to under 18 years old: Maximum 8 hours a day, Maximum 40 hours a week.',
          'Night Work Prohibition Matrix:',
          '• Below 15 years old: Strictly prohibited between 8:00 PM and 6:00 AM (10 consecutive hours).',
          '• 15 to under 18 years old: Strictly prohibited between 10:00 PM and 6:00 AM (8 consecutive hours).',
        ],
      },
      {
        heading: 'Domestic Workers (Kasambahay - R.A. No. 10361)',
        subSections: [
          {
            title: 'Definition & Exclusions',
            items: [
              'Kasambahay: Any person engaged in domestic work within an employment relationship (general househelp, nursemaid/yaya, cook, gardener, laundry person).',
              'Exclusion: Does not include persons performing domestic work only occasionally/sporadically and not on an occupational basis.',
            ],
          },
          {
            title: '8 Fundamental Rights and Privileges',
            items: [
              '1. Minimum Wage (as fixed by Regional Wage Boards).',
              '2. Standard of Treatment: Free from any abuse, physical violence, harassment, or acts degrading dignity.',
              '3. Board, Lodging, and Medical Attendance: At least three (3) adequate meals a day, humane and safe sleeping arrangements, rest, and medical assistance without loss of benefits.',
              '4. Privacy: Guaranteed at all times, extending to all communication and personal effects.',
              '5. Access to Outside Communication: Free time access; emergency access during work time.',
              '6. Education and Training: Opportunity to finish basic education, alternative learning systems (ALS), technical/vocational or higher education.',
              '7. Social and Other Benefits: Mandatory coverage under SSS, PhilHealth, and Pag-IBIG after at least one (1) month of service.',
              '8. Leave Benefits: Annual Service Incentive Leave of five (5) days with pay after at least one (1) year of service.',
            ],
          },
          {
            title: 'Pre-Employment Requirements & Absolute Prohibitions',
            items: [
              'Pre-Employment Requirements: (1) Medical/health certificate from LGU health officer; (2) Barangay and police clearance; (3) NBI clearance; (4) Authenticated birth certificate (or passport, voter ID, baptismal record).',
              'Deposits for Loss or Damage Prohibited: Unlawful to require Kasambahay to make deposits for tools, materials, furniture, or equipment reimbursement.',
              'Prohibition on Debt Bondage: Unlawful to place Kasambahay under debt bondage (rendering service as security for debt where service terms are indefinite or service value is not reasonably credited).',
            ],
          },
          {
            title: 'Grounds for Termination of Kasambahay',
            items: [
              'By Domestic Worker: (1) Verbal or emotional abuse; (2) Inhuman treatment / physical abuse; (3) Commission of crime/offense by employer/household against worker; (4) Violation of contract terms or labor standards; (5) Disease prejudicial to health; (6) Analogous causes.',
              'By Employer: (1) Misconduct or willful disobedience of lawful orders; (2) Gross or habitual neglect of duties; (3) Fraud or willful breach of trust; (4) Commission of crime/offense by worker against employer/family; (5) Violation of contract terms or labor standards; (6) Prejudicial disease; (7) Analogous causes.',
              'Notice Rule: If duration is not fixed, either party may terminate by giving written notice five (5) days before intended termination, or by mutual written pre-termination.',
            ],
          },
        ],
      },
      {
        heading: 'Industrial Homeworkers',
        items: [
          'Definition: Decentralized system of production where work for employer or contractor is carried out by homeworkers at home.',
          'Rights: (1) Right to form, join, or assist labor organizations; (2) Legal personality upon registration; (3) Immediate payment upon receipt of finished goods; (4) SSS and PhilHealth deductions remitted by employer/contractor.',
          'Employer Liabilities: (1) May require homeworker to redo improper work without extra pay; (2) Need not pay for work done on goods not returned due to homeworker fault; (3) Joint and several liability with contractor for unpaid wages; (4) Assist in safe/healthful working conditions; (5) Technical assistance from DOLE.',
          'Prohibited Homework: Manufacture of explosives/fireworks, drugs/poisons, toxic substances.',
          'Deduction from Earnings: Generally prohibited. Exception: only if homeworker shown responsible, given hearing, amount is fair and actual, and deduction does NOT exceed 20% of weekly earnings.',
        ],
      },
      {
        heading: 'Night Workers (R.A. No. 10151 Standards)',
        items: [
          'Threshold: Work covering 10 PM to 6 AM performing no less than 7 consecutive hours.',
          'Health Assessment: Free right to health assessment before assignment, at regular intervals, and during health problems; findings cannot be used to worker detriment.',
          'Mandatory Facilities: Suitable first-aid, safe sleeping/resting quarters, and transportation to nearest residence point.',
          'Transfer Rights: Transfer to similar daytime job if certified unfit; protection against dismissal.',
          'Women Night Workers: Alternative work provided before and after childbirth for at least sixteen (16) weeks, extendable with medical certificate; no dismissal or loss of seniority.',
          'Pregnant & Nursing: Allowed only if independent competent physician (other than company physician) certifies fitness and specifies safe period.',
        ],
      },
    ],
    barTips: [
      'Bar Tip: A 14-year-old child CANNOT work in an ordinary shop even if parents consent. Only family undertakings or public entertainment are allowed!',
      'Bar Tip: Under Batas Kasambahay, SSS, PhilHealth, and Pag-IBIG start after ONE MONTH of service, while the 5-day SIL starts after ONE YEAR.',
    ],
  },
];
