import { Song } from '../definitions'
import { daysAgo } from '../utils'

export const LastPlayed: React.FC<{ song: Song }> = ({ song }) => {
  // const lastPlayedDate = await checkHistorylists(song)
  const lastPlayedDate = song.date_played!
  const days = daysAgo(lastPlayedDate)

  return <em>last played {days} days ago</em>
}

// :thinkface:
// const checkHistorylists = async (song: Song) => {
//     let lastPlayedDate = new Date('00-00-0000')

//     const semiRecent = await db.historylist.findFirst({ where: { songID: song.id }, orderBy: { songID: 'desc'} })

//     console.log( { semiRecent })

//     if (!semiRecent) {
//         const notSoRecent = await db.historylist_last.findFirst({ where: { songID: song.id }, orderBy: { songID: 'desc'} })
//         console.log( { notSoRecent })

//         if (notSoRecent) lastPlayedDate = notSoRecent.date_played
//     }

//     return lastPlayedDate
// }
