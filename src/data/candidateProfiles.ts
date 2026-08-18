import { CandidateProfile } from '../types/rolefit';

export const PRESET_PROFILES: CandidateProfile[] = [
  {
    id: 'preset-btech-data',
    name: 'B.Tech · Data Analytics & Systems',
    profileType: 'demo',
    degree: 'B.Tech',
    specialization: 'Data Analytics & Embedded Systems',
    experienceLevel: 'Fresher',
    skills: ['Python', 'Pandas', 'Power BI', 'Excel', 'Communication', 'ROS / ROS2', 'Research & Analytical'],
  },
  {
    id: 'preset-bba-mkt',
    name: 'BBA · Marketing',
    profileType: 'demo',
    degree: 'BBA',
    specialization: 'Marketing',
    experienceLevel: 'Fresher',
    skills: ['Excel', 'Digital Marketing', 'Market Research', 'Communication', 'Canva'],
  },
  {
    id: 'preset-mba-biz',
    name: 'MBA · Business Strategy',
    profileType: 'demo',
    degree: 'MBA',
    specialization: 'Business Strategy',
    experienceLevel: 'Student / Fresher',
    skills: ['Excel', 'Business Analysis', 'Communication', 'Market Research', 'PowerPoint'],
  },
  {
    id: 'preset-bcom-fin',
    name: 'B.Com · Finance',
    profileType: 'demo',
    degree: 'B.Com',
    specialization: 'Finance',
    experienceLevel: 'Fresher',
    skills: ['Excel', 'Financial Analysis', 'Accounting', 'Communication', 'Financial Reporting'],
  },
  {
    id: 'preset-bdes-design',
    name: 'B.Des · Design',
    profileType: 'demo',
    degree: 'B.Des',
    specialization: 'UI & Visual Design',
    experienceLevel: 'Fresher',
    skills: ['Figma', 'Canva', 'UI Design', 'Communication', 'Visual Design'],
  },
];

export const DEFAULT_CANDIDATE_PROFILE: CandidateProfile = PRESET_PROFILES[0];
