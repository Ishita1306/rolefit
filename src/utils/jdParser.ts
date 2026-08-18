import { ParsedJd, Requirement, SkillMatch, VerdictSignal, CandidateProfile, RoleCatalogItem, PostingCondition } from '../types/rolefit';

// Skill Alias Map to normalize variant skill names to canonical keys
export const SKILL_ALIAS_MAP: Record<string, { canonical: string; category: 'hard_skill' | 'soft_skill'; aliases: RegExp[] }> = {
  // Mechanical Design Skills
  solidworks: {
    canonical: 'SolidWorks / CAD',
    category: 'hard_skill',
    aliases: [/solidworks/i, /autocad/i, /fusion 360/i, /\bcad\b/i, /mechanical design/i],
  },
  engineering_drawings: {
    canonical: 'Engineering Drawings & Tolerances',
    category: 'hard_skill',
    aliases: [/engineering drawings/i, /tolerances/i, /gd&t/i, /fit and tolerance/i],
  },
  materials_manufacturing: {
    canonical: 'Materials & Manufacturing Processes',
    category: 'hard_skill',
    aliases: [/materials/i, /manufacturing/i, /machining/i, /sheet metal/i],
  },
  prototyping_3d: {
    canonical: '3D Printing & Prototyping',
    category: 'hard_skill',
    aliases: [/3d printing/i, /prototyping/i, /fabrication/i, /assembly and testing/i],
  },
  mechanisms_grippers: {
    canonical: 'Robotics Mechanisms & Grippers',
    category: 'hard_skill',
    aliases: [/grippers/i, /pneumatic/i, /mechanisms/i, /fixtures/i],
  },

  // Embedded Systems Skills
  cpp_c: {
    canonical: 'C / C++',
    category: 'hard_skill',
    aliases: [/c\s*\/\s*c\+\+/i, /embedded c/i, /\bc\+\+\b/i, /\bc\b/i],
  },
  microcontrollers: {
    canonical: 'Microcontrollers & Electronics',
    category: 'hard_skill',
    aliases: [/microcontroller/i, /stm32/i, /arduino/i, /esp32/i, /electronics/i, /debugging/i],
  },
  can_plc: {
    canonical: 'CAN / PLC / Protocols',
    category: 'hard_skill',
    aliases: [/canopen/i, /\bcan bus\b/i, /\bcan\b/i, /rs485/i, /\bplc\b/i, /modbus/i, /industrial communication/i, /uart/i, /spi/i, /i2c/i],
  },

  // AI & ML Skills
  python: {
    canonical: 'Python (Pandas / NumPy)',
    category: 'hard_skill',
    aliases: [/python/i, /pandas/i, /numpy/i],
  },
  ml_dl: {
    canonical: 'Machine Learning / PyTorch',
    category: 'hard_skill',
    aliases: [/machine learning/i, /deep learning/i, /pytorch/i, /tensorflow/i],
  },
  computer_vision: {
    canonical: 'Computer Vision (OpenCV)',
    category: 'hard_skill',
    aliases: [/computer vision/i, /opencv/i, /image processing/i],
  },
  llm_rag: {
    canonical: 'LLMs & RAG',
    category: 'hard_skill',
    aliases: [/llm/i, /vlm/i, /rag/i, /ai agents/i, /genai/i],
  },
  ros_robotics: {
    canonical: 'ROS / ROS2',
    category: 'hard_skill',
    aliases: [/ros2/i, /\bros\b/i, /robotics simulation/i],
  },

  // Data & BI Analyst Skills
  sql: {
    canonical: 'SQL',
    category: 'hard_skill',
    aliases: [/sql/i, /postgresql/i, /mysql/i, /queries/i, /joins/i],
  },
  excel: {
    canonical: 'Excel / Google Sheets',
    category: 'hard_skill',
    aliases: [/excel/i, /vlookup/i, /pivot/i, /google sheets/i, /spreadsheets/i],
  },
  powerbi: {
    canonical: 'Power BI',
    category: 'hard_skill',
    aliases: [/power\s*bi/i, /powerbi/i],
  },
  tableau: {
    canonical: 'Tableau',
    category: 'hard_skill',
    aliases: [/tableau/i],
  },
  dax: {
    canonical: 'DAX',
    category: 'hard_skill',
    aliases: [/\bdax\b/i],
  },
  etl: {
    canonical: 'ETL Processes',
    category: 'hard_skill',
    aliases: [/\betl\b/i, /data pipelines/i],
  },
  git: {
    canonical: 'Git',
    category: 'hard_skill',
    aliases: [/\bgit\b/i, /github/i],
  },
  business_metrics: {
    canonical: 'Business Metrics & KPI Reporting',
    category: 'hard_skill',
    aliases: [/kpi/i, /kpi reporting/i, /business metrics/i, /funnel analysis/i],
  },

  // Business Strategy & Founder's Office Skills
  research_analytical: {
    canonical: 'Analytical & Problem Solving',
    category: 'soft_skill',
    aliases: [/analytical thinking/i, /analytical/i, /problem solving/i, /critical thinking/i, /research/i],
  },
  powerpoint: {
    canonical: 'PowerPoint / Slides',
    category: 'soft_skill',
    aliases: [/powerpoint/i, /slide decks/i, /presentations/i, /google slides/i],
  },
  attention_to_detail: {
    canonical: 'Attention to Detail',
    category: 'soft_skill',
    aliases: [/attention to detail/i, /thoroughness/i, /accuracy/i],
  },
  project_organization: {
    canonical: 'Project Organization & Coordination',
    category: 'soft_skill',
    aliases: [/project organization/i, /project coordination/i, /task organization/i, /coordination/i, /deadlines/i],
  },
  independent_work: {
    canonical: 'Independent Work & Ownership',
    category: 'soft_skill',
    aliases: [/independent work/i, /ownership/i, /independent/i, /self-starter/i, /execution/i, /ambiguity/i],
  },
  communication: {
    canonical: 'Communication',
    category: 'soft_skill',
    aliases: [/communication/i, /presenting/i, /cross-functional/i, /presentation/i],
  },
  market_research: {
    canonical: 'Market & Business Research',
    category: 'hard_skill',
    aliases: [/market research/i, /competitive analysis/i, /industry research/i],
  },

  // Robotic Solutioning Skills
  robotics_automation: {
    canonical: 'Industrial Automation & Robotics',
    category: 'hard_skill',
    aliases: [/industrial automation/i, /system architecture/i, /robot selection/i, /solution design/i, /sensors/i, /cameras/i],
  },
};

