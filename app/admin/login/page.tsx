import type { Metadata } from "next";
import { authConfigured } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  const configured = authConfigured();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#101214] px-5 text-[#e6e8ea]">
      <div className="w-full max-w-[24rem]">
        <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-white/40">
          I-Wear Admin
        </p>
        <h1 className="mt-3 text-[1.75rem] font-bold tracking-[-0.02em]">Sign in</h1>

        {configured ? (
          <LoginForm />
        ) : (
          <div className="mt-8 rounded border border-amber-500/40 bg-amber-500/10 p-4 text-[0.8125rem] leading-[1.6] text-amber-200">
            <p className="font-semibold">This panel has not been configured.</p>
            <p className="mt-2 text-amber-200/80">
              It refuses to sign anyone in until a password and session secret exist, rather than
              falling back to a default that anyone could guess.
            </p>
            <p className="mt-3 text-amber-200/80">Generate both values:</p>
            <pre className="mt-2 overflow-x-auto rounded bg-black/40 p-3 text-[0.75rem] text-amber-100">
              pnpm admin:hash &quot;your-password&quot;
            </pre>
            <p className="mt-2 text-amber-200/80">
              Put the two lines it prints into <code>.env.local</code> and restart.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
