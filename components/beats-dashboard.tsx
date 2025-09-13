"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, Edit, Trash2, Eye, TrendingUp, Music, Star, Clock } from "lucide-react"
import { useBeats } from "@/components/beats-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

const categories = [
  { value: "trending", label: "Trending" },
  { value: "featured", label: "Featured" },
  { value: "new_releases", label: "New Releases" },
  { value: "latest", label: "Latest Tracks" },
]

export default function BeatsDashboard() {
  const { beats, loading, deleteBeat, updateBeat } = useBeats()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingBeat, setEditingBeat] = useState<any>(null)
  const [editForm, setEditForm] = useState({
    title: "",
    producer: "",
    genre: "",
    bpm: "",
    key: "",
    category: "",
    beatstarsLink: "",
    tags: [] as string[],
  })
  const [newEditTag, setNewEditTag] = useState("")

  // Filter beats based on search and category
  const filteredBeats = useMemo(() => {
    let filtered = beats

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (beat) =>
          beat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          beat.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          beat.producer.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((beat) => beat.category === selectedCategory)
    }

    return filtered
  }, [beats, searchQuery, selectedCategory])

  // Group beats by category for overview cards
  const beatsByCategory = useMemo(() => {
    return {
      trending: beats.filter((beat) => beat.category === "trending" && beat.status === "active"),
      featured: beats.filter((beat) => beat.category === "featured" && beat.status === "active"),
      new_releases: beats.filter((beat) => beat.category === "new_releases" && beat.status === "active"),
      latest: beats.filter((beat) => beat.category === "latest" && beat.status === "active"),
    }
  }, [beats])

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this beat?")) {
      await deleteBeat(id)
    }
  }

  const handleStatusChange = async (id: string, newStatus: "active" | "draft" | "archived") => {
    await updateBeat(id, { status: newStatus })
  }

  const handleEdit = (beat: any) => {
    setEditingBeat(beat)
    setEditForm({
      title: beat.title || "",
      producer: beat.producer || "",
      genre: beat.genre || "",
      bpm: beat.bpm?.toString() || "",
      key: beat.key || "",
      category: beat.category || "",
      beatstarsLink: beat.beatstars_link || "",
      tags: Array.isArray(beat.tags) ? beat.tags : [],
    })
    setIsEditModalOpen(true)
  }

  const handleView = (id: string) => {
    // In a real app, this would navigate to beat detail page
    console.log("View beat:", id)
    // router.push(`/beats/${id}`)
  }

  const handleSaveEdit = async () => {
    if (!editingBeat) return

    try {
      await updateBeat(editingBeat.id, {
        title: editForm.title,
        producer: editForm.producer,
        genre: editForm.genre,
        bpm: Number.parseInt(editForm.bpm) || 0,
        key: editForm.key,
        category: editForm.category as "trending" | "featured" | "new_releases" | "latest",
        beatstars_link: editForm.beatstarsLink,
        tags: editForm.tags,
      })
      setIsEditModalOpen(false)
      setEditingBeat(null)
    } catch (error) {
      console.error("Error updating beat:", error)
    }
  }

  const handleCancelEdit = () => {
    setIsEditModalOpen(false)
    setEditingBeat(null)
    setEditForm({
      title: "",
      producer: "",
      genre: "",
      bpm: "",
      key: "",
      category: "",
      beatstarsLink: "",
      tags: [],
    })
    setNewEditTag("")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>
      case "archived":
        return <Badge className="bg-gray-100 text-gray-800">Archived</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "trending":
        return <Badge className="bg-orange-100 text-orange-800">Trending</Badge>
      case "featured":
        return <Badge className="bg-blue-100 text-blue-800">Featured</Badge>
      case "new_releases":
        return <Badge className="bg-green-100 text-green-800">New Release</Badge>
      case "latest":
        return <Badge className="bg-purple-100 text-purple-800">Latest</Badge>
      default:
        return <Badge>{category}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      {/* Category Overview Cards - Single instance of each */}
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-4 min-w-max md:min-w-0">
        {/* Trending Card */}
        <Card className="border-orange-200 bg-orange-50 min-w-[220px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-800">Trending</p>
                <p className="text-2xl font-bold text-orange-900">{beatsByCategory.trending.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        {/* Featured Card */}
        <Card className="border-blue-200 bg-blue-50 min-w-[220px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Featured</p>
                <p className="text-2xl font-bold text-blue-900">{beatsByCategory.featured.length}</p>
              </div>
              <Star className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        {/* New Releases Card */}
        <Card className="border-green-200 bg-green-50 min-w-[220px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">New Releases</p>
                <p className="text-2xl font-bold text-green-900">{beatsByCategory.new_releases.length}</p>
              </div>
              <Music className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        {/* Latest Card */}
        <Card className="border-purple-200 bg-purple-50 min-w-[220px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-800">Latest</p>
                <p className="text-2xl font-bold text-purple-900">{beatsByCategory.latest.length}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search beats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-black"
          />
        </div>
        {/* Mobile: category select */}
        <div className="sm:hidden">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Desktop: tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="hidden sm:block">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="new_releases">New</TabsTrigger>
            <TabsTrigger value="latest">Latest</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Beats Table */}
      <Card>
          <CardHeader>
            <CardTitle className="text-foreground">My Beats ({filteredBeats.length})</CardTitle>
            <CardDescription className="text-foreground">Manage your beat collection</CardDescription>
          </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cover</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>BPM</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBeats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      No beats found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBeats.map((beat) => (
                    <TableRow key={beat.id}>
                      <TableCell>
                        <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden">
                          <img
                            src={beat.cover_image || "/placeholder.svg?height=48&width=48"}
                            alt={beat.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{beat.title}</p>
                          <p className="text-sm text-gray-500">{beat.producer}</p>
                        </div>
                      </TableCell>
                      <TableCell>{beat.genre}</TableCell>
                      <TableCell>{beat.bpm}</TableCell>
                      <TableCell>{beat.key}</TableCell>
                      <TableCell>{getCategoryBadge(beat.category)}</TableCell>
                      <TableCell>{getStatusBadge(beat.status)}</TableCell>
                      <TableCell>{beat.sales || 0}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(beat.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(beat)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(beat.id, beat.status === "active" ? "draft" : "active")}
                            >
                              {beat.status === "active" ? "Set to Draft" : "Set to Active"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(beat.id)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Beat</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-3">
              <Label htmlFor="title" className="sm:text-right">
                Title
              </Label>
              <Input
                id="title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="sm:col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-3">
              <Label htmlFor="producer" className="sm:text-right">
                Artist
              </Label>
              <Input
                id="producer"
                value={editForm.producer}
                onChange={(e) => setEditForm({ ...editForm, producer: e.target.value })}
                className="sm:col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-3">
              <Label htmlFor="genre" className="sm:text-right">
                Genre
              </Label>
              <Input
                id="genre"
                value={editForm.genre}
                onChange={(e) => setEditForm({ ...editForm, genre: e.target.value })}
                className="sm:col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-3">
              <Label htmlFor="bpm" className="sm:text-right">
                BPM
              </Label>
              <Input
                id="bpm"
                type="number"
                value={editForm.bpm}
                onChange={(e) => setEditForm({ ...editForm, bpm: e.target.value })}
                className="sm:col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-3">
              <Label htmlFor="key" className="sm:text-right">
                Key
              </Label>
              <Input
                id="key"
                value={editForm.key}
                onChange={(e) => setEditForm({ ...editForm, key: e.target.value })}
                className="sm:col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-3">
              <Label htmlFor="category" className="sm:text-right">
                Category
              </Label>
              <Select
                value={editForm.category}
                onValueChange={(value) => setEditForm({ ...editForm, category: value })}
              >
                <SelectTrigger className="sm:col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-3">
              <Label htmlFor="beatstarsLink" className="sm:text-right">
                BeatStars Link
              </Label>
              <Input
                id="beatstarsLink"
                value={editForm.beatstarsLink}
                onChange={(e) => setEditForm({ ...editForm, beatstarsLink: e.target.value })}
                placeholder="https://beatstars.com/your-beat"
                className="sm:col-span-3"
              />
            </div>

            {/* Tags editor */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-3">
              <Label className="sm:text-right">Tags</Label>
              <div className="sm:col-span-3 space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newEditTag}
                    onChange={(e) => setNewEditTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newEditTag.trim() && !editForm.tags.includes(newEditTag.trim())) {
                          setEditForm({ ...editForm, tags: [...editForm.tags, newEditTag.trim()] })
                          setNewEditTag("")
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (newEditTag.trim() && !editForm.tags.includes(newEditTag.trim())) {
                        setEditForm({ ...editForm, tags: [...editForm.tags, newEditTag.trim()] })
                        setNewEditTag("")
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                {editForm.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {editForm.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <span
                          role="button"
                          aria-label={`Remove ${tag}`}
                          className="ml-1 cursor-pointer"
                          onClick={() => setEditForm({ ...editForm, tags: editForm.tags.filter((t) => t !== tag) })}
                        >
                          ×
                        </span>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
