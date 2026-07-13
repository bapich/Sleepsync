import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import LogPage from "./pages/LogPage";
import StakingPage from "./pages/StakingPage";
import ActivityPage from "./pages/ActivityPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-mesh" aria-hidden="true" />
      <div className="bg-mesh-extra" aria-hidden="true" />

      <Routes>
        {/* Landing — no navbar */}
        <Route path="/" element={<LandingPage />} />

        {/* App shell with persistent Navbar */}
        <Route
          path="/*"
          element={
            <div className="app-layout">
              <Navbar />
              <div className="page-wrapper">
                <Routes>
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="log"       element={<LogPage />} />
                  <Route path="staking"   element={<StakingPage />} />
                  <Route path="activity"  element={<ActivityPage />} />
                  <Route path="settings"  element={<SettingsPage />} />
                  <Route path="*"         element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
