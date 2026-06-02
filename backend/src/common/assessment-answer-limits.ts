import { BadRequestException } from '@nestjs/common';
import { QuestionType } from '@prisma/client';
import { parseMcqOptions, type McqOption } from './question-public';

/** Max characters per coding answer (DB + LLM input). */
export const MAX_CODE_ANSWER_LENGTH = 12_000;

/** Max characters for optional candidate notes per question. */
export const MAX_ANSWER_NOTES_LENGTH = 500;

export function truncateForGrading(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}\n… [truncated for grading]`;
}

export function assertCodeAnswerLength(code: string): string {
  if (code.length > MAX_CODE_ANSWER_LENGTH) {
    throw new BadRequestException(
      `Answer exceeds ${MAX_CODE_ANSWER_LENGTH.toLocaleString()} characters`,
    );
  }
  return code;
}

export function assertNotesLength(notes: string | undefined): string | undefined {
  if (notes == null || notes === '') return notes;
  if (notes.length > MAX_ANSWER_NOTES_LENGTH) {
    throw new BadRequestException(
      `Notes exceed ${MAX_ANSWER_NOTES_LENGTH} characters`,
    );
  }
  return notes;
}

export function normalizeMcqAnswer(
  submittedCode: string,
  mcqOptions: unknown,
): string {
  const selected = submittedCode.trim();
  if (!selected) return '';
  const options: McqOption[] = parseMcqOptions(mcqOptions);
  if (!options.some((o) => o.id === selected)) {
    throw new BadRequestException('Invalid multiple-choice option');
  }
  if (selected.length > 16) {
    throw new BadRequestException('Invalid multiple-choice option');
  }
  return selected;
}

export function normalizeSubmittedAnswer(
  questionType: QuestionType,
  submittedCode: string,
  mcqOptions: unknown,
): string {
  if (questionType === QuestionType.MCQ) {
    return normalizeMcqAnswer(submittedCode, mcqOptions);
  }
  return assertCodeAnswerLength(submittedCode);
}
