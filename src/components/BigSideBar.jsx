import React, { useEffect, useState } from "react";
import { MdSpaceDashboard } from "react-icons/md";
import { FaWallet } from "react-icons/fa";
import { AiOutlineTransaction } from "react-icons/ai";
import { IoStatsChart } from "react-icons/io5";
import { MdSettings } from "react-icons/md";
import { Link, useLocation } from "react-router";
import { BsFillPeopleFill } from "react-icons/bs";
import { IoMdAnalytics } from "react-icons/io";
import { RxActivityLog } from "react-icons/rx";
import { useSelector } from "react-redux";

const BigSideBar = () => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const [navArr, setNavArr] = useState([]);

  useEffect(() => {
    if (user.role === "admin") {
      setNavArr([
        {
          icon: <MdSpaceDashboard />,
          label: "Dashboard",
          path: "/admin/dashboard",
        },
        {
          icon: <AiOutlineTransaction />,
          label: "Transaction",
          path: "/admin/transactions",
        },
        { icon: <BsFillPeopleFill />, label: "Users", path: "/admin/users" },
        {
          icon: <IoMdAnalytics />,
          label: "Analytics",
          path: "/admin/analytics",
        },
        { icon: <RxActivityLog />, label: "Logs", path: "/admin/logs" },
      ]);
    } else {
      setNavArr([
        { icon: <MdSpaceDashboard />, label: "Dashboard", path: "/dashboard" },
        {
          icon: <AiOutlineTransaction />,
          label: "Transaction",
          path: "/transactions",
        },
        { icon: <FaWallet />, label: "Budget", path: "/budget" },
        { icon: <IoStatsChart />, label: "Statistics", path: "/stat" },
        { icon: <MdSettings />, label: "Setting", path: "/settings" },
      ]);
    }
  }, [user]);

  return (
    <div className="w-full p-6 flex flex-col gap-0 text-[#464646] font-bold">
      {navArr.map((item, index) => {
        const isActive = location.pathname === item.path;
        const isAdmin = user.role === "admin";

        const activeGradient = isAdmin
          ? "bg-gradient-to-r from-sky-600 to-sky-300 text-white"
          : "bg-gradient-to-r from-[#5D43DB] to-[#A596E7] text-white";

        return (
          <div
            key={index}
            className={`group p-3 flex items-center gap-3 cursor-pointer rounded-lg 3xl:p-4 ${
              isActive ? activeGradient : "bg-white"
            }`}
          >
            <span className="text-3xl transform transition group-hover:scale-110 3xl:text-4xl">
              {item.icon}
            </span>
            <Link
              to={item.path}
              className="transform transition group-hover:scale-105 3xl:text-xl"
            >
              {item.label}
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default BigSideBar;
