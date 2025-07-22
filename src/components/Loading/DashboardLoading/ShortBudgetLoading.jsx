import React from "react";
import clsx from "clsx";

const ShortBudgetLoading = ({ className = "" }) => {
  return (
    <div
      className={`w-full ${className} bg-white rounded-lg p-4 shadow 3xl:p-6`}
    >
      <div className="h-full flex flex-col gap-2 lg:gap-3 xl:gap-2">
        {/* Title skeleton */}
        <div className="w-[120px] h-6 bg-gray-200 rounded shimmer lg:h-7 3xl:h-8" />

        <div className="h-full flex flex-col justify-around md:w-[80%] md:mx-auto lg:w-[75%] xl:w-full">
          {/* Tổng ngân sách */}
          <div className="h-5 w-[100px] bg-gray-200 rounded self-end shimmer md:h-6 3xl:h-7" />

          {/* Thanh tiến trình */}
          <div className="flex items-center gap-3 mt-3">
            {/* Tỷ lệ phần trăm */}
            <div className="h-5 w-[35px] bg-gray-200 rounded shimmer md:h-6 3xl:h-7" />

            {/* Progress bar */}
            <div className="relative flex-1 h-2 bg-purple-100 rounded-full md:h-3 xl:h-2 3xl:h-3.5 overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-[70%] bg-gray-300 rounded-full shimmer" />
            </div>
          </div>

          {/* Mini legend */}
          <div
            className="
          flex flex-col gap-3 mt-4 px-2
          md:px-0 md:flex-row md:justify-center md:gap-5
          xl:gap-3 3xl:gap-6
        "
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-1.5 bg-[#767CFF] rounded-full" />
              <div className="h-4 w-[80px] bg-gray-200 rounded shimmer" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1.5 bg-purple-200 rounded-full" />
              <div className="h-4 w-[80px] bg-gray-200 rounded shimmer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortBudgetLoading;
