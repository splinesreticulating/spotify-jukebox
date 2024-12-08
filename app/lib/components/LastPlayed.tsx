import { useEffect, useState } from 'react'
import { Song } from '@/app/lib/types/songs'
import { daysAgo } from '../utils'
import { getLastPlayedDatesFromHistory } from '../data'

export const LastPlayed: React.FC<{ song: Song }> = ({ song }) => {
  const [lastPlayedDate, setLastPlayedDate] = useState<Date | null>(null)
  const [beforeThatDate, setBeforeThatDate] = useState<Date | null>(null)

  useEffect(() => {
    const fetchLastPlayedDate = async () => {
      const { lastPlayed, beforeThat } = await getLastPlayedDatesFromHistory(song.id)
      setLastPlayedDate(lastPlayed)
      setBeforeThatDate(beforeThat)
    }

    fetchLastPlayedDate()
  }, [song.id])

  if (!lastPlayedDate) {
    return <em>unplayed</em>
  }
  return (
    <em>
      Last played {daysAgo(lastPlayedDate)} days ago
      {beforeThatDate && ` (before that: ${daysAgo(beforeThatDate)} days ago)`}
    </em>
  )
}
