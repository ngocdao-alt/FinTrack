import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTransactions } from "../../features/transactionSlice";
import { getDashboard } from "../../features/dashboardSlice";
import formatDateToString from "../../utils/formatDateToString";
import formatCurrencyVN from "../../utils/formatCurrency";

const DashboardRecentTransactions = () => {
  const transactions = useSelector((state) => state.transaction.transactions);
  const dispatch = useDispatch();

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

  const recentTransactions = transactions.slice(0, 6);

  return (
    <div
      className="
            w-full mt-5 p-4 bg-white rounded-lg border border-slate-200
    "
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
          className="
                text-slate-500 underline text-sm cursor-pointer hover:text-slate-600
            "
        >
          See all
        </span>
      </div>

      <hr className="w-full my-1 h-[1.5px] bg-[#A0A0A0] border-none" />

      <div className="relative max-h-64 overflow-hidden">
        <div className="flex flex-col gap-3">
          {recentTransactions.map((item) => (
            <>
              <div
                key={item._id}
                className="grid grid-cols-3 justify-between items-start text-sm"
              >
                <span>{item.category}</span>
                <span>{formatDateToString(item.date)}</span>
                <span>
                  {item.type === "expense" ? "-" : "+"}
                  {formatCurrencyVN(item.amount)}
                </span>
              </div>
              {/* <hr className="w-full mb-1 h-[1px] bg-[#A0A0A0] border-none" /> */}
            </>
          ))}
        </div>
        <div className="absolute z-50 bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white to-transparent" />
      </div>
    </div>
  );
};

export default DashboardRecentTransactions;
