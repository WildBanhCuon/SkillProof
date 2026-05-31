import { useCallback, useEffect, useRef } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { monacoLanguage } from '../../utils/monacoLanguage';
import {
  clampCodeAnswer,
  isAtCodeAnswerLimit,
  isNearCodeAnswerLimit,
  MAX_CODE_ANSWER_LENGTH,
} from '../../utils/assessmentLimits';

interface CodeAnswerEditorProps {
  questionId: string;
  language: string;
  value: string;
  onChange: (value: string) => void;
}

export function CodeAnswerEditor({
  questionId,
  language,
  value,
  onChange,
}: CodeAnswerEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const disposeListenerRef = useRef<(() => void) | null>(null);

  const clampedValue = clampCodeAnswer(value);

  const syncEditor = useCallback(
    (editor: editor.IStandaloneCodeEditor, text: string) => {
      const next = clampCodeAnswer(text);
      if (editor.getValue() !== next) {
        editor.setValue(next);
      }
      onChange(next);
    },
    [onChange],
  );

  const handleMount: OnMount = (editor) => {
    editorRef.current = editor;
    disposeListenerRef.current?.();

    const sub = editor.onDidChangeModelContent(() => {
      const current = editor.getValue();
      if (current.length > MAX_CODE_ANSWER_LENGTH) {
        syncEditor(editor, current);
      }
    });
    disposeListenerRef.current = () => sub.dispose();

    if (editor.getValue() !== clampedValue) {
      editor.setValue(clampedValue);
    }
  };

  useEffect(() => {
    return () => disposeListenerRef.current?.();
  }, [questionId]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if (editor.getValue() !== clampedValue) {
      editor.setValue(clampedValue);
    }
  }, [questionId, clampedValue]);

  const showCounter =
    isNearCodeAnswerLimit(clampedValue) || isAtCodeAnswerLimit(clampedValue);
  const atLimit = isAtCodeAnswerLimit(clampedValue);

  return (
    <div className="min-h-[320px]">
      <Editor
        key={`${questionId}-${monacoLanguage(language)}`}
        height="320px"
        language={monacoLanguage(language)}
        value={clampedValue}
        onChange={(v) => {
          const next = clampCodeAnswer(v ?? '');
          const ed = editorRef.current;
          if (ed && (v ?? '').length > MAX_CODE_ANSWER_LENGTH) {
            ed.setValue(next);
          }
          onChange(next);
        }}
        onMount={handleMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          wordWrap: 'on',
        }}
      />
      {showCounter && (
        <p
          className={`border-t border-slate-100 px-4 py-2 text-xs dark:border-slate-800 ${
            atLimit
              ? 'font-medium text-red-700 dark:text-red-300'
              : 'text-amber-700 dark:text-amber-300'
          }`}
        >
          {clampedValue.length.toLocaleString()} /{' '}
          {MAX_CODE_ANSWER_LENGTH.toLocaleString()} characters
          {atLimit ? ' — limit reached; delete text to add more' : ''}
        </p>
      )}
    </div>
  );
}
