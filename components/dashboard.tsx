"use client"
import { useState, useRef, useEffect } from "react"
import { useAuth } from "./auth-provider"
import { LogOut, Grid, List, Sun, Moon, ChevronLeft, ChevronRight, X } from "lucide-react"

const categories = ["All", "Nature", "Tech", "Abstract", "City"]
const imageUrls = Array.from({ length: 50 }, (_, i) => ({
  url: `https://picsum.photos/1024/768?random=${i}`,
  category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1], // Assign random category
}))

interface DashboardProps {
  setIsHovering?: (value: boolean) => void
}

export default function Dashboard({ setIsHovering = () => {} }: DashboardProps) {
  const { logout } = useAuth()
  const [activeCategory, setActiveCategory] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "float">("float")
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("darkMode")
      return savedMode ? JSON.parse(savedMode) : true
    }
    return true
  })
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])
  const [filteredImages, setFilteredImages] = useState(imageUrls)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  // Toggle dark mode and save to localStorage
  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    document.documentElement.classList.toggle("dark", newMode)
    localStorage.setItem("darkMode", JSON.stringify(newMode))
  }

  // Set initial dark mode from localStorage
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode)
  }, [isDarkMode])

  // Parallax effect for floating images
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      imageRefs.current.forEach((ref, index) => {
        if (ref) {
          const speed = 0.1 + (index % 5) * 0.05 // Slower speed for smoother effect
          const offset = scrollY * speed
          ref.style.transform = `translateY(${offset}px) rotate(${index % 2 === 0 ? -3 : 3}deg)`
        }
      })
    }

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Filter images when category changes
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setFilteredImages(
        activeCategory === "All" ? imageUrls : imageUrls.filter((img) => img.category === activeCategory),
      )
      setIsLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [activeCategory])

  // Calculate container height based on number of images
  const containerHeight = Math.ceil(filteredImages.length / 5) * 600 + window.innerHeight

  const handleImageClick = (index: number) => {
    setSelectedImage(index)
  }

  // Add keyboard navigation useEffect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage !== null) {
        switch (e.key) {
          case "ArrowLeft":
            handlePrev()
            break
          case "ArrowRight":
            handleNext()
            break
          case "Escape":
            setSelectedImage(null)
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedImage, filteredImages])

  // Add navigation handlers
  const handleNext = () => {
    setSelectedImage(prev => (prev === null ? null : Math.min(prev + 1, filteredImages.length - 1)))
  }

  const handlePrev = () => {
    setSelectedImage(prev => (prev === null ? null : Math.max(prev - 1, 0)))
  }

  return (
    <main
      className="min-h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden"
      onMouseEnter={() => setIsHovering(false)}
    >
      {/* Header */}
      <div
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
        onMouseEnter={() => setIsHovering(true)}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">My Gallery</h1>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("float")}
                className={`p-2 rounded-lg ${
                  viewMode === "float" ? "bg-gray-200 dark:bg-gray-800" : "hover:bg-gray-100 dark:hover:bg-gray-800"
                } transition-colors`}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <Grid className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg ${
                  viewMode === "grid" ? "bg-gray-200 dark:bg-gray-800" : "hover:bg-gray-100 dark:hover:bg-gray-800"
                } transition-colors`}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <List className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              )}
            </button>
            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Log out"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <LogOut className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div
        className="fixed top-16 left-0 right-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md"
        onMouseEnter={() => setIsHovering(true)}
      >
        <div className="max-w-7xl mx-auto px-4 py-2 flex gap-3 overflow-auto hide-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700"
              } transition-colors`}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="pt-32 pb-8">
        {viewMode === "float" ? (
          // Floating Images Layout
          <div
            className="relative"
            style={{
              height: `${containerHeight}px`,
              paddingBottom: "100vh", // Extra space for scrolling
            }}
          >
            {filteredImages.map(({ url }, index) => (
              <div
                key={index}
                ref={(el) => {
                  if (el) imageRefs.current[index] = el
                }}
                className="absolute w-[300px] h-[400px] rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden group transition-all duration-500 cursor-pointer"
                style={{
                  left: `${10 + (index % 5) * 18}%`,
                  top: `${Math.floor(index / 5) * 500}px`,
                  zIndex: index % 2 === 0 ? 1 : 2,
                  transform: `rotate(${index % 2 === 0 ? -3 : 3}deg)`,
                }}
                onClick={() => handleImageClick(index)}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <img
                  src={url || "/placeholder.svg"}
                  alt={`Gallery Image ${index}`}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        ) : (
          // Grid Layout
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map(({ url }, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-2xl overflow-hidden group shadow-lg dark:shadow-gray-800/50 transition-all duration-500 cursor-pointer"
                style={{
                  transitionDelay: `${(index % 6) * 50}ms`,
                }}
                onClick={() => handleImageClick(index)}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <img
                  src={url || "/placeholder.svg"}
                  alt={`Gallery Image ${index}`}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {filteredImages[index].category}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
            onMouseEnter={() => setIsHovering(true)}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {selectedImage !== null && (
          <div 
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setSelectedImage(null)}
            onMouseEnter={() => setIsHovering(true)}
          >
            <div className="relative max-w-4xl w-full max-h-[90vh]">
              <button
                className="absolute -top-8 right-0 text-white hover:text-gray-200 transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-6 h-6" />
              </button>
              
              {/* Navigation Buttons */}
              <button
                className="absolute left-0 -translate-x-full top-1/2 -translate-y-1/2 p-2 text-white hover:text-gray-200 disabled:opacity-50"
                onClick={handlePrev}
                disabled={selectedImage === 0}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              
              <button
                className="absolute right-0 translate-x-full top-1/2 -translate-y-1/2 p-2 text-white hover:text-gray-200 disabled:opacity-50"
                onClick={handleNext}
                disabled={selectedImage === filteredImages.length - 1}
              >
                <ChevronRight className="w-8 h-8" />
              </button>

              <img
                src={filteredImages[selectedImage].url}
                alt={`Enlarged view - ${filteredImages[selectedImage].category}`}
                className="w-full h-full object-contain rounded-lg"
              />
              
              <div className="absolute bottom-4 left-4 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                {filteredImages[selectedImage].category}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

