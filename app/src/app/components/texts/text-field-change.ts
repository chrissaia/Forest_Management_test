/*
 * The write contract for a reusable text field.
 * The field reads its saved text from props and reports one of these changes.
 */

export type TextFieldChange =
  | { action: "create"; text: string }
  | { action: "update"; text: string }
  | { action: "delete" };

// Picks create, update, or delete. An unchanged value writes nothing.
export function textFieldChange(saved: string, draft: string): TextFieldChange | null {
  const previous = saved.trim();
  const next = draft.trim();
  if (next === previous) return null;
  if (next === "") return { action: "delete" };
  if (previous === "") return { action: "create", text: next };
  return { action: "update", text: next };
}
