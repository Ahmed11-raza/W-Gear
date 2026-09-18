"use client";

import { useState } from "react";
import { MessageCircle, X, Send, ShieldCheck, Sparkles } from "lucide-react";
import { BRAND } from "@/lib/brand";

export function WhatsAppDesk() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("Sizing Advice");

  const topics = [
    "Sizing & Fit Profile",
    "TCS 2-3 Day Nationwide Delivery",
    "Doorstep Inspection Process",
    "Sialkot Custom Teamwear (MOQ 15)",
  ];

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    const text = query.trim() || `Inquiry regarding ${topic} at ${BRAND.name}`;
    const encoded = encodeURIComponent(`Hi ${BRAND.name} Team, [${topic}]: ${text}`);
    window.open(`https://wa.me/${BRAND.contact.whatsapp}?text=${encoded}`, "_blank");
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <div className="w-[320px] sm:w-[360px] bg-white border border-line p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-ink text-inverse flex items-center justify-center font-black text-xs">
                IW
              </div>
              <div>
                <p className="text-[0.8125rem] font-bold text-ink leading-none">{BRAND.name} Concierge</p>
                <span className="text-[0.6875rem] text-accent-text flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-text animate-pulse" />
                  Live Pakistan Desk &bull; Online
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-muted hover:text-ink p-1"
              aria-label="Close desk"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3 text-[0.75rem] text-ink-soft space-y-2">
            <p>Direct consultation on fabric GSM, chest/waist measurements, Sialkot squad orders, or doorstep inspection.</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {topics.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTopic(t)}
                  className={`text-[0.6875rem] px-2.5 py-1 border transition-colors ${
                    topic === t
                      ? "bg-ink text-inverse border-ink"
                      : "bg-surface text-ink-soft border-line hover:border-ink"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLaunch} className="space-y-2 pt-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. My height is 6'0, 80kg, what size polo?"
              className="w-full text-[0.75rem] px-3 py-2 bg-surface border border-line focus:bg-white focus:outline-none focus:border-ink"
            />
            <button
              type="submit"
              className="w-full bg-ink hover:bg-accent text-inverse text-[0.75rem] font-bold uppercase tracking-[0.08em] py-2.5 px-4 transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Connect on WhatsApp</span>
            </button>
          </form>

          <div className="mt-3 pt-2 border-t border-line flex items-center justify-between text-[0.6875rem] text-muted">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-accent-text" />
              <span>Verified Store Desk</span>
            </span>
            <span>Avg reply &lt; 5m</span>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group flex items-center gap-2.5 bg-ink hover:bg-accent text-inverse px-4 py-3 shadow-xl transition-all duration-200 hover:scale-[1.02]"
          aria-label="Open WhatsApp fit concierge"
        >
          <span className="w-2 h-2 rounded-full bg-accent-text animate-pulse" />
          <span className="text-[0.75rem] font-bold uppercase tracking-[0.08em]">WhatsApp Concierge</span>
        </button>
      )}
    </div>
  );
}
