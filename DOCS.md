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

**Retrace** showed the four file shapes it reads until 2026-11-08. A second
review called it the weakest number on the strongest AI project, and it was:
the fact a hiring engineer cares about is that the fixes behind it went into
the projects that write these traces. It now shows 4 of 6 instrumentor fixes
merged, one each into OpenInference, OpenLLMetry, OpenLIT and Opik, dated so
the number cannot quietly go wrong.

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

By November there were thirteen entries and Built ran to eleven phone screens
of paragraphs at the same weight. A design review on 2026-11-08 pointed out
that nobody reads thirteen essays and that the AI work was buried among the
systems projects. So the three AI entries, LangGraph, Retrace and Upstream,
keep the full treatment, and the other ten sit in a two column list: name,
figure, first sentence, stack and link, with the rest of the paragraph and the
figure's context behind "More". Nothing was cut, so every claim is still on the
page and still has to survive a click. The first sentence is found by a stop
followed by a capital letter, which keeps ".gz" and ".org" from ending it.
The names in the list are set in mono, so "deflate" and "ember" read as the
repository names they are rather than as typos.

The second review found the featured entries were now the hardest part to
read, so they show their first two sentences and the rest sits behind "Read
more", the same control the compact cards use. It is a real button on the row
with the link, and the hidden text stays in the page, so search engines and
screen readers still have every claim. The two groups are labelled "AI and LLM
work" and "Systems, apps and experiments".

Every section now shares one width, max-w-6xl. They had three, and the section
labels stepped in and out as you scrolled.

## Section shapes

Each section owns its own layout, because the template version repeated one
shape all the way down and felt templated however good the graph was. Story
keeps a narrow reading measure and lets the margins carry the year and one
pulled line. Now gives a narrow rail to the role and its numbers and the wide
column to the decision, since that is the part hiring teams read. Foundations
is a table, to be scanned. Figures are one number given room to land, never a
row of four stat tiles. The retrieval diagram in Now illustrates the idea, not
any real system, and is two SVGs so its labels stay readable on a phone, where
one wide drawing shrank them to about seven pixels.

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
`:root` and `.dark` use, so every component picks it up with no changes. Every
look is dark (a choice, not a constraint; a light parchment Harry Potter would
work): picking one switches the theme to dark and removes the light/dark switch
from the corner pill (the pill is pinned right, so nothing else moves). The visitor's own theme is
saved under `look-prev-theme` on the way in and restored when they pick Default.
The graph follows the look through the `--node-*` tokens, re-read when `data-look`
changes.

The picker button names the active look (label and tooltip) and shows a dot in
its colour; each option shows the look's primary and accent as two dots on a disc
of its background, ringed so the disc shows on a dark menu. The swatch values are
copies of the tokens in `globals.css` (a look's tokens only exist under its own
`data-look`, so the picker cannot read them); each token block says so. Arrowing
through the options previews each look but skips the Star Wars jump, which plays
only on a click or Space. Opening the
menu focuses the chosen option, Escape and light-dismiss come from the popover.
Hovering or focusing the button fetches all four effect chunks (about 22 KB), so
a choice does not wait on the network.

To add a look:

1. Add `{ id, label, swatch }` to `LOOKS` in `lib/looks.ts`.
2. Add a `html[data-look="id"]` token block to `globals.css`.
3. If it has motion, write the effect in `components/looks/` and register it in
   `LOADERS` in `components/look-picker.tsx`.
4. For a heading face, declare it in `app/layout.tsx` with `preload: false` and a
   `variable`, and set `font-family` in the look's block in `globals.css`.

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
  reports `(hover: hover) and (pointer: fine)`, drawn on a fixed canvas behind
  the text, and not while the pointer is over text or a control.
- Holographic cards: hovering or focusing inside a project in Built or an entry
  in Foundations shows a blue tint behind the text with moving scanlines, a
  light flicker and a red and cyan edge. The tint sits under the text, and the
  colour fringe touches only the title, never the paragraph.
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
- Readability: near and mid fights always keep to a side margin (near needs
  200 px beside the 1152 px column, mid 110 px); only far fights (small, 0.35
  opacity) cross the screen, and narrower screens get only those. The canvas is
  also faded over the text column like the other looks' backgrounds (below).
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

### Shared rules for all four looks (`components/looks/look-kit.ts`)

- Text stays clean. Background canvases are masked (CSS `mask-image`) down to
  22 to 35% over the column where text, controls and graphs actually are,
  measured per section from the layout (re-measured by a ResizeObserver on
  `main`, updated on scroll), so effects live in the margins. On phones the
  column is the whole width, so everything is faint. Cursor and click effects
  draw on a canvas at `z-index: -5`, behind the text, and pointer trails skip
  anything a visitor reads or uses. The Explorer graph panel is opaque in every
  look so particles never pass for nodes. Measured with text hidden: the
  brightest background pixel under the story paragraphs leaves muted body text
  above 5.5:1 in every look (Harry Potter was 2.85:1 before).
- Headings are hidden for their reveal only if they start below the screen
  when the look mounts, a scroll check reveals any the observer missed, and
  `@media print` always shows them. Nothing is hidden without JS.
- Cost: canvases cap at 30 fps on phones and touch screens (about 70 fps
  elsewhere), use fewer particles there, pause in a hidden tab, and draw one
  still frame with reduced motion or Save-Data. Changing reduced motion
  mid-visit remounts the look.
