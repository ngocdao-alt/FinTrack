import React from "react";
import PieChart from "../Chart/PieChart";

const DashboardStat = ({ className = "" }) => {
  return (
    <div
      className={`
        w-full ${className} flex flex-col my-3 mb-3 bg-white rounded-lg border border-slate-200 shadow p-4 
        lg:mb-1 lg:my-0
        `}
    >
      <h2
        className="
            mb-2 text-xl font-bold 
            sm:mb-0
          "
      >
        Stats
      </h2>

      <div className="h-full w-full p-5 flex justify-center items-center sm:p-0">
        <div className="h-full w-[80%] sm:w-[70%]  md:max-h-[200px] lg:max-h-[220px] lg:p-3 xl:h-[px]">
          <PieChart />
        </div>
      </div>
    </div>
  );
};

export default DashboardStat;
