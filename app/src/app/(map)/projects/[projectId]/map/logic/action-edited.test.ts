/*
 * Tests the edited age for today, days, weeks, and years.
 */

import { describe, expect, it } from "vitest";
import { editedLabel } from "./action-edited";

const now = new Date(2026, 10, 13, 17, 17);

describe("editedLabel", () => {
  it("uses 0d on the same day", () => {
    expect(editedLabel(new Date(2026, 10, 13, 9, 5), now)).toBe("0d");
  });

  it("counts whole days before a week", () => {
    expect(editedLabel(new Date(2026, 10, 12, 9, 5), now)).toBe("1d");
    expect(editedLabel(new Date(2026, 10, 7, 9, 5), now)).toBe("6d");
  });

  it("counts weeks after 7 days", () => {
    expect(editedLabel(new Date(2026, 10, 6, 9, 5), now)).toBe("1w");
    expect(editedLabel(new Date(2026, 9, 16, 9, 5), now)).toBe("4w");
  });

  it("counts years after 365 days", () => {
    expect(editedLabel(new Date(2025, 10, 13, 9, 5), now)).toBe("1y");
    expect(editedLabel(new Date(2025, 10, 12, 9, 5), now)).toBe("1y");
  });
});
