"use client";

/*
 * Details for the selected feature.
 * The sidebar frame mounts this only while a feature is selected.
 */

import Link from "next/link";
import { ParagraphField } from "@/app/components/texts/paragraph-field";
import type { TextFieldChange } from "@/app/components/texts/text-field-change";
import { useMap } from "../state/map-context";
import { FeatureName } from "./feature-name";
import { polygonAcres } from "../logic/polygon-acres";

// Name and acreage for the selected polygon.
export function FeatureDetails() {
  const { projectId, features, selectedFeature, describeFeature } = useMap();
  if (selectedFeature === null) return null;

  const feature = features.find((item) => String(item.id) === selectedFeature);
  const featureName = typeof feature?.properties.name === "string" ? feature.properties.name : "";
  const description =
    typeof feature?.properties.description === "string" ? feature.properties.description : "";
  const acres = polygonAcres(feature);

  return (
    <div className="flex w-full shrink-0 flex-col border-b border-surface-translucent-placeholder px-2 pt-4 pb-2">
      <div className="flex w-full items-center gap-1">
        <div className="min-w-0 flex-1">
          <FeatureName
            key={selectedFeature}
            id={selectedFeature}
            name={featureName}
            features={features}
            activate="click"
          />
        </div>
        {acres !== null ? (
          <p className="template-body-small shrink-0 pr-2 text-text-secondary tabular-nums">
            {acreageLabel(acres)}
          </p>
        ) : null}
      </div>
      <ParagraphField
        key={selectedFeature}
        value={description}
        onText={(change) => saveDescription(selectedFeature, change, describeFeature)}
      />
      <Link
        href={`/projects/${projectId}/plan?stand=${encodeURIComponent(selectedFeature)}`}
        className="template-body-small mt-1 rounded-[4px] px-2 py-1 text-text-primary hover:bg-surface-translucent-placeholder-2"
      >
        View Stand Plan
      </Link>
    </div>
  );
}

// An empty description is stored as an empty string.
function saveDescription(
  id: string,
  change: TextFieldChange,
  describeFeature: (id: string, description: string) => void,
) {
  describeFeature(id, change.action === "delete" ? "" : change.text);
}

// One decimal and the unit, matching the header's secondary acreage.
function acreageLabel(acres: number) {
  return `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(acres)} acres`;
}
