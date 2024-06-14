"use client"

import { fetchNowPlaying, calculateUniqueness } from '@/app/lib/data'
import { NowPlayingData, NowPlayingSong } from '@/app/lib/definitions'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { HeartIcon as FullHeart } from '@heroicons/react/24/solid';
import { HeartIcon as EmptyHeart } from '@heroicons/react/24/outline';

interface SongLinkProps {
  label: string
  song: NowPlayingSong
}

const SongLink: React.FC<SongLinkProps> = ({ label, song }) => {
  return (
    <pre>
      {`${label}: `}
      <Link href={
        `/dashboard/songs/${song.songID}/edit`}>{`${song.artist} - ${song.title}`
        }</Link>
    </pre>
  )
}

const Heart: React.FC<{ nowPlaying: NowPlayingData }> = ({ nowPlaying }) => {
  return (
    <div className="flex items-center justify-center h-16 w-16 mx-auto">
      { nowPlaying.friends ?
        <Link
          href={`#`}><FullHeart className={`h-8 w-8 text-red-500`} />
        </Link> :
        <Link
          href={`#`}><EmptyHeart className={`h-8 w-8 text-red-500`} />
        </Link>
      }
    </div>)
}

export default function Page() {
  const [nowPlayingData, setNowPlayingData] = useState<NowPlayingData | null>(null)

  const fetchNowPlayingData = async () => {
    try {
      const { currentSong, lastSong, friends } = await fetchNowPlaying()
      const poolDepth = await calculateUniqueness(currentSong.songID)

      setNowPlayingData({ lastSong, currentSong: { poolDepth, ...currentSong }, friends })
    } catch (err) {
      console.error('error getting now playing info', err)
    }
  }

  // fetch data and set up the interval for auto-refresh
  useEffect(() => {
    fetchNowPlayingData() // Initial data fetch

    const interval = setInterval(() => { fetchNowPlayingData() }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-center">
      {nowPlayingData && (
        <div className="text-center">
          <pre><strong>Now Playing:</strong></pre>
          <div className="flex justify-center">
            <Image
              src={`/squirrelGuitarButton.png`}
              width={82}
              height={87}
              alt="Squirrel button"
            />
          </div>
          <br />
          <SongLink label='last' song={nowPlayingData.lastSong}></SongLink>
          <Heart nowPlaying={nowPlayingData}></Heart>
          <SongLink label='now' song={nowPlayingData.currentSong}></SongLink>
          <br />
          <pre>{`Pool depth: ${nowPlayingData.currentSong.poolDepth}`}</pre>
        </div>
      )}
    </div>
  )
}
