import { useEffect, useState } from "react";
import phoneImg from "../assets/img/phoneImg.png";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../features/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import LogoF from "../assets/img/LogoF.png";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const [isRegister, setIsRegister] = useState(false);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    console.log(auth);
  }, [auth]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isRegister) {
        await dispatch(registerUser({ email, name, password })).unwrap();
        toast.success("Đăng kí thành công!");
        setIsRegister(false);
      } else {
        await dispatch(loginUser({ email, password })).unwrap();
        toast.success("Đăng nhập thành công!");
        navigate("/dashboard");
      }

      setEmail("");
      setName("");
      setPassword("");
    } catch (error) {
      toast.error("Đăng nhập/Đăng ký thất bại");
    }
  };

  return (
    <>
      {/* ================= MOBILE (<768px) ================= */}
      <div className="md:hidden min-h-screen py-5 flex flex-col items-center justify-start bg-gradient-to-b from-white via-indigo-200 to-indigo-600">
        {/* Logo */}
        <header className="w-full flex items-center gap-2 px-4 py-3">
          <a href="#" className="flex items-start group">
            <div className="flex items-center">
              <img src={LogoF} alt="Logo" className="h-20 w-12 rounded-full mr-1" />
              <div className="leading-tight">
                <span className="text-xl font-semibold">Fin</span>
                <br />
                <span className="text-xl font-semibold">Track</span>
              </div>
            </div>
          </a>
        </header>

        {/* Phone illustration */}
        <img src={phoneImg} alt="Phone" className="w-60 mt-4 select-none pointer-events-none" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4 mt-8 px-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-lg px-4 py-3 bg-white outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-400 placeholder-gray-500" required />

          {isRegister && (
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full rounded-lg px-4 py-3 bg-white outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-400 placeholder-gray-500" required />
          )}

          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full rounded-lg px-4 py-3 bg-white outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-400 placeholder-gray-500" required />

          <p className="text-sm text-gray-700 text-center">
            {isRegister ? "Already have an account? " : "Don't have an account yet ? "}
            <span onClick={() => setIsRegister((prev) => !prev)} className="font-semibold text-indigo-600 cursor-pointer hover:underline">
              {isRegister ? "Login" : "Register"}
            </span>
          </p>

          <button type="submit" className="mt-2 w-full rounded-full bg-indigo-200 hover:bg-indigo-300 active:bg-indigo-400 py-3 text-gray-800 font-medium transition">
            {isRegister ? "Register" : "Login"}
          </button>
        </form>
      </div>

      {/* ================= DESKTOP (>=768px) ================= */}
      <div className="hidden md:flex min-h-screen w-full relative">
        {/* Fixed logo top‑left */}
        <div className="absolute top-6 left-6 flex items-center z-20">
          <img src={LogoF} alt="Logo" className="h-16 w-12 rounded-full mr-2" />
          <div className="leading-tight text-black">
            <span className="text-2xl font-bold">Fin</span>
            <br />
            <span className="text-2xl font-bold">Track</span>
          </div>
        </div>

        {/* Left column: form */}
        <div className="w-1/2 flex flex-col items-center justify-center px-20">
          <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4 pt-12">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-lg px-4 py-3 bg-white outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-400 placeholder-gray-500" required />

            {isRegister && (
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full rounded-lg px-4 py-3 bg-white outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-400 placeholder-gray-500" required />
            )}

            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full rounded-lg px-4 py-3 bg-white outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-400 placeholder-gray-500" required />

            <p className="text-sm text-gray-700">
              {isRegister ? "Already have an account? " : "Don't have an account yet ? "}
              <span onClick={() => setIsRegister((prev) => !prev)} className="font-semibold text-indigo-600 cursor-pointer hover:underline">
                {isRegister ? "Login" : "Register"}
              </span>
            </p>

            <button type="submit" className="mt-2 w-full rounded-full bg-indigo-200 hover:bg-indigo-300 active:bg-indigo-400 py-3 text-gray-800 font-medium transition">
              {isRegister ? "Register" : "Login"}
            </button>
          </form>
        </div>

        {/* Right column: phone image on gradient */}
        <div className="w-1/2 bg-gradient-to-b from-indigo-600 via-indigo-200 to-white flex items-center justify-center">
          <img src={phoneImg} alt="Phone" className="w-[320px] lg:w-[380px] drop-shadow-2xl" />
        </div>
      </div>
    </>
  );
}
