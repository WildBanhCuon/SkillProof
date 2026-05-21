import { GeminiService } from '../../src/modules/ai/gemini.service';
import {
  mockAssessment,
  mockListingCheck,
  mockListingRewrite,
  mockSessionGrade,
} from '../fixtures/ai.fixtures';

export const createGeminiMock = (): Partial<GeminiService> => ({
  analyzeListing: jest.fn().mockResolvedValue(mockListingCheck),
  rewriteListing: jest.fn().mockResolvedValue(mockListingRewrite),
  generateAssessment: jest.fn().mockResolvedValue(mockAssessment),
  gradeSession: jest.fn().mockResolvedValue(mockSessionGrade),
});
