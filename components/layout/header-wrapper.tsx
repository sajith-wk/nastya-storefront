"use client"

import { usePathname } from "next/navigation"
import { Header } from "./header"

export function HeaderWrapper() {
  const pathname = usePathname()
  // Check if it's the homepage or any virtual room page
  const isVirtualTourPage = pathname === "/" || pathname.startsWith("/room-")

  return <Header isTransparent={isVirtualTourPage} />
}
