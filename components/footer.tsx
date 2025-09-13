import Link from "next/link"
import { Instagram, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src="/img/logo_Cat_Matilda.png" alt="Cat Matilda Logo" className="h-8 w-auto md:h-10" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">Premium beats for producers and artists.</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-foreground hover:text-brand-400 transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-foreground hover:text-brand-400 transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-foreground hover:text-brand-400 transition-colors">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-base md:text-lg">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-foreground hover:text-brand-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/beats" className="text-foreground hover:text-brand-400 transition-colors">
                  Beats
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-foreground hover:text-brand-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-foreground hover:text-brand-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-base md:text-lg">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-foreground hover:text-brand-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-foreground hover:text-brand-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/licenses" className="text-foreground hover:text-brand-400 transition-colors">
                  License Information
                </Link>
              </li>
              <li>
                <Link href="/refunds" className="text-foreground hover:text-brand-400 transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-foreground hover:text-brand-400 transition-colors text-xs"
                >
                  Producer Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-base md:text-lg">Newsletter</h3>
            <p className="text-sm text-foreground mb-4">
              Subscribe to get updates on new beats and exclusive offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="bg-white text-brand-500 placeholder:text-gray-400 border border-brand-300 rounded-full px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
              <button
                type="submit"
                className="bg-brand-600 hover:bg-brand-500 px-6 py-3 rounded-full transition-colors text-sm text-white w-full sm:w-auto"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-border mt-8 md:mt-12 pt-6 md:pt-8 text-center text-muted-foreground text-xs md:text-sm">
          <p>&copy; {new Date().getFullYear()} Cat Matilda Beat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
