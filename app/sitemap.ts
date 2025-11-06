import type { MetadataRoute } from "next"

const SITE_URL = "https://www.matildathecat.com"
const LAST_MODIFIED = new Date("2025-01-01T00:00:00Z")

/* const genreNames = [
  "Alternative HipHop",
  "Alternative Rock",
  "Ambient",
  "Ambient Electronic",
  "Boom Bap / Old school",
  "Cinematic Emotional",
  "Electronic",
  "Funk",
  "FunkRock",
  "HipHop",
  "Indie",
  "Lo-Fi",
  "Rap",
  "Rock",
  "Synthwave",
  "Trip Hop",
] */

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: LAST_MODIFIED,
      priority: 1,
    },
    {
      url: `${SITE_URL}/beats`,
      lastModified: LAST_MODIFIED,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: LAST_MODIFIED,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/illustration`,
      lastModified: LAST_MODIFIED,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: LAST_MODIFIED,
      priority: 0.8,
    },
  ]


return [...staticPages,] /*...genrePages*/
}

/* const genrePages: MetadataRoute.Sitemap = genreNames.map((genre) => {
  const genreParam = encodeURIComponent(genre)

  return {
    url: `${SITE_URL}/beats?genre=${genreParam}`,
    lastModified: LAST_MODIFIED,
    priority: 0.7,
  }
}) */