import React from "react";
import { useSelector } from "react-redux";
import dp from "../assets/dp.webp";

const SideBar = () => {
  const { userData } = useSelector((state) => state.user);

  return (
    <div className="lg:w-[30%] w-full h-full bg-slate-100 shadow-md">
      {/* Header */}
      <div className="w-full h-[280px] bg-[#1f2933] rounded-b-[30%] shadow-lg flex flex-col justify-center items-center gap-4 px-5">
        <h1 className="text-[#cf1515] font-bold text-3xl tracking-wide">
          HamroChat
        </h1>

        <div className="w-[80px] h-[80px] rounded-full overflow-hidden border-4 border-[#7fb9a8]">
          <img
            src={userData?.image || dp}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>

        <h2 className="text-slate-200 text-lg font-medium">
          Hi, {userData?.name || "User"} 👋
        </h2>
      </div>
    </div>
  );
};

export default SideBar;
