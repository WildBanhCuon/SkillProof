export const HR_LAST_RESULTS_JOB_KEY = 'hr:lastResultsJobId';

export function rememberLastResultsJob(jobId: string) {
  sessionStorage.setItem(HR_LAST_RESULTS_JOB_KEY, jobId);
}

export function getLastResultsJobId(): string | null {
  return sessionStorage.getItem(HR_LAST_RESULTS_JOB_KEY);
}

/** Jobs list, new posting, or job editor — not results / candidate detail. */
export function isHrJobsNavActive(pathname: string): boolean {
  if (pathname === '/hr/jobs' || pathname === '/hr/jobs/new') return true;
  return /^\/hr\/jobs\/[^/]+$/.test(pathname);
}

/** All candidates overview, per-job results, or candidate detail. */
export function isHrCandidatesNavActive(pathname: string): boolean {
  if (pathname === '/hr/candidates' || pathname.startsWith('/hr/candidates/')) {
    return true;
  }
  return /^\/hr\/jobs\/[^/]+\/(results|candidates\/)/.test(pathname);
}

export function candidatesNavPath(_pathname: string): string {
  return '/hr/candidates';
}
