"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Music, Headphones, Mic, Users, Award, Clock } from "lucide-react"

export default function AboutPage() {
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
            About <span>Cat Matilda Beat</span>
          </h1>
        </div>
      </section>

      {/* Story Section */}
      <section className="mb-12 md:mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 font-heading">My Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
              Cat Matilda Beat was born from the idea that music should be a playground, an open space where sounds, genres and emotions collide to create something new.
              </p>
              <p>
              From the very first experiment with electronic layers to the raw energy of hip-hop and trap, from the groove of funk to the edge of rock, Cat Matilda Beat has always been about exploration. Each track is more than just an instrumental: it’s an invitation to express yourself, to let your voice, your flow, or even your videos ride on unique waves of sound.
              </p>
              <p>
              And yes, you guessed it right: this playground is ruled by a black cat.
They say a black cat crossing your path brings bad luck…well, this one decided to sit on the drum machine instead. The only curse here? Every track comes with claws out, ready to leave a mark.
              </p>
              <p>
              Cat Matilda isn’t just any cat. She learned how to scratch vinyl before furniture, how to hit pads with more precision than a paw could ever promise, and how to turn ‘bad luck’ into grooves that stick to your head for days. Each track is crafted with the same feline curiosity: a leap, a chase, a playful mischief that suddenly transforms into a full melody.
              </p>
              <p>
              So if you’ve ever wondered what happens when a black cat trades mystery for music, the answer is right here.
              Cat Matilda Beat: where superstition meets inspiration, and every note is a lucky strike. 🐾🎶
              </p>
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
