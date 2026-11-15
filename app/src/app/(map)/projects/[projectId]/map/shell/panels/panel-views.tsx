"use client";

/*
 * One command sidebar and one details sidebar for each map panel.
 */

import type { MapPanel } from "../../map-context";
import { ActionCommand } from "./action-command";
import { ActionDetails } from "./action-details";
import { FeatureCommand } from "./feature-command";
import { FeatureDetails } from "./feature-details";
import { ParcelCommand } from "./parcel-command";
import { ParcelDetails } from "./parcel-details";
import { SoilCommand } from "./soil-command";
import { SoilDetails } from "./soil-details";

type PanelSelection = {
  feature: string | null;
  action: number | null;
};

type PanelView = {
  Command: () => React.JSX.Element | null;
  Details: () => React.JSX.Element | null;
  detailsOpen: (selection: PanelSelection) => boolean;
};

export const panelViews: Record<MapPanel, PanelView> = {
  features: {
    Command: FeatureCommand,
    Details: FeatureDetails,
    detailsOpen: ({ feature }) => feature !== null,
  },
  actions: {
    Command: ActionCommand,
    Details: ActionDetails,
    detailsOpen: ({ action }) => action !== null,
  },
  soils: {
    Command: SoilCommand,
    Details: SoilDetails,
    detailsOpen: () => false,
  },
  parcels: {
    Command: ParcelCommand,
    Details: ParcelDetails,
    detailsOpen: () => false,
  },
};
