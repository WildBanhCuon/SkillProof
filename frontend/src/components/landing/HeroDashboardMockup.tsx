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
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/80">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Junior Frontend Developer
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Acme Corp</p>
            </div>
            <Badge variant="published">Published</Badge>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-400">
            <span>
              <strong className="text-slate-900 dark:text-slate-200">248</strong> applications
            </span>
            <span>
              <strong className="text-slate-900 dark:text-slate-200">142</strong> tests completed
            </span>
            <span>
              <strong className="text-slate-900 dark:text-slate-200">18</strong> top performers
            </span>
          </div>
        </div>

        <div className="space-y-3 p-4">
          <div className="rounded-lg border-2 border-emerald-200 bg-white p-4 dark:border-emerald-800/60 dark:bg-slate-900">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                #1
              </span>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                YB
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    Yasmine B.
                  </span>
                  <Badge variant="success">Ready now</Badge>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    92/100
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Paris · Computer science graduate
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {DIMENSIONS.map((d) => (
                    <div key={d.label}>
                      <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                        <span>{d.label}</span>
                        <span>{d.pct}%</span>
                      </div>
                      <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-indigo-600"
                          style={{ width: `${d.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                  Strong React fundamentals; ready for interview
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3 opacity-60 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">#2</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Lucas M.
              </span>
              <Badge variant="warning">Trainable</Badge>
              <span className="text-xs text-slate-500">78/100</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="absolute -right-2 -top-4 z-10 max-w-[200px] rounded-lg border border-amber-200 bg-white p-3 shadow-lg dark:border-amber-800/50 dark:bg-slate-900 sm:-right-6">
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
