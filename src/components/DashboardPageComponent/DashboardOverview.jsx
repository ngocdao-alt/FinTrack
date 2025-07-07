import React, { useEffect, useState } from "react";
import LineChart from "../Chart/LineChart";
import { useSelector } from "react-redux";
import axios from "axios";

const DashboardOverview = ({ className = "" }) => {
  const BACK_END_URL = import.meta.env.VITE_BACK_END_URL;
  const token = useSelector((state) => state.auth.token);

  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [labels, setLabels] = useState([]);

  const getMonthLabels = () => {
    const now = new Date();
    const currentMonth = now.getMonth() - 1;
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return monthNames.slice(0, currentMonth + 1);
  };

  useEffect(() => {
    const now = new Date();
    const months = Array.from({ length: now.getMonth() + 1 }, (_, i) => i + 1); // [1, 2, 3, ..., currentMonth+1]

    const fetchDashboardData = async () => {
      const incomeArr = [];
      const expenseArr = [];

      for (const month of months) {
        try {
          const res = await axios.get(
            `${BACK_END_URL}/api/dashboard?month=${month}&year=${now.getFullYear()}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const { totalIncome = 0, totalExpense = 0 } = res.data || {};
          incomeArr.push(totalIncome);
          expenseArr.push(totalExpense);
        } catch (error) {
          incomeArr.push(0);
          expenseArr.push(0);
        }
      }

      setIncomeData(incomeArr);
      setExpenseData(expenseArr);
      setLabels(getMonthLabels());
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  return (
    <div
      className={`w-full ${className} flex flex-col my-3 mb-3 bg-white rounded-lg border border-slate-200 shadow p-4`}
    >
      <h2 className="mb-2 text-xl font-bold">Overview</h2>

      <div className="w-full p-5 flex justify-center items-center sm:p-0">
        <div className="h-[250px] w-[80%] sm:w-[70%]  md:h-[200px] lg:h-[220px] lg:p-3">
          <LineChart
            labels={labels}
            dataIncome={incomeData}
            dataExpense={expenseData}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
