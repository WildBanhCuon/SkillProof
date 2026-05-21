import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function MarkdownContent({
  content,
  className = '',
}: {
  content: string;
  className?: string;
}) {
  if (!content.trim()) {
    return <p className="text-sm text-slate-500">No description provided.</p>;
  }

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}

/** Plain-text excerpt for cards (no raw markdown symbols). */
export function markdownExcerpt(content: string, maxLength = 160): string {
  const plain = content
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/\n+/g, ' ')
    .trim();
  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength).trim()}…`;
}
