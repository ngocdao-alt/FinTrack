import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactionsByMonth } from '../features/transactionSlice';
import { getBudget } from '../features/budgetSlice';
import DonutChart from '../components/Chart/DonutChart';

const StatPage = () => {
  const dispatch = useDispatch();

  const [month, setMonth] = useState(6); // Tháng 7 (index từ 0)
  const [year, setYear] = useState(2025);
  const [selectedDate, setSelectedDate] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const { totalBudget, categoryStats } = useSelector((state) => state.budget);

  useEffect(() => {
    const fetchData = async () => {
      const res = await dispatch(getTransactionsByMonth({
        month: month + 1,
        year
      }));

      if (res.payload?.data) {
        setTransactions(res.payload.data);
      }

      await dispatch(getBudget({ month: month + 1, year }));
    };
    fetchData();
  }, [month, year, dispatch]);

  const getDaysInMonth = (month, year) => {
    const days = [];
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= totalDays; i++) days.push(i);
    return { days, firstDay: (firstDay + 6) % 7, totalDays };
  };

  const { days, firstDay, totalDays } = getDaysInMonth(month, year);
  const budgetPerDay = totalBudget ? Math.floor(totalBudget / totalDays) : 0;

  const transactionsByDayMap = {};
  for (let i = 1; i <= totalDays; i++) {
    transactionsByDayMap[i] = [];
  }
  transactions.forEach((tx) => {
    const date = new Date(tx.date);
    if (date.getFullYear() === year && date.getMonth() === month) {
      const day = date.getDate();
      transactionsByDayMap[day].push(tx);
    }
  });

  const transactionsByDay = selectedDate ? transactionsByDayMap[selectedDate] : [];

  return (
<div className="flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6 w-full max-w-screen-2xl mx-auto md:h-[640px]">
  {/* Cột trái: Lịch */}
<div className="w-full md:w-[60%] bg-white rounded-xl shadow-md p-4 md:p-6 md:h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4">
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="border rounded px-2 py-1">
            {Array.from({ length: 12 }).map((_, idx) => (
              <option key={idx} value={idx}>Tháng {idx + 1}</option>
            ))}
          </select>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="border rounded px-2 py-1">
            {Array.from({ length: 10 }).map((_, idx) => {
              const y = 2020 + idx;
              return <option key={idx} value={y}>{y}</option>;
            })}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center font-medium text-gray-700 mb-2">
        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d, i) => <div key={i}>{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {Array.from({ length: firstDay }).map((_, i) => <div key={i}></div>)}
        {days.map((day, i) => {
          const dailyTransactions = transactionsByDayMap[day];
          const income = dailyTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
          const expense = dailyTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
          const net = income - expense;
          const spentFromBudget = net < 0 ? Math.abs(net) : 0;
          const percent = budgetPerDay ? (spentFromBudget / budgetPerDay) * 100 : 0;

          let bgColor = 'bg-gray-100 text-gray-800';
          if (totalBudget) {
            if (percent >= 100) bgColor = 'bg-red-100 text-red-800';
            else if (percent >= 80) bgColor = 'bg-yellow-100 text-yellow-800';
            else bgColor = 'bg-green-100 text-green-800';
          }

          return (
            <div
              key={i}
              onClick={() => setSelectedDate(day)}
              className={`cursor-pointer border rounded-md p-2 text-[11px] transition-all hover:scale-[1.02] ${bgColor}`}
            >
              <div className="font-semibold text-sm">{day}</div>
              <div className="truncate text-[10px] leading-tight max-w-full">
                {spentFromBudget.toLocaleString()}đ
              </div>
            </div>
          );
        })}
      </div>
    </div>

   {/* Cột phải: Giao dịch + Donut */}
<div className="w-full md:w-[40%] md:h-full flex flex-col gap-4">
 {/* Giao dịch ngày */}
    <div className="bg-white rounded-xl shadow-md p-4 flex-1 flex flex-col overflow-hidden">
      <h3 className="text-lg font-semibold mb-3">
        Giao dịch ngày {selectedDate ? `${selectedDate}/${month + 1}/${year}` : '(Chọn ngày)'}
      </h3>
      <div className="overflow-y-auto pr-2 flex-1">
      {selectedDate ? (
        <ul className="text-sm space-y-2">
          {transactionsByDay.length > 0 ? (
            transactionsByDay.map((tx) => (
              <li key={tx._id} className="flex justify-between border-b pb-1 text-gray-700">
                <div className="flex flex-col">
                  <span className="font-medium">{tx.category}</span>
                  <span className="text-xs text-gray-500">{tx.note}</span>
                </div>
                <span className={tx.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                  {tx.type === 'income' ? '+' : '-'}
                  {parseInt(tx.amount).toLocaleString()}đ
                </span>
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-500">Không có giao dịch.</p>
          )}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">Vui lòng chọn ngày.</p>
      )}
    </div>
  </div>

   {/* Donut Chart */}
    <div className="bg-white rounded-xl shadow-md p-4 flex-1 flex flex-col items-center justify-center">
      <h3 className="text-lg font-semibold mb-3">Thống kê theo danh mục</h3>
      <DonutChart categoryStats={categoryStats} totalBudget={totalBudget} />
    </div>

</div>
  </div>
);

};

export default StatPage;
