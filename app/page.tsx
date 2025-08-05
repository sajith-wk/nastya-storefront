"use client"

import { useState, useEffect } from "react"
import VirtualTourViewer from "@/components/virtual-tour-viewer"
import { virtualScenes } from "@/app/data/scenes"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

interface Product {
  id: string
  title: string
  handle: string
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

// ✅ Utility function to chunk products into groups of 3
function splitIntoRooms(products: Product[]) {
  const maxPerRoom = 3
  const rooms: Product[][] = []

  for (let i = 0; i < products.length; i += maxPerRoom) {
    rooms.push(products.slice(i, i + maxPerRoom))
  }

  return rooms
}

export default function HomePage() {
  const [productsForHotspots, setProductsForHotspots] = useState<Product[]>([])
  const [totalProductCount, setTotalProductCount] = useState(0)
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [roomsWithProducts, setRoomsWithProducts] = useState<Product[][]>([])
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoadingProducts(true)
        const response = await fetch("/api/featured-products")
        const data = await response.json()

        const fetchedProducts: Product[] = Array.isArray(data.products) ? data.products : []
        const limitedProducts = fetchedProducts.slice(0, 9)
        console.log(limitedProducts)

        const rooms = splitIntoRooms(limitedProducts)
        setRoomsWithProducts(rooms)

        // ✅ Log each room and product title
        rooms.forEach((room, index) => {
          console.log(`📦 Room ${index + 1}:`)
          room.forEach((product, i) => {
            console.log(`   🔹 ${i + 1}: ${product.title}`)
          })
        })
      } catch (error) {
        console.error("Error fetching featured products:", error)
        setRoomsWithProducts([])
      } finally {
        setIsLoadingProducts(false)
      }
    }

    fetchProducts()
  }, [])

  const currentScene = virtualScenes[currentRoomIndex]
  const roomProducts = roomsWithProducts[currentRoomIndex] || []
  const hotspotPositions = currentScene?.hotspotPositions.slice(0, roomProducts.length) || []

  const goPrev = () => setCurrentRoomIndex((prev) => Math.max(prev - 1, 0))
  const goNext = () => setCurrentRoomIndex((prev) => Math.min(prev + 1, roomsWithProducts.length - 1))

  if (!currentScene) {
    return <div className="flex items-center justify-center h-screen text-lg">Error: Room 1 not found.</div>
  }

  return (
    <>
      {/* Mobile + Tablet viewport fixes */}
      <style jsx global>{`
        /* Base styles for all devices */
        html, body {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
          -webkit-overflow-scrolling: touch;
        }
        
        /* Prevent zoom on touch for all touch devices */
        * {
          touch-action: manipulation;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        
        /* Mobile + Tablet viewport fixes (treat tablets as mobile) */
        @media screen and (max-width: 1024px) {
          html, body {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
          }
          
          .responsive-viewport-fix {
            height: 100vh;
            height: -webkit-fill-available;
            height: 100dvh; /* Dynamic viewport height for modern browsers */
            width: 100vw;
            width: -webkit-fill-available;
            width: 100dvw; /* Dynamic viewport width for modern browsers */
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            transform: none;
          }
        }
        
        /* Desktop only styles */
        @media screen and (min-width: 1025px) {
          .responsive-viewport-fix {
            height: 100vh;
            width: 100vw;
            position: relative;
          }
        }
      `}</style>

      <div className="relative responsive-viewport-fix">
        <VirtualTourViewer
          scene={currentScene}
          productsForHotspots={roomProducts}
          hotspotPositions={hotspotPositions}
          isLoadingProducts={isLoadingProducts}
        />

        {/* Navigation arrows - Responsive sizing */}
        {currentRoomIndex > 0 && (
          <button
            onClick={goPrev}
            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-40 group"
          >
            <Button
              variant="outline"
              size="icon"
              className="relative w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white bg-transparent flex items-center justify-center hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
              aria-label={`Go to ${virtualScenes[currentRoomIndex - 1]?.title}`}
            >
              <ArrowLeftIcon className="h-4 w-4 md:h-5 md:w-5 text-white" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full mt-2 hidden group-hover:flex items-center gap-1 px-2 py-1 md:px-3 md:py-1.5 rounded-lg bg-white text-black text-sm font-medium border-2 border-black whitespace-nowrap shadow-md transition-all duration-200">
                <span>{virtualScenes[currentRoomIndex - 1]?.title}</span>
              </div>
            </Button>
          </button>
        )}

        {currentRoomIndex < roomsWithProducts.length - 1 && (
          <button
            onClick={goNext}
            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-40 group"
          >
            <Button
              variant="outline"
              size="icon"
              className="relative w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white bg-transparent flex items-center justify-center hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
              aria-label={`Go to ${virtualScenes[currentRoomIndex + 1]?.title}`}
            >
              <ArrowRightIcon className="h-4 w-4 md:h-5 md:w-5 text-white" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full mt-2 hidden group-hover:flex items-center gap-1 px-2 py-1 md:px-3 md:py-1.5 rounded-lg bg-white text-black text-sm font-medium border-2 border-black whitespace-nowrap shadow-md transition-all duration-200">
                <span>{virtualScenes[currentRoomIndex + 1]?.title}</span>
              </div>
            </Button>
          </button>
        )}
      </div>
    </>
  )
}