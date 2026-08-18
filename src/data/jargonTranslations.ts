import { JargonItem } from '../types/rolefit';

export const SAMPLE_JARGON_LIST: JargonItem[] = [
  {
    id: 'jargon-1',
    boilerplateText: 'Must thrive in a fast-paced, highly ambiguous environment.',
    decodedPlainEnglish: 'Priorities can change quickly, and you may need to work with incomplete instructions.',
    contextTag: 'WHAT THIS USUALLY SIGNALS',
    impactAssessment: 'Requires comfort with iteration and independent problem-solving.'
  },
  {
    id: 'jargon-2',
    boilerplateText: 'Collaborate cross-functionally to drive data-informed initiatives.',
    decodedPlainEnglish: "You'll likely need to explain analysis to people outside your technical team.",
    contextTag: 'PLAIN-LANGUAGE INTERPRETATION',
    impactAssessment: 'High focus on clear visual charts and non-technical verbal summaries.'
  },
  {
    id: 'jargon-3',
    boilerplateText: 'Competitive compensation with strong growth potential.',
    decodedPlainEnglish: 'The phrase is vague, but this particular JD lists a CTC range separately.',
    contextTag: 'PLAIN-LANGUAGE INTERPRETATION',
    impactAssessment: 'Verify fixed base vs variable structure during recruiter conversations.'
  }
];
