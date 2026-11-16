/*
 * Membership of features on one action.
 * The displayed ids follow the feature list, not the link insert order.
 */

export type ActionFeatureLink = {
  actionId: number;
  featureId: string;
};

// Feature ids linked to this action, in feature-list order. Missing features are left out.
export function linkedFeatureIds(
  links: readonly ActionFeatureLink[],
  actionId: number | null,
  featureIds: readonly string[],
): string[] {
  if (actionId === null) return [];
  const linked = new Set<string>();
  for (const link of links) {
    if (link.actionId === actionId) linked.add(link.featureId);
  }
  return featureIds.filter((id) => linked.has(id));
}

// Features for the action under the pointer, or the selected action when nothing is hovered.
export function highlightedFeatureIds(
  links: readonly ActionFeatureLink[],
  selectedAction: number | null,
  hoverAction: number | null,
  featureIds: readonly string[],
): string[] {
  return linkedFeatureIds(links, hoverAction ?? selectedAction, featureIds);
}

// Adds the link, or removes it when it is already there.
export function linksAfterToggle(
  links: readonly ActionFeatureLink[],
  actionId: number,
  featureId: string,
): { links: ActionFeatureLink[]; linked: boolean } {
  const index = links.findIndex(
    (link) => link.actionId === actionId && link.featureId === featureId,
  );
  if (index >= 0) {
    return {
      links: links.filter((_, item) => item !== index),
      linked: false,
    };
  }
  return {
    links: [...links, { actionId, featureId }],
    linked: true,
  };
}
