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
    CLOSED: 'Closed',
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
