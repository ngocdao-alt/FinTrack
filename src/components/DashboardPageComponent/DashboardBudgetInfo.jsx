import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getBudget } from "../../features/budgetSlice";
import formatCurrencyVN from "../../utils/formatCurrency";

const DashboardBudgetInfo = ({ className = "" }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const budget = useSelector((state) => state.budget);

  useEffect(() => {
    const date = new Date();
    const currentMonth = date.getMonth() + 1;
    const currentYear = date.getFullYear();

    dispatch(getBudget({ month: currentMonth, year: currentYear }));
  }, []);

  useEffect(() => {
    console.log("Budget:", budget);
  }, [budget]);

  return (
    <div
      className={`
        w-full ${className} my-3 flex justify-center bg-white rounded-lg border border-slate-200 shadow p-4
        lg:my-0 lg:mb-1
        `}
    >
      <div className="w-full flex-col">
        <h2
          className="
            mb-2 text-xl font-bold
            "
        >
          Budget
        </h2>

        <div
          className="
            w-full flex gap-3 items-center justify-center
            "
        >
          <span
            className="
            font-semibold
            "
          >
            {formatCurrencyVN(budget?.totalBudget || 0)} đ
          </span>

          <div className="relative w-[40%] h-3 bg-[#D1CDFB] rounded-full overflow-hidden">
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{
                width: `${budget.totalPercentUsed || 0}%`,
                backgroundColor: "#5D43DB",
              }}
            ></div>
          </div>

          <span
            className="
            font-semibold
            "
          >
            {budget.totalPercentUsed}%
          </span>
        </div>

        <div
          className="
                w-full mt-3 flex justify-center items-center gap-5
            "
        >
          <div className="flex gap-3 items-center">
            <div className="w-10 h-2 bg-[#5D43DB] rounded-full" />
            <span>Spent</span>
          </div>
          <div className="flex gap-3 items-center">
            <div className="w-10 h-2 bg-[#D1CDFB] rounded-full" />
            <span>Remain</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBudgetInfo;
