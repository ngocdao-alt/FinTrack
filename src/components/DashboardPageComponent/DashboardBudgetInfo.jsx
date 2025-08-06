import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBudget } from "../../features/budgetSlice";
import formatCurrencyVN from "../../utils/formatCurrency";
import { useNavigate } from "react-router";
import ShortBudgetLoading from "../Loading/DashboardLoading/ShortBudgetLoading";
import { useTranslation } from "react-i18next";

const DashboardBudgetInfo = ({ className = "" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const budget = useSelector((state) => state.budget);
  const loading = useSelector((state) => state.budget.loading);

  const total = budget?.totalBudget || 0;
  const percent = budget?.totalPercentUsed || 0;
  const spent = (total * percent) / 100;
  const remain = total - spent;

  useEffect(() => {
    const now = new Date();
    dispatch(getBudget({ month: now.getMonth() + 1, year: now.getFullYear() }));
  }, []);

  if (loading) return <ShortBudgetLoading className={className} />;

  return (
    <div
      className={`w-full bg-white rounded-lg p-4 shadow ${className} 3xl:p-6 dark:bg-[#2E2E33] dark:text-white/90 dark:border-slate-700 dark:border`}
    >
      <div className="h-full flex flex-col gap-2 lg:gap-3 xl:gap-2">
        <h2
          onClick={() => navigate("/budget")}
          className="
            w-fit text-lg font-bold hover:scale-105 transition-all cursor-pointer lg:text-xl 3xl:text-2xl
        "
        >
          {t("budget")}
        </h2>

        <div className="h-full flex flex-col justify-around md:w-[80%] md:mx-auto lg:w-[75%] xl:w-full">
          {/* Tổng ngân sách */}
          <div className="text-base font-bold text-gray-600 text-end md:text-lg 3xl:text-xl dark:text-white/80">
            {formatCurrencyVN(total)} đ
          </div>

          {/* Phần trăm + thanh tiến trình */}
          <div className="flex items-center gap-3">
            {/* Tỷ lệ phần trăm */}
            <span className="text-[14px] font-semibold text-gray-500 w-[35px] text-center md:text-base xl:text-[14px] 3xl:text-lg dark:text-white/80">
              {percent}%
            </span>

            {/* Thanh tiến trình */}
            <div className="relative flex-1 h-2 bg-purple-100 rounded-full md:h-3 xl:h-2 3xl:h-3.5">
              <div
                className="absolute top-0 left-0 h-2 bg-[#767CFF] rounded-full transition-all duration-300 md:h-3 xl:h-2 3xl:h-3.5"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          {/* Spent / Remain (mini legend) */}
          <div
            className="
            flex flex-col gap-3 text-[12px] text-gray-500 mt-2 px-2 dark:text-white/80
            md:px-0 md:flex-row md:justify-center md:gap-5 md:text-[14px]
            lg:text-base lg:gap-6
            xl:text-[14px] xl:gap-3
            3xl:gap-6 3xl:text-base
          "
          >
            <div className="flex items-center gap-1">
              <div className="w-3 h-1.5 bg-[#767CFF] rounded-full" />
              <span className="flex gap-3">
                {t("spent")}: {formatCurrencyVN(spent)}đ
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-1.5 bg-purple-200 rounded-full" />
              <span>
                {t("remaining")}: {formatCurrencyVN(remain)}đ
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBudgetInfo;
