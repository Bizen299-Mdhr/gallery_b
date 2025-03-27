"use client"
import { useState, useRef, useEffect } from "react"
import { X } from "lucide-react"

interface VideoPlayerProps {
  videos: {
    url: string
    thumbnail: string
    category: string
    isVideo: boolean
    title?: string
  }[]
  initialVideoIndex?: number
  onClose: () => void
}

export default function VideoPlayer({ 
  videos, 
  initialVideoIndex = 0,
  onClose 
}: VideoPlayerProps) {
  const [activeVideoIndex, setActiveVideoIndex] = useState(initialVideoIndex)
  const [videoKey, setVideoKey] = useState(Date.now()) // Add key to force iframe refresh
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)
  
  // Handle keyboard events (Escape key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])
  
  // Prevent scroll propagation and disable body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    
    const preventScroll = (e: WheelEvent) => {
      e.stopPropagation()
    }
    
    const playerContainer = playerContainerRef.current
    if (playerContainer) {
      playerContainer.addEventListener('wheel', preventScroll, { passive: false })
    }
    
    // Enable auto-scroll for the video list
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return
    
    let scrollPosition = 0
    const scrollHeight = scrollContainer.scrollHeight
    const containerHeight = scrollContainer.clientHeight
    const scrollSpeed = 0.5
    let isPaused = false
    
    const handleScroll = () => {
      if (isPaused) {
        requestAnimationFrame(handleScroll)
        return
      }
      
      scrollPosition += scrollSpeed
      
      if (scrollPosition >= scrollHeight / 2) {
        scrollPosition = 0
      }
      
      scrollContainer.scrollTop = scrollPosition
      requestAnimationFrame(handleScroll)
    }
    
    const animationId = requestAnimationFrame(handleScroll)
    
    // Pause on hover
    const handleMouseEnter = () => {
      isPaused = true
    }
    
    const handleMouseLeave = () => {
      isPaused = false
    }
    
    scrollContainer.addEventListener('mouseenter', handleMouseEnter)
    scrollContainer.addEventListener('mouseleave', handleMouseLeave)
    
    // Scroll to active video initially
    if (activeVideoIndex > 0) {
      const activeElement = scrollContainer.querySelector(`.video-item-${activeVideoIndex}`)
      if (activeElement) {
        scrollContainer.scrollTop = activeElement.getBoundingClientRect().top - 
          scrollContainer.getBoundingClientRect().top
      }
    }
    
    // Cleanup function
    return () => {
      document.body.style.overflow = ''
      if (playerContainer) {
        playerContainer.removeEventListener('wheel', preventScroll)
      }
      if (scrollContainer) {
        scrollContainer.removeEventListener('mouseenter', handleMouseEnter)
        scrollContainer.removeEventListener('mouseleave', handleMouseLeave)
      }
      cancelAnimationFrame(animationId)
    }
  }, [activeVideoIndex])
  
  // Handle wheel event to prevent default behavior
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation()
  }
  
  // Function to extract YouTube video ID
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }
  
  // Handle video selection
  const handleVideoSelect = (index: number) => {
    setActiveVideoIndex(index)
    setVideoKey(Date.now()) // Force iframe refresh
  }

  return (
    <div 
      ref={playerContainerRef}
      className="fixed inset-0 z-50 bg-black flex flex-col"
      onClick={(e) => e.stopPropagation()}
      onWheel={handleWheel}
    >
      {/* YouTube-like header with keyboard shortcut hint */}
      <div className="bg-gray-900 w-full py-2 px-4 flex justify-between items-center">
        <h1 className="text-white font-medium">Video Player</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm hidden sm:inline-block">
            Press ESC to close
          </span>
          <button
            className="text-white hover:text-gray-300 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            aria-label="Close video player"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex flex-1 h-[calc(100vh-48px)] overflow-hidden">
        {/* Main video player */}
        <div 
          className="w-full lg:w-[70%] h-full bg-black flex flex-col"
          onWheel={(e) => e.stopPropagation()}
        >
          <div className="aspect-video w-full flex-shrink-0">
            <iframe
              key={videoKey} // Add key to force iframe refresh on video change
              src={`https://www.youtube.com/embed/${getYouTubeVideoId(videos[activeVideoIndex].url)}?autoplay=1&rel=0`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          
          {/* Video info section */}
          <div className="p-4 text-white overflow-y-auto" onWheel={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold">{videos[activeVideoIndex].title || `Video ${activeVideoIndex + 1}`}</h2>
            <p className="text-gray-400 mt-2">{videos[activeVideoIndex].category}</p>
          </div>
        </div>
        
        {/* Video list sidebar */}
        <div 
          ref={scrollContainerRef}
          className="hidden lg:block w-[30%] h-full bg-gray-900 overflow-hidden"
          onWheel={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-gray-900 p-3 border-b border-gray-800 z-10">
            <h3 className="text-white font-medium">Up Next</h3>
          </div>
          
          <div className="video-list-container">
            {/* Original videos */}
            {videos.map((video, index) => (
              <div 
                key={index}
                className={`video-item-${index} p-3 flex gap-3 cursor-pointer hover:bg-gray-800 transition-colors ${
                  index === activeVideoIndex ? 'bg-gray-800' : ''
                }`}
                onClick={() => handleVideoSelect(index)}
              >
                <div className="relative w-40 aspect-video flex-shrink-0">
                  <img 
                    src={video.thumbnail}
                    alt={`Video thumbnail ${index}`}
                    className="w-full h-full object-cover rounded"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center opacity-80">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                        <path d="M8 5v14l11-7z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 text-white">
                  <p className="line-clamp-2 font-medium text-sm">
                    {video.title || `Video ${index + 1}`}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    {video.category}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Duplicate videos for seamless scrolling */}
            {videos.map((video, index) => (
              <div 
                key={`duplicate-${index}`}
                className={`p-3 flex gap-3 cursor-pointer hover:bg-gray-800 transition-colors ${
                  index === activeVideoIndex ? 'bg-gray-800' : ''
                }`}
                onClick={() => handleVideoSelect(index)}
              >
                <div className="relative w-40 aspect-video flex-shrink-0">
                  <img 
                    src={video.thumbnail}
                    alt={`Video thumbnail ${index}`}
                    className="w-full h-full object-cover rounded"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center opacity-80">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                        <path d="M8 5v14l11-7z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-white">
                  <p className="line-clamp-2 font-medium text-sm">
                    {video.title || `Video ${index + 1}`}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    {video.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Mobile playlist (shows below video on small screens) */}
      <div 
        className="lg:hidden w-full bg-gray-900 h-64 overflow-y-auto"
        onWheel={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gray-900 p-3 border-b border-gray-800">
          <h3 className="text-white font-medium">Up Next</h3>
        </div>
        
        {videos.map((video, index) => (
          <div 
            key={index}
            className={`p-2 flex gap-2 cursor-pointer hover:bg-gray-800 transition-colors ${
              index === activeVideoIndex ? 'bg-gray-800' : ''
            }`}
            onClick={() => handleVideoSelect(index)}
          >
            <div className="relative w-24 aspect-video flex-shrink-0">
              <img 
                src={video.thumbnail}
                alt={`Video thumbnail ${index}`}
                className="w-full h-full object-cover rounded"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center opacity-80">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                    <path d="M8 5v14l11-7z"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex-1 text-white">
              <p className="line-clamp-2 font-medium text-xs">
                {video.title || `Video ${index + 1}`}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                {video.category}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 