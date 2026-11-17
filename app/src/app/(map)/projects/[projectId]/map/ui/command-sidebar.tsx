"use client";

/*
 * The resizable feature list on the left of the map.
 */

import { useMap } from "../state/map-context";
import { FeatureBar } from "./feature-bar";
import { useSidebarWidth } from "../state/use-sidebar-width";

// The left sidebar.
export function CommandSidebar() {
  const { leftSidebarOpen } = useMap();
  const {
    asideRef,
    width,
    minWidth,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  } = useSidebarWidth("map-sidebar-width", "start", leftSidebarOpen);

  if (!leftSidebarOpen) return null;

  return (
    <aside
      ref={asideRef}
      style={{ width }}
      className="absolute inset-y-0 left-0 z-10"
    >
      <div className="flex h-full flex-col overflow-hidden border-r border-border-map bg-surface-canvas">
        <FeatureBar />
      </div>
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize sidebar"
        aria-valuemin={minWidth}
        aria-valuenow={Math.round(width)}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="absolute inset-y-0 -right-1 z-20 w-2 cursor-col-resize touch-none"
      />
    </aside>
  );
}
