import { Dispatch, SetStateAction } from "react"

interface CategoryNavProps {
  activeCategory: string
  setActiveCategory: Dispatch<SetStateAction<string>>
  categories: string[]
  setIsHovering: (value: boolean) => void
}

export function CategoryNav({
  activeCategory,
  setActiveCategory,
  categories,
  setIsHovering
}: CategoryNavProps) {
  return (
    <div
      className="fixed top-16 left-0 right-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md"
      onMouseEnter={() => setIsHovering(true)}
    >
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
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
} 