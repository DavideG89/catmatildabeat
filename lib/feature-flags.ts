export const featureFlags = {
  scratchCard: (process.env.NEXT_PUBLIC_ENABLE_SCRATCH_CARD || "false").toLowerCase() === "true",
}

export const scratchCardConfig = {
  beatId: process.env.NEXT_PUBLIC_SCRATCH_BEAT_ID || "",
  downloadUrl: process.env.NEXT_PUBLIC_SCRATCH_BEAT_DOWNLOAD_URL || "",
  coverImage: process.env.NEXT_PUBLIC_SCRATCH_BEAT_COVER || "/img/CatMatildaStudio.jpg",
  headline: process.env.NEXT_PUBLIC_SCRATCH_BEAT_HEADLINE || "Scratch to unlock a free Matilda The Cat",
  subheadline:
    process.env.NEXT_PUBLIC_SCRATCH_BEAT_SUBHEADLINE ||
    "Reveal the surprise below and grab an exclusive download for your next track.",
}
