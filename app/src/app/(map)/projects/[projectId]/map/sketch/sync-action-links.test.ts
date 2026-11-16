/*
 * Tests the linked-feature paint against the selection colors.
 */

import { describe, expect, it } from "vitest";
import type { PolygonHit } from "./kinds/polygon/hit";
import {
  actionLinkCollections,
  actionLinkFillLayerId,
  actionLinkFillOpacity,
  actionLinkLineLayerId,
} from "./sync-action-links";

const first = "11111111-1111-4111-8111-111111111111";
const second = "22222222-2222-4222-8222-222222222222";

function polygon(id: string): PolygonHit {
  return {
    id,
    geometry: {
      type: "Polygon",
      coordinates: [[[0, 0], [1, 0], [1, 1], [0, 0]]],
    },
    properties: {},
  };
}

describe("action link paint", () => {
  it("paints linked polygons and skips the one being edited", () => {
    const data = actionLinkCollections(
      [polygon(first), polygon(second)],
      [first, second],
      first,
      second,
    );
    expect(data.fill.features.map((feature) => feature.id)).toEqual([second]);
    expect(data.fill.features[0]?.properties).toEqual({ hovered: true });
    expect(data.line.features).toHaveLength(1);
    expect(data.line.features[0]?.properties).toEqual({ hovered: true });
  });

  it("is empty when nothing is linked", () => {
    const data = actionLinkCollections([polygon(first)], [], null, null);
    expect(data.fill.features).toEqual([]);
    expect(data.line.features).toEqual([]);
  });

  it("uses the selected fill opacity and layer names", () => {
    expect(actionLinkFillOpacity).toBe(0.25);
    expect(actionLinkFillLayerId).toBe("action-feature-fill");
    expect(actionLinkLineLayerId).toBe("action-feature-line");
  });
});
