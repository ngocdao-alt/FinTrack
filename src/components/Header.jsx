import React from 'react'
import logo from '../assets/img/logo.webp'
import { TfiMenuAlt } from "react-icons/tfi";

const Header = () => {
  return (
    <div 
        className='
            w-full h-20 px-6 flex justify-between items-center border border-slate-300
    '>
        <img 
            src={logo} 
            className='
                max-w-20
        '/>
        <TfiMenuAlt className='text-2xl text-[#514D73]'/>
    </div>
  )
}

export default Header
