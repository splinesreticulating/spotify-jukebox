import { Song } from '@/app/lib/types/songs'

export const DateAdded: React.FC<{ song: Song }> = ({ song }) => {
  return (
    <em>
      Added: {song.date_added?.toDateString()} · {song.count_played} spins
    </em>
  )
}
