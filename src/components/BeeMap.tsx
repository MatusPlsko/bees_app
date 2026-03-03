import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { hivesGeoJson } from "../data/hivesGeoJson";

const MAPBOX_TOKEN =
  "pk.eyJ1Ijoic3RhbmtvNDQiLCJhIjoiY2xzYzdsaHh6MG1nczJsbzV0MmFubWtnNyJ9.99PKedbw80WXMSkew8pA5g";

type BeeMapProps = {
  disabled?: boolean; // true keď je sidebar otvorený
};

export default function BeeMap({ disabled = false }: BeeMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [19.15324, 48.57442],
      zoom: 6,
    });

    mapRef.current = map;

    const onLoad = () => {
      // SOURCE
      if (!map.getSource("places")) {
        map.addSource("places", {
          type: "geojson",
          data: hivesGeoJson as any,
        });
      }

      // LAYER
      if (!map.getLayer("places")) {
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
      }

      // CLICK -> show popup (like on the web)
      map.on("click", "places", (e) => {
        const feature = e.features?.[0];
        if (!feature) return;

        const coords = (feature.geometry as any).coordinates?.slice();
        if (!coords) return;

        const description = (feature.properties as any)?.description as string | undefined;
        if (!description) return;

        // handle world wrap (Mapbox recommended snippet)
        while (Math.abs(e.lngLat.lng - coords[0]) > 180) {
          coords[0] += e.lngLat.lng > coords[0] ? 360 : -360;
        }

        new mapboxgl.Popup({ offset: 10 })
          .setLngLat(coords as [number, number])
          .setHTML(description)
          .addTo(map);
      });

      // Cursor pointer on hover
      map.on("mouseenter", "places", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "places", () => {
        map.getCanvas().style.cursor = "";
      });
    };

    map.on("load", onLoad);

    return () => {
      // Cleanup
      try {
        map.off("load", onLoad);
        map.off("click", "places", () => {});
        map.off("mouseenter", "places", () => {});
        map.off("mouseleave", "places", () => {});
      } catch {
        // ignore
      }
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // disable/enable interactions when sidebar open
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const canvas = map.getCanvas();
    canvas.style.pointerEvents = disabled ? "none" : "auto";

    if (disabled) {
      map.boxZoom.disable();
      map.doubleClickZoom.disable();
      map.dragPan.disable();
      map.dragRotate.disable();
      map.keyboard.disable();
      map.scrollZoom.disable();
      map.touchZoomRotate.disable();
    } else {
      map.boxZoom.enable();
      map.doubleClickZoom.enable();
      map.dragPan.enable();
      map.dragRotate.enable();
      map.keyboard.enable();
      map.scrollZoom.enable();
      map.touchZoomRotate.enable();
    }
  }, [disabled]);

  return (
    <div className="relative w-full max-w-4xl h-[400px] rounded-lg overflow-hidden shadow mb-4">
      <div ref={mapContainerRef} className="w-full h-full" />

      {disabled && (
        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
      )}
    </div>
  );
}