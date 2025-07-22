import React, { useEffect } from "react";
import PieChart from "../Chart/PieChart";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import StatLoading from "../Loading/DashboardLoading/StatLoading";

const DashboardStat = ({ className = "" }) => {
  const navigate = useNavigate();
  const loading = useSelector((state) => state.stat.loading);

  useEffect(() => {
    console.log(loading);
  }, [loading]);

  if (loading) return <StatLoading className={className} />;

  return (
    <div
      className={`
        w-full ${className} flex flex-col bg-white rounded-lg border border-slate-200 shadow p-4 
        lg:mb-1 lg:my-0
        3xl:p-6
        `}
    >
      <h2
        onClick={() => navigate("/stat")}
        className="
            w-fit mb-2 text-xl font-bold hover:scale-105 transition-all cursor-pointer
            sm:mb-0
            3xl:text-2xl
          "
      >
        Stats
      </h2>

      <div className="h-full w-full p-5 flex justify-center items-center sm:p-0">
        <div className="w-full h-full sm:w-[80%] lg:w-[80%] lg:p-3 xl:w-[80%] 3xl:w-[70%]">
          <PieChart />
        </div>
      </div>
    </div>
  );
};

export default DashboardStat;
