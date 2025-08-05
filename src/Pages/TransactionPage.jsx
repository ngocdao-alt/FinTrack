import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getTransactions,
  deleteTransaction,
  setShouldRefetch,
} from "../features/transactionSlice";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import getUsedCategories from "../thunks/getUsedCategories";
import formatCurrency from "../utils/formatCurrency";
import TransactionModal from "../components/TransactionModal";
import DetailTransaction from "../components/DetailTransaction";
import { ChevronDown } from "lucide-react";
import Shimmer from "../components/Loading/Shimmer";
import { debounce } from "lodash";

const TransactionPage = () => {
  const dispatch = useDispatch();
  const { transactions, loading, total, page, totalPages, shouldRefetch } =
    useSelector((s) => s.transaction);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [detailTransaction, setDetailTransaction] = useState(null);
  const today = new Date();
  const [rawKeyword, setRawKeyword] = useState("");
  const [rawCategory, setRawCategory] = useState("");

  const [filters, setFilters] = useState({
    type: "",
    category: "",
    month: String(today.getMonth() + 1),
    year: String(today.getFullYear()),
    keyword: "",
  });
  const debouncedSearch = useMemo(() =>
  debounce((keywordVal, categoryVal) => {
    setFilters((prev) => ({
      ...prev,
      keyword: keywordVal,
      category: categoryVal === "All" ? "" : categoryVal,
    }));
  }, 500), []
);

const handleKeywordChange = (e) => {
  const val = e.target.value;
  setRawKeyword(val);
  debouncedSearch(val, rawCategory);
};

const handleCategoryChange = (e) => {
  const val = e.target.value;
  setRawCategory(val);
  debouncedSearch(rawKeyword, val);
};

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

  useEffect(() => {
    if (shouldRefetch) {
      dispatch(getTransactions(filters));
      dispatch(setShouldRefetch(false));
    }
  }, [dispatch, shouldRefetch]);

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
      <label className="block text-md 2xl:text-lg 3xl:text-xl font-medium text-gray-600 mb-1 2xl:mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="appearance-none w-[90%] bg-white text-gray-400 px-3 py-4 2xl:px-4 2xl:py-5 3xl:px-5 3xl:py-6 pr-8 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer text-sm 2xl:text-base 3xl:text-lg"
        >
          {options.map((opt) => (
            <option
              key={opt}
              value={opt === "All" ? "" : opt}
              className="bg-white text-black"
            >
              {render ? render(opt) : opt}
            </option>
          ))}
        </select>
        {/* Mũi tên xanh */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center transform -translate-x-15">
          <ChevronDown className="text-indigo-500 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6" size={18} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#F5F6FA] px-4 py-4 2xl:px-6 2xl:py-6 3xl:px-8 3xl:py-8">
      <div className="flex flex-col lg:flex-row justify-between gap-4 2xl:gap-6 3xl:gap-8 bg-[#F5F6FA] p-4 2xl:p-6 3xl:p-8 rounded-md flex-wrap">
        {/* FILTERS - bên trái */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 2xl:gap-6 3xl:gap-8 flex-[3]">
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
            options={[
              "All",
              ...Array.from({ length: 12 }, (_, i) => String(i + 1)),
            ]}
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
        <div className="bg-white mt-8 rounded-md p-4 2xl:p-6 3xl:p-8 flex justify-between items-center flex-[2] min-w-[300px] 2xl:min-w-[400px] 3xl:min-w-[500px]">
          <div className="flex-1">
            <div className="flex justify-between text-sm 2xl:text-base 3xl:text-lg mb-2 2xl:mb-3">
              <span className="text-gray-700 font-medium">Total income:</span>
              <span className="text-green-600 font-semibold text-right">
                +{income.toLocaleString("en-US")} đ
              </span>
            </div>
            <hr />
            <div className="flex justify-between text-sm 2xl:text-base 3xl:text-lg mt-2 2xl:mt-3">
              <span className="text-gray-700 font-medium">Total expense:</span>
              <span className="text-red-600 font-semibold text-right">
                -{expense.toLocaleString("en-US")} đ
              </span>
            </div>
          </div>

          <div className="w-[1px] h-16 2xl:h-20 3xl:h-24 bg-gray-300 mx-4 2xl:mx-6" />

          <div className="text-sm 2xl:text-base 3xl:text-lg text-gray-700 whitespace-nowrap">
            <p className="font-medium">Total Transactions:</p>
            <p className="text-indigo-500 font-semibold text-right">{total} </p>
          </div>
        </div>
      </div>

      <div className="bg-white mt-6 2xl:mt-8 3xl:mt-10 rounded-md shadow p-4 2xl:p-8 3xl:p-10 overflow-x-auto">
       <div className="w-full flex flex-col sm:flex-row sm:items-center gap-3 2xl:gap-4 3xl:gap-6 mt-2">
  {/* Ô tìm kiếm */}
  <input
    type="text"
    placeholder="Search by note, category, amount..."
    value={rawKeyword}
    onChange={handleKeywordChange}
    className="w-full sm:w-1/2 px-4 py-2 2xl:px-5 2xl:py-3 3xl:px-6 3xl:py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm 2xl:text-base 3xl:text-lg"
  />

  {/* Select category */}
  <select
    name="category"
    value={rawCategory}
    onChange={handleCategoryChange}
    className="w-full sm:w-1/4 px-3 py-2 2xl:px-4 2xl:py-3 3xl:px-5 3xl:py-4 border border-gray-300 text-gray-600 text-sm 2xl:text-base 3xl:text-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
  >
    {categoryOptions.map((opt) => (
      <option key={opt} value={opt === "All" ? "" : opt}>
        {opt}
      </option>
    ))}
  </select>

  {/* Nút Add */}
  <div className="flex justify-end w-full sm:w-fit">
    <button
      onClick={handleAdd}
      className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm 2xl:text-base 3xl:text-lg py-2 px-4 2xl:py-3 2xl:px-6 3xl:py-4 3xl:px-8 rounded w-full sm:w-fit flex items-center gap-2 2xl:gap-3 cursor-pointer"
    >
      <FaPlus className="2xl:w-4 2xl:h-4 3xl:w-5 3xl:h-5" /> Add Transaction
    </button>
  </div>
</div>

        <table className="w-full text-left text-sm 2xl:text-base 3xl:text-lg mt-4 2xl:mt-6 3xl:mt-8">
          <thead>
            <tr className="text-gray-600 border-b-2">
              <th className="py-2 2xl:py-3 3xl:py-4">Category</th>
              <th className="py-2 2xl:py-3 3xl:py-4">Amount</th>
              <th className="py-2 2xl:py-3 3xl:py-4">Date</th>
              <th className="hidden sm:table-cell py-2 2xl:py-3 3xl:py-4">Note</th>
              <th className="py-2 2xl:py-3 3xl:py-4"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
  [...Array(6)].map((_, index) => (
    <tr key={index} className="relative h-12 2xl:h-16 3xl:h-20 overflow-hidden">
      <td colSpan="6" className="bg-gray-100 rounded-md relative">
        <Shimmer />
      </td>
    </tr>
  ))
) : transactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 2xl:py-6 3xl:py-8 text-sm 2xl:text-base 3xl:text-lg">
                  No data to display
                </td>
              </tr>
            ) : (
              transactions.map((t, i) => (
                <tr
                  key={i}
                  className="px-5 border-b border-slate-600 cursor-pointer hover:bg-gray-100 hover:opacity-80 transition duration-200"
                  onClick={() => setDetailTransaction(t)}
                >
                  <td className="py-3 2xl:py-4 3xl:py-5">{t.category}</td>
                  <td
                    className={`py-3 2xl:py-4 3xl:py-5 ${
                      t.type === "income" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}
                    {formatCurrency(Number(t.amount))} đ
                  </td>
                  <td className="py-3 2xl:py-4 3xl:py-5">{new Date(t.date).toLocaleDateString("en-GB")}</td>
                  <td className="hidden sm:table-cell py-3 2xl:py-4 3xl:py-5">{t.note || "-"}</td>
                  <td className="py-3 2xl:py-4 3xl:py-5 text-right pr-5">
                    <span className="inline-flex gap-2 2xl:gap-3 3xl:gap-4 text-gray-600">
                      <FaEdit
                        className="cursor-pointer hover:text-blue-500 2xl:w-4 2xl:h-4 3xl:w-5 3xl:h-5"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(t);
                        }}
                      />
                      <FaTrash
                        className="cursor-pointer hover:text-red-500 2xl:w-4 2xl:h-4 3xl:w-5 3xl:h-5"
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
              className="mt-6 2xl:mt-8 3xl:mt-10 p-3 2xl:p-4 3xl:p-5 rounded-full hover:bg-indigo-100 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span className="text-indigo-500 text-lg 2xl:text-xl 3xl:text-2xl">Loading...</span>
              ) : (
                <ChevronDown size={40} className="text-indigo-600 2xl:w-12 2xl:h-12 3xl:w-14 3xl:h-14" />
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
    <label className="block text-gray-600 mb-1 2xl:text-lg 3xl:text-xl 2xl:mb-2">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border rounded px-3 py-2 2xl:px-4 2xl:py-3 3xl:px-5 3xl:py-4 text-gray-600 text-sm 2xl:text-base 3xl:text-lg"
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
  <div className="flex-1 p-4 2xl:p-6 3xl:p-8 sm:text-center">
    <p className="text-gray-500 2xl:text-lg 3xl:text-xl">{title}</p>
    <p className={`text-${color}-600 font-bold text-xl 2xl:text-2xl 3xl:text-3xl`}>
      {isCount
        ? value
        : `${color === "green" ? "+" : "-"}${value.toLocaleString("en-US")}`}
    </p>
  </div>
);

export default TransactionPage;