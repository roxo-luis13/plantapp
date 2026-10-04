"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function GoogleSignInButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
    // Em caso de sucesso o navegador é redirecionado pro Google — nada mais a fazer aqui.
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
      >
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
          <path
            fill="#FFC107"
            d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.5 6 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
          />
          <path
            fill="#FF3D00"
            d="M6.3 14.7l6.6 4.8C14.6 15.6 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.5 6 29.5 4 24 4c-7.6 0-14.1 4.3-17.7 10.7z"
          />
          <path
            fill="#4CAF50"
            d="M24 44c5.4 0 10.3-1.8 14-5l-6.5-5.5c-2 1.5-4.6 2.5-7.5 2.5-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.8 39.6 16.3 44 24 44z"
          />
          <path
            fill="#1976D2"
            d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4 5.5l6.5 5.5C40.9 36.6 44 30.9 44 24c0-1.3-.1-2.7-.4-3.5z"
          />
        </svg>
        {loading ? "Redirecionando..." : "Continuar com Google"}
      </button>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
