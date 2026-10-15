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

## Looks: opt-in fan themes

Recruiters arrive from resume links, so nobody sees a fan theme unless they pick
one. The sparkle button beside the light/dark switch opens a small menu (a
native popover with radio buttons) listing the looks. The choice is saved in
localStorage under `look` and put on `<html>` as `data-look`. A one-line script
in the layout's `<head>` applies a saved look before first paint, so a returning
visitor never sees the default flash first. Both reads and writes sit in
try/catch; without storage the picker still works for the visit.

A look is a palette plus optional effects. The palette is a
`html[data-look="..."]` block in `globals.css` that redefines the same tokens
`:root` and `.dark` use, so every component picks it up with no changes. Star
Wars is dark only: picking it switches the theme to dark and hides (but keeps
the space of) the light/dark switch, so nothing in the corner moves.

To add a look:

1. Add `{ id, label }` to `LOOKS` in `lib/looks.ts`.
2. Add a `html[data-look="id"]` token block to `globals.css`.
3. If it has motion, write the effect in `components/looks/` and register it in
   `EFFECTS` in `components/look-picker.tsx` with `dynamic(..., { ssr: false })`.
   Add the id to `DARK_ONLY` if it only works on a dark page.

Effects load lazily because the default visitor should download nothing for a
theme they never chose. The Star Wars starfield is its own chunk of about 2 KB
that is fetched only when that look is on.

With reduced motion (the OS setting, read through `useSafeReducedMotion` and the
media query directly, since the hook reads false on its first render) the
starfield is drawn once and stays still, and the hyperspace jump is skipped. The
animation also stops while the tab is hidden, caps the pixel ratio at 2 and
scales the star count to the screen area, and removes its listeners and frame
on unmount.

No copyrighted or trademarked material in any look: no logos, film fonts or
lookalikes, character or ship images, music, sounds, quoted lines or crawl
text. A look evokes its source with original drawing and colour only, and the
source's name appears only as the plain-text label in the menu.
