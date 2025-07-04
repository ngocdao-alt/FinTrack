import React, { useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import { getExpenseStat } from "../../features/statSlice";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const dispatch = useDispatch();
  const stats = useSelector((state) => state.stat.stats);

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

  useEffect(() => {
    dispatch(
      getExpenseStat({
        startDate: "2025-06-01",
        endDate: "2025-06-30",
      })
    );
  }, []);

  useEffect(() => {
    console.log(stats);
  }, [stats]);

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
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw || 0;
            return `${context.label}: ${value.toLocaleString()} đ`;
          },
        },
      },
    },
  };

  if (stats.length == 0)
    return <div className="my-7 text-lg">No data to display</div>;

  return <Pie data={data} options={options} />;
};

export default PieChart;
