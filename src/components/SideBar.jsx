import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-10">
        CampusPulse
      </h1>

      <nav>
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 block"
            >
              Dashboard
            </Link>
          </li>

          <li>
            <Link
              to="/courses"
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 block"
            >
              Courses
            </Link>
          </li>

          <li>
            <Link
              to="/analytics"
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 block"
            >
              Analytics
            </Link>
          </li>

          <li>
            <Link
              to="/settings"
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 block"
            >
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;