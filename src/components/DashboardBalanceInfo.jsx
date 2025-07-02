import React, { useEffect } from "react";
import { TfiWallet } from "react-icons/tfi";
import { FaLongArrowAltUp } from "react-icons/fa";
import { FaLongArrowAltDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getDashboard } from "../features/dashboardSlice";
import formatCurrencyVN from "../utils/formatCurrency";

const DashboardBalanceInfo = () => {
  const dashboard = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();

  useEffect(() => {
    const date = new Date();
    dispatch(
      getDashboard({ month: date.getMonth(), year: date.getFullYear() })
    );
  }, []);

  useEffect(() => {
    console.log(dashboard);
  }, [dashboard]);

  return (
    <section
      className="
        w-full flex-col gap-3
    "
    >
      <div
        className="
            flex-1 p-3 flex items-center justify-center gap-5 bg-[#767CFF] text-white rounded-lg border border-slate-200
        "
      >
        <TfiWallet className="text-[40px]" />
        <div className="flex flex-col font-semibold text-lg">
          <span>Balance</span>
          <span>{formatCurrencyVN(dashboard.balance)} đ</span>
        </div>
      </div>

      <div
        className="
            mt-2 flex gap-1
        "
      >
        <div
          className="
            flex-1 p-3 flex items-center justify-center gap-2 bg-white rounded-lg border border-slate-200
        "
        >
          <FaLongArrowAltUp className="text-3xl text-green-500" />
          <div className="flex flex-col  font-semibold">
            <span>Gross Income</span>
            <span>{formatCurrencyVN(dashboard.totalIncome)} đ</span>
          </div>
        </div>

        <div
          className="
            flex-1 p-3 flex items-center justify-center gap-2 bg-white rounded-lg border border-slate-200
        "
        >
          <FaLongArrowAltDown className="text-3xl text-red-500" />
          <div className="flex flex-col font-semibold">
            <span>Total Expense</span>
            <span>{formatCurrencyVN(dashboard.totalExpense)} đ</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardBalanceInfo;
