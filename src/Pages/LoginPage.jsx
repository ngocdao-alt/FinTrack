// src/pages/Login.jsx
import { useEffect, useState } from "react";
import phoneImg from "../assets/img/phoneImg.png";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../features/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

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
  }, [dispatch, auth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isRegister) {
        await dispatch(
          registerUser({
            email,
            name,
            password,
          })
        );
        toast.success("Đăng kí thành công!");
        setIsRegister(false);
      } else {
        await dispatch(
          loginUser({
            email,
            password,
          })
        );
        toast.success("Đăng nhập thành công!");
      }

      setEmail("");
      setName("");
      setPassword("");

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="
                min-h-screen py-5 flex flex-col items-center justify-start bg-gradient-to-b from-white via-indigo-200 to-indigo-600
                sm:text-xl 
                lg:text-2xl lg:py-0
                
        "
    >
      {/* Logo */}
      <header className="w-full flex items-center gap-2 px-4 py-3">
        <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center">
          <span className="text-white font-extrabold text-xl">F</span>
        </div>
        <div className="leading-4">
          <h1 className="text-lg font-semibold text-gray-900">Fin</h1>
          <h1 className="text-lg font-semibold text-gray-900">Track</h1>
        </div>
      </header>

      {/* Phone illustration */}
      <img
        src={phoneImg}
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
        onSubmit={handleSubmit}
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-lg px-4 py-3 bg-white outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-400 placeholder-gray-500"
        />

        {/* Password + eye icon */}
        {isRegister && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Name"
            className="w-full rounded-lg px-4 py-3 pr-12 bg-white outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-400 placeholder-gray-500"
          />
        )}

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="w-full rounded-lg px-4 py-3 pr-12 bg-white outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-400 placeholder-gray-500"
        />

        {/* Register link */}
        <p className="text-sm text-gray-700">
          {isRegister
            ? "Already have an account? "
            : "Don't have an account yet ? "}
          <span
            onClick={() => setIsRegister((prev) => !prev)}
            className="font-semibold text-indigo-600 cursor-pointer hover:underline"
          >
            {isRegister ? "Login" : "Register"}
          </span>
        </p>

        {/* Login button */}
        <button
          type="submit"
          className="mt-2 w-full rounded-full bg-indigo-200 hover:bg-indigo-300 active:bg-indigo-400 py-3 text-gray-800 font-medium transition"
        >
          {isRegister ? "Register" : "Login"}
        </button>
      </form>
    </div>
  );
}
