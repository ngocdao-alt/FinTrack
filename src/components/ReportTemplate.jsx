import React from "react";
import formatDateToString from "../utils/formatDateToString";
import formatCurrency from "../utils/formatCurrency";

const ReportTemplate = ({ month, year, data }) => {
  const { user, reportId, summary, transactions, pieChartUrl, heatmapUrl } =
    data;

  return (
    <div className="p-8 text-sm text-gray-800 font-sans">
      {/* Tiêu đề */}
      <h1 className="text-2xl font-bold text-center text-red-500 mb-4">
        BÁO CÁO TÀI CHÍNH THÁNG {month}/{year}
      </h1>

      {/* Thông tin người dùng */}
      <section className="mb-6">
        <h2 className="text-lg font-bold mb-3">Thông tin người dùng</h2>
        <div className="w-full flex flex-col gap-2">
          <p>
            <strong>Họ tên:</strong> {user.name}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {user.address}
          </p>
          <p>
            <strong>Điện thoại:</strong> {user.phone}
          </p>
          <p>
            <strong>Ngày sinh:</strong> {user.dob}
          </p>
        </div>
      </section>

      {/* Tổng quan thu chi */}
      <section className="mb-6">
        <h2 className="text-lg font-bold mb-3">Tổng quan</h2>
        <div className="grid grid-cols-2 gap-4">
          <p>
            <strong>Tổng thu:</strong> {formatCurrency(summary.income)} đ
          </p>
          <p>
            <strong>Tổng chi:</strong> {formatCurrency(summary.expense)} đ
          </p>
          <p>
            <strong>Chênh lệch:</strong> {formatCurrency(summary.diff)} đ
          </p>
          <p>
            <strong>Ngân sách:</strong> {formatCurrency(summary.budget)} đ
          </p>
        </div>
      </section>

      {/* Bảng giao dịch */}
      <section className="mb-6">
        <h2 className="text-lg font-bold mb-2">Giao dịch trong tháng</h2>
        <table className="w-full border-collapse border border-gray-300 text-xs">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-2 py-1">Ngày</th>
              <th className="border border-gray-300 px-2 py-1">Danh mục</th>
              <th className="border border-gray-300 px-2 py-1">Mô tả</th>
              <th className="border border-gray-300 px-2 py-1">Số tiền</th>
              <th className="border border-gray-300 px-2 py-1">Loại</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-300 px-2 py-1">
                  {formatDateToString(tx.date)}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {tx.category}
                </td>
                <td className="border border-gray-300 px-2 py-1">{tx.note}</td>
                <td className="border border-gray-300 px-2 py-1">
                  {formatCurrency(tx.amount)} đ
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {tx.type === "income" ? "Thu" : "Chi"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Biểu đồ */}
      <section className="mb-4 text-center">
        <h2 className="text-lg font-bold mb-4">Thống kê theo danh mục</h2>
        <img
          src={pieChartUrl}
          alt="Biểu đồ danh mục"
          className="inline-block w-[80%] h-auto border object-contain"
        />
        <p className="text-xs text-gray-500 mt-1">
          Nguồn dữ liệu từ các giao dịch trong tháng
        </p>
      </section>

      {/* <section className="mb-4 text-center">
        <h2 className="text-lg font-bold mb-2">Chi tiêu theo ngày</h2>
        <img
          src={heatmapUrl}
          alt="Heatmap chi tiêu"
          className="inline-block w-[80%] h-auto border object-contain"
        />
        <p className="text-xs text-gray-500 mt-1">
          Nguồn dữ liệu từ các giao dịch trong tháng
        </p>
      </section> */}
    </div>
  );
};

export default ReportTemplate;
