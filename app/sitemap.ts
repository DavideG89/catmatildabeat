import type { MetadataRoute } from "next"

const SITE_URL = "https://www.catmatildabeat.com"
const LAST_MODIFIED = new Date("2025-01-01T00:00:00Z")

const genreNames = [
  "trap",
  "hip hop",
  "r&b",
  "drill",
  "pop",
  "afrobeat",
  "electronic",
  "lo-fi",
  "uk drill",
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

  const genrePages: MetadataRoute.Sitemap = genreNames.map((genre) => {
    const genreParam = encodeURIComponent(genre)
    return {
      url: `${SITE_URL}/beats?genre=${genreParam}`,
      lastModified: LAST_MODIFIED,
      priority: 0.7,
    }
  })

  return [...staticPages, ...genrePages]
}
