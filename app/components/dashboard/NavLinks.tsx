'use client'

import { HomeIcon, PlayCircleIcon, MagnifyingGlassIcon, Cog6ToothIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { useTheme } from '@/app/lib/ThemeContext'
import { getThemeClasses } from '@/app/lib/theme-utils'

const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Nutsack', href: '/dashboard/songs', icon: MagnifyingGlassIcon },
  { name: 'Now playing', href: '/dashboard/nowPlaying', icon: PlayCircleIcon },
  { name: 'Stats', href: '/dashboard/stats', icon: ChartBarIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
]

export default function NavLinks() {
  const pathname = usePathname()
  const { theme } = useTheme()

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon
        const isActive = pathname === link.href
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3',
              getThemeClasses<'nav'>(theme, 'nav', isActive ? 'active' : 'base'),
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        )
      })}
    </>
  )
}
