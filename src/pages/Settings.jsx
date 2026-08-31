import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Settings() {
  const [fullName, setFullName] = useState("");
  const [degree, setDegree] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  async function loadProfile() {
    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("No logged-in user found.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, degree, year_of_study")
      .eq("id", user.id)
      .single();

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setFullName(data.full_name || "");
    setDegree(data.degree || "");
    setYearOfStudy(data.year_of_study ? String(data.year_of_study) : "");
    setLoading(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        degree: degree,
        year_of_study: yearOfStudy ? parseInt(yearOfStudy, 10) : null,
      })
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Profile updated successfully!");
  }

  return (
    <main className="p-8">
      {message && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800 transition-opacity">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {error}
        </div>
      )}

      <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Profile
        </h2>

        {loading ? (
          <p className="mt-6 text-sm text-gray-500">Loading...</p>
        ) : (
          <form onSubmit={handleSave} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Name
              </label>

              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Degree
              </label>

              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="Your degree"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Year of Study
              </label>

              <select
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-slate-900 bg-white"
              >
                <option value="">Select year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">5th Year+</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-slate-900 px-5 py-2 text-white hover:bg-slate-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

export default Settings;