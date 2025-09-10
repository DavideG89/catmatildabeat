"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Youtube, Play, Bell, Users, Video } from "lucide-react"
import { motion } from "framer-motion"

export default function YouTubeSection() {
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = () => {
    window.open("https://www.youtube.com/channel/UCKpPHRtsxkhHeao7ttkyb4A?sub_confirmation=1", "_blank")
    setIsSubscribed(true)
  }

  const handleWatchVideos = () => {
    window.open("https://www.youtube.com/channel/UCKpPHRtsxkhHeao7ttkyb4A", "_blank")
  }

  const stats = [
    { icon: <Users className="h-5 w-5" />, label: "Subscribers", value: "2.5K+" },
    { icon: <Video className="h-5 w-5" />, label: "Videos", value: "50+" },
    { icon: <Play className="h-5 w-5" />, label: "Total Views", value: "100K+" },
  ]

  return (
    <section className="py-10 md:py-16 bg-gradient-to-b from-card/50 to-background animate-on-scroll">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-4">
              <Youtube className="h-8 w-8 md:h-10 md:w-10 text-red-500 mr-3" />
              <h2 className="text-2xl md:text-3xl font-bold font-heading">Follow My Journey</h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get behind-the-scenes content, beat breakdowns, and exclusive previews on my YouTube channel
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
            {/* YouTube Preview Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20 overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-video bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center">
                    <div className="text-center">
                      <Youtube className="h-16 w-16 md:h-20 md:w-20 text-red-500 mx-auto mb-4" />
                      <h3 className="text-xl md:text-2xl font-bold mb-2">Cat Matilda Beat</h3>
                      <p className="text-muted-foreground text-sm md:text-base">Beat Making & Music Production</p>
                    </div>
                    <div
                      className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={handleWatchVideos}
                    >
                      <Play className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <div className="p-4 md:p-6">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                          <div className="flex justify-center mb-2 text-red-500">{stat.icon}</div>
                          <div className="font-bold text-sm md:text-base">{stat.value}</div>
                          <div className="text-xs text-muted-foreground">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={handleWatchVideos}
                      variant="outline"
                      className="w-full border-red-500/20 text-red-500 hover:bg-red-500/10 bg-transparent"
                    >
                      <Youtube className="mr-2 h-4 w-4" />
                      Watch Videos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Subscribe Section */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-4">Subscribe for Exclusive Content</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3 flex-shrink-0"></div>
                    Beat making tutorials and breakdowns
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3 flex-shrink-0"></div>
                    Behind-the-scenes studio sessions
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3 flex-shrink-0"></div>
                    First listen to new beats
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3 flex-shrink-0"></div>
                    Producer tips and techniques
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3 flex-shrink-0"></div>
                    Live beat making sessions
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button onClick={handleSubscribe} className="w-full bg-red-600 hover:bg-red-500 text-white" size="lg">
                  <Bell className="mr-2 h-5 w-5" />
                  {isSubscribed ? "Subscribed!" : "Subscribe Now"}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Join 2.5K+ producers and artists following my journey
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
