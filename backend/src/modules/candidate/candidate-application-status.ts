import {
  ApplicationHrStatus,
  Recommendation,
  SessionStatus,
  SessionType,
} from '@prisma/client';

/** Candidate-facing status for applications and practice tests. */
export type CandidateApplicationStatus =
  | 'in_progress'
  | 'expired'
  | 'under_review'
  | 'interview_invited'
  | 'declined'
  | 'practice_in_progress'
  | 'practice_complete';

export function deriveCandidateApplicationStatus(
  sessionType: SessionType,
  sessionStatus: SessionStatus,
  hrStatus?: ApplicationHrStatus | null,
  _recommendation?: Recommendation | null,
): CandidateApplicationStatus {
  if (sessionType === SessionType.PRACTICE) {
    if (sessionStatus === SessionStatus.IN_PROGRESS) {
      return 'practice_in_progress';
    }
    if (sessionStatus === SessionStatus.GRADED) {
      return 'practice_complete';
    }
    if (sessionStatus === SessionStatus.EXPIRED) {
      return 'expired';
    }
    return 'under_review';
  }

  if (hrStatus === ApplicationHrStatus.INTERVIEW) {
    return 'interview_invited';
  }
  if (hrStatus === ApplicationHrStatus.DECLINED) {
    return 'declined';
  }

  switch (sessionStatus) {
    case SessionStatus.IN_PROGRESS:
      return 'in_progress';
    case SessionStatus.EXPIRED:
      return 'expired';
    case SessionStatus.SUBMITTED:
    case SessionStatus.GRADING:
    case SessionStatus.GRADED:
      return 'under_review';
    default:
      return 'under_review';
  }
}

export function hrStatusToApi(status: ApplicationHrStatus): string {
  return status.toLowerCase();
}
