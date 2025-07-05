import React, { useEffect, useState } from "react";
import logo from "../assets/img/logo.webp";
import { TfiMenuAlt } from "react-icons/tfi";
import SidebarComponent from "./SideBarComponent";

const Header = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 1024) setToggleSidebar(true);
  }, [window.innerWidth]);

  return (
    <div
      className="
          relative w-full h-20 px-6 flex justify-between items-center border border-slate-300
          sm:h-25 sm:px-10
          md:px-15
          lg:px-5 lg:pb-3
    "
    >
      <img
        src={logo}
        className="
          max-w-20
          sm:max-w-25
          md:max-w-27
        "
      />
      <TfiMenuAlt
        onClick={() => setToggleSidebar(true)}
        className="
          text-2xl text-[#514D73]
          sm:text-[28px]
          md:text-[30px]
          lg:hidden
      "
      />
      {toggleSidebar && (
        <SidebarComponent setToggleSidebar={setToggleSidebar} />
      )}
    </div>
  );
};

export default Header;
