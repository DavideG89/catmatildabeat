import type { MetadataRoute } from "next"

const SITE_URL = "https://catmatildabeat.com"
const LAST_MODIFIED = new Date("2025-01-01T00:00:00Z")

const genreSlugs = [
  "trap",
  "hip%20hop",
  "r&b",
  "drill",
  "pop",
  "afrobeat",
  "electronic",
  "lo-fi",
  "uk%20drill",
  "synthwave",
]

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
      url: `${SITE_URL}/contact`,
      lastModified: LAST_MODIFIED,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/samples`,
      lastModified: LAST_MODIFIED,
      priority: 0.7,
    },
  ]

  const genrePages: MetadataRoute.Sitemap = genreSlugs.map((slug) => ({
    url: `${SITE_URL}/beats?genre=${slug}`,
    lastModified: LAST_MODIFIED,
    priority: 0.7,
  }))

  return [...staticPages, ...genrePages]
}
