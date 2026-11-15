"use client";

/*
 * Details for the selected action.
 * The sidebar frame keeps this unmounted until an action selection exists.
 */

import { ParagraphField } from "@/app/components/texts/paragraph-field";
import { SentenceField } from "@/app/components/texts/sentence-field";
import type { TextFieldChange } from "@/app/components/texts/text-field-change";
import { useMap } from "../../map-context";

// Name and description for the selected action.
export function ActionDetails() {
  const { actions, selectedAction, setSelectedAction, renameAction, describeAction } = useMap();
  if (selectedAction === null) return null;

  const action = actions.find((item) => item.id === selectedAction);
  if (!action) return null;

  return (
    <div className="flex w-full shrink-0 flex-col border-b border-surface-translucent-placeholder p-2">
      <div className="flex w-full items-center gap-1">
        <div className="min-w-0 flex-1">
          <SentenceField
            key={selectedAction}
            value={action.name}
            ariaLabel="Action name"
            onText={(change) => saveName(action.id, action.name, change, renameAction)}
          />
        </div>
        <button
          type="button"
          aria-label="Close action"
          onClick={() => setSelectedAction(null)}
          className="ml-auto flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-[4px] text-text-primary transition-colors duration-200 ease-in-out hover:bg-surface-translucent-placeholder-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
        >
          <span
            aria-hidden="true"
            className="flex size-3.5 -translate-y-[2.56px] items-center justify-center overflow-hidden text-[24px] leading-none font-extralight tracking-normal"
          >
            ×
          </span>
        </button>
      </div>
      <ParagraphField
        key={selectedAction}
        value={action.description}
        onText={(change) => saveDescription(action.id, change, describeAction)}
      />
    </div>
  );
}

// A blank name stays as it is. Delete does not clear an action name.
function saveName(
  id: number,
  name: string,
  change: TextFieldChange,
  renameAction: (id: number, name: string) => void,
) {
  if (change.action === "delete") return;
  if (change.text.toLowerCase() === name.toLowerCase()) return;
  renameAction(id, change.text);
}

// An empty description is stored as an empty string.
function saveDescription(
  id: number,
  change: TextFieldChange,
  describeAction: (id: number, description: string) => void,
) {
  describeAction(id, change.action === "delete" ? "" : change.text);
}
