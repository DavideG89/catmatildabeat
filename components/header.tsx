"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export default function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isMobileBeats, setIsMobileBeats] = useState(false)
  const [heroInView, setHeroInView] = useState(pathname === "/")

  // Throttled scroll handler to improve performance
  const handleScroll = useCallback(() => {
    if (isMobileBeats) {
      setScrolled(true)
      return
    }

    const scrollPosition = window.scrollY
    setScrolled(scrollPosition > 20)
  }, [isMobileBeats])

  useEffect(() => {
    const updateMobileBeats = () => {
      const isMobile = window.matchMedia("(max-width: 767px)").matches
      setIsMobileBeats(isMobile && pathname === "/beats")
    }

    updateMobileBeats()
    window.addEventListener("resize", updateMobileBeats)

    return () => window.removeEventListener("resize", updateMobileBeats)
  }, [pathname])

  useEffect(() => {
    if (isMobileBeats) {
      setScrolled(true)
      return
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll, isMobileBeats])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (pathname !== "/") {
      setHeroInView(false)
      return
    }

    const heroSection = document.getElementById("hero-section")

    if (!heroSection) {
      setHeroInView(false)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry.intersectionRatio
        setHeroInView((prev) => {
          if (ratio >= 0.6) return true
          if (ratio <= 0.2) return false
          return prev
        })
      },
      {
        threshold: [0, 0.2, 0.4, 0.6, 1],
        rootMargin: "-200px 0px 0px 0px",
      }
    )

    observer.observe(heroSection)

    return () => observer.disconnect()
  }, [pathname])

  const isActive = (path: string) => {
    return pathname === path
  }

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  const headerStyle = isMobileBeats
    ? "bg-background/90 backdrop-blur-md"
    : scrolled
      ? "bg-background/90 backdrop-blur-md"
      : "bg-transparent"

  const shouldHideHeader = pathname === "/" && heroInView && !isMenuOpen

  return (
    <header
      className={`sticky top-0 z-50 transition-[transform,opacity] duration-300 will-change-transform overflow-hidden ${headerStyle} ${
        shouldHideHeader ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img src="/Logo-Big.png" alt="Cat Matilda Beat Logo" className="h-12 w-auto md:h-16" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link href="/" className={`nav-link ${isActive("/") ? "nav-link-active" : ""}`}>
              Home
            </Link>
            <Link href="/beats" className={`nav-link ${isActive("/beats") ? "nav-link-active" : ""}`}>
              Beats
            </Link>
            <Link href="/about" className={`nav-link ${isActive("/about") ? "nav-link-active" : ""}`}>
              About
            </Link>
             <Link
              href="/illustration"
              className={`nav-link ${isActive("/illustration") ? "nav-link-active" : ""}`}
            >
              Illustration
            </Link>
            <Link href="/contact" className={`nav-link ${isActive("/contact") ? "nav-link-active" : ""}`}>
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-zinc-900 hover:text-zinc-700 dark:text-white dark:hover:text-brand-300 z-10 p-2 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-card/95 backdrop-blur-[2px] border-b border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4">
              <motion.nav
                className="flex flex-col space-y-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.05,
                    },
                  },
                }}
              >
                {[
                  { href: "/", label: "Home" },
                  { href: "/beats", label: "Beats" },
                  { href: "/about", label: "About" },
                  { href: "/illustration", label: "Illustration" },
                  { href: "/contact", label: "Contact" },
                ].map((item) => (
                  <motion.div
                    key={item.href}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  >
                    <Link
                      href={item.href}
                      className={`text-sm block py-2 ${isActive(item.href) ? "text-black" : "text-black"}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
