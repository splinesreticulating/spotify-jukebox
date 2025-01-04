'use client'

import clsx from 'clsx'
import { generatePagination } from '@/app/lib/utils'
import { useTheme } from '@/app/lib/ThemeContext'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface PaginationProps {
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
}

export default function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {
  const { theme } = useTheme()
  const allPages = generatePagination(currentPage, totalPages)

  const getThemeClasses = (isActive: boolean) => {
    const themeMap = {
      ocean: {
        active: 'bg-ocean-primary text-white',
        hover: 'hover:bg-ocean-accent hover:text-ocean-primary',
      },
      forest: {
        active: 'bg-forest-primary text-white',
        hover: 'hover:bg-forest-accent hover:text-forest-primary',
      },
      sunset: {
        active: 'bg-sunset-primary text-white',
        hover: 'hover:bg-sunset-accent hover:text-sunset-primary',
      },
      purple: {
        active: 'bg-purple-primary text-white',
        hover: 'hover:bg-purple-accent hover:text-purple-primary',
      },
      midnight: {
        active: 'bg-midnight-primary text-white',
        hover: 'hover:bg-midnight-accent hover:text-midnight-primary',
      },
      christmas: {
        active: 'bg-christmas-primary text-white',
        hover: 'hover:bg-christmas-accent hover:text-christmas-primary',
      },
    }
    return isActive ? themeMap[theme].active : themeMap[theme].hover
  }

  return (
    <div className="inline-flex">
      <PaginationArrow direction="left" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1} />

      <div className="flex -space-x-px">
        {allPages.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`${page}-${index}`} className="px-4 py-2 text-sm text-gray-700">
                {page}
              </span>
            )
          }

          const isActive = page === currentPage
          return (
            <button
              key={page}
              onClick={() => onPageChange(Number(page))}
              className={clsx(
                'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
                getThemeClasses(isActive),
              )}
            >
              {page}
            </button>
          )
        })}
      </div>

      <PaginationArrow
        direction="right"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      />
    </div>
  )
}

function PaginationArrow({
  direction,
  onClick,
  disabled,
}: {
  direction: 'left' | 'right'
  onClick: () => void
  disabled: boolean
}) {
  const Icon = direction === 'left' ? ChevronLeftIcon : ChevronRightIcon

  return (
    <button
      className={clsx(
        'inline-flex h-10 w-10 items-center justify-center rounded-md',
        disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-100',
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="sr-only">{direction === 'left' ? 'Previous page' : 'Next page'}</span>
      <Icon className="h-4 w-4" />
    </button>
  )
}
