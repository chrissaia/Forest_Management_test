"use client";

/*
 * Shared map state for the toolbar, sidebar, and sketch session.
 * Feature writes go through insert, update, and delete, one feature at a time.
 */

import { createContext, useContext, useState } from "react";
import type { GeoJSONStoreFeatures } from "terra-draw";
import type { ProjectAction } from "@/lib/actions/actions";
import { keptHoverId, keptSelectedId, selectedForTool } from "./sketch/kinds/polygon/hit";
import { useMapActions } from "./use-map-actions";
import { useMapFeatures } from "./use-map-features";

export type MapTool = "pointer" | "polygon" | "point";
export type MapPanel = "features" | "actions" | "soils" | "parcels";

export const mapPanel: Record<MapPanel, string> = {
  features: "Features",
  actions: "Actions",
  soils: "Soils",
  parcels: "Parcels",
};

type MapContextValue = {
  tool: MapTool;
  setTool: (tool: MapTool) => void;
  panel: MapPanel;
  setPanel: (panel: MapPanel) => void;
  features: GeoJSONStoreFeatures[];
  insertFeature: (feature: GeoJSONStoreFeatures) => void;
  updateFeature: (feature: GeoJSONStoreFeatures) => void;
  deleteFeature: (id: string) => void;
  renameFeature: (id: string, name: string) => void;
  describeFeature: (id: string, description: string) => void;
  selectedFeature: string | null;
  setSelectedFeature: (id: string | null) => void;
  hoverFeature: string | null;
  setHoverFeature: (id: string | null) => void;
  actions: ProjectAction[];
  renameAction: (id: number, name: string) => void;
  describeAction: (id: number, description: string) => void;
  selectedAction: number | null;
  setSelectedAction: (id: number | null) => void;
};

const MapContext = createContext<MapContextValue | null>(null);

// Provides the tool, panel, feature list, selection, and hover to the map.
export function MapProvider({
  projectId,
  initialFeatures = [],
  initialActions = [],
  children,
}: {
  projectId: number;
  initialFeatures?: GeoJSONStoreFeatures[];
  initialActions?: ProjectAction[];
  children: React.ReactNode;
}) {
  const [tool, setToolState] = useState<MapTool>("pointer");
  const [panel, setPanel] = useState<MapPanel>("features");
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [hoverFeature, setHoverFeature] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<number | null>(null);
  const { actions, renameAction, describeAction } = useMapActions(projectId, initialActions);
  const { features, insertFeature, updateFeature, deleteFeature, renameFeature, describeFeature } = useMapFeatures(
    projectId,
    initialFeatures,
  );

  const featureIds = features.map((feature) => String(feature.id));
  const selectedId = keptSelectedId(selectedFeature, featureIds);
  if (selectedId !== selectedFeature) setSelectedFeature(selectedId);
  const hoverId = keptHoverId(hoverFeature, selectedId, featureIds);
  if (hoverId !== hoverFeature) setHoverFeature(hoverId);
  if (selectedAction !== null && !actions.some((action) => action.id === selectedAction)) {
    setSelectedAction(null);
  }

  // Changes the tool and clears the selection unless the tool is the pointer.
  const setTool = (next: MapTool) => {
    setToolState(next);
    const nextSelected = selectedForTool(next, selectedFeature);
    if (nextSelected !== selectedFeature) setSelectedFeature(nextSelected);
  };

  return (
    <MapContext.Provider
      value={{
        tool,
        setTool,
        panel,
        setPanel,
        features,
        insertFeature,
        updateFeature,
        deleteFeature,
        renameFeature,
        describeFeature,
        selectedFeature,
        setSelectedFeature,
        hoverFeature,
        setHoverFeature,
        actions,
        renameAction,
        describeAction,
        selectedAction,
        setSelectedAction,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

// The map context. Throws when used outside MapProvider.
export function useMap() {
  const value = useContext(MapContext);
  if (!value) {
    throw new Error("useMap must be used within MapProvider");
  }
  return value;
}
