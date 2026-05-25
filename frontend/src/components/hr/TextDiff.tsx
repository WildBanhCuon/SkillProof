import { diffLines } from 'diff';

function DiffChunk({
  part,
  index,
}: {
  part: { added?: boolean; removed?: boolean; value: string };
  index: number;
}) {
  const lines = part.value.split('\n');
  const prefix = part.added ? '+' : part.removed ? '−' : ' ';
  const lineClass = part.added
    ? 'bg-emerald-100 text-emerald-950'
    : part.removed
      ? 'bg-red-100 text-red-950'
      : 'text-slate-700 dark:text-slate-300';

  return (
    <span key={index}>
      {lines.map((line, lineIndex) => {
        const isLastEmpty = lineIndex === lines.length - 1 && line === '';
        if (isLastEmpty) return null;
        return (
          <span key={lineIndex} className={`block ${lineClass}`}>
            <span
              className={`inline-block w-6 select-none text-center font-bold ${
                part.added
                  ? 'text-emerald-700 dark:text-emerald-300'
                  : part.removed
                    ? 'text-red-700 dark:text-red-300'
                    : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              {prefix}
            </span>
            {line || ' '}
          </span>
        );
      })}
    </span>
  );
}

export function TextDiff({
  before,
  after,
  className = '',
}: {
  before: string;
  after: string;
  className?: string;
}) {
  const changes = diffLines(before, after);

  if (before === after) {
    return (
      <p className={`text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 ${className}`}>
        No textual changes detected.
      </p>
    );
  }

  return (
    <div className={className}>
      <div className="mb-2 flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-300">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-emerald-200 dark:border-emerald-800 bg-emerald-100" />
          Added
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-red-200 bg-red-100" />
          Removed
        </span>
      </div>
      <div
        className="max-h-96 overflow-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-sm leading-6"
        aria-label="Description changes"
      >
        {changes.map((part, index) => (
          <DiffChunk key={index} part={part} index={index} />
        ))}
      </div>
    </div>
  );
}
