"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Music, TrendingUp, DollarSign, Users } from "lucide-react"
import BeatsDashboard from "@/components/beats-dashboard"
import UploadBeatForm from "@/components/upload-beat-form"
import { useBeats } from "@/components/beats-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"
import { useCallback } from "react"

export default function DashboardPage() {
  const [showUploadForm, setShowUploadForm] = useState(false)
  const { beats, loading, getBeatsByCategory } = useBeats()

  // Calculate stats
  const activeBeats = beats.filter((beat) => beat.status === "active")
  const trendingBeats = getBeatsByCategory("trending")
  const featuredBeats = getBeatsByCategory("featured")
  const newReleases = getBeatsByCategory("new_releases")
  const latestBeats = getBeatsByCategory("latest")
  const totalSales = beats.reduce((sum, beat) => sum + (beat.sales || 0), 0)

  const handleSignOut = useCallback(async () => {
    try {
      await supabase.auth.signOut()
    } catch {}
    try {
      document.cookie = "is-logged-in=; Path=/; Max-Age=0; SameSite=Lax"
    } catch {}
    window.location.href = "/login"
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Producer Dashboard</h1>
          <p className="text-muted-foreground">Manage your beats and track performance</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Dialog open={showUploadForm} onOpenChange={setShowUploadForm}>
            <DialogTrigger asChild>
              <Button className="bg-brand-600 hover:bg-brand-500 w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Upload New Beat
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Upload New Beat</DialogTitle>
              </DialogHeader>
              <UploadBeatForm onSuccess={() => setShowUploadForm(false)} />
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={handleSignOut} className="w-full sm:w-auto">Sign Out</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="overflow-x-auto -mx-4 px-4 mb-8 md:mx-0 md:px-0">
        <div className="flex gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 min-w-max md:min-w-0">
        <Card className="border-blue-200 bg-blue-50 min-w-[220px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Beats</CardTitle>
            <Music className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{loading ? "..." : beats.length}</div>
            <p className="text-xs text-blue-800">{activeBeats.length} active</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50 min-w-[220px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-900">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{loading ? "..." : totalSales}</div>
            <p className="text-xs text-amber-800">Across all beats</p>
          </CardContent>
        </Card>

        <Card className="border-teal-200 bg-teal-50 min-w-[220px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-teal-900">Categories</CardTitle>
            <DollarSign className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-900">
              {loading
                ? "..."
                : `${trendingBeats.length + featuredBeats.length + newReleases.length + latestBeats.length}`}
            </div>
            <p className="text-xs text-teal-800">Distributed beats</p>
          </CardContent>
        </Card>

        <Card className="border-rose-200 bg-rose-50 min-w-[220px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-rose-900">Trending</CardTitle>
            <Users className="h-4 w-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-900">{loading ? "..." : trendingBeats.length}</div>
            <p className="text-xs text-rose-800">Trending beats</p>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="beats" className="space-y-6">
        

        <TabsContent value="beats" className="space-y-6">
          <BeatsDashboard />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Track your beat performance and sales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Manage your producer profile and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Settings panel coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
