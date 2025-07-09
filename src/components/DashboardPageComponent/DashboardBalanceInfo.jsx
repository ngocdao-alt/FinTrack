import React, { useEffect } from "react";
import { TfiWallet } from "react-icons/tfi";
import { FaLongArrowAltUp } from "react-icons/fa";
import { FaLongArrowAltDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getDashboard } from "../../features/dashboardSlice";
import formatCurrencyVN from "../../utils/formatCurrency";

const DashboardBalanceInfo = ({ className = "" }) => {
  const dashboard = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();

  useEffect(() => {
    const date = new Date();
    dispatch(
      getDashboard({ month: date.getMonth() + 1, year: date.getFullYear() })
    );
  }, []);

  useEffect(() => {
    console.log(dashboard);
  }, [dashboard]);

  return (
    <section
      className={`
        w-full ${className} grid grid-cols-2 grid-rows-2 gap-2
        md:grid-cols-3 md:grid-rows-1 md:gap-3
    `}
    >
      {/* Balance Box */}
      <div
        className="
          col-span-2 p-3 flex items-center justify-center gap-5 bg-[#767CFF] text-white rounded-lg border border-slate-200 shadow
          md:col-span-1 md:col-start-3
      "
      >
        <TfiWallet className="text-[40px] md:text-4xl" />
        <div className="flex flex-col font-semibold text-base">
          <span>Balance</span>
          <span>{formatCurrencyVN(dashboard?.balance)} đ</span>
        </div>
      </div>

      {/* Gross Income */}
      <div
        className="
          p-3 flex items-center justify-center gap-2 bg-white rounded-lg border border-slate-200
          md:col-start-1 md:row-start-1
      "
      >
        <FaLongArrowAltUp className="text-3xl text-green-500 md:text-4xl" />
        <div className="flex flex-col font-semibold text-sm md:text-base">
          <span>Gross Income</span>
          <span>{formatCurrencyVN(dashboard?.totalIncome)} đ</span>
        </div>
      </div>

      {/* Total Expense */}
      <div
        className="
          p-3 flex items-center justify-center gap-2 bg-white rounded-lg border border-slate-200
          md:col-start-2 md:row-start-1
      "
      >
        <FaLongArrowAltDown className="text-3xl text-red-500" />
        <div className="flex flex-col font-semibold text-sm md:text-base">
          <span>Total Expense</span>
          <span>{formatCurrencyVN(dashboard?.totalExpense)} đ</span>
        </div>
      </div>
    </section>
  );
};

export default DashboardBalanceInfo;
