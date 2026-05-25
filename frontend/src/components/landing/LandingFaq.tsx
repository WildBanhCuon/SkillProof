import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'Is this only for frontend developers?',
    a: 'No. Demos often use Junior Frontend Developer, but SkillProof adapts listings, skills, and tests to any junior tech role — WordPress, backend, and more.',
  },
  {
    q: 'Does AI decide who gets hired?',
    a: 'No. AI analyzes ads, generates tests, and grades against rubrics. HR makes every hire and pass decision.',
  },
  {
    q: 'How is this different from Codility or ATS keyword filters?',
    a: 'SkillProof connects job ad improvement, ad-linked assessment, and an evidence shortlist in one flow — built for juniors where CVs fail.',
  },
  {
    q: 'What do rejected candidates get?',
    a: 'Personalized, structured feedback tied to rubric criteria — not a generic rejection email.',
  },
  {
    q: 'Do you predict who will be a good hire?',
    a: 'We do not use black-box fit scores. Rankings come from explicit rubrics HR can inspect and adjust.',
  },
];

export function LandingFaq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="mx-auto max-w-2xl divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-900">
      {FAQ_ITEMS.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              onClick={() => setOpenIndex(open ? -1 : i)}
              aria-expanded={open}
            >
              <span className="font-medium text-slate-900 dark:text-slate-100">{item.q}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
              />
            </button>
            {open && (
              <p className="border-t border-slate-100 px-5 pb-4 pt-0 text-sm leading-relaxed text-slate-600 dark:border-slate-800 dark:text-slate-300">
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
