"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { trackSignup } from "@/lib/track";

/**
 * The only thing on this site that captures a visitor who is not ready to buy.
 *
 * Deliberately one field. Every extra input on a signup costs conversions, and
 * there is nothing here worth knowing that an email does not already unlock.
 * The promise under it is specific — "new pieces and restocks" — because a
 * vague promise is what makes people assume spam.
 */

type State = "idle" | "sending" | "done" | "error";

export function NewsletterSignup({ source = "footer" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setState("sending");
    setMessage(null);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      const body = (await response.json()) as { message?: string; delivered?: boolean };

      if (!response.ok) {
        setMessage(body.message ?? "That did not go through.");
        setState("error");
        return;
      }

      trackSignup(source);
      setState("done");
      setEmail("");
    } catch {
      setMessage("That did not go through. Check your connection.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div>
        <p className="text-spec text-ink">You&rsquo;re on the list.</p>
        <p className="mt-2 max-w-[38ch] text-[0.8125rem] leading-[1.5] text-muted">
          We will mail you when something drops. No mail is being sent from this build yet.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="max-w-[34rem]">
      <label htmlFor="newsletter-email" className="text-spec text-ink">
        New pieces and restocks
      </label>
      <p className="mt-2 max-w-[42ch] text-[0.8125rem] leading-[1.5] text-muted">
        One email when something drops or a sold-out size returns. Nothing else.
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={state === "error"}
          aria-describedby={message ? "newsletter-error" : undefined}
          className={cn(
            "min-h-[48px] w-full flex-1 border bg-canvas px-3 text-[0.9375rem] text-ink",
            state === "error" ? "border-danger" : "border-line-strong focus:border-ink",
          )}
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className={cn(
            "inline-flex min-h-[48px] shrink-0 items-center justify-center bg-ink px-6 text-[0.75rem] font-bold uppercase tracking-[0.08em] text-inverse transition-colors",
            state === "sending" ? "opacity-60" : "hover:bg-accent",
          )}
        >
          {state === "sending" ? "…" : "Join"}
        </button>
      </div>

      {message && (
        <p id="newsletter-error" role="alert" className="text-spec mt-3 text-danger">
          {message}
        </p>
      )}
    </form>
  );
}
