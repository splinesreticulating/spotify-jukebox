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

  // If the song was played today and has a previous play date, show the previous play date
  const daysAgoValue = Number(daysAgo(lastPlayedDate))
  if (daysAgoValue === 0 && beforeThatDate) {
    return <em>Last played {daysAgo(beforeThatDate)} days ago</em>
  }

  // Otherwise show the most recent play date
  return <em>Last played {daysAgoValue} days ago</em>
}
