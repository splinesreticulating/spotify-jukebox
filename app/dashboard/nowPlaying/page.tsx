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
      <Link href={`/dashboard/songs/${song.songID}/edit`}>{`${song.artist} - ${song.title}`}</Link>
    </pre>
  )
}

const Heart: React.FC<{ enabled: boolean }> = ({ enabled }) => {
  return (
    <div className="flex items-center justify-center h-16 w-16 mx-auto">
      {enabled ?
        <FullHeart className={`h-8 w-8 text-red-500`} /> :
        <EmptyHeart className={`h-8 w-8 text-red-500`} />
      }
    </div>)
}

export default function Page() {
  const [data, setData] = useState<NowPlayingData | null>(null)

  const fetchData = async () => {
    try {
      const nowPlaying = await fetchNowPlaying()

      const currentSong: NowPlayingSong = nowPlaying[0]
      const lastSong: NowPlayingSong = nowPlaying[1]

      if (nowPlaying)
        setData({
          friends: false,
          currentSong: {
            poolDepth: await calculateUniqueness(currentSong.songID),
            ...currentSong
          },
          lastSong
        })
    } catch (err) {
      console.error('error')
    }
  }

  // fetch data and set up the interval for auto-refresh
  useEffect(() => {
    fetchData() // Initial data fetch

    const interval = setInterval(() => { fetchData() }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-center">
      {data && (
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
          <SongLink label='last' song={data.lastSong}></SongLink>
          <Heart enabled={data.friends}></Heart>
          <SongLink label='now' song={data.currentSong}></SongLink>
          <br />
          <pre>{`Pool depth: ${data.currentSong.poolDepth}`}</pre>
        </div>
      )}
    </div>
  )
}
