import type { GeoJSONSource, Map as MapLibreMap } from "maplibre-gl";

export const soilSourceId = "ssurgo";
const soilSourceUrl = "/api/soils";

const emptySoils: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [],
};

// Registers the Soil Data Access GeoJSON source.
// The collection starts empty and is filled from POST /api/soils with the current bounds.
// A failed response stays empty. A source URL would make MapLibre throw AJAXError.
// A restored style drops custom sources, so style.load adds this one again.
export function installSoilSource(map: MapLibreMap) {
  let stopped = false;

  const mount = () => {
    if (stopped || !map.style?._loaded) return;
    if (map.getSource(soilSourceId)) return;
    map.addSource(soilSourceId, { type: "geojson", data: emptySoils });
    void loadSoilFeatures(map, () => stopped);
  };

  map.on("style.load", mount);
  mount();

  return () => {
    stopped = true;
    map.off("style.load", mount);
    if (!map.style?._loaded) return;
    if (map.getSource(soilSourceId)) map.removeSource(soilSourceId);
  };
}

async function loadSoilFeatures(map: MapLibreMap, stopped: () => boolean) {
  const bounds = map.getBounds();
  let response: Response;
  try {
    response = await fetch(soilSourceUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        bounds: {
          west: bounds.getWest(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          north: bounds.getNorth(),
        },
      }),
    });
  } catch {
    return;
  }
  if (stopped() || !response.ok) return;

  let collection: GeoJSON.FeatureCollection;
  try {
    collection = (await response.json()) as GeoJSON.FeatureCollection;
  } catch {
    return;
  }
  if (stopped() || collection.type !== "FeatureCollection") return;

  const source = map.getSource(soilSourceId);
  if (source?.type !== "geojson") return;
  (source as GeoJSONSource).setData(collection);
}
