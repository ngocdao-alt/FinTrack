import React, { useEffect } from "react";
import { getBudget } from "../../features/budgetSlice";
import { useDispatch, useSelector } from "react-redux";
import formatCurrencyVN from "../../utils/formatCurrency";
import { IoWarningOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

const BudgetByCategory = ({ categoryList, categoryStats }) => {
  const now = new Date();
  const { t, i18n } = useTranslation();

  const getCategoryMeta = (key) => {
    const found = categoryList.find((c) => c.key === key);
    return found
      ? {
          label: t(`categories.${found.key}`),
          icon: found.icon,
          color: found.color,
        }
      : { label: key, icon: "❓", color: "#ccc" };
  };

  const colorLevels = [
    {
      spent: "#00BF63",
      remaining: "#C1FF72",
    },
    {
      spent: "#FFDE59",
      remaining: "#FBF3AA",
    },
    {
      spent: "#FF3131",
      remaining: "#FBB0B0",
    },
  ];

  const getColorByUsage = (percent) => {
    if (percent <= 50) return colorLevels[0];
    if (percent <= 85) return colorLevels[1];
    return colorLevels[2];
  };

  return categoryStats?.length === 0 ? (
    <section className="w-full h-32 p-3 flex justify-center items-center bg-white rounded text-[#464646] text-lg font-semibold dark:bg-[#2E2E33] dark:text-white/87">
      <h2>{t("noData")}</h2>
    </section>
  ) : (
    <div
      className="
            w-full flex flex-col gap-3
            sm:px-2
    "
    >
      {categoryStats.map((item, index) => {
        const colors = getColorByUsage(item.percentUsed || 0);
        const remaining = +item.budgetedAmount - +item.spentAmount;
        const percent = item.percentUsed || 0;
        const padded =
          percent < 100 ? String(percent).padStart(2, "0") + "%" : "100%";

        return (
          <div
            key={item.category}
            className="w-full flex flex-col gap-2 sm:gap-2 lg:py-1 lg:gap-3"
          >
            {(() => {
              const { label, icon } = getCategoryMeta(item.category);
              return (
                <h2 className="flex items-center text-[#464646] text-sm font-semibold sm:text-base sm:px-5 lg:px-2 xl:px-5 xl:w-[90%] xl:mx-auto dark:text-white/83">
                  <span className="mr-2">{icon}</span>
                  {label}: {formatCurrencyVN(+item?.budgetedAmount)} đ
                  {item.percentUsed > 80 && (
                    <IoWarningOutline className="mx-1 text-red-500" />
                  )}
                </h2>
              );
            })()}
            <div className="flex justify-between items-center px-2 gap-3 sm:px-10 lg:px-4 lg:gap-5 xl:w-[85%] xl:mx-auto">
              <div className="flex flex-1 flex-col gap-2 items-start justify-center sm:gap-3 lg:grid lg:grid-cols-2 lg:flex-5">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div
                    className="p-2 rounded-full"
                    style={{ backgroundColor: colors.spent }}
                  ></div>
                  <span className="text-[#464646] text-[12px] sm:text-base dark:text-white/83">
                    {t("spent")}: {formatCurrencyVN(item.spentAmount)} đ
                  </span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <div
                    className="p-2 rounded-full"
                    style={{ backgroundColor: colors.remaining }}
                  ></div>
                  <span className="text-[#464646] text-[12px] sm:text-base dark:text-white/83">
                    {t("remaining")}:{" "}
                    {formatCurrencyVN(remaining < 0 ? 0 : remaining)} đ
                  </span>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-between gap-2 lg:flex-4">
                <div
                  style={{
                    backgroundColor: colors.remaining,
                  }}
                  className="relative w-full h-4 rounded-full overflow-hidden"
                >
                  <div
                    className="h-4 rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentUsed || 0}%`,
                      backgroundColor: colors.spent,
                    }}
                  ></div>
                </div>

                <span className="text-sm text-[#464646] sm:text-base dark:text-gray-400">
                  {padded}
                </span>
              </div>
            </div>

            <hr className="text-[#A5A5A5] h-1 w-full dark:text-slate-700" />
          </div>
        );
      })}
    </div>
  );
};

export default BudgetByCategory;
