import { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from 'tiptap-markdown';
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
} from 'lucide-react';

const PLACEHOLDER = `Start writing your job ad here.

Use the toolbar for headings, bold text, and bullet lists — no markdown knowledge needed.`;

function ToolbarButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`rounded-md p-2 transition-colors ${
        active
          ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 dark:text-slate-100'
      }`}
    >
      {children}
    </button>
  );
}

export function JobDescriptionEditor({
  value,
  onChange,
  editable = true,
}: {
  value: string;
  onChange: (markdown: string) => void;
  editable?: boolean;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Placeholder.configure({ placeholder: PLACEHOLDER }),
      Markdown.configure({
        html: false,
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
    content: value,
    editable,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.storage.markdown.getMarkdown());
    },
    editorProps: {
      attributes: {
        class:
          'prose-editor min-h-[280px] px-4 py-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300 focus:outline-none',
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.storage.markdown.getMarkdown();
    if (value !== current) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  useEffect(() => {
    if (editor) editor.setEditable(editable);
  }, [editor, editable]);

  if (!editor) return null;

  return (
    <div className="job-description-editor mt-3 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
      {editable && (
        <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2 py-1.5">
          <ToolbarButton
            label="Bold"
            active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Italic"
            active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <span className="mx-1 h-6 w-px bg-slate-200" aria-hidden />
          <ToolbarButton
            label="Section heading"
            active={editor.isActive('heading', { level: 2 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Subheading"
            active={editor.isActive('heading', { level: 3 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <Heading3 className="h-4 w-4" />
          </ToolbarButton>
          <span className="mx-1 h-6 w-px bg-slate-200" aria-hidden />
          <ToolbarButton
            label="Bullet list"
            active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Numbered list"
            active={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
