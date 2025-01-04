'use client'

import { useState } from 'react'
import { PlayIcon, ArrowPathIcon } from '@heroicons/react/24/solid'
import { useTheme } from '@/app/lib/ThemeContext'
import clsx from 'clsx'
import { toast } from 'sonner'

interface PlayButtonProps {
  songId: number
  className?: string
}

export default function PlayButton({ songId, className = '' }: PlayButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { theme } = useTheme()

  const getThemeClasses = () => {
    const themeMap = {
      ocean: 'hover:text-ocean-primary active:text-ocean-accent',
      forest: 'hover:text-forest-primary active:text-forest-accent',
      sunset: 'hover:text-sunset-primary active:text-sunset-accent',
      purple: 'hover:text-purple-primary active:text-purple-accent',
      midnight: 'hover:text-midnight-primary active:text-midnight-accent',
      christmas: 'hover:text-christmas-primary active:text-christmas-accent',
    }
    return themeMap[theme]
  }

  const handlePlay = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/play/${songId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to queue song')
      }

      toast.success('Song added to queue')
    } catch (error) {
      console.error('Error queueing song:', error)
      toast.error('Failed to queue song')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handlePlay}
      disabled={isLoading}
      className={clsx('rounded p-1 transition-colors', getThemeClasses(), className)}
    >
      {isLoading ? <ArrowPathIcon className="h-5 w-5 animate-spin" /> : <PlayIcon className="h-5 w-5" />}
    </button>
  )
}
