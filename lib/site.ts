export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")

// One list, read by the header, the hero and the contact section.
export const links = {
  email: "mailto:hkalaval@asu.edu",
  emailLabel: "hkalaval@asu.edu",
  github: "https://github.com/HarianthK",
  linkedin: "https://www.linkedin.com/in/harianthk/",
  resume: "/resume.pdf",
}
