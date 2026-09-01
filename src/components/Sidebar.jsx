import { Link } from "react-router-dom";

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Dark overlay behind the sidebar on mobile, closes menu on tap */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        ></div>
      )}

      <aside
        className={`
          fixed z-50 md:static md:z-auto
          w-64 min-h-screen bg-slate-900 text-white p-6
          transform transition-transform duration-200
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-bold">CampusPulse</h1>

          <button
            onClick={onClose}
            className="md:hidden text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                onClick={onClose}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 block"
              >
                Dashboard
              </Link>
            </li>

            <li>
              <Link
                to="/courses"
                onClick={onClose}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 block"
              >
                Courses
              </Link>
            </li>

            <li>
              <Link
                to="/analytics"
                onClick={onClose}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 block"
              >
                Analytics
              </Link>
            </li>

            <li>
              <Link
                to="/settings"
                onClick={onClose}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 block"
              >
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;