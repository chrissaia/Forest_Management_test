/*
 * Tests which features an action shows, and how a toggle changes that set.
 */

import { describe, expect, it } from "vitest";
import { highlightedFeatureIds, linkedFeatureIds, linksAfterToggle, type ActionFeatureLink } from "./action-feature-links";

const actionId = 8;
const otherActionId = 9;
const first = "11111111-1111-4111-8111-111111111111";
const second = "22222222-2222-4222-8222-222222222222";
const gone = "33333333-3333-4333-8333-333333333333";

const links: ActionFeatureLink[] = [
  { actionId, featureId: second },
  { actionId: otherActionId, featureId: first },
  { actionId, featureId: gone },
  { actionId, featureId: first },
];

describe("action feature links", () => {
  it("keeps feature-list order and drops features that are gone", () => {
    expect(linkedFeatureIds(links, actionId, [first, second])).toEqual([first, second]);
    expect(linkedFeatureIds(links, null, [first])).toEqual([]);
    expect(linkedFeatureIds(links, otherActionId, [first, second])).toEqual([first]);
  });

  it("shows only the hovered action, and the selected action when nothing is hovered", () => {
    expect(highlightedFeatureIds(links, actionId, otherActionId, [first, second, gone])).toEqual([
      first,
    ]);
    expect(highlightedFeatureIds(links, actionId, actionId, [first, second])).toEqual([first, second]);
    expect(highlightedFeatureIds(links, null, otherActionId, [first, second])).toEqual([first]);
    expect(highlightedFeatureIds(links, actionId, null, [first, second])).toEqual([first, second]);
    expect(highlightedFeatureIds(links, null, null, [first])).toEqual([]);
  });

  it("links a feature, then unlinks it on the next toggle", () => {
    const linked = linksAfterToggle([], actionId, first);
    expect(linked.linked).toBe(true);
    expect(linked.links).toEqual([{ actionId, featureId: first }]);
    const unlinked = linksAfterToggle(linked.links, actionId, first);
    expect(unlinked.linked).toBe(false);
    expect(unlinked.links).toEqual([]);
  });
});
