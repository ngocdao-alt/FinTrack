import React from "react";
import PieChart from "../Chart/PieChart";

const DashboardStat = () => {
  return (
    <div
      className="
        w-full my-3 mb-3 bg-white rounded-lg border border-slate-200 shadow p-4
        "
    >
      <h2
        className="
            mb-2 text-xl font-bold
            "
      >
        Stats
      </h2>
      <PieChart />
    </div>
  );
};

export default DashboardStat;