// Known Standard Role Normalization Map for Placement Postings
const KNOWN_ROLE_CATALOG: RoleCatalogItem[] = [
  {
    id: 'role-data-bi',
    displayName: 'Data & BI Analyst Intern',
    designation: 'Data Analyst',
    aliases: ['data & bi analyst intern', 'data analyst', 'data & bi analyst', 'bi analyst', 'business intelligence analyst', 'data analyst intern'],
  },
  {
    id: 'role-mechanical',
    displayName: 'Mechanical Design Intern',
    designation: 'Mechanical Designer',
    aliases: ['mechanical designer', 'mechanical design intern', 'mechanical design', 'mechanical engineer'],
  },
  {
    id: 'role-embedded',
    displayName: 'Embedded Systems Engineer Intern',
    designation: 'Embedded Engineer',
    aliases: ['embedded systems engineer intern', 'embedded engineer', 'embedded engineer intern', 'embedded systems intern', 'embedded developer'],
  },
  {
    id: 'role-founders',
    displayName: "Business Strategy Intern — Founder's Office",
    designation: "Founder's Office",
    aliases: ["business strategy intern — founder's office", "business strategy intern", "founder's office – project intern", "founder's office", "founder office intern", "project intern"],
  },
  {
    id: 'role-ai',
    displayName: 'AI/ML Engineer Intern',
    designation: 'AI Intern',
    aliases: ['ai/ml engineer intern', 'ai intern', 'ai research intern', 'machine learning intern', 'ai/ml intern'],
  },
  {
    id: 'role-robotic-solutioning',
    displayName: 'Robotics Application Engineer Intern',
    designation: 'Robotics Application Engineer',
    aliases: ['robotics application engineer intern', 'robotic solutioning engineer', 'robotic solutioning engineer intern', 'robotic solutioning', 'robotics application engineer'],
  },
];

