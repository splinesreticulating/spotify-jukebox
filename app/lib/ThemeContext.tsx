'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type Theme = 'ocean' | 'forest' | 'sunset' | 'purple' | 'midnight' | 'christmas'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_STORAGE_KEY = 'squirrel-radio-theme'
const DEFAULT_THEME: Theme = 'ocean'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
    if (savedTheme && isValidTheme(savedTheme)) {
      setThemeState(savedTheme)
    }
    setIsLoading(false)
  }, [])

  const setTheme = (newTheme: Theme) => {
    if (!isValidTheme(newTheme)) {
      console.error(`Invalid theme: ${newTheme}`)
      return
    }

    setThemeState(newTheme)
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)

    // Update CSS variables or classes if needed
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  // Don't render children until theme is loaded
  if (isLoading) {
    return null
  }

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Type guard for theme validation
function isValidTheme(theme: string): theme is Theme {
  return ['ocean', 'forest', 'sunset', 'purple', 'midnight', 'christmas'].includes(theme)
}

// Theme utility functions
export const themeColors = {
  ocean: {
    primary: 'rgb(59, 130, 246)',
    accent: 'rgb(219, 234, 254)',
    hover: 'rgb(37, 99, 235)',
  },
  forest: {
    primary: 'rgb(22, 163, 74)',
    accent: 'rgb(220, 252, 231)',
    hover: 'rgb(21, 128, 61)',
  },
  sunset: {
    primary: 'rgb(249, 115, 22)',
    accent: 'rgb(255, 237, 213)',
    hover: 'rgb(234, 88, 12)',
  },
  purple: {
    primary: 'rgb(147, 51, 234)',
    accent: 'rgb(243, 232, 255)',
    hover: 'rgb(126, 34, 206)',
  },
  midnight: {
    primary: 'rgb(30, 41, 59)',
    accent: 'rgb(226, 232, 240)',
    hover: 'rgb(15, 23, 42)',
  },
  christmas: {
    primary: 'rgb(220, 38, 38)',
    accent: 'rgb(254, 226, 226)',
    hover: 'rgb(185, 28, 28)',
  },
} as const

// Theme selector component
export function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value as Theme)}
      className="rounded-md border border-gray-300 px-3 py-2 text-sm"
      aria-label="Select theme"
    >
      <option value="ocean">Ocean</option>
      <option value="forest">Forest</option>
      <option value="sunset">Sunset</option>
      <option value="purple">Purple</option>
      <option value="midnight">Midnight</option>
      <option value="christmas">Christmas</option>
    </select>
  )
}
