import type { MetadataRoute } from "next"
import { siteUrl } from "@/lib/site"

// One scroll-driven page now, so there's a single canonical URL rather than the
// six routes this replaced.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
    },
  ]
}
