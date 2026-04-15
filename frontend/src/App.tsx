import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import DiaryPage from "./pages/DiaryPage";
import Footer from "./components/Footer";
import ThingsBoardPage from "./pages/ThingsBoardPage";
import DashboardsPage from "./pages/DashboardsPage"; 

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-screen bg-gray-100 flex flex-col">
      <Navbar
        open={sidebarOpen}
        onOpen={() => setSidebarOpen(true)}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={<HomePage sidebarOpen={sidebarOpen} />}/>
          <Route path="/diary" element={<DiaryPage />} />
          <Route path="/thingsboard" element={<ThingsBoardPage />} />
          <Route path="/dashboards" element={<DashboardsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;