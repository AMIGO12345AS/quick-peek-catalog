/**
 * Editorial hero. Typography-led, no rotating banner carousel,
 * no gradient backgrounds. Quiet confidence.
 */
export const HeroSection = () => {
  return (
    <section className="relative border-b border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 md:grid-cols-12 md:gap-16 md:py-20">
        <div className="md:col-span-7 md:pr-8">
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            The Spring Edition · Vol. 01
          </p>
          <h1 className="font-display mt-5 text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Considered objects,
            <br />
            <em className="font-normal italic text-accent">quietly made.</em>
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            A small, edited selection of pieces — chosen for material, made to
            last, sold direct. Browse the collection below.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <a
              href="#collection"
              className="inline-flex h-11 items-center rounded-sm bg-foreground px-6 text-sm font-medium tracking-wide text-background transition-opacity hover:opacity-90"
            >
              View the collection
            </a>
            <a
              href="#story"
              className="inline-flex h-11 items-center px-2 text-sm font-medium tracking-wide text-foreground underline-offset-4 hover:underline"
            >
              Our story
            </a>
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="relative">
            <div className="aspect-[4/5] w-full overflow-hidden rounded-sm border border-border bg-secondary">
              {/* Placeholder visual: subtle paper-grain block. Swap with image later. */}
              <div className="flex h-full w-full items-center justify-center">
                <span className="font-display text-[10rem] font-light leading-none text-foreground/[0.06]">
                  01
                </span>
              </div>
            </div>
            <div className="absolute -bottom-3 -left-3 hidden h-20 w-20 border border-border bg-background sm:block" />
          </div>
        </div>
      </div>
    </section>
  );
};
