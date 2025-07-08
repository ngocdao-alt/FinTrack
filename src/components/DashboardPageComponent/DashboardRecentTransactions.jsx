import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTransactions } from "../../features/transactionSlice";
import { getDashboard } from "../../features/dashboardSlice";
import formatDateToString from "../../utils/formatDateToString";
import formatCurrencyVN from "../../utils/formatCurrency";
import { useNavigate } from "react-router";

const DashboardRecentTransactions = ({ className = "" }) => {
  const transactions = useSelector((state) => state.transaction.transactions);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      getTransactions({
        type: "",
        category: "",
        keyword: "",
        month: "",
        year: "",
      })
    );
  }, []);

  useEffect(() => {
    console.log(transactions);
  }, [transactions]);

  const recentTransactions = transactions.slice(0, 10);

  return (
    <div
      className={`
            w-full ${className} mt-5 p-4 bg-white rounded-lg border border-slate-200
            md:p-5
            lg:mt-0
    `}
    >
      <div
        className="
                flex justify-between items-center
            "
      >
        <h2
          className="
                text-xl font-semibold
            "
        >
          Recent Transactions
        </h2>
        <span
          onClick={() => navigate("/transactions")}
          className="
                text-slate-500 underline text-sm cursor-pointer hover:text-slate-600
                md:text-base
            "
        >
          See all
        </span>
      </div>

      <hr className="w-full my-1 h-[1.5px] bg-[#A0A0A0] border-none" />

      <div className="relative max-h-64 overflow-hidden">
        <div className="flex flex-col gap-3 md:gap-4">
          {recentTransactions.map((item, index) => (
            <div
              key={item._id}
              className="grid grid-cols-3 justify-between items-start text-sm md:px-5"
            >
              <span>{item.category}</span>
              <span>{formatDateToString(item.date)}</span>
              <span
                className={`${
                  item.type === "expense" ? "text-[#FB2C36]" : "text-[#00C951]"
                }`}
              >
                {item.type === "expense" ? "-" : "+"}
                {formatCurrencyVN(item.amount)}
              </span>
            </div>
          ))}
        </div>
        <div className="absolute z-0 bottom-0 left-0 w-full h-15 bg-gradient-to-t from-white to-transparent" />
      </div>
    </div>
  );
};

export default DashboardRecentTransactions;
