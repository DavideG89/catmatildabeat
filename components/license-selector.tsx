"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"

interface License {
  name: string
  price: number
  rights: string
}

interface LicenseSelectorProps {
  licenses: License[]
  beatId: string
}

export default function LicenseSelector({ licenses, beatId }: LicenseSelectorProps) {
  const [selectedLicense, setSelectedLicense] = useState(licenses[0].name)

  const getSelectedLicense = () => {
    return licenses.find((license) => license.name === selectedLicense) || licenses[0]
  }

  return (
    <div className="space-y-6">
      <RadioGroup value={selectedLicense} onValueChange={setSelectedLicense} className="space-y-4">
        {licenses.map((license) => (
          <div
            key={license.name}
            className={`border rounded-lg p-4 transition-colors ${
              selectedLicense === license.name
                ? "border-purple-500 bg-purple-950/20"
                : "border-zinc-700 hover:border-zinc-600"
            }`}
          >
            <div className="flex items-start">
              <RadioGroupItem value={license.name} id={license.name} className="mt-1" />
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <Label htmlFor={license.name} className="font-bold text-base cursor-pointer">
                    {license.name}
                  </Label>
                  <span className="font-bold">${license.price.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{license.rights}</p>
              </div>
            </div>
          </div>
        ))}
      </RadioGroup>

      <Button size="lg" className="w-full bg-purple-600 hover:bg-purple-700" asChild>
        <Link href={`/checkout?beat=${beatId}&license=${selectedLicense}`}>
          <ShoppingCart className="mr-2 h-5 w-5" />
          Buy Now - ${getSelectedLicense().price.toFixed(2)}
        </Link>
      </Button>

      <div className="text-center text-sm text-gray-400">
        <p>Secure payment via Lemon Squeezy</p>
        <p className="mt-1">Instant delivery after purchase</p>
      </div>
    </div>
  )
}
