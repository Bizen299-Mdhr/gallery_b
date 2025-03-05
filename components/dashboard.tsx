"use client"
import { useState, useRef, useEffect } from "react"
import { useAuth } from "./auth-provider"
import { LogOut, Grid, List, Sun, Moon } from "lucide-react"

const categories = ["All", "Nature", "Tech", "Abstract", "City"]
const imageUrls = Array.from({ length: 50 }, (_, i) => ({
  url: `https://picsum.photos/800/600?random=${i}`,
  category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1] // Assign random category
}))

export default function Dashboard() {
  const { logout } = useAuth()
  const [activeCategory, setActiveCategory] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "float">("float")
  const [isDarkMode, setIsDarkMode] = useState(true)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])
  const [filteredImages, setFilteredImages] = useState(imageUrls)
  const [isLoading, setIsLoading] = useState(false)

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark', !isDarkMode)
  }

  // Set initial dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
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

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Filter images when category changes
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setFilteredImages(
        activeCategory === "All" 
          ? imageUrls 
          : imageUrls.filter(img => img.category === activeCategory)
      )
      setIsLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [activeCategory])

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Futuristic Gallery
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("float")}
                className={`p-2 rounded-lg ${
                  viewMode === "float" 
                    ? "bg-gray-200 dark:bg-gray-800" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                } transition-colors`}
              >
                <Grid className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg ${
                  viewMode === "grid" 
                    ? "bg-gray-200 dark:bg-gray-800" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                } transition-colors`}
              >
                <List className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
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
            >
              <LogOut className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
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
          <div className="relative" style={{ 
            height: `${Math.ceil(filteredImages.length / 5) * 500}px`,
            paddingBottom: '100vh'
          }}>
            {filteredImages.map(({url}, index) => (
              <div
                key={index}
                ref={el => {
                  if (el) imageRefs.current[index] = el
                }}
                className="absolute w-[300px] h-[400px] rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden group transition-all duration-500"
                style={{
                  left: `${10 + (index % 5) * 18}%`,
                  top: `${Math.floor(index / 5) * 500}px`,
                  zIndex: index % 2 === 0 ? 1 : 2,
                  transform: `rotate(${index % 2 === 0 ? -3 : 3}deg)`
                }}
              >
                <img
                  src={url}
                  alt={`Gallery Image ${index}`}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        ) : (
          // Grid Layout
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map(({url}, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-2xl overflow-hidden group shadow-lg dark:shadow-gray-800/50 transition-all duration-500"
                style={{
                  transitionDelay: `${(index % 6) * 50}ms`
                }}
              >
                <img
                  src={url}
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
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}
      </div>
    </main>
  )
}

