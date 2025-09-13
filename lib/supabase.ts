import { createClient } from "@supabase/supabase-js"

// Prefer env vars; fallback to existing values (replace these in .env.local)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tdaoebkpidwdhwevospu.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkYW9lYmtwaWR3ZGh3ZXZvc3B1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NzQzNjUsImV4cCI6MjA3MzA1MDM2NX0.2pF02bCD90FZfGuSjCB2Prs7BFMBnPLLyJ50F9RmEEM"

// Create Supabase client with real-time configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Database types
export interface Beat {
  id: string
  title: string
  producer: string
  cover_image: string
  audio_file?: string
  bpm: number
  key: string
  genre: string
  tags: string[]
  status: "active" | "draft" | "archived"
  category: "trending" | "featured" | "new_releases" | "latest"
  beatstars_link: string
  sales: number
  description: string
  duration: string
  price: number
  created_at: string
  updated_at: string
}

// Database operations with error handling
export const beatOperations = {
  // Expose supabase client for direct access
  supabase,

  // Get all beats
  async getAll(): Promise<Beat[]> {
    try {
      const { data, error } = await supabase.from("beats").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching beats:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Unexpected error fetching beats:", error)
      return []
    }
  },

  // Get active beats only
  async getActive(): Promise<Beat[]> {
    try {
      const { data, error } = await supabase
        .from("beats")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching active beats:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Unexpected error fetching active beats:", error)
      return []
    }
  },

  // Get beats by category
  async getByCategory(category: "trending" | "featured" | "new_releases" | "latest"): Promise<Beat[]> {
    try {
      const { data, error } = await supabase
        .from("beats")
        .select("*")
        .eq("status", "active")
        .eq("category", category)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching beats by category:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Unexpected error fetching beats by category:", error)
      return []
    }
  },

  // Get beat by ID
  async getById(id: string): Promise<Beat | null> {
    try {
      const { data, error } = await supabase.from("beats").select("*").eq("id", id).single()

      if (error) {
        console.error("Error fetching beat:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Unexpected error fetching beat:", error)
      return null
    }
  },

  // Create new beat
  async create(beat: Omit<Beat, "id" | "created_at" | "updated_at">): Promise<Beat | null> {
    try {
      const { data, error } = await supabase.from("beats").insert([beat]).select().single()

      if (error) {
        console.error("Error creating beat:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Unexpected error creating beat:", error)
      return null
    }
  },

  // Update beat
  async update(id: string, updates: Partial<Beat>): Promise<Beat | null> {
    try {
      const { data, error } = await supabase
        .from("beats")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()

      if (error) {
        console.error("Error updating beat:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Unexpected error updating beat:", error)
      return null
    }
  },

  // Delete beat
  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("beats").delete().eq("id", id)

      if (error) {
        console.error("Error deleting beat:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Unexpected error deleting beat:", error)
      return false
    }
  },

  // Search beats with filters
  async search(query: string, filters?: any): Promise<Beat[]> {
    try {
      let queryBuilder = supabase.from("beats").select("*").eq("status", "active")

      if (query) {
        queryBuilder = queryBuilder.or(
          `title.ilike.%${query}%,genre.ilike.%${query}%,producer.ilike.%${query}%,description.ilike.%${query}%`,
        )
      }

      if (filters?.genres && filters.genres.length > 0) {
        queryBuilder = queryBuilder.in("genre", filters.genres)
      }

      if (filters?.keys && filters.keys.length > 0) {
        queryBuilder = queryBuilder.in("key", filters.keys)
      }

      if (filters?.bpmRange && filters.bpmRange.length === 2) {
        queryBuilder = queryBuilder.gte("bpm", filters.bpmRange[0]).lte("bpm", filters.bpmRange[1])
      }

      const { data, error } = await queryBuilder.order("created_at", { ascending: false })

      if (error) {
        console.error("Error searching beats:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Unexpected error searching beats:", error)
      return []
    }
  },

  // Get unique genres from database
  async getUniqueGenres(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from("beats")
        .select("genre")
        .eq("status", "active")
        .not("genre", "is", null)

      if (error) {
        console.error("Error fetching genres:", error)
        return []
      }

      // Extract unique genres and filter out empty values
      const uniqueGenres = [...new Set(data.map((item) => item.genre).filter(Boolean))]
      return uniqueGenres.sort()
    } catch (error) {
      console.error("Unexpected error fetching genres:", error)
      return []
    }
  },

  // Get unique keys from database
  async getUniqueKeys(): Promise<string[]> {
    try {
      const { data, error } = await supabase.from("beats").select("key").eq("status", "active").not("key", "is", null)

      if (error) {
        console.error("Error fetching keys:", error)
        return []
      }

      // Extract unique keys and filter out empty values
      const uniqueKeys = [...new Set(data.map((item) => item.key).filter(Boolean))]
      return uniqueKeys.sort()
    } catch (error) {
      console.error("Unexpected error fetching keys:", error)
      return []
    }
  },

  // Upload image to Supabase Storage
  async uploadImage(file: File, beatId: string): Promise<string | null> {
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${beatId}.${fileExt}`
      const filePath = `covers/${fileName}`

      const { error: uploadError } = await supabase.storage.from("beat-covers").upload(filePath, file, {
        upsert: true,
      })

      if (uploadError) {
        console.error("Error uploading image:", uploadError)
        return null
      }

      const { data } = supabase.storage.from("beat-covers").getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error("Unexpected error uploading image:", error)
      return null
    }
  },

  // Upload audio file to Supabase Storage
  async uploadAudio(file: File, beatId: string): Promise<string | null> {
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${beatId}.${fileExt}`
      const filePath = `audio/${fileName}`

      const { error: uploadError } = await supabase.storage.from("beat-audio").upload(filePath, file, {
        upsert: true,
      })

      if (uploadError) {
        console.error("Error uploading audio:", uploadError)
        return null
      }

      const { data } = supabase.storage.from("beat-audio").getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error("Unexpected error uploading audio:", error)
      return null
    }
  },
}

// Real-time subscription helper
export const subscribeToBeats = (callback: (payload: any) => void) => {
  const subscription = supabase
    .channel("beats-realtime")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "beats",
      },
      callback,
    )
    .subscribe()

  return subscription
}
