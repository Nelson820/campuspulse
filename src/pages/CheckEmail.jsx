import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../lib/supabase";

function CheckEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const [resendMessage, setResendMessage] = useState("");
  const [resending, setResending] = useState(false);

  // If someone lands here directly without signing up, send them back
  if (!email) {
    navigate("/signup");
    return null;
  }

  async function handleResend() {
    setResending(true);
    setResendMessage("");

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
    });

    setResending(false);

    if (error) {
      setResendMessage(error.message);
      return;
    }

    setResendMessage("Confirmation email resent!");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Check your email
        </h1>

        <p className="mt-3 text-gray-600">
          We sent a confirmation link to <strong>{email}</strong>. Click the
          link to activate your account, then come back and log in.
        </p>

        <button
          onClick={handleResend}
          disabled={resending}
          className="mt-6 w-full rounded-lg bg-slate-900 px-5 py-2.5 font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {resending ? "Resending..." : "Resend email"}
        </button>

        {resendMessage && (
          <p className="mt-4 text-sm text-gray-600">{resendMessage}</p>
        )}

        <button
          onClick={() => navigate("/login")}
          className="mt-4 text-sm text-slate-900 underline"
        >
          Back to login
        </button>
      </div>
    </main>
  );
}

export default CheckEmail;