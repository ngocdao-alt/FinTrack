import React from "react";
import PieChart from "../Chart/PieChart";

const DashboardStat = ({ className = "" }) => {
  return (
    <div
      className={`
        w-full ${className} flex flex-col my-3 mb-3 bg-white rounded-lg border border-slate-200 shadow p-4 
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

      <div className="w-full p-5 flex justify-center items-center sm:p-0">
        <div className="h-[250px] w-[80%] sm:w-[70%]  md:h-[200px] lg:h-[220px] lg:p-3 xl:h-[px]">
          <PieChart />
        </div>
      </div>
    </div>
  );
};

export default DashboardStat;
