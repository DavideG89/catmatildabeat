"use client"

import type React from "react"
import { useState } from "react"
import { useBeats } from "@/components/beats-context"
import { beatOperations, type BeatCategory } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Plus, Loader2, CheckCircle, AlertCircle, Music, Play, Pause, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const genreOptions = [
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
]

const keys = [
  "C Major",
  "C Minor",
  "C# Major",
  "C# Minor",
  "D Major",
  "D Minor",
  "D# Major",
  "D# Minor",
  "E Major",
  "E Minor",
  "F Major",
  "F Minor",
  "F# Major",
  "F# Minor",
  "G Major",
  "G Minor",
  "G# Major",
  "G# Minor",
  "A Major",
  "A Minor",
  "A# Major",
  "A# Minor",
  "B Major",
  "B Minor",
  "Bb Major",
  "Bb Minor",
]

const categories: {
  value: BeatCategory
  label: string
  description: string
  color: string
}[] = [
  {
    value: "trending",
    label: "Trending",
    description: "Popular beats getting attention",
    color: "bg-orange-100 border-orange-300 text-orange-800",
  },
  {
    value: "featured",
    label: "Featured",
    description: "Highlighted premium beats",
    color: "bg-blue-100 border-blue-300 text-blue-800",
  },
  {
    value: "new_releases",
    label: "New Releases",
    description: "Fresh beats just released",
    color: "bg-green-100 border-green-300 text-green-800",
  },
  {
    value: "latest",
    label: "Latest Tracks",
    description: "Recent additions to catalog",
    color: "bg-purple-100 border-purple-300 text-purple-800",
  },
]

interface UploadBeatFormProps {
  onSuccess?: () => void
}

