import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { GARMENTS } from "@/data/teamwear";
import { whatsappLink } from "@/lib/brand";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";

/**
 * Bespoke Teamwear Showcase
 * High-definition kit cards for Cricket, Football, and Workout Wear
 * with embedded W-Gear branding, Sialkot craftsmanship, and zero animation traps.
 */

const KITS = [
  {
    sport: "Cricket",
    tagline: "Pro Match Day Jersey",
    image: "/images/teamwear/cricket.jpg",
    number: "07",
    colorScheme: "Matte Obsidian // Charcoal",
    specs: ["Sublimated Micro-Mesh", "Heat-Sealed Crest", "Anti-Pilling Knit"],
    href: "/teamwear/build?sport=cricket",
  },
  {
    sport: "Football",
    tagline: "Custom Match Kit",
    image: "/images/teamwear/football.jpg",
    number: "10",
    colorScheme: "Royal Blue // Arctic White",
    specs: ["Circular Knit Texture", "Silicone 3D Crest", "Flatlock Seams"],
    href: "/teamwear/build?sport=football",
    featured: true,
  },
  {
    sport: "Workout Wear",
    tagline: "Athletic Training Set",
    image: "/images/teamwear/workout.jpg",
    number: "24",
    colorScheme: "Stealth Black // Slate",
    specs: ["Compression Fit", "Reinforced Bar-Tacks", "High-Velocity Flex"],
    href: "/teamwear/build?sport=training",
  },
];

export function TeamwearIntro() {
  const minimum = Math.min(...GARMENTS.map((g) => g.minimumOrder)) || 10;
  const whatsappUrl = whatsappLink(
    "Hi W-Gear, I'm interested in ordering custom teamwear for our club/squad. Please share the pricing and turnaround options.",
  );

  return (
    <section
      aria-labelledby="teamwear-intro-heading"
      className="relative bg-[#101214] text-canvas overflow-hidden border-t border-b border-white/10"
    >
      <div className="gutter py-[clamp(4.5rem,9vw,9rem)] relative z-10">
        <div className="shell">
          <div className="grid gap-x-[clamp(2.5rem,6vw,6rem)] gap-y-14 lg:grid-cols-[1fr_1.35fr] lg:items-center">
            {/* Left Content Column */}
            <div>
              {/* Understated Luxury Atelier Kicker */}
              <div className="mb-4">
                <span className="text-[0.6875rem] font-mono tracking-widest uppercase text-white/50 font-semibold">
                  Custom Teamwear // Sialkot Atelier
                </span>
              </div>

              {/* Clean Authoritative Display Headline */}
              <h2
                id="teamwear-intro-heading"
                className="mt-2 font-display font-black uppercase text-white"
                style={{
                  fontSize: "var(--text-display)",
                  lineHeight: "var(--text-display--line-height)",
                  letterSpacing: "var(--text-display--letter-spacing)",
                }}
              >
                Your colours. <br />
                Your crest.
              </h2>

              {/* Narrative Copy */}
              <p
                className="mt-6 max-w-[48ch] text-canvas/75 leading-relaxed font-normal"
                style={{ fontSize: "var(--text-lede)" }}
              >
                Configure professional teamwear directly in your browser. Real-time sublimation patterns, squad names, numbers, and high-definition crest digitization &mdash; masterfully cut, printed, and sewn in Sialkot, Punjab.
              </p>

              {/* Value Metrics Grid */}
              <dl className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-white/10">
                <div>
                  <dt className="text-[0.6875rem] font-mono uppercase tracking-wider text-white/45">
                    Minimum Order
                  </dt>
                  <dd className="mt-1 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
                    {minimum} units
                  </dd>
                  <span className="text-[0.6875rem] text-white/50">Squad-sized minimum</span>
                </div>

                <div>
                  <dt className="text-[0.6875rem] font-mono uppercase tracking-wider text-white/45">
                    Turnaround Time
                  </dt>
                  <dd className="mt-1 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
                    12-14 Days
                  </dd>
                  <span className="text-[0.6875rem] text-white/50">Direct from Sialkot</span>
                </div>

                <div>
                  <dt className="text-[0.6875rem] font-mono uppercase tracking-wider text-white/45">
                    Crest Digitization
                  </dt>
                  <dd className="mt-1 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
                    Included
                  </dd>
                  <span className="text-[0.6875rem] text-white/50">Vector proof provided</span>
                </div>
              </dl>

              {/* Trust Standards */}
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/60">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white/40" />
                  <span>Sublimated Micro-Mesh</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white/40" />
                  <span>Doorstep Inspection Allowed</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white/40" />
                  <span>7-Day Quality Guarantee</span>
                </span>
              </div>

              {/* CTAs */}
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <ButtonLink
                  href="/teamwear/build"
                  variant="inverse"
                  size="lg"
                  className="min-h-[52px] px-8 text-xs font-black tracking-widest uppercase"
                >
                  <span>Build Your Team</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </ButtonLink>

                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[52px] items-center gap-2 px-6 text-xs font-bold uppercase tracking-wider text-white/80 border border-white/20 hover:border-white/50 hover:bg-white/5 rounded transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-white/60" />
                    <span>WhatsApp Concierge</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right Kit Showcase Column — 100% Reliable, Direct Rendering */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">
              {KITS.map((kit) => (
                <div
                  key={kit.sport}
                  className={`group relative flex flex-col bg-[#141618] border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                    kit.featured
                      ? "border-white/30 sm:-translate-y-3"
                      : "border-white/10 hover:border-white/25"
                  }`}
                >
                  {/* Photo Frame with embedded W-Gear badge */}
                  <div className="relative aspect-[3/4] w-full min-h-[260px] overflow-hidden bg-black/80">
                    <Image
                      src={kit.image}
                      alt={`W-Gear bespoke ${kit.sport} kit`}
                      fill
                      unoptimized
                      priority
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
                      className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                    />

                    {/* Gradient Overlay for Legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141618] via-transparent to-black/20 pointer-events-none" />

                    {/* Squad Number Indicator */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="font-mono text-xs font-bold text-white bg-black/70 px-2 py-0.5 rounded border border-white/15">
                        #{kit.number}
                      </span>
                    </div>

                    {/* Bottom overlay badge */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10">
                      <span className="text-[0.625rem] font-mono text-white/80 block tracking-wide uppercase font-semibold">
                        {kit.colorScheme}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Footer */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-display font-extrabold text-base text-white group-hover:text-white/80 transition-colors uppercase">
                          {kit.sport}
                        </h3>
                        {kit.featured && (
                          <span className="text-[0.5625rem] font-mono font-bold uppercase text-white bg-white/15 px-1.5 py-0.5 rounded">
                            Core
                          </span>
                        )}
                      </div>
                      <p className="text-[0.6875rem] text-white/45 mt-0.5">
                        {kit.tagline}
                      </p>

                      {/* Technical Spec Tags */}
                      <ul className="mt-3 space-y-1">
                        {kit.specs.map((spec) => (
                          <li
                            key={spec}
                            className="text-[0.6875rem] text-white/60 flex items-center gap-1.5"
                          >
                            <span className="w-1 h-1 rounded-full bg-white/40 shrink-0" />
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action link */}
                    <Link
                      href={kit.href}
                      className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white/80 hover:text-white transition-colors"
                    >
                      <span>Configure Kit</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
