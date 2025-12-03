import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { hivesGeoJson } from "../data/hivesGeoJson";

// TODO: neskôr presunieme do .env
const MAPBOX_TOKEN =
  "pk.eyJ1Ijoic3RhbmtvNDQiLCJhIjoiY2xzYzdsaHh6MG1nczJsbzV0MmFubWtnNyJ9.99PKedbw80WXMSkew8pA5g";

const BeeMap = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [19.15324, 48.57442],
      zoom: 6,
    });

    map.on("load", () => {
      // použijeme reálne GeoJSON dáta s úľmi
      map.addSource("places", {
        type: "geojson",
        // cast na any, aby TS nefrflal na typ "FeatureCollection"
        data: hivesGeoJson as any,
      });

      map.addLayer({
        id: "places",
        type: "symbol",
        source: "places",
        layout: {
          "icon-image": ["get", "icon"],
          "icon-allow-overlap": true,
          "icon-size": 2,
        },
      });

      map.on("click", "places", (e) => {
        if (!e.features || !e.features[0]) return;

        const feature = e.features[0];
        const coordinates = (feature.geometry as any).coordinates.slice();
        const description = feature.properties?.description as string;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
          .setLngLat(coordinates as [number, number])
          .setHTML(description)
          .addTo(map);
      });

      map.on("mouseenter", "places", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "places", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    // cleanup pri unmountnutí komponentu
    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="w-full max-w-4xl h-[400px] rounded-lg overflow-hidden shadow mb-4">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};

export default BeeMap;
