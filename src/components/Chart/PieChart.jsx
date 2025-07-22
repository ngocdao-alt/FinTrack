import React, { useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import { getExpenseStat } from "../../features/statSlice";
import useWindowWidth from "../../utils/useWindowWidth";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const dispatch = useDispatch();
  const stats = useSelector((state) => state.stat.stats);
  const width = useWindowWidth();

  const COLORS = [
    "#5D43DB",
    "#D1CDFB",
    "#4ade80",
    "#60a5fa",
    "#facc15",
    "#f87171",
    "#fbbf24",
    "#34d399",
  ];

  const now = new Date();

  useEffect(() => {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    dispatch(
      getExpenseStat({
        startDate: startOfMonth.toISOString().split("T")[0], // YYYY-MM-DD
        endDate: endOfMonth.toISOString().split("T")[0],
      })
    );
  }, [dispatch]);

  const getFontSize = () => {
    if (width < 640) return 12;
    else if (width >= 640 && width < 768) return 14;
    else if (width >= 768 && width < 1024) return 15;
    else if (width >= 1024 && width < 1280) return 16;
    else if (width >= 1280 && width < 1600) return 17;
    else return 18;
  };

  const totalAmount = stats.reduce((acc, item) => acc + item.total, 0);
  const totalValue = stats.reduce((sum, stat) => sum + stat.total, 0);

  const data = {
    labels: stats.map((stat) => stat.category),
    datasets: [
      {
        label: "Stats",
        data: stats.map((stat) => stat.total),
        backgroundColor: COLORS,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    // cutout: "3%",
    plugins: {
      legend: {
        position: width >= 640 ? "right" : "bottom",
        labels: {
          boxWidth: width >= 640 ? 20 : 10,
          padding: width >= 640 ? 20 : 10,
          font: {
            size: getFontSize(),
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw || 0;
            const percent = totalAmount
              ? ((value / totalAmount) * 100).toFixed(1)
              : 0;
            return `${
              context.label
            }: ${value.toLocaleString()} đ (${percent}%)`;
          },
        },
      },
    },
  };

  if (stats.length === 0)
    return <div className="my-7 text-lg">No data to display</div>;

  return <Pie data={data} options={options} />;
};

export default PieChart;
