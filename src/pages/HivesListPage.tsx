import { hives } from "../data/hives";

export default function HivesListPage() {
  return (
    <div className="w-full flex flex-col items-center px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">
        List of monitored bee hives
      </h1>

      <div className="w-full max-w-5xl bg-white shadow rounded-lg overflow-hidden">
        {/* Filters row – zatiaľ len prázdne inputy ako vizuálny placeholder */}
        <div className="border-b border-gray-200">
          <div className="grid grid-cols-4 gap-0">
            <input
              className="px-3 py-2 border-r border-gray-200 focus:outline-none"
              placeholder=""
            />
            <input
              className="px-3 py-2 border-r border-gray-200 focus:outline-none"
              placeholder=""
            />
            <select className="px-3 py-2 border-r border-gray-200 focus:outline-none">
              <option value="">Dashboard</option>
            </select>
            <input
              className="px-3 py-2 focus:outline-none"
              placeholder=""
            />
          </div>
        </div>

        {/* Table header */}
        <div className="bg-gray-100 border-b border-gray-200 font-semibold text-sm">
          <div className="grid grid-cols-4">
            <div className="px-4 py-3 border-r border-gray-200">
              Name of bee hive
            </div>
            <div className="px-4 py-3 border-r border-gray-200">
              Owner (beekeeper)
            </div>
            <div className="px-4 py-3 border-r border-gray-200">Dashboard</div>
            <div className="px-4 py-3">City</div>
          </div>
        </div>

        {/* Rows */}
        <div>
          {hives.map((hive, index) => (
            <div
              key={hive.id}
              className={`grid grid-cols-4 text-sm ${
                index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
              }`}
            >
              <div className="px-4 py-3 border-r border-gray-200">
                {hive.name}
              </div>
              <div className="px-4 py-3 border-r border-gray-200">
                {hive.owner}
              </div>
              <div className="px-4 py-3 border-r border-gray-200">
                {hive.dashboardUrl ? (
                  <a
                    href={hive.dashboardUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block px-3 py-1 border border-yellow-500 text-yellow-700 rounded bg-yellow-50 hover:bg-yellow-100 font-semibold text-xs"
                  >
                    Go to Dashboard
                  </a>
                ) : (
                  <span className="text-gray-500 text-xs">
                    Dashboard is not public
                  </span>
                )}
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <span>{hive.city}</span>
                <button className="ml-4 px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-xs rounded">
                  Show on map
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
