import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { hivesGeoJson } from "../data/hivesGeoJson";

const MAPBOX_TOKEN =
  "pk.eyJ1Ijoic3RhbmtvNDQiLCJhIjoiY2xzYzdsaHh6MG1nczJsbzV0MmFubWtnNyJ9.99PKedbw80WXMSkew8pA5g";

type BeeMapProps = {
  disabled?: boolean; // true keď je sidebar otvorený
};

const BeeMap = ({ disabled = false }: BeeMapProps) => {
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

    map.on("load", () => {
      map.addSource("places", {
        type: "geojson",
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
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ✅ toto je to hlavné: toggle interakcií + pointer-events na canvas
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

      {/* voliteľné: vizuálne stmavenie mapy */}
      {disabled && (
        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
      )}
    </div>
  );
};

export default BeeMap;
