import { ParsedJd } from '../types/rolefit';

export const SAMPLE_JDS: ParsedJd[] = [
  {
    id: 'jd-data-analyst',
    roleTitle: 'Data Analyst',
    companyName: 'NexScale Analytics',
    location: 'Bengaluru (Hybrid: 3 Days Onsite)',
    experienceLevel: '0–2 Years',
    salaryRange: '₹6–8 LPA',
    workplaceType: 'Hybrid',
    department: 'Data & Growth Operations',
    detectedRoles: [],
    locationSource: 'JD_EXTRACTED',
    postingConditions: [],
    rawText: `JOB TITLE: Data Analyst
LOCATION: Bengaluru (Hybrid: 3 Days Onsite)
EXPERIENCE: 0-2 Years | CTC: ₹6,00,000 – ₹8,00,000 PA

ABOUT THE ROLE:
We are seeking an energetic Data Analyst to join our Growth Analytics team in Bengaluru. You will work closely with product managers to extract insights, build automated dashboards, and present metrics.

RESPONSIBILITIES:
- Write SQL queries to extract customer funnel data from PostgreSQL databases.
- Perform exploratory data analysis using Python (Pandas/NumPy) to identify user trends.
- Build interactive dashboards in Power BI for leadership reviews.
- Maintain routine operational reports using advanced Excel functions.
- Communicate findings cross-functionally through visual slides and executive summaries.

REQUIREMENTS:
- Bachelor's degree in quantitative fields (2024-2026 Batch).
- 0 to 2 years of relevant experience or internships.
- Working knowledge of SQL (JOINs, aggregations, filtering).
- Hands-on experience with Python for data manipulation.
- Experience building dashboards in Power BI and spreadsheets in Excel.
- Excellent oral & written communication skills.`,
    requirements: [],
    matches: {},
    extraSkills: [],
    coreRequirementCount: 5,
    coreMatchCount: 4,
    coreGapCount: 1,
    overallVerdict: {
      signal: 'WORTH_CONSIDERING',
      signalTitle: 'STRONG SIGNAL · 1 KEY SKILL GAP',
      summary: '4 / 5 core skills matched.',
      coreSkillsMatched: 4,
      coreSkillsTotal: 5,
      eligibilityMet: true,
      keyGaps: ['SQL'],
      honestAdvice: 'Strong enough to consider. SQL is the main gap.',
    },
  },
  {
    id: 'jd-bi-analyst',
    roleTitle: 'Business Intelligence Analyst',
    companyName: 'Apex Data Insights',
    location: 'Gurugram (Hybrid: 2 Days Onsite)',
    experienceLevel: '0–2 Years',
    salaryRange: '₹5–7 LPA',
    workplaceType: 'Hybrid',
    department: 'Business Intelligence',
    detectedRoles: [],
    locationSource: 'JD_EXTRACTED',
    postingConditions: [],
    rawText: `JOB TITLE: Business Intelligence Analyst
LOCATION: Gurugram (Hybrid: 2 Days Onsite)
EXPERIENCE: 0–2 Years | CTC: ₹5–7 LPA

ABOUT THE ROLE:
We are looking for a sharp Business Intelligence Analyst to join our analytics team in Gurugram.

REQUIREMENTS:
- Working knowledge of SQL (queries, JOINs, filtering).
- Hands-on experience with Power BI for building dashboards.
- Strong proficiency in Excel (VLOOKUP, Pivot tables).
- Excellent written and verbal Communication skills.
- Familiarity with Python or Pandas is preferred but not mandatory.
- Experience with DAX in Power BI and ETL processes is a plus.`,
    requirements: [],
    matches: {},
    extraSkills: [],
    coreRequirementCount: 4,
    coreMatchCount: 3,
    coreGapCount: 1,
    overallVerdict: {
      signal: 'WORTH_CONSIDERING',
      signalTitle: 'STRONG SIGNAL · SQL IS THE MAIN GAP',
      summary: '3 / 4 core skills matched.',
      coreSkillsMatched: 3,
      coreSkillsTotal: 4,
      eligibilityMet: true,
      keyGaps: ['SQL'],
      honestAdvice: 'Strong enough to consider. The core requirements align, with SQL as the main gap.',
    },
  },
  {
    id: 'jd-sde-1',
    roleTitle: 'Associate Software Engineer',
    companyName: 'Krypton Labs',
    location: 'Gurgaon (Onsite)',
    experienceLevel: '0–1 Years',
    salaryRange: '₹8–10 LPA',
    workplaceType: 'Onsite',
    department: 'Core Engineering',
    detectedRoles: [],
    locationSource: 'JD_EXTRACTED',
    postingConditions: [],
    rawText: `JOB TITLE: Associate Software Engineer
LOCATION: Gurgaon (Onsite) | EXP: 0–1 Yrs

REQUIREMENTS:
- React & TypeScript proficiency.
- Data Structures & Algorithms.
- Git version control.`,
    requirements: [],
    matches: {},
    extraSkills: [],
    coreRequirementCount: 2,
    coreMatchCount: 2,
    coreGapCount: 0,
    overallVerdict: {
      signal: 'STRONG_FIT',
      signalTitle: 'STRONG SIGNAL · HIGH ALIGNMENT',
      summary: '2 / 2 core skills matched.',
      coreSkillsMatched: 2,
      coreSkillsTotal: 2,
      eligibilityMet: true,
      keyGaps: [],
      honestAdvice: 'High technical alignment with core developer expectations.',
    },
  },
];
