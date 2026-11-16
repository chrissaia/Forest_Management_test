"use client";

/*
 * The actions list and the link-mode feature list.
 * The list lives in the right sidebar. Link mode uses the left sidebar.
 */

import { useEffect } from "react";
import { mapPanel, useMap } from "../../map-context";
import { editedLabel } from "./action-edited";
import { FeatureListRow } from "./feature-list-row";

// Every action. A row opens that action's details.
export function ActionList() {
  const { actions, hoverAction, setHoverAction, setSelectedAction } = useMap();

  useEffect(() => {
    return () => setHoverAction(null);
  }, [setHoverAction]);

  return (
    <>
      <div className="flex shrink-0 items-center border-b border-surface-translucent-placeholder px-4 py-4">
        <p className="template-body-medium-emphasized whitespace-nowrap text-text-primary">
          {mapPanel.actions}
        </p>
        <button
          type="button"
          aria-label="Add action"
          className="ml-auto flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-[4px] text-text-primary transition-colors duration-200 ease-in-out hover:bg-surface-translucent-placeholder-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
        >
          <img src="/icons/map/add-outline.svg" alt="" width={18} height={18} className="shrink-0" />
        </button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto bg-transparent py-2">
        {actions.map((action) => {
          const hovered = hoverAction === action.id;
          return (
            <div
              key={action.id}
              role="button"
              tabIndex={0}
              onMouseEnter={() => setHoverAction(action.id)}
              onMouseLeave={() => setHoverAction(null)}
              onClick={() => setSelectedAction(action.id)}
              onKeyDown={(event) => {
                if (event.target !== event.currentTarget) return;
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                setSelectedAction(action.id);
              }}
              className={`flex w-full cursor-pointer flex-col items-start px-4 py-1 text-left transition-colors duration-200 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary hover:bg-surface-translucent-placeholder-2 ${hovered ? "bg-surface-translucent-placeholder-2" : ""}`}
            >
              <p className="template-body-medium line-clamp-2 w-full text-text-primary">
                {action.name}
              </p>
              <p
                suppressHydrationWarning
                className="template-body-small flex items-center gap-1 text-text-secondary"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="size-3 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                  <path d="m15 5 4 4" />
                </svg>
                <span className="sr-only">edited </span>
                {editedLabel(new Date(action.editedAt), new Date())}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}

// Feature rows for link mode. Hidden while the action list is on the right.
export function ActionCommand() {
  const {
    linking,
    features,
    linkedFeatureIds,
    toggleLinkedFeature,
    hoverFeature,
    setHoverFeature,
  } = useMap();
  const linked = new Set(linkedFeatureIds);

  useEffect(() => {
    if (linking) return;
    setHoverFeature(null);
  }, [linking, setHoverFeature]);

  if (!linking) return null;

  return (
    <>
      <div className="flex shrink-0 items-center justify-between px-2">
        <p className="template-body-large py-1 text-text-primary">{mapPanel.features}</p>
        <button
          type="button"
          aria-label="Search features"
          className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-[4px] transition-colors duration-200 ease-in-out hover:bg-surface-translucent-placeholder-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
        >
          <img src="/icons/timeline-search.svg" alt="" className="shrink-0" />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto py-4">
        {features.map((feature) => {
          const id = String(feature.id);
          const name = typeof feature.properties.name === "string" ? feature.properties.name : id;
          return (
            <FeatureListRow
              key={id}
              id={id}
              name={name}
              features={features}
              pressed={linked.has(id)}
              hovered={hoverFeature === id}
              onPress={() => toggleLinkedFeature(id)}
              onHoverStart={() => setHoverFeature(id)}
              onHoverEnd={() => setHoverFeature(null)}
            />
          );
        })}
      </div>
    </>
  );
}
