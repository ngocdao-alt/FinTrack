import React, { useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  "#4F46E5",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#F97316",
  "#3B82F6",
];

const DonutChart = ({ categoryStats = [], totalBudget = 0 }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const filteredStats = categoryStats.filter((item) => item.spentAmount > 0);
  const { t, i18n } = useTranslation();

  const chartData = {
    labels: filteredStats.map((item) => item.category),
    datasets: [
      {
        data: filteredStats.map((item) => item.spentAmount),
        backgroundColor: COLORS,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: {
        color: "#fff",
        font: { weight: "bold", size: 13 },
        formatter: (value) => {
          const percent = totalBudget
            ? ((value / totalBudget) * 100).toFixed(0)
            : 0;
          return `${percent}%`;
        },
      },
    },
    onHover: (event, elements) => {
      if (elements.length > 0) {
        setActiveIndex(elements[0].index);
      } else {
        setActiveIndex(null);
      }
    },
    elements: {
      arc: {
        borderWidth: 2,
        hoverBorderWidth: 2,
        hoverBackgroundColor: (ctx) => {
          const i = ctx.index;
          return COLORS[i] + "CC"; // Thêm opacity
        },
      },
    },
  };

  const centerData =
    activeIndex !== null && filteredStats[activeIndex]
      ? {
          label: filteredStats[activeIndex].category,
          amount: filteredStats[activeIndex].spentAmount.toLocaleString() + "đ",
          percent: totalBudget
            ? (
                (filteredStats[activeIndex].spentAmount / totalBudget) *
                100
              ).toFixed(0)
            : 0,
        }
      : null;

  return (
    <div className="relative w-full max-w-[320px] h-[280px] mx-auto">
      {/* Biểu đồ */}
      <Doughnut
        data={chartData}
        options={options}
        plugins={[ChartDataLabels]}
      />

      {/* Text ở giữa */}
      {centerData && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10 pointer-events-none">
          <div className="text-[14px] text-gray-700 font-medium dark:text-white">
            {t(`categories.${centerData.label}`)} - {centerData.percent}%
          </div>
          <div className="text-[12px] text-gray-900 font-semibold mt-1 dark:text-white/83">
            {centerData.amount}
          </div>
        </div>
      )}
    </div>
  );
};

export default DonutChart;
