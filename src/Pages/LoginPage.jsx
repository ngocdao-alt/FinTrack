import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);

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

      // Mock functionality for demo
      if (isRegister) {
        alert("Đăng kí thành công!");
        setIsRegister(false);
      } else {
        alert("Đăng nhập thành công!");
      }

      setEmail("");
      setName("");
      setPassword("");
    } catch (error) {
      toast.error("Đăng nhập/Đăng ký thất bại");
      alert("Đăng nhập/Đăng ký thất bại");
    }
  };

  return (
    <>
      {/* ===== MOBILE < 1024px ===== */}
      <div className="lg:hidden min-h-screen flex flex-col bg-gradient-to-b from-white via-indigo-200 to-indigo-600">
        {/* Logo */}
        <header className="w-full flex items-center gap-2 px-4 py-3">
          <a href="#" className="flex items-start group">
            <div className="flex items-center">
              <img src={LogoF} alt="Logo" className="h-20 w-12 rounded-full mr-1" />
              <div className="leading-tight">
                <span className="text-xl font-Roboto">Fin</span>
                <br />
                <span className="text-xl font-Roboto">Track</span>
              </div>
            </div>
          </a>
        </header>

        {/* Center content: phone + form */}
        <div className="flex flex-col items-center justify-center grow px-4">
          {/* Phone illustration */}
          <img
            src={phoneImg}
            alt="Phone"
            className="w-60 mt-4 mb-4 select-none pointer-events-none"
          />

          {/* Form */}
          <div className="w-full max-w-sm flex flex-col gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-lg px-4 py-3 bg-white outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-400 placeholder-gray-500"
              required
            />

            {isRegister && (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full rounded-lg px-4 py-3 bg-white outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-400 placeholder-gray-500"
                required
              />
            )}

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-lg px-4 py-3 bg-white outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-400 placeholder-gray-500 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <p className="text-sm text-gray-700 text-center">
              {isRegister ? "Already have an account? " : "You don't have an account yet?"}
              <span
                onClick={() => setIsRegister((prev) => !prev)}
                className="font-semibold text-indigo-600 cursor-pointer hover:underline"
              >
                {isRegister ? "Login" : "Register"}
              </span>
            </p>

            <button
              type="submit"
              onClick={handleSubmit}
              className="mt-2 w-full rounded-full bg-indigo-200 hover:bg-indigo-300 active:bg-indigo-400 py-3 text-gray-800 font-medium transition"
            >
              {isRegister ? "Register" : "Login"}
            </button>
          </div>
        </div>
      </div>


      {/* ===== DESKTOP ≥ 1024px ===== */}
      <div className="hidden lg:flex min-h-screen w-full relative">
        {/* Fixed logo top‑left */}
        <div className="absolute top-6 left-6 flex items-center z-20">
          <img src={LogoF} alt="Logo" className="h-16 w-12 rounded-full mr-2" />
          <div className="leading-tight text-black">
            <span className="text-2xl font-Roboto">Fin</span>
            <br />
            <span className="text-2xl font-Roboto">Track</span>
          </div>
        </div>

        {/* Left column: form */}
        <div className="w-1/2 flex flex-col items-center justify-center px-20 bg-white lg:pl-15 lg:pr-0 ">
          <div className="w-full max-w-lg ml-auto flex flex-col gap-6 pt-12">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-lg px-4 py-3 bg-white outline-none placeholder-gray-500 text-lg border-2 border-black-1000
              
              "
              required
            />

            {isRegister && (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full rounded-lg px-4 py-3 bg-white outline-none placeholder-gray-500 text-lg border-2 border-black-600"
                required
              />
            )}

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-lg px-4 py-3 bg-white outline-none  placeholder-gray-500 text-lg border-2 border-black-600"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 "
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <p className="text-sm text-gray-700">
              {isRegister ? "Already have an account? " : "You don't have an account yet ? "}
              <span
                onClick={() => setIsRegister((prev) => !prev)}
                className="font-semibold text-indigo-600 cursor-pointer hover:underline"
              >
                {isRegister ? "Login" : "Register"}
              </span>
            </p>

            <div className="flex justify-end">
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-fit px-6 py-2 rounded-xl bg-indigo-200 hover:bg-indigo-300 active:bg-indigo-400 text-gray-800 font-medium transition text-base"
              >
                {isRegister ? "Register" : "Sign in"}
              </button>
            </div>
          </div>
        </div>
        {/* Right column: phone image on gradient - Match the design */}
        <div
          className="
            relative mt-[5%] mr-[10%] ml-[20%] rounded-4xl border-gray-300 bg-gradient-to-b from-indigo-600 via-indigo-200 to-white flex items-center justify-center
            lg:w-1/2
        ">
          <img src={phoneImg} alt="Phone" className=" w-[320px] lg:w-[420px] drop-shadow-2xl md:absolute md:-left-35 md:z-100" />

          {/* Background decorative elements */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-white bg-opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-white bg-opacity-10 rounded-full blur-2xl"></div>
        </div>
      </div>

    </>
  );
}
