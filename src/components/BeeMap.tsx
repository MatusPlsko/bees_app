import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { hivesGeoJson } from "../data/hivesGeoJson";

const MAPBOX_TOKEN =
  "pk.eyJ1Ijoic3RhbmtvNDQiLCJhIjoiY2xzYzdsaHh6MG1nczJsbzV0MmFubWtnNyJ9.99PKedbw80WXMSkew8pA5g";

type BeeMapProps = {
  disabled?: boolean;
};

type WeatherResp = {
  location: string;
  tempC: number | null;
  humidity: number | null;
  windMs: number | null;
  description: string | null;
  icon: string | null;
  cached: boolean;
  remainingToday: number;
};

type CacheItem = { ts: number; data: WeatherResp };
const WX_TTL_MS = 10 * 60 * 1000; // 10 min (zlaď s backend cache)

export default function BeeMap({ disabled = false }: BeeMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const weatherCacheRef = useRef<Map<string, CacheItem>>(new Map());

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

      map.on("mouseenter", "places", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "places", () => {
        map.getCanvas().style.cursor = "";
      });

      map.on("click", "places", async (e) => {
        if (!e.features?.[0]) return;

        const feature = e.features[0] as any;
        const coordinates = feature.geometry.coordinates.slice() as [number, number]; // [lon, lat]
        const descriptionHtml = String(feature.properties?.description ?? "");
        const hiveId = String(feature.properties?.hiveId ?? "");

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        const popup = new mapboxgl.Popup({ closeButton: true })
          .setLngLat(coordinates)
          .setHTML(
            `${descriptionHtml}
             <div style="margin-top:10px; font-weight:700;">Weather:</div>
             <div id="wx" style="display:flex; align-items:center; gap:10px; margin-top:6px;">
               <span>Loading...</span>
             </div>`
          )
          .addTo(map);

        const wxEl = popup.getElement().querySelector("#wx") as HTMLElement | null;
        if (!wxEl) return;

        const renderWeather = (j: WeatherResp) => {
          const temp = j.tempC == null ? "?" : `${Math.round(j.tempC)}°C`;
          const desc = j.description ?? "";

          const iconHtml = j.icon
            ? `<img src="https://openweathermap.org/img/wn/${j.icon}@2x.png" width="44" height="44" alt="${desc}"/>`
            : "";

          wxEl.innerHTML = `
            ${iconHtml}
            <div>
              <div style="font-weight:800;">${temp}</div>
              <div style="font-size:12px; opacity:.8;">${desc}</div>
            </div>
          `;
        };

        if (hiveId) {
          const cached = weatherCacheRef.current.get(hiveId);
          if (cached && Date.now() - cached.ts < WX_TTL_MS) {
            renderWeather(cached.data);
            return;
          }
        }

        try {
          const base = import.meta.env.DEV ? "/bees/" : import.meta.env.BASE_URL;
          const url = `${base}api/weather?lat=${encodeURIComponent(
            String(coordinates[1])
          )}&lon=${encodeURIComponent(String(coordinates[0]))}`;

          const r = await fetch(url);
          const j = (await r.json()) as WeatherResp;

          if (!r.ok) {
            wxEl.innerHTML = `<span style="color:#b00020;">Weather unavailable</span>`;
            return;
          }

          if (hiveId) {
            weatherCacheRef.current.set(hiveId, { ts: Date.now(), data: j });
          }

          renderWeather(j);
        } catch {
          wxEl.innerHTML = `<span style="color:#b00020;">Weather unavailable</span>`;
        }
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

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