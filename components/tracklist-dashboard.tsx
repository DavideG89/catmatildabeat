"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, MoreVertical, Trash, Eye, ExternalLink, Play, Pause } from "lucide-react"
import { useBeats } from "@/components/beats-context"
import { useAudioPlayer } from "@/components/audio-player-context"

export default function TracklistDashboard() {
  const { beats, updateBeat, deleteBeat } = useBeats()
  const { setCurrentTrack, currentTrack, isPlaying } = useAudioPlayer()
  const [searchTerm, setSearchTerm] = useState("")
  const [editingBeat, setEditingBeat] = useState<any>(null)
  const [viewingBeat, setViewingBeat] = useState<any>(null)

  const filteredBeats = beats.filter(
    (beat) =>
      beat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beat.genre.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (beat: any) => {
    setEditingBeat({ ...beat })
  }

  const handleView = (beat: any) => {
    setViewingBeat(beat)
  }

  const handleDelete = (beatId: string) => {
    if (confirm("Are you sure you want to delete this track?")) {
      deleteBeat(beatId)
    }
  }

  const handleSaveEdit = () => {
    if (editingBeat) {
      updateBeat(editingBeat.id, editingBeat)
      setEditingBeat(null)
    }
  }

  const handlePlayPreview = (beat: any) => {
    const track = {
      id: beat.id,
      title: beat.title,
      artist: beat.producer,
      coverImage: beat.cover_image || "/placeholder.svg",
      audioSrc: beat.audio_file || "/demo-beat.mp3",
      type: "beat" as const,
      beatstarsLink: beat.beatstars_link,
      durationString: beat.duration || "3:00",
    }

    if (currentTrack?.id === beat.id && isPlaying) {
      setCurrentTrack(null)
    } else {
      setCurrentTrack(track)
    }
  }

  const handleBuyNow = (beatstarsLink?: string) => {
    if (beatstarsLink) {
      window.open(beatstarsLink, "_blank")
    } else {
      alert("No BeatStars link available for this track")
    }
  }

  const isCurrentlyPlaying = (beatId: string) => {
    return currentTrack?.id === beatId && isPlaying
  }

  return (
    <div className="bg-zinc-900 rounded-xl p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold">Tracklist Management</h2>
        <div className="flex gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search tracks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-zinc-800 text-white px-4 py-2 rounded-md flex-1 sm:w-64 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead className="min-w-[200px]">Track</TableHead>
              <TableHead className="hidden sm:table-cell">Genre</TableHead>
              <TableHead className="hidden md:table-cell">BPM</TableHead>
              <TableHead className="hidden md:table-cell">Key</TableHead>
              <TableHead className="hidden lg:table-cell">Duration</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBeats.map((beat, index) => (
              <TableRow key={beat.id} className="group">
                <TableCell>
                  <Button
                    variant="tertiary"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handlePlayPreview(beat)}
                  >
                    {isCurrentlyPlaying(beat.id) ? (
                      <Pause className="h-4 w-4 text-brand-500" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      src={beat.cover_image || "/placeholder.svg"}
                      alt={beat.title}
                      width={40}
                      height={40}
                      className="rounded-md flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <span
                        className={`font-medium text-sm truncate block ${
                          isCurrentlyPlaying(beat.id) ? "text-brand-500" : ""
                        }`}
                      >
                        {beat.title}
                      </span>
                      <span className="text-xs text-muted-foreground sm:hidden">{beat.genre}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{beat.genre}</TableCell>
                <TableCell className="hidden md:table-cell">{beat.bpm}</TableCell>
                <TableCell className="hidden md:table-cell">{beat.key}</TableCell>
                <TableCell className="hidden lg:table-cell">{beat.duration || "3:00"}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge
                    variant={beat.status === "active" ? "default" : "secondary"}
                    className={beat.status === "active" ? "bg-green-600" : "bg-zinc-600"}
                  >
                    {beat.status === "active"
                      ? "Active"
                      : beat.status === "draft"
                        ? "Draft"
                        : "Archived"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="tertiary" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(beat)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(beat)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBuyNow(beat.beatstars_link)}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Buy on BeatStars
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500" onClick={() => handleDelete(beat.id)}>
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredBeats.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {searchTerm ? "No tracks found matching your search." : "No tracks uploaded yet."}
          </p>
        </div>
      )}

      {/* View Dialog */}
      <Dialog open={!!viewingBeat} onOpenChange={() => setViewingBeat(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Track Details</DialogTitle>
            <DialogDescription>View track information</DialogDescription>
          </DialogHeader>
          {viewingBeat && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Image
                  src={viewingBeat.cover_image || "/placeholder.svg"}
                  alt={viewingBeat.title}
                  width={100}
                  height={100}
                  className="rounded-lg flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-bold">{viewingBeat.title}</h3>
                  <p className="text-muted-foreground">{viewingBeat.genre}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge>{viewingBeat.bpm} BPM</Badge>
                    <Badge>{viewingBeat.key}</Badge>
                    <Badge>{viewingBeat.duration || "3:00"}</Badge>
                    <Badge className={viewingBeat.status === "active" ? "bg-green-600" : "bg-zinc-600"}>
                      {viewingBeat.status === "active"
                        ? "Active"
                        : viewingBeat.status === "draft"
                          ? "Draft"
                          : "Archived"}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Sales</Label>
                  <p className="font-bold">{viewingBeat.sales || 0}</p>
                </div>
              </div>
              {viewingBeat.description && (
                <div>
                  <Label>Description</Label>
                  <p className="text-sm text-muted-foreground">{viewingBeat.description}</p>
                </div>
              )}
              {viewingBeat.beatstars_link && (
                <div>
                  <Label>BeatStars Link</Label>
                  <p className="text-sm text-muted-foreground break-all">{viewingBeat.beatstars_link}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingBeat} onOpenChange={() => setEditingBeat(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Track</DialogTitle>
            <DialogDescription>Update track information</DialogDescription>
          </DialogHeader>
          {editingBeat && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editingBeat.title}
                    onChange={(e) => setEditingBeat({ ...editingBeat, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-genre">Genre</Label>
                  <Select
                    value={editingBeat.genre}
                    onValueChange={(value) => setEditingBeat({ ...editingBeat, genre: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alternative HipHop">Alternative HipHop</SelectItem>
                      <SelectItem value="Alternative Rock">Alternative Rock</SelectItem>
                      <SelectItem value="Ambient">Ambient</SelectItem>
                      <SelectItem value="Ambient Electronic">Ambient Electronic</SelectItem>
                      <SelectItem value="Boom Bap / Old school">Boom Bap / Old school</SelectItem>
                      <SelectItem value="Cinematic Emotional">Cinematic Emotional</SelectItem>
                      <SelectItem value="Electronic">Electronic</SelectItem>
                      <SelectItem value="Funk">Funk</SelectItem>
                      <SelectItem value="FunkRock">FunkRock</SelectItem>
                      <SelectItem value="HipHop">HipHop</SelectItem>
                      <SelectItem value="Indie">Indie</SelectItem>
                      <SelectItem value="Lo-Fi">Lo-Fi</SelectItem>
                      <SelectItem value="Rap">Rap</SelectItem>
                      <SelectItem value="Rock">Rock</SelectItem>
                      <SelectItem value="Synthwave">Synthwave</SelectItem>
                      <SelectItem value="Trip Hop">Trip Hop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="edit-bpm">BPM</Label>
                  <Input
                    id="edit-bpm"
                    type="number"
                    value={editingBeat.bpm}
                    onChange={(e) => setEditingBeat({ ...editingBeat, bpm: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-key">Key</Label>
                  <Input
                    id="edit-key"
                    value={editingBeat.key}
                    onChange={(e) => setEditingBeat({ ...editingBeat, key: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-duration">Duration</Label>
                  <Input
                    id="edit-duration"
                    value={editingBeat.duration || "3:00"}
                    onChange={(e) => setEditingBeat({ ...editingBeat, duration: e.target.value })}
                    placeholder="3:00"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editingBeat.status}
                    onValueChange={(value) => setEditingBeat({ ...editingBeat, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingBeat.description || ""}
                  onChange={(e) => setEditingBeat({ ...editingBeat, description: e.target.value })}
                  placeholder="Track description..."
                />
              </div>
              <div>
                <Label htmlFor="edit-beatstars-link">BeatStars Link</Label>
                <Input
                  id="edit-beatstars-link"
                  value={editingBeat.beatstars_link || ""}
                  onChange={(e) => setEditingBeat({ ...editingBeat, beatstars_link: e.target.value })}
                  placeholder="https://beatstars.com/catmatildabeat/your-beat"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <Button variant="secondary" onClick={() => setEditingBeat(null)} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit} className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
