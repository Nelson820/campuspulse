
import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(e) {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage(
      "If an account exists with this email, a password reset link has been sent."
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-gray-900">
          Forgot your password?
        </h1>

        <p className="mt-2 text-gray-600">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        <form onSubmit={handleReset} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 px-5 py-2.5 font-medium text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
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
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-semibold text-slate-900 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}

export default ForgotPassword;
