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
const WX_TTL_MS = 10 * 60 * 1000; // 10 min

export default function BeeMap({ disabled = false }: BeeMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // cache medzi klikmi / rendermi
  const weatherCacheRef = useRef<Map<string, CacheItem>>(new Map());

  // aby sme vedeli clean-up markerov
  const weatherMarkersRef = useRef<mapboxgl.Marker[]>([]);

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

    // helper: fetch weather s cache
    async function getWeatherCached(
      hiveId: string,
      lat: number,
      lon: number
    ): Promise<WeatherResp | null> {
      const cached = weatherCacheRef.current.get(hiveId);
      if (cached && Date.now() - cached.ts < WX_TTL_MS) return cached.data;

      try {
        const base = import.meta.env.DEV ? "/bees/" : import.meta.env.BASE_URL;
        const url = `${base}api/weather?lat=${encodeURIComponent(
          String(lat)
        )}&lon=${encodeURIComponent(String(lon))}`;

        const r = await fetch(url);
        const j = (await r.json()) as WeatherResp;

        if (!r.ok) return null;

        weatherCacheRef.current.set(hiveId, { ts: Date.now(), data: j });
        return j;
      } catch {
        return null;
      }
    }

    // helper: vytvor “badge” marker
    function createWeatherBadgeEl() {
      const el = document.createElement("div");

      // malé “pill” nad úľom
      el.style.display = "flex";
      el.style.alignItems = "center";
      el.style.gap = "6px";
      el.style.padding = "4px 8px";
      el.style.border = "1px solid #000";
      el.style.borderRadius = "999px";
      el.style.background = "rgba(243,244,246,0.95)"; // gray-100-ish
      el.style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";
      el.style.fontWeight = "800";
      el.style.fontSize = "12px";
      el.style.lineHeight = "1";
      el.style.pointerEvents = "none"; // aby badge neblokoval klik na vlajku

      // placeholder
      el.textContent = "…";
      return el;
    }

    // helper: update badge
    function renderBadge(el: HTMLElement, w: WeatherResp | null) {
      if (!w) {
        el.textContent = "N/A";
        return;
      }

      const temp = w.tempC == null ? "?" : `${Math.round(w.tempC)}°`;

      // vyrobíme malý HTML obsah (ikonka + teplota)
      const iconHtml = w.icon
        ? `<img src="https://openweathermap.org/img/wn/${w.icon}@2x.png" width="26" height="26" style="display:block; margin:-6px 0;" alt="" />`
        : "";

      el.innerHTML = `${iconHtml}<span>${temp}</span>`;
    }

    map.on("load", () => {
      // ====== HIVE LAYER ======
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

      // ====== WEATHER BADGES (nad každým úľom) ======
      // clean-up starých markerov, keby sa to niekedy reloadlo
      weatherMarkersRef.current.forEach((m) => m.remove());
      weatherMarkersRef.current = [];

      const features = (hivesGeoJson as any)?.features ?? [];
      for (const f of features) {
        const hiveId = String(f?.properties?.hiveId ?? "");
        const coords = f?.geometry?.coordinates as [number, number] | undefined; // [lon, lat]
        if (!hiveId || !coords) continue;

        const [lon, lat] = coords;

        const badgeEl = createWeatherBadgeEl();
        const marker = new mapboxgl.Marker({
          element: badgeEl,
          // posunieme to nad vlajku
          offset: [0, -32],
          anchor: "bottom",
        })
          .setLngLat([lon, lat])
          .addTo(map);

        weatherMarkersRef.current.push(marker);

        // fetch weather a update badge
        void (async () => {
          const w = await getWeatherCached(hiveId, lat, lon);
          renderBadge(badgeEl, w);
        })();
      }

      // ====== CURSOR ======
      map.on("mouseenter", "places", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "places", () => {
        map.getCanvas().style.cursor = "";
      });

      // ====== POPUP (klik) + weather (s cache) ======
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

        const wxEl =
          (popup.getElement()?.querySelector("#wx") as HTMLElement | null) ?? null;
        if (!wxEl) return;

        const renderPopupWeather = (j: WeatherResp | null) => {
          if (!j) {
            wxEl.innerHTML = `<span style="color:#b00020;">Weather unavailable</span>`;
            return;
          }
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

        const [lon, lat] = coordinates;

        // použijeme cache (a zároveň doplníme badge cache)
        const w = await getWeatherCached(hiveId || `${lat},${lon}`, lat, lon);
        renderPopupWeather(w);
      });
    });

    return () => {
      // cleanup markerov
      weatherMarkersRef.current.forEach((m) => m.remove());
      weatherMarkersRef.current = [];

      map.remove();
      mapRef.current = null;
    };
  }, []);

  // sidebar disable interactions
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