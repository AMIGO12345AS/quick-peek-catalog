import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Slide = {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  bg: string; // tailwind bg gradient class
  imageUrl?: string; // optional placeholder
};

const slides: Slide[] = [
  {
    id: "1",
    title: "Mega Deals, Every Day",
    subtitle: "Up to 70% off across categories",
    cta: "Shop Now",
    bg: "bg-gradient-hero",
  },
  {
    id: "2",
    title: "Fresh Arrivals",
    subtitle: "New styles just landed — be the first",
    cta: "Discover",
    bg: "bg-gradient-fresh",
  },
  {
    id: "3",
    title: "Festive Steals",
    subtitle: "Limited time offers, unbeatable prices",
    cta: "Grab Yours",
    bg: "bg-gradient-deal",
  },
];

export const HeroCarousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const go = (dir: -1 | 1) =>
    setIndex((i) => (i + dir + slides.length) % slides.length);

  return (
    <section className="relative" aria-label="Promotions">
      <div className="relative h-44 w-full overflow-hidden rounded-2xl shadow-banner sm:h-64 md:h-80">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={cn(
              "absolute inset-0 flex items-center justify-between gap-4 px-6 transition-opacity duration-700 sm:px-12",
              s.bg,
              i === index ? "opacity-100" : "pointer-events-none opacity-0",
            )}
            aria-hidden={i !== index}
          >
            <div className="max-w-md text-primary-foreground">
              <p className="text-xs font-semibold uppercase tracking-widest opacity-80 sm:text-sm">
                Featured
              </p>
              <h2 className="mt-1 text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
                {s.title}
              </h2>
              <p className="mt-2 text-sm opacity-90 sm:text-base">{s.subtitle}</p>
              <button
                type="button"
                className="mt-4 inline-flex items-center rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground shadow-card transition-transform hover:scale-105 sm:text-base"
              >
                {s.cta}
              </button>
            </div>
            {/* Decorative placeholder graphic */}
            <div className="hidden h-32 w-32 shrink-0 rounded-full bg-primary-foreground/15 backdrop-blur-sm sm:block sm:h-48 sm:w-48" />
          </div>
        ))}

        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous slide"
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/30 p-1.5 text-primary-foreground backdrop-blur transition hover:bg-background/50 sm:left-4 sm:p-2"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next slide"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/30 p-1.5 text-primary-foreground backdrop-blur transition hover:bg-background/50 sm:right-4 sm:p-2"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-6 bg-primary-foreground" : "w-1.5 bg-primary-foreground/50",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
