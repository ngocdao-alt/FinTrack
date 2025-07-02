import React from "react";
import Header from "../components/Header";
import DashboardBalanceInfo from "../components/DashboardBalanceInfo";
import DashboardRecentTransactions from "../components/DashboardRecentTransactions";

const DashboardPage = () => {
  return (
    <div className="w-full min-h-screen">
      <Header />

      {/* Balance information */}
      <section
        className="
          w-full p-5 bg-[#F5F6FA] flex-col gap-3 text-[#464646]
      "
      >
        <DashboardBalanceInfo />

        <DashboardRecentTransactions />
      </section>
    </div>
  );
};

export default DashboardPage;
