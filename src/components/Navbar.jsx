import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const pageTitles = {
  "/": { title: "Dashboard", subtitle: "Academic overview" },
  "/courses": { title: "My Courses", subtitle: "Track your progress" },
  "/analytics": { title: "Analytics", subtitle: "Performance insights" },
  "/settings": { title: "Settings", subtitle: "Manage your preferences" },
};

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const current = pageTitles[location.pathname] || pageTitles["/"];

  const [profile, setProfile] = useState({ full_name: "", degree: "" });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("full_name, degree")
      .eq("id", user.id)
      .single();

    if (data) {
      setProfile({
        full_name: data.full_name || "Student",
        degree: data.degree || "",
      });
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  const initials = profile.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "S";

  return (
    <header className="flex items-center justify-between border-gray-200 bg-white px-4 md:px-8 py-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden text-2xl leading-none text-gray-700"
        >
          ☰
        </button>

        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {current.title}
          </h2>

          <p className="text-sm text-gray-500 hidden sm:block">
            {current.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button className="rounded-full p-2 hover:bg-gray-100 hidden sm:block">
          🔔
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            {initials}
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">
              {profile.full_name || "Student"}
            </p>

            <p className="text-sx text-gray-500">
              {profile.degree}
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