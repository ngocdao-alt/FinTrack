import React, { useEffect, useState } from "react";
import SummaryCards from "../../components/AdminDashboardComponent/SummaryCards";
import IncomeExpenseChart from "../../components/AdminDashboardComponent/IncomeExpenseChart";
import TransactionBarChart from "../../components/AdminDashboardComponent/TransactionBarChart";
import { useDispatch, useSelector } from "react-redux";
import {
  adminGetDashboard,
  adminGetMonthlyIncomeExpenseStat,
  adminGetMonthlyTransactions,
} from "../../features/adminDashboard";

import CategoryPieChart from "../../components/AdminDashboardComponent/CategoryPieChart";
import SessionBarChart from "../../components/AdminDashboardComponent/SessionBarChart";
import axios from "axios";
import WeeklyDurationChart from "../../components/AdminDashboardComponent/WeeklyDurationChart";

const BACK_END_URL = import.meta.env.VITE_BACK_END_URL;

const AdminDashboard = () => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [mode, setMode] = useState("week");
  const [sessions, setSessions] = useState([]);
  const [mostUsedCategories, setMostUsedCategories] = useState([]);
  const {
    totalIncome,
    totalExpense,
    transactionCount,
    userCount,
    monthlyStats,
    monthlyTransactions,
  } = useSelector((state) => state.adminDashboard);

  useEffect(() => {
    const now = new Date();
    dispatch(adminGetDashboard());
    dispatch(adminGetMonthlyIncomeExpenseStat(now.getFullYear()));
    dispatch(adminGetMonthlyTransactions(now.getFullYear()));
  }, []);

  useEffect(() => {
    const fetchSessions = async () => {
      const res = await axios.get(
        `${BACK_END_URL}/api/admin/session/weekly-duration?mode=${mode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSessions(res.data);
    };

    fetchSessions();
  }, [mode]);

  useEffect(() => {
    const fetchMostUsedCategories = async () => {
      const res = await axios.get(
        `${BACK_END_URL}/api/admin/categories/summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMostUsedCategories(res.data);
    };

    fetchMostUsedCategories();
  }, []);

  const transactionData = monthlyTransactions.map((item) => item.count);

  return (
    <div className="p-6 bg-blue-50 min-h-screen space-y-6">
      <SummaryCards
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        userCount={userCount}
        transactionCount={transactionCount}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncomeExpenseChart monthlyStats={monthlyStats} />
        <TransactionBarChart transactionData={transactionData} />
        <CategoryPieChart data={mostUsedCategories} />
        <WeeklyDurationChart data={sessions} mode={mode} setMode={setMode} />
      </div>
    </div>
  );
};

export default AdminDashboard;
