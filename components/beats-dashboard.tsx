"use client"

import { useState, useMemo, type ChangeEvent } from "react"
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
import { beatOperations, type BeatCategory } from "@/lib/supabase"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

const categories: { value: BeatCategory; label: string }[] = [
  { value: "trending", label: "Trending" },
  { value: "featured", label: "Featured" },
  { value: "new_releases", label: "New Releases" },
  { value: "latest", label: "Latest Tracks" },
]

export default function BeatsDashboard() {
  const { beats, loading, deleteBeat, updateBeat } = useBeats()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<"all" | BeatCategory>("all")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingBeat, setEditingBeat] = useState<any>(null)
  const [editForm, setEditForm] = useState({
    title: "",
    producer: "",
    genre: "",
    bpm: "",
    key: "",
    categories: [] as BeatCategory[],
    beatstarsLink: "",
    tags: [] as string[],
    coverImage: "",
  })
  const [newEditTag, setNewEditTag] = useState("")
  const [newCoverFile, setNewCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [initialCoverImage, setInitialCoverImage] = useState<string>("")
  const [removeExistingCover, setRemoveExistingCover] = useState(false)

  const actionMenuItemClasses =
    "focus:bg-brand-100 focus:text-brand-900 data-[highlighted]:bg-brand-100 data-[highlighted]:text-brand-900"

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
      filtered = filtered.filter((beat) => beatHasCategory(beat, selectedCategory as BeatCategory))
    }

    return filtered
  }, [beats, searchQuery, selectedCategory])

  // Group beats by category for overview cards
  const beatsByCategory = useMemo(() => {
    return {
      trending: beats.filter((beat) => beat.status === "active" && beatHasCategory(beat, "trending")),
      featured: beats.filter((beat) => beat.status === "active" && beatHasCategory(beat, "featured")),
      new_releases: beats.filter((beat) => beat.status === "active" && beatHasCategory(beat, "new_releases")),
      latest: beats.filter((beat) => beat.status === "active" && beatHasCategory(beat, "latest")),
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
      categories: getBeatCategories(beat),
      beatstarsLink: beat.beatstars_link || "",
      tags: Array.isArray(beat.tags) ? beat.tags : [],
      coverImage: beat.cover_image || "",
    })
    setInitialCoverImage(beat.cover_image || "")
    setRemoveExistingCover(false)
    setNewCoverFile(null)
    setCoverPreview(beat.cover_image || null)
    setIsEditModalOpen(true)
  }

  const handleCoverImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setNewCoverFile(file)
    if (initialCoverImage) {
      setRemoveExistingCover(true)
    }

    const reader = new FileReader()
    reader.onload = (loadEvent) => {
      setCoverPreview((loadEvent.target?.result as string) || null)
    }
    reader.readAsDataURL(file)
  }

  const handleClearNewCover = () => {
    setNewCoverFile(null)
    if (initialCoverImage) {
      setRemoveExistingCover(false)
      setEditForm((prev) => ({ ...prev, coverImage: initialCoverImage }))
      setCoverPreview(initialCoverImage)
    } else {
      setCoverPreview(null)
      setEditForm((prev) => ({ ...prev, coverImage: "" }))
    }
  }

  const handleRemoveExistingCover = () => {
    if (!initialCoverImage) return

    setRemoveExistingCover(true)
    setNewCoverFile(null)
    setCoverPreview(null)
    setEditForm((prev) => ({ ...prev, coverImage: "" }))
  }

  const handleRestoreCover = () => {
    if (!initialCoverImage) return

    setRemoveExistingCover(false)
    setNewCoverFile(null)
    setCoverPreview(initialCoverImage)
    setEditForm((prev) => ({ ...prev, coverImage: initialCoverImage }))
  }

  const handleCategoryToggle = (categoryValue: BeatCategory, checked: boolean) => {
    setEditForm((prev) => ({
      ...prev,
      categories: checked
        ? Array.from(new Set([...prev.categories, categoryValue]))
        : prev.categories.filter((value) => value !== categoryValue),
    }))
  }

  const handleAddTag = () => {
    const nextTag = newEditTag.trim()
    if (!nextTag) return

    setEditForm((prev) => {
      if (prev.tags.includes(nextTag)) {
        return prev
      }
      return { ...prev, tags: [...prev.tags, nextTag] }
    })
    setNewEditTag("")
  }

  const handleView = (id: string) => {
    // In a real app, this would navigate to beat detail page
    console.log("View beat:", id)
    // router.push(`/beats/${id}`)
  }

  const handleSaveEdit = async () => {
    if (!editingBeat) return

    try {
      let coverImageUrl = initialCoverImage

      if (removeExistingCover && initialCoverImage) {
        const removed = await beatOperations.deleteImage(initialCoverImage)
        if (!removed) {
          throw new Error("Failed to delete existing cover image")
        }
        coverImageUrl = ""
      }

      if (newCoverFile) {
        const uploadedCoverUrl = await beatOperations.uploadImage(newCoverFile, editingBeat.id)
        if (uploadedCoverUrl) {
          coverImageUrl = uploadedCoverUrl
        } else {
          throw new Error("Failed to upload new cover image")
        }
      }

      const selectedCategories = editForm.categories.length > 0 ? editForm.categories : (["latest"] as BeatCategory[])

      await updateBeat(editingBeat.id, {
        title: editForm.title,
        producer: editForm.producer,
        genre: editForm.genre,
        bpm: Number.parseInt(editForm.bpm) || 0,
        key: editForm.key,
        category: selectedCategories[0],
        categories: selectedCategories,
        beatstars_link: editForm.beatstarsLink,
        tags: editForm.tags,
        cover_image: coverImageUrl,
      })
      setIsEditModalOpen(false)
      setEditingBeat(null)
      setNewCoverFile(null)
      setCoverPreview(null)
      setInitialCoverImage("")
      setRemoveExistingCover(false)
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
      categories: [],
      beatstarsLink: "",
      tags: [],
      coverImage: "",
    })
    setNewEditTag("")
    setNewCoverFile(null)
    setCoverPreview(null)
    setInitialCoverImage("")
    setRemoveExistingCover(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors">Active</Badge>
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors">Draft</Badge>
      case "archived":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors">Archived</Badge>
      default:
        return <Badge className="transition-colors hover:bg-muted">{status}</Badge>
    }
  }

  const getCategoryBadge = (category: BeatCategory) => {
    switch (category) {
      case "trending":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors">Trending</Badge>
      case "featured":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">Featured</Badge>
      case "new_releases":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors">New Release</Badge>
      case "latest":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors">Latest</Badge>
      default:
        return <Badge className="transition-colors hover:bg-muted">{category}</Badge>
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
          <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as "all" | BeatCategory)}>
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
        <Tabs
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value as "all" | BeatCategory)}
          className="hidden sm:block"
        >
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
                  <TableHead>Categories</TableHead>
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
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {getBeatCategories(beat).length > 0 ? (
                            getBeatCategories(beat).map((category) => (
                              <span key={`${beat.id}-${category}`}>{getCategoryBadge(category)}</span>
                            ))
                          ) : (
                            <Badge className="bg-muted text-muted-foreground">Unassigned</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(beat.status)}</TableCell>
                      <TableCell>{beat.sales || 0}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="tertiary" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className={actionMenuItemClasses} onClick={() => handleView(beat.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem className={actionMenuItemClasses} onClick={() => handleEdit(beat)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className={actionMenuItemClasses}
                              onClick={() => handleStatusChange(beat.id, beat.status === "active" ? "draft" : "active")}
                            >
                              {beat.status === "active" ? "Set to Draft" : "Set to Active"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className={cn(actionMenuItemClasses, "text-red-600 focus:text-red-700 data-[highlighted]:text-red-700")}
                              onClick={() => handleDelete(beat.id)}
                            >
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
        <DialogContent className="sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle>Edit Beat</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Cover Image</Label>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                <div className="w-32 h-32 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                  {coverPreview ? (
                    <img src={coverPreview} alt={editForm.title || "Beat cover"} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-muted-foreground">No image selected</span>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    id="edit-cover"
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    className="max-w-xs"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    {newCoverFile && (
                      <Button type="button" variant="secondary" onClick={handleClearNewCover}>
                        Cancel new image
                      </Button>
                    )}
                    {initialCoverImage && !newCoverFile && !removeExistingCover && (
                      <Button
                        type="button"
                        variant="primary"
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={handleRemoveExistingCover}
                      >
                        Remove current cover
                      </Button>
                    )}
                    {removeExistingCover && initialCoverImage && !newCoverFile && (
                      <Button type="button" variant="secondary" onClick={handleRestoreCover}>
                        Undo removal
                      </Button>
                    )}
                  </div>
                  {newCoverFile && (
                    <p className="text-xs text-muted-foreground">The new cover will replace the existing image when you save.</p>
                  )}
                  {removeExistingCover && !newCoverFile && initialCoverImage && (
                    <p className="text-xs text-muted-foreground">The existing cover will be deleted when you save.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="producer">Artist</Label>
              <Input
                id="producer"
                value={editForm.producer}
                onChange={(e) => setEditForm({ ...editForm, producer: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Input
                id="genre"
                value={editForm.genre}
                onChange={(e) => setEditForm({ ...editForm, genre: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bpm">BPM</Label>
              <Input
                id="bpm"
                type="number"
                value={editForm.bpm}
                onChange={(e) => setEditForm({ ...editForm, bpm: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="key">Key</Label>
              <Input
                id="key"
                value={editForm.key}
                onChange={(e) => setEditForm({ ...editForm, key: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Categories</Label>
                <p className="text-xs text-muted-foreground">Select one or more categories for this beat.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {categories.map((categoryOption) => (
                  <label
                    key={categoryOption.value}
                    htmlFor={`edit-category-${categoryOption.value}`}
                    className="flex items-start gap-2 rounded-md border border-border bg-background p-3 hover:bg-muted/40 transition-colors cursor-pointer"
                  >
                    <Checkbox
                      id={`edit-category-${categoryOption.value}`}
                      checked={editForm.categories.includes(categoryOption.value as BeatCategory)}
                      onCheckedChange={(checked) =>
                        handleCategoryToggle(categoryOption.value as BeatCategory, Boolean(checked))
                      }
                      className="mt-1"
                    />
                    <div className="space-y-1">
                      <span className="text-sm font-medium">{categoryOption.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {renderCategoryDescription(categoryOption.value as BeatCategory)}
                      </span>
                    </div>
                  </label>
                ))}
              </div>

              {editForm.categories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {editForm.categories.map((categoryValue) => (
                    <Badge key={categoryValue} variant="secondary" className="flex items-center gap-1">
                      {categories.find((c) => c.value === categoryValue)?.label || categoryValue}
                      <span
                        role="button"
                        aria-label={`Remove ${categoryValue}`}
                        className="cursor-pointer"
                        onClick={() => handleCategoryToggle(categoryValue, false)}
                      >
                        ×
                      </span>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No categories selected. Default will be Latest.</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="beatstarsLink">BeatStars Link</Label>
              <Input
                id="beatstarsLink"
                value={editForm.beatstarsLink}
                onChange={(e) => setEditForm({ ...editForm, beatstarsLink: e.target.value })}
                placeholder="https://beatstars.com/your-beat"
              />
            </div>

            {/* Tags editor */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tags</Label>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative w-full sm:max-w-sm">
                  <Input
                    value={newEditTag}
                    onChange={(e) => setNewEditTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                    className="pr-24"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddTag}
                    className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full px-3 text-sm"
                  >
                    Add
                  </Button>
                </div>
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
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const getBeatCategories = (beat: any): BeatCategory[] => {
  if (Array.isArray(beat?.categories) && beat.categories.length > 0) {
    return beat.categories as BeatCategory[]
  }
  if (beat?.category) {
    return [beat.category as BeatCategory]
  }
  return []
}

const beatHasCategory = (beat: any, category: BeatCategory): boolean => {
  return getBeatCategories(beat).includes(category)
}

const categoryDescriptions: Record<BeatCategory, string> = {
  trending: "Popular beats getting attention",
  featured: "Highlighted premium beats",
  new_releases: "Fresh beats just released",
  latest: "Recent additions to the catalog",
}

const renderCategoryDescription = (category: BeatCategory) => categoryDescriptions[category]
