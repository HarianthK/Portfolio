# Portfolio

My personal site. Live at **[harianthk.vercel.app](https://harianthk.vercel.app)**.

I'm Harianth Kalavala, an AI engineer in Phoenix, Arizona. I build retrieval
systems and knowledge graphs, the parts that turn messy documents into
something an application can rely on.

## The graph

The first thing you see is a knowledge graph, running live in the browser
rather than being a picture of one. It's the thing I work on, so it seemed
better to show it than to describe it.

The page opens inside the graph and pulls back to reveal it. Nodes are
coloured by family, lit from the side, and the whole thing is drawn at your
screen's own resolution, so it stays sharp on a high-density display instead
of going soft.

If you have "reduce motion" turned on, it settles into place immediately
instead of animating.

## What's on the page

The site reads as one continuous story rather than a list of pages:

- **Hero**, the graph, and what I do.
- **Story**, how I got here.
- **Built**, the projects, and what each one actually solves.
- **Explorer**, a closer look at how retrieval works.
- **Foundations**, the ideas underneath the work.
- **Now**, what I'm doing at the moment.
- **Contact**, how to reach me.

## Running it

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

One thing to watch on Windows: if a production server is left running, it
holds files in `.next` and the next `npm run dev` fails with a permission
error. Stop any running server before starting a new one.

## Built with

Next.js and TypeScript, with Tailwind for styling.

The graph is [react-three-fiber](https://r3f.docs.pmnd.rs/) over
[three.js](https://threejs.org/), with a force-directed layout and a little
post-processing for the glow and depth. Scrolling is smoothed by
[Lenis](https://lenis.darkroom.engineering/), and the smaller animations are
[Framer Motion](https://motion.dev).

The link preview image and the tab icon are generated from the graph itself,
so a shared link looks like the site rather than like a default.

## Notes for later

A few things here were harder than they looked, and are worth remembering:

**Fonts in generated images.** The preview card builds each line of text with
a font that has been given that exact line to work from. Skip that and the
generator quietly assembles letters from several different fonts, and the word
spacing collapses.

**Light theme labels.** Node names are drawn to a canvas and used as textures.
On a light background they need a thick dark outline, drawn twice, or they
disappear when the image is scaled down. A thin outline looks fine on screen
and vanishes in practice.

**Rebuilding on theme change.** Switching between light and dark rebuilds
every node from scratch, which starts them at zero size. The entrance
animation has to be re-armed when that happens, or the graph switches to the
other theme and stays invisible.
