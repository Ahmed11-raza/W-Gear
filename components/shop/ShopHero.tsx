import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Sparkles, Award } from "lucide-react";

export function ShopHero() {
  return (
    <section className="relative bg-ink text-inverse overflow-hidden border-b border-line">
      {/* Background Photography with Atmospheric Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/shop-hero.jpg"
          alt="Athlete training with battle ropes in urban architecture"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-40 mix-blend-luminosity brightness-75 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
      </div>

      <div className="relative z-10 gutter py-16 sm:py-24 lg:py-28 max-w-6xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface/20 border border-line-strong backdrop-blur-md mb-4">
            <Award className="w-3.5 h-3.5 text-accent-text" />
            <span className="text-[0.6875rem] font-mono tracking-widest uppercase text-accent-text font-bold">
              SIALKOT ATELIER &bull; DROP 01 / CORE PRECISION
            </span>
          </div>

          <h1 className="font-display font-black text-[2.5rem] sm:text-[3.75rem] lg:text-[4.25rem] tracking-[-0.03em] uppercase leading-[0.95] text-inverse">
            One Cloth. <br />
            <span className="text-muted-soft">Every Movement.</span>
          </h1>

          <p className="mt-5 text-inverse/80 text-[0.9375rem] sm:text-[1.0625rem] leading-relaxed max-w-[50ch]">
            Twelve high-performance pieces cut from custom circular-knit technical yarn. Engineered for Pakistan&apos;s heat, finished for daily distinction, and delivered with open-box inspection.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#catalog"
              className="inline-flex items-center gap-2 bg-inverse text-ink hover:bg-surface hover:text-inverse text-xs font-bold uppercase tracking-widest px-7 py-4 transition-colors duration-200"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <Link
              href="/teamwear/build"
              className="inline-flex items-center gap-2 border border-line-strong bg-surface/30 backdrop-blur-md text-inverse hover:bg-surface text-xs font-bold uppercase tracking-widest px-6 py-4 transition-colors duration-200"
            >
              <span>Custom Teamwear</span>
            </Link>
          </div>
        </div>

        {/* Value Strip */}
        <div className="mt-14 pt-8 border-t border-line/40 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-inverse/80">
          <div className="flex items-start gap-3">
            <Truck className="w-4 h-4 text-accent-text shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-inverse uppercase tracking-wider">Nationwide Dispatch</p>
              <p className="text-inverse/60 text-[0.75rem] mt-0.5">2-3 days via TCS to Karachi, Lahore, Islamabad, Sialkot & beyond</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-accent-text shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-inverse uppercase tracking-wider">Doorstep Inspection</p>
              <p className="text-inverse/60 text-[0.75rem] mt-0.5">Open the parcel and verify fabric & fit before paying Cash on Delivery</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-accent-text shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-inverse uppercase tracking-wider">Engineered in Sialkot</p>
              <p className="text-inverse/60 text-[0.75rem] mt-0.5">Custom knit structures, flatlock anti-chafing seams, bar-tacked stress points</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
