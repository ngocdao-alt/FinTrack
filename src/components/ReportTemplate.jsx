import React from "react";

const ReportTemplate = ({ data }) => {
  const { user, reportId, summary, transactions, pieChartUrl, heatmapUrl } =
    data;

  return (
    <div className="p-8 text-sm text-gray-800 font-sans">
      {/* Tiêu đề */}
      <h1 className="text-2xl font-bold text-center text-red-500 mb-4">
        BÁO CÁO TÀI CHÍNH THÁNG
      </h1>

      {/* Thông tin người dùng */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Thông tin người dùng</h2>
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
          <strong>Quốc tịch:</strong> {user.nationality}
        </p>
        <p>
          <strong>ID báo cáo:</strong> {reportId}
        </p>
      </section>

      {/* Tổng quan thu chi */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Tổng quan</h2>
        <div className="grid grid-cols-2 gap-4">
          <p>
            <strong>Tổng thu:</strong> {summary.income.toLocaleString()} đ
          </p>
          <p>
            <strong>Tổng chi:</strong> {summary.expense.toLocaleString()} đ
          </p>
          <p>
            <strong>Chênh lệch:</strong> {summary.diff.toLocaleString()} đ
          </p>
          <p>
            <strong>Ngân sách:</strong> {summary.budget.toLocaleString()} đ
          </p>
        </div>
      </section>

      {/* Bảng giao dịch */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Giao dịch trong tháng</h2>
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
                <td className="border border-gray-300 px-2 py-1">{tx.date}</td>
                <td className="border border-gray-300 px-2 py-1">
                  {tx.category}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {tx.description}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {tx.amount.toLocaleString()} đ
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
      <section className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Thống kê theo danh mục</h2>
        <img
          src={pieChartUrl}
          alt="Biểu đồ danh mục"
          className="w-full h-auto border"
        />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Chi tiêu theo ngày</h2>
        <img
          src={heatmapUrl}
          alt="Heatmap chi tiêu"
          className="w-full h-auto border"
        />
      </section>
    </div>
  );
};

export default ReportTemplate;
