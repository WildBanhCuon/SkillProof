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
    error: 'border-red-200 bg-red-50 text-red-800',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    info: 'border-blue-200 bg-blue-50 text-blue-800',
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
