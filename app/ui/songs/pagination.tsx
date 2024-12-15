'use client'

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import Link from 'next/link'
import { generatePagination } from '@/app/lib/utils'
import { usePathname, useSearchParams } from 'next/navigation'
import { useTheme } from '@/app/lib/ThemeContext'

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams?.get('page')) || 1
  const { theme } = useTheme()

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

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  const allPages = generatePagination(currentPage, totalPages)

  return (
    <div className="inline-flex">
      <PaginationArrow
        direction="left"
        href={createPageURL(currentPage - 1)}
        isDisabled={currentPage <= 1}
        theme={theme}
      />

      <div className="flex -space-x-px">
        {allPages.map((page, index) => {
          let position: 'first' | 'last' | 'single' | 'middle' | undefined

          if (index === 0) position = 'first'
          if (index === allPages.length - 1) position = 'last'
          if (allPages.length === 1) position = 'single'
          if (page === '...') position = 'middle'

          return (
            <PaginationNumber
              key={page}
              href={createPageURL(page)}
              page={page}
              position={position}
              isActive={currentPage === page}
              themeClasses={getThemeClasses(currentPage === page)}
            />
          )
        })}
      </div>

      <PaginationArrow
        direction="right"
        href={createPageURL(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
        theme={theme}
      />
    </div>
  )
}

function PaginationNumber({
  page,
  href,
  isActive,
  position,
  themeClasses,
}: {
  page: number | string
  href: string
  position?: 'first' | 'last' | 'middle' | 'single'
  isActive: boolean
  themeClasses: string
}) {
  const className = clsx(
    'flex h-10 w-10 items-center justify-center text-sm border',
    {
      'rounded-l-md': position === 'first' || position === 'single',
      'rounded-r-md': position === 'last' || position === 'single',
      'z-10 border-none': isActive,
      'hover:bg-gray-100': !isActive && position !== 'middle',
      'text-gray-300': position === 'middle',
    },
    themeClasses,
  )

  if (position === 'middle') {
    return <div className={className}>...</div>
  }

  return (
    <Link href={href} className={className}>
      {page}
    </Link>
  )
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
  theme,
}: {
  href: string
  direction: 'left' | 'right'
  isDisabled?: boolean
  theme: string
}) {
  const className = clsx('flex h-10 w-10 items-center justify-center rounded-md border', {
    'pointer-events-none text-gray-300': isDisabled,
    'hover:bg-gray-100': !isDisabled,
    [`hover:bg-${theme}-accent hover:text-${theme}-primary`]: !isDisabled,
  })

  const icon = direction === 'left' ? <ArrowLeftIcon className="w-4" /> : <ArrowRightIcon className="w-4" />

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link className={className} href={href}>
      {icon}
    </Link>
  )
}
