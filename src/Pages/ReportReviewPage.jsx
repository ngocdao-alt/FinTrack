import React, { useEffect } from "react";
import axios from "axios";
import ReactDOMServer from "react-dom/server";
import ReportTemplate from "../components/ReportTemplate";
import { useSelector } from "react-redux";

const ReportExport = () => {
  const user = useSelector((state) => state.auth);

  useEffect(() => {
    console.log(user);
  }, []);
  const handleExport = async () => {
    try {
      const dummyData = {
        user: {
          name: "Nguyễn Văn B",
          address: "123 Lê Lợi, TP.HCM",
          phone: "0123456789",
          nationality: "Việt Nam",
        },
        summary: {
          income: 20000000,
          expense: 15000000,
          diff: 5000000,
          budget: 18000000,
        },
        transactions: [
          {
            date: "2025-07-02",
            category: "Ăn uống",
            description: "Cafe",
            amount: 35000,
            type: "expense",
          },
          {
            date: "2025-07-03",
            category: "Lương",
            description: "Lương tháng 7",
            amount: 20000000,
            type: "income",
          },
          {
            date: "2025-07-04",
            category: "Giải trí",
            description: "Netflix",
            amount: 260000,
            type: "expense",
          },
        ],
        pieChartUrl:
          "https://www.quanthub.com/wp-content/uploads//pie_chart_employee_count-768x475.png",
        heatmapUrl:
          "https://r-charts.com/en/evolution/monthly-calendar-heatmap_files/figure-html/monthly-calendar-heatmap.png",
      };

      // 1. Render HTML
      const htmlString = ReactDOMServer.renderToStaticMarkup(
        <ReportTemplate data={dummyData} />
      );

      // 2. Gửi HTML lên server để render + lưu
      const response = await axios.post(
        "http://localhost:5000/api/report/export",
        { html: htmlString, reportId: dummyData.reportId, month: "2025-07" }, // ✅ Gửi thêm reportId và month
        {
          headers: {
            Authorization: `Bearer ${user.token}`, // Bạn phải chắc chắn có user.token
            "Content-Type": "application/json",
          },
        }
      );

      // 3. Nhận filePath trả về từ server
      const { report } = response.data;
      const fileUrl = `http://localhost:5000/${report.filePath}`;
      window.open(fileUrl);

      // 4. Gọi GET để lấy blob PDF về và trigger tải
      //   const blobRes = await axios.get(fileUrl, { responseType: "blob" });
      //   const blob = new Blob([blobRes.data], { type: "application/pdf" });

      //   const link = document.createElement("a");
      //   link.href = URL.createObjectURL(blob);
      //   link.download = "bao_cao_tai_chinh.pdf";
      //   document.body.appendChild(link);
      //   link.click();
      //   link.remove();
    } catch (error) {
      console.error("Xuất báo cáo thất bại:", error);
      alert("Xuất báo cáo thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <button
      onClick={handleExport}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Xuất báo cáo PDF
    </button>
  );
};

export default ReportExport;
