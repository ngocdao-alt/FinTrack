import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBudget } from "../../features/budgetSlice";
import formatCurrencyVN from "../../utils/formatCurrency";

const DashboardBudgetInfo = ({ className = "" }) => {
  const dispatch = useDispatch();
  const budget = useSelector((state) => state.budget);

  const total = budget?.totalBudget || 0;
  const percent = budget?.totalPercentUsed || 0;
  const spent = (total * percent) / 100;
  const remain = total - spent;

  useEffect(() => {
    const now = new Date();
    dispatch(getBudget({ month: now.getMonth() + 1, year: now.getFullYear() }));
  }, []);

  return (
    <div
      className={`w-full bg-white rounded-lg p-4 shadow ${className} 2xl:p-6`}
    >
      <div className="h-full flex flex-col gap-2 lg:gap-3 xl:gap-2">
        <h2 className="text-lg font-bold lg:text-xl 2xl:text-2xl">Budget</h2>

        <div className="h-full flex flex-col justify-around">
          {/* Tổng ngân sách */}
          <div className="text-base font-bold text-gray-600 text-end md:text-lg 2xl:text-2xl">
            {formatCurrencyVN(total)} đ
          </div>

          {/* Phần trăm + thanh tiến trình */}
          <div className="flex items-center gap-3 2xl:px-2">
            {/* Tỷ lệ phần trăm */}
            <span className="text-[14px] font-semibold text-gray-500 w-[35px] text-center md:text-base xl:text-[14px] 2xl:text-xl">
              {percent}%
            </span>

            {/* Thanh tiến trình */}
            <div className="relative flex-1 h-2 bg-purple-100 rounded-full md:h-3 xl:h-2 2xl:h-4  ">
              <div
                className="absolute top-0 left-0 h-2 bg-[#767CFF] rounded-full transition-all duration-300 md:h-3 xl:h-2 2xl:h-4"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          {/* Spent / Remain (mini legend) */}
          <div
            className="
            flex flex-col gap-3 text-[12px] text-gray-500 mt-2
            md:flex-row md:justify-center md:gap-5 md:text-[14px]
            lg:text-base lg:gap-6
            xl:text-[14px] xl:gap-3
          "
          >
            <div className="flex items-center gap-1">
              <div className="w-3 h-1.5 bg-[#767CFF] rounded-full" />
              <span className="flex gap-3">
                Spent: {formatCurrencyVN(spent)}đ
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-1.5 bg-purple-200 rounded-full" />
              <span>Remaining: {formatCurrencyVN(remain)}đ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBudgetInfo;
