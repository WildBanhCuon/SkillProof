import { HTMLAttributes } from 'react';

export function Card({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:shadow-none ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
