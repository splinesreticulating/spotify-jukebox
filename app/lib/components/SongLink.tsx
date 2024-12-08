import React from 'react'
import Link from 'next/link'
import { NowPlayingSong } from '@/app/lib/types/songs'

export const SongLink: React.FC<{ song: NowPlayingSong; className?: string }> = ({ song, className = '' }) => (
  <span className={`break-words text-sm sm:text-base ${className}`}>
    <Link href={`/dashboard/songs/${song.songID}/edit`} className="hover:underline">
      {`${song.artists?.join(', ') || ''} - ${song.title || ''}`.toLowerCase()}
    </Link>
  </span>
)
