/*
 * Tests the soils GeoJSON source.
 * The source starts empty, then POST /api/soils fills it with the current bounds.
 */

import type { Map as MapLibreMap } from "maplibre-gl";
import { afterEach, describe, expect, it, vi } from "vitest";
import { installSoilSource, soilSourceId } from "./soil-source";

const collection: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [],
};

function fakeMap(loaded: boolean) {
  const sources = new Map<string, { type: string; data: GeoJSON.FeatureCollection | string }>();
  const listeners = new Map<string, Set<() => void>>();
  const map = {
    style: { _loaded: loaded },
    getBounds: () => ({
      getWest: () => -81.302,
      getSouth: () => 41.611,
      getEast: () => -81.3,
      getNorth: () => 41.613,
    }),
    addSource(id: string, spec: { type: string; data: GeoJSON.FeatureCollection | string }) {
      const source = {
        ...spec,
        setData(data: GeoJSON.FeatureCollection) {
          source.data = data;
        },
      };
      sources.set(id, source);
    },
    getSource(id: string) {
      return sources.get(id);
    },
    removeSource(id: string) {
      sources.delete(id);
    },
    on(type: string, fn: () => void) {
      const set = listeners.get(type) ?? new Set<() => void>();
      set.add(fn);
      listeners.set(type, set);
    },
    off(type: string, fn: () => void) {
      listeners.get(type)?.delete(fn);
    },
    loadStyle() {
      map.style._loaded = true;
      for (const fn of listeners.get("style.load") ?? []) fn();
    },
  };
  return { map: map as unknown as MapLibreMap, sources };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

function stubSoils(ok = true) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok,
      json: async () => collection,
    })),
  );
}

describe("soil source", () => {
  it("posts the current bounds and sets the feature collection", async () => {
    stubSoils();
    const fetchMock = vi.mocked(fetch);
    const { map, sources } = fakeMap(true);

    installSoilSource(map);

    expect(sources.get(soilSourceId)?.data).toEqual({ type: "FeatureCollection", features: [] });
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/soils");
    expect(init.method).toBe("POST");
    expect(JSON.parse(String(init.body))).toEqual({
      bounds: { west: -81.302, south: 41.611, east: -81.3, north: 41.613 },
    });
    expect(sources.get(soilSourceId)?.data).toEqual(collection);
  });

  it("keeps the empty collection when soils are unavailable", async () => {
    stubSoils(false);
    const { map, sources } = fakeMap(true);

    installSoilSource(map);
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledOnce());

    expect(sources.get(soilSourceId)?.data).toEqual({ type: "FeatureCollection", features: [] });
  });

  it("waits for the style, then removes the source on cleanup", () => {
    stubSoils();
    const { map, sources } = fakeMap(false);
    const stop = installSoilSource(map);
    expect(sources.has(soilSourceId)).toBe(false);

    (map as unknown as { loadStyle: () => void }).loadStyle();
    expect(sources.has(soilSourceId)).toBe(true);

    stop();
    expect(sources.has(soilSourceId)).toBe(false);
  });
});
