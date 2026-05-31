/** Keep in sync with backend/src/common/assessment-answer-limits.ts */
export const MAX_CODE_ANSWER_LENGTH = 12_000;

export function clampCodeAnswer(value: string): string {
  return value.slice(0, MAX_CODE_ANSWER_LENGTH);
}

export function isNearCodeAnswerLimit(value: string): boolean {
  return value.length >= MAX_CODE_ANSWER_LENGTH * 0.9;
}
