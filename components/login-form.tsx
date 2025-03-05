"use client"
import { useState, useRef, useEffect, useCallback } from "react"
import { Lock, Check, ArrowRight } from "lucide-react"
import { useAuth } from "./auth-provider"
import toast from "react-hot-toast"

interface LoginFormProps {
  setIsHovering: (value: boolean) => void
}

interface PatternPoint {
  x: number
  y: number
  index: number
}

export default function LoginForm({ setIsHovering }: LoginFormProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [shake, setShake] = useState(false)
  const [usePattern, setUsePattern] = useState(false)
  const [patternPoints, setPatternPoints] = useState<PatternPoint[]>([])
  const patternRef = useRef<HTMLDivElement>(null)
  const { login, loginWithPattern, isAuthenticated } = useAuth()
  const [debug, setDebug] = useState("")

  // Generate pattern grid points
  const patternGrid = Array.from({ length: 9 }, (_, i) => ({
    index: i,
    row: Math.floor(i / 3),
    col: i % 3,
  }))

  const handlePasswordSubmit = useCallback(async () => {
    if (!password) {
      setError("Password is required")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const success = await login(password)

      if (!success) {
        toast.error("Incorrect password");
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [password, login])

  const handlePatternSubmit = async () => {
    setIsLoading(true)
    setError("")
    setDebug(`Submitting pattern: ${patternPoints.map((p) => p.index).join(", ")}`)

    // Convert pattern to array of indices
    const patternIndices = patternPoints.map((p) => p.index)

    try {
      // Try to login with pattern
      const success = await loginWithPattern(patternIndices)

      if (!success) {
        setShake(true)
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
      if (!isAuthenticated) {
        setPatternPoints([])
      }
    }
  }

  // Handle clicking on a pattern point
  const handlePointClick = (index: number, row: number, col: number) => {
    if (isLoading) return

    // Add the point to our pattern
    setPatternPoints((prev) => {
      // If this point is already in our pattern, don't add it again
      if (prev.some((p) => p.index === index)) {
        return prev
      }

      const newPoints = [...prev, { index, x: col, y: row }]

      // If we have 4 points, submit the pattern after a short delay
      if (newPoints.length === 5) {
        // Move the setTimeout outside the state update
        setTimeout(() => {
          handlePatternSubmit()
        }, 100)
      }

      return newPoints
    })
  }

  // Reset pattern when switching modes
  useEffect(() => {
    setPatternPoints([])
    setError("")
    setDebug("")
  }, [usePattern])

  useEffect(() => {
    if (patternPoints.length === 5) {
      setTimeout(() => {
        handlePatternSubmit()
      }, 100)
    }
  }, [patternPoints])

  return (
    <div
      className={`glass-panel transition-all duration-500 overflow-hidden flex items-center ${shake ? "shake" : ""}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{ width: usePattern ? "499px" : "500px", borderRadius: "16px" }}
    >
      {/* Left side - Profile image */}
      <div className="flex-shrink-0 p-4">
        <div className="rounded-full border-2 border-green-500 p-1 overflow-hidden">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-black">
            <img
              src="https://picsum.photos/200/200?random=profile"
              alt="Profile"
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-grow p-4">
        {/* Toggle switch */}
        <div className="flex justify-between mb-8">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setUsePattern(!usePattern)}>
            <span className="text-xs text-gray-400">{usePattern ? "Password" : "Pattern"}</span>
            <div className="relative w-10 h-5 bg-gray-800 rounded-full">
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-green-500 transition-all duration-300 ${
                  usePattern ? "left-5" : "left-0.5"
                }`}
              ></div>
            </div>
            <span className="text-xs text-gray-400">{usePattern ? "Pattern" : "Password"}</span>
          </div>
        </div>

        {usePattern ? (
          // Pattern lock screen - simplified to just click on points
          <div ref={patternRef} className="w-full aspect-square max-w-[200px] mx-auto relative mt-4">
            {/* Pattern grid with labels */}
            <div className="grid grid-cols-3 gap-4 h-full w-full">
              {patternGrid.map((point) => (
                <button
                  key={point.index}
                  onClick={() => handlePointClick(point.index, point.row, point.col)}
                  disabled={isLoading || patternPoints.some((p) => p.index === point.index)}
                  className={`relative flex items-center justify-center rounded-full transition-all duration-200 
                    ${
                      patternPoints.some((p) => p.index === point.index)
                        ? "bg-green-500/30 scale-110"
                        : "bg-gray-800/50 hover:bg-green-500/10"
                    }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full transition-all duration-200 ${
                      patternPoints.some((p) => p.index === point.index)
                        ? "bg-green-500 scale-110"
                        : "bg-gray-600 hover:bg-green-500/50"
                    }`}
                  >
                    {/* Show the index number inside each point */}
                    <span className="text-xs text-white">{point.index}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Pattern lines */}
            <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
              {patternPoints.length > 1 &&
                patternPoints.map((point, i) => {
                  if (i === 0) return null
                  const prev = patternPoints[i - 1]
                  const pointSize = patternRef.current ? patternRef.current.clientWidth / 3 : 0
                  const x1 = prev.x * pointSize + pointSize / 2
                  const y1 = prev.y * pointSize + pointSize / 2
                  const x2 = point.x * pointSize + pointSize / 2
                  const y2 = point.y * pointSize + pointSize / 2

                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgb(34, 197, 94)" strokeWidth="2" />
                })}
            </svg>

            {/* Counter showing progress */}
            <div className="absolute -bottom-8 left-0 right-0 text-center text-xs text-green-500">
              {patternPoints.length > 0 ? `${patternPoints.length}/4 points selected` : ""}
            </div>

            {error && (
              <div className="absolute -bottom-14 left-0 right-0 text-center text-xs text-red-500">{error}</div>
            )}

            {debug && (
              <div className="absolute -bottom-20 left-0 right-0 text-center text-xs text-blue-500">{debug}</div>
            )}

            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                <svg
                  className="h-8 w-8 animate-spin text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            )}

            {/* Manual submit button as a fallback */}
            {patternPoints.length >= 4 && !isLoading && (
              <button
                onClick={handlePatternSubmit}
                className="absolute -bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 bg-green-500 text-white rounded-md text-sm"
              >
                Login with Pattern
              </button>
            )}
          </div>
        ) : (
          // Password input
          <div className="relative">
            <div className="flex items-center">
              <div className="absolute left-3 pointer-events-none">
                {password ? <Check className="h-5 w-5 text-green-500" /> : <Lock className="h-5 w-5 text-gray-400" />}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handlePasswordSubmit();
                  }
                }}
                className={`w-full rounded-full border bg-black/30 p-3 pl-10 pr-12 transition-all duration-300 focus:outline-none ${
                  error ? "border-red-500 text-red-300" : "border-gray-700 text-white"
                } focus:border-green-500 focus:ring-1 focus:ring-green-500`}
                placeholder="Enter password"
              />
              <button
                onClick={handlePasswordSubmit}
                className="absolute right-3 p-1 text-gray-400 hover:text-green-500 transition-colors"
                disabled={isLoading}
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            {isLoading && (
              <div className="absolute right-12 top-1/2 -translate-y-1/2">
                <svg
                  className="h-4 w-4 animate-spin text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

