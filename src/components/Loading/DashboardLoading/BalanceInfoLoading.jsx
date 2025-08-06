import React from "react";

const SkeletonBox = ({ className = "" }) => (
  <div
    className={`
      shimmer rounded-lg bg-slate-200 dark:bg-[#3A3B3C]
      ${className}
    `}
  ></div>
);

const BalanceInfoLoading = ({ className = "" }) => {
  return (
    <section
      className={`w-full ${className} grid grid-cols-2 grid-rows-2 gap-2
        md:grid-cols-3 md:grid-rows-1 md:gap-3`}
    >
      {/* Balance Box Skeleton */}
      <SkeletonBox className="col-span-2 h-[80px] md:col-span-1 md:col-start-3 3xl:h-[100px]" />

      {/* Gross Income Skeleton */}
      <SkeletonBox className="h-[80px] md:col-start-1 md:row-start-1 3xl:h-[100px]" />

      {/* Total Expense Skeleton */}
      <SkeletonBox className="h-[80px] md:col-start-2 md:row-start-1 3xl:h-[100px]" />
    </section>
  );
};

export default BalanceInfoLoading;
