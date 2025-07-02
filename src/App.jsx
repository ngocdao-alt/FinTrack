import { Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import LoginPage from "./Pages/LoginPage";
import LandingPage from "./Pages/LandingPage";
import Sidebar from "./components/SideBarComponent";
import DashboardPage from "./pages/DashboardPage";
import Header from "./components/header";

function App() {
  const [count, setCount] = useState(0);
  const location = useLocation();

  const hideHeader =
    location.pathname === "/login" || location.pathname === "/";

  return (
    <div className="flex flex-col">
      {!hideHeader && <Header />}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
