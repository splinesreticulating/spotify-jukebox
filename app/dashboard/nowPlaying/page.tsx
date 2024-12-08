'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { befriend, defriend } from '@/app/lib/actions'
import { NowPlayingData } from '@/app/lib/types/songs'
import { SongLink } from '@/app/lib/components/SongLink'
import { Heart } from '@/app/lib/components/Heart'
import { NowPlayingSkeleton } from '@/app/ui/skeletons'

export default function NowPlayingPage() {
  const [nowPlayingData, setNowPlayingData] = useState<NowPlayingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let eventSource: EventSource | null = null

    const setupEventSource = () => {
      eventSource = new EventSource('/api/nowPlaying')

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data)
        setNowPlayingData(data)
        setIsLoading(false)
      }

      eventSource.onerror = (event: Event) => {
        const target = event.target as EventSource
        console.error('EventSource failed:', {
          readyState: target.readyState,
          url: target.url,
        })
        eventSource?.close()
      }
    }

    setupEventSource()

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Reconnect EventSource when tab becomes visible
        if (eventSource) {
          eventSource.close()
        }
        setupEventSource()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      eventSource?.close()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const toggleFriendship = async () => {
    if (!nowPlayingData) return

    const action = nowPlayingData.friends ? defriend : befriend
    await action(nowPlayingData)

    setNowPlayingData((prev) => prev && { ...prev, friends: !prev.friends })
  }

  if (isLoading) return <NowPlayingSkeleton />
  if (!nowPlayingData) return null

  const { lastSong, currentSong, nextSong, friends } = nowPlayingData

  return (
    <main className="flex flex-col items-center justify-center p-4 sm:p-6">
      <section className="w-full max-w-md text-center">
        <Image src="/squirrelGuitarButton.png" width={92} height={95} alt="Squirrel button" className="mx-auto my-2" />
        <ul className="flex w-full flex-col items-center space-y-4">
          <li>
            last: <SongLink song={lastSong} />
          </li>
          <li>
            <Heart onHeartClick={toggleFriendship} isHeartFilled={friends} />
          </li>
          <li>
            now: <SongLink song={currentSong} className="font-bold" />
          </li>
          <li>
            next: <SongLink song={nextSong} />
          </li>
        </ul>
      </section>
    </main>
  )
}
