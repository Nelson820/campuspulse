import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";

const pageTitles = {
  "/": { title: "Dashboard", subtitle: "Academic overview" },
  "/courses": { title: "My Courses", subtitle: "Track your progress" },
  "/analytics": { title: "Analytics", subtitle: "Performance insights" },
  "/settings": { title: "Settings", subtitle: "Manage your preferences" },
};

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const current = pageTitles[location.pathname] || pageTitles["/"];

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <header className="flex items-center justify-between border-gray-200 bg-white px-8 py-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          {current.title}
        </h2>

        <p className="text-sm text-gray-500">
          {current.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="rounded-full p-2 hover:bg-gray-100">
          🔔
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            NB
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">
              Student
            </p>

            <p className="text-sx text-gray-500">
              Computer Science
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Log Out
        </button>
      </div>
    </header>
  );
}

export default Navbar;