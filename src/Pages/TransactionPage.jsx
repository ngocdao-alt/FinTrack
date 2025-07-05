import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getTransactions,
  deleteTransaction,
} from "../features/transactionSlice";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import getUsedCategories from "../thunks/getUsedCategories";

const TransactionPage = () => {
  const dispatch = useDispatch();
  const { transactions, loading, total, page, totalPages } = useSelector(
    (s) => s.transaction
  );
  const [categoryOptions, setCategoryOptions] = useState([]);

  const today = new Date();
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    month: "",
    year: String(today.getFullYear()),
    keyword: "",
  });

  const { type, category, month, year, keyword } = filters;

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await dispatch(getUsedCategories());
      if (res.payload) setCategoryOptions(["Tất cả", ...res.payload]);
    };
    fetchCategories();
  }, [dispatch]);

  useEffect(() => {
    dispatch(getTransactions(filters));
  }, [
    dispatch,
    filters.type,
    filters.category,
    filters.month,
    filters.year,
    filters.keyword,
  ]);

  useEffect(() => {
    console.log(page);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value === "Tất cả" ? "" : value,
    }));
  };

  const handleLoadMore = async () => {
    if (page < totalPages) {
      await dispatch(getTransactions({ ...filters, page: page + 1 }));
    }
  };

  const { income, expense } = useMemo(() => {
    let income = 0,
      expense = 0;
    transactions.forEach((t) => {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    });
    return { income, expense };
  }, [transactions]);

  const typeOptions = ["Tất cả", "income", "expense"];
  const years = Array.from({ length: 8 }, (_, i) => 2018 + i);

  return (
    <div className="min-h-screen w-full bg-[#f5f6fa] px-4 py-2">
      <h1 className="text-3xl font-bold mb-4">Giao dịch</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-4 rounded-md shadow">
        <Select
          label="Loại"
          name="type"
          value={type}
          options={typeOptions}
          onChange={handleFilterChange}
          render={(o) => (o === "income" ? "Thu" : o === "expense" ? "Chi" : o)}
        />
        <Select
          label="Mục giao dịch"
          name="category"
          value={category}
          options={categoryOptions}
          onChange={handleFilterChange}
        />
        <Select
          label="Tháng"
          name="month"
          value={month}
          options={["Tất cả", ...Array.from({ length: 12 }, (_, i) => i + 1)]}
          onChange={handleFilterChange}
        />
        <Select
          label="Năm"
          name="year"
          value={year}
          options={years}
          onChange={handleFilterChange}
        />
      </div>

      <div className="bg-white mt-6 rounded-md shadow flex flex-col divide-y sm:flex-row sm:divide-y-0 sm:divide-x">
        <Summary title="Tổng thu nhập" value={income} color="green" />
        <Summary title="Tổng chi tiêu" value={expense} color="red" />
        <Summary
          title="Số lượng giao dịch"
          value={total}
          color="blue"
          isCount
        />
      </div>

      <div className="flex justify-end mt-6 mb-2">
        <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm py-2 px-4 rounded w-fit sm:w-auto flex items-center gap-2">
          <FaPlus /> Thêm giao dịch
        </button>
      </div>

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
            transactions.map((t, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="hidden sm:table-cell py-2">
                  {t.type === "income" ? "Thu" : "Chi"}
                </td>
                <td>{t.category}</td>
                <td
                  className={
                    t.type === "income" ? "text-green-600" : "text-red-600"
                  }
                >
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

      {totalPages > 1 && page < totalPages && (
        <div className="w-full flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="mt-4 py-2 px-4 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

/* Sub components */
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

const Summary = ({ title, value, color, isCount = false }) => (
  <div className="flex-1 p-4 sm:text-center">
    <p className="text-gray-500">{title}</p>
    <p className={`text-${color}-600 font-bold text-xl`}>
      {isCount
        ? value
        : `${color === "green" ? "+" : "-"}${value.toLocaleString("vi-VN")}`}
    </p>
  </div>
);

export default TransactionPage;
