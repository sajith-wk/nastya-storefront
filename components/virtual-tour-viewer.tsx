"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import InteractiveProductDot from "@/components/interactive-product-dot"
import { useState, useEffect, useRef, useCallback } from "react"
import { virtualScenes, type VirtualScene } from "@/app/data/scenes"
import { cn } from "@/lib/utils"
import { FooterWrapper } from "@/components/layout/footer-wrapper"
import { useIsMobile } from "@/hooks/use-mobile"

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

interface HotspotPosition {
  top: string
  left: string
  animated?: boolean
}

interface VirtualTourViewerProps {
  scene: VirtualScene
  productsForHotspots: Product[]
  hotspotPositions: HotspotPosition[]
  isLoadingProducts: boolean
}

export default function VirtualTourViewer({
  scene,
  productsForHotspots,
  hotspotPositions,
  isLoadingProducts,
}: VirtualTourViewerProps) {
  const [loaded, setLoaded] = useState(false)
  const isMobile = useIsMobile()


  // Panning states
  const [translateX, setTranslateX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)
  const currentTranslate = useRef(0)
  const imageWrapperRef = useRef<HTMLDivElement>(null)
  const viewerContainerRef = useRef<HTMLDivElement>(null)
  const [renderedImageWidth, setRenderedImageWidth] = useState<number | null>(null)

  useEffect(() => {
    setLoaded(false) // Reset loaded state when scene changes
    // setTranslateX(0) // Removed: Initial centering is handled by handleImageLoad
    setRenderedImageWidth(null) // Reset rendered image width
    // console.log(`VirtualTourViewer: Scene changed to ${scene.id}. Resetting state.`)
  }, [scene.id])

  useEffect(() => {
    // console.log("VirtualTourViewer: isMobile state changed to", isMobile)
  }, [isMobile])

  const getSceneTitle = (sceneId: string) => {
    const targetScene = virtualScenes.find((s) => s.id === sceneId)
    return targetScene ? targetScene.title : sceneId
  }

  // Removed handleMobileMenuClick as it's now handled by FooterWrapper

  // Callback when the Image component finishes loading
  const handleImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setLoaded(true)
      if (viewerContainerRef.current) {
        const viewerWidth = viewerContainerRef.current.offsetWidth
        const viewerHeight = viewerContainerRef.current.offsetHeight
        const naturalAspectRatio = e.currentTarget.naturalWidth / e.currentTarget.naturalHeight
        const calculatedRenderedWidth = viewerHeight * naturalAspectRatio
        setRenderedImageWidth(calculatedRenderedWidth)
        if (calculatedRenderedWidth > viewerWidth) {
          setTranslateX(-(calculatedRenderedWidth - viewerWidth) / 2)
        } else {
          setTranslateX(0)
        }
      }
    },
    [isMobile],
  ) // Added isMobile to dependencies




  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!isMobile || !imageWrapperRef.current || renderedImageWidth === null) {
        return
      }
      startX.current = e.touches[0].clientX
      currentTranslate.current = translateX
      setIsDragging(true)
    },
    [isMobile, translateX, renderedImageWidth],
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isMobile || !isDragging || !imageWrapperRef.current || !viewerContainerRef.current || renderedImageWidth === null) return
      const currentX = e.touches[0].clientX
      const deltaX = currentX - startX.current
      let newTranslateX = currentTranslate.current + deltaX
      const viewerWidth = viewerContainerRef.current.offsetWidth
      let minTranslateX = 0
      if (renderedImageWidth > viewerWidth) {
        minTranslateX = -(renderedImageWidth - viewerWidth)
      }
      newTranslateX = Math.max(minTranslateX, Math.min(0, newTranslateX))
      setTranslateX(newTranslateX)
    },
    [isMobile, isDragging, renderedImageWidth],
  )

  const handleTouchEnd = useCallback(() => {
    if (!isMobile) return
    setIsDragging(false)
  }, [isMobile])

  const imageContainerStyle: React.CSSProperties = {
    width: isMobile && renderedImageWidth !== null ? `${renderedImageWidth}px` : "100%",
    height: "100%",
    transform: `translateX(${translateX}px)`,
    transition: isDragging ? "none" : "transform 0.5s ease-out", // Smooth transition when not dragging
  }

  // console.log("Current Render State:", {
  //   isMobile,
  //   loaded,
  //   renderedImageWidth,
  //   translateX,
  //   isDragging,
  //   sceneId: scene.id,
  // })

  return (
    <div
      ref={viewerContainerRef}
      className="relative w-full h-screen overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div
        ref={imageWrapperRef}
        className={cn("absolute top-0 left-0", loaded ? "blur-none" : "blur-lg")}
        style={imageContainerStyle}
      >
        <Image
          src={scene.image || "/placeholder.svg"}
          alt={scene.id}
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center" }}
          className="z-0"
          onLoad={handleImageLoad}
        />

        <div
          className={`absolute inset-0 z-10 transition-opacity duration-1000 ease-out ${
            loaded && !isLoadingProducts ? "opacity-100" : "opacity-0"
          }`}
        >
          {productsForHotspots.map((product, i) => {
            const position = hotspotPositions[i]
            if (!position) return null
            return (
              <InteractiveProductDot
                key={product.id}
                product={product}
                position={position}
                animated={position.animated}
              />
            )
          })}
        </div>
      </div>

      {(!loaded || isLoadingProducts) && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-white text-4xl font-bold animate-blink">Nastya</div>
        </div>
      )}



      <FooterWrapper />
    </div>
  )
}
