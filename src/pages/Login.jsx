import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    setMessage("");
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    navigate("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back
        </h1>

        <p className="mt-2 text-gray-600">
          Log in to your CampusPulse account
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-sm font-medium text-slate-700 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-slate-900"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-slate-900 px-5 py-2.5 font-medium text-white hover:bg-slate-700"
          >
            Log In
          </button>
        </form>

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

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-slate-900 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Login;