import { useEffect, useMemo, useState } from "react";
import { hives } from "../data/hives";

type Props = { hiveId: string };

type Resp = {
  location: string;
  tempC: number | null;
  humidity: number | null;
  windMs: number | null;
  description: string | null;
  icon: string | null;
  remainingToday: number;
  cached: boolean;
};

export default function WeatherWidget({ hiveId }: Props) {
  const hive = useMemo(() => hives.find((h) => h.id === hiveId), [hiveId]);

  const [data, setData] = useState<Resp | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
  if (!hive) return;

  const hiveSnapshot = hive; 

  const controller = new AbortController();

  async function run() {
    try {
      setErr(null);

    const base = import.meta.env.DEV ? "/bees/" : import.meta.env.BASE_URL;
    const url = `${base}api/weather?lat=${encodeURIComponent(
        String(hiveSnapshot.lat)
      )}&lon=${encodeURIComponent(String(hiveSnapshot.lon))}`;

      const r = await fetch(url, { signal: controller.signal });
      const j = await r.json();

      if (!r.ok) {
        setErr(j?.error ?? `HTTP ${r.status}`);
        setData(null);
        return;
      }

      setData(j);
    } catch (e: any) {
      if (e?.name !== "AbortError") setErr("Failed to load weather");
    }
  }

  run();
  return () => controller.abort();
}, [hive]);


  if (!hive) {
    return (
      <div className="w-full max-w-2xl bg-gray-200 border border-black rounded-lg shadow p-4">
        <div className="font-extrabold text-lg">Actual Weather</div>
        <div className="mt-2 text-red-600 font-bold">Unknown hive</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl bg-gray-200 border border-black rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <div className="font-extrabold text-lg">Weather</div>
        <div className="font-bold text-sm text-gray-700">{hive.name}</div>
      </div>

      {err && <div className="mt-2 text-red-600 font-bold">{err}</div>}

      {data && (
        <div className="mt-3 flex items-center gap-4">
          {data.icon && (
            <img
              alt={data.description ?? "weather"}
              src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
              className="w-14 h-14"
            />
          )}

          <div className="flex-1">
            <div className="font-extrabold text-xl">
              {data.location}: {data.tempC != null ? Math.round(data.tempC) : "?"}°C
            </div>
            <div className="text-gray-800 font-semibold">{data.description}</div>
            <div className="text-sm text-gray-700 mt-1">
              Humidity: {data.humidity ?? "?"}% • Wind: {data.windMs ?? "?"} m/s
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {data.cached ? "cached" : "live"} • remaining today: {data.remainingToday}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}