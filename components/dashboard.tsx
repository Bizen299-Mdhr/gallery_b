"use client"
import { useState, useRef, useEffect } from "react"
import { useAuth } from "./auth-provider"
import { LogOut, Grid, List, Sun, Moon, ChevronLeft, ChevronRight, X } from "lucide-react"
import { Header } from "./header"
import { CategoryNav } from "./category-nav"
import { useDisableInspect } from '@/hooks/useDisableInspect'
import VideoPlayer from "./video-player"

const categories = ["All", "Nature", "Tech", "Abstract", "City", "Videos"]
const imageUrls = Array.from({ length: 50 }, (_, i) => ({
  url: `https://picsum.photos/1024/768?random=${i}`,
  category: categories[Math.floor(Math.random() * (categories.length - 2)) + 1], // Assign random category except Videos
  isVideo:false
}))

// Add more video data including titles
const videoUrls = [
  {
    url: "https://www.youtube.com/watch?v=72eQoVgbEG8&ab_channel=ShivendraSingh",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    category: "Videos",
    isVideo: true,
    title: "Beautiful Nature Timelapse"
  },
  {
    url: "https://www.youtube.com/watch?v=q9zKUhZWP9s&ab_channel=thebipinmaharjanofficial",
    thumbnail: "https://img.youtube.com/vi/y8OnoxKotPQ/maxresdefault.jpg",
    category: "Videos",
    isVideo: true,
    title: "Incredible Mountain Views"
  },
  {
    url: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
    thumbnail: "https://img.youtube.com/vi/PkZNo7MFNFg/maxresdefault.jpg",
    category: "Videos",
    isVideo: true,
    title: "Programming Tutorial"
  },
  {
    url: "https://www.youtube.com/watch?v=gO8N3L_aERg",
    thumbnail: "https://img.youtube.com/vi/gO8N3L_aERg/maxresdefault.jpg",
    category: "Videos",
    isVideo: true,
    title: "Amazing Ocean Documentary"
  },
]

// Combine both arrays for content
const allContent = [...imageUrls, ...videoUrls]

interface DashboardProps {
  setIsHovering?: (value: boolean) => void
}

export default function Dashboard({ setIsHovering = () => {} }: DashboardProps) {
  if(process.env.NODE_ENV !== "development"){
    useDisableInspect()
  }
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
  const [filteredImages, setFilteredImages] = useState(allContent)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [clickedImagePosition, setClickedImagePosition] = useState<{
    x: number
    y: number
    width: number
    height: number
  } | null>(null)
  const [showVideoPlayer, setShowVideoPlayer] = useState(false)
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0)

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
        activeCategory === "All" 
          ? allContent 
          : allContent.filter((item) => item.category === activeCategory),
      )
      setIsLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [activeCategory])

  // Calculate container height based on number of images
  const containerHeight = Math.ceil(filteredImages.length / 5) * 600 + window.innerHeight

  // Modify handleImageClick to check if video and show video player with index
  const handleImageClick = (index: number, e: React.MouseEvent<HTMLDivElement>) => {
    if (filteredImages[index].isVideo) {
      // Find the index in the videoUrls array
      const videoIndex = videoUrls.findIndex(
        video => video.url === filteredImages[index].url
      )
      setSelectedVideoIndex(videoIndex >= 0 ? videoIndex : 0)
      setShowVideoPlayer(true)
      return
    }
    
    const rect = e.currentTarget.getBoundingClientRect()
    setClickedImagePosition({
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height
    })
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

  // Add this useEffect to reset clickedImagePosition after animation
  useEffect(() => {
    if (selectedImage !== null) {
      const timer = setTimeout(() => {
        setClickedImagePosition(null)
      }, 10) // Short delay to trigger the animation
      return () => clearTimeout(timer)
    }
  }, [selectedImage])

  return (
    <main
      className="min-h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden"
      onMouseEnter={() => setIsHovering(false)}
    >
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        logout={logout}
        setIsHovering={setIsHovering}
      />

      <CategoryNav
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categories={categories}
        setIsHovering={setIsHovering}
      />

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
            {filteredImages.map(({ url, isVideo, thumbnail, category }, index) => (
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
                onClick={(e) => handleImageClick(index, e)}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <img
                  src={isVideo ? thumbnail : url}
                  alt={`Gallery ${isVideo ? 'Video' : 'Image'} ${index}`}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                {isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                        <path d="M8 5v14l11-7z"></path>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Grid Layout
          <div className="max-w-7xl mx-auto px-2 sm:px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {filteredImages.map(({ url, isVideo, thumbnail, category }, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg md:rounded-xl lg:rounded-2xl overflow-hidden group shadow-md md:shadow-lg dark:shadow-gray-800/50 transition-all duration-300 cursor-pointer active:scale-95"
                style={{
                  transitionDelay: `${(index % 6) * 50}ms`,
                }}
                onClick={(e) => handleImageClick(index, e)}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <img
                  src={isVideo ? thumbnail : url}
                  alt={`Gallery ${isVideo ? 'Video' : 'Image'} ${index}`}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                {isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                        <path d="M8 5v14l11-7z"></path>
                      </svg>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedImage(null)
                setClickedImagePosition(null)
              }
            }}
            onMouseEnter={() => setIsHovering(true)}
            style={{
              opacity: clickedImagePosition ? 0 : 1,
              transition: 'opacity 0.5s ease-out',
            }}
          >
            <div 
              className="relative max-w-4xl w-full max-h-[90vh] perspective-1000"
              style={{
                transform: clickedImagePosition 
                  ? `
                    translate(
                      ${clickedImagePosition.x - window.innerWidth/2 + clickedImagePosition.width/2}px,
                      ${clickedImagePosition.y - window.innerHeight/2 + clickedImagePosition.height/2}px
                    )
                    rotateY(${clickedImagePosition.x > window.innerWidth/2 ? -90 : 90}deg)
                    scale(0.2)
                  ` 
                  : 'none',
                transition: 'all 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="relative w-full h-full transform-style-preserve-3d">
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

                {filteredImages[selectedImage].isVideo ? (
                  <div className="w-full aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(filteredImages[selectedImage].url)}`}
                      className="w-full h-full rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        transform: clickedImagePosition ? 'rotateY(0deg)' : 'none',
                        transition: 'transform 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
                      }}
                    />
                  </div>
                ) : (
                  <img
                    src={filteredImages[selectedImage].url}
                    alt={`Enlarged view - ${filteredImages[selectedImage].category}`}
                    className="w-full h-full object-contain rounded-lg shadow-2xl"
                    style={{
                      transform: clickedImagePosition ? 'rotateY(0deg)' : 'none',
                      transition: 'transform 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
                    }}
                  />
                )}
                
                <div className="absolute bottom-4 left-4 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                  {filteredImages[selectedImage].category}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add VideoPlayer component */}
      {showVideoPlayer && (
        <VideoPlayer 
          videos={videoUrls}
          initialVideoIndex={selectedVideoIndex}
          onClose={() => setShowVideoPlayer(false)}
        />
      )}
    </main>
  )
}

// Add this utility function at the end of the component
function getYouTubeVideoId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

