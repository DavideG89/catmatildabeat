import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UploadBeatForm from "@/components/upload-beat-form"
import BeatsDashboard from "@/components/beats-dashboard"
import TracklistDashboard from "@/components/tracklist-dashboard"

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Producer Dashboard</h1>
        <Button className="bg-purple-600 hover:bg-purple-700">Upload New Beat</Button>
      </div>

      <Tabs defaultValue="beats" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="beats">My Beats</TabsTrigger>
          <TabsTrigger value="tracklist">Tracklist</TabsTrigger>
          <TabsTrigger value="upload">Upload Beat</TabsTrigger>
        </TabsList>

        <TabsContent value="beats">
          <BeatsDashboard />
        </TabsContent>

        <TabsContent value="tracklist">
          <TracklistDashboard />
        </TabsContent>

        <TabsContent value="upload">
          <div className="bg-zinc-900 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6">Upload New Beat</h2>
            <UploadBeatForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
