export default function HomePage() {
  return (
    <div className="w-full flex flex-col items-center">

      {/* Title */}
      <h1 className="text-2xl font-bold mt-6 mb-4">Map of monitored bee hives</h1>

      {/* MAP PLACEHOLDER */}
      <div className="w-full max-w-3xl h-72 bg-gray-300 rounded shadow mb-3">
        {/* sem neskôr pôjde Mapa */}
      </div>

      <button className="text-yellow-600 font-semibold underline mb-8">
        Show list of monitored bee hives
      </button>

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

      {/* Footer */}
      <footer className="w-full bg-yellow-400 text-center py-4 font-semibold">
        @ Matus Plsko 2025
      </footer>
    </div>
  );
}
