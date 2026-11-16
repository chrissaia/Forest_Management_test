"use client";

/*
 * One feature row in an action sidebar.
 * The row matches the features list: pentagon, name, and an optional hover X.
 */

import type { GeoJSONStoreFeatures } from "terra-draw";
import { FeatureName } from "../feature-name";

// A feature row. Press toggles or selects. The X runs the caller's remove.
export function FeatureListRow({
  id,
  name,
  features,
  pressed,
  hovered,
  onPress,
  onRemove,
  removeLabel,
  onHoverStart,
  onHoverEnd,
}: {
  id: string;
  name: string;
  features: GeoJSONStoreFeatures[];
  pressed: boolean;
  hovered: boolean;
  onPress?: () => void;
  onRemove?: () => void;
  removeLabel?: string;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  return (
    <div
      role={onPress ? "button" : undefined}
      tabIndex={onPress ? 0 : undefined}
      aria-pressed={onPress ? pressed : undefined}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onClick={onPress}
      onKeyDown={onPress ? (event) => onRowKey(event, onPress) : undefined}
      className={`group flex w-full items-center gap-2.5 overflow-hidden px-4 text-left transition-colors duration-200 ease-in-out ${onPress ? "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-selected" : ""} ${pressed ? "bg-surface-selected hover:bg-surface-selected" : `hover:bg-surface-translucent-placeholder-2 ${hovered ? "bg-surface-translucent-placeholder-2" : ""}`}`}
    >
      <span
        aria-hidden="true"
        className={`size-3 shrink-0 bg-surface-header [mask-image:url(/icons/map/pentagon.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] ${onRemove ? "group-hover:hidden" : ""}`}
      />
      {onRemove ? (
        <button
          type="button"
          aria-label={removeLabel}
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
          className="hidden size-3 shrink-0 cursor-pointer items-center justify-center text-surface-header transition-colors duration-200 ease-in-out group-hover:flex hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
        >
          <span
            aria-hidden="true"
            className="flex size-3 -translate-y-[2.56px] items-center justify-center overflow-hidden text-[24px] leading-none font-extralight tracking-normal"
          >
            ×
          </span>
        </button>
      ) : null}
      <div className="min-w-0 flex-1">
        <FeatureName id={id} name={name} features={features} activate="double-click" />
      </div>
    </div>
  );
}

function onRowKey(event: React.KeyboardEvent<HTMLDivElement>, onPress: () => void) {
  if (event.target !== event.currentTarget) return;
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  onPress();
}
