// src/pages/Login.jsx
import { useState } from "react";
import phoneImg from '../assets/img/phoneImg.png';
import LogoF from '../assets/img/LogoF.png';

export default function Login() {
    const [showPwd, setShowPwd] = useState(false);
    const [isRegister, setIsRegister] = useState(false);

    return (
        <div 
            className="
                min-h-screen py-5 flex flex-col items-center justify-start bg-gradient-to-b from-white via-indigo-200 to-indigo-600
                sm:text-xl 
                lg:text-2xl lg:py-0
                
        ">
            {/* Logo */}
            <header className="w-full flex items-center gap-2 px-4 py-3">
                    <a href="#" className="flex items-start group">
                  <div className="flex items-center">
                    <img src={LogoF} alt="Landingpage logo" className="h-20 w-12 rounded-full mr-1" />
                    <div className="leading-tight">
                      <span className="text-xl font-semibold">Fin</span>
                      <br />
                      <span className="text-xl font-semibold">Track</span>
                    </div>
                  </div>
                </a>
            </header>
            
            {/* Phone illustration */}
            <img
                src={phoneImg} // đổi path tới hình bạn lưu
                alt="Phone mockup"
                className="
                    w-60 mt-4 select-none pointer-events-none self-center
                    sm:w-70
                    md:w-80
                    lg:mt-0
                "
            />

            {/* Form */}
            <form
                onSubmit={(e) => e.preventDefault()}
                className="
                    w-full max-w-sm flex flex-col gap-4 mt-8 px-4
                    lg:max-w-[60%] lg:mt-4
                    xl:max-w-[50%]
                    2xl:max-w-[40%]
                "
            >
                {/* Email */}
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full rounded-lg px-4 py-3 bg-white outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-400 placeholder-gray-500"
                />

                {/* Password + eye icon */}
                    {
                        isRegister && (
                            <input
                                type={showPwd ? "text" : "password"}
                                placeholder="Name"
                                className="w-full rounded-lg px-4 py-3 pr-12 bg-white outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-400 placeholder-gray-500"
                            />
                        )
                    }

                    <input
                        type={showPwd ? "text" : "password"}
                        placeholder="Password"
                        className="w-full rounded-lg px-4 py-3 pr-12 bg-white outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-400 placeholder-gray-500"
                    />

                {/* Register link */}
                <p className="text-sm text-gray-700">
                    You do not have an account yet ?{" "}
                    <span
                        onClick={() => setIsRegister(prev => !prev)}
                        className="font-semibold text-indigo-600 cursor-pointer hover:underline"
                    >
                        Register
                    </span>
                </p>

                {/* Login button */}
                <button
                    type="submit"
                    className="mt-2 w-full rounded-full bg-indigo-200 hover:bg-indigo-300 active:bg-indigo-400 py-3 text-gray-800 font-medium transition"
                >
                    {
                        isRegister ? "Register" : "Login"
                    }
                </button>
            </form>
        </div>
    );
}
