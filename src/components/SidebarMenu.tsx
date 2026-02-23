import { Link } from "react-router-dom";
import { createPortal } from "react-dom";

export default function SidebarMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[999999] bg-black/40"
      onClick={onClose}
    >
      <div
        className="fixed left-0 top-0 z-[1000000] h-full w-64 bg-white shadow p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-6">Menu</h2>

        <nav className="flex flex-col gap-4">
          <Link to="/" onClick={onClose} className="text-lg hover:underline">
            Home
          </Link>
          <Link to="/hives" onClick={onClose} className="text-lg hover:underline">
            Bee hives list
          </Link>
          <Link to="/login" onClick={onClose} className="text-lg hover:underline">
            Log in
          </Link>
          <Link to="/diary" onClick={onClose} className="text-lg hover:underline">
            Diary
          </Link>
          <Link to="/about" onClick={onClose} className="text-lg hover:underline">
            About us
          </Link>
          <a href="http://147.175.150.184/" className="text-lg hover:underline">
            vcelicky.tk
          </a>
        </nav>
      </div>
    </div>,
    document.body
  );
}
