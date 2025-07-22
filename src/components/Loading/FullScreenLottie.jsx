// components/FullScreenLottie.jsx
import React from "react";
import Lottie from "lottie-react";
import animationData from "../../assets/coin wallet.json";

const FullScreenLottie = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#E5E8FF] via-[#F4F2FF] to-[#FFE9FB] flex flex-col items-center justify-center z-9999">
      <Lottie
        animationData={animationData}
        loop
        autoplay
        className="w-70 h-70 "
      />
      <span className="text-[#767CFF] text-lg font-semibold animate-pulse 3xl:text-xl">
        Loading your wallet... 💼💸
      </span>
    </div>
  );
};

export default FullScreenLottie;
