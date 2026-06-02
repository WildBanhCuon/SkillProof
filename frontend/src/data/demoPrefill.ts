import type { BillingPeriod, PlanId } from './pricingPlans';
import type { JobWizardAnswers } from './jobWizard';

export type DemoCompanyRegistrationPrefill = {
  planId: PlanId;
  billing: BillingPeriod;
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  email: string;
  password: string;
};

export type DemoCandidateRegistrationPrefill = {
  email: string;
  password: string;
};

export type DemoHrProfilePrefill = {
  fullName: string;
  companyName: string;
  websiteUrl: string;
};

/** Name, company, and website only — use “Generate from website” live for team description. */
export const DEMO_HR_PROFILE: DemoHrProfilePrefill = {
  fullName: 'Deepak Sathyanarayan',
  companyName: 'Goodnaut',
  websiteUrl: 'https://www.goodnaut.com/',
};

export function buildDemoCompanyRegistration(): DemoCompanyRegistrationPrefill {
  return {
    planId: 'growth',
    billing: 'monthly',
    cardName: 'Joris Rabilloud',
    cardNumber: '4242 4242 4242 4242',
    cardExpiry: '12/28',
    cardCvc: '123',
    email: 'demo@gmail.com',
    password: 'password',
  };
}

export function buildDemoCandidateRegistration(): DemoCandidateRegistrationPrefill {
  return {
    email: 'joris.rabilloud@gmail.com',
    password: 'password',
  };
}

export type DemoCandidateProfilePrefill = {
  displayName: string;
  linkedInUrl: string;
  githubUrl: string;
};

export const DEMO_CANDIDATE_PROFILE: DemoCandidateProfilePrefill = {
  displayName: 'Joris Rabilloud',
  linkedInUrl: 'https://linkedin.com/in/joris-rabilloud',
  githubUrl: 'http://github.com/Joriiss/',
};

export const DEMO_JOB_WIZARD: JobWizardAnswers = {
  roleTitle: 'Junior Frontend Developer',
  seniority: 'junior',
  teamContext:
    'We are a 25-person B2B SaaS company building a learning platform for tech hiring. You would join the product squad with 2 designers, 4 developers, and a product manager. We ship in two-week sprints and value clear communication.',
  responsibilities:
    'Build and maintain React features in TypeScript\nCollaborate with design on UI polish\nParticipate in code reviews and pair programming\nWrite unit tests for critical paths\nSupport bug fixes in production with guidance from seniors',
  mustHaveSkills: 'React, TypeScript, HTML/CSS, Git, REST APIs',
  niceToHaveSkills: 'Vitest, Tailwind CSS, basic Node.js',
  experienceLevel: '0-1',
  workMode: 'hybrid',
  location: 'Boston',
  tone: 'startup',
};
