import { Link } from "react-router-dom";
import { useState } from "react";
import SidebarMenu from "./SidebarMenu";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* NAVBAR */}
      <nav className="w-full bg-yellow-400 px-4 py-3 flex items-center justify-between shadow">
        
        {/* Hamburger */}
        <button onClick={() => setOpen(true)} className="flex flex-col gap-1">
          <span className="block w-6 h-[3px] bg-black"></span>
          <span className="block w-6 h-[3px] bg-black"></span>
          <span className="block w-6 h-[3px] bg-black"></span>
        </button>

        {/* Center title */}
        <div className="text-xl font-bold text-black text-center flex-1">
          <a href="http://147.175.150.184/" className="hover:opacity-70">vcelicky.tk</a>
          {" "}
          @
          {" "}
          <a href="https://www.fiit.stuba.sk/" className="hover:opacity-70">FIIT STU</a>
        </div>

        {/* Right side empty for now */}
        <div className="w-6"></div>
      </nav>

      <SidebarMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
