/**
 * Still the quietest thing on the page — no graph, no data. But it used to be a
 * 672px column floating in the middle of a 1920px screen, which read as a phone
 * layout stretched onto a desktop.
 *
 * The reading measure stays narrow, because that's what makes prose readable.
 * What changed is that the space around it now carries something: the year set
 * large in the left margin, and a line pulled out of the measure on the right.
 */
export function StorySection() {
  return (
    <section id="story" className="relative px-6 py-32 md:px-14 md:py-44">
      <div className="mx-auto grid max-w-368 gap-y-12 lg:grid-cols-[minmax(0,10rem)_minmax(0,38rem)_minmax(0,1fr)] lg:gap-x-16">
        {/* Left margin — the year, as a date stamp on the whole section. */}
        <div className="lg:pt-3">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            <span className="text-primary/50">01</span> Why
          </p>
          <p
            aria-hidden
            className="mt-6 hidden font-serif text-7xl leading-none text-primary/20 lg:block"
          >
            2023
          </p>
        </div>

        {/* The measure. Unchanged width — this is the part being read. */}
        <div>
          <p className="font-serif text-3xl leading-[1.25] text-foreground md:text-[2.6rem]">
            I finished my bachelor&apos;s in Hyderabad and moved to Arizona a few months later, in
            2023.
          </p>

          <div className="mt-10 space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>
              I came for the master&apos;s at ASU, and I came to find out how somewhere else thinks
              — a different country, different people, a different set of defaults about how things
              get built and why they get built that way.
            </p>
            <p>
              That instinct turned out to be most of the job. The useful part of retrieval work is
              rarely the model; it&apos;s asking what a system is actually being asked for, rather
              than what it was originally designed to answer.
            </p>
          </div>
        </div>

        {/* Right margin — the sentence the section exists to land, lifted out
            of the body so it can be read on its own. */}
        <div className="lg:pt-24">
          <p className="border-l border-primary/30 pl-6 font-serif text-2xl leading-snug text-foreground/90 lg:text-[1.75rem]">
            The useful part is rarely the model.
          </p>
        </div>
      </div>
    </section>
  )
}
