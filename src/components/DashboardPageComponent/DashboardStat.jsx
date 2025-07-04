import React from "react";
import PieChart from "../Chart/PieChart";

const DashboardStat = () => {
  return (
    <div
      className="
        w-full flex flex-col my-3 mb-3 bg-white rounded-lg border border-slate-200 shadow p-4
        "
    >
      <h2
        className="
            mb-2 text-xl font-bold 
            "
      >
        Stats
      </h2>

      <div className="my-1 self-center">
        <PieChart />
      </div>
    </div>
  );
};

export default DashboardStat;
