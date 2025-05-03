import React from "react";
import { MdArrowDropUp, MdArrowDropDown } from "react-icons/md";

type SideBarProps = {
    setView: (view: string) => void;
  };

export const TopBar = () => {
    return (
        <div className="w-full min-h-[60px] bg-[#181824] text-white flex items-center px-4 font-semibold select-none text-[#FFFFFF] justify-between">
            <span className="text-xl">JinClient</span>
            <div className="flex items-center gap-1 cursor-pointer bg-[#13131A] px-5 py-1 rounded">
                <span>user</span>
                <MdArrowDropDown className="text-2xl" />
            </div>
        </div>
      );
}

export const SideBar = ({ setView }: SideBarProps) => {
    return (
      <div className="h-screen w-16 md:w-48 bg-[#1E1E2F] text-white flex flex-col items-center md:items-start py-4 space-y-3 select-none">
        {/* Logo / App Name */}
        <div className="text-lg md:text-xl font-bold px-2">Options</div>
  
        {/* Navigation Icons or Labels */}
        <nav className="flex flex-col gap-2 w-full px-2">
          <button className="flex items-center gap-2 hover:bg-[#181824] px-4 py-2 rounded transition" onClick={() => setView("play")}>
            <span className="hidden md:inline">Play</span>
          </button>
          <button className="flex items-center gap-2 hover:bg-[#181824] px-4 py-2 rounded transition" onClick={() => setView("mods")}>
            <span className="hidden md:inline">Mods</span>
          </button>
          <button className="flex items-center gap-2 hover:bg-[#181824] px-4 py-2 rounded transition" onClick={() => setView("settings")}>
            <span className="hidden md:inline">Settings</span>
          </button>
        </nav>
      </div>
    );
  };