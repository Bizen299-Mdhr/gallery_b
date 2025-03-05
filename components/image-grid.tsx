"use client"

import { useEffect, useState } from "react"

// In a real application, you would fetch these from an API
const placeholderImages = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  src: `/placeholder.svg?height=${300 + (i % 3) * 100}&width=${300 + (i % 2) * 100}`,
  alt: `Event image ${i + 1}`,
  category: i % 3 === 0 ? "Weddings" : i % 3 === 1 ? "Concerts" : "Conferences",
}))

interface ImageGridProps {
  blurred?: boolean
  category?: string
}

export default function ImageGrid({ blurred = false, category }: ImageGridProps) {
  const [images, setImages] = useState(placeholderImages)

  useEffect(() => {
    if (category) {
      setImages(placeholderImages.filter((img) => img.category === category))
    } else {
      setImages(placeholderImages)
    }
  }, [category])

  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-2 ${
        blurred ? "opacity-20 blur-sm scale-105" : ""
      }`}
    >
      {images.map((image) => (
        <div
          key={image.id}
          className={`aspect-[${image.id % 2 ? "3/4" : "3/3"}] rounded-lg overflow-hidden ${
            blurred ? "" : "transition-transform duration-500 transform hover:z-10"
          }`}
        >
          <img src={image.src || "/placeholder.svg"} alt={image.alt} className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  )
}

