"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ProductHotspotProps {
  product: {
    id: string
    handle: string
    title: string
    description: string
    priceRange: {
      minVariantPrice: {
        amount: string
        currencyCode: string
      }
    }
    featuredImage?: {
      url: string
      altText: string
      width: number
      height: number
    }
    images?: {
      edges: {
        node: {
          url: string
          altText: string
          width: number
          height: number
        }
      }[]
    }
  }
  position: {
    top: string
    left: string
  }
  animated?: boolean // New prop for animation
}

export function ProductHotspot({ product, position, animated = false }: ProductHotspotProps) {
  const [isOpen, setIsOpen] = useState(false)

  const imageUrl =
    product.featuredImage?.url || product.images?.edges[0]?.node.url || "/placeholder.svg?height=200&width=200"
  const imageAlt = product.featuredImage?.altText || product.images?.edges[0]?.node.altText || product.title

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "absolute w-6 h-6 rounded-full border-2 border-black bg-white flex items-center justify-center",
          "hover:scale-125 transition-transform duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black",
          animated && "animate-wave-pulse", // Apply animation class if animated prop is true
        )}
        style={{ top: position.top, left: position.left }}
        onClick={() => setIsOpen(true)}
        aria-label={`View product: ${product.title}`}
      >
        <span className="sr-only">{product.title}</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] p-4">
          <DialogHeader>
            <DialogTitle>{product.title}</DialogTitle>
            <DialogDescription className="line-clamp-2">{product.description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="relative w-full h-48">
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={imageAlt}
                fill
                style={{ objectFit: "contain" }}
                className="rounded-md"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">
                {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
              </span>
              <Link href={`/shop/${product.handle}`} passHref>
                <Button onClick={() => setIsOpen(false)}>View Product</Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
