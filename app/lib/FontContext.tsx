'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { fontMap } from '@/app/fonts'

type FontContextType = {
  currentFont: { className: string; name: string }
  nextFont: () => void
}

const FontContext = createContext<FontContextType | undefined>(undefined)

export function FontProvider({ children }: { children: ReactNode }) {
  const fonts = Object.keys(fontMap)
  const [fontIndex, setFontIndex] = useState(() => new Date().getDate() % fonts.length)

  const currentFont = {
    className: fonts[fontIndex],
    name: fontMap[fonts[fontIndex]],
  }

  const nextFont = () => setFontIndex((current) => (current + 1) % fonts.length)

  return <FontContext.Provider value={{ currentFont, nextFont }}>{children}</FontContext.Provider>
}

export function useFont() {
  const context = useContext(FontContext)
  if (!context) throw new Error('useFont must be used within a FontProvider')
  return context
}
