"use client";

import { useState } from "react";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type LoginFormProps = {
  next?: string;
};

export function LoginForm({ next }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setMessage("");

    try {
      const supabase = createBrowserSupabaseClient();
      const callbackUrl = new URL("/auth/callback", window.location.origin);
      if (next) {
        callbackUrl.searchParams.set("next", next);
      }
      const redirectTo = callbackUrl.toString();
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (authError) {
        setError(authError.message);
      } else {
        setMessage("魔法链接已经发送到邮箱，点开后会自动回到这个网站。");
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "登录失败，请重试。");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-[var(--ink)]">邮箱地址</span>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-[18px] border border-[var(--line)] bg-white/85 px-4 py-3 text-sm outline-none ring-0 transition focus:border-[var(--accent-strong)]"
          placeholder="you@example.com"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex cursor-pointer items-center rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "发送中..." : "发送魔法链接"}
      </button>

      {message && <p className="text-sm leading-6 text-[var(--accent-strong)]">{message}</p>}
      {error && <p className="text-sm leading-6 text-[#b24f45]">{error}</p>}
    </form>
  );
}
