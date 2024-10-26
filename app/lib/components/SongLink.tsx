import React from 'react'
import Link from 'next/link'
import { NowPlayingSong } from '../definitions'

export const SongLink: React.FC<{
  song: NowPlayingSong
  className?: string
}> = ({ song, className = '' }) => {
  return (
    <span className={`break-words text-sm sm:text-base ${className}`}>
      <Link href={`/dashboard/songs/${song.songID}/edit`} className="hover:underline">
        {` ${song.artist} - ${song.title}`.toLowerCase()}
      </Link>
    </span>
  )
}
