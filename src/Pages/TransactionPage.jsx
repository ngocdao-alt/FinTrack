import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getTransactions,
  deleteTransaction,
} from "../features/transactionSlice";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AddTransactionModal from "../components/AddTransactionModal"; // 🆕

const TransactionPage = () => {
  const dispatch = useDispatch();
  const { transactions, loading } = useSelector((s) => s.transaction);

  const [filters, setFilters] = useState({
    type: "",
    category: "",
    month: "",
    year: "",
    keyword: "",
  });

  const [showAdd, setShowAdd] = useState(false); // 🆕

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

  const { income, expense, count } = useMemo(() => {
    let income = 0,
      expense = 0;
    transactions.forEach((t) =>
      t.type === "income" ? (income += t.amount) : (expense += t.amount)
    );
    return { income, expense, count: transactions.length };
  }, [transactions]);

  const typeOptions = ["Tất cả", "income", "expense"];
  const categoryOptions = [
    "Tất cả",
    "Bán hàng",
    "Di chuyển",
    "Giáo dục",
    "Giải trí",
    "Lương",
    "Mua sắm",
    "Sức khỏe",
    "Thuê nhà",
    "Thưởng",
    "Ăn uống",
    "Đầu tư",
  ];
  const years = Array.from({ length: 8 }, (_, i) => 2018 + i);

  return (
    <div className="min-h-screen w-full bg-[#f5f6fa] px-4 py-2 ">
      <h1 className="text-4xl font-bold mb- text-[#464646]">
        Giao dịch
      </h1>

      {/* --- Bộ lọc --- */}
      <div className="grid grid-cols-1 mt-2 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-4 rounded-md shadow">
        <Select
          label="Loại"
          name="type"
          value={filters.type}
          options={typeOptions}
          onChange={handleFilterChange}
          render={(o) => (o === "income" ? "Thu" : o === "expense" ? "Chi" : o)}
        />
        <Select
          label="Mục giao dịch"
          name="category"
          value={filters.category}
          options={categoryOptions}
          onChange={handleFilterChange}
        />
        <Select
          label="Tháng"
          name="month"
          value={filters.month}
          options={["Tất cả", ...Array.from({ length: 12 }, (_, i) => i + 1)]}
          onChange={handleFilterChange}
        />
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
        className="bg-white mt-6 rounded-md shadow flex flex-col divide-y divide-gray-300 sm:flex-row sm:divide-y-0 sm:divide-x sm:divide-gray-300"
      >
        <div className="flex-1 p-4">
          <p className="text-gray-500">Tổng thu nhập:</p>
          <p className="text-green-600 font-bold text-xl">
            +{income.toLocaleString("vi-VN")}
          </p>
        </div>

        <div className="flex-1 p-4">
          <p className="text-gray-500">Tổng chi tiêu:</p>
          <p className="text-red-500 font-bold text-xl">
            -{expense.toLocaleString("vi-VN")}
          </p>
        </div>

        <div className="flex-1 p-4 sm:text-right">
          <p className="text-gray-500">Số lượng giao dịch:</p>
          <p className="text-blue-600 font-bold text-xl">{count}</p>
        </div>
      </div>

      {/* ---- Nút thêm giao dịch ---- */}
      <div className="flex justify-end mt-6 mb-2">
        <button
          onClick={() => setShowAdd(true)} // 🆕
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm py-2 px-4 rounded w-fit sm:w-auto flex items-center gap-2"
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
              <td colSpan="6" className="text-center py-4">Đang tải...</td>
            </tr>
          ) : transactions.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4">Không có giao dịch</td>
            </tr>
          ) : (
            transactions.map((t) => (
              <tr key={t._id} className="border-b hover:bg-gray-50">
                <td className="hidden sm:table-cell py-2">
                  {t.type === "income" ? "Thu" : "Chi"}
                </td>
                <td>{t.category}</td>
                <td className={t.type === "income" ? "text-green-600" : "text-red-600"}>
                  {t.type === "income" ? "+" : "-"}
                  {t.amount.toLocaleString("vi-VN")}
                </td>
                <td>{new Date(t.date).toLocaleDateString("vi-VN")}</td>
                <td className="hidden sm:table-cell">{t.note || "-"}</td>
                <td className="py-2 text-right">
                  <span className="inline-flex gap-2 text-gray-600">
                    <FaEdit className="cursor-pointer hover:text-blue-500" />
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

      {/* ---- Modal thêm giao dịch ---- */}
      {showAdd && (
        <AddTransactionModal
          onClose={() => setShowAdd(false)}
          onSuccess={() => dispatch(getTransactions(filters))} // 🆕 gọi lại dữ liệu
        />
      )}
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

export default TransactionPage;
