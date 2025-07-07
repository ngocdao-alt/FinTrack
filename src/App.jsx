import { Routes, Route, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import Sidebar from "./components/SideBarComponent";
import DashboardPage from "./pages/DashboardPage";
import Header from "./components/Header";
import BudgetPage from "./pages/BudgetPage";
import TransactionPage from "./pages/TransactionPage";
import StatPage from "./pages/StatPage";
import SettingPage from "./pages/SettingPage";
import MainLayout from "./layout/MainLayout";
import Component from "./components/Component";
import BigSideBar from "./components/BigSideBar";

function App() {
  const location = useLocation();
  const hideHeader =
    location.pathname === "/login" || location.pathname === "/";

  return (
    <Routes>
      {/* Routes không cần layout */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={<MainLayout header={<Header />} sidebar={<BigSideBar />} />}
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/transactions" element={<TransactionPage />} />
        <Route path="/stat" element={<StatPage />} />
        <Route path="/settings" element={<SettingPage />} />
      </Route>
    </Routes>
  );
}

export default App;