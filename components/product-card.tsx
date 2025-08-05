import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface ProductCardProps {
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
    mediumMetafield?: { value: string }
    dimensionsMetafield?: { value: string }
    artistMetafield?: { value: string }
    signatureMetafield?: { value: string }
    authenticationMetafield?: { value: string }
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl =
    product.featuredImage?.url || product.images?.edges[0]?.node.url || "/placeholder.svg?height=200&width=200"
  const imageAlt = product.featuredImage?.altText || product.images?.edges[0]?.node.altText || product.title

  return (
    <Link href={`/shop/${product.handle}`} className="group block">
      <Card className="overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-0">
          <div className="relative w-full aspect-square">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              style={{ objectFit: "cover" }}
              className="group-hover:scale-105 transition-transform duration-200"
            />
          </div>
          <div className="p-4 space-y-1">
            <h3 className="text-base font-semibold line-clamp-1">{product.title}</h3>          
            {product.mediumMetafield?.value && (
              <p className="text-sm text-muted-foreground">{product.mediumMetafield.value}</p>
            )}
            {product.dimensionsMetafield?.value && (
              <p className="text-sm text-muted-foreground">{product.dimensionsMetafield.value}</p>
            )}
            {/* <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
            <p className="mt-2 text-base font-bold">
              {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
            </p> */}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
