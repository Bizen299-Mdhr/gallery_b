"use client"
import { useEffect, useRef, useState } from "react"

// Using Picsum photos for random images with more spacing
const images = [
  {
    id: 1,
    src: "https://picsum.photos/600/800?random=1",
    alt: "Gallery 1",
    top: "5%",
    left: "2%",
    width: "20%",
    zIndex: 1,
  },
  {
    id: 2,
    src: "https://picsum.photos/700/500?random=2",
    alt: "Gallery 2",
    top: "10%",
    right: "5%",
    width: "22%",
    zIndex: 2,
  },
  {
    id: 3,
    src: "https://picsum.photos/500/700?random=3",
    alt: "Gallery 3",
    bottom: "15%",
    left: "10%",
    width: "18%",
    zIndex: 3,
  },
  {
    id: 4,
    src: "https://picsum.photos/800/600?random=4",
    alt: "Gallery 4",
    top: "3%",
    right: "30%",
    width: "15%",
    zIndex: 4,
  },
  {
    id: 5,
    src: "https://picsum.photos/600/900?random=5",
    alt: "Gallery 5",
    bottom: "5%",
    right: "12%",
    width: "20%",
    zIndex: 5,
  },
  {
    id: 6,
    src: "https://picsum.photos/700/600?random=6",
    alt: "Gallery 6",
    bottom: "30%",
    left: "30%",
    width: "16%",
    zIndex: 6,
  },
]

interface ParallaxGridProps {
  setIsHovering: (value: boolean) => void
}

export default function ParallaxGrid({ setIsHovering }: ParallaxGridProps) {
  const [loaded, setLoaded] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

  // Track mouse position globally
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        // Calculate position as percentage of container (-0.5 to 0.5)
        const x = e.clientX / width - 0.5
        const y = e.clientY / height - 0.5
        setMousePosition({ x, y })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Add a small delay to ensure smooth fade-in
    const timer = setTimeout(() => setLoaded(true), 100)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      clearTimeout(timer)
    }
  }, [])

  // Apply parallax effect to all images based on mouse position
  useEffect(() => {
    imageRefs.current.forEach((ref, index) => {
      if (ref) {
        // Different movement intensity for each image
        const intensity = 1 + (index % 3) * 0.5
        const xMovement = mousePosition.x * 40 * intensity
        const yMovement = mousePosition.y * 40 * intensity

        // Apply transform to the image
        const img = ref.querySelector("img")
        if (img) {
          img.style.transform = `translate(${xMovement}px, ${yMovement}px)`
        }

        // Apply subtle rotation to the container
        ref.style.transform = `perspective(1000px) rotateX(${mousePosition.y * -5}deg) rotateY(${mousePosition.x * 5}deg)`
      }
    })
  }, [mousePosition])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {images.map((image, index) => (
        <div
          key={image.id}
          ref={(el) => (imageRefs.current[index] = el)}
          className={`absolute overflow-hidden transition-opacity duration-1000 ${loaded ? "opacity-50" : "opacity-0"}`}
          style={{
            top: image.top,
            left: image.left,
            right: image.right,
            bottom: image.bottom,
            width: image.width,
            zIndex: image.zIndex,
            transition: "transform 0.2s ease-out",
          }}
        >
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
            <img
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              className="h-full w-full object-cover"
              style={{
                transition: "transform 0.2s ease-out",
                transformOrigin: "center center",
              }}
              crossOrigin="anonymous"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

