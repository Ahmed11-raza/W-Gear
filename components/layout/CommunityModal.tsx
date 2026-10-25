"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { X, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { trackSignup } from "@/lib/track";

export function CommunityModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if dismissed in this session
    const dismissed = sessionStorage.getItem("wgear_community_seen");
    if (!dismissed) {
      // Smooth entrance after short delay so the page loads cleanly first
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("wgear_community_seen", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          whatsapp,
          source: "community-popup",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to join community.");
      }

      trackSignup("community-popup");
      setStatus("success");
      sessionStorage.setItem("wgear_community_seen", "true");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="community-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-ink/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={handleClose}
      />

      {/* Modal Dialog Card */}
      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-lg bg-[#141210] border border-line-strong text-inverse shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-300"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-inverse/60 hover:text-inverse transition-colors focus:outline-hidden focus:ring-1 focus:ring-accent-text"
          aria-label="Close community dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-8 h-5 shrink-0">
            <Image
              src="/images/logo/w-gear-white.png"
              alt={`${BRAND.name} Emblem`}
              fill
              className="object-contain"
            />
          </div>
          <span className="text-[0.6875rem] font-mono tracking-widest uppercase font-bold text-accent-text flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            VIP COMMUNITY &bull; SIALKOT ATELIER
          </span>
        </div>

        {status === "success" ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-accent-text/20 text-accent-text flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl font-black uppercase tracking-tight text-inverse">
              Welcome to the Community.
            </h3>
            <p className="text-xs text-inverse/75 max-w-sm mx-auto leading-relaxed">
              Your member status is active. You will receive private drop notices, early product previews, and exclusive community privileges.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-6 inline-flex min-h-[44px] items-center justify-center bg-inverse text-ink px-8 text-xs font-bold uppercase tracking-widest hover:bg-surface hover:text-inverse transition-colors"
            >
              Enter Store
            </button>
          </div>
        ) : (
          <>
            <h2
              id="community-modal-title"
              className="font-display text-[1.75rem] sm:text-[2.15rem] font-black leading-[1.05] tracking-tight uppercase text-inverse"
            >
              Join our community for exclusive benefits &amp; early products.
            </h2>

            <p className="mt-3 text-xs sm:text-[0.8125rem] text-inverse/70 leading-relaxed">
              Gain privileged access to technical drops before public release, private member pricing, and restock alerts direct from our Sialkot atelier.
            </p>

            {/* Exclusive Perks List */}
            <ul className="my-5 space-y-2 text-xs text-inverse/85 border-y border-line/40 py-3.5">
              <li className="flex items-start gap-2.5">
                <span className="text-accent-text font-bold">&bull;</span>
                <span><strong>Early Technical Drops:</strong> 48-hour early window before new pieces and limited colorways sell out.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-accent-text font-bold">&bull;</span>
                <span><strong>Exclusive Member Benefits:</strong> Private community discounts &amp; free doorstep inspection privileges.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-accent-text font-bold">&bull;</span>
                <span><strong>Zero Spam Promise:</strong> Only high-priority release alerts and restock dispatches.</span>
              </li>
            </ul>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="community-email" className="sr-only">
                  Email Address
                </label>
                <input
                  id="community-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full min-h-[46px] bg-surface/60 border border-line-strong px-3.5 text-xs text-inverse placeholder:text-inverse/45 focus:outline-hidden focus:border-accent-text focus:bg-surface"
                />
              </div>

              <div>
                <label htmlFor="community-whatsapp" className="sr-only">
                  WhatsApp Number (Optional)
                </label>
                <input
                  id="community-whatsapp"
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="WhatsApp number for drop alerts (Optional)"
                  className="w-full min-h-[46px] bg-surface/60 border border-line-strong px-3.5 text-xs text-inverse placeholder:text-inverse/45 focus:outline-hidden focus:border-accent-text focus:bg-surface"
                />
              </div>

              {errorMessage && (
                <p className="text-xs text-danger font-medium">{errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full min-h-[48px] bg-accent-text hover:bg-accent-text/90 text-inverse font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-colors disabled:opacity-60 cursor-pointer"
              >
                <span>{status === "submitting" ? "Activating..." : "Join Community & Get Benefits"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-4 flex items-center justify-between text-[0.6875rem] text-inverse/50">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-accent-text" />
                <span>Encrypted &bull; 100% Privacy Protected</span>
              </span>
              <button
                type="button"
                onClick={handleClose}
                className="hover:text-inverse underline underline-offset-2"
              >
                No thanks, continue browsing
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
