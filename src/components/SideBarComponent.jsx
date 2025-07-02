import React from 'react'
import { AiFillHome, AiOutlineClose } from 'react-icons/ai'
import { MdSettings, MdCategory } from 'react-icons/md'
import { FaMoneyBillWave } from 'react-icons/fa'
import { RiDashboardFill } from 'react-icons/ri'
import { GiReceiveMoney } from 'react-icons/gi'
import { Link } from 'react-router-dom'
import { IoMdCloseCircle } from "react-icons/io";

const navArr = [
  { icon: <AiFillHome />, label: 'Home', path: '/' },
  { icon: <RiDashboardFill />, label: 'Control Panel', path: '/dashboard' },
  { icon: <FaMoneyBillWave />, label: 'Transaction', path: '/transactions' },
  { icon: <MdCategory />, label: 'Category', path: '/categories' },
  { icon: <GiReceiveMoney />, label: 'Budget', path: '/budget' },
  { icon: <MdSettings />, label: 'Setting', path: '/settings' },
]

function SidebarComponent() {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-[#363B9D] to-indigo-300 text-white px-6 py-4 flex flex-col">
      
      {/* Nút Đóng */}
      <div className="w-fit my-5 self-center p-1 flex justify-center">
        <IoMdCloseCircle  className="cursor-pointer hover:text-red-300 text-4xl text-white transition-colors duration-200" />
      </div>

      {/* Mục Menu SideBar */}
      <ul className="w-fit mx-auto my-5 flex flex-col gap-5 font-bold">
        {navArr.map((item, index) => (
          <li
            key={index}
            className="group flex items-center gap-3 cursor-pointer text-2xl md:text-xl lg:text-2xl transition duration-200 hover:bg-white/10 rounded-md px-3 py-2"
          >
            <span className="text-3xl md:text-3xl lg:text-3xl transform transition group-hover:scale-110">
              {item.icon}
            </span>
            <Link
              to={item.path}
              className="transform transition group-hover:scale-105"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SidebarComponent
