"use client"

import { fetchNowPlaying, calculateUniqueness } from '@/app/lib/data'
import { NowPlayingData } from '@/app/lib/definitions'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface SongLinkProps {
  label: string;
  song: NowPlayingData;
}

const SongLink: React.FC<SongLinkProps> = ({ label, song }) => {
  return (
    <pre>
      {`${label}: `}
      <Link href={`/dashboard/songs/${song.songID}/edit`}>{`${song.artist} - ${song.title}`}</Link>
    </pre>
  )
}

export default function Page() {
  const [data, setData] = useState<NowPlayingData[] | null>(null)

  const fetchData = async () => {
    try {
      const nowPlaying = await fetchNowPlaying()

      const currentSong = nowPlaying[0]
      const lastSong = nowPlaying[1]

      if (nowPlaying)
        setData([{
          poolDepth: await calculateUniqueness(currentSong.songID), ...currentSong
        },
        { ...lastSong }])
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
          <SongLink label='last' song={data[1]}></SongLink>
          <SongLink label='now' song={data[0]}></SongLink>
          <br />
          <pre>{`Pool depth: ${data[0].poolDepth}`}</pre>
        </div>
      )}
    </div>
  )
}
