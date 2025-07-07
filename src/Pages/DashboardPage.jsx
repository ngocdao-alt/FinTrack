import React from "react";
import Header from "../components/Header";
import DashboardBalanceInfo from "../components/DashboardPageComponent/DashboardBalanceInfo";
import DashboardRecentTransactions from "../components/DashboardPageComponent/DashboardRecentTransactions";
import DashboardBudgetInfo from "../components/DashboardPageComponent/DashboardBudgetInfo";
import DashboardStat from "../components/DashboardPageComponent/DashboardStat";
import DashboardOverview from "../components/DashboardPageComponent/DashboardOverview";

const DashboardPage = () => {
  return (
    <div className="w-full min-h-screen">
      {/* <Header />  */}

      {/* Balance information */}
      <section
        className="
          w-full max-h-[90vh] p-1 bg-[#F5F6FA] text-[#464646]
          flex flex-col gap-3 sm:p-3 md:px-8 md:py-3
          xl:grid xl:grid-cols-3 xl:grid-rows-6 xl:gap-3 xl:auto-rows-min xl:items-center 
        "
      >
        <DashboardBalanceInfo className="col-start-1 col-span-3 row-start-1 row-span-1" />

        <DashboardRecentTransactions className="col-start-3 col-span-1 row-start-2 row-span-3" />

        <DashboardBudgetInfo className="col-start-3 col-span-1 row-start-5 row-span-2" />

        <DashboardStat className="h-full col-start-1 col-span-2 row-start-2 row-span-3" />

        <DashboardOverview className="h-full col-start-1 col-span-2 row-start-5 row-span-2" />
      </section>
    </div>
  );
};

export default DashboardPage;
