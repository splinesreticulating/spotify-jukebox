export type Theme = 'ocean' | 'forest' | 'sunset' | 'purple' | 'midnight' | 'christmas'

export interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}
