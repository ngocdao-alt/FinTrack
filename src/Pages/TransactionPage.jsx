import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getTransactions,
  deleteTransaction,
} from "../features/transactionSlice";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import getUsedCategories from "../thunks/getUsedCategories";
import formatCurrency from "../utils/formatCurrency";
import TransactionModal from "../components/TransactionModal";
import DetailTransaction from "../components/DetailTransaction";
import { ChevronDown } from "lucide-react";


const TransactionPage = () => {
  const dispatch = useDispatch();
  const { transactions, loading, total, page, totalPages } = useSelector(
    (s) => s.transaction
  );
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [detailTransaction, setDetailTransaction] = useState(null);
  const today = new Date();
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    month: String(today.getMonth() + 1),
    year: String(today.getFullYear()),
    keyword: "",
  });

  const { type, category, month, year, keyword } = filters;

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await dispatch(getUsedCategories());
      if (res.payload) setCategoryOptions(["All", ...res.payload]);
    };
    fetchCategories();
  }, [dispatch]);

  useEffect(() => {
    dispatch(getTransactions(filters));
  }, [dispatch, type, category, month, year, keyword]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value === "All" ? "" : value,
    }));
  };

  const handleLoadMore = async () => {
    if (page < totalPages) {
      await dispatch(getTransactions({ ...filters, page: page + 1 }));
    }
  };

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedTransaction(null);
    setShowModal(true);
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

  const typeOptions = ["All", "income", "expense"];
  const years = Array.from({ length: 8 }, (_, i) => String(2018 + i));

  const Select = ({ label, name, value, options, onChange, render }) => (
    <div className="relative">
      <label className="block text-md font-medium text-gray-600 mb-1">{label}</label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="appearance-none w-[90%] bg-white text-gray-400 px-3 py-4 pr-8 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          {options.map((opt) => (
            <option key={opt} value={opt === "All" ? "" : opt} className="bg-white text-black">
              {render ? render(opt) : opt}
            </option>
          ))}
        </select>
        {/* Mũi tên xanh */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center transform -translate-x-15">
          <ChevronDown className="text-indigo-500" size={18} />
        </div>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen w-full bg-[#F5F6FA] px-4 py-2">
      <div className="flex flex-col lg:flex-row justify-between gap-4 bg-[#F5F6FA] p-4 rounded-md flex-wrap">
        {/* FILTERS - bên trái */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-[3]">
          <Select
            label="Type"
            name="type"
            value={type}
            options={typeOptions}
            onChange={handleFilterChange}
            render={(o) =>
              o === "income" ? "Income" : o === "expense" ? "Expense" : o
            }
          />
          <Select
            label="Category"
            name="category"
            value={category}
            options={categoryOptions}
            onChange={handleFilterChange}
          />
          <Select
            label="Month"
            name="month"
            value={month}
            options={["All", ...Array.from({ length: 12 }, (_, i) => String(i + 1))]}
            onChange={handleFilterChange}
          />
          <Select
            label="Year"
            name="year"
            value={year}
            options={years}
            onChange={handleFilterChange}
          />
        </div>

        {/* SUMMARY - bên phải */}
        <div className="bg-white mt-8 rounded-md p-4 flex justify-between items-center flex-[2] min-w-[300px]">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-700 font-medium">Total income:</span>
              <span className="text-green-600 font-semibold text-right">
                +{income.toLocaleString("en-US")} đ
              </span>
            </div>
            <hr />
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-700 font-medium">Total expense:</span>
              <span className="text-red-600 font-semibold text-right">
                -{expense.toLocaleString("en-US")} đ
              </span>
            </div>
          </div>

          <div className="w-[1px] h-16 bg-gray-300 mx-4" />

          <div className="text-sm text-gray-700 whitespace-nowrap">
            <p className="font-medium">Total Transactions:</p>
            <p className="text-indigo-500 font-semibold text-right">{total} </p>
          </div>
        </div>
      </div>



      <div className="bg-white mt-6 rounded-md shadow p-4 overflow-x-auto">
        <div className="w-full flex justify-end">
          <button
            onClick={handleAdd}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm py-2 px-4 rounded w-fit flex items-center gap-2 cursor-pointer"
          >
            <FaPlus /> Add Transaction
          </button>
        </div>
        <table className="w-full text-left text-sm mt-4 md:text-base">
          <thead>
            <tr className="text-gray-600 border-b">
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th className="hidden sm:table-cell">Note</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No data to display
                </td>
              </tr>
            ) : (
              transactions.map((t, i) => (
                <tr
                  key={i}
                  className="border-b cursor-pointer hover:bg-gray-100 hover:opacity-80 transition duration-200"
                  onClick={() => setDetailTransaction(t)}
                >
                  <td>{t.category}</td>
                  <td
                    className={
                      t.type === "income" ? "text-green-600" : "text-red-600"
                    }
                  >
                    {t.type === "income" ? "+" : "-"}
                    {formatCurrency(Number(t.amount))} đ
                  </td>
                  <td>
                    {new Date(t.date).toLocaleDateString("en-GB")}
                  </td>
                  <td className="hidden sm:table-cell">{t.note || "-"}</td>
                  <td className="py-2 text-right">
                    <span className="inline-flex gap-2 text-gray-600">
                      <FaEdit
                        className="cursor-pointer hover:text-blue-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(t);
                        }}
                      />
                      <FaTrash
                        className="cursor-pointer hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(deleteTransaction(t._id));
                        }}
                      />
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="w-full">
        {totalPages > 1 && page < totalPages && (
          <div className="w-full flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="mt-6 p-3 rounded-full hover:bg-indigo-100 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span className="text-indigo-500 text-lg">Loading...</span>
              ) : (
                <ChevronDown size={40} className="text-indigo-600" />
              )}
            </button>
          </div>
        )}

      </div>


      {showModal && (
        <TransactionModal
          visible={true}
          onClose={() => setShowModal(false)}
          transaction={selectedTransaction}
        />
      )}

      {detailTransaction && (
        <DetailTransaction
          transaction={detailTransaction}
          onClose={() => setDetailTransaction(null)}
        />
      )}
    </div>
  );
};

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
        <option key={opt} value={opt === "All" ? "" : opt}>
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
        : `${color === "green" ? "+" : "-"}${value.toLocaleString("en-US")}`}
    </p>
  </div>
);

export default TransactionPage;
