import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    // supabase-js automatically parses the tokens from the URL hash
    // and creates a session. We just need to check the result.
    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setError(error.message);
        return;
      }

      if (data.session) {
        // Confirmed and logged in — send them into the app
        navigate("/");
      } else {
        // No session yet, give it a moment (Supabase can take a beat)
        setTimeout(async () => {
          const { data: retryData } = await supabase.auth.getSession();
          if (retryData.session) {
            navigate("/");
          } else {
            navigate("/login");
          }
        }, 1000);
      }
    }

    checkSession();
  }, [navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        {error ? (
          <>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 text-sm text-slate-900 underline"
            >
              Go to login
            </button>
          </>
        ) : (
          <p className="text-gray-600">Confirming your account...</p>
        )}
      </div>
    </main>
  );
}

export default AuthCallback;