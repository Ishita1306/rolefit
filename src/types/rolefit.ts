export type RequirementCategory = 'hard_skill' | 'soft_skill' | 'eligibility' | 'tradeoff' | 'meta';
export type RequirementPriority = 'core' | 'preferred' | 'optional';

export type MatchStatus = 'matched' | 'gap' | 'preferred_matched' | 'preferred_unlisted' | 'extra_signal';
export type VerdictSignal = 'STRONG_FIT' | 'WORTH_CONSIDERING' | 'SIGNIFICANT_GAPS' | 'LIMITED_SIGNAL' | 'INSUFFICIENT_SIGNAL';

export interface Requirement {
  id: string;
  category: RequirementCategory;
  title: string;
  description: string;
  levelExpected: string;
  priority: RequirementPriority;
}

export interface SkillMatch {
  requirementId: string;
  matchStatus: MatchStatus;
  candidateSkillName?: string;
  candidateProficiency?: string;
  explanation: string;
  whyItMatters: string;
  actionMove: string;
}

export interface RoleCatalogItem {
  id: string;
  displayName: string;
  designation?: string;
  aliases: string[];
}

export interface PostingCondition {
  title: string;
  value: string;
  category: 'duration' | 'probation' | 'stipend' | 'equity' | 'ppo_domestic' | 'ppo_international' | 'general';
}

export interface ParsedJd {
  id: string;
  roleTitle: string;
  designation?: string;
  companyName: string;
  location: string;
  experienceLevel: string;
  salaryRange: string;
  workplaceType: 'Onsite' | 'Hybrid' | 'Remote';
  department: string;
  rawText: string;
  userRole?: string;
  userLocation?: string;
  selectedRole?: string;
  detectedRoles: RoleCatalogItem[];
  locationSource: 'USER_PROVIDED' | 'JD_EXTRACTED' | 'USER_AND_JD';
  locationConflict?: { userLoc: string; jdLoc: string };
  postingConditions: PostingCondition[];
  requirements: Requirement[];
  matches: Record<string, SkillMatch>;
  extraSkills: string[];
  coreRequirementCount: number;
  coreMatchCount: number;
  coreGapCount: number;
  overallVerdict: {
    signal: VerdictSignal;
    signalTitle: string;
    summary: string;
    coreSkillsMatched: number;
    coreSkillsTotal: number;
    eligibilityMet: boolean;
    keyGaps: string[];
    honestAdvice: string;
  };
}

export interface CandidateProfile {
  id: string;
  name: string;
  profileType: 'demo' | 'custom';
  degree: string;
  specialization: string;
  experienceLevel: string;
  skills: string[];
}

export interface JargonItem {
  id: string;
  boilerplateText: string;
  decodedPlainEnglish: string;
  contextTag: string;
  impactAssessment: string;
}
