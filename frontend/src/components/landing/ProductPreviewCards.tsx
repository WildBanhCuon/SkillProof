import type { ReactNode } from 'react';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export function ProductPreviewCards() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <PreviewCard
        title="Create & check listing"
        caption="Paste your ad — AI flags unrealistic requirements and builds a skill matrix."
      >
        <div className="space-y-2 p-3">
          <div className="h-2 w-full rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-2 w-4/5 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-2 rounded border border-amber-200 bg-amber-50 p-2 dark:border-amber-800/50 dark:bg-amber-950/30">
            <p className="text-[10px] font-medium text-amber-800 dark:text-amber-200">
              Requirement may be too senior
            </p>
          </div>
          <div className="rounded border border-blue-200 bg-blue-50 p-2 dark:border-blue-800/50 dark:bg-blue-950/30">
            <p className="text-[10px] font-medium text-blue-800 dark:text-blue-200">
              Vague responsibilities
            </p>
          </div>
          <div className="mt-1 grid grid-cols-3 gap-1 text-[9px] text-slate-500">
            <span className="font-semibold">React</span>
            <span>TS</span>
            <span>Git</span>
          </div>
        </div>
      </PreviewCard>

      <PreviewCard
        title="Role assessment"
        caption="30–45 min test generated from the job — code, logic, and communication."
      >
        <div className="bg-slate-900 p-3 text-slate-300">
          <div className="mb-2 flex justify-between text-[10px]">
            <span>Question 2 of 4</span>
            <span className="text-amber-400">01:24:37</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-slate-700">
            <div className="h-full w-1/2 bg-indigo-500" />
          </div>
          <pre className="mt-3 overflow-hidden text-[9px] leading-relaxed text-slate-400">
            {`function App() {\n  const [users, setUsers] = useState([]);\n  // fetch & render list\n}`}
          </pre>
        </div>
      </PreviewCard>

      <PreviewCard
        title="Ranked results"
        caption="Shortlist by verified score — strengths, risks, and interview prompts."
      >
        <div className="space-y-2 p-3">
          {[
            { name: 'Yasmine B.', score: 92, band: 'success' as const, label: 'Ready now' },
            { name: 'Lucas M.', score: 78, band: 'warning' as const, label: 'Trainable' },
            { name: 'Emma T.', score: 61, band: 'danger' as const, label: 'At risk' },
          ].map((c, i) => (
            <div
              key={c.name}
              className={`flex items-center justify-between rounded border px-2 py-1.5 text-[10px] ${
                i === 0
                  ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-800/50 dark:bg-emerald-950/20'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <span className="font-medium text-slate-800 dark:text-slate-200">
                #{i + 1} {c.name}
              </span>
              <div className="flex items-center gap-1">
                <Badge variant={c.band}>{c.label}</Badge>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {c.score}
                </span>
              </div>
            </div>
          ))}
        </div>
      </PreviewCard>
    </div>
  );
}

function PreviewCard({
  title,
  caption,
  children,
}: {
  title: string;
  caption: string;
  children: ReactNode;
}) {
  return (
    <div>
      <Card className="overflow-hidden">{children}</Card>
      <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{caption}</p>
    </div>
  );
}
