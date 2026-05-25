import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src');

const replacements = [
  ['bg-slate-50', 'bg-slate-50 dark:bg-slate-950'],
  ['bg-white', 'bg-white dark:bg-slate-900'],
  ['border-slate-200', 'border-slate-200 dark:border-slate-700'],
  ['border-slate-100', 'border-slate-100 dark:border-slate-800'],
  ['border-slate-300', 'border-slate-300 dark:border-slate-600'],
  ['text-slate-900', 'text-slate-900 dark:text-slate-100'],
  ['text-slate-800', 'text-slate-800 dark:text-slate-200'],
  ['text-slate-700', 'text-slate-700 dark:text-slate-300'],
  ['text-slate-600', 'text-slate-600 dark:text-slate-300'],
  ['text-slate-500', 'text-slate-500 dark:text-slate-400'],
  ['text-slate-400', 'text-slate-400 dark:text-slate-500'],
  ['bg-slate-100', 'bg-slate-100 dark:bg-slate-800'],
  ['hover:bg-slate-50', 'hover:bg-slate-50 dark:hover:bg-slate-800'],
  ['hover:bg-slate-100', 'hover:bg-slate-100 dark:hover:bg-slate-800'],
  ['hover:text-slate-900', 'hover:text-slate-900 dark:hover:text-slate-100'],
  ['hover:border-slate-300', 'hover:border-slate-300 dark:hover:border-slate-600'],
  ['bg-indigo-50', 'bg-indigo-50 dark:bg-indigo-950/50'],
  ['bg-indigo-100', 'bg-indigo-100 dark:bg-indigo-900/60'],
  ['text-indigo-700', 'text-indigo-700 dark:text-indigo-300'],
  ['text-indigo-600', 'text-indigo-600 dark:text-indigo-400'],
  ['ring-indigo-600', 'ring-indigo-600 dark:ring-indigo-500'],
  ['border-indigo-100', 'border-indigo-100 dark:border-indigo-900'],
  ['border-indigo-200', 'border-indigo-200 dark:border-indigo-800'],
  ['bg-blue-50', 'bg-blue-50 dark:bg-blue-950/40'],
  ['text-blue-900', 'text-blue-900 dark:text-blue-200'],
  ['text-blue-800', 'text-blue-800 dark:text-blue-200'],
  ['bg-emerald-50', 'bg-emerald-50 dark:bg-emerald-950/40'],
  ['text-emerald-800', 'text-emerald-800 dark:text-emerald-200'],
  ['text-emerald-900', 'text-emerald-900 dark:text-emerald-200'],
  ['text-emerald-700', 'text-emerald-700 dark:text-emerald-300'],
  ['border-emerald-200', 'border-emerald-200 dark:border-emerald-800'],
  ['bg-amber-50', 'bg-amber-50 dark:bg-amber-950/40'],
  ['text-amber-900', 'text-amber-900 dark:text-amber-200'],
  ['text-amber-800', 'text-amber-800 dark:text-amber-200'],
  ['border-amber-100', 'border-amber-100 dark:border-amber-900'],
  ['bg-red-50', 'bg-red-50 dark:bg-red-950/40'],
  ['text-red-700', 'text-red-700 dark:text-red-300'],
  ['text-red-600', 'text-red-600 dark:text-red-400'],
  ['read-only:bg-slate-50', 'read-only:bg-slate-50 dark:read-only:bg-slate-800'],
  ['placeholder:text-slate-400', 'placeholder:text-slate-400 dark:placeholder:text-slate-500'],
];

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, files);
    else if (p.endsWith('.tsx')) files.push(p);
  }
  return files;
}

for (const file of walk(root)) {
  if (file.includes('ThemeContext') || file.includes('ThemeToggle')) continue;
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  for (const [from, to] of replacements) {
    if (content.includes(from) && !content.includes(to)) {
      content = content.split(from).join(to);
      changed = true;
    }
  }
  if (changed) fs.writeFileSync(file, content);
}

console.log('Dark mode classes applied.');
