import React from "react";

const RecentTransactionsLoading = ({ className = "" }) => {
  const getNumber = () => {
    if (window.innerWidth < 768) return 6;
    if (window.innerWidth >= 768 && window.innerWidth < 1536) return 6;
    if (window.innerWidth >= 1536 && window.innerWidth < 1800) return 8;
    if (window.innerWidth >= 1800) return 10;
  };
  return (
    <div
      className={`w-full ${className} p-4 bg-white rounded-lg border border-slate-200 shadow overflow md:p-5 dark:bg-[#2E2E33] dark:border-slate-700`}
    >
      <div className="flex justify-between items-center">
        <div className="h-6 w-1/3 shimmer rounded dark:border dark:border-slate-700"></div>
        <div className="h-4 w-16 shimmer rounded dark:border dark:border-slate-700"></div>
      </div>

      <hr className="w-full my-1 h-[1.5px] bg-[#A0A0A0] border-none 2xl:mb-2" />

      <div className="flex flex-col gap-5 md:px-5 mt-4 ">
        {Array.from({ length: getNumber() }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-3 justify-between items-start gap-3 text-sm"
          >
            <div className="h-4 w-3/4 shimmer rounded dark:bg-[#1a1a1d] dark:border dark:border-slate-700"></div>
            <div className="h-4 w-1/2 shimmer rounded dark:border dark:border-slate-700"></div>
            <div className="h-4 w-3/4 shimmer rounded dark:border dark:border-slate-700"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactionsLoading;
