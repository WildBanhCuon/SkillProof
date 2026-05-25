export type JobWizardAnswers = {
  roleTitle: string;
  seniority: 'intern' | 'junior' | 'mid';
  teamContext: string;
  responsibilities: string;
  mustHaveSkills: string;
  niceToHaveSkills: string;
  experienceLevel: 'none' | '0-1' | '1-2' | '2+';
  workMode: 'remote' | 'hybrid' | 'onsite';
  location: string;
  tone: 'professional' | 'friendly' | 'startup';
};

export const INITIAL_WIZARD_ANSWERS: JobWizardAnswers = {
  roleTitle: '',
  seniority: 'junior',
  teamContext: '',
  responsibilities: '',
  mustHaveSkills: '',
  niceToHaveSkills: '',
  experienceLevel: '0-1',
  workMode: 'hybrid',
  location: '',
  tone: 'professional',
};

export const WIZARD_STEPS = [
  {
    id: 'role',
    title: 'Role',
    subtitle: 'What position are you hiring for?',
  },
  {
    id: 'team',
    title: 'Team',
    subtitle: 'Help candidates understand the context',
  },
  {
    id: 'work',
    title: 'Day to day',
    subtitle: 'What will they actually do?',
  },
  {
    id: 'skills',
    title: 'Skills',
    subtitle: 'What should candidates bring?',
  },
  {
    id: 'logistics',
    title: 'Logistics',
    subtitle: 'Experience, location, and work style',
  },
  {
    id: 'tone',
    title: 'Tone',
    subtitle: 'How should the posting sound?',
  },
  {
    id: 'review',
    title: 'Review',
    subtitle: 'Check your answers, then let AI draft the posting',
  },
] as const;

export const SENIORITY_OPTIONS = [
  { value: 'intern', label: 'Intern / trainee' },
  { value: 'junior', label: 'Junior' },
  { value: 'mid', label: 'Mid-level' },
] as const;

export const EXPERIENCE_OPTIONS = [
  { value: 'none', label: 'No prior experience required' },
  { value: '0-1', label: '0–1 years' },
  { value: '1-2', label: '1–2 years' },
  { value: '2+', label: '2+ years' },
] as const;

export const WORK_MODE_OPTIONS = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' },
] as const;

export const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional', hint: 'Clear and formal' },
  { value: 'friendly', label: 'Friendly', hint: 'Warm and approachable' },
  { value: 'startup', label: 'Startup', hint: 'Energetic and concise' },
] as const;
