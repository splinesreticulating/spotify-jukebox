import { Song } from '../definitions'
import { daysAgo } from '../utils'

export const LastPlayed: React.FC<{ song: Song }> = ({ song }) => {
    const days = daysAgo(song.date_played!)
    
    return (<em>last played {days} days ago</em>)
}
