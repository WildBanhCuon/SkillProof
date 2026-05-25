export function bandVariant(
  band: string,
): 'success' | 'warning' | 'danger' | 'default' {
  const b = band.toLowerCase().replace(/\s/g, '_');
  if (b.includes('ready')) return 'success';
  if (b.includes('trainable')) return 'warning';
  if (b.includes('risk')) return 'danger';
  return 'default';
}

export function bandLabel(band: string): string {
  const b = band.toLowerCase();
  if (b.includes('ready')) return 'Ready now';
  if (b.includes('trainable')) return 'Trainable';
  if (b.includes('risk')) return 'At risk';
  return band;
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    DRAFT: 'Draft',
    ANALYZED: 'Analyzed',
    PUBLISHED: 'Published',
    CLOSED: 'Archived',
  };
  return map[status] ?? status;
}

export function statusVariant(
  status: string,
): 'default' | 'success' | 'info' | 'warning' {
  if (status === 'PUBLISHED') return 'success';
  if (status === 'ANALYZED') return 'info';
  if (status === 'CLOSED') return 'default';
  return 'default';
}

export function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export type CandidateApplicationStatus =
  | 'in_progress'
  | 'expired'
  | 'under_review'
  | 'shortlisted'
  | 'not_selected'
  | 'practice_in_progress'
  | 'practice_complete';

export function applicationStatusLabel(status: string): string {
  const map: Record<string, string> = {
    in_progress: 'In progress',
    expired: 'Expired',
    under_review: 'Under review',
    shortlisted: 'Shortlisted',
    not_selected: 'Not selected',
    practice_in_progress: 'Practice in progress',
    practice_complete: 'Practice complete',
  };
  return map[status] ?? status;
}

export function applicationStatusVariant(
  status: string,
): 'default' | 'success' | 'info' | 'warning' | 'danger' {
  if (status === 'shortlisted') return 'success';
  if (status === 'not_selected') return 'danger';
  if (status === 'under_review') return 'warning';
  if (status === 'in_progress' || status === 'practice_in_progress') return 'info';
  if (status === 'practice_complete') return 'default';
  if (status === 'expired') return 'danger';
  return 'default';
}
