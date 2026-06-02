export function Alert({
  variant = 'error',
  children,
  onDismiss,
}: {
  variant?: 'error' | 'success' | 'info';
  children: React.ReactNode;
  onDismiss?: () => void;
}) {
  const styles = {
    error:
      'border-red-200 bg-red-50 dark:bg-red-950/40 text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200',
    success:
      'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200',
    info:
      'border-blue-200 bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-200',
  };
  return (
    <div
      className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${styles[variant]}`}
    >
      <div>{children}</div>
      {onDismiss && (
        <button type="button" onClick={onDismiss} className="opacity-60 hover:opacity-100">
          ×
        </button>
      )}
    </div>
  );
}
