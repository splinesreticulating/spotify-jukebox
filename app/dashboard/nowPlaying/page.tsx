'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { befriend, defriend } from '@/app/lib/actions'
import { NowPlayingData, NowPlayingSong } from '@/app/lib/types/songs'
import { SongLink } from '@/app/lib/components/SongLink'
import { Heart } from '@/app/lib/components/Heart'
import { NowPlayingSkeleton } from '@/app/ui/skeletons'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { fetchCompatibleSongs } from '@/app/lib/actions'
import PlayButton from '@/app/ui/songs/PlayButton'
import { getLevelColor } from '@/app/lib/utils'

export default function NowPlayingPage() {
  const [nowPlayingData, setNowPlayingData] = useState<NowPlayingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const [compatibleSongs, setCompatibleSongs] = useState<NowPlayingSong[]>([])

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

  const toggleExpanded = async () => {
    if (!isExpanded && nowPlayingData?.currentSong) {
      const songs = await fetchCompatibleSongs(nowPlayingData.currentSong.songID, nowPlayingData.nextSong.songID)
      setCompatibleSongs(songs)
    }
    setIsExpanded(!isExpanded)
  }

  if (isLoading) return <NowPlayingSkeleton />
  if (!nowPlayingData) return null

  const { lastSong, currentSong, nextSong, friends } = nowPlayingData

  return (
    <main className="flex flex-col items-center justify-center p-4 sm:p-6">
      <section className="w-full max-w-md text-center">
        <Image src="/squirrelGuitarButton.png" width={92} height={95} alt="Squirrel button" className="mx-auto my-2" />
        <ul className="flex w-full flex-col items-center space-y-4">
          {lastSong.title && (
            <>
              <li>
                <span className={getLevelColor(lastSong.level)}>last:</span> <SongLink song={lastSong} />
              </li>
              <li>
                <Heart onHeartClick={toggleFriendship} isHeartFilled={friends} />
              </li>
            </>
          )}
          <li>
            <span className={getLevelColor(currentSong.level)}>now:</span>{' '}
            <SongLink song={currentSong} className="font-bold" />
          </li>
          <li className="w-full">
            {nextSong.title ? (
              <>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={toggleExpanded}
                    className="rounded-full p-1 hover:bg-gray-100"
                    aria-label={isExpanded ? 'Hide compatible songs' : 'Show compatible songs'}
                  >
                    {isExpanded ? <ChevronDownIcon className="h-5 w-5" /> : <ChevronRightIcon className="h-5 w-5" />}
                  </button>
                  <span>
                    <span className={getLevelColor(nextSong.level)}>next:</span> <SongLink song={nextSong} />
                  </span>
                </div>
                {isExpanded && (
                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    {compatibleSongs.length > 0 ? (
                      <>
                        <p className="font-medium">or...</p>
                        <ul className="space-y-1 text-center">
                          {compatibleSongs.map((song) => (
                            <li key={song.songID} className="flex items-center justify-center gap-1">
                              <PlayButton songId={song.songID} />
                              <SongLink song={song} />
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <p>¯\_(ツ)_/¯</p>
                    )}
                  </div>
                )}
              </>
            ) : null}
          </li>
        </ul>
      </section>
    </main>
  )
}
