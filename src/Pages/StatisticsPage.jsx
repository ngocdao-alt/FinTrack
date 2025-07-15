import React, { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import formatCurrency from "../utils/formatCurrency";
import dayjs from "dayjs";

const StatisticsPage = () => {
  const [month, setMonth] = useState("7");
  const [year, setYear] = useState("2025");

  const months = ["All", ...Array.from({ length: 12 }, (_, i) => String(i + 1))];
  const years = ["All", ...Array.from({ length: 8 }, (_, i) => String(2018 + i))];

  // Dữ liệu transactions từ Redux (TransactionPage)
  const transactions = useSelector((state) => state.transaction.transactions);

  // Giả lập kế hoạch chi tiêu (total) theo danh mục
  const planByCategory = {
    "Ăn uống": 10000000,
    "Giải trí": 5000000,
    "Mua sắm": 3000000,
    "Nhà cửa": 7000000,
    "Đầu tư": 1000000,
    "Hóa đơn": 2000000,
  };

//   Tính tổng đã chi (spent) theo danh mục từ dữ liệu thật
  const stats = useMemo(() => {
    const filtered = transactions.filter((t) => {
      if (t.type !== "expense") return false;
      const date = dayjs(t.date);
      return (
        (!month || date.month() + 1 === Number(month)) &&
        (!year || date.year() === Number(year))
      );
    });

    const group = {};
    filtered.forEach((t) => {
      const cat = t.category || "Khác";
      group[cat] = (group[cat] || 0) + Number(t.amount);
    });

    return Object.entries(group).map(([category, spent]) => ({
      category,
      spent,
      total: planByCategory[category] || spent, // nếu không có kế hoạch thì total = spent
    }));
  }, [transactions, month, year]);

  return (
    <div className="min-h-screen w-full bg-[#F5F6FA] px-6 py-6">
      {/* FILTERS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 text-gray-400">
        <Select
          label="Month"
          name="month"
          value={month}
          options={months}
          onChange={(e) => setMonth(e.target.value)}
        />
        <Select
          label="Year"
          name="year"
          value={year}
          options={years}
          onChange={(e) => setYear(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-md p-4 shadow">

        {stats.length === 0 ? (
          <p className="text-gray-500">Không có dữ liệu trong khoảng thời gian này.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="py-2 text-left">Mục giao dịch</th>
                <th className="text-right">Kế hoạch</th>
                <th className="text-right">Đã chi</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((item, idx) => {
                const percent = item.total
                  ? Math.min(100, Math.round((item.spent / item.total) * 100))
                  : 0;

                return (
                  <tr key={idx} className="border-b hover:bg-gray-50 transition">
                    <td className="py-2">{item.category}</td>
                    <td className="text-right">{formatCurrency(item.total)}</td>
                    <td className="text-right">{formatCurrency(item.spent)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <ProgressBar percent={percent} />
                        <span className="text-sm font-semibold">{percent}%</span>
                      </div>
                    </td>
                    <td>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const Select = ({ label, name, value, options, onChange }) => (
  <div className="w-full flex flex-col">
    <label className="block text-gray-700 mb-1 font-medium text-xl">{label}</label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="appearance-none w-full bg-white text-gray-700 px-4 py-3 pr-8 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
      >
        {options.map((opt, i) => (
          <option key={i} value={opt === "All" ? "" : opt}>
            {opt}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ChevronDown className="text-indigo-500" />
      </div>
    </div>
  </div>
);

const ProgressBar = ({ percent }) => {
  let gradient = "";

  if (percent <= 50) {
    gradient = "linear-gradient(to right, #00BF63, #C1FF72)";
  } else if (percent <= 70) {
    gradient = "linear-gradient(to right, #FFDE59, #FBF3AA)";
  } else {
    gradient = "linear-gradient(to right, #E70000, #FBB0B0)";
  }

  return (
    <div className="relative w-full h-3 rounded-full overflow-hidden bg-gray-200">
      <div
        className="absolute top-0 left-0 h-full"
        style={{ width: "100%", background: gradient }}
      />
      <div
        className="absolute top-0 right-0 h-full bg-white"
        style={{ width: `${100 - percent}%`, opacity: 0.7 }}
      />
    </div>
  );
};

export default StatisticsPage; 