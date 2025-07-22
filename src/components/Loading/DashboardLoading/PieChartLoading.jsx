import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useWindowWidth from "../../../utils/useWindowWidth";

const PieChartLoading = ({ className = "" }) => {
  const shimmerColors = ["#5D43DB", "#D1CDFB", "#4ade80", "#60a5fa", "#facc15"];
  const width = useWindowWidth();
  const isMobile = width < 640;

  const legendsToShow = isMobile ? 3 : 5;

  return (
    <div
      className={`w-full h-full ${className} flex flex-col gap-4 animate-pulse items-center justify-center sm:w-[80%] sm:flex-row sm:self-center lg:gap-10 3xl:gap-20`}
    >
      {/* Shimmer circle */}
      <div className="w-40 h-40 sm:w-50 sm:h-50 rounded-full bg-gray-200 lg:w-40 lg:h-40 3xl:w-50 3xl:h-50" />

      {/* Legend shimmer */}
      <div
        className={`
          flex ${isMobile ? "flex-row" : "flex-col"}
          ${isMobile ? "justify-around w-full mt-4" : "gap-4 ml-6"}
        `}
      >
        {shimmerColors.slice(0, legendsToShow).map((color, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: color }}
            />
            <Skeleton width={60} height={14} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChartLoading;
