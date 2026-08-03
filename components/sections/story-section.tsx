/**
 * Deliberately the narrowest, quietest thing on the page — no graph, no data,
 * no columns. It exists so there's a person here before any technology, and its
 * shape is the opposite of every other section for the same reason.
 */
export function StorySection() {
  return (
    <section id="story" className="relative px-6 py-32 md:px-14 md:py-44">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          <span className="text-primary/50">01</span> Why I&apos;m here
        </p>

        <p className="mt-10 font-serif text-3xl leading-[1.25] text-foreground md:text-[2.6rem]">
          I finished my bachelor&apos;s in Hyderabad and moved to Arizona a few months later, in
          2023.
        </p>

        <div className="mt-10 space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>
            I came for the master&apos;s at ASU, and I came to find out how somewhere else thinks —
            a different country, different people, a different set of defaults about how things get
            built and why they get built that way.
          </p>
          <p>
            That instinct turned out to be most of the job. The useful part of retrieval work is
            rarely the model; it&apos;s asking what a system is actually being asked for, rather
            than what it was originally designed to answer.
          </p>
        </div>
      </div>
    </section>
  )
}
