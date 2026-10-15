// Opt-in fan looks layered over the light/dark theme. Adding one is in DOCS.md.
export const LOOKS = [
  { id: "default", label: "Default" },
  { id: "star-wars", label: "Star Wars" },
] as const

export type LookId = (typeof LOOKS)[number]["id"]

export const LOOK_STORAGE_KEY = "look"

// Runs in <head> before paint so a returning visitor never sees the default flash.
export const lookBootScript = `(function(){try{var l=localStorage.getItem(${JSON.stringify(
  LOOK_STORAGE_KEY,
)});if(${JSON.stringify(LOOKS.map((l) => l.id).filter((id) => id !== "default"))}.indexOf(l)>-1)document.documentElement.setAttribute("data-look",l)}catch(e){}})()`
