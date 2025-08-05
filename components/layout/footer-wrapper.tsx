"use client"

import { usePathname } from "next/navigation"
import { useState } from "react"
import { Footer } from "./footer"
import MobileMenuOverlay from "../mobile-menu-overlay" // ✅ corrected path

export function FooterWrapper() {
  const pathname = usePathname()
  const isVirtualTourPage = pathname === "/" || pathname.startsWith("/room-")

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <Footer
        isTransparent={isVirtualTourPage}
        onMenuClick={() => setIsMenuOpen(true)}
      />
      <MobileMenuOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        sceneImage="/images/room1.jpg"
      />
    </>
  )
}
