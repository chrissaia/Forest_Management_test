/*
 * Tests the lowercase map tool shortcuts.
 */

import { describe, expect, it } from "vitest";
import { exitsLinking, toolForKey } from "./map-tool-keys";

describe("map tool keys", () => {
  it("selects pointer, polygon, and point from lowercase keys", () => {
    expect(toolForKey("v")).toBe("pointer");
    expect(toolForKey("p")).toBe("polygon");
    expect(toolForKey("j")).toBe("point");
  });

  it("ignores uppercase and every other key", () => {
    expect(toolForKey("V")).toBeNull();
    expect(toolForKey("P")).toBeNull();
    expect(toolForKey("J")).toBeNull();
    expect(toolForKey("a")).toBeNull();
  });

  it("leaves link mode on Enter and Escape", () => {
    expect(exitsLinking("Enter")).toBe(true);
    expect(exitsLinking("Escape")).toBe(true);
    expect(exitsLinking(" ")).toBe(false);
    expect(exitsLinking("v")).toBe(false);
  });
});
