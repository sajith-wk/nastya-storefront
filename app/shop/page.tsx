import { getProductsByVendor } from "@/lib/shopify"
import { ProductCard } from "@/components/product-card"

export default async function ShopPage() {
  const vendorName = "Nastya Rovenskaya"
  const products = await getProductsByVendor(vendorName)

  // Filter out products where the first variant has 0 quantity
  const filteredProducts = products.filter((product: any) => {
    const variant = product.variants?.edges?.[0]?.node
    return variant?.availableForSale && variant?.quantityAvailable > 0
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Artworks by {vendorName}</h1>
      {filteredProducts.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No available products for {vendorName} at the moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
