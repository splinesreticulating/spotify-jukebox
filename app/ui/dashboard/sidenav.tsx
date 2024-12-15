'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import NavLinks from '@/app/ui/dashboard/nav-links'
import JukeBoxLogo from '@/app/ui/jukeBox-logo'
import { PowerIcon } from '@heroicons/react/24/outline'
import { handleSignOut } from '@/app/lib/actions/auth'
import { useTheme } from '@/app/lib/ThemeContext'
import clsx from 'clsx'

export default function SideNav() {
  const [isPending, startTransition] = useTransition()
  const { theme } = useTheme()

  const getThemeClasses = (element: 'logo' | 'background' | 'button') => {
    const themeMap = {
      ocean: {
        logo: 'bg-ocean-primary',
        background: 'bg-ocean-background',
        button: 'bg-ocean-background hover:bg-ocean-accent hover:text-ocean-primary',
      },
      forest: {
        logo: 'bg-forest-primary',
        background: 'bg-forest-background',
        button: 'bg-forest-background hover:bg-forest-accent hover:text-forest-primary',
      },
      sunset: {
        logo: 'bg-sunset-primary',
        background: 'bg-sunset-background',
        button: 'bg-sunset-background hover:bg-sunset-accent hover:text-sunset-primary',
      },
      purple: {
        logo: 'bg-purple-primary',
        background: 'bg-purple-background',
        button: 'bg-purple-background hover:bg-purple-accent hover:text-purple-primary',
      },
      midnight: {
        logo: 'bg-midnight-primary',
        background: 'bg-midnight-background',
        button: 'bg-midnight-background hover:bg-midnight-accent hover:text-midnight-primary',
      },
      christmas: {
        logo: 'bg-christmas-primary',
        background: 'bg-christmas-background',
        button: 'bg-christmas-background hover:bg-christmas-accent hover:text-christmas-primary',
      },
    }
    return themeMap[theme][element]
  }

  const handleSubmit = () => {
    startTransition(() => {
      handleSignOut()
    })
  }

  return (
    <div className="flex h-full flex-col px-4 py-4 sm:px-6 md:px-3">
      <Link
        className={clsx(
          'mb-4 flex h-16 items-end justify-start rounded-md p-2 sm:h-20 sm:p-3 md:h-40 md:p-4',
          getThemeClasses('logo'),
        )}
        href="/"
      >
        <div className="w-28 text-white sm:w-32 md:w-40">
          <JukeBoxLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className={clsx('hidden h-auto w-full grow rounded-md md:block', getThemeClasses('background'))}></div>
        <button
          onClick={handleSubmit}
          className={clsx(
            'flex h-12 w-full grow items-center justify-center gap-2 rounded-md p-2 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3',
            getThemeClasses('button'),
          )}
        >
          <PowerIcon className="w-5 sm:w-6" />
          <div className="block">Sign Out</div>
        </button>
      </div>
    </div>
  )
}
