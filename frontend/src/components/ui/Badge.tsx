type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'published';

const styles: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 dark:bg-slate-800 dark:text-slate-300',
  success:
    'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300',
  warning:
    'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 dark:bg-amber-950/60 dark:text-amber-300',
  danger: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 dark:bg-red-950/60 dark:text-red-300',
  info: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
  published:
    'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300',
};

export function Badge({
  variant = 'default',
  children,
  className = '',
}: {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
