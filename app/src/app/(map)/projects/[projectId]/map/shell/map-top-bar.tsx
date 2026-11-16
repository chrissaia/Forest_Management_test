"use client";

import { useMap } from "../map-context";

// Compact controls for the two independent map sidebars.
export function MapTopBar() {
  const { leftSidebarOpen, setLeftSidebarOpen, rightSidebarOpen, setRightSidebarOpen } = useMap();
  return (
    <div role="toolbar" aria-label="Map sidebars" className="flex h-8 shrink-0 items-center justify-between border-b border-border-map bg-surface-canvas px-2">
      <SidebarToggle side="left" open={leftSidebarOpen} onToggle={() => setLeftSidebarOpen(!leftSidebarOpen)} />
      <SidebarToggle side="right" open={rightSidebarOpen} onToggle={() => setRightSidebarOpen(!rightSidebarOpen)} />
    </div>
  );
}

function SidebarToggle({ side, open, onToggle }: { side: "left" | "right"; open: boolean; onToggle: () => void }) {
  return (
    <button type="button" aria-label={`Toggle ${side} sidebar`} aria-pressed={open} onClick={onToggle}
      className={`flex size-6 cursor-pointer items-center justify-center rounded-[4px] text-text-primary transition-colors hover:bg-surface-translucent-placeholder-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary`}>
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round">
        {open ? <path d={side === "left" ? "M3.5 2.5H6v11H3.5A1.5 1.5 0 0 1 2 12V4a1.5 1.5 0 0 1 1.5-1.5Z" : "M10 2.5h2.5A1.5 1.5 0 0 1 14 4v8a1.5 1.5 0 0 1-1.5 1.5H10Z"} fill="currentColor" stroke="none" /> : null}
        <rect x="2" y="2.5" width="12" height="11" rx="1.5" />
        <path d={side === "left" ? "M6 2.5v11" : "M10 2.5v11"} />
      </svg>
    </button>
  );
}
