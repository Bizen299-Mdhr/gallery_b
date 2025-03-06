"use client"
import { useEffect, useRef } from "react"

interface CustomCursorProps {
  position: { x: number; y: number }
  isHovering: boolean
}

export default function CustomCursor({ position, isHovering }: CustomCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current && dotRef.current) {
        // Position both elements precisely
        const x = e.clientX
        const y = e.clientY

        cursorRef.current.style.transform = `translate(${x}px, ${y}px) scale(${isHovering ? 1.2 : 1})`
        dotRef.current.style.transform = `translate(${x}px, ${y}px)`
      }
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [isHovering])

  return (
    <>
      {/* Ring cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          willChange: "transform",
          transformOrigin: "center center",
        }}
      >
        <div className="w-8 h-8 rounded-full border border-blue-500 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Dot cursor - actual click point */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          willChange: "transform",
        }}
      >
        <div className="w-1 h-1 bg-green-500 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <style jsx global>{`
        html, body {
          cursor: none !important;
        }
        a, button, [role="button"], input, select, textarea, label, [tabindex]:not([tabindex="-1"]) {
          cursor: none !important;
        }
      `}</style>
    </>
  )
}

