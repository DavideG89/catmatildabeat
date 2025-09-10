"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Script from "next/script"

// Mock data - in a real app, you would fetch this based on the beat ID
const beats = {
  "1": {
    id: "1",
    title: "Midnight Dreams",
    producer: "Cat Matilda Beat",
    coverImage: "/placeholder.svg?height=100&width=100",
    licenses: {
      Basic: { price: 29.99, rights: "MP3 file, Non-exclusive, 5,000 streams" },
      Premium: { price: 79.99, rights: "WAV + MP3 files, Non-exclusive, Unlimited streams" },
      Exclusive: { price: 299.99, rights: "Full ownership, All files, Exclusive rights" },
    },
  },
  "2": {
    id: "2",
    title: "Summer Vibes",
    producer: "Cat Matilda Beat",
    coverImage: "/placeholder.svg?height=100&width=100",
    licenses: {
      Basic: { price: 24.99, rights: "MP3 file, Non-exclusive, 5,000 streams" },
      Premium: { price: 69.99, rights: "WAV + MP3 files, Non-exclusive, Unlimited streams" },
      Exclusive: { price: 249.99, rights: "Full ownership, All files, Exclusive rights" },
    },
  },
  "3": {
    id: "3",
    title: "Urban Legend",
    producer: "Cat Matilda Beat",
    coverImage: "/placeholder.svg?height=100&width=100",
    licenses: {
      Basic: { price: 34.99, rights: "MP3 file, Non-exclusive, 5,000 streams" },
      Premium: { price: 89.99, rights: "WAV + MP3 files, Non-exclusive, Unlimited streams" },
      Exclusive: { price: 349.99, rights: "Full ownership, All files, Exclusive rights" },
    },
  },
}

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const beatId = searchParams.get("beat") || "1"
  const licenseType = searchParams.get("license") || "Basic"

  const [beat, setBeat] = useState<any>(null)
  const [license, setLicense] = useState<any>(null)
  const [lemonSqueezyLoaded, setLemonSqueezyLoaded] = useState(false)

  useEffect(() => {
    // In a real app, you would fetch the beat data from an API
    const selectedBeat = beats[beatId as keyof typeof beats]
    if (selectedBeat) {
      setBeat(selectedBeat)

      // Find the license (case insensitive)
      const licenseKey = Object.keys(selectedBeat.licenses).find(
        (key) => key.toLowerCase() === licenseType.toLowerCase(),
      )

      if (licenseKey) {
        setLicense({
          name: licenseKey,
          ...selectedBeat.licenses[licenseKey as keyof typeof selectedBeat.licenses],
        })
      } else {
        // Default to Basic if license not found
        setLicense({
          name: "Basic",
          ...selectedBeat.licenses.Basic,
        })
      }
    }
  }, [beatId, licenseType])

  // Calculate tax and total
  const tax = license ? license.price * 0.1 : 0 // 10% tax for example
  const total = license ? license.price + tax : 0

  // Handle Lemon Squeezy script loading
  const handleLemonSqueezyLoad = () => {
    setLemonSqueezyLoaded(true)

    // Initialize Lemon Squeezy
    if (typeof window !== "undefined") {
      window.createLemonSqueezy && window.createLemonSqueezy()
    }
  }

  // Handle checkout button click
  const handleCheckout = () => {
    // The direct product link approach
    const lemonSqueezyUrl = "https://catbeat.lemonsqueezy.com/buy/30252575-331f-4e55-b170-c56a3231442f"

    // Open in a new window if the JS API isn't available
    if (typeof window !== "undefined") {
      if (window.LemonSqueezy && window.LemonSqueezy.Url) {
        // Use the Lemon Squeezy JS API
        window.LemonSqueezy.Url.Open(lemonSqueezyUrl, {
          checkoutData: {
            custom: {
              beat_id: beatId,
              license_type: license?.name,
              beat_title: beat?.title,
            },
          },
        })
      } else {
        // Fallback to direct link
        window.open(lemonSqueezyUrl, "_blank")
      }
    }
  }

  if (!beat || !license) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-12 mb-24 text-center">
        <p>Loading checkout information...</p>
      </div>
    )
  }

  return (
    <>
      {/* Load Lemon Squeezy JavaScript */}
      <Script
        src="https://app.lemonsqueezy.com/js/lemon.js"
        onLoad={handleLemonSqueezyLoad}
        strategy="afterInteractive"
      />

      <div className="container mx-auto px-4 py-6 md:py-12 mb-24">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 font-heading">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-12">
          {/* Left Column - Order Summary */}
          <div className="w-full lg:w-1/2">
            <div className="bg-card rounded-xl p-4 md:p-6 mb-6 md:mb-8">
              <h2 className="text-lg md:text-xl font-bold mb-4 font-heading">Order Summary</h2>

              <div className="flex items-center gap-3 md:gap-4 mb-6">
                <Image
                  src={beat.coverImage || "/placeholder.svg"}
                  alt={beat.title}
                  width={80}
                  height={80}
                  className="rounded-lg w-16 h-16 md:w-20 md:h-20"
                />
                <div>
                  <h3 className="font-bold text-sm md:text-base">{beat.title}</h3>
                  <p className="text-muted-foreground text-xs md:text-sm">{license.name} License</p>
                </div>
                <div className="ml-auto">
                  <p className="font-bold text-sm md:text-base">${license.price.toFixed(2)}</p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between mb-2 text-sm md:text-base">
                <p>Subtotal</p>
                <p>${license.price.toFixed(2)}</p>
              </div>
              <div className="flex justify-between mb-4 text-sm md:text-base">
                <p>Tax</p>
                <p>${tax.toFixed(2)}</p>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-bold text-sm md:text-base">
                <p>Total</p>
                <p>${total.toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-card rounded-xl p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold mb-4 font-heading">License Details</h2>
              <div className="flex items-center mb-4">
                <Badge className="bg-brand-600 mr-2 text-xs">{license.name}</Badge>
                <p className="text-muted-foreground text-sm">${license.price.toFixed(2)}</p>
              </div>
              <p className="text-muted-foreground mb-4 text-sm md:text-base">{license.name} License includes:</p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-2 text-sm md:text-base">
                {license.rights.split(", ").map((right: string, index: number) => (
                  <li key={index}>{right}</li>
                ))}
                <li>Credit required (Prod. by {beat.producer})</li>
              </ul>
            </div>
          </div>

          {/* Right Column - Payment Form */}
          <div className="w-full lg:w-1/2">
            <div className="bg-card rounded-xl p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold mb-6 font-heading">Complete Your Purchase</h2>

              <div className="space-y-6">
                <div className="bg-secondary p-4 rounded-lg">
                  <p className="text-center text-muted-foreground mb-2 text-sm">
                    You're purchasing a {license.name} license for:
                  </p>
                  <p className="text-center font-bold text-base md:text-lg">{beat.title}</p>
                </div>

                <Button
                  className="w-full bg-brand-600 hover:bg-brand-500 py-5 md:py-6 text-base md:text-lg transition-colors"
                  onClick={handleCheckout}
                  disabled={!lemonSqueezyLoaded}
                >
                  Complete Purchase
                </Button>

                <div className="text-center space-y-2">
                  <p className="text-xs md:text-sm text-muted-foreground">Secure payment processed by Lemon Squeezy</p>
                  <p className="text-xs text-muted-foreground">
                    By completing this purchase, you agree to our Terms of Service and License Agreement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Add this to make TypeScript happy with the global window object
declare global {
  interface Window {
    createLemonSqueezy?: () => void
    LemonSqueezy?: {
      Url: {
        Open: (url: string, options?: any) => void
      }
    }
  }
}
