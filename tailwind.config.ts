import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Ocean Theme
        ocean: {
          primary: '#2C698D',
          secondary: '#4E9BB9',
          accent: '#BAE6FD',
          hover: '#1E4D69',
          background: '#F0F9FF',
        },
        // Forest Theme
        forest: {
          primary: '#2D6A4F',
          secondary: '#40916C',
          accent: '#95D5B2',
          hover: '#1B4332',
          background: '#F0FFF4',
        },
        // Sunset Theme
        sunset: {
          primary: '#C04A1C',
          secondary: '#E86A33',
          accent: '#FFC26F',
          hover: '#8B2B0C',
          background: '#FFF7ED',
        },
        // Purple Rain Theme
        purple: {
          primary: '#6D28D9',
          secondary: '#8B5CF6',
          accent: '#DDD6FE',
          hover: '#5B21B6',
          background: '#F5F3FF',
        },
        // Midnight Theme
        midnight: {
          primary: '#1E293B',
          secondary: '#334155',
          accent: '#94A3B8',
          hover: '#0F172A',
          background: '#F8FAFC',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
export default config
