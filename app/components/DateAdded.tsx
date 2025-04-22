import { Song } from '@/app/lib/types/songs'

export const DateAdded: React.FC<{ song: Song }> = ({ song }) => {
  return (
      <span className="flex items-center gap-3">
      <em>Added: {song.date_added?.toDateString()}</em>
      <span>·</span>
      <em>{song.count_played} {song.count_played === 1 ? 'spin' : 'spins'}</em>
    </span>
  )
}
