"use client" // Add "use client" directive

import Link from "next/link"
import { cn } from "@/lib/utils"
import { useCart } from "@/context/cart-context" // Import useCart

interface HeaderProps {
  isTransparent?: boolean
}

export function Header({ isTransparent = false }: HeaderProps) {
  const { cart, openCart } = useCart() // Use useCart hook

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 lg:px-6 transition-colors duration-300",
        isTransparent ? "bg-transparent text-black" : "bg-background text-foreground",
      )}
    >
      {/* Left Menu (hidden on mobile) */}
      <nav className="hidden sm:flex gap-4 sm:gap-6">
        <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
          Home
        </Link>
        <Link href="/shop" className="text-sm font-medium hover:underline underline-offset-4">
          Shop
        </Link>
        <Link href="/bio" className="text-sm font-medium hover:underline underline-offset-4">
          Bio
        </Link>
      </nav>

      {/* Center Site Logo */}
      <div className="flex-1 flex justify-center">
        <Link href="/" className="flex items-center justify-center text-2xl font-bold">
          Nastya
        </Link>
      </div>

      {/* Right Menu (hidden on mobile) */}
      <nav className="hidden sm:flex gap-4 sm:gap-6">
        <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">
          Contact
        </Link>
        {/* Updated Cart Link to Button */}
        <a
          href="#"
          onClick={openCart}
          className={cn(
            "text-sm font-medium hover:underline underline-offset-4",
            isTransparent ? "text-black" : "text-foreground",
          )}
        >
          Cart ({cart?.totalQuantity || 0})
        </a>
      </nav>
    </header>
  )
}
