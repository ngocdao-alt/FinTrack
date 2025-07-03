import React from "react";
import Header from "../components/Header";
import DashboardBalanceInfo from "../components/DashboardPageComponent/DashboardBalanceInfo";
import DashboardRecentTransactions from "../components/DashboardPageComponent/DashboardRecentTransactions";
import DashboardBudgetInfo from "../components/DashboardPageComponent/DashboardBudgetInfo";
import DashboardStat from "../components/DashboardPageComponent/DashboardStat";

const DashboardPage = () => {
  return (
    <div className="w-full min-h-screen">
      {/* <Header />  */}

      {/* Balance information */}
      <section
        className="
          w-full p-5 bg-[#F5F6FA] flex-col gap-3 text-[#464646]
      "
      >
        <DashboardBalanceInfo />

        <DashboardRecentTransactions />

        <DashboardBudgetInfo />
      </section>
    </div>
  );
};

export default DashboardPage;
