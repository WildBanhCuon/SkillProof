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

/** Results dashboard or candidate detail for a job. */
export function isHrCandidatesNavActive(pathname: string): boolean {
  return /^\/hr\/jobs\/[^/]+\/(results|candidates\/)/.test(pathname);
}

export function candidatesNavPath(pathname: string): string {
  const fromUrl = pathname.match(
    /^\/hr\/jobs\/([^/]+)\/(results|candidates)/,
  )?.[1];
  const jobId = fromUrl ?? getLastResultsJobId();
  return jobId ? `/hr/jobs/${jobId}/results` : '/hr/jobs';
}
