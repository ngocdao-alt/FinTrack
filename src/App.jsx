import { Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./Pages/LandingPage";
import Sidebar from "./components/SideBarComponent";
import DashboardPage from "./pages/DashboardPage";
import Header from "./components/Header";
import BudgetPage from "./pages/BudgetPage";
import TransactionPage from "./pages/TransactionPage";
import StatPage from "./pages/StatPage";
import SettingPage from "./pages/SettingPage";

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
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/transactions" element={<TransactionPage />} />
          <Route path="/stat" element={<StatPage />} />
          <Route path="/settings" element={<SettingPage />} />
        </Routes>
      </div>
    </div>
  );
}
export default App;
