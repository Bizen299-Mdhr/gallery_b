"use client"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  login: (password: string) => Promise<boolean>
  loginWithPattern: (pattern: number[]) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// In a real app, these would be stored securely on the server
const CORRECT_PASSWORD = "cyber2077"

// The L shape pattern: Top-left → Middle-left → Bottom-left → Bottom-middle
const L_PATTERN = [0, 3, 6, 7]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user has a valid session stored
    const authStatus = localStorage.getItem("auth")
    if (authStatus === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (password: string): Promise<boolean> => {
    // Simulate network request delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem("auth", "true")
      return true
    }
    return false
  }

  const loginWithPattern = async (pattern: number[]): Promise<boolean> => {
    // Simulate network request delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Pattern submitted:", pattern)
    console.log("Expected L pattern:", L_PATTERN)

    // Check if the pattern matches the L shape (0,3,6,7)
    // We'll be lenient and just check if these 4 points are included, regardless of order
    if (
      pattern.length === 4 &&
      pattern.includes(0) &&
      pattern.includes(3) &&
      pattern.includes(6) &&
      pattern.includes(7)
    ) {
      console.log("Pattern matched! Logging in...")
      setIsAuthenticated(true)
      localStorage.setItem("auth", "true")
      return true
    }

    console.log("Pattern did not match")
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("auth")
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        loginWithPattern,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

