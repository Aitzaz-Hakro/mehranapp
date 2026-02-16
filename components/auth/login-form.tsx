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
      <p className="mt-1 text-sm text-black/70">Use your Supabase account credentials.</p>

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
