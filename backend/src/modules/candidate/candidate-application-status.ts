import { Recommendation, SessionStatus, SessionType } from '@prisma/client';

/** Candidate-facing status for applications and practice tests. */
export type CandidateApplicationStatus =
  | 'in_progress'
  | 'expired'
  | 'under_review'
  | 'shortlisted'
  | 'not_selected'
  | 'practice_in_progress'
  | 'practice_complete';

export function deriveCandidateApplicationStatus(
  sessionType: SessionType,
  sessionStatus: SessionStatus,
  recommendation?: Recommendation | null,
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

  switch (sessionStatus) {
    case SessionStatus.IN_PROGRESS:
      return 'in_progress';
    case SessionStatus.EXPIRED:
      return 'expired';
    case SessionStatus.SUBMITTED:
    case SessionStatus.GRADING:
      return 'under_review';
    case SessionStatus.GRADED:
      if (recommendation === Recommendation.READY_NOW) {
        return 'shortlisted';
      }
      if (recommendation === Recommendation.AT_RISK) {
        return 'not_selected';
      }
      return 'under_review';
    default:
      return 'under_review';
  }
}
