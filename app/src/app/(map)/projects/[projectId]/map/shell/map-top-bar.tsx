"use client";

import { useEffect } from "react";
import { isTypingTarget } from "../sketch/events/keyboard";
import { ToolTip, useToolTip } from "./map-toolbar";
import { useMap } from "../map-context";

// Compact controls for the two independent map sidebars.
export function MapTopBar() {
  const { leftSidebarOpen, setLeftSidebarOpen, rightSidebarOpen, setRightSidebarOpen, featureDetailsOpen, setFeatureDetailsOpen } = useMap();
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!["a", "f", "d"].includes(event.key.toLowerCase()) || event.repeat || event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) return;
      event.preventDefault();
      if (event.key.toLowerCase() === "a") setRightSidebarOpen(!rightSidebarOpen);
      else if (event.key.toLowerCase() === "f") setLeftSidebarOpen(!leftSidebarOpen);
      else setFeatureDetailsOpen(!featureDetailsOpen);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [rightSidebarOpen, setRightSidebarOpen, leftSidebarOpen, setLeftSidebarOpen, featureDetailsOpen, setFeatureDetailsOpen]);
  const detailsTip = useToolTip();
  return (
    <div role="toolbar" aria-label="Map sidebars" className="flex h-8 shrink-0 items-center justify-between border-b border-border-map bg-surface-canvas px-2">
      <SidebarToggle side="left" open={leftSidebarOpen} onToggle={() => setLeftSidebarOpen(!leftSidebarOpen)} />
      <div className="flex items-center gap-2">
        <SidebarToggle side="right" open={rightSidebarOpen} onToggle={() => setRightSidebarOpen(!rightSidebarOpen)} />
        <button type="button" aria-label="Toggle feature details" aria-keyshortcuts="D"
          onPointerEnter={() => detailsTip.show("details", true)} onPointerLeave={() => detailsTip.hide("details")}
          onFocus={() => detailsTip.show("details", false)} onBlur={() => detailsTip.hide("details")}
          onPointerDown={() => detailsTip.dismiss("details")} aria-pressed={featureDetailsOpen} onClick={() => setFeatureDetailsOpen(!featureDetailsOpen)} className="relative flex size-6 cursor-pointer items-center justify-center rounded-[4px] text-text-primary transition-colors hover:bg-surface-translucent-placeholder-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round">
            {featureDetailsOpen ? <path d="M10 2.5h2.5A1.5 1.5 0 0 1 14 4v8a1.5 1.5 0 0 1-1.5 1.5H10Z" fill="currentColor" stroke="none" /> : null}
            <rect x="2" y="2.5" width="12" height="11" rx="1.5" /><path d="M10 2.5v11" />
          </svg>
          {detailsTip.current ? <ToolTip label="Details" shortcut="D" animate={detailsTip.current.animate} align="right" /> : null}
        </button>
      </div>
    </div>
  );
}

function SidebarToggle({ side, open, onToggle }: { side: "left" | "right"; open: boolean; onToggle: () => void }) {
  const tip = useToolTip();
  const tipId = side === "right" ? "actions" : "features";
  return (
    <button type="button" aria-label={side === "right" ? "Toggle actions panel" : "Toggle left sidebar"} aria-keyshortcuts={side === "right" ? "A" : "F"}
      onPointerEnter={() => { tip.show(tipId, true); }}
      onPointerLeave={() => tip.hide(tipId)}
      onFocus={() => { tip.show(tipId, false); }}
      onBlur={() => tip.hide(tipId)}
      onPointerDown={() => tip.dismiss(tipId)} aria-pressed={open} onClick={onToggle}
      className={`relative flex size-6 cursor-pointer items-center justify-center rounded-[4px] text-text-primary transition-colors hover:bg-surface-translucent-placeholder-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary`}>
      {side === "right" ? <span aria-hidden="true" data-state={open ? "selected" : "unselected"} className={`size-4 bg-current ${open ? "[mask-image:url(/icons/map/collection-filled.svg)]" : "[mask-image:url(/icons/map/collection.svg)]"} [mask-position:center] [mask-repeat:no-repeat] [mask-size:16px_16px] ${open ? "text-text-primary" : "text-text-secondary"}`} /> : <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round">
        {open ? <path d={side === "left" ? "M3.5 2.5H6v11H3.5A1.5 1.5 0 0 1 2 12V4a1.5 1.5 0 0 1 1.5-1.5Z" : "M10 2.5h2.5A1.5 1.5 0 0 1 14 4v8a1.5 1.5 0 0 1-1.5 1.5H10Z"} fill="currentColor" stroke="none" /> : null}
        <rect x="2" y="2.5" width="12" height="11" rx="1.5" />
        <path d={side === "left" ? "M6 2.5v11" : "M10 2.5v11"} />
      </svg>}
      {tip.current ? <ToolTip label={side === "right" ? "Actions" : "Features"} shortcut={side === "right" ? "A" : "F"} animate={tip.current.animate} align={side === "right" ? "right" : "left"} /> : null}
    </button>
  );
}
