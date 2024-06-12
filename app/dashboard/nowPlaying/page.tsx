"use client"

import { fetchNowPlaying, calculateUniqueness } from '@/app/lib/data'
import { NowPlayingData } from '@/app/lib/definitions'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Page() {
  const [data, setData] = useState<NowPlayingData | null>(null)

  const fetchData = async () => {
    try {
      const nowPlaying = await fetchNowPlaying()

      if (nowPlaying)
        setData({ uniquenessScore: await calculateUniqueness(nowPlaying.songID), ...nowPlaying })
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
           <pre><Link href={`/dashboard/songs/${data.songID}/edit`}>{`${data.artist} - ${data.title}`}</Link></pre>
          <br />
          <pre>{`Similar nuts: ${data.uniquenessScore}`}</pre>
          {/* <pre>{`Last played: `}</pre> */}
        </div>
      )}
    </div>
  )
}
