import React from 'react'
import Link from 'next/link'
import { NowPlayingSong } from '@/app/lib/types/songs'
import { getLevelColor } from '../utils'

export const SongLink: React.FC<{ song: NowPlayingSong; className?: string }> = ({ song, className = '' }) => {
  return (
    <span className={`break-words text-sm sm:text-base ${className}`}>
      <Link href={`/dashboard/songs/${song.songID}/edit`} className={`hover:underline ${getLevelColor(song.level)}`}>
        {`${song.artists?.join(', ') || ''} - ${song.title || ''}`.toLowerCase()}
      </Link>
    </span>
  )
}
