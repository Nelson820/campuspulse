
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        setSessionReady(true);
      } else {
        setError("This password reset link is invalid or has expired.");
      }
    }

    checkSession();
  }, []);

  async function handleReset(e) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Your password has been successfully updated.");

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  }

  if (!sessionReady && !error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <p className="text-gray-600">Checking reset link...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-gray-900">
          Reset your password
        </h1>

        <p className="mt-2 text-gray-600">
          Enter your new password below.
        </p>

        {sessionReady && (
          <form onSubmit={handleReset} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                New Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Confirm New Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-900 px-5 py-2.5 font-medium text-white hover:bg-slate-700 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}

        {message && (
          <p className="mt-4 text-sm text-green-600">
            {message}
          </p>
        )}

        {!sessionReady && error && (
          <p className="mt-6 text-center text-sm text-gray-600">
            <Link
              to="/forgot-password"
              className="font-semibold text-slate-900 hover:underline"
            >
              Request a new reset link
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}

export default ResetPassword;

