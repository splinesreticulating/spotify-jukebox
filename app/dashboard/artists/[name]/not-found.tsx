'use client'

import Link from 'next/link'
import { FaceFrownIcon } from '@heroicons/react/24/outline'
import { useTheme } from '@/app/lib/ThemeContext'

export default function NotFound() {
  const { theme } = useTheme()

  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <FaceFrownIcon className="w-10 text-gray-400" />
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <p>Artist not found :(</p>
      <Link
        href="/dashboard/songs"
        className={`mt-4 rounded-md px-4 py-2 text-sm text-white transition-colors bg-${theme}-primary hover:bg-${theme}-hover`}
      >
        Go Back
      </Link>
    </main>
  )
}
