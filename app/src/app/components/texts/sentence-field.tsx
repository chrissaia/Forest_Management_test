"use client";

/*
 * A title that reads as emphasized text and edits as a text field.
 * Enter or blur writes through onText. Escape restores the saved text.
 */

import { useRef, useState } from "react";
import { textFieldChange, type TextFieldChange } from "@/app/components/texts/text-field-change";

const titleClassName =
  "template-body-medium-emphasized w-fit min-w-full max-w-full cursor-text truncate rounded-[4px] px-2 py-1 text-left whitespace-nowrap text-text-primary";

const editingClassName =
  "template-body-medium-emphasized w-fit min-w-full max-w-full rounded-[4px] border-0 bg-surface-canvas px-2 py-1 text-text-primary outline-1 outline-text-primary";

// The saved title. The parent stores it through onText.
export function SentenceField({
  value,
  onText,
  ariaLabel = "Name",
  autoEdit = false,
  onEditFocus,
}: {
  value: string;
  onText: (change: TextFieldChange) => void;
  ariaLabel?: string;
  autoEdit?: boolean;
  onEditFocus?: () => void;
}) {
  const [editing, setEditing] = useState(autoEdit);
  const [draft, setDraft] = useState(value);
  const canceling = useRef(false);

  function startEdit() {
    if (editing) return;
    canceling.current = false;
    setDraft(value);
    setEditing(true);
  }

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

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.blur();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      canceling.current = true;
      event.currentTarget.blur();
    }
  }

  if (editing) {
    return (
      <input
        aria-label={ariaLabel}
        autoFocus
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onFocus={(event) => {
          event.currentTarget.select();
          onEditFocus?.();
        }}
        onBlur={commit}
        onKeyDown={onKeyDown}
        onClick={(event) => event.stopPropagation()}
        className={editingClassName}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={startEdit}
      className={`${titleClassName} hover:bg-surface-translucent-placeholder-2`}
    >
      {value}
    </button>
  );
}
