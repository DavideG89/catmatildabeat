"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { beatOperations, subscribeToBeats, type Beat } from "@/lib/supabase"

interface BeatsContextType {
  beats: Beat[]
  loading: boolean
  error: string | null
  addBeat: (beat: Omit<Beat, "id" | "created_at" | "updated_at">) => Promise<Beat | null>
  updateBeat: (id: string, beat: Partial<Beat>) => Promise<Beat | null>
  deleteBeat: (id: string) => Promise<boolean>
  searchBeats: (query: string, filters?: any) => Promise<Beat[]>
  refreshBeats: () => Promise<void>
  getActiveBeat: (id: string) => Beat | null
  getActiveBeats: () => Beat[]
  getBeatsByCategory: (category: "trending" | "featured" | "new_releases" | "latest") => Beat[]
}

const BeatsContext = createContext<BeatsContextType | undefined>(undefined)

export function BeatsProvider({ children }: { children: ReactNode }) {
  const [beats, setBeats] = useState<Beat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load beats from Supabase
  const loadBeats = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await beatOperations.getAll()
      setBeats(data)
    } catch (error) {
      console.error("Error loading beats:", error)
      setError("Failed to load beats")
    } finally {
      setLoading(false)
    }
  }, [])

  // Set up real-time subscription
  useEffect(() => {
    // Initial load
    loadBeats()

    // Set up real-time subscription
    const subscription = subscribeToBeats((payload) => {
      console.log("Real-time update received:", payload)

      switch (payload.eventType) {
        case "INSERT":
          setBeats((prev) => {
            const newBeat = payload.new as Beat
            // Check if beat already exists to prevent duplicates
            if (prev.some((beat) => beat.id === newBeat.id)) {
              return prev
            }
            return [newBeat, ...prev]
          })
          break

        case "UPDATE":
          setBeats((prev) => prev.map((beat) => (beat.id === payload.new.id ? (payload.new as Beat) : beat)))
          break

        case "DELETE":
          setBeats((prev) => prev.filter((beat) => beat.id !== payload.old.id))
          break

        default:
          console.log("Unknown event type:", payload.eventType)
      }
    })

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [loadBeats])

  // Add new beat
  const addBeat = async (beatData: Omit<Beat, "id" | "created_at" | "updated_at">): Promise<Beat | null> => {
    try {
      const newBeat = await beatOperations.create(beatData)
      if (newBeat) {
        // Real-time subscription will handle the state update
        return newBeat
      }
      return null
    } catch (error) {
      console.error("Error adding beat:", error)
      setError("Failed to add beat")
      return null
    }
  }

  // Update existing beat
  const updateBeat = async (id: string, updates: Partial<Beat>): Promise<Beat | null> => {
    try {
      const updatedBeat = await beatOperations.update(id, updates)
      if (updatedBeat) {
        // Real-time subscription will handle the state update
        return updatedBeat
      }
      return null
    } catch (error) {
      console.error("Error updating beat:", error)
      setError("Failed to update beat")
      return null
    }
  }

  // Delete beat
  const deleteBeat = async (id: string): Promise<boolean> => {
    try {
      const success = await beatOperations.delete(id)
      if (success) {
        // Real-time subscription will handle the state update
        return true
      }
      return false
    } catch (error) {
      console.error("Error deleting beat:", error)
      setError("Failed to delete beat")
      return false
    }
  }

  // Search beats
  const searchBeats = async (query: string, filters?: any): Promise<Beat[]> => {
    try {
      return await beatOperations.search(query, filters)
    } catch (error) {
      console.error("Error searching beats:", error)
      setError("Failed to search beats")
      return []
    }
  }

  // Refresh beats manually
  const refreshBeats = async () => {
    await loadBeats()
  }

  // Get single active beat
  const getActiveBeat = (id: string): Beat | null => {
    return beats.find((beat) => beat.id === id && beat.status === "active") || null
  }

  // Get all active beats
  const getActiveBeats = (): Beat[] => {
    return beats.filter((beat) => beat.status === "active")
  }

  // Get beats by category
  const getBeatsByCategory = (category: "trending" | "featured" | "new_releases" | "latest"): Beat[] => {
    return beats.filter((beat) => beat.status === "active" && beat.category === category)
  }

  const value: BeatsContextType = {
    beats,
    loading,
    error,
    addBeat,
    updateBeat,
    deleteBeat,
    searchBeats,
    refreshBeats,
    getActiveBeat,
    getActiveBeats,
    getBeatsByCategory,
  }

  return <BeatsContext.Provider value={value}>{children}</BeatsContext.Provider>
}

export function useBeats() {
  const context = useContext(BeatsContext)
  if (context === undefined) {
    throw new Error("useBeats must be used within a BeatsProvider")
  }
  return context
}
