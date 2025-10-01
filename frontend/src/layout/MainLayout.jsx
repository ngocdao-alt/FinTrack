import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = ({ header, sidebar }) => {
  return (
    <div className="h-screen w-full overflow-hidden flex flex-col">
      <header className="h-fit bg-white shadow flex items-center z-20">
        {header}
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside
          className="
          hidden lg:block w-[220px] h-full bg-white shadow z-10 
          2xl:w-[250px] 
          3xl:w-[320px] 
        "
        >
          {sidebar}
        </aside>

        <main className="flex-1 overflow-y-auto p-2 bg-[#f5f6fa] xl:p-0 dark:bg-[#35363A]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
