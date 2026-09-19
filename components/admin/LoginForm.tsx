"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      router.replace(params.get("next") || "/admin");
      router.refresh();
      return;
    }

    const body = await response.json().catch(() => ({}));
    setError(body.message ?? "Sign in failed.");
    setPending(false);
  }

  return (
    <form onSubmit={submit} className="mt-8">
      <label htmlFor="password" className="text-[0.75rem] uppercase tracking-[0.1em] text-white/50">
        Password
      </label>
      <input
        id="password"
        type="password"
        autoFocus
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-2 block h-11 w-full rounded border border-white/15 bg-black/30 px-3 text-[0.9375rem] text-white outline-none focus:border-white/50"
      />

      {error && (
        <p role="alert" className="mt-3 text-[0.8125rem] text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || password.length === 0}
        className="mt-5 inline-flex h-11 w-full items-center justify-center rounded bg-white text-[0.8125rem] font-semibold text-black transition-colors hover:bg-white/85 disabled:opacity-50"
      >
        {pending ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
