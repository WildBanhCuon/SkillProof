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

/** Gemini often emits null for omitted fields — coerce before validation. */
const optionalString = z.preprocess(
  (v) => (v === null || v === '' ? undefined : v),
  z.string().optional(),
);

const questionGenObjectSchema = z.object({
  questionType: z.enum(['code', 'mcq']).default('code'),
  title: z.string(),
  instructions: z.string(),
  starterCode: z.preprocess(
    (v) => (v === null || v === undefined ? '' : v),
    z.string().default(''),
  ),
  points: z.number().positive(),
  language: z.preprocess(
    (v) => (v === null || v === undefined ? undefined : v),
    z.string().optional().default('javascript'),
  ),
  options: z.preprocess(
    (v) => (v === null ? undefined : v),
    z.array(mcqOptionGenSchema).optional(),
  ),
  correctOptionId: optionalString,
  rubric: z.preprocess(
    (v) => (v === null || v === undefined ? {} : v),
    z.record(z.unknown()).default({}),
  ),
});

type QuestionGenInput = z.infer<typeof questionGenObjectSchema>;

function normalizeGeneratedQuestion(q: QuestionGenInput): QuestionGenInput {
  if (q.questionType === 'code') {
    return {
      ...q,
      starterCode: q.starterCode ?? '',
      language: q.language ?? 'javascript',
      options: undefined,
      correctOptionId: undefined,
    };
  }

  const rubric = { ...(q.rubric ?? {}) } as Record<string, unknown>;
  const options = (q.options ?? []).map((o, i) => ({
    id: o.id?.trim() || String.fromCharCode(97 + i),
    label: o.label,
  }));

  let correctOptionId = q.correctOptionId;
  if (!correctOptionId) {
    const fromRubric =
      rubric.correctOptionId ?? rubric.correctAnswer ?? rubric.answer;
    if (typeof fromRubric === 'string' && fromRubric.length > 0) {
      correctOptionId = fromRubric;
    }
  }
  if (
    correctOptionId &&
    options.length > 0 &&
    !options.some((o) => o.id === correctOptionId)
  ) {
    correctOptionId = undefined;
  }
  if (!correctOptionId && options.length > 0) {
    correctOptionId = options[0].id;
  }

  return {
    ...q,
    questionType: 'mcq',
    starterCode: '',
    language: 'text',
    options,
    correctOptionId,
    rubric: { ...rubric, correctOptionId },
  };
}

export const questionGenSchema = questionGenObjectSchema
  .transform(normalizeGeneratedQuestion)
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
