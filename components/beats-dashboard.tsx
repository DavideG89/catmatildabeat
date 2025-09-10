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
import { Edit, MoreVertical, Trash, Eye, ExternalLink } from "lucide-react"
import { useBeats } from "@/components/beats-context"

export default function BeatsDashboard() {
  const { beats, updateBeat, deleteBeat } = useBeats()
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
    if (confirm("Are you sure you want to delete this beat?")) {
      deleteBeat(beatId)
    }
  }

  const handleSaveEdit = () => {
    if (editingBeat) {
      updateBeat(editingBeat.id, editingBeat)
      setEditingBeat(null)
    }
  }

  const handleBuyNow = (beatstarsLink: string) => {
    if (beatstarsLink) {
      window.open(beatstarsLink, "_blank")
    } else {
      alert("No BeatStars link available for this beat")
    }
  }

  return (
    <div className="bg-zinc-900 rounded-xl p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold">My Beats</h2>
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search beats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-zinc-800 text-white px-4 py-2 rounded-md w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Beat</TableHead>
              <TableHead className="hidden sm:table-cell">Genre</TableHead>
              <TableHead className="hidden md:table-cell">BPM / Key</TableHead>
              <TableHead className="hidden sm:table-cell">Price</TableHead>
              <TableHead className="hidden lg:table-cell">Sales</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBeats.map((beat) => (
              <TableRow key={beat.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      src={beat.coverImage || "/placeholder.svg"}
                      alt={beat.title}
                      width={40}
                      height={40}
                      className="rounded-md flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="font-medium text-sm truncate block">{beat.title}</span>
                      <span className="text-xs text-muted-foreground sm:hidden">{beat.genre}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{beat.genre}</TableCell>
                <TableCell className="hidden md:table-cell text-sm">
                  {beat.bpm} BPM / {beat.key}
                </TableCell>
                <TableCell className="hidden sm:table-cell">${beat.price.toFixed(2)}</TableCell>
                <TableCell className="hidden lg:table-cell">{beat.sales || 0}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge
                    variant={beat.status === "Active" ? "default" : "secondary"}
                    className={beat.status === "Active" ? "bg-green-600" : "bg-zinc-600"}
                  >
                    {beat.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
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
                      <DropdownMenuItem onClick={() => handleBuyNow(beat.beatstarsLink)}>
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
            {searchTerm ? "No beats found matching your search." : "No beats uploaded yet."}
          </p>
        </div>
      )}

      {/* View Dialog */}
      <Dialog open={!!viewingBeat} onOpenChange={() => setViewingBeat(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Beat Details</DialogTitle>
            <DialogDescription>View beat information</DialogDescription>
          </DialogHeader>
          {viewingBeat && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Image
                  src={viewingBeat.coverImage || "/placeholder.svg"}
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
                    <Badge className={viewingBeat.status === "Active" ? "bg-green-600" : "bg-zinc-600"}>
                      {viewingBeat.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Price</Label>
                  <p className="font-bold">${viewingBeat.price}</p>
                </div>
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
              {viewingBeat.beatstarsLink && (
                <div>
                  <Label>BeatStars Link</Label>
                  <p className="text-sm text-muted-foreground break-all">{viewingBeat.beatstarsLink}</p>
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
            <DialogTitle>Edit Beat</DialogTitle>
            <DialogDescription>Update beat information</DialogDescription>
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
                  <Input
                    id="edit-genre"
                    value={editingBeat.genre}
                    onChange={(e) => setEditingBeat({ ...editingBeat, genre: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                  <Label htmlFor="edit-price">Price</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    value={editingBeat.price}
                    onChange={(e) => setEditingBeat({ ...editingBeat, price: Number.parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-beatstars-link">BeatStars Link</Label>
                <Input
                  id="edit-beatstars-link"
                  value={editingBeat.beatstarsLink}
                  onChange={(e) => setEditingBeat({ ...editingBeat, beatstarsLink: e.target.value })}
                  placeholder="https://beatstars.com/catmatildabeat/your-beat"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingBeat(null)} className="w-full sm:w-auto">
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
