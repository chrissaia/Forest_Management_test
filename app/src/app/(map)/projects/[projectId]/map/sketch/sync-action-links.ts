/*
 * Fill and outline for every feature linked to the selected action.
 * The editable selection is left to TerraDraw, so it is omitted here.
 */

import { finishedPolygonId, hoverLineData, type PolygonHit } from "./kinds/polygon/hit";

export const actionLinkFillLayerId = "action-feature-fill";
export const actionLinkLineLayerId = "action-feature-line";
export const actionLinkFillOpacity = 0.25;

type PolygonGeometry = {
  type: "Polygon";
  coordinates: number[][][];
};

const emptyCollection = { type: "FeatureCollection" as const, features: [] };

// Selected-style polygons for the linked ids, excluding the feature being edited.
export function actionLinkCollections(
  features: readonly PolygonHit[],
  linkedIds: readonly string[],
  selectedId: string | null,
  hoverId: string | null,
) {
  const linked = new Set(linkedIds);
  const fill: {
    type: "Feature";
    id: string;
    properties: { hovered: boolean };
    geometry: PolygonGeometry;
  }[] = [];
  const line: {
    type: "Feature";
    properties: { hovered: boolean };
    geometry: { type: "MultiLineString"; coordinates: number[][][] };
  }[] = [];
  for (const feature of features) {
    const id = finishedPolygonId(feature);
    const geometry = polygonGeometry(feature);
    if (id === null || geometry === null || !linked.has(id) || id === selectedId) continue;
    const hovered = hoverId === id;
    fill.push({
      type: "Feature",
      id,
      properties: { hovered },
      geometry,
    });
    const outline = hoverLineData(feature).features[0];
    if (!outline || outline.geometry.type !== "MultiLineString") continue;
    line.push({
      type: "Feature",
      properties: { hovered },
      geometry: outline.geometry,
    });
  }
  return {
    fill: { type: "FeatureCollection" as const, features: fill },
    line: { type: "FeatureCollection" as const, features: line },
  };
}

export function emptyActionLinks() {
  return { fill: emptyCollection, line: emptyCollection };
}

function polygonGeometry(feature: PolygonHit): PolygonGeometry | null {
  const coordinates = feature.geometry.coordinates;
  if (feature.geometry.type !== "Polygon" || !Array.isArray(coordinates)) return null;
  return { type: "Polygon", coordinates: coordinates as number[][][] };
}
