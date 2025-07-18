import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactions } from '../features/transactionSlice';
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
      const res = await dispatch(getTransactions({
        month: month + 1,
        year,
        type: '',
        category: '',
        keyword: '',
        page: 1
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

  const formatDateToYMD = (date) => new Date(date).toLocaleDateString("en-CA");

  const spendingByDate = {};
  transactions.forEach((tx) => {
    const date = new Date(tx.date);
    if (date.getFullYear() === year && date.getMonth() === month && tx.type === 'expense') {
      const day = date.getDate();
      spendingByDate[day] = (spendingByDate[day] || 0) + parseInt(tx.amount);
    }
  });

  const transactionsByDay = transactions.filter((tx) => {
    if (!selectedDate) return false;
    const txDate = formatDateToYMD(tx.date);
    const clickedDate = formatDateToYMD(new Date(year, month, selectedDate));
    return txDate === clickedDate;
  
  });
  console.log("✅ categoryStats:", categoryStats);


  return (
    <div className="flex gap-6 p-6 w-full">
      {/* Lịch bên trái */}
      <div className="w-[60%] bg-white rounded-xl shadow-md p-6">
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
            const spent = spendingByDate[day] || 0;
            const percent = budgetPerDay ? (spent / budgetPerDay) * 100 : 0;

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
                className={`cursor-pointer border rounded-md p-2 text-xs transition-all hover:scale-[1.02] ${bgColor}`}
              >
                <div className="font-medium">{day}</div>
                <div>{spent.toLocaleString()}đ</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-[40%] flex flex-col gap-4 h-[600px]">
  {/* Giao dịch ngày */}
  <div className="flex-1 basis-1/2 bg-white rounded-xl shadow-md p-4 overflow-hidden">
    <h3 className="text-lg font-semibold mb-3">
      Giao dịch ngày {selectedDate ? `${selectedDate}/${month + 1}/${year}` : '(Chọn ngày)'}
    </h3>
    <div className="max-h-[200px] overflow-y-auto pr-2">
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

  {/* Biểu đồ donut */}
  <div className="flex-1 basis-1/2 bg-white rounded-xl shadow-md p-4 overflow-hidden flex flex-col items-center justify-center">
    <h3 className="text-lg font-semibold mb-3">Thống kê theo danh mục</h3>
    <DonutChart categoryStats={categoryStats} totalBudget={totalBudget} />
  </div>
</div>

    </div>
  );
};

export default StatPage;
