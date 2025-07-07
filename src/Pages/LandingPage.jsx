import { FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import LogoF from "../assets/img/LogoF.png";
import Laptop from "../assets/img/Laptop.png";
export default function LandingPages() {
  return (
    <div className="min-h-screen flex" id="landingpage">
      {/* Nội dung chính */}
      <main
  className="
    flex-1 h-full
    bg-gradient-to-b from-white via-white to-[#373ecb] xl:bg-none
    "           /* Giữ gradient ở mobile, bỏ ở md+ */
  style={{ minHeight: "100vh" }}
>
        {/* Header */}
       <header className="px-3 md:px-24 flex items-center justify-between py-2">

          {/* Logo */}
          <a href="#" className="flex items-start group">
            <div className="flex items-center">
              <img
                src={LogoF}
                alt="Landingpage logo"
                className="h-20 w-12 rounded-full mr-1"
              />
              <div className="leading-tight">
                <span className="text-xl font-bold font-Roboto">Fin</span>
                <br />
                <span className="text-xl font-bold font-Roboto">Track</span>
              </div>
            </div>
          </a>

          {/* Nút đăng nhập/đăng ký */}
<div className="flex space-x-2">
  <Link
    to="/login"
    className="px-3 py-2 rounded-md text-dark text-sm font-bold
               bg-[#dad7ff] hover:bg-[#8f87ff]
               transition-colors duration-200"
  >
    Sign in
  </Link>

  <Link
    to="/login?mode=register"
    className="px-3  py-2 rounded-md text-dark text-sm font-bold
               bg-[#dad7ff] hover:bg-[#8f87ff ]
               transition-colors duration-200"
  >
    Register
  </Link>
</div>

        </header>

        {/* Phần chính */}
    <section
  className="
    min-h-screen
    flex flex-col items-center
    gap-6 px-6                
    md:gap-10 md:px-12      
    lg:px-12                  
    xl:flex-row xl:items-start xl:gap-10  
    py-16                    
  ">
          {/* Text */}
          <div className=" w-full md:w-1/2">
            <h1 className="font-notosans font-bold leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-5xl  xl:text-5xl">
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
              <span className="block mt-1 sm:mt-2 text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-5xl">
                Simplified
              </span>
            </h1>

            <p className="font-roboto text-xl md:text-base text-gray-1000 max-w-xl mt-4">
              Empower your team with seamless, cloud-based tools designed to
              enhance productivity, collaboration, and efficiency.
            </p>
          </div>

          {/* Hình ảnh + gradient phía sau */}
          <div className="w-full md:w-1/2 flex justify-center xl:justify-end xl:items-center mt-9 xl:mt-7 relative">
            {/* Gradient phía sau hình*/}
            <div
              className="hidden xl:block absolute rounded-[2rem] bg-gradient-to-b from-[#8f88ff] to-white"
              style={{
                width: "350px",
                height: "300px",
                zIndex: 0,
                top: "95%",
                left: "95%",
                transform: "translate(-90%, -90%)",
              }}
            />

            {/* Hình laptop */}
            <img
              src={Laptop}
              alt="Hình Laptop & Phone"
              className="w-full max-w-sm xl:max-w-md drop-shadow-xl relative z-4"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
