import SidebarMenu from "./SidebarMenu";

type NavbarProps = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export default function Navbar({ open, onOpen, onClose }: NavbarProps) {
  return (
    <>
      {/* NAVBAR */}
      <nav className="w-full bg-yellow-400 px-4 py-3 flex items-center justify-between shadow">
        {/* Hamburger */}
        <button
          onClick={onOpen}
          className="flex flex-col gap-1"
          aria-label="Open menu"
        >
          <span className="block w-6 h-[3px] bg-black"></span>
          <span className="block w-6 h-[3px] bg-black"></span>
          <span className="block w-6 h-[3px] bg-black"></span>
        </button>

        {/* Center title */}
        <div className="text-xl font-bold text-black text-center flex-1">
          <a
            href="http://147.175.150.184/"
            className="hover:opacity-70"
            onClick={onClose}
          >
            vcelicky.tk
          </a>{" "}
          @{" "}
          <a
            href="https://www.fiit.stuba.sk/"
            className="hover:opacity-70"
            onClick={onClose}
          >
            FIIT STU
          </a>
        </div>

        {/* Right side spacer */}
        <div className="w-6"></div>
      </nav>

      <SidebarMenu open={open} onClose={onClose} />
    </>
  );
}