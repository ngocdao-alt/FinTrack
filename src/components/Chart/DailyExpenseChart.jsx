import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const DailyExpenseChart = ({ data, onRender }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const hasRenderedImage = useRef(false); // ✅ Đảm bảo chỉ render 1 lần

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;

    const ctx = canvasRef.current.getContext("2d");

    // 🔁 Hủy chart cũ nếu có
    if (chartRef.current) {
      chartRef.current.destroy();
      hasRenderedImage.current = false;
    }

    const newChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.map((item) => item.day.toString()),
        datasets: [
          {
            label: "Chi tiêu (VNĐ)",
            data: data.map((item) => item.expense),
            backgroundColor: "#f87171",
          },
        ],
      },
      options: {
        animation: {
          onComplete: () => {
            // ✅ Chỉ render khi chưa render trước đó
            if (!hasRenderedImage.current && canvasRef.current) {
              const imageUrl = canvasRef.current.toDataURL("image/png");
              onRender?.(imageUrl); // 🔁 Gọi callback 1 lần duy nhất
              hasRenderedImage.current = true;
            }
          },
        },
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    chartRef.current = newChart;

    return () => {
      newChart.destroy();
    };
  }, [data]); // ✅ Chỉ phụ thuộc vào data

  return <canvas ref={canvasRef} className="w-full h-64" />;
};

export default DailyExpenseChart;
