import BeeMap from "../components/BeeMap";
import { useEffect, useState } from "react";
import WeatherWidget from "../components/WeatherWidget";
import { hives } from "../data/hives";

type HomePageProps = {
  sidebarOpen?: boolean;
};

const hivesWithDashboard = hives.filter((h) => h.dashboardUrl !== undefined);

function OverviewStats() {
  const cities = new Set(hives.map((h) => h.city)).size;
  return (
    <div className="w-full max-w-2xl mt-8 mb-2">
      <h2 className="text-lg font-semibold mb-3">Overview</h2>
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Active hives", value: hivesWithDashboard.length, sub: `${hives.length - hivesWithDashboard.length} private` },
          { label: "Cities", value: cities, sub: "across Slovakia" },
          { label: "Sensors", value: 4, sub: "per hive" },
          { label: "Dashboards", value: hivesWithDashboard.length, sub: "public" },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-gray-200 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-500 mb-1">{label}</div>
            <div className="text-2xl font-semibold">{value}</div>
            <div className="text-xs text-gray-400 mt-1">{sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const HOW_IT_WORKS = [
  { num: 1, title: "Sensors", desc: "Weight, temp, humidity & sound sensors installed in each hive" },
  { num: 2, title: "Microcontroller", desc: "Arduino / ESP reads data and sends it via WiFi or LoRa" },
  { num: 3, title: "ThingsBoard", desc: "IoT platform stores and visualises all telemetry in real time" },
  { num: 4, title: "This app", desc: "Map, weather, diary and dashboards for each hive in one place" },
];

function HowItWorks() {
  return (
    <div className="w-full max-w-2xl mt-6 mb-2">
      <h2 className="text-lg font-semibold mb-3">How it works</h2>
      <div className="grid grid-cols-4 gap-3">
        {HOW_IT_WORKS.map((s) => (
          <div key={s.num} className="bg-white border border-gray-200 rounded-xl p-3 text-center">
            <div className="w-7 h-7 rounded-full bg-yellow-100 text-yellow-800 text-sm font-semibold flex items-center justify-center mx-auto mb-2">
              {s.num}
            </div>
            <div className="text-sm font-medium mb-1">{s.title}</div>
            <div className="text-xs text-gray-500 leading-relaxed">{s.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const BEE_FACTS = [
  { emoji: "🐝", title: "80% of crops", desc: "depend on bee pollination worldwide" },
  { emoji: "🍯", title: "1 jar of honey", desc: "requires visits to 2 million flowers" },
  { emoji: "📡", title: "Real-time data", desc: "weight changes reveal swarming & harvest time" },
  { emoji: "🌡️", title: "35 °C", desc: "bees maintain exact hive temperature year-round" },
  { emoji: "⚖️", title: "Weight monitoring", desc: "daily gain shows how well bees are foraging" },
  { emoji: "🔊", title: "Sound analysis", desc: "buzz frequency indicates colony health & stress" },
];

function DidYouKnow() {
  return (
    <div className="w-full bg-yellow-400 mt-10 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-lg font-semibold mb-5 text-center">Did you know?</h2>
        <div className="grid grid-cols-3 gap-3">
          {BEE_FACTS.map((f) => (
            <div key={f.title} className="bg-yellow-300 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{f.emoji}</div>
              <div className="text-sm font-semibold mb-1">{f.title}</div>
              <div className="text-xs text-yellow-900 leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage({ sidebarOpen = false }: HomePageProps) {
  const defaultHiveId = hives?.[0]?.id ?? "";
  const [weatherHiveId, setWeatherHiveId] = useState(
    () => localStorage.getItem("bees_weather:lastHiveId") || defaultHiveId
  );

  useEffect(() => {
    localStorage.setItem("bees_weather:lastHiveId", weatherHiveId);
  }, [weatherHiveId]);

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-2xl font-bold mt-6 mb-4">Map of monitored bee hives</h1>

      <BeeMap disabled={sidebarOpen} />

      {/* Weather */}
      <div className="w-full max-w-2xl mt-8">
        <select
          className="w-full bg-gray-300 border border-black px-4 py-3 text-center font-extrabold text-xl"
          value={weatherHiveId}
          onChange={(e) => setWeatherHiveId(e.target.value)}
        >
          {hives.map((h) => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>
        <div className="mt-3">
          <WeatherWidget hiveId={weatherHiveId} />
        </div>
      </div>

      <OverviewStats />
      <HowItWorks />

      {/* Info text */}
      <div className="w-full max-w-2xl bg-gray-200 p-6 rounded-lg shadow mt-8 mb-2 text-center">
        <p className="mb-2">Using IoT we monitor bee hive weight, temperature and humidity (in &amp; out),</p>
        <p className="mb-2">frequency of bees buzzing and hive rollover.</p>
        <p>Beekeeper can make notes in his diary for each hive separately.</p>
      </div>

      <DidYouKnow />
    </div>
  );
}