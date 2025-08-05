"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface InteractiveProductDotProps {
  product: {
    id: string
    title: string
    handle: string
    featuredImage?: any // Add
  }
  position: {
    top: string
    left: string
  }
  animated?: boolean // Still used to conditionally apply the dot-pulse class
}

export default function InteractiveProductDot({ product, position, animated = false }: InteractiveProductDotProps) {
  return (
    <Link
      href={`/shop/${product.handle}`}
      className="group absolute z-30 flex flex-col items-center"
      style={{ top: position.top, left: position.left }}
    >
      {/* Product Image styled like a photo frame */}
      {product.featuredImage?.url && (
        <div className="w-44 h-52 bg-white   rounded-md shadow-[6px_6px_12px_rgba(0,0,0,0.12),2px_2px_4px_rgba(0,0,0,0.08)] mb-4">
          <img
            src={product.featuredImage?.url}
            alt={product.title}
            className="w-full h-full object-cover rounded-sm"
          />
        </div>
      )}

      <br />
      {/* Dot below the image and centered */}
      <div
        className={cn(
          "w-4 h-4 rounded-full", // Add dot base styles
          "group-hover:scale-125 transition-transform duration-200",
          animated && "dot-pulse"
        )}
      ></div>

      {/* Tooltip */}
      <div className="absolute left-1/2 -translate-x-1/2 -translate-y-full mt-[-12px] hidden group-hover:block bg-white text-black font-bold text-2xl px-5 py-2 rounded shadow-lg whitespace-nowrap z-40">
        {product.title}
      </div>
    </Link>
  )
}
