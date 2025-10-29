"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Music, Headphones, Mic } from "lucide-react"

export default function AboutPage() {
  const services = [
    {
      icon: <Headphones className="h-8 w-8 text-brand-500" />,
      title: "Original Beats",
      description: "Need a rhythm that bites? I craft tracks that hiss, purr, and occasionally scratch your eardrums in all the right ways.",
    },
    {
      icon: <Mic className="h-8 w-8 text-brand-500" />,
      title: "Full Productions",
      description: "From your first note to the final flicker of light on screen, I handle it all. Audio, visuals, and mystical chaos included. You just try not to trip over my tail.",
    },
    {
      icon: <Music className="h-8 w-8 text-brand-500" />,
      title: "Mixing & Mastering",
      description: "I polish your sound so it’s sharp enough to make mice jump… or listeners stay glued. Every track gets the precision only a cat with nine lives can offer.",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-6 md:py-12 mb-24">
      {/* Hero Section */}
      <section className="mb-12 md:mb-16">
        <div className="mb-6 md:mb-8">
         
        </div>
      </section>

      {/* Story Section */}
      <section className="mb-12 md:mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-6 font-heading">Matilda the Cat</h1>
            <div className="space-y-4 text-muted-foreground">
            <p><strong>They call me bad luck.</strong> Funny, isn’t it?<br/>
              Humans see a black cat and start whispering spells, yet I’m the one creating the magic.</p>
              <p>I was born from distortion and moonlight, raised on broken rhythms and flickers of neon.</p>
              <p>They say curiosity kills the cat, but they never tell you what happens when it learns how to create.</p>
              <p>Every beat I drop is a charm, every melody a shadow that hums, and every line I draw scratches at the veil between misfortune and magic.</p>
              <p>I don’t just make music. I paint it. I sketch it. I turn superstition into illustration, rhythm into imagery, and silence into something that purrs and breathes.</p>
              <p>Every visual, every comic strip, every flicker of light on screen is another spell — another claw mark left in the world of sound and vision.</p>
              <p>I scratch vinyl like I scratch fate — reshaping it, bending it, turning omens into art.</p>
              <p>I turn superstition into creation, showing that a black cat crossing your path isn’t a warning… it’s an <strong>invitation</strong>.</p>
              <p>An invitation to watch, listen, feel, and maybe even join the ritual of creation.</p>
              <p><strong>I’m Matilda, the cat.</strong><br />
              The bad luck that makes things come alive. 🐾</p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-brand-500/20 to-accent2-500/20 rounded-2xl flex items-center justify-center">
              <img src="/img/CatMatildaStudio.jpg" alt="Studio preview"
                  className="w-full h-full object-cover rounded-2xl aspect-video md:aspect-[4/3]" />
            </div>
          </div>
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
            Creativity doesn’t ask for permission.
            I mix sounds, visuals, and ideas to spark the unexpected.
            Every project should provoke, that’s what makes it alive.
            I’m Matilda the cat, and rules? I nap on them.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-heading">Ready to Work Together?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
        Step into my playground.
        Bring your spark, I’ll bring the magic.
        Let’s make something that hisses, purrs, and breathes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-brand-600 hover:bg-brand-500" asChild>
            <Link href="/contact">Get In Touch</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-brand-600 text-brand-500 hover:bg-brand-500/10 bg-transparent"
            asChild
          >
            <Link href="https://beatstars.com/catmatildabeat" target="_blank" rel="noreferrer">
              Browse Beats
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
