import React from "react";
import Shimmer from "../Shimmer";

const OverviewLoading = ({ className = "" }) => {
  return (
    <div
      className={`
        w-full h-full ${className} flex flex-col mb-3 bg-white rounded-lg border border-slate-200 shadow p-4
        lg:my-0 lg:mb-1
        3xl:p-6
      `}
    >
      {/* Tiêu đề */}
      <div className="w-28 h-6 rounded bg-slate-200 mb-4 sm:w-32 3xl:h-8" />

      {/* Biểu đồ giả */}
      <div className="relative w-full overflow-hidden rounded-md h-[150px] md:h-[180px] md:w-[80%] md:self-center lg:h-[200px] xl:h-[250px] 3xl:h-[460px] bg-slate-200">
        {/* Shimmer chạy đè lên */}
        <Shimmer />
      </div>
    </div>
  );
};

export default OverviewLoading;
