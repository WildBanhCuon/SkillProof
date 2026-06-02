import { GeminiService } from '../../src/modules/ai/gemini.service';
import {
  mockAssessment,
  mockListingCheck,
  mockJobWizardGen,
  mockListingRewrite,
  mockSessionGrade,
} from '../fixtures/ai.fixtures';

export const createGeminiMock = (): Partial<GeminiService> => ({
  generateJobFromWizard: jest.fn().mockResolvedValue(mockJobWizardGen),
  generateTeamProfileFromWebsite: jest.fn().mockResolvedValue({
    teamProfile:
      'We are a product-focused team building hiring tools for technical recruiters.',
    sources: ['https://example.com/'],
  }),
  analyzeListing: jest.fn().mockResolvedValue(mockListingCheck),
  rewriteListing: jest.fn().mockResolvedValue(mockListingRewrite),
  generateAssessment: jest.fn().mockResolvedValue(mockAssessment),
  gradeSession: jest.fn().mockResolvedValue(mockSessionGrade),
});
