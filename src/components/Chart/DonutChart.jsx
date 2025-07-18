import React, { useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const COLORS = [
  "#4F46E5", "#10B981", "#F59E0B", "#EF4444",
  "#8B5CF6", "#06B6D4", "#F97316", "#3B82F6",
];

const DonutChart = ({ categoryStats = [], totalBudget = 0 }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const chartData = {
    labels: categoryStats.map((item) => item.category),
    datasets: [
      {
        data: categoryStats.map((item) => item.spentAmount),
        backgroundColor: COLORS,
        borderWidth: 2,
        hoverOffset: 12,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      legend: {
        display: false,
      },
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
  };

  const centerData =
    activeIndex !== null && categoryStats[activeIndex]
      ? {
          label: categoryStats[activeIndex].category,
          amount:
            categoryStats[activeIndex].spentAmount.toLocaleString() + "đ",
          percent: totalBudget
            ? (
                (categoryStats[activeIndex].spentAmount / totalBudget) *
                100
              ).toFixed(0)
            : 0,
        }
      : null;

  return (
    <div className="relative w-full h-[260px] flex items-center justify-center">
  <div className="w-[220px] h-[220px]">
    <Doughnut
      data={chartData}
      options={options}
      plugins={[ChartDataLabels]}
    />
  </div>

  {/* Nội dung hover hiển thị ở giữa */}
  {centerData && (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
      <div className="text-sm text-gray-600 font-medium">
        {centerData.label} - {centerData.percent}%
      </div>
      <div className="text-xs text-gray-800 font-semibold mt-1">
        {centerData.amount}
      </div>
    </div>
  )}
</div>

  );
};

export default DonutChart;
