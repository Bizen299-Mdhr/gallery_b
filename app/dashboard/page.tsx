"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import Dashboard from "@/components/dashboard"
import CustomCursor from "@/components/custom-cursor"

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener("resize", updateIsMobile)
    updateIsMobile() // Initial check

    return () => window.removeEventListener("resize", updateIsMobile)
  }, [])

  return isMobile
}

export default function DashboardPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      {!isMobile && <CustomCursor position={cursorPosition} isHovering={isHovering} />}
      <Dashboard setIsHovering={setIsHovering} />
    </>
  )
}

