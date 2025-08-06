import React from "react";

const SkeletonBox = ({ className = "" }) => (
  <div className={`bg-slate-200 shimmer rounded ${className}`} />
);

const BudgetPageLoading = () => {
  return (
    <section className="relative w-full px-2 py-4 flex flex-col gap-4 items-center sm:p-4 lg:p-6 xl:w-[90%] xl:mx-auto">
      {/* Title */}
      <SkeletonBox className="self-start w-32 h-8 dark:border dark:border-slate-700" />

      {/* Main content */}
      <div className="w-full flex flex-col gap-3 lg:grid lg:grid-cols-[65%_35%]">
        {/* Selector */}
        <section className="w-full flex justify-between gap-3 lg:order-2 lg:flex-col lg:gap-1 ">
          {/* Month */}
          <div className="flex-1 flex flex-col gap-2">
            <SkeletonBox className="w-20 h-5 dark:border dark:border-slate-700" />
            <SkeletonBox className="w-full h-10 dark:border dark:border-slate-700" />
          </div>
          {/* Year */}
          <div className="flex-1 flex flex-col gap-2">
            <SkeletonBox className="w-20 h-5 dark:border dark:border-slate-700" />
            <SkeletonBox className="w-full h-10 dark:border dark:border-slate-700" />
          </div>
          {/* Button */}
          <div className="flex-1 flex items-end">
            <SkeletonBox className="w-full h-10 dark:border dark:border-slate-700" />
          </div>
        </section>

        {/* Summary box */}
        <section className="w-full p-3 bg-white rounded flex items-center gap-2 sm:p-4 sm:gap-0 lg:order-1 dark:border dark:bg-[#252529] dark:border-slate-700">
          <div className="flex-1 flex flex-col gap-5 sm:gap-4 sm:p-3 md:gap-7">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-2 items-center md:gap-5">
                <SkeletonBox className="w-24 h-4 md:w-30 md:p-2 dark:border dark:border-slate-700" />
                <SkeletonBox className="w-24 h-4 md:w-30 md:p-2 dark:border dark:border-slate-700" />
              </div>
            ))}
          </div>

          <div className="flex-1 self-center flex flex-col items-center gap-4">
            {/* Circle placeholder */}
            <SkeletonBox className="w-28 h-28 rounded-full md:w-35 md:h-35 dark:border dark:border-slate-700" />

            {/* Legend (mobile 3 dưới, tablet trở lên: 5 bên phải) */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-2 ">
                  <SkeletonBox className="w-4 h-4 rounded-full bg-slate-300 dark:border dark:border-slate-700" />
                  <SkeletonBox className="w-16 h-4 dark:border dark:border-slate-700" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Categories */}
      <section className="w-full p-3 bg-white rounded flex flex-col gap-4 sm:p-4 lg:p-6 dark:bg-[#252529]">
        <SkeletonBox className="w-32 h-5 dark:border dark:border-slate-700" />
        <hr className="text-[#464646] h-1 w-full my-1" />

        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="w-full flex flex-col gap-2">
            <SkeletonBox className="w-1/2 h-4 dark:border dark:border-slate-700" />
            <div className="flex items-center gap-4">
              <SkeletonBox className="w-1/2 h-4 dark:border dark:border-slate-700" />
              <SkeletonBox className="w-1/3 h-4 dark:border dark:border-slate-700" />
              <SkeletonBox className="w-10 h-4 dark:border dark:border-slate-700" />
            </div>
            <hr className="text-[#A5A5A5] h-[1px] w-full dark:text-slate-700" />
          </div>
        ))}
      </section>
    </section>
  );
};

export default BudgetPageLoading;
