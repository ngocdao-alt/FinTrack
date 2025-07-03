import { FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import LogoF from "../assets/img/LogoF.png";
import Laptop from "../assets/img/Laptop.png";


export default function LandingPages() {
  return (
    <div className="min-h-screen flex" id="landingpage">
      {/* Nội dung chính */}
      <main
        className="flex-1 h-full bg-gradient-to-b from-white via-white to-[#373ecb] md:bg-none"
        style={{ minHeight: "100vh" }}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <a href="#" className="flex items-start group">
            <div className="flex items-center">
              <img
                src={LogoF}
                alt="Landingpage logo"
                className="h-20 w-12 rounded-full mr-1"
              />
              <div className="leading-tight">
                <span className="text-xl font-Roboto">Fin</span>
                <br />
                <span className="text-xl font-Roboto">Track</span>
              </div>
            </div>
          </a>

          {/* Nút đăng nhập/đăng ký */}
         <div className="flex space-x-2">
            <Link
              to="/login"
              className="px-5 py-2 rounded-md text-dark text-sm font-medium transition"
              style={{ backgroundColor: "#dad7ff" }}
            >
              Sign in
            </Link>
            <Link
              to="/login?mode=register
"
              className="px-5 py-2 rounded-md text-dark text-sm font-medium transition"
              style={{ backgroundColor: "#dad7ff" }}
            >
              Register
            </Link>
          </div>
        </header>

        {/* Phần chính */}
        <section className="px-12 md:px-24 flex flex-col md:flex-row gap-12 md:gap-36">
          {/* Text */}
          <div className="w-full md:w-1/2">
            <h1 className="font-notosans font-bold leading-tight text-3xl sm:text-4xl md:text-6xl lg:text-7xl">
              <span className="block">SmartExpense</span>
              <span className="block flex items-center whitespace-nowrap">
                Tracking<span className="ml-1">,</span>
                <span className="ml-2 inline-flex items-center justify-center rounded-full bg-violet-400 p-1">
                  <FiArrowUpRight
                    style={{ fontSize: "36px" }}
                    className="text-black-200"
                  />
                </span>
              </span>
              <span className="block mt-1 sm:mt-2 text-3xl sm:text-4xl md:text-6xl">
                Simplified
              </span>
            </h1>

            <p className="font-roboto text-sm md:text-base text-gray-700 max-w-md mt-4">
              Empower your team with seamless, cloud-based tools designed to
              enhance productivity, collaboration, and efficiency.
            </p>
          </div>

          {/* Hình ảnh + gradient phía sau */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end md:items-center mt-9 md:mt-7 relative">
            {/* Gradient phía sau hình – chỉ hiển thị ở md trở lên */}
            <div
              className="hidden md:block absolute rounded-[2rem] bg-gradient-to-b from-[#8f88ff] to-white"
              style={{
                width: "330px",
                height: "440px",
                zIndex: 0,
                top: "55%",
                left: "55%",
                transform: "translate(-30%, -47%)",
              }}
            />

            {/* Hình laptop */}
            <img
              src={Laptop}
              alt="Hình Laptop & Phone"
              className="w-full max-w-sm md:max-w-lg drop-shadow-md relative z-4"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
