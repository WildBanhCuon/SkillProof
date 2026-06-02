/** Maps assessment `question.language` values to Monaco Editor language ids. */
const MONACO_LANGUAGE_MAP: Record<string, string> = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  css: 'css',
  php: 'php',
  java: 'java',
  csharp: 'csharp',
  'c#': 'csharp',
  cpp: 'cpp',
  'c++': 'cpp',
  go: 'go',
  rust: 'rust',
  sql: 'sql',
  html: 'html',
  json: 'json',
  xml: 'xml',
  yaml: 'yaml',
  markdown: 'markdown',
  shell: 'shell',
  bash: 'shell',
};

export function monacoLanguage(language?: string | null): string {
  if (!language?.trim()) return 'javascript';
  const key = language.trim().toLowerCase();
  return MONACO_LANGUAGE_MAP[key] ?? 'plaintext';
}
