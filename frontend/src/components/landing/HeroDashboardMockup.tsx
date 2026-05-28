import { AlertTriangle } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

const DIMENSIONS = [
  { label: 'Technical', pct: 92 },
  { label: 'Problem solving', pct: 88 },
  { label: 'Code quality', pct: 90 },
  { label: 'Communication', pct: 85 },
];

export function HeroDashboardMockup() {
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-12 -left-8 h-48 w-48 rounded-full bg-indigo-300/15 blur-3xl"
        aria-hidden
      />

      <Card className="relative rotate-[-0.5deg] overflow-hidden shadow-xl dark:shadow-indigo-950/20">
        <div className="border-b border-slate-200 bg-white px-4 py-2 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-slate-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-slate-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-slate-700" />
            <span className="ml-2 truncate text-[10px] text-slate-400 dark:text-slate-500">
              app.skillproof.io/jobs/junior-frontend
            </span>
          </div>
        </div>
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/80">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Junior Frontend Developer
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Acme Corp · Paris</p>
            </div>
            <Badge variant="published">Published</Badge>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              ['248', 'Applications'],
              ['142', 'Tests completed'],
              ['18', 'Top performers'],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-md border border-slate-200 bg-white px-2 py-2 dark:border-slate-700 dark:bg-slate-900"
              >
                <p className="text-lg font-bold leading-none text-slate-900 dark:text-slate-100">
                  {value}
                </p>
                <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 p-4">
          <div className="rounded-lg border-2 border-indigo-200 bg-white p-4 dark:border-indigo-700 dark:bg-slate-900">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                YB
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      #1 Yasmine B.
                    </span>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      React · TypeScript · 3 yrs equiv.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold leading-none text-slate-900 dark:text-slate-100">
                      92
                    </span>
                    <span className="text-lg font-semibold text-slate-400">/100</span>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-end">
                  <Badge variant="success">Ready now</Badge>
                </div>
                <div className="mt-3 space-y-2">
                  {DIMENSIONS.map((d) => (
                    <div key={d.label}>
                      <div className="mb-1 flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                        <span>{d.label}</span>
                        <span>{d.pct}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-indigo-600"
                          style={{ width: `${d.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-3 rounded-md border border-indigo-100 bg-slate-50 px-3 py-2 text-xs italic text-slate-600 dark:border-indigo-900/60 dark:bg-slate-800 dark:text-slate-300">
                  “Strong React fundamentals; ready for interview.”
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3 opacity-75 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">LM</span>
              <div className="min-w-0">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  #2 Lucas M.
                </span>
                <p className="text-xs text-slate-400">React · Tailwind</p>
              </div>
              <span className="ml-auto text-xl font-bold text-slate-700 dark:text-slate-300">78<span className="text-sm text-slate-400">/100</span></span>
              <Badge variant="warning">Trainable</Badge>
            </div>
          </div>
        </div>
      </Card>

      <div className="absolute right-0 -top-14 z-10 max-w-[240px] rounded-lg border border-amber-200 bg-white p-3 shadow-lg dark:border-amber-800/50 dark:bg-slate-900 sm:-right-8 sm:-top-16">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
          Job Ad Upgrade
        </p>
        <div className="mt-1 flex gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600" />
          <p className="text-xs text-slate-600 dark:text-slate-300">
            3+ years required on junior title
          </p>
        </div>
      </div>
    </div>
  );
}
