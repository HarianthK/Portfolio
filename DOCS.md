# Notes on the portfolio

Why the site says what it says. The README covers running it.

## Claims have to survive a click

The Registry Points entry once claimed authentication, time-series performance
tracking and real-time updates. Opening the site shows a public search with no
sign-in and nothing pushing live updates.

Someone who reads a feature list, clicks through, and finds something else is
being handed a reason to doubt every other claim on the page. The site's whole
argument rests on its claims being checkable, so the entry now describes what
actually loads: type-ahead search, points totalled per division, competition
history and eligibility. Both endpoints it names are real.

## The figure is the part worth arguing over

Each project carries one number. The temptation is to reach for the biggest one,
and the biggest one is usually coverage, which ages badly and says little.

**Trailblaze** shows roads scored rather than routes served, because anyone can
draw a line between two points. Deciding which line is prettier is the work, and
it is checkable against the roads Arizona already designates as scenic.

**Registry Points** shows dependencies removed rather than features shipped.

**CHIP-8** used to show that every program in the archive runs. It now shows the
86 that were quietly running wrong, because six instructions have two accepted
readings and the emulator had been ignoring which one each program asked for.
Coverage was the easier claim and the less honest one: an emulator that runs
everything can still be computing the wrong answers, and that is exactly what
was happening.

**Nibble** shows the byte count, because a compiler's output is the point.

Counts written into sentences go stale without anyone noticing. The archive
gained a program in September and the CHIP-8 entry had been claiming a total, so
the entries now avoid totals that the world can change underneath them.

## The two machine projects are one story

The emulator came first and was checked against a published instruction suite.
That is what made the compiler worth writing: when a compiled program misbehaves,
the machine is not the suspect. Each entry now names the other, because read
separately they look like two small projects rather than one arc.

## Layout

An asymmetric stack rather than a grid of equal cards. The grid was the shape
the template version used and it flattened every project to the same importance.

The figure alternates sides so the eye keeps moving, but only on entries that
have one. Without that condition the article became a grid with an empty cell
and squeezed the text into 16rem.

## Default look redesign, 2026-11-15

A review of the page as a stranger would meet it found five weaknesses.

The opening screen was a graph with the name under it. The graph took three
quarters of the first screen, the name and one muted sentence sat at the bottom,
and nothing said where he works or how to reach him. On a phone the name started
past the halfway mark.

There was no way around the page. No header, no section links, and the résumé
and email were only at the very bottom of roughly eleven thousand pixels.

The order put the 2023 story before the current job, and the earlier roles and
degrees after eleven long project entries. A recruiter looking for the record
had to scroll past all of it.

Small mono text was dimmed with opacity (stack lists, dates, places, section
numbers, the copyright line), which took it below the 4.5 to 1 contrast AA asks
for. Links had only the browser's faint default focus ring.

Sections were padded by up to eleven rem top and bottom, which made a long page
longer without adding any calm.

What changed:

- **Hero.** Words first. Role and city, the name, one sentence on what he
  builds, then Get in touch, Résumé, GitHub and LinkedIn, then three facts:
  current job, degree, upstream pull requests. Every one of those facts is
  stated in full further down; the hero repeats them and adds none. The graph
  sits beside the words on wide screens and under them on phones, and fades
  into the page so the canvas has no visible edge.
- **Header.** A fixed bar with the name, section links from tablet width up, the
  résumé and the theme switch. It replaces the theme switch that used to float
  alone in the corner. A skip link comes before it for keyboard users.
- **Order.** Hero, Now, Foundations, Built, Explore, Why, Contact. Who he is,
  what he does now, where he has been, what he has made, then the graph to play
  with and the personal note before the close. Section numbers follow the new
  order.
- **Contrast and focus.** Dimmed text now uses the muted colour at full
  strength, which passes AA in both themes. Every focusable element gets a
  solid two pixel ring in the accent colour.
- **Spacing.** Section padding is five rem on phones and seven on desktops, and
  project entries sit closer together.
- **Removed.** Seven keyframe animations in globals.css that nothing used.

Left alone on purpose: all copy and figures, the palette, the three typefaces,
the graph itself, and the alternating project layout described above. The site
still opens in the dark theme whatever the system setting is.
