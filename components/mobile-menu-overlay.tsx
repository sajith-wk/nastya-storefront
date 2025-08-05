"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { virtualScenes } from "@/app/data/scenes"
import { useCart } from "@/context/cart-context" // ✅ Import cart hook

interface MobileMenuOverlayProps {
  isOpen: boolean
  onClose: () => void
  sceneImage?: string
}

const mainNavLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Bio", href: "/bio" },
  { name: "Contact", href: "/contact" },
]

export default function MobileMenuOverlay({ isOpen, onClose, sceneImage }: MobileMenuOverlayProps) {
  const { cart, openCart } = useCart() // ✅ Access cart and openCart

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center overflow-hidden",
        "transition-opacity duration-500",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      )}
    >
      {/* Blurred Background */}
      {sceneImage && (
        <Image
          src={sceneImage}
          alt="Background"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          className="absolute inset-0 z-0 blur-lg"
        />
      )}

      {/* Left Door */}
      <div
        className={cn(
          "absolute inset-y-0 left-0 w-1/2 bg-white transition-transform duration-500 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      ></div>

      {/* Right Door */}
      <div
        className={cn(
          "absolute inset-y-0 right-0 w-1/2  bg-white transition-transform duration-500 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      ></div>

      {/* Center Content */}
      <div
        className={cn(
          "relative z-20 flex flex-col h-full w-full max-w-4xl mx-auto p-8 text-black",
          "transition-opacity duration-300",
          isOpen ? "opacity-100 delay-300" : "opacity-0",
        )}
      >
        {/* Close Button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 bg-white text-black border-black rounded-full w-10 h-10 z-30"
          onClick={onClose}
          aria-label="Close menu"
        >
          <XIcon className="h-5 w-5" />
        </Button>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Nastya</h2>
        </div>

        {/* Main Navigation & Scenes */}
        <div className="flex flex-grow justify-center gap-16 md:gap-24 lg:gap-32">
          {/* Left Column */}
          <nav className="flex flex-col gap-4 text-left text-4xl font-bold">
            {mainNavLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={onClose}
                className="hover:underline underline-offset-4"
              >
                {link.name}
              </Link>
            ))}

            
          </nav>

          {/* Right Column */}
          <div className="flex flex-col gap-4 text-right text-lg font-medium">            
            <Link href="https://golart.com/policies/terms-of-service" target="_blank" rel="noopener noreferrer" onClick={onClose} className="hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="https://golart.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer" onClick={onClose} className="hover:underline underline-offset-4">
              Privacy
            </Link>          
          </div>
        </div>

        {/* Bottom Cart Button */}
        <div className="self-end mt-8">
          <Button
            variant="outline"
            className="bg-transparent text-black border-black rounded-lg px-6 py-3 text-lg"
            onClick={() => {
              openCart()
              onClose()
            }}
          >
            Cart ({cart?.totalQuantity || 0})
          </Button>
        </div>
      </div>
    </div>
  )
}
