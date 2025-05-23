"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import LoginForm from "@/components/login-form"
import CustomCursor from "@/components/custom-cursor"
import ParallaxGrid from "@/components/parallax-grid"

export default function Home() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Set initial dark mode from localStorage on page load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("darkMode")
      const isDarkMode = savedMode ? JSON.parse(savedMode) : true
      document.documentElement.classList.toggle("dark", isDarkMode)
    }
  }, [])

  return (
    <main className="relative min-h-screen overflow-hidden bg-white dark:bg-gray-950 transition-colors duration-300">
      <CustomCursor position={cursorPosition} isHovering={isHovering} />

      <div className="absolute inset-0 w-full h-full">
        <ParallaxGrid setIsHovering={setIsHovering} />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <LoginForm setIsHovering={setIsHovering} />
      </div>
    </main>
  )
}

