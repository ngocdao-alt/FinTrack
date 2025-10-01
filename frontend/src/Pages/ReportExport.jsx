import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactDOMServer from "react-dom/server";
import { useDispatch, useSelector } from "react-redux";

import ReportTemplate from "../components/ReportTemplate";
import DailyExpenseChart from "../components/Chart/DailyExpenseChart";
import PieChartDuplicate from "../components/Chart/PieChartDuplicate";

import { getTransactionsByMonth } from "../features/transactionSlice";
import { getDashboard } from "../features/dashboardSlice";
import { getBudget } from "../features/budgetSlice";
import { getExpenseStat } from "../features/statSlice";
import ThemeToggle from "../components/ThemeToggle";

const ReportExport = ({ month, year }) => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const { totalIncome, totalExpense } = useSelector((state) => state.dashboard);
  const { totalBudget } = useSelector((state) => state.budget);
  const transactions = useSelector((state) => state.transaction.transactions);
  const stats = useSelector((state) => state.stat.stats);

  const [barChartUrl, setBarChartUrl] = useState("");
  const [pieChartUrl, setPieChartUrl] = useState("");
  const [chartsReady, setChartsReady] = useState(false);

  useEffect(() => {
    if (pieChartUrl) {
      setChartsReady(true);
    }
  }, [pieChartUrl]);

  useEffect(() => {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);

    dispatch(getBudget({ month, year }));
    dispatch(getDashboard({ month, year }));
    dispatch(getTransactionsByMonth({ month, year }));
    dispatch(
      getExpenseStat({
        startDate: startOfMonth.toISOString().split("T")[0],
        endDate: endOfMonth.toISOString().split("T")[0],
      })
    );
  }, [dispatch]);

  const dailyExpense = transactions.reduce((acc, tx) => {
    if (tx.type !== "expense") return acc;
    const day = new Date(tx.date).getDate();
    acc[day] = (acc[day] || 0) + tx.amount;
    return acc;
  }, {});

  const dailyExpenseData = Array.from({ length: 31 }, (_, i) => ({
    day: i + 1,
    expense: dailyExpense[i + 1] || 0,
  }));

  const handleExport = async () => {
    try {
      const data = {
        user: {
          name: user.name,
          address: user.address,
          phone: user.phone,
          dob: user.dob,
        },
        summary: {
          income: totalIncome,
          expense: totalExpense,
          diff: parseFloat(totalIncome) - parseFloat(totalExpense),
          budget: totalBudget,
        },
        transactions,
        pieChartUrl,
        heatmapUrl: barChartUrl,
      };

      const htmlString = ReactDOMServer.renderToStaticMarkup(
        <ReportTemplate month={month} year={year} data={data} />
      );

      const res = await axios.post(
        "http://localhost:5000/api/report/export",
        {
          html: htmlString,
          reportId: data.reportId,
          month: `${month}-${year}`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const fileUrl = `http://localhost:5000/${res.data.report.filePath}`;
      window.open(fileUrl);
    } catch (err) {
      console.error("❌ Xuất báo cáo thất bại:", err);
      alert("Xuất báo cáo thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="space-y-4 mt-5 w-full flex flex-col ">
      <div className="absolute hidden w-[600px] h-[400px] -z-10 opacity-0 pointer-events-none">
        <PieChartDuplicate
          stats={stats}
          onRender={(url) => {
            if (!pieChartUrl) setPieChartUrl(url);
          }}
        />
      </div>

      <button
        onClick={handleExport}
        disabled={!chartsReady}
        className="self-end py-1 bg-transparent text-sky-600 cursor-pointer hover:underline"
      >
        Xuất báo cáo tháng {month}/{year}📄
      </button>
    </div>
  );
};

export default ReportExport;