- Fonts: the heading faces are declared in `app/layout.tsx` with `next/font/google`,
  `preload: false` and a CSS variable, and used from the look blocks in
  `globals.css`. The boot script sets `data-look` before paint, so the face (or its
  metric-matched fallback) applies from the first frame and never reflows the page
  late; a browser fetches a face only when rendered text uses it, so Default
  visitors download nothing. Each face is sized so the page grows little against
  Default (numbers below).

### Harry Potter, Lord of the Rings and Game of Thrones

Three more looks follow the same pattern, sharing `components/looks/look-kit.ts`: a page-wide
canvas that idles when nothing moves, pauses in a hidden tab and draws one still frame with reduced
motion; dividers that draw in as each section scrolls into view; headings revealed once; and a
pointer helper that ignores clicks on anything a visitor reads or uses.

- Harry Potter: candlelit palette, IM Fell English headings, floating candles with dim wax, gold
  sparkles from the cursor and bursts on background clicks, gold ink dividers from a wax seal,
  headings that bleed in like ink, a parchment glow on hovered cards.
- Lord of the Rings: forest palette, Cormorant Garamond headings (Uncial Antiqua turned "AI Engineer at"
  into "λI Ensineer αc", and even as a lone initial its A reads as a lambda), wandering elven lights and autumn
  leaves, a journey map down the left margin (dotted route, hills, trees and a gold ring that
  travels down it with the scroll and flares once on reaching Contact, fading out beside sections whose text reaches the edge), a soft
  light that follows the cursor, map-line dividers with a compass star, headings that glow in from
  fire to gold.
- Game of Thrones: ice and fire. Cinzel headings, snow in three depths with gusts of wind that
  turns into rising embers further down the page, frost at the screen's edges, longsword dividers
  (pommel, grip, crossguard, fullered blade) with a glint, embers on background clicks, headings
  that thaw from frost, and an ice-and-fire graph (ice roles, ember projects, steel tech). Past
  the hero, flakes over the text are drawn smaller than a full stop, and fire in the margins
  burns bigger with a glow. Everything is original drawing and
CSS; the only use of the names is the picker's labels. Checked in headless Chrome: no script errors,
every divider drawn and no heading hidden under reduced motion, and switching through every look and
back to Default leaves the page with exactly the canvases, styles and elements it started with.

## The graph

The hero and the Explore section draw the same graph. These are the choices behind it.

**One source of truth.** The personal projects on the graph are built from `PROJECTS` in
`built-section.tsx`: the name, the opening clause of the summary as the detail line, and the
figure as the meta line. Stack entries become tool nodes when a tool node already exists, when two
projects share it, or when it is listed in `EXTRA_TECH` (OpenTelemetry, Rust). Anything else in a
stack gets no node rather than a node with one edge. The day-job nodes are still written by hand
in `lib/graph-data.ts`. `node scripts/check-graph.cjs` fails if a Built project is missing from the
graph or an edge points at nothing.

**Labels are HTML, not sprites.** Canvas sprites were drawn at a world size, so they shrank to
7 to 9 px when the camera pulled back, were blurred by the depth of field pass and sat behind edges.
Now each label is a span over the canvas at 12 px (14 px for the root), coloured with
`--foreground` and haloed with `--background`, so it follows the theme and every look for free.
Each frame (`components/graph/graph-labels.ts`) places labels most important first, trying below,
above, right and left of the node, and takes the first spot that is inside the frame and clear of
every other label and every node bigger than a tool dot; with no spot it hides. Small screens
therefore show fewer labels without a separate rule. The hero labels only `HERO_LABELS`; the
explorer labels roles, schools and projects, or every lit node under a filter; hover or a tap
always labels the node.

**Colours follow the look.** In the default look the graph keeps its hand-tuned hexes
(`FAMILY_COLOR` in `lib/graph-palette.ts`), and the default `--node-*` tokens in `globals.css` now
hold the same values so the still picture and the legend agree. In a fan look the palette is read
from that look's `--node-*`, `--foreground`, `--muted-foreground`, `--primary` and `--background`
tokens, converted from oklch to hex through a 1 by 1 canvas because three.js can't parse oklch. A
MutationObserver on `<html>` re-reads them when the theme class or `data-look` changes, and the node
materials are rebuilt.

**Phones get a picture first.** On `(max-width: 768px), (pointer: coarse)` or with Save-Data on,
the hero shows a still SVG of the same graph, laid out once on the server with d3-force-3d (it
ships with r3f-forcegraph) and coloured with the same CSS tokens, so it needs no JavaScript. The
live graph loads only on the "Explore it live" button. Every stage, desktop included, now fetches
three.js only when it comes within 800 px of the screen, and the explorer shows the still picture
as its loading state. Measured on a 390 px wide load: 11 scripts, 569 KB transferred (1.86 MB
decoded) and 2 WebGL canvases before; 10 scripts, 196 KB (0.63 MB decoded) and no canvas after.

**Desktop hero.** From `lg` the words take the left column and the graph the right, each in its
own space, instead of the graph above and an empty right half under it. The camera fits the
graph's depth as well as its width, since the graph turns, and fog density scales with camera
distance so the wider framing doesn't wash the light theme out. The explorer starts from a
different side and frames tighter than the hero, so the second view isn't a repeat.
