import React, { useEffect } from "react";
import { getBudget } from "../../features/budgetSlice";
import { useDispatch, useSelector } from "react-redux";
import formatCurrencyVN from "../../utils/formatCurrency";
import { IoWarningOutline } from "react-icons/io5";

const BudgetByCategory = ({ categoryStats }) => {
  const dispatch = useDispatch();
  const now = new Date();

  const colorPairs = [
    { spent: "#008000", remaining: "#CCFF66" },
    { spent: "#FF0000", remaining: "#FFC0CB" },
    { spent: "#FFFF00", remaining: "#FFFACD" },
    { spent: "#0000FF", remaining: "#ADD8E6" },
    { spent: "#800080", remaining: "#E6CCFF" },
    { spent: "#FFA500", remaining: "#FFE4B5" },
    { spent: "#A52A2A", remaining: "#F4A460" },
    { spent: "#00CED1", remaining: "#AFEEEE" },
    { spent: "#FF69B4", remaining: "#FFD1DC" },
    { spent: "#708090", remaining: "#D3D3D3" },
    { spent: "#006400", remaining: "#98FB98" },
    { spent: "#B22222", remaining: "#F08080" },
    { spent: "#1E90FF", remaining: "#87CEFA" },
    { spent: "#DA70D6", remaining: "#F8E6F9" },
    { spent: "#FF8C00", remaining: "#FFDAB9" },
  ];

  return categoryStats?.length === 0 ? (
    <section className="w-full h-32 p-3 flex justify-center items-center bg-white rounded text-[#464646] text-lg font-semibold">
      <h2>No data to display.</h2>
    </section>
  ) : (
    <div
      className="
            w-full flex flex-col gap-3
    "
    >
      {categoryStats.map((item, index) => {
        const colors = colorPairs[index % colorPairs.length];
        const remaining = +item.budgetedAmount - +item.spentAmount;
        const percent = item.percentUsed || 0;
        const padded =
          percent < 100 ? String(percent).padStart(2, "0") + "%" : "100%";

        return (
          <div key={item.category} className="w-full flex flex-col gap-1">
            <h2 className="flex items-center text-[#464646] text-sm font-semibold ">
              {item.category}: {formatCurrencyVN(+item?.budgetedAmount)} đ
              {item.percentUsed > 80 && (
                <IoWarningOutline className="mx-1 text-red-500" />
              )}
            </h2>
            <div className="flex justify-between items-center px-2 gap-3">
              <div className="flex flex-1 flex-col gap-2 items-start justify-center">
                <div className="flex items-center gap-1">
                  <div
                    className="p-2 rounded-full"
                    style={{ backgroundColor: colors.spent }}
                  ></div>
                  <span className="text-[#464646] text-[12px]">
                    Spent: {formatCurrencyVN(item.spentAmount)} đ
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[12px]">
                  <div
                    className="p-2 rounded-full"
                    style={{ backgroundColor: colors.remaining }}
                  ></div>
                  <span className="text-[#464646]">
                    Remain: {formatCurrencyVN(remaining < 0 ? 0 : remaining)} đ
                  </span>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-between gap-2">
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

                <span className="text-sm text-[#464646]">{padded}</span>
              </div>
            </div>

            <hr className="text-[#A5A5A5] h-1 w-full" />
          </div>
        );
      })}
    </div>
  );
};

export default BudgetByCategory;
