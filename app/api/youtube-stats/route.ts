import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY
  const channelId = process.env.YOUTUBE_CHANNEL_ID

  if (!apiKey || !channelId) {
    return NextResponse.json(
      { error: "Missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID environment variables." },
      { status: 500 }
    )
  }

  const apiUrl = new URL("https://www.googleapis.com/youtube/v3/channels")
  apiUrl.searchParams.set("part", "statistics")
  apiUrl.searchParams.set("id", channelId)
  apiUrl.searchParams.set("key", apiKey)

  try {
    const response = await fetch(apiUrl.toString(), {
      cache: "no-store",
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      const errorBody = await response.text()
      return NextResponse.json(
        { error: "Failed to fetch YouTube statistics.", details: errorBody },
        { status: response.status }
      )
    }

    const data = await response.json()
    const stats = data?.items?.[0]?.statistics

    if (!stats) {
      return NextResponse.json(
        { error: "Statistics not available for the specified channel." },
        { status: 404 }
      )
    }

    const formattedStats = {
      subscriberCount: Number.parseInt(stats.subscriberCount ?? "0", 10),
      videoCount: Number.parseInt(stats.videoCount ?? "0", 10),
      viewCount: Number.parseInt(stats.viewCount ?? "0", 10),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(formattedStats, { status: 200 })
  } catch (error) {
    console.error("YouTube stats fetch error", error)
    return NextResponse.json(
      { error: "Unexpected error fetching YouTube statistics." },
      { status: 500 }
    )
  }
}
