import React from "react";
import Skeleton from "react-loading-skeleton";
import PieChartLoading from "./PieChartLoading";

const StatLoading = ({ className = "" }) => {
  return (
    <div
      className={`${className} flex flex-col bg-white rounded-lg border border-slate-200 shadow p-4 3xl:p-6`}
    >
      <div className="mb-4">
        <Skeleton width={100} height={24} />
      </div>
      <PieChartLoading className={className} />
    </div>
  );
};

export default StatLoading;
