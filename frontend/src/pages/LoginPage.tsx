export default function LoginPage() {
  return (
    <div className="w-full flex flex-col items-center mt-10 px-4">

      <h1 className="text-2xl font-bold mb-6">
        Login
      </h1>

      <div className="w-full max-w-md bg-gray-200 p-6 rounded-lg shadow text-center">

        <p className="mb-4">
          If you already have an account in the ThingsBoard platform,
          you can log in to access dashboards and sensor data.
        </p>

        <a
          href="http://147.175.150.184:8080/login"
          target="_blank"
          className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 font-semibold"
        >
          Login to ThingsBoard
        </a>

      </div>
    </div>
  );
}