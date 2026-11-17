"use client";

/*
 * The resizable actions sidebar on the right of the map.
 */

import { useMap } from "../state/map-context";
import { ActionList } from "./action-command";
import { useSidebarWidth } from "../state/use-sidebar-width";

// The right sidebar.
export function DetailsSidebar() {
  const { rightSidebarOpen } = useMap();
  const {
    asideRef,
    width,
    minWidth,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  } = useSidebarWidth("details-sidebar-width", "end", rightSidebarOpen);

  if (!rightSidebarOpen) return null;

  return (
    <aside
      ref={asideRef}
      aria-label="Actions"
      style={{ width }}
      className="absolute inset-y-0 right-0 z-30"
    >
      <div className="flex h-full flex-col border-l border-border-map bg-surface-canvas">
        <div className="flex min-h-0 flex-1 flex-col">
          <ActionList />
        </div>
      </div>
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize actions sidebar"
        aria-valuemin={minWidth}
        aria-valuenow={Math.round(width)}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="absolute inset-y-0 -left-1 z-20 w-2 cursor-col-resize touch-none"
      />
    </aside>
  );
}
