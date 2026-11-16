"use client";

/*
 * A description that grows with its text.
 * A click opens the field. Enter closes it. Shift+Enter adds a line.
 * Text edits directly on the canvas without input chrome.
 * Hover shows the copy button while the field is idle and has text.
 */

import { useEffect, useRef, useState } from "react";
import { textFieldChange, type TextFieldChange } from "@/app/components/texts/text-field-change";

const fieldClassName =
  "template-body-medium box-border block w-full resize-none overflow-hidden border-0 bg-transparent shadow-none px-2 py-2 text-left leading-5 text-text-primary outline-none placeholder:text-text-secondary field-sizing-content";

// The saved description. The parent stores it through onText.
export function ParagraphField({
  value,
  onText,
  placeholder = "Add a description",
  ariaLabel = "Description",
  copyLabel = "Copy description to clipboard",
  copiedMessage = "Copied description to clipboard",
}: {
  value: string;
  onText: (change: TextFieldChange) => void;
  placeholder?: string;
  ariaLabel?: string;
  copyLabel?: string;
  copiedMessage?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const canceling = useRef(false);
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2500);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    if (!editing) return;
    field.focus();
    const end = field.value.length;
    field.setSelectionRange(end, end);
  }, [editing]);

  function commit() {
    if (!editing) return;
    if (canceling.current) {
      canceling.current = false;
      setDraft(value);
      setEditing(false);
      return;
    }
    const change = textFieldChange(value, draft);
    setEditing(false);
    if (change) onText(change);
  }

  async function copy(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    const text = fieldRef.current?.value ?? value;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    setCopied(true);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!editing) return;
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.blur();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      canceling.current = true;
      event.currentTarget.blur();
    }
  }

  return (
    <div className="group relative">
      <textarea
        ref={fieldRef}
        aria-label={ariaLabel}
        readOnly={!editing}
        rows={1}
        value={editing ? draft : value}
        placeholder={placeholder}
        onClick={() => {
          if (editing) return;
          canceling.current = false;
          setDraft(value);
          setEditing(true);
        }}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={onKeyDown}
        className={`${fieldClassName} cursor-text`}
      />
      {editing || value.trim() === "" ? null : (
        <div className="pointer-events-none absolute top-1 right-1 z-2 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100 has-[:focus-visible]:pointer-events-auto has-[:focus-visible]:opacity-100">
          <button
            type="button"
            aria-label={copyLabel}
            onMouseDown={(event) => event.preventDefault()}
            onClick={copy}
            className="group/copy relative flex size-6 cursor-pointer items-center justify-center rounded-[4px] bg-surface-canvas text-text-secondary shadow-[0_1px_2px_rgb(0_0_0/0.16),0_2px_6px_rgb(0_0_0/0.08)] transition-colors duration-200 ease-in-out hover:[background-image:linear-gradient(var(--surface-translucent-placeholder-2),var(--surface-translucent-placeholder-2))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5">
              <path
                fill="currentColor"
                d="M3.25 1.375c-1.036 0-1.875.84-1.875 1.875v6c0 1.036.84 1.875 1.875 1.875h1.625v1.625c0 1.036.84 1.875 1.875 1.875h6c1.036 0 1.875-.84 1.875-1.875v-6c0-1.036-.84-1.875-1.875-1.875h-1.625V3.25c0-1.036-.84-1.875-1.875-1.875zM2.625 3.25c0-.345.28-.625.625-.625h6c.345 0 .625.28.625.625v1.625H6.75c-1.036 0-1.875.84-1.875 1.875v3.125H3.25a.625.625 0 0 1-.625-.625zm3.5 3.5c0-.345.28-.625.625-.625h6c.345 0 .625.28.625.625v6c0 .345-.28.625-.625.625h-6a.625.625 0 0 1-.625-.625z"
              />
            </svg>
            <span className="template-label-small pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded-[6px] bg-text-primary px-1.5 py-0.5 whitespace-nowrap text-surface-canvas opacity-0 group-hover/copy:opacity-100 group-focus-visible/copy:opacity-100">
              Copy
            </span>
          </button>
        </div>
      )}
      {copied ? (
        <p
          role="status"
          className="template-body-small fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-[6px] bg-text-primary px-3 py-2 text-surface-canvas"
        >
          {copiedMessage}
        </p>
      ) : null}
    </div>
  );
}
