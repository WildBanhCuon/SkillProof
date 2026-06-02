import { ApplicationHrStatus } from '@prisma/client';

export function isHrDecisionStatus(
  status: ApplicationHrStatus | null | undefined,
): boolean {
  return (
    status === ApplicationHrStatus.INTERVIEW ||
    status === ApplicationHrStatus.DECLINED
  );
}

export function isUnreadHrDecision(app: {
  hrStatus: ApplicationHrStatus;
  hrDecidedAt: Date | null;
  hrDecisionSeenAt: Date | null;
}): boolean {
  if (!app.hrDecidedAt || !isHrDecisionStatus(app.hrStatus)) {
    return false;
  }
  if (!app.hrDecisionSeenAt) return true;
  return app.hrDecisionSeenAt < app.hrDecidedAt;
}

export function notificationMessage(
  hrStatus: ApplicationHrStatus,
  jobTitle: string,
  companyName: string,
): string {
  if (hrStatus === ApplicationHrStatus.INTERVIEW) {
    return `${companyName} invited you to interview for ${jobTitle}.`;
  }
  return `${companyName} updated your application for ${jobTitle}.`;
}
