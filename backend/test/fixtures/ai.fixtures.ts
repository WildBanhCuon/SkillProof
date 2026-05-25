import {
  AssessmentGenResult,
  ListingCheckResult,
  SessionGradeResult,
} from '../../src/modules/ai/ai.schemas';

export const mockListingCheck: ListingCheckResult = {
  issues: [
    {
      type: 'seniority_mismatch',
      severity: 'high',
      message: 'Junior role asks for 3+ years',
      excerpt: '3+ years',
    },
  ],
  skills: [
    {
      skillName: 'React',
      importance: 'must_have',
      expectedLevel: 'junior',
      testable: true,
    },
    {
      skillName: 'TypeScript',
      importance: 'must_have',
      expectedLevel: 'junior',
      testable: true,
    },
  ],
};

export const mockListingRewrite = {
  improvedDescription:
    'We are hiring a Junior Frontend Developer.\n\n- Build React features\n- Work with TypeScript',
};

export const mockJobWizardGen = {
  title: 'Junior Frontend Developer',
  description:
    '### About the role\n\nJoin our product team.\n\n### Responsibilities\n\n- Build React features\n\n### Requirements\n\n- React, TypeScript',
};

export const mockAssessment: AssessmentGenResult = {
  durationMinutes: 90,
  totalPoints: 100,
  questions: [
    {
      title: 'React state',
      instructions: 'Fix the component.',
      starterCode: 'function App() { return null; }',
      points: 25,
      language: 'javascript',
      rubric: { clarity: 5 },
      testCases: [
        { input: null, expectedOutput: 'ok', isHidden: false },
        { input: '1', expectedOutput: 'ok', isHidden: true },
      ],
    },
    {
      title: 'API fetch',
      instructions: 'Fetch users.',
      starterCode: 'async function load() {}',
      points: 25,
      language: 'javascript',
      rubric: { error_handling: 5 },
      testCases: [
        { input: null, expectedOutput: '[]', isHidden: false },
        { input: null, expectedOutput: '[]', isHidden: true },
      ],
    },
    {
      title: 'TypeScript types',
      instructions: 'Add types.',
      starterCode: 'const x = 1;',
      points: 25,
      language: 'javascript',
      rubric: { types: 5 },
      testCases: [{ input: null, expectedOutput: '1', isHidden: true }],
    },
    {
      title: 'Debug UI',
      instructions: 'Find the bug.',
      starterCode: 'console.log("hi");',
      points: 25,
      language: 'javascript',
      rubric: { debugging: 5 },
      testCases: [{ input: null, expectedOutput: 'hi', isHidden: true }],
    },
  ],
};

export const mockSessionGrade: SessionGradeResult = {
  overallScore: 78,
  matchPercent: 82,
  recommendation: 'trainable',
  strengths: ['Solid React basics'],
  improvements: ['Add loading states'],
  aiSummary: 'Good junior candidate with room to grow.',
  dimensionScores: [
    { dimension: 'technical', score: 75 },
    { dimension: 'problem_solving', score: 80 },
    { dimension: 'code_quality', score: 72 },
    { dimension: 'communication', score: 85 },
  ],
};
