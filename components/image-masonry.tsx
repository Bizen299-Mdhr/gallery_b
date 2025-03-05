"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

// Generate placeholder image data in various aspect ratios
const generateImages = (count: number, category?: string) => {
  return Array.from({ length: count }, (_, i) => {
    const id = i + 1
    const aspectRatio = [1, 4 / 3, 3 / 4, 16 / 9, 9 / 16][Math.floor(Math.random() * 5)]
    let width, height

    if (aspectRatio > 1) {
      width = 400
      height = Math.round(width / aspectRatio)
    } else {
      height = 400
      width = Math.round(height * aspectRatio)
    }

    const randomCategory = ["Weddings", "Concerts", "Conferences"][Math.floor(Math.random() * 3)]

    return {
      id,
      src: `/placeholder.svg?height=${height}&width=${width}`,
      alt: `Event ${id}`,
      width,
      height,
      category: category || randomCategory,
      description: `Event photo ${id} from ${category || randomCategory} collection`,
    }
  })
}

interface ImageMasonryProps {
  category?: string
}

export default function ImageMasonry({ category }: ImageMasonryProps) {
  const [images, setImages] = useState(() => generateImages(20, category))
  const [loading, setLoading] = useState(false)
  const observerRef = useRef<HTMLDivElement>(null)
  const [transformValue, setTransformValue] = useState({ x: 0, y: 0, tiltX: 0, tiltY: 0 })

  // Handle mouse movement for parallax effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e
    const { left, top, width, height } = currentTarget.getBoundingClientRect()

    const x = (clientX - left) / width - 0.5
    const y = (clientY - top) / height - 0.5

    setTransformValue({
      x: x * 20,
      y: y * 20,
      tiltX: y * 10,
      tiltY: x * -10,
    })
  }

  const handleMouseLeave = () => {
    setTransformValue({ x: 0, y: 0, tiltX: 0, tiltY: 0 })
  }

  // Load more images on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setLoading(true)

          // Simulate API call delay
          setTimeout(() => {
            setImages((prevImages) => [...prevImages, ...generateImages(10, category)])
            setLoading(false)
          }, 1500)
        }
      },
      { rootMargin: "200px" },
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [loading, category])

  // Filter images when category changes
  useEffect(() => {
    setImages(generateImages(20, category))
  }, [category])

  return (
    <div className="relative">
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="break-inside-avoid relative group"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="parallax-card rounded-xl overflow-hidden relative cursor-pointer"
              style={{
                transform: `perspective(1000px) rotateX(${transformValue.tiltX}deg) rotateY(${transformValue.tiltY}deg)`,
              }}
            >
              <div className="parallax-card-content">
                <img
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  className="w-full h-auto"
                  style={{
                    transform: `translateX(${transformValue.x}px) translateY(${transformValue.y}px)`,
                    transition: "transform 0.1s ease-out",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="text-white font-medium truncate">{image.description}</h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      <div ref={observerRef} className="h-10 my-8 flex justify-center">
        {loading && (
          <div className="progress-loader w-40 mx-auto">
            <div className="h-full w-1/3 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  )
}

