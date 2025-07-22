import React from "react";
import { MdSpaceDashboard } from "react-icons/md";
import { FaWallet } from "react-icons/fa";
import { AiOutlineTransaction } from "react-icons/ai";
import { IoStatsChart } from "react-icons/io5";
import { MdSettings } from "react-icons/md";
import { Link, useLocation } from "react-router";

const BigSideBar = () => {
  const location = useLocation();

  const navArr = [
    { icon: <MdSpaceDashboard />, label: "Dashboard", path: "/dashboard" },
    {
      icon: <AiOutlineTransaction />,
      label: "Transaction",
      path: "/transactions",
    },
    { icon: <FaWallet />, label: "Budget", path: "/budget" },
    { icon: <IoStatsChart />, label: "Statistics", path: "/stat" },
    { icon: <MdSettings />, label: "Setting", path: "/settings" },
  ];

  return (
    <div className="w-full p-6 flex flex-col gap-0 text-[#464646] font-bold">
      {navArr.map((item, index) => (
        <div
          key={index}
          className={`
                    group p-3 flex items-center gap-3 cursor-pointer rounded-lg 3xl:p-4
                    ${
                      location.pathname === item.path
                        ? "bg-gradient-to-r from-[#5D43DB] to-[#A596E7] text-white"
                        : "bg-white"
                    }
                `}
        >
          <span
            className="
              text-3xl transform transition group-hover:scale-110 3xl:text-4xl
            "
          >
            {item.icon}
          </span>
          <Link
            to={item.path}
            className="
                transform transition group-hover:scale-105 3xl:text-xl
              "
          >
            {item.label}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default BigSideBar;
