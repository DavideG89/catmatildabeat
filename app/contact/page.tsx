"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Mail, MessageSquare, Clock, CheckCircle } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || "Failed to send message")
      }
      setIsSubmitted(true)
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch (err: any) {
      setError(err?.message || "Unable to send message")
    } finally {
      setIsSubmitting(false)
    }
  }

  const faqs = [
    {
      question: "How can I purchase your beats?",
      answer:
        "All beats are available for purchase on my BeatStars profile. Simply click any 'Buy on BeatStars' button to be redirected to the store where you can choose your license and complete your purchase.",
    },
    {
      question: "What types of licenses do you offer?",
      answer:
        "I offer Basic, Premium, and Exclusive licenses. Basic includes MP3 files with limited streams, Premium includes WAV + MP3 with unlimited streams, and Exclusive gives you full ownership and all files.",
    },
    {
      question: "Can I get custom beats made?",
      answer:
        "Yes! I offer custom beat production services. Contact me with your requirements, reference tracks, and budget, and I'll create something unique for your project.",
    },
    {
      question: "How long does it take to receive my files after purchase?",
      answer:
        "All purchases are processed instantly through BeatStars. You'll receive download links immediately after completing your payment.",
    },
    {
      question: "Do you offer mixing and mastering services?",
      answer:
        "Yes, I provide professional mixing and mastering services. Contact me for rates and turnaround times based on your project needs.",
    },
    {
      question: "Can I use your beats for commercial purposes?",
      answer:
        "Yes, depending on the license you purchase. Premium and Exclusive licenses allow commercial use. Please check the specific license terms on BeatStars for detailed usage rights.",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-6 md:py-12 mb-24">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 font-heading">Get In Touch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl text-left">
            Have questions about beats, custom work, or collaborations? I'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-brand-500" />
                  Send a Message
                </CardTitle>
                <CardDescription>Fill out the form below and I'll get back to you within 24 hours.</CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground">Thanks for reaching out. I'll get back to you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded">
                        {error}
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        placeholder="What's this about?"
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        placeholder="Tell me more about your project or question..."
                        className="min-h-32"
                      />
                    </div>
                    <Button type="submit" className="w-full bg-brand-600 hover:bg-brand-500" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-brand-500" />
                <span>matildathecat.meow@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-brand-500" />
                <span>Response time: Within 24 hours</span>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div>
            <h2 className="text-2xl font-bold mb-6 font-heading">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-card rounded-lg px-4">
                  <AccordionTrigger className="text-left font-medium hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  )
}
