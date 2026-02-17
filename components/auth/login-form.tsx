"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { createClient } from "@/lib/supabase/client";

export function LoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onOAuthSignIn = async () => {
    setError(null);

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (oauthError) {
      setError(oauthError.message);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const supabase = createClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message);
      setIsSubmitting(false);
      return;
    }

    router.push(nextPath);
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="w-full rounded-lg border border-[#002147]/10 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-[#002147]">Login</h1>
      <p className="mt-1 text-sm text-black/70">Sign in or sign up using email/password or Google.</p>

      <div className="mt-5">
        <button
          type="button"
          onClick={() => void onOAuthSignIn()}
          className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#002147]/15 bg-white text-sm font-semibold text-[#002147] transition hover:border-[#002147]/30 hover:bg-[#f3f6fb] active:scale-[0.99]"
        >
          <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true" fill="currentColor">
            <path d="M21.35 11.1H12v2.98h5.38c-.23 1.44-1.64 4.23-5.38 4.23-3.24 0-5.88-2.68-5.88-5.99S8.76 6.33 12 6.33c1.85 0 3.09.79 3.8 1.47l2.59-2.5C16.71 3.75 14.54 3 12 3 7.03 3 3 7.03 3 12s4.03 9 9 9c5.2 0 8.64-3.65 8.64-8.79 0-.59-.06-1.03-.14-1.11Z" />
          </svg>
          Continue with Google
        </button>
      </div>

      <div className="mt-5 border-t border-[#002147]/10" />

      <label className="mt-5 block text-sm font-medium text-black/80">
        Email
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="mt-1 h-11 w-full rounded-lg border border-[#002147]/15 px-3"
        />
      </label>

      <label className="mt-4 block text-sm font-medium text-black/80">
        Password
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className="mt-1 h-11 w-full rounded-lg border border-[#002147]/15 px-3"
        />
      </label>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#002147] text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
