"use client"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "./auth-provider"
import { LogOut } from "lucide-react"
import ImageMasonry from "./image-masonry"

const categories = ["All", "Weddings", "Concerts", "Conferences"]

export default function Dashboard() {
  const { logout } = useAuth()
  const [activeCategory, setActiveCategory] = useState("All")
  const [isLoading, setIsLoading] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)

  // Parallax effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const scrollY = window.scrollY
        headerRef.current.style.transform = `translateY(${scrollY * 0.5}px)`
        headerRef.current.style.opacity = `${1 - scrollY * 0.003}`
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Simulate loading when changing categories
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div ref={headerRef} className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
        <div className="relative z-10 text-center">
          <h1 className="holographic text-5xl md:text-7xl font-black neon-text">EVENT ARCHIVE</h1>
          <p className="text-gray-300 mt-4 max-w-xl mx-auto px-4">
            Explore our curated collection of event memories captured in time
          </p>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md px-4 py-4 border-b border-gray-800">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="overflow-auto hide-scrollbar py-2">
            <div className="flex space-x-3 min-w-max">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`neumorphic-tab whitespace-nowrap ${activeCategory === category ? "active" : ""}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={logout}
            className="ml-4 p-2 rounded-lg hover:bg-gray-800 transition-colors duration-300"
            aria-label="Log out"
          >
            <LogOut className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ImageMasonry category={activeCategory === "All" ? undefined : activeCategory} />

        {/* Loading indicator */}
        {isLoading && (
          <div className="fixed bottom-0 left-0 right-0 z-20 p-4">
            <div className="progress-loader w-full mx-auto">
              <div className="h-full w-1/3 rounded-full"></div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

