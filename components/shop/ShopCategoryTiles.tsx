import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CategoryTile {
  title: string;
  line: string;
  description: string;
  image: string;
  href: string;
  specs: string;
}

const CATEGORIES: CategoryTile[] = [
  {
    title: "Everyday Movement",
    line: "Everyday",
    description: "Structured circular-knit drape. Zero performance lag. Clean lines engineered for travel, city movement, and smart casual discipline.",
    image: "/images/split/everyday.jpg",
    href: "/shop?line=everyday#catalog",
    specs: "240 GSM &bull; Mercerised Pique &bull; Anti-Pilling",
  },
  {
    title: "Technical Training",
    line: "Training",
    description: "Circular ventilation zones and moisture-wicking microfibres cut for maximum range of motion under high thermal load.",
    image: "/images/editorial/movement.jpg",
    href: "/shop?line=training#catalog",
    specs: "155 GSM &bull; Circular Airflow &bull; Flatlock Seams",
  },
  {
    title: "Match & Teamwear",
    line: "Teamwear",
    description: "Match-weight kits and bespoke sublimated uniforms built for sports clubs, competitive sides, and university athletic programmes.",
    image: "/images/split/teamwear.jpg",
    href: "/teamwear",
    specs: "Custom Badging &bull; 15 Unit Min &bull; Sialkot Lineage",
  },
];

export function ShopCategoryTiles() {
  return (
    <section className="bg-canvas py-14 sm:py-20 border-b border-line">
      <div className="gutter">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-spec text-accent-text font-bold uppercase tracking-widest">
              Three Distinct Systems
            </span>
            <h2 className="mt-1 font-display text-[1.75rem] sm:text-[2.25rem] font-black tracking-[-0.02em] uppercase text-ink">
              Curated by Discipline
            </h2>
          </div>
          <p className="text-muted text-xs sm:text-sm max-w-[45ch]">
            Every garment shares one common standard of construction: custom circular knits, reinforced bar-tacks, and zero unnecessary branding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group relative flex flex-col bg-surface border border-line overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-ink"
            >
              {/* Image Frame */}
              <div className="relative w-full overflow-hidden bg-canvas" style={{ aspectRatio: "4 / 3" }}>
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                <div className="absolute top-3 right-3 bg-canvas/90 backdrop-blur-xs px-2.5 py-1 text-[0.625rem] font-mono font-bold uppercase tracking-wider text-ink border border-line">
                  {cat.line}
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <p
                    className="text-[0.625rem] font-mono text-inverse/80 uppercase tracking-wider"
                    dangerouslySetInnerHTML={{ __html: cat.specs }}
                  />
                </div>
              </div>

              {/* Text Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-extrabold text-lg text-ink group-hover:text-accent-text transition-colors">
                    {cat.title}
                  </h3>
                  <p className="mt-2 text-xs text-muted leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-line/60 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-ink group-hover:text-accent-text transition-colors">
                  <span>Explore Line</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
