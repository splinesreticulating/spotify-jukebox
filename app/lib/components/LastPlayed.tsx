import { Song } from '../definitions'
import { pstToUTC } from '../utils'

export const LastPlayed: React.FC<{ song: Song }> = ({ song }) => {
    const datePlayedUTC = pstToUTC(song.date_played!)
    const currentDateUTC = new Date()
    const differenceInMilliseconds = currentDateUTC.getTime() - datePlayedUTC.getTime()
    const differenceInDays = differenceInMilliseconds / 1000 / 60 / 60 / 24
    
    return (<em>last played {Math.abs(differenceInDays).toFixed(0)} days ago</em>)
}
