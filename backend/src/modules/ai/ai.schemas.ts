import { z } from 'zod';

export const listingIssueSchema = z.object({
  type: z.string(),
  severity: z.enum(['low', 'medium', 'high']),
  message: z.string(),
  excerpt: z.string().optional(),
});

export const skillSchema = z.object({
  skillName: z.string(),
  importance: z.enum(['must_have', 'nice_to_have']),
  expectedLevel: z.string(),
  testable: z.boolean(),
});

export const listingCheckSchema = z.object({
  issues: z.array(listingIssueSchema),
  skills: z.array(skillSchema),
});

export const listingRewriteSchema = z.object({
  improvedDescription: z.string(),
});

export const jobWizardGenSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export type JobWizardGenResult = z.infer<typeof jobWizardGenSchema>;

export const teamProfileFromWebSchema = z.object({
  teamProfile: z.string().min(10),
});

export type TeamProfileFromWebResult = z.infer<typeof teamProfileFromWebSchema>;

export const mcqOptionGenSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
});

export const questionGenSchema = z
  .object({
    questionType: z.enum(['code', 'mcq']).default('code'),
    title: z.string(),
    instructions: z.string(),
    starterCode: z.string().optional().default(''),
    points: z.number().positive(),
    language: z.string().optional().default('javascript'),
    options: z.array(mcqOptionGenSchema).optional(),
    correctOptionId: z.string().optional(),
    rubric: z.record(z.unknown()).optional().default({}),
  })
  .superRefine((q, ctx) => {
    if (q.questionType === 'mcq') {
      if (!q.options || q.options.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'MCQ questions need at least 2 options',
          path: ['options'],
        });
      }
      if (
        !q.correctOptionId ||
        !q.options?.some((o) => o.id === q.correctOptionId)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'MCQ questions need a valid correctOptionId',
          path: ['correctOptionId'],
        });
      }
    }
  });

export const assessmentGenSchema = z.object({
  durationMinutes: z.number(),
  totalPoints: z.number(),
  questions: z.array(questionGenSchema),
});

export const dimensionScoreSchema = z.object({
  dimension: z.enum([
    'technical',
    'problem_solving',
    'code_quality',
    'communication',
  ]),
  score: z.number().min(0).max(100),
});

export const sessionGradeSchema = z.object({
  overallScore: z.number().min(0).max(100),
  matchPercent: z.number().min(0).max(100),
  recommendation: z.enum(['ready_now', 'trainable', 'at_risk']),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  aiSummary: z.string(),
  dimensionScores: z.array(dimensionScoreSchema),
  questionScores: z
    .array(
      z.object({
        questionId: z.string(),
        score: z.number(),
        feedback: z.string(),
      }),
    )
    .optional(),
});

export type ListingCheckResult = z.infer<typeof listingCheckSchema>;
export type AssessmentGenResult = z.infer<typeof assessmentGenSchema>;
export type SessionGradeResult = z.infer<typeof sessionGradeSchema>;
