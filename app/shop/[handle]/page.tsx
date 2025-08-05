import Image from "next/image"
import { getProductByHandle } from "@/lib/shopify"
import { notFound } from "next/navigation"
import { ProductActions } from "@/components/product-actions"
import { ProductGallery } from "@/components/product-gallery" // 👈 NEW

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProductByHandle(params.handle)

  if (!product) {
    notFound()
  }

  const productImages =
    product.images?.edges.map((edge:any) => ({
      url: edge.node.url,
      altText: edge.node.altText || product.title,
    })) || [
      {
        url: "/placeholder.svg?height=600&width=600",
        altText: product.title,
      },
    ]

  // Extract the first variant ID and inventory information
  const productVariant = product.variants?.edges[0]?.node
  const productVariantId = productVariant?.id
  const availableForSale = productVariant?.availableForSale || false
  const quantityAvailable = productVariant?.quantityAvailable || 0

  // Extract metafield values directly
  const artist = product.artistMetafield?.value || "N/A"
  const medium = product.mediumMetafield?.value || "N/A"
  const dimensions = product.dimensionsMetafield?.value || "N/A"
  const signature = product.signatureMetafield?.value || "N/A"
  const authentication = product.authenticationMetafield?.value || "N/A"
  console.log(product.artistMetafield)

  if (!productVariantId) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
        <p className="text-lg text-muted-foreground">This product is currently unavailable for purchase.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 grid md:grid-cols-2 gap-8 items-start">
      <ProductGallery images={productImages} /> {/* 👈 Replaces static image */}

      <div className="grid gap-6">
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <p className="text-2xl font-semibold">
          {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
        </p>

        <ProductActions
          productId={product.id}
          variantId={productVariantId}
          productTitle={product.title}
          availableForSale={availableForSale}
          quantityAvailable={quantityAvailable}
        />

        {/* Product Details Section */}

        <h2 className="text-xl font-semibold mt-4">Product Details</h2>

        <table className="w-full mb-4 border border-gray-200 rounded text-sm text-left">
          <tbody>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-2 bg-gray-50 text-gray-700 font-medium">Artist</th>
              <td className="px-4 py-2 text-gray-800">{artist}</td>
            </tr>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-2 bg-gray-50 text-gray-700 font-medium">Medium</th>
              <td className="px-4 py-2 text-gray-800">{medium}</td>
            </tr>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-2 bg-gray-50 text-gray-700 font-medium">Title</th>
              <td className="px-4 py-2 text-gray-800">{product.title}</td>
            </tr>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-2 bg-gray-50 text-gray-700 font-medium">Dimensions</th>
              <td className="px-4 py-2 text-gray-800">{dimensions}</td>
            </tr>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-2 bg-gray-50 text-gray-700 font-medium">Signature</th>
              <td className="px-4 py-2 text-gray-800">{signature}</td>
            </tr>
            <tr>
              <th className="px-4 py-2 bg-gray-50 text-gray-700 font-medium">Authentication</th>
              <td className="px-4 py-2 text-gray-800">{authentication}</td>
            </tr>
          </tbody>
        </table>


        {/* <div className="grid gap-2 text-sm">
          <h2 className="text-xl font-semibold mt-4">Product Details</h2>
          <p><span className="font-medium">Artist:</span> {artist}</p>
          <p><span className="font-medium">Medium:</span> {medium}</p>
          <p><span className="font-medium">Title:</span> {product.title}</p>
          <p><span className="font-medium">Dimensions:</span> {dimensions}</p>
          <p><span className="font-medium">Signature:</span> {signature}</p>
          <p><span className="font-medium">Authentication:</span> {authentication}</p>
        </div> */}

        <h2 className="text-xl font-semibold mt-4">Description</h2>
        <div className="prose max-w-none">
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  )
}
