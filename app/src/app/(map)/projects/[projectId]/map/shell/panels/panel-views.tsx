"use client";

/*
 * One command sidebar and one details sidebar for each map panel.
 */

import { useMap, type MapPanel } from "../../map-context";
import { ActionCommand, ActionList } from "./action-command";
import { ActionDetails } from "./action-details";
import { ParcelCommand } from "./parcel-command";
import { ParcelDetails } from "./parcel-details";
import { SoilCommand } from "./soil-command";
import { SoilDetails } from "./soil-details";

type PanelSelection = {
  feature: string | null;
  action: number | null;
  linking: boolean;
};

type PanelView = {
  Command: () => React.JSX.Element | null;
  Details: () => React.JSX.Element | null;
  commandOpen: (selection: PanelSelection) => boolean;
  detailsOpen: (selection: PanelSelection) => boolean;
};

export const panelViews: Record<MapPanel, PanelView> = {
  features: {
    Command: ActionCommand,
    Details: ActionPanel,
    commandOpen: () => true,
    detailsOpen: () => true,
  },
  actions: {
    Command: ActionCommand,
    Details: ActionPanel,
    commandOpen: () => true,
    detailsOpen: () => true,
  },
  soils: {
    Command: SoilCommand,
    Details: SoilDetails,
    commandOpen: () => true,
    detailsOpen: () => false,
  },
  parcels: {
    Command: ParcelCommand,
    Details: ParcelDetails,
    commandOpen: () => true,
    detailsOpen: () => false,
  },
};

// The action list, or the open action. Closing the action returns to the list.
function ActionPanel() {
  const { selectedAction } = useMap();
  if (selectedAction === null) return <ActionList />;
  return <ActionDetails />;
}
