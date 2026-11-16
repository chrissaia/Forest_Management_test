"use client";

/*
 * The actions list and the link-mode feature list.
 * The list lives in the right sidebar. Link mode uses the left sidebar.
 */

import { useEffect, useRef, useState } from "react";
import { mapPanel, useMap } from "../../map-context";
import { ActionDetails } from "./action-details";
import { editedLabel } from "./action-edited";
import { FeatureListRow } from "./feature-list-row";

const headerButtonClass =
  "flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-[4px] text-text-primary transition-colors duration-200 ease-in-out hover:bg-surface-translucent-placeholder-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary";

// Every action. A row opens that action's details.
export function ActionList({ featureId }: { featureId?: string } = {}) {
  const { actions, selectedAction, hoverAction, setHoverAction, setSelectedAction, createAction, setContextMenu, actionFeatureLinks, features, selectedFeature, actionFilterIds, setActionFilterIds } = useMap();

  const [actionQuery, setActionQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const automaticFilterId = featureId ?? selectedFeature;
  const manualFilterIds = actionFilterIds.filter((id) => features.some((feature) => String(feature.id) === id));
  const activeFilterIds = [...new Set([...manualFilterIds, ...(automaticFilterId === null ? [] : [automaticFilterId])])].filter((id) => features.some((feature) => String(feature.id) === id));
  const linkedActionIds = new Set(actionFeatureLinks.filter((link) => activeFilterIds.includes(link.featureId)).map((link) => link.actionId));
  const visibleActions = actions.filter((action) => (activeFilterIds.length === 0 || linkedActionIds.has(action.id)) && action.name.toLowerCase().includes(actionQuery.trim().toLowerCase()));
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    return () => setHoverAction(null);
  }, [setHoverAction]);

  useEffect(() => {
    if (!filterOpen) return;
    function dismiss(event: PointerEvent) {
      if (!filterRef.current?.contains(event.target as Node)) setFilterOpen(false);
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [filterOpen]);

  return (
    <>
      <div className={`flex shrink-0 items-center gap-2 ${featureId === undefined ? "border-b border-surface-translucent-placeholder px-4 py-4" : "px-2 py-1"}`}>
        {featureId === undefined ? <p className="template-body-medium-emphasized whitespace-nowrap text-text-primary">
          {mapPanel.actions}
        </p> : <div className="flex min-w-0 flex-1 items-center gap-1 rounded-[4px] bg-surface-canvas px-1 focus-within:outline-1 focus-within:outline-border-selected">
          <img src="/icons/map/search-outline.svg" alt="" width={20} height={20} />
          <input aria-label="Search stand actions" placeholder="Search actions…" value={actionQuery} onChange={(event) => setActionQuery(event.target.value)} className="template-body-small min-w-0 flex-1 border-0 bg-transparent py-1 text-text-primary outline-none placeholder:text-text-secondary" />
        </div>}
        {selectedAction !== null ? (
          <button type="button" aria-label="Close action" onClick={() => setSelectedAction(null)} className={`ml-auto ${headerButtonClass}`}>
            <img src="/icons/map/close-outline.svg" alt="" width={18} height={18} />
          </button>
        ) : (
          <>
        <div ref={filterRef} className="relative ml-auto" onKeyDown={(event) => { if (event.key === "Escape") { setFilterOpen(false); filterRef.current?.querySelector("button")?.focus(); } }}>
          <button type="button" aria-label={activeFilterIds.length ? `Filter actions (${activeFilterIds.length} active)` : "Filter actions"} aria-expanded={filterOpen} aria-haspopup="dialog" onClick={() => setFilterOpen(!filterOpen)} className={`relative ${headerButtonClass}`}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M7 12h10M10 18h4" /></svg>
            {activeFilterIds.length > 0 ? <span aria-hidden="true" className="absolute right-0.5 top-0.5 size-1.5 rounded-full bg-red-500" /> : null}
          </button>
          {filterOpen ? <div role="dialog" aria-label="Filter actions by feature" className="absolute right-0 top-full z-30 mt-1 w-56 max-w-[80vw] rounded-[8px] border border-border-map bg-surface-canvas p-2 shadow-lg">
            <div className="flex items-center justify-between px-2 py-1"><p className="template-body-small text-text-secondary">Features</p><button type="button" onClick={() => setActionFilterIds([])} className="template-body-small cursor-pointer text-text-secondary hover:text-text-primary">Clear</button></div>
            <div className="max-h-64 overflow-y-auto">{features.map((feature) => {
              const id = String(feature.id);
              const name = typeof feature.properties.name === "string" ? feature.properties.name : id;
              return <label key={id} className="template-body-small flex cursor-pointer items-center gap-2 rounded-[4px] px-2 py-1 hover:bg-surface-translucent-placeholder-2"><input type="checkbox" checked={manualFilterIds.includes(id)} onChange={(event) => setActionFilterIds(event.target.checked ? [...manualFilterIds, id] : manualFilterIds.filter((value) => value !== id))} className="size-3.5 shrink-0 appearance-none rounded-[2px] border border-text-secondary bg-surface-canvas checked:border-border-selected checked:bg-border-selected checked:bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2016%2016%22%3E%3Cpath%20d=%22m3.5%208%203%203%206-6%22%20fill=%22none%22%20stroke=%22white%22%20stroke-width=%222%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22/%3E%3C/svg%3E')] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-selected" /><span className="min-w-0 flex-1 truncate">{name}</span>{automaticFilterId === id ? <span className="shrink-0 rounded-[4px] bg-surface-selected px-1.5 py-0.5 text-border-selected">Selected</span> : null}</label>;
            })}</div>
          </div> : null}
        </div>
        <button
          type="button"
          aria-label="Add action"
          disabled={creating}
          onClick={async () => {
            setCreating(true);
            setCreateError(null);
            try { await createAction(featureId); }
            catch { setCreateError("Could not create action. Please try again."); }
            finally { setCreating(false); }
          }}
          className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-[4px] text-text-primary transition-colors duration-200 ease-in-out hover:bg-surface-translucent-placeholder-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
        >
          <img src="/icons/map/add-outline.svg" alt="" width={18} height={18} className="shrink-0" />
        </button>
          </>
        )}
      </div>
      {createError ? <p role="alert" className="template-body-small px-4 py-2 text-text-primary">{createError}</p> : null}
      {selectedAction !== null ? <div className="min-h-0 flex-1"><ActionDetails /></div> : <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto bg-transparent py-2">
        {visibleActions.map((action) => {
          const hovered = hoverAction === action.id;
          return (
            <div
              key={action.id}
              role="button"
              tabIndex={0}
              onMouseEnter={() => setHoverAction(action.id)}
              onMouseLeave={() => setHoverAction(null)}
              onContextMenu={(event) => { event.preventDefault(); event.stopPropagation(); setContextMenu({ kind: "action", id: action.id, x: event.clientX, y: event.clientY }); }}
              onClick={() => setSelectedAction(action.id)}
              onKeyDown={(event) => {
                if (event.target !== event.currentTarget) return;
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                setSelectedAction(action.id);
              }}
              className={`group relative flex w-full cursor-pointer flex-col items-start px-4 py-1 pr-10 text-left transition-colors duration-200 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary hover:bg-surface-translucent-placeholder-2 ${hovered ? "bg-surface-translucent-placeholder-2" : ""}`}
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
              <ActionRowMenu id={action.id} name={action.name} />
            </div>
          );
        })}
      </div>}
    </>
  );
}

// Feature rows for link mode. Hidden while the action list is on the right.
export function ActionCommand() {
  const {
    linking,
    selectedFeature,
    setSelectedFeature,
    setTool,
    features,
    highlightedFeatureIds,
    toggleLinkedFeature,
    hoverFeature,
    setHoverFeature,
  } = useMap();
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const searchButton = useRef<HTMLButtonElement>(null);
  const visibleFeatures = features.filter((feature) => {
    const name = typeof feature.properties.name === "string" ? feature.properties.name : String(feature.id);
    return name.toLowerCase().includes(query.trim().toLowerCase());
  });

  function closeSearch() {
    setQuery("");
    setSearching(false);
    requestAnimationFrame(() => searchButton.current?.focus());
  }

  useEffect(() => {
    if (linking) return;
    setHoverFeature(null);
  }, [linking, setHoverFeature]);

  return (
    <>
      <header className="flex shrink-0 items-center gap-2 border-b border-surface-translucent-placeholder px-4 py-4">
        {searching ? (
          <>
          <div className="peer flex h-7 min-w-0 flex-1 items-center rounded-[4px] bg-surface-canvas focus-within:bg-surface-translucent-placeholder-2 focus-within:outline-1 focus-within:outline-text-primary">
            <img src="/icons/map/search-outline.svg" alt="" width={18} height={18} className="ml-1 block shrink-0 translate-y-[0.5px]" />
            <input
              autoFocus
              aria-label="Search features"
              placeholder="Search features…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  closeSearch();
                }
              }}
              className="template-body-small h-7 min-w-0 flex-1 border-0 bg-transparent px-1 py-0 leading-7 text-text-primary outline-none placeholder:text-text-secondary"
            />
          </div>
            <button type="button" aria-label="Close feature search" onClick={closeSearch} className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-[4px] text-text-primary transition-colors duration-200 ease-in-out hover:bg-surface-translucent-placeholder-2 outline-none">
              <img src="/icons/map/close-outline.svg" alt="" width={18} height={18} />
            </button>
          </>
        ) : (
          <>
            <p className="template-body-medium-emphasized min-w-0 flex-1 text-text-primary">{mapPanel.features}</p>
            <button ref={searchButton} type="button" aria-label="Search features" onClick={() => setSearching(true)} className={headerButtonClass}>
              <img src="/icons/map/search-outline.svg" alt="" width={18} height={18} />
            </button>
          </>
        )}
      </header>
      <div className="min-h-0 flex-1 space-y-0.5 overflow-y-auto py-2">
        {visibleFeatures.map((feature) => {
          const id = String(feature.id);
          const name = typeof feature.properties.name === "string" ? feature.properties.name : id;
          return (
            <FeatureListRow
              key={id}
              id={id}
              name={name}
              features={features}
              pressed={selectedFeature === id}
              linked={highlightedFeatureIds.includes(id)}
              linking={linking}
              hovered={hoverFeature === id}
              onPress={() => {
                if (linking) toggleLinkedFeature(id);
                else {
                  setTool("pointer");
                  setSelectedFeature(id);
                }
              }}
              onHoverStart={() => setHoverFeature(id)}
              onHoverEnd={() => setHoverFeature(null)}
            />
          );
        })}
      </div>
    </>
  );
}

function ActionRowMenu({ id, name }: { id: number; name: string }) {
  const { setContextMenu } = useMap();
  return <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100" onClick={(event) => event.stopPropagation()}>
    <button type="button" aria-label={`More options for ${name}`} aria-haspopup="menu" onClick={(event) => {
      const bounds = event.currentTarget.getBoundingClientRect();
      setContextMenu({ kind: "action", id, x: bounds.right - 128, y: bounds.bottom + 4 });
    }} className={headerButtonClass}>
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="3" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="13" cy="8" r="1.5"/></svg>
    </button>
  </div>;
}
