import { Question, QuestionType } from '@prisma/client';

export type McqOption = { id: string; label: string };

export function getMcqCorrectOptionId(rubric: unknown): string | null {
  if (!rubric || typeof rubric !== 'object') return null;
  const id = (rubric as { correctOptionId?: unknown }).correctOptionId;
  return typeof id === 'string' && id.length > 0 ? id : null;
}

export function parseMcqOptions(raw: unknown): McqOption[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (o): o is McqOption =>
      !!o &&
      typeof o === 'object' &&
      typeof (o as McqOption).id === 'string' &&
      typeof (o as McqOption).label === 'string',
  );
}

export function formatQuestionForCandidate(q: Question) {
  const questionType =
    q.questionType === QuestionType.MCQ ? 'mcq' : 'code';
  return {
    id: q.id,
    orderIndex: q.orderIndex,
    title: q.title,
    instructions: q.instructions,
    starterCode: questionType === 'mcq' ? '' : q.starterCode,
    points: q.points,
    language: q.language,
    questionType,
    options:
      questionType === 'mcq' ? parseMcqOptions(q.mcqOptions) : undefined,
  };
}

export function initialAnswerCode(q: Question): string {
  return q.questionType === QuestionType.MCQ ? '' : q.starterCode;
}