export default function UploadBeatForm({ onSuccess }: UploadBeatFormProps) {
  const { addBeat } = useBeats()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    producer: "Cat Matilda Beat",
    bpm: "",
    key: "",
    genre: "",
    genres: [] as string[],
    categories: [] as BeatCategory[], // Multiple categories
    description: "",
    duration: "",
    beatstarsLink: "",
    tags: [] as string[],
  })

  // File upload states
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioPreview, setAudioPreview] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  const [newTag, setNewTag] = useState("")
  const [audioDurationSec, setAudioDurationSec] = useState<number>(0)
  const [trimStartSec, setTrimStartSec] = useState<number>(0)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleGenreToggle = (genre: string, isSelected: boolean) => {
    setFormData((prev) => {
      const current = new Set(prev.genres)

      if (isSelected) {
        current.add(genre)
      } else {
        current.delete(genre)
      }

      const orderedSelection = genreOptions.filter((option) => current.has(option))

      return {
        ...prev,
        genres: orderedSelection,
        genre: orderedSelection[0] ?? "",
      }
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ["audio/mpeg", "audio/wav", "audio/mp3", "audio/x-wav"]
      if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav)$/i)) {
        setErrorMessage("Please upload a valid MP3 or WAV file")
        return
      }

      setAudioFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const audioUrl = e.target?.result as string
        setAudioPreview(audioUrl)

        // Create audio element for preview
        const audio = new Audio(audioUrl)
        audio.addEventListener("loadedmetadata", () => {
          setAudioDurationSec(audio.duration || 0)
          setTrimStartSec(0)
          const minutes = Math.floor(audio.duration / 60)
          const seconds = Math.floor(audio.duration % 60)
          const duration = `${minutes}:${seconds.toString().padStart(2, "0")}`
          setFormData((prev) => ({ ...prev, duration }))
        })
        setAudioElement(audio)
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleAudioPreview = () => {
    if (!audioElement) return

    if (isPlaying) {
      audioElement.pause()
      setIsPlaying(false)
    } else {
      try {
        audioElement.currentTime = Math.max(0, Math.min(trimStartSec, Math.max(0, audioDurationSec - 0.1)))
      } catch {}
      const endAt = Math.min(audioDurationSec, trimStartSec + 40)
      const onTimeUpdate = () => {
        if (audioElement.currentTime >= endAt) {
          audioElement.pause()
          setIsPlaying(false)
          audioElement.removeEventListener("timeupdate", onTimeUpdate)
        }
      }
      audioElement.addEventListener("timeupdate", onTimeUpdate)
      audioElement.play()
      setIsPlaying(true)

      // Auto-pause when audio ends
      audioElement.onended = () => {
        setIsPlaying(false)
      }
    }
  }

  const removeImage = () => {
    setCoverImage(null)
    setImagePreview(null)
  }

  const removeAudio = () => {
    if (audioElement) {
      audioElement.pause()
      setIsPlaying(false)
    }
    setAudioFile(null)
    setAudioPreview(null)
    setAudioElement(null)
  }

  // ffmpeg.wasm loader (singleton) supporting both new and legacy APIs
  let _ffmpeg: any = null
  let _fetchFile: ((src: any) => Promise<Uint8Array>) | null = null
  let _ffmpegApiKind: 'new' | 'legacy' | null = null
  const getFFmpeg = async () => {
    if (_ffmpeg && _fetchFile) return { ffmpeg: _ffmpeg, fetchFile: _fetchFile, api: _ffmpegApiKind }

    // Load ffmpeg module
    const mod: any = await import("@ffmpeg/ffmpeg")

    // Resolve fetchFile from module, or use custom polyfill
    let fetchFile: any = mod?.fetchFile
    if (!fetchFile) {
      fetchFile = async (input: any): Promise<Uint8Array> => {
        if (input instanceof Uint8Array) return input
        if (typeof window !== 'undefined') {
          if (input instanceof File || input instanceof Blob) {
            const buf = await (input as Blob).arrayBuffer()
            return new Uint8Array(buf)
          }
          if (typeof input === 'string') {
            const res = await fetch(input)
            const buf = await res.arrayBuffer()
            return new Uint8Array(buf)
          }
          if (input instanceof ArrayBuffer) return new Uint8Array(input)
        }
        throw new Error('Unsupported input for fetchFile polyfill')
      }
    }

    // Initialize ffmpeg with legacy or new API
    if (mod.createFFmpeg) {
      const ffmpeg = mod.createFFmpeg({ log: false })
      await ffmpeg.load()
      _ffmpeg = ffmpeg
      _fetchFile = fetchFile
      _ffmpegApiKind = 'legacy'
      return { ffmpeg, fetchFile, api: 'legacy' as const }
    }
    if (mod.FFmpeg) {
      const ffmpeg = new mod.FFmpeg()
      await ffmpeg.load()
      _ffmpeg = ffmpeg
      _fetchFile = fetchFile
      _ffmpegApiKind = 'new'
      return { ffmpeg, fetchFile, api: 'new' as const }
    }
    throw new Error('FFmpeg module did not expose a supported API')
  }

  // Process audio client-side with ffmpeg.wasm: trim 40s with fade in/out, keep SR & channels, export MP3
  const processAudioForPreview = async (file: File): Promise<{ file: File; durationSeconds: number }> => {
    const arrayBuffer = await file.arrayBuffer()
    const tempCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const decodedBuffer: AudioBuffer = await tempCtx.decodeAudioData(arrayBuffer.slice(0))
    const start = Math.max(0, Math.min(trimStartSec, Math.max(0, decodedBuffer.duration - 0.1)))
    const targetDuration = Math.min(40, Math.max(0.1, decodedBuffer.duration - start))
    const fadeIn = Math.min(2, targetDuration / 10)
    const fadeOut = Math.min(2, targetDuration / 10)
    const sampleRate = decodedBuffer.sampleRate
    const numChannels = decodedBuffer.numberOfChannels || 1

    const { ffmpeg, fetchFile, api } = await getFFmpeg()
    const inputExt = (file.name.split('.').pop() || 'mp3').toLowerCase()
    const inputName = `input.${inputExt}`
    const outputName = `output.mp3`

    if (api === 'legacy') {
      await ffmpeg.FS('writeFile', inputName, await fetchFile(file))
    } else {
      await ffmpeg.writeFile(inputName, await fetchFile(file))
    }

    const fadeFilter = `afade=t=in:st=0:d=${fadeIn.toFixed(3)},afade=t=out:st=${(targetDuration - fadeOut).toFixed(3)}:d=${fadeOut.toFixed(3)}`

    const args = [
      '-i', inputName,
      '-ss', start.toFixed(3),
      '-t', targetDuration.toFixed(3),
      '-af', fadeFilter,
      '-ac', String(numChannels),
      '-ar', String(sampleRate),
      '-c:a', 'libmp3lame',
      '-b:a', '128k',
      outputName,
    ]
    if (api === 'legacy') {
      await ffmpeg.run(...args)
    } else {
      await ffmpeg.exec(args)
    }

    const data = api === 'legacy' ? ffmpeg.FS('readFile', outputName) : await ffmpeg.readFile(outputName)
    const outName = file.name.replace(/\.[^.]+$/, "") + "_preview.mp3"
    const previewFile = new File([data], outName, { type: 'audio/mpeg' })
    try {
      if (api === 'legacy') {
        ffmpeg.FS('unlink', inputName)
        ffmpeg.FS('unlink', outputName)
      } else {
        await ffmpeg.deleteFile(inputName)
        await ffmpeg.deleteFile(outputName)
      }
    } catch {}

    return { file: previewFile, durationSeconds: targetDuration }
  }

  // lamejs helpers removed in favor of ffmpeg.wasm

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleCategoryChange = (categoryValue: BeatCategory, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      categories: checked ? [...prev.categories, categoryValue] : prev.categories.filter((c) => c !== categoryValue),
    }))
  }

  const uploadAudioFile = async (file: File, beatId: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${beatId}.${fileExt}`
      const filePath = `audio/${fileName}`

      const { error: uploadError } = await beatOperations.supabase.storage.from("beat-audio").upload(filePath, file, {
        upsert: true,
      })

      if (uploadError) {
        console.error("Error uploading audio:", uploadError)
        return null
      }

      const { data } = beatOperations.supabase.storage.from("beat-audio").getPublicUrl(filePath)
      return data.publicUrl
    } catch (error) {
      console.error("Unexpected error uploading audio:", error)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage("")

    try {
      // Validate required fields
      if (!formData.title || !formData.bpm || !formData.key || formData.genres.length === 0) {
        throw new Error("Please fill in all required fields")
      }

      let coverImageUrl = ""
      let audioFileUrl = ""
      let previewDurationString: string | null = null

      // Upload cover image if provided
      if (coverImage) {
        const tempId = Date.now().toString()
        const uploadedCover = await beatOperations.uploadImage(coverImage, tempId)
        if (!uploadedCover) {
          throw new Error("Failed to upload cover image")
        }
        coverImageUrl = uploadedCover
      } else {
        // Use placeholder image if no image uploaded
        coverImageUrl = `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(formData.title + " beat cover")}`
      }

      // Upload audio file if provided (process to 40s preview with fade)
      if (audioFile) {
        const tempId = Date.now().toString()
        const { file: previewFile, durationSeconds } = await processAudioForPreview(audioFile)
        // Compute human-readable duration from actual preview length
        const minutes = Math.floor(durationSeconds / 60)
        const seconds = Math.round(durationSeconds % 60)
        const finalDurationString = `${minutes}:${seconds.toString().padStart(2, "0")}`
        const uploadedAudio = await uploadAudioFile(previewFile, tempId)
        if (!uploadedAudio) {
          throw new Error("Failed to upload audio file")
        }
        audioFileUrl = uploadedAudio
        // Set form field for consistency (not relied upon for payload)
        setFormData((prev) => ({ ...prev, duration: finalDurationString }))
        previewDurationString = finalDurationString
      }

      // Create beat object - use first selected category or default to "latest"
      const selectedCategories: BeatCategory[] =
        formData.categories.length > 0 ? formData.categories : (["latest"] as BeatCategory[])

      const [primaryGenre, ...secondaryGenres] = formData.genres
      const autoGenreTags = secondaryGenres.filter(Boolean)
      const uniqueTags = Array.from(new Set([...formData.tags, ...autoGenreTags]))

      const beatData: any = {
        title: formData.title,
        producer: formData.producer,
        cover_image: coverImageUrl,
        audio_file: audioFileUrl, // Add audio file URL
        bpm: Number.parseInt(formData.bpm),
        key: formData.key,
        genre: primaryGenre,
        tags: uniqueTags,
        status: "active" as const,
        category: selectedCategories[0] as "trending" | "featured" | "new_releases" | "latest",
        categories: selectedCategories,
        beatstars_link: formData.beatstarsLink || "https://beatstars.com/catmatildabeat",
        sales: 0,
        description: formData.description,
        duration: previewDurationString || formData.duration || "0:40",
      }

      const result = await addBeat(beatData)

      if (result) {
        setSubmitStatus("success")
        // Reset form
        setFormData({
          title: "",
          producer: "Cat Matilda Beat",
          bpm: "",
          key: "",
          genre: "",
          genres: [],
          categories: [],
          description: "",
          duration: "",
          beatstarsLink: "",
          tags: [],
        })
        setCoverImage(null)
        setImagePreview(null)
        removeAudio()

        // Call success callback after a short delay to show success message
        setTimeout(() => {
          onSuccess?.()
        }, 1500)
      } else {
        console.error("Beat creation returned null result")
        throw new Error("Failed to create beat - no result returned")
      }
    } catch (error) {
      console.error("Error creating beat:", error)
      setSubmitStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cover Image Upload */}
        <div className="space-y-2">
          <Label>Cover Image</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-6">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Cover preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <Label htmlFor="cover-upload" className="cursor-pointer">
                    <span className="text-brand-500 hover:text-brand-400">Click to upload</span> or drag and drop
                  </Label>
                  <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
                </div>
                <Input id="cover-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
            )}
          </div>
        </div>

        {/* Audio File Upload */}
        <div className="space-y-2">
          <Label>Audio File (MP3/WAV)</Label>
          <p className="text-xs text-muted-foreground">Creeremo una preview di 40s in MP3 con fade in/out. Nessun ricampionamento e nessuna conversione in mono. Puoi scegliere il punto di inizio.</p>
          <div className="border-2 border-dashed border-border rounded-lg p-6">
            {audioPreview ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Music className="h-8 w-8 text-brand-500" />
                    <div>
                      <p className="font-medium">{audioFile?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {audioFile && `${(audioFile.size / 1024 / 1024).toFixed(2)} MB`} • {formData.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={toggleAudioPreview}
                      className="flex items-center gap-2 bg-transparent"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {isPlaying ? "Pause" : "Preview"}
                    </Button>
                    <Button type="button" variant="destructive" size="sm" onClick={removeAudio}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Trim controls */}
                {audioDurationSec > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm">Trim range (40s)</Label>
                    <input
                      type="range"
                      min={0}
                      max={Math.max(0, audioDurationSec - 40)}
                      step={0.1}
                      value={Math.min(trimStartSec, Math.max(0, audioDurationSec - 40))}
                      onChange={(e) => setTrimStartSec(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        Start: {new Date(Math.floor(Math.min(trimStartSec, audioDurationSec) * 1000)).toISOString().substr(14, 5)}
                      </span>
                      <span>
                        End: {new Date(Math.floor(Math.min(trimStartSec + 40, audioDurationSec) * 1000)).toISOString().substr(14, 5)}
                      </span>
                    </div>
                  </div>
                )}

                {/* MP3 only export (no selector) */}
                <div className="space-y-1">
                  <Label className="text-sm">Formato esportazione</Label>
                  <p className="text-xs">MP3 128 kbps (nessun ricampionamento, nessuna conversione in mono)</p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <Label htmlFor="audio-upload" className="cursor-pointer">
                    <span className="text-brand-500 hover:text-brand-400">Click to upload</span> or drag and drop
                  </Label>
                  <p className="text-sm text-muted-foreground">MP3, WAV up to 50MB</p>
                </div>
                <Input
                  id="audio-upload"
                  type="file"
                  accept="audio/mp3,audio/wav,audio/mpeg,.mp3,.wav"
                  onChange={handleAudioUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter beat title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="producer">Producer</Label>
            <Input
              id="producer"
              value={formData.producer}
              onChange={(e) => handleInputChange("producer", e.target.value)}
              placeholder="Producer name"
            />
          </div>
        </div>

        {/* Musical Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bpm">BPM *</Label>
            <Input
              id="bpm"
              type="number"
              min="60"
              max="200"
              value={formData.bpm}
              onChange={(e) => handleInputChange("bpm", e.target.value)}
              placeholder="140"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="key">Key *</Label>
            <Select value={formData.key} onValueChange={(value) => handleInputChange("key", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select key" />
              </SelectTrigger>
              <SelectContent>
                {keys.map((key) => (
                  <SelectItem key={key} value={key}>
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              value={formData.duration}
              onChange={(e) => handleInputChange("duration", e.target.value)}
              placeholder="3:30"
            />
          </div>
        </div>

        {/* Genres */}
        <div className="space-y-2">
          <Label htmlFor="genre">Genres *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {formData.genres.length === 0
                  ? "Select genres"
                  : formData.genres.length === 1
                    ? formData.genres[0]
                    : `${formData.genres[0]} +${formData.genres.length - 1}`}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="z-[70] w-[var(--radix-popover-trigger-width)] max-h-60 overflow-y-auto p-2"
              align="start"
              sideOffset={6}
              onWheel={(event) => event.stopPropagation()}
              onTouchMove={(event) => event.stopPropagation()}
            >
              <div className="flex flex-col gap-1 overscroll-contain pr-1">
                {genreOptions.map((genre) => {
                  const isSelected = formData.genres.includes(genre)
                  return (
                    <label
                      key={genre}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted cursor-pointer"
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => handleGenreToggle(genre, Boolean(checked))}
                      />
                      <span className="truncate">{genre}</span>
                    </label>
                  )
                })}
              </div>
            </PopoverContent>
          </Popover>

          {formData.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.genres.map((genre) => (
                <Badge key={genre} variant="secondary" className="flex items-center gap-1">
                  {genre}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => handleGenreToggle(genre, false)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Categories with Checkboxes */}
        <div className="space-y-3">
          <Label>Categories</Label>
          <p className="text-sm text-muted-foreground">Select one or more categories for your beat</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {categories.map((category) => (
              <Card key={category.value} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id={category.value}
                      checked={formData.categories.includes(category.value)}
                      onCheckedChange={(checked) => handleCategoryChange(category.value as BeatCategory, checked as boolean)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <Label htmlFor={category.value} className="cursor-pointer font-medium text-sm">
                        {category.label}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">{category.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected Categories Display */}
          {formData.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.categories.map((categoryValue) => {
                const category = categories.find((c) => c.value === categoryValue)
                return (
                  <Badge
                    key={categoryValue}
                    variant="secondary"
                    className={`flex items-center gap-1 ${category?.color || "bg-gray-100"}`}
                  >
                    {category?.label}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => handleCategoryChange(categoryValue as BeatCategory, false)}
                    />
                  </Badge>
                )
              })}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag"
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            />
            <Button type="button" onClick={addTag} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Describe your beat..."
            rows={3}
          />
        </div>

        {/* BeatStars Link */}
        <div className="space-y-2">
          <Label htmlFor="beatstarsLink">BeatStars Link</Label>
          <Input
            id="beatstarsLink"
            value={formData.beatstarsLink}
            onChange={(e) => handleInputChange("beatstarsLink", e.target.value)}
            placeholder="https://beatstars.com/your-beat"
          />
        </div>

        {/* Submit Status */}
        <AnimatePresence>
          {submitStatus === "success" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg"
            >
              <CheckCircle className="h-5 w-5" />
              <span>Beat uploaded successfully!</span>
            </motion.div>
          )}

          {submitStatus === "error" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg"
            >
              <AlertCircle className="h-5 w-5" />
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <Button type="submit" className="w-full bg-brand-600 hover:bg-brand-500" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading Beat...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload Beat
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
