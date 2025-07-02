import React, { useState } from "react";
import logo from "../assets/img/logo.webp";
import { TfiMenuAlt } from "react-icons/tfi";
import SidebarComponent from "./SideBarComponent";

const Header = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);

  return (
    <div
      className="
            w-full h-20 px-6 flex justify-between items-center border border-slate-300
    "
    >
      <img
        src={logo}
        className="
                max-w-20
        "
      />
      <TfiMenuAlt
        onClick={() => setToggleSidebar(true)}
        className="text-2xl text-[#514D73]
      "
      />
      {toggleSidebar && (
        <SidebarComponent setToggleSidebar={setToggleSidebar} />
      )}
    </div>
  );
};

export default Header;
