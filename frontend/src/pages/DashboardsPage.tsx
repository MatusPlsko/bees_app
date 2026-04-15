import { useState } from "react";
import { hives } from "../data/hives";

const hivesWithDashboard = hives.filter((h) => h.dashboardUrl !== undefined);

export default function DashboardsPage() {
  const [selectedId, setSelectedId] = useState(hivesWithDashboard[0]?.id ?? "");

  const selectedHive = hivesWithDashboard.find((h) => h.id === selectedId);

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-2xl font-bold mt-6 mb-4">Dashboards</h1>

      <div className="w-full max-w-2xl mb-4">
        <select
          className="w-full bg-gray-300 border border-black px-4 py-3 text-center font-extrabold text-xl"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {hivesWithDashboard.map((h) => (
            <option key={h.id} value={h.id}>
              {h.name}
            </option>
          ))}
        </select>
      </div>

      {selectedHive?.dashboardUrl ? (
        <div className="w-full max-w-7xl px-4 mb-12">
          <iframe
            key={selectedHive.id}
            src={selectedHive.dashboardUrl}
            title={selectedHive.name}
            className="w-full rounded-lg border border-black shadow"
            style={{ height: "80vh", minHeight: "600px" }}
            frameBorder="0"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="w-full max-w-2xl bg-gray-200 border border-black rounded-lg shadow p-4 text-center font-bold text-red-600">
          Dashboard not available for this hive.
        </div>
      )}
    </div>
  );
}