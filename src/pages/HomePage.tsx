import BeeMap from "../components/BeeMap";
import { useNavigate } from "react-router-dom";


type HomePageProps = {
  sidebarOpen?: boolean;
};

export default function HomePage({ sidebarOpen = false }: HomePageProps) {
  const navigate = useNavigate();

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
