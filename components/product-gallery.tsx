'use client'

import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'

interface ProductGalleryProps {
  images: { url: string; altText: string }[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0])
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // Touch event handlers for mobile swipe - only for thumbnail area
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return
    e.stopPropagation() // Prevent event bubbling to parent elements
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    e.stopPropagation() // Prevent event bubbling
    const x = e.touches[0].clientX
    const walk = (startX - x) * 1.5 // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft + walk
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation() // Prevent event bubbling
    setIsDragging(false)
  }

  // Prevent click events when dragging
  const handleThumbnailClick = (img: { url: string; altText: string }, e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault()
      return
    }
    setMainImage(img)
  }

  return (
    <div className="space-y-4 overflow-hidden"> {/* Prevent horizontal overflow on container */}
      {/* Main Image Display */}
      <div className="relative w-full aspect-square rounded-lg overflow-hidden">
        <Image
          src={mainImage.url}
          alt={mainImage.altText || 'Product Image'}
          fill
          className="object-contain bg-gray-100"
        />
      </div>

      {/* Thumbnail Gallery - Only this area is horizontally scrollable */}
      <div className="relative w-full md:overflow-visible overflow-hidden"> {/* Container prevents horizontal scroll leak on mobile only */}
        <div
          ref={scrollContainerRef}
          className="flex gap-2 overflow-x-auto md:flex-wrap touch-pan-x"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-x' // Only allow horizontal scrolling
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {images.map((img, index) => (
            <div
              key={index}
              className={`relative flex-shrink-0 w-20 h-20 rounded overflow-hidden cursor-pointer border transition-all duration-200 select-none ${
                img.url === mainImage.url 
                  ? 'border-black border-2 shadow-md' 
                  : 'border-gray-200 hover:border-gray-400'
              }`}
              onClick={(e) => handleThumbnailClick(img, e)}
            >
              <Image
                src={img.url}
                alt={img.altText || 'Thumbnail'}
                fill
                className="object-cover pointer-events-none"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* CSS to hide scrollbars and prevent page horizontal scroll */}
      <style jsx>{`
        .touch-pan-x::-webkit-scrollbar {
          display: none;
        }
        
        /* Ensure no horizontal overflow on mobile */
        @media (max-width: 768px) {
          body {
            overflow-x: hidden;
          }
        }
      `}</style>
    </div>
  )
}