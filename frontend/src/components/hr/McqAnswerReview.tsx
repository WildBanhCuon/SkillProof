import { CheckCircle2, Circle, XCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';

export type McqOption = { id: string; label: string };

export function McqAnswerReview({
  options,
  selectedOptionId,
  correctOptionId,
  isCorrect,
}: {
  options: McqOption[];
  selectedOptionId: string | null;
  correctOptionId: string | null;
  isCorrect: boolean | null;
}) {
  if (options.length === 0) {
    return (
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {selectedOptionId
          ? `Selected option: ${selectedOptionId}`
          : 'No answer selected'}
        {correctOptionId && ` · Correct: ${correctOptionId}`}
      </p>
    );
  }

  return (
    <div className="mt-3 space-y-2">
      {isCorrect != null && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant={isCorrect ? 'success' : 'danger'}>
            {isCorrect ? 'Correct' : 'Incorrect'}
          </Badge>
          {!selectedOptionId && (
            <span className="text-sm text-slate-500 dark:text-slate-400">
              No option selected
            </span>
          )}
        </div>
      )}
      <ul className="space-y-2" role="list">
        {options.map((opt) => {
          const selected = opt.id === selectedOptionId;
          const correct = opt.id === correctOptionId;
          const wrongSelection = selected && isCorrect === false;

          let border =
            'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900';
          if (correct) {
            border =
              'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30';
          }
          if (wrongSelection) {
            border =
              'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30';
          } else if (selected && isCorrect !== false) {
            border =
              'border-indigo-300 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950/30';
          }

          return (
            <li
              key={opt.id}
              className={`flex items-start gap-3 rounded-lg border px-4 py-3 ${border}`}
            >
              <span className="mt-0.5 shrink-0 text-slate-400 dark:text-slate-500">
                {correct ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                ) : wrongSelection ? (
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                ) : selected ? (
                  <Circle className="h-5 w-5 fill-indigo-600 text-indigo-600 dark:fill-indigo-400 dark:text-indigo-400" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium uppercase text-slate-500 dark:text-slate-400">
                    {opt.id}.
                  </span>
                  {selected && (
                    <Badge variant={isCorrect === false ? 'danger' : 'info'}>
                      Candidate choice
                    </Badge>
                  )}
                  {correct && (
                    <Badge variant="success">Correct answer</Badge>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-800 dark:text-slate-200">
                  {opt.label}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
