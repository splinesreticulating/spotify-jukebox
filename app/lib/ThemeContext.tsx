'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'ocean' | 'forest' | 'sunset' | 'purple' | 'midnight' | 'christmas'

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

export type { Theme }
