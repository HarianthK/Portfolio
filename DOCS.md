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
theme they never chose. Each look has one entry file (`components/looks/star-wars.tsx`)
that composes its parts, and that is what `EFFECTS` points at. The Star Wars
chunk is about 17 KB (under 7 KB gzipped) and is fetched only when that look is on.

The pattern for effects, so the next look can copy it: the section components
are never edited. The effect file renders a `<style>` with all its CSS (so no
CSS reaches the default stylesheet), finds the page's own elements with
selectors (`main > section`, `h2`, `#built article`), adds classes or small
elements to them in a `useEffect`, and the cleanup removes every element,
class, observer, listener, timer and frame it added. Switching back to Default
leaves the DOM and listener counts exactly as they were.

Star Wars effects (`components/looks/star-wars-fx.tsx`):

- Lightsaber dividers: a hilt and blade on the top edge of every section after
  the hero, blue, green or gold in turn, alternating sides. An
  IntersectionObserver ignites it (a CSS scale transition) the first time the
  section comes into view, and it hums (an opacity flicker) only while visible.
- Cursor trail: a short blue blade following the mouse, only when the device
  reports `(hover: hover) and (pointer: fine)`, drawn on a fixed canvas with
  `pointer-events: none`, so the real cursor and clicks are untouched.
- Holographic cards: hovering or focusing inside a project in Built or an entry
  in Foundations shows a blue tint behind the text with moving scanlines, a
  light flicker and a red and cyan edge. The tint sits under the text, so
  contrast stays close to the plain page.
- Blaster bolts: a click on empty background (not on links, buttons, inputs,
  text, canvases or while text is selected) sends a red bolt from a screen edge
  to the click with a small spark. At most three at once. Every 8 to 20 seconds
  a faint distant bolt crosses behind the page, one at a time.
- Hyperspace headings: each section `h2` waits invisible until it is in view,
  then plays once from a stretched, blurred streak into the normal text. It is
  a transform, so nothing moves in the layout; the sections clip horizontal
  overflow in this look so the stretch never adds a scrollbar.

Space battle (`components/looks/star-wars-battle.tsx`, ships in
`star-wars-ships.ts`): a second fixed canvas behind the page (`z-index: -10`,
`pointer-events: none`), above the starfield and below all content.

- Every 15 to 30 seconds (random) a skirmish of a few seconds flies along one
  smooth curve: one or two TIE fighters chased by one or two X-wings firing red
  bolts, sometimes a trailing TIE firing green at the X-wings. Each ship follows
  the same curve a little later and weaves sideways, which reads as a chase.
  Half the time the lead TIE is hit and breaks up in a flash and sparks.
- One skirmish in five is the Millennium Falcon streaking past at nearly twice
  the speed with TIEs on its tail. A Star Destroyer glides across the top of the
  far distance (70 seconds, very dim) first after 30 to 60 seconds, then every
  90 to 180 seconds.
- Depth: each skirmish picks near, mid or far. Farther is smaller (X-wing 56,
  39 or 25 px long), dimmer (opacity 0.6, 0.42, 0.28) and slower. Phones use
  only mid and far at 0.6 size and fewer ships. Ships drift slightly with
  scroll, like the starfield.
- Readability: when the screen leaves at least 110 px beside a 1024 px content
  column, the fight stays inside one side margin. Narrower screens get quick
  horizontal crossings at low opacity.
- Frames run only while a ship, bolt or spark is in flight. A hidden tab drops
  the fight and skips its turn. Pixel ratio is capped at 2. Unmount clears both
  timers, the frame, the listeners and the canvas.
- Test hook: `?sw-battle` in the URL starts a skirmish 0.6 s after the look
  turns on and every 6 s after, always with a hit, and brings the destroyer in
  at once; `?sw-battle=falcon` forces the Falcon. It does nothing otherwise.

The ships are original vector drawings made with canvas paths in a 100-unit box
(nose toward +x). No image, sprite, model or font was downloaded, traced or
copied. Harianth asked for the recognisable ships knowing they are Lucasfilm
designs; it is his personal site.

The effect canvas runs requestAnimationFrame only while a trail or bolt is on screen,
and drops everything when the tab is hidden; the distant bolt skips its turn
while hidden.

With reduced motion (the OS setting, read through `useSafeReducedMotion` and the
media query directly, since the hook reads false on its first render) the
starfield is drawn once and stays still, and the hyperspace jump is skipped.
The dividers are drawn fully lit with no ignition or hum, the hologram is a
still tint without scanline movement or flicker, and there is no cursor trail,
no bolts, no heading animation (the effect canvas is never created) and no
ships or battles (the battle canvas is never created). The
starfield also stops while the tab is hidden, caps the pixel ratio at 2 and
scales the star count to the screen area, and removes its listeners and frame
on unmount.

No copyrighted or trademarked material in any look: no logos, film fonts or
lookalikes, character images, copied ship art, music, sounds, quoted lines or
crawl text. A look evokes its source with original drawing and colour only, and
the source's name appears only as the plain-text label in the menu. The one
exception by choice is the Star Wars ships above: original drawings of
recognisable designs.
