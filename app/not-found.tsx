"use client"

import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-4 text-center text-foreground">
      <Image
        src="/img/GIROTONDO.gif"
        alt="Matilda The Cat in a loop"
        width={400}
        height={400}
        priority
        className="h-auto w-full max-w-sm"
      />
      <div className="space-y-4">
        <h1 className="text-3xl font-bold sm:text-4xl">Oops, you’ve landed in the wrong place!</h1>
        <p className="text-base text-muted-foreground sm:text-lg">
        The page you’re looking for no longer exists (or maybe it never did). Head back to the homepage and continue the adventure with Matilda.
        </p>
        <div className="flex justify-center">
          <Button asChild className="bg-brand-600 px-6 py-5 text-white hover:bg-brand-500">
            <Link href="https://matildathecat.com/">Back to home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
