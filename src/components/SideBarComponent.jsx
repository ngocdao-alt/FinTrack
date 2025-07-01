import React from 'react'
import { AiFillHome, AiOutlineClose } from 'react-icons/ai'
import { MdSettings, MdCategory } from 'react-icons/md'
import { FaMoneyBillWave } from 'react-icons/fa'
import { RiDashboardFill } from 'react-icons/ri'
import { GiReceiveMoney } from 'react-icons/gi'
import { Link } from 'react-router-dom'

function SidebarComponent() {
  return (
    <div className="w-64 h-screen bg-gradient-to-b from-blue-600 to-indigo-300 text-white px-6 py-4 flex flex-col">
      {/* Nút Đóng */}
      <div className="flex justify-center mb-6">
        <AiOutlineClose className="cursor-pointer hover:text-red-300 text-xl sm:text-2xl md:text-3xl lg:text-3xl" />
      </div>

      {/* Mục Menu SideBar */}
      <ul className="flex flex-col gap-3 font-bold">
        <li className="group flex items-center gap-3 cursor-pointer text-base sm:text-lg md:text-xl lg:text-2xl transition duration-200 hover:bg-white/10 rounded-md px-3 py-2">
          <AiFillHome className="text-xl sm:text-2xl md:text-3xl lg:text-3xl transform transition group-hover:scale-110" />
          <Link to="/" className="transform transition group-hover:scale-105">Home</Link>
        </li>

        <li className="group flex items-center gap-3 cursor-pointer text-base sm:text-lg md:text-xl lg:text-2xl transition duration-200 hover:bg-white/10 rounded-md px-3 py-2">
          <RiDashboardFill className="text-xl sm:text-2xl md:text-3xl lg:text-3xl transform transition group-hover:scale-110" />
          <Link to="/dashboard" className="transform transition group-hover:scale-105">Control Panel</Link>
        </li>

        <li className="group flex items-center gap-3 cursor-pointer text-base sm:text-lg md:text-xl lg:text-2xl transition duration-200 hover:bg-white/10 rounded-md px-3 py-2">
          <FaMoneyBillWave className="text-xl sm:text-2xl md:text-3xl lg:text-3xl transform transition group-hover:scale-110" />
          <Link to="/transactions" className="transform transition group-hover:scale-105">Transaction</Link>
        </li>

        <li className="group flex items-center gap-3 cursor-pointer text-base sm:text-lg md:text-xl lg:text-2xl transition duration-200 hover:bg-white/10 rounded-md px-3 py-2">
          <MdCategory className="text-xl sm:text-2xl md:text-3xl lg:text-3xl transform transition group-hover:scale-110" />
          <Link to="/categories" className="transform transition group-hover:scale-105">Category</Link>
        </li>

        <li className="group flex items-center gap-3 cursor-pointer text-base sm:text-lg md:text-xl lg:text-2xl transition duration-200 hover:bg-white/10 rounded-md px-3 py-2">
          <GiReceiveMoney className="text-xl sm:text-2xl md:text-3xl lg:text-3xl transform transition group-hover:scale-110" />
          <Link to="/budget" className="transform transition group-hover:scale-105">Budget</Link>
        </li>

        <li className="group flex items-center gap-3 cursor-pointer text-base sm:text-lg md:text-xl lg:text-2xl transition duration-200 hover:bg-white/10 rounded-md px-3 py-2">
          <MdSettings className="text-xl sm:text-2xl md:text-3xl lg:text-3xl transform transition group-hover:scale-110" />
          <Link to="/settings" className="transform transition group-hover:scale-105">Setting</Link>
        </li>
      </ul>
    </div>
  )
}

export default SidebarComponent
