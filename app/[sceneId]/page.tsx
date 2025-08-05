// import VirtualTourViewer from "@/components/virtual-tour-viewer"
// import { virtualScenes } from "@/app/data/scenes"
// import { notFound } from "next/navigation"

// interface Product {
//   id: string
//   title: string
//   handle: string
//   description: string
//   priceRange: {
//     minVariantPrice: {
//       amount: string
//       currencyCode: string
//     }
//   }
//   featuredImage?: {
//     url: string
//     altText: string
//     width: number
//     height: number
//   }
//   images?: {
//     edges: {
//       node: {
//         url: string
//         altText: string
//         width: number
//         height: number
//       }
//     }[]
//   }
// }

// interface HotspotPosition {
//   top: string
//   left: string
//   animated?: boolean
// }

// export default async function VirtualScenePage({ params }: { params: { sceneId: string } }) {
//   const { sceneId } = params
//   const currentScene = virtualScenes.find((s) => s.id === sceneId)

//   if (!currentScene) {
//     notFound()
//   }

//   let productsForHotspots: Product[] = []
//   let isLoadingProducts = true

//   const generateTestProduct = (index: number, sceneId: string) => ({
//     id: `test-${sceneId}-${index}`,
//     title: `Test Product ${index + 1} (${sceneId})`,
//     handle: `test-product-${sceneId}-${index + 1}`,
//     description: `This is a placeholder product for ${sceneId}.`,
//     priceRange: {
//       minVariantPrice: {
//         amount: "99.99",
//         currencyCode: "USD",
//       },
//     },
//   })

//   const currentHotspotPositions = currentScene.hotspotPositions || [
//     { top: "60%", left: "18%", animated: true },
//     { top: "75%", left: "38%", animated: true },
//     { top: "50%", left: "55%", animated: true },
//     { top: "80%", left: "70%" },
//     { top: "70%", left: "25%" },
//     { top: "85%", left: "45%" },
//     { top: "65%", left: "85%" },
//     { top: "40%", left: "30%" },
//     { top: "20%", left: "60%" },
//     { top: "90%", left: "10%" },
//   ]

//   try {
//     const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
//       ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
//       : "http://localhost:3000/"

//     const response = await fetch(`${baseUrl}/api/featured-products`, { cache: "no-store" })
//     const data = await response.json()
//     let allProducts: Product[] = data.products || []

//     // 🧠 Extract products by scene (3 per room)
//     const roomNumber = parseInt(sceneId.replace("room-", ""), 10)
//     const startIndex = (roomNumber - 1) * 3
//     const endIndex = startIndex + 3

//     let slicedProducts = allProducts.slice(startIndex, endIndex)


//     productsForHotspots = slicedProducts
//   } catch (error) {
//     console.error("Error fetching featured products for virtual scene:", error)
//     productsForHotspots = Array.from({ length: 3 }).map((_, i) => generateTestProduct(i, `${sceneId}-error`))
//   } finally {
//     isLoadingProducts = false
//   }

//   return (
//     <VirtualTourViewer
//       scene={currentScene}
//       productsForHotspots={productsForHotspots}
//       hotspotPositions={currentHotspotPositions}
//       isLoadingProducts={isLoadingProducts}
//     />
//   )
// }
