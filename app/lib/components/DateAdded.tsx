import { Song } from '../definitions'

export const DateAdded: React.FC<{ song: Song }> = ({ song }) => {
  return (
    <em>
      added {song.date_added?.toDateString()} | {song.count_played} spins
    </em>
  )
}
