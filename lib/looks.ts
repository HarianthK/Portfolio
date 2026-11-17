// Opt-in fan looks layered over the light/dark theme. Adding one is in DOCS.md.
// swatch: background, primary and accent, shown beside each option in the picker.
export const LOOKS = [
  { id: "default", label: "Default", swatch: ["oklch(0.13 0.012 70)", "oklch(0.81 0.14 78)", "oklch(0.7 0.13 48)"] },
  { id: "star-wars", label: "Star Wars", swatch: ["oklch(0.13 0.03 268)", "oklch(0.86 0.16 90)", "oklch(0.74 0.14 235)"] },
  { id: "harry-potter", label: "Harry Potter", swatch: ["oklch(0.15 0.035 305)", "oklch(0.82 0.13 85)", "oklch(0.74 0.12 305)"] },
  { id: "lord-of-the-rings", label: "Lord of the Rings", swatch: ["oklch(0.14 0.025 155)", "oklch(0.83 0.12 82)", "oklch(0.72 0.11 150)"] },
  { id: "game-of-thrones", label: "Game of Thrones", swatch: ["oklch(0.15 0.018 250)", "oklch(0.84 0.08 225)", "oklch(0.7 0.17 45)"] },
] as const

export type LookId = (typeof LOOKS)[number]["id"]

export const LOOK_STORAGE_KEY = "look"
// The visitor's own light/dark choice, kept while a (dark) look is on and restored on Default.
export const PREV_THEME_KEY = "look-prev-theme"

// Runs in <head> before paint so a returning visitor never sees the default flash.
export const lookBootScript = `(function(){try{var l=localStorage.getItem(${JSON.stringify(
  LOOK_STORAGE_KEY,
)});if(${JSON.stringify(LOOKS.map((l) => l.id).filter((id) => id !== "default"))}.indexOf(l)>-1)document.documentElement.setAttribute("data-look",l)}catch(e){}})()`
