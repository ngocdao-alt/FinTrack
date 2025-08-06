import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useTranslation } from "react-i18next";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

const LineChart = ({ labels = [], dataIncome = [], dataExpense = [] }) => {
  const { t, i18n } = useTranslation();
  const data = {
    labels,
    datasets: [
      {
        label: t("income"),
        data: dataIncome,
        borderColor: "#4ade80",
        backgroundColor: "rgba(74, 222, 128, 0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      },
      {
        label: t("expense"),
        data: dataExpense,
        borderColor: "#f87171",
        backgroundColor: "rgba(248, 113, 113, 0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      labels: {
        padding: 20,
        font: {
          size: 14,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw || 0;
            return `${context.dataset.label}: ${value.toLocaleString()} đ`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => {
            if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
            if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
            return value;
          },
          maxTicksLimit: window.innerWidth < 640 ? 3 : 6,
          font: {
            size: window.innerWidth < 640 ? 10 : 14,
          },
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
