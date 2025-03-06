import { Grid, List, Sun, Moon, LogOut } from "lucide-react"
import { Dispatch, SetStateAction } from "react"

interface HeaderProps {
  viewMode: "grid" | "float"
  setViewMode: Dispatch<SetStateAction<"grid" | "float">>
  isDarkMode: boolean
  toggleDarkMode: () => void
  logout: () => void
  setIsHovering: (value: boolean) => void
}

export function Header({
  viewMode,
  setViewMode,
  isDarkMode,
  toggleDarkMode,
  logout,
  setIsHovering
}: HeaderProps) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
      onMouseEnter={() => setIsHovering(true)}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Bzn Gallery</h1>
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
  )
} 