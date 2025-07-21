// report-template/Report.jsx
import React from "react";

const Report = ({ user, reportId, income, expense, budget, transactions }) => {
  return (
    <div className="p-6 font-sans text-gray-800">
      <h1 className="text-2xl font-bold mb-4">Báo cáo tài chính tháng</h1>

      <div className="mb-6">
        <p>
          <strong>Họ tên:</strong> {user.name}
        </p>
        <p>
          <strong>Số điện thoại:</strong> {user.phone}
        </p>
        <p>
          <strong>Địa chỉ:</strong> {user.address}
        </p>
        <p>
          <strong>Mã báo cáo:</strong> {reportId}
        </p>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4 text-center">
        <div className="bg-green-100 p-4 rounded shadow">
          <p className="font-semibold">Tổng thu</p>
          <p className="text-lg font-bold text-green-600">
            {income.toLocaleString()}₫
          </p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <p className="font-semibold">Tổng chi</p>
          <p className="text-lg font-bold text-red-600">
            {expense.toLocaleString()}₫
          </p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow">
          <p className="font-semibold">Ngân sách đặt ra</p>
          <p className="text-lg font-bold text-blue-600">
            {budget.toLocaleString()}₫
          </p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2 mt-4">Chi tiết giao dịch</h2>
      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Ngày</th>
            <th className="border px-2 py-1">Loại</th>
            <th className="border px-2 py-1">Danh mục</th>
            <th className="border px-2 py-1">Ghi chú</th>
            <th className="border px-2 py-1">Số tiền</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, i) => (
            <tr key={i}>
              <td className="border px-2 py-1">{t.date}</td>
              <td className="border px-2 py-1">
                {t.type === "income" ? "Thu" : "Chi"}
              </td>
              <td className="border px-2 py-1">{t.category}</td>
              <td className="border px-2 py-1">{t.note}</td>
              <td className="border px-2 py-1 text-right">
                {t.amount.toLocaleString()}₫
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Placeholder for chart/heatmap */}
      <div className="mt-6">
        <p className="text-gray-600 italic">
          Biểu đồ thống kê và Heatmap sẽ được thêm ở backend (dưới dạng hình
          ảnh).
        </p>
      </div>
    </div>
  );
};

export default Report;
