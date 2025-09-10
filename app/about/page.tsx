"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Music, Headphones, Mic, Users, Award, Clock } from "lucide-react"

export default function AboutPage() {
  const stats = [
    { icon: <Music className="h-6 w-6" />, label: "Beats Produced", value: "500+" },
    { icon: <Users className="h-6 w-6" />, label: "Happy Artists", value: "200+" },
    { icon: <Award className="h-6 w-6" />, label: "Years Experience", value: "8+" },
    { icon: <Clock className="h-6 w-6" />, label: "Hours in Studio", value: "10,000+" },
  ]

  const services = [
    {
      icon: <Headphones className="h-8 w-8 text-brand-500" />,
      title: "Beat Production",
      description: "Custom beats tailored to your style and vision, from trap to R&B and everything in between.",
    },
    {
      icon: <Mic className="h-8 w-8 text-brand-500" />,
      title: "Mixing & Mastering",
      description: "Professional mixing and mastering services to make your tracks sound radio-ready.",
    },
    {
      icon: <Music className="h-8 w-8 text-brand-500" />,
      title: "Full Production",
      description: "Complete song production from concept to final master, including arrangement and sound design.",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-6 md:py-12 mb-24">
      {/* Hero Section */}
      <section className="text-center mb-12 md:mb-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 font-heading">
            About <span className="gradient-text">Cat Matilda Beat</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Crafting premium beats and bringing musical visions to life for artists worldwide.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="mb-12 md:mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 font-heading">My Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                What started as a passion for music in my bedroom studio has evolved into a full-time dedication to
                creating premium beats that inspire artists around the world. I'm Cat Matilda Beat, a producer who
                believes that every artist deserves access to professional-quality instrumentals.
              </p>
              <p>
                Over the past 8 years, I've honed my craft across multiple genres, from hard-hitting trap beats to
                smooth R&B melodies. My goal is simple: create beats that not only sound amazing but also provide the
                perfect foundation for artists to express their creativity.
              </p>
              <p>
                Every beat I produce is crafted with attention to detail, using industry-standard equipment and
                techniques. I draw inspiration from both classic and contemporary sounds, ensuring each track has its
                own unique character while maintaining commercial appeal.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-brand-500/20 to-accent2-500/20 rounded-2xl flex items-center justify-center">
              <Music className="h-24 w-24 text-brand-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-12 md:mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-4 md:p-6">
                <div className="flex justify-center mb-3 text-brand-500">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="mb-12 md:mb-16">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 font-heading">What I Offer</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From beat production to full song creation, I provide comprehensive music production services.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <Card key={index} className="text-center card-hover-effect">
              <CardContent className="p-6 md:p-8">
                <div className="flex justify-center mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="mb-12 md:mb-16">
        <Card className="bg-gradient-to-r from-brand-500/10 to-accent2-500/10 border-brand-500/20">
          <CardContent className="p-6 md:p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 font-heading">My Philosophy</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              "Music is a universal language that connects us all. My role as a producer is to create the sonic
              foundation that allows artists to tell their stories authentically. Every beat should inspire, every
              melody should move, and every track should have the power to change someone's day."
            </p>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-heading">Ready to Work Together?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Whether you need a custom beat, mixing services, or full production, I'm here to help bring your musical
          vision to life.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-brand-600 hover:bg-brand-500" asChild>
            <Link href="/contact">Get In Touch</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-brand-600 text-brand-500 hover:bg-brand-500/10 bg-transparent"
            onClick={() => window.open("https://beatstars.com/catmatildabeat", "_blank")}
          >
            Browse Beats
          </Button>
        </div>
      </section>
    </div>
  )
}
