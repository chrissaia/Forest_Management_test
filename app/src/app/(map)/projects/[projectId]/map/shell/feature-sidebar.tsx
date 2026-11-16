"use client";

import { useMap } from "../map-context";
import { FeatureDetails } from "./panels/feature-details";
import { useSidebarWidth } from "./use-sidebar-width";

// Stand details stay at the far right, beside the actions sidebar.
export function FeatureSidebar() {
  const { selectedFeature } = useMap();
  const open = selectedFeature !== null;
  const { asideRef, width, minWidth, onPointerDown, onPointerMove, onPointerUp } =
    useSidebarWidth("feature-details-sidebar-width", "end", open, "--map-feature-width");

  if (!open) return null;

  return (
    <aside ref={asideRef} aria-label="Feature details" style={{ width }} className="absolute inset-y-0 right-0 z-10 border-l border-border-map bg-surface-canvas">
      <div className="h-full overflow-y-auto"><FeatureDetails /></div>
      <div role="separator" aria-label="Resize feature details" aria-orientation="vertical" aria-valuemin={minWidth} aria-valuenow={Math.round(width)} tabIndex={0}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
        className="absolute inset-y-0 -left-1 z-20 w-2 cursor-col-resize touch-none" />
    </aside>
  );
}
