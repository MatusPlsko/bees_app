import BeeMap from "../components/BeeMap";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import WeatherWidget from "../components/WeatherWidget";
import { hives } from "../data/hives";

type HomePageProps = {
  sidebarOpen?: boolean;
};

export default function HomePage({ sidebarOpen = false }: HomePageProps) {
  const navigate = useNavigate();

  const defaultHiveId = hives?.[0]?.id ?? "";

  const [weatherHiveId, setWeatherHiveId] = useState(() => {
    return localStorage.getItem("bees_weather:lastHiveId") || defaultHiveId;
  });

  useEffect(() => {
    localStorage.setItem("bees_weather:lastHiveId", weatherHiveId);
  }, [weatherHiveId]);

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-2xl font-bold mt-6 mb-4">
        Map of monitored bee hives
      </h1>

      <BeeMap disabled={sidebarOpen} />

      <button
        className="text-yellow-600 font-semibold underline mb-8 mt-4"
        onClick={() => navigate("/hives")}
      >
        Show list of monitored bee hives
      </button>

      <div className="w-full max-w-2xl mt-4">
      <select
        className="w-full bg-gray-300 border border-black px-4 py-3 text-center font-extrabold text-xl"
        value={weatherHiveId}
        onChange={(e) => setWeatherHiveId(e.target.value)}
      >
        {hives.map((h) => (
          <option key={h.id} value={h.id}>
            {h.name}
          </option>
        ))}
      </select>

      <div className="mt-3">
        <WeatherWidget hiveId={weatherHiveId} />
      </div>
    </div>

      {/* Info text */}
      <div className="w-full max-w-2xl bg-gray-200 p-6 rounded-lg shadow mb-12 text-center">
        <p className="mb-2">
          Using IoT we monitor bee hives weight, temperature and humidity (in & out),
        </p>
        <p className="mb-2">
          frequency of bees buzzing and hive rollover.
        </p>
        <p>
          Beekeeper can make notes in his diary for each hive separately.
        </p>
      </div>

      {/* About us section */}
      <div className="w-full bg-gray-300 py-24 text-center text-xl font-semibold">
        About us
      </div>

    </div>
  );
}
