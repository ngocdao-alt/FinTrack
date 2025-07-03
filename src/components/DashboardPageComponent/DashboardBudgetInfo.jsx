import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getBudget } from "../../features/budgetSlice";
import formatCurrencyVN from "../../utils/formatCurrency";

const DashboardBudgetInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const budget = useSelector((state) => state.budget);

  useEffect(() => {
    const date = new Date();
    dispatch(getBudget({ month: date.getMonth(), year: date.getFullYear() }));
  }, []);

  useEffect(() => {
    console.log("Budget:", budget);
  }, [budget]);

  const spentPercentage =
    budget.amount > 0 ? Math.min((budget.spent / budget.amount) * 100, 100) : 0;

  return (
    <div
      className="
        w-full  my-3 flex justify-center bg-white rounded-lg border border-slate-200 shadow p-4
        "
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
            {formatCurrencyVN(budget.amount)} đ
          </span>

          <div className="relative w-[40%] h-3 bg-[#D1CDFB] rounded-full overflow-hidden">
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{
                width: `${budget.percentUsed}%`,
                backgroundColor: "#5D43DB",
              }}
            ></div>
          </div>

          <span
            className="
            font-semibold
            "
          >
            {budget.percentUsed}%
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