// Multi-Role Detector & Catalog Normalizer (Eliminates Duplicates)
export function detectAndNormalizeRoles(text: string, userRoleInput?: string): RoleCatalogItem[] {
  const catalogMap = new Map<string, RoleCatalogItem>();

  // If user entered a manual role
  if (userRoleInput && userRoleInput.trim()) {
    const rawRoles = userRoleInput.split(/[,;\n]/).map(r => r.trim()).filter(Boolean);
    rawRoles.forEach(r => {
      const matched = KNOWN_ROLE_CATALOG.find(k => k.aliases.some(alias => r.toLowerCase().includes(alias)));
      if (matched) {
        catalogMap.set(matched.id, matched);
      } else {
        catalogMap.set(r.toLowerCase(), {
          id: `custom-${r.toLowerCase().replace(/\s+/g, '-')}`,
          displayName: r,
          designation: r,
          aliases: [r.toLowerCase()],
        });
      }
    });
  }

  // Scan text for designation index & section headings
  KNOWN_ROLE_CATALOG.forEach(knownRole => {
    const isPresent = knownRole.aliases.some(alias => {
      const reg = new RegExp(`\\b${alias.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
      return reg.test(text);
    });
    if (isPresent) {
      catalogMap.set(knownRole.id, knownRole);
    }
  });

  return Array.from(catalogMap.values());
}

// Strict Role Section Isolator (Zero Skill Bleed between Roles!)
export function isolateRoleSection(text: string, activeRoleItem?: RoleCatalogItem | string): string {
  if (!activeRoleItem) return text;

  const roleAliases = typeof activeRoleItem === 'string'
    ? [activeRoleItem.toLowerCase()]
    : activeRoleItem.aliases;

  const lowerText = text.toLowerCase();

  // Find index line offset to avoid matching inside "Designations:" header line
  let searchOffset = 0;
  const designationsMatch = lowerText.match(/designations\s*:[^\n\r]+/i);
  if (designationsMatch && designationsMatch.index !== undefined) {
    searchOffset = designationsMatch.index + designationsMatch[0].length;
  }

  let foundIndex = -1;
  let matchedAlias = '';

  for (const alias of roleAliases) {
    // Search strictly after the designations index line
    const idx = lowerText.indexOf(alias, searchOffset);
    if (idx !== -1) {
      foundIndex = idx;
      matchedAlias = alias;
      break;
    }
  }

  // Fallback if searchOffset failed
  if (foundIndex === -1) {
    for (const alias of roleAliases) {
      const idx = lowerText.indexOf(alias);
      if (idx !== -1) {
        foundIndex = idx;
        matchedAlias = alias;
        break;
      }
    }
  }

  if (foundIndex === -1) return text;

  // Extract from section heading start to next role section heading
  const sliced = text.slice(foundIndex);
  
  // Find next role section boundary (must occur AFTER current role heading)
  const allAliases = KNOWN_ROLE_CATALOG.flatMap(k => k.aliases);
  let nextBoundaryIndex = sliced.length;

  allAliases.forEach(alias => {
    if (roleAliases.includes(alias)) return; // Skip current role
    const idx = sliced.toLowerCase().indexOf(alias, matchedAlias.length + 15);
    if (idx !== -1 && idx < nextBoundaryIndex) {
      nextBoundaryIndex = idx;
    }
  });

  // Check for shared bottom salary/posting conditions section boundary
  const salaryIdx = sliced.toLowerCase().search(/(?:salary description|stipend during internship|ppo after internship|compensation details|general conditions)/i);
  if (salaryIdx !== -1 && salaryIdx < nextBoundaryIndex) {
    nextBoundaryIndex = salaryIdx;
  }

  return sliced.slice(0, nextBoundaryIndex);
}

// Canonical Skill ID Normalizer (Maps variants e.g. "PostgreSQL" and "Postgres" to "sql")
export function normalizeSkillId(skillName: string): string {
  const lower = skillName.trim().toLowerCase();
  
  if (/solidworks|\bcad\b|fusion 360/i.test(lower)) return 'solidworks';
  if (/c\s*\/\s*c\+\+|embedded c|\bc\+\+\b|\bc\b/i.test(lower)) return 'cpp_c';
  if (/microcontroller|stm32|arduino|esp32|electronics/i.test(lower)) return 'microcontrollers';
  if (/canopen|\bcan bus\b|\bcan\b|modbus|plc|industrial communication/i.test(lower)) return 'can_plc';
  if (/python|pandas|numpy/i.test(lower)) return 'python';
  if (/machine learning|deep learning|pytorch|tensorflow/i.test(lower)) return 'ml_dl';
  if (/computer vision|opencv/i.test(lower)) return 'computer_vision';
  if (/llm|vlm|rag|genai|ai agents/i.test(lower)) return 'llm_rag';
  if (/ros2|\bros\b|robotics simulation/i.test(lower)) return 'ros_robotics';
  if (/excel|vlookup|pivot|google sheets|spreadsheets/i.test(lower)) return 'excel';
  if (/powerpoint|slide decks|presentations|slides/i.test(lower)) return 'powerpoint';
  if (/market research|competitive analysis/i.test(lower)) return 'market_research';
  if (/kpi|business metrics|kpi reporting/i.test(lower)) return 'business_metrics';
  if (/sql|postgresql|postgres|mysql/i.test(lower)) return 'sql';
  if (/power\s*bi|powerbi/i.test(lower)) return 'powerbi';
  if (/tableau/i.test(lower)) return 'tableau';
  if (/dax/i.test(lower)) return 'dax';
  if (/etl/i.test(lower)) return 'etl';
  if (/git/i.test(lower)) return 'git';
  if (/communication|presentation/i.test(lower)) return 'communication';
  if (/research|analytical|problem solving/i.test(lower)) return 'research_analytical';

  return lower.replace(/[^a-z0-9]/g, '');
}

// Check if a skill matches a candidate skill
export function isSkillInProfile(skillKey: string, candidateSkills: string[]): boolean {
  const normTarget = normalizeSkillId(skillKey);
  const entry = SKILL_ALIAS_MAP[skillKey];

  return candidateSkills.some(cs => {
    const normCs = normalizeSkillId(cs);
    if (normCs === normTarget) return true;
    if (entry) {
      if (cs.toLowerCase().includes(entry.canonical.toLowerCase())) return true;
      return entry.aliases.some(alias => alias.test(cs));
    }
    return false;
  });
}

// Strict Title Extractor
export function extractStrictTitle(text: string, userRole?: string, selectedRoleItem?: RoleCatalogItem): { roleTitle: string; designation?: string } {
  if (selectedRoleItem) {
    return {
      roleTitle: selectedRoleItem.displayName.toUpperCase(),
      designation: selectedRoleItem.designation ? selectedRoleItem.designation.toUpperCase() : undefined,
    };
  }
  if (userRole && userRole.trim()) {
    return { roleTitle: userRole.trim().toUpperCase() };
  }

  const explicitMatch = text.match(/(?:JOB TITLE|TITLE|POSITION|ROLE)[:\s]*([^\n\r]+)/i);
  if (explicitMatch) {
    return { roleTitle: explicitMatch[1].trim().toUpperCase() };
  }

  const firstLines = text.split('\n').map(l => l.trim()).filter(Boolean).slice(0, 12);
  for (const line of firstLines) {
    if (/analyst|engineer|developer|designer|manager|consultant|intern|associate|specialist|executive|scientist|researcher|marketing|finance|sales|hr|product|operations|business intelligence/i.test(line)) {
      return { roleTitle: line.toUpperCase() };
    }
  }

  return { roleTitle: 'ROLE NOT IDENTIFIED' };
}

// Location Extractor
export function extractStrictLocationDetails(text: string, userLocation?: string): {
  location: string;
  locationSource: 'USER_PROVIDED' | 'JD_EXTRACTED' | 'USER_AND_JD';
  locationConflict?: { userLoc: string; jdLoc: string };
} {
  const jdMatch = text.match(/(?:LOCATION|LOCATED IN|BASED IN)[:\s]*([^\n\r]+)/i);
  const jdLoc = jdMatch ? jdMatch[1].trim() : '';
  const userLocClean = userLocation ? userLocation.trim() : '';

  if (userLocClean && jdLoc) {
    const userCity = userLocClean.split(/[,;\s]/)[0].toUpperCase();
    const jdCity = jdLoc.split(/[,;\s]/)[0].toUpperCase();

    if (!jdLoc.toLowerCase().includes(userLocClean.toLowerCase()) && userCity !== jdCity) {
      return {
        location: userLocClean.toUpperCase(),
        locationSource: 'USER_PROVIDED',
        locationConflict: { userLoc: userLocClean, jdLoc },
      };
    }
    return {
      location: userLocClean.toUpperCase(),
      locationSource: 'USER_AND_JD',
    };
  }

  if (userLocClean) {
    return {
      location: userLocClean.toUpperCase(),
      locationSource: 'USER_PROVIDED',
    };
  }

  if (jdLoc) {
    return {
      location: jdLoc.toUpperCase(),
      locationSource: 'JD_EXTRACTED',
    };
  }

  return {
    location: 'LOCATION · NOT SPECIFIED',
    locationSource: 'JD_EXTRACTED',
  };
}

// Clean Structured Shared Posting Conditions Parser
export function extractStructuredPostingConditions(text: string): PostingCondition[] {
  const conditions: PostingCondition[] = [];

  // Duration
  const durationMatch = text.match(/(?:Duration of Internship|Internship Duration|Duration)[:\s]*([^\n\r()]+)/i);
  if (durationMatch) {
    conditions.push({ title: 'INTERNSHIP DURATION', value: durationMatch[1].trim().toUpperCase(), category: 'duration' });
  }

  // Probation
  const probationMatch = text.match(/(?:probation|probationary period)[:\s]*([^\n\r()]+)/i);
  if (probationMatch) {
    conditions.push({ title: 'PROBATION', value: probationMatch[1].trim().toUpperCase(), category: 'probation' });
  } else if (/2 months probation|3 months probation/i.test(text)) {
    const pVal = text.match(/(?:\d+)\s*months\s*probation/i);
    conditions.push({ title: 'PROBATION', value: pVal ? pVal[0].toUpperCase() : '2 MONTHS', category: 'probation' });
  }

  // Stipend
  const stipendMatch = text.match(/(?:Stipend During Internship|Stipend|Per Month)[:\s]*₹?\s*([^\n\r]+)/i);
  if (stipendMatch) {
    const val = stipendMatch[1].trim();
    const numMatch = val.match(/(?:Rs\.?|₹)?\s*(\d+(?:,\d+)?)/i);
    if (numMatch) {
      conditions.push({ title: 'STIPEND', value: `₹${numMatch[1]} / MONTH`, category: 'stipend' });
    } else {
      conditions.push({ title: 'STIPEND', value: val.toUpperCase(), category: 'stipend' });
    }
  }

  // Performance Incentive
  const incentiveMatch = text.match(/(?:performance-linked incentive|performance incentive|incentive)[:\s]*[^\n\r]*?(?:up to)?\s*(?:Rs\.?|₹)?\s*([\d,]+[^\n\r]*)/i);
  if (incentiveMatch) {
    const isEquity = /equity/i.test(text);
    conditions.push({ 
      title: isEquity ? 'EQUITY INCENTIVE' : 'PERFORMANCE INCENTIVE', 
      value: `UP TO ₹${incentiveMatch[1].trim().replace(/\.\s*EQUIVALENT/gi, '')}`.toUpperCase(), 
      category: 'equity' 
    });
  }

  // PPO Domestic
  const ppoDomMatch = text.match(/(?:PPO after Internship|PPO domestic|Domestic CTC)[:\s]*[^\n\r]*?(?:CTC|Rs\.?|₹)?\s*(\d+(?:\.\d+)?\s*(?:LPA|Lakhs?)\s*To\s*CTC\s*Rs\.?\s*\d+(?:\.\d+)?\s*(?:LPA|Lakhs?))/i);
  if (ppoDomMatch) {
    const cleanRange = ppoDomMatch[1].replace(/CTC|Rs\.?/gi, '').trim();
    conditions.push({ title: 'PPO · DOMESTIC', value: cleanRange.toUpperCase(), category: 'ppo_domestic' });
  } else {
    const lpaMatch = text.match(/(?:PPO|CTC)[^\n\r]*?(\d+)\s*LPA\s*To\s*(\d+)\s*LPA/i);
    if (lpaMatch) {
      conditions.push({ title: 'PPO · DOMESTIC', value: `₹${lpaMatch[1]}–${lpaMatch[2]} LPA`, category: 'ppo_domestic' });
    }
  }

  // PPO International
  const ppoIntMatch = text.match(/(?:International CTC|International PPO)[:\s]*[^\n\r]*?(?:CTC|Rs\.?|₹)?\s*(\d+\s*LPA\s*To\s*CTC\s*Rs\.?\s*\d+\s*LPA[^\n\r]*)/i);
  if (ppoIntMatch) {
    const cleanInt = ppoIntMatch[1].replace(/CTC|Rs\.?/gi, '').trim();
    conditions.push({ title: 'PPO · INTERNATIONAL', value: cleanInt.toUpperCase(), category: 'ppo_international' });
  }

  return conditions;
}

// Line-Aware Experience Extractor
export function extractStrictExperience(text: string): string {
  const lineMatch = text.match(/(?:eligibility|experience required|qualification)[:\s]*([^\n\r]+)/i);
  if (lineMatch) {
    const val = lineMatch[1].trim();
    if (/final-year|recent graduate|student/i.test(val)) {
      return 'FINAL-YEAR / RECENT GRADUATES';
    }
    if (val.length < 40) return val.toUpperCase();
  }
  if (/final-year|recent graduate|student|fresher/i.test(text)) {
    return 'FINAL-YEAR / RECENT GRADUATES';
  }
  return 'NOT SPECIFIED';
}

// Primary Compensation Summary Line Extractor
export function extractStrictCompensation(text: string, conditions: PostingCondition[]): string {
  const stipend = conditions.find(c => c.category === 'stipend');
  const ppo = conditions.find(c => c.category === 'ppo_domestic');

  if (stipend && ppo) {
    return `${stipend.value} (PPO: ${ppo.value})`;
  }
  if (stipend) return stipend.value;
  if (ppo) return `PPO: ${ppo.value}`;

  const ctcMatch = text.match(/(?:CTC|SALARY|COMPENSATION)[:\s]*([^\n\r]+)/i);
  if (ctcMatch) {
    const val = ctcMatch[1].trim();
    const lpaMatch = val.match(/₹?\s*(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)\s*(?:LPA|L|Lakhs?)/i);
    if (lpaMatch) return `₹${lpaMatch[1]}–${lpaMatch[2]} LPA`;
    if (val.length < 35 && !/\.|\bthe\b|\band\b/i.test(val)) return val;
  }

  return 'COMPENSATION · NOT SPECIFIED';
}

// Tailored Inspector Details
export function getTailoredInspectorDetails(skillName: string, roleTitle: string, isRequired: boolean) {
  const lower = skillName.toLowerCase();

  if (lower.includes('excel') || lower.includes('sheets')) {
    return {
      expected: 'Proficiency in Excel / Google Sheets data modeling & functions',
      whyItMatters: 'Essential for tracking project metrics, financial modeling, and operational logs.',
      actionMove: 'Review VLOOKUP, INDEX/MATCH, Pivot Tables, and scenario modeling.',
    };
  }

  if (lower.includes('communication')) {
    return {
      expected: 'Strong oral & written executive communication',
      whyItMatters: 'Critical for coordinating with founders, cross-functional leads, and external partners.',
      actionMove: 'Prepare concise status update summaries and presentation examples.',
    };
  }

  if (lower.includes('research') || lower.includes('analytical')) {
    return {
      expected: 'Independent analytical research & problem solving',
      whyItMatters: 'Required to evaluate strategic opportunities and synthesize recommendations.',
      actionMove: 'Highlight competitive analysis or structured research projects.',
    };
  }
  
  if (lower.includes('solidworks') || lower.includes('cad')) {
    return {
      expected: 'Proficiency in SolidWorks, AutoCAD or 3D modeling',
      whyItMatters: isRequired ? 'Core requirement for mechanical component prototyping and design.' : 'Preferred skill for mechanical assemblies.',
      actionMove: 'Highlight CAD design projects and 3D modeling portfolio.',
    };
  }

  if (lower.includes('python')) {
    return {
      expected: 'Working proficiency with Python & data libraries',
      whyItMatters: 'Used for automated analysis, AI models, or robotics scripting.',
      actionMove: 'Review fundamental Python syntax and data handling libraries.',
    };
  }

  return {
    expected: `Working knowledge of ${skillName}`,
    whyItMatters: `${skillName} is listed as a requirement for ${roleTitle}.`,
    actionMove: `Review fundamental concepts of ${skillName} before interviewing.`,
  };
}

// MAIN DYNAMIC PARSER UTILITY WITH MULTI-ROLE CATALOG & SECTION ISOLATION
export function analyzeJobDescription(
  rawText: string,
  candidateProfile: CandidateProfile,
  userRole?: string,
  userLocation?: string,
  selectedRoleOverrideId?: string
): ParsedJd {
  const text = rawText || '';

  // 1. Detect & Normalize Multi-Role Catalog
  const detectedRoles = detectAndNormalizeRoles(text, userRole);

  // Determine Active Role Item
  let activeRoleItem: RoleCatalogItem | undefined;
  if (selectedRoleOverrideId) {
    activeRoleItem = detectedRoles.find(r => r.id === selectedRoleOverrideId || r.displayName.toLowerCase() === selectedRoleOverrideId.toLowerCase());
  }
  if (!activeRoleItem && detectedRoles.length > 0) {
    activeRoleItem = detectedRoles[0];
  }

  // 2. Isolate Section for the Selected Active Role (Zero Skill Bleed!)
  const roleIsolatedText = isolateRoleSection(text, activeRoleItem);

  const { roleTitle, designation } = extractStrictTitle(text, userRole, activeRoleItem);
  const { location, locationSource, locationConflict } = extractStrictLocationDetails(text, userLocation);
  const postingConditions = extractStructuredPostingConditions(text);
  const salaryRange = extractStrictCompensation(text, postingConditions);
  const experienceLevel = extractStrictExperience(roleIsolatedText);

  let workplaceType: 'Onsite' | 'Hybrid' | 'Remote' = 'Hybrid';
  if (/remote/i.test(location) || /remote/i.test(text)) workplaceType = 'Remote';
  else if (/onsite/i.test(location) || /onsite/i.test(text)) workplaceType = 'Onsite';

  const extractedRequirements: Requirement[] = [];
  const matchesMap: Record<string, SkillMatch> = {};

  // 3. Scan ONLY the role-isolated text section for skill requirements
  Object.keys(SKILL_ALIAS_MAP).forEach((skillKey) => {
    const entry = SKILL_ALIAS_MAP[skillKey];
    const isPresent = entry.aliases.some(alias => alias.test(roleIsolatedText));
    if (!isPresent) return;

    let isPreferred = false;
    entry.aliases.forEach(alias => {
      const match = roleIsolatedText.match(new RegExp(`(?:preferred|optional|plus|bonus|good to have)[^\\n\\r]{0,40}${alias.source}`, 'i')) ||
                    roleIsolatedText.match(new RegExp(`${alias.source}[^\\n\\r]{0,40}(?:preferred|optional|plus|bonus|good to have)`, 'i'));
      if (match && /preferred|optional|plus|bonus|good to have/i.test(match[0])) {
        isPreferred = true;
      }
    });

    // Special classification rule for Data & BI Analyst: Python is preferred, NOT core required
    if (activeRoleItem?.id === 'role-data-bi' && skillKey === 'python') {
      isPreferred = true;
    }

    const priority = isPreferred ? 'preferred' : 'core';
    const reqId = `req-${skillKey}`;
    const reqObj: Requirement = {
      id: reqId,
      category: entry.category,
      title: entry.canonical,
      description: isPreferred ? `Preferred capability for ${roleTitle}.` : `Core requirement for ${roleTitle}.`,
      levelExpected: isPreferred ? 'Preferred / Bonus' : 'Working Proficiency',
      priority,
    };

    extractedRequirements.push(reqObj);

    const isMatched = isSkillInProfile(skillKey, candidateProfile.skills);
    
    let matchStatus: SkillMatch['matchStatus'] = 'gap';
    if (priority === 'core') {
      matchStatus = isMatched ? 'matched' : 'gap';
    } else {
      matchStatus = isMatched ? 'preferred_matched' : 'preferred_unlisted';
    }

    const inspector = getTailoredInspectorDetails(entry.canonical, roleTitle, priority === 'core');

    matchesMap[reqId] = {
      requirementId: reqId,
      matchStatus,
      candidateSkillName: isMatched ? entry.canonical : 'Not listed',
      candidateProficiency: isMatched ? 'Matched in profile' : 'Not listed',
      explanation: isMatched ? `Direct match in candidate profile.` : (priority === 'core' ? `Missing core skill for ${roleTitle}.` : `Not listed in candidate profile.`),
      whyItMatters: inspector.whyItMatters,
      actionMove: inspector.actionMove,
    };
  });

  // Extra Candidate Skills not mentioned in this active role's section
  const extraSkills: string[] = [];
  candidateProfile.skills.forEach(candSkill => {
    const isMentionedInRoleSection = Object.keys(SKILL_ALIAS_MAP).some(skillKey => {
      const entry = SKILL_ALIAS_MAP[skillKey];
      const isPresent = entry.aliases.some(alias => alias.test(roleIsolatedText));
      const isMatchCand = entry.aliases.some(alias => alias.test(candSkill)) || candSkill.toLowerCase().includes(entry.canonical.toLowerCase());
      return isPresent && isMatchCand;
    });

    if (!isMentionedInRoleSection) {
      extraSkills.push(candSkill);
    }
  });

  const coreRequirements = extractedRequirements.filter(r => r.priority === 'core');
  const matchedCoreCount = coreRequirements.filter(r => matchesMap[r.id]?.matchStatus === 'matched').length;
  const totalCoreCount = coreRequirements.length;
  const coreGapCount = totalCoreCount - matchedCoreCount;
  const coreRatio = totalCoreCount > 0 ? matchedCoreCount / totalCoreCount : 0;

  const keyGaps = coreRequirements.filter(r => matchesMap[r.id]?.matchStatus === 'gap').map(r => r.title);

  let signal: VerdictSignal = 'WORTH_CONSIDERING';
  let signalTitle = `STRONG SIGNAL · ${keyGaps.length > 0 ? keyGaps[0] + ' IS THE MAIN GAP' : 'HIGH ALIGNMENT'}`;
  let honestAdvice = `Core ${roleTitle} requirements align well enough to consider. ${keyGaps.length > 0 ? keyGaps[0] + ' is the primary gap.' : ''}`;

  if (roleTitle === 'ROLE NOT IDENTIFIED' || totalCoreCount === 0) {
    signal = 'LIMITED_SIGNAL';
    signalTitle = 'LIMITED SIGNAL · ROLE DETAILS INCOMPLETE';
    honestAdvice = 'Core skill alignment is visible, but the role details are incomplete.';
  } else if (coreRatio >= 0.75) {
    signal = 'STRONG_FIT';
    signalTitle = 'STRONG SIGNAL · HIGH ALIGNMENT';
    honestAdvice = `High alignment between your profile and ${roleTitle} expectations.`;
  } else if (coreRatio >= 0.4) {
    signal = 'WORTH_CONSIDERING';
    signalTitle = `WORTH CONSIDERING · ${keyGaps.length > 0 ? keyGaps[0] + ' IS THE MAIN GAP' : '1 KEY GAP'}`;
    honestAdvice = `Consider applying for ${roleTitle}. ${keyGaps.length > 0 ? keyGaps[0] : 'Skill'} is the main gap to prepare.`;
  } else {
    signal = 'SIGNIFICANT_GAPS';
    signalTitle = 'SIGNIFICANT GAPS · LOW ALIGNMENT';
    honestAdvice = `Core requirements for ${roleTitle} are currently missing from your profile. ${keyGaps[0] || 'Key skill'} is the largest gap.`;
  }

  return {
    id: `parsed-${Date.now()}`,
    roleTitle,
    designation,
    companyName: 'Company Posting',
    location,
    experienceLevel,
    salaryRange,
    workplaceType,
    department: 'Role Requirements',
    rawText,
    userRole,
    userLocation,
    selectedRole: activeRoleItem?.id,
    detectedRoles,
    locationSource,
    locationConflict,
    postingConditions,
    requirements: extractedRequirements,
    matches: matchesMap,
    extraSkills,
    coreRequirementCount: totalCoreCount,
    coreMatchCount: matchedCoreCount,
    coreGapCount,
    overallVerdict: {
      signal,
      signalTitle,
      summary: `${matchedCoreCount} / ${totalCoreCount} core skills matched for ${roleTitle}. Key gap: ${keyGaps[0] || 'None'}.`,
      coreSkillsMatched: matchedCoreCount,
      coreSkillsTotal: totalCoreCount,
      eligibilityMet: true,
      keyGaps,
      honestAdvice,
    },
  };
}
