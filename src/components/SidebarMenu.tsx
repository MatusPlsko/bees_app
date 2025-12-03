import { Link } from "react-router-dom";

export default function SidebarMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={`fixed inset-0 bg-black/40 transition-opacity ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow p-6 transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
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
            <Link to="/about" onClick={onClose}>About us
            </Link>
            <a href="http://147.175.150.184/" className="text-lg hover:underline">
                vcelicky.tk
            </a>
        </nav>

      </div>
    </div>
  );
}
