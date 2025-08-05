import "server-only"
import { cookies } from "next/headers" // Import cookies for server-side cookie management

const domain = process.env.SHOPIFY_STORE_DOMAIN
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

async function shopifyFetch({ query, variables }: { query: string; variables?: Record<string, any> }) {
  if (!domain || !storefrontAccessToken) {
    throw new Error("Shopify domain and storefront access token must be provided in environment variables.")
  }

  try {
    const result = await fetch(`https://${domain}/api/2024-07/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store", // Changed to no-store for dynamic cart operations
    })

    const body = await result.json()

    if (body.errors) {
      throw body.errors[0]
    }

    return {
      status: result.status,
      body,
    }
  } catch (error) {
    console.error("Error fetching from Shopify:", error)
    return {
      status: 500,
      error: "Error receiving data from Shopify",
    }
  }
}

// GraphQL Fragments
const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    handle
    title
    description
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 10) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 1) { # Fetching variants for add to cart
      edges {
        node {
          id # This is the variant ID we need for adding to cart
          title
          price {
            amount
            currencyCode
          }
          availableForSale # Add this line
          quantityAvailable # Add this line
        }
      }
    }
    # Fetch specific metafields
    artistMetafield: metafield(namespace: "custom", key: "artist") {
      value
    }
    mediumMetafield: metafield(namespace: "custom", key: "medium") {
      value
    }
    dimensionsMetafield: metafield(namespace: "custom", key: "dimensions") {
      value
    }
    signatureMetafield: metafield(namespace: "custom", key: "signature") {
      value
    }
    authenticationMetafield: metafield(namespace: "custom", key: "authentication") {
      value
    }
  }
`

const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      totalAmount {
        amount
        currencyCode
      }
      subtotalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 10) {
      edges {
        node {
          id
          quantity
          merchandise {
            ...on ProductVariant {
              id
              title
              product {
                handle
                title
              }
              image {
                url
                altText
                width
                height
              }
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`

// Cart Mutations
const CART_CREATE_MUTATION = `
  ${CART_FRAGMENT}
  mutation cartCreate($input: CartInput) {
    cartCreate(input: $input) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
`

const CART_LINES_ADD_MUTATION = `
  ${CART_FRAGMENT}
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
`

const CART_LINES_UPDATE_MUTATION = `
  ${CART_FRAGMENT}
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
`

const CART_LINES_REMOVE_MUTATION = `
  ${CART_FRAGMENT}
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
`

const GET_CART_QUERY = `
  ${CART_FRAGMENT}
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFragment
    }
  }
`

// Helper function to get cart ID from cookies
export function getCartIdFromCookie() {
  return cookies().get("cartId")?.value
}

// Helper function to set cart ID in cookies
export function setCartIdCookie(cartId: string) {
  cookies().set("cartId", cartId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
}

// Shopify API functions
export async function createCart() {
  const response = await shopifyFetch({
    query: CART_CREATE_MUTATION,
    variables: { input: {} },
  })
  if (response.error) {
    throw new Error(response.error.message || "Failed to create cart")
  }
  const cart = response.body.data.cartCreate.cart
  setCartIdCookie(cart.id) // Set the cart ID in a cookie
  return cart
}

export async function addLinesToCart(cartId: string, lines: { merchandiseId: string; quantity: number }[]) {
  const response = await shopifyFetch({
    query: CART_LINES_ADD_MUTATION,
    variables: { cartId, lines },
  })
  if (response.error) {
    throw new Error(response.error.message || "Failed to add lines to cart")
  }
  return response.body.data.cartLinesAdd.cart
}

export async function updateLinesInCart(cartId: string, lines: { id: string; quantity: number }[]) {
  const response = await shopifyFetch({
    query: CART_LINES_UPDATE_MUTATION,
    variables: { cartId, lines },
  })
  if (response.error) {
    throw new Error(response.error.message || "Failed to update lines in cart")
  }
  return response.body.data.cartLinesUpdate.cart
}

export async function removeLinesFromCart(cartId: string, lineIds: string[]) {
  const response = await shopifyFetch({
    query: CART_LINES_REMOVE_MUTATION,
    variables: { cartId, lineIds },
  })
  if (response.error) {
    throw new Error(response.error.message || "Failed to remove lines from cart")
  }
  return response.body.data.cartLinesRemove.cart
}

export async function getCart(cartId: string) {
  const response = await shopifyFetch({
    query: GET_CART_QUERY,
    variables: { cartId },
  })
  if (response.error) {
    console.error("Error fetching cart:", response.error)
    return null
  }
  return response.body.data.cart
}

export async function getProductsByTag(tag: string, vendor?: string) {
  const query = `
    ${PRODUCT_FRAGMENT}
    query getProductsByTag($query: String!) {
      products(first: 250, query: $query) {
        edges {
          node {
            ...ProductFragment
          }
        }
      }
    }
  `

  const queryString = vendor
    ? `tag:${tag} AND vendor:${vendor}`
    : `tag:${tag}`

  const response = await shopifyFetch({ query, variables: { query: queryString } })

  if (response.error) {
    console.error("Error fetching featured products:", response.error)
    return []
  }

  return response.body.data.products.edges.map((edge: any) => edge.node)
}

// New function to get products by vendor
export async function getProductsByVendor(vendor: string) {
  const query = `
    ${PRODUCT_FRAGMENT}
    query getProductsByVendor($vendor: String!) {
      products(first: 250, query: $vendor) {
        edges {
          node {
            ...ProductFragment
          }
        }
      }
    }
  `
  // Shopify's GraphQL API allows filtering by vendor using the 'vendor:' prefix in the query string
  const response = await shopifyFetch({ query, variables: { vendor: `vendor:${vendor}` } })
  if (response.error) {
    console.error(`Error fetching products by vendor "${vendor}":`, response.error)
    return []
  }
  return response.body.data.products.edges.map((edge: any) => edge.node)
}

export async function getProductByHandle(handle: string) {
  const query = `
    ${PRODUCT_FRAGMENT}
    query getProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        ...ProductFragment
      }
    }
  `
  const response = await shopifyFetch({ query, variables: { handle } })
  if (response.error) {
    console.error("Error fetching product by handle:", response.error)
    return null
  }
  return response.body.data.productByHandle
}
