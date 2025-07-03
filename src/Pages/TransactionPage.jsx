import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
/* 👉 dùng thunks đã khai báo ngay trong slice */
import {
  getTransactions,
  deleteTransaction,
} from "../features/transactionSlice"; // đường dẫn tuỳ dự án
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const TransactionPage = () => {
  const dispatch = useDispatch();
  const { transactions, loading, total, totalPage, page } = useSelector(
    (s) => s.transaction
  );

  /* -------- bộ lọc ---------- */
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    month: "",
    year: "",
    keyword: "",
  });

  useEffect(() => {
    dispatch(getTransactions(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value === "Tất cả" ? "" : value,
    }));
  };

  /* -------- thống kê tính ngay trên client ---------- */
  const { income, expense, count } = useMemo(() => {
    let income = 0,
      expense = 0;
    transactions.forEach((t) =>
      t.type === "income" ? (income += t.amount) : (expense += t.amount)
    );
    return { income, expense, count: transactions.length };
  }, [transactions]);

  /* -------- option select ---------- */
  const typeOptions = ["Tất cả", "income", "expense"];
  const categoryOptions = [
    "Tất cả",
    "Du lịch",
    "Nhà cửa",
    "Quần áo",
    "Tiền lương",
    "Ăn uống",
    "Đầu tư",
  ];
  const years = Array.from({ length: 8 }, (_, i) => 2018 + i);

  /* -------- render ---------- */
  return (
    <div className="min-h-screen w-full bg-[#f5f6fa] px-4 py-2 ">
      <h1 className="text-3xl font-bold mb-4">Giao dịch</h1>

      {/* --- Bộ lọc --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-4 rounded-md shadow">
        {/* Loại */}
        <Select
          label="Loại"
          name="type"
          value={filters.type}
          options={typeOptions}
          onChange={handleFilterChange}
          render={(o) => (o === "income" ? "Thu" : o === "expense" ? "Chi" : o)}
        />
        {/* Mục */}
        <Select
          label="Mục giao dịch"
          name="category"
          value={filters.category}
          options={categoryOptions}
          onChange={handleFilterChange}
        />
        {/* Tháng */}
        <Select
          label="Tháng"
          name="month"
          value={filters.month}
          options={["Tất cả", ...Array.from({ length: 12 }, (_, i) => i + 1)]}
          onChange={handleFilterChange}
        />
        {/* Năm */}
        <Select
          label="Năm"
          name="year"
          value={filters.year}
          options={["Tất cả", ...years]}
          onChange={handleFilterChange}
        />
      </div>

      {/* --- Thống kê --- */}
      <div
        className="
    bg-white mt-6 rounded-md shadow
    flex flex-col divide-y divide-gray-300            /* mobile: gạch ngang */
    sm:flex-row sm:divide-y-0 sm:divide-x sm:divide-gray-300  /* >=640px: gạch dọc */
"
      >
        {/* Tổng thu nhập */}
        <div className="flex-1 p-4">
          <p className="text-gray-500">Tổng thu nhập:</p>
          <p className="text-green-600 font-bold text-xl">
            +{income.toLocaleString("vi-VN")}
          </p>
        </div>

        {/* Tổng chi tiêu */}
        <div className="flex-1 p-4">
          <p className="text-gray-500">Tổng chi tiêu:</p>
          <p className="text-red-500 font-bold text-xl">
            -{expense.toLocaleString("vi-VN")}
          </p>
        </div>

        {/* Số lượng giao dịch */}
        <div className="flex-1 p-4 sm:text-right">
          <p className="text-gray-500">Số lượng giao dịch:</p>
          <p className="text-blue-600 font-bold text-xl">{count}</p>
        </div>
      </div>

      {/* ---- Nút thêm giao dịch ---- */}
      <div className="flex justify-end mt-6 mb-2">
        <button
          className="
      bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm
      py-2 px-4 rounded
      w-fit sm:w-auto 
      flex items-center gap-2
    "
        >
          <FaPlus /> Thêm giao dịch
        </button>
      </div>

      {/* ---- Danh sách giao dịch ---- */}
      <table className="w-full text-left text-sm mt-4 md:text-base">
        <thead>
          <tr className="text-gray-600 border-b">
            <th className="hidden sm:table-cell py-2">Loại</th>
            <th>Mục</th>
            <th>Số tiền</th>
            <th>Ngày</th>
            <th className="hidden sm:table-cell">Ghi chú</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center py-4">
                Đang tải...
              </td>
            </tr>
          ) : transactions.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4">
                Không có giao dịch
              </td>
            </tr>
          ) : (
            transactions.map((t) => (
              <tr key={t._id} className="border-b hover:bg-gray-50">
                {/* Loại */}
                <td className="hidden sm:table-cell py-2">
                  {t.type === "income" ? "Thu" : "Chi"}
                </td>

                {/* Mục */}
                <td>{t.category}</td>

                {/* Số tiền */}
                <td
                  className={
                    t.type === "income" ? "text-green-600" : "text-red-600"
                  }
                >
                  {t.type === "income" ? "+" : "-"}
                  {t.amount.toLocaleString("vi-VN")}
                </td>

                {/* Ngày */}
                <td>{new Date(t.date).toLocaleDateString("vi-VN")}</td>

                {/* Ghi chú */}
                <td className="hidden sm:table-cell">{t.note || "-"}</td>

                {/* Action */}
                <td className="py-2 text-right">
                  <span className="inline-flex gap-2 text-gray-600">
                    <FaEdit
                      className="cursor-pointer hover:text-blue-500"
                      onClick={() => {
                        /* mở modal sửa */
                      }}
                    />
                    <FaTrash
                      className="cursor-pointer hover:text-red-500"
                      onClick={() => dispatch(deleteTransaction(t._id))}
                    />
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

/* ========= Component con ========= */
const Select = ({ label, name, value, options, onChange, render }) => (
  <div>
    <label className="block text-gray-600 mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border rounded px-3 py-2 text-gray-600"
    >
      {options.map((opt) => (
        <option key={opt} value={opt === "Tất cả" ? "" : opt}>
          {render ? render(opt) : opt}
        </option>
      ))}
    </select>
  </div>
);

const StatCard = ({ label, value, prefix = "", color }) => (
  <div>
    <p className="text-gray-500">{label}:</p>
    <p className={`font-bold text-xl text-${color}-500`}>
      {prefix}
      {value.toLocaleString("vi-VN")}
    </p>
  </div>
);

export default TransactionPage;
