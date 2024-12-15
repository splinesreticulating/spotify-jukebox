'use client'

import {
  UserGroupIcon,
  HomeIcon,
  PlayCircleIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { useTheme } from '@/app/lib/ThemeContext'

const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Search', href: '/dashboard/songs', icon: MagnifyingGlassIcon },
  { name: 'Now playing', href: '/dashboard/nowPlaying', icon: PlayCircleIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
]

export default function NavLinks() {
  const pathname = usePathname()
  const { theme } = useTheme()

  const getThemeClasses = (isActive: boolean) => {
    const themeMap = {
      ocean: {
        base: 'bg-ocean-background hover:bg-ocean-accent hover:text-ocean-primary',
        active: 'bg-ocean-accent text-ocean-primary',
      },
      forest: {
        base: 'bg-forest-background hover:bg-forest-accent hover:text-forest-primary',
        active: 'bg-forest-accent text-forest-primary',
      },
      sunset: {
        base: 'bg-sunset-background hover:bg-sunset-accent hover:text-sunset-primary',
        active: 'bg-sunset-accent text-sunset-primary',
      },
      purple: {
        base: 'bg-purple-background hover:bg-purple-accent hover:text-purple-primary',
        active: 'bg-purple-accent text-purple-primary',
      },
      midnight: {
        base: 'bg-midnight-background hover:bg-midnight-accent hover:text-midnight-primary',
        active: 'bg-midnight-accent text-midnight-primary',
      },
      christmas: {
        base: 'bg-christmas-background hover:bg-christmas-accent hover:text-christmas-primary',
        active: 'bg-christmas-accent text-christmas-primary',
      },
    }
    return isActive ? themeMap[theme].active : themeMap[theme].base
  }

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
              getThemeClasses(isActive),
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
