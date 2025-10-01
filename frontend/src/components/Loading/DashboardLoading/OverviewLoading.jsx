import React from "react";
import Shimmer from "../Shimmer";

const OverviewLoading = ({ className = "" }) => {
  return (
    <div
      className={`
        w-full h-full ${className} flex flex-col mb-3 
        bg-white dark:bg-[#2E2E33]
        border border-slate-200 dark:border-slate-700 
        rounded-lg shadow p-4
        lg:my-0 lg:mb-1
        3xl:p-6
      `}
    >
      {/* Tiêu đề giả */}
      <div className="w-28 h-6 rounded bg-slate-200 dark:bg-[#4A4B4D] mb-4 sm:w-32 3xl:h-12" />

      {/* Biểu đồ giả */}
      <div
        className="relative w-full overflow-hidden rounded-md 
        h-[150px] md:h-[180px] md:w-[80%] md:self-center 
        lg:h-[200px] xl:h-[250px] 3xl:h-[460px] 
        bg-slate-200 dark:bg-[#4A4B4D]"
      >
        <Shimmer />
      </div>
    </div>
  );
};

export default OverviewLoading;
