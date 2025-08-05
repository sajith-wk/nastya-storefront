export const virtualScenes = [
  {
    id: "room-1",
    title: "Front Room", // Added title
    image: "/images/room1.jpg", // Your current homepage image
    next: "room-2",
    prev: '',
    // Hotspot data for room-1 will be passed from page.tsx
    hotspotPositions: [
        { top: "30%", left: "16.40%", animated: true }, // Example: Hoodie on couch (left)
        { top: "30%", left: "44.27%", animated: true }, // Example: T-shirt on rug (middle)
        { top: "30%", left: "72.13%", animated: true }, // Example: Pink shoes (top right)
      
    ],
  },
  {
    id: "room-2",
    title: "Back Room", // Added title
    image: "/images/room2.jpg", // Placeholder for Room 2
    next: "room-3",
    prev: "room-1",
    // You can define specific hotspots for room-2 here or pass them dynamically
     hotspotPositions: [
      { top: "30%", left: "16.40%", animated: true }, // Example: Hoodie on couch (left)
      { top: "30%", left: "44.27%", animated: true }, // Example: T-shirt on rug (middle)
      { top: "30%", left: "72.13%", animated: true }, // Example: Pink shoes (top right)
      
    ],
  },
  {
    id: "room-3",
    title: "Side Room", // Added title
    image: "/images/room3.jpg", // Placeholder for Room 3
    next: '',
    prev: "room-2",
    // You can define specific hotspots for room-3 here or pass them dynamically
    hotspotPositions: [
      { top: "30%", left: "16.40%", animated: true }, // Example: Hoodie on couch (left)
      { top: "30%", left: "44.27%", animated: true }, // Example: T-shirt on rug (middle)
      { top: "30%", left: "72.13%", animated: true }, // Example: Pink shoes (top right)
      
    ],
  },
]

export type VirtualScene = (typeof virtualScenes)[0]
