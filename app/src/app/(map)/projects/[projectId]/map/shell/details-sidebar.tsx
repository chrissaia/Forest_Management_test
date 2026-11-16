"use client";

/*
 * The resizable details sidebar on the right of the map.
 * Each panel decides when its details are open.
 */

import { useMap } from "../map-context";
import { panelViews } from "./panels/panel-views";
import { useSidebarWidth } from "./use-sidebar-width";

// The right sidebar for the open panel.
export function DetailsSidebar() {
  const { panel, linking, selectedFeature, selectedAction, rightSidebarOpen } = useMap();
  const view = panelViews[panel];
  const open = rightSidebarOpen && view.detailsOpen({ feature: selectedFeature, action: selectedAction, linking });
  const {
    asideRef,
    width,
    minWidth,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  } = useSidebarWidth("details-sidebar-width", "end", open);

  if (!open) return null;

  const Details = view.Details;

  return (
    <aside
      ref={asideRef}
      aria-label="Actions"
      style={{ width }}
      className="absolute inset-y-0 right-0 z-10"
    >
      <div className="flex h-full flex-col overflow-hidden border-l border-border-map bg-surface-canvas">
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <Details />
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
