import SearchFilters from '@/app/ui/songs/SearchFilters'
import SearchResults from '@/app/ui/songs/SearchResults'
import { fetchSongsPages, fetchNowPlaying } from '@/app/lib/data'

type SearchParams = {
  query?: string
  page?: string
  levels?: string
  instrumental?: string
  keyRef?: string
  bpmRef?: string
  eighties?: string
  nineties?: string
  lastYear?: string
  thisYear?: string
}

export default async function Page({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const params = await (searchParams ||
    Promise.resolve({
      query: '',
      page: '',
      levels: '',
      instrumental: '',
      keyRef: '',
      bpmRef: '',
      eighties: '',
      nineties: '',
      lastYear: '',
      thisYear: '',
    }))
  const nowPlaying = await fetchNowPlaying()

  // Process search params
  const query = params.query || ''
  const currentPage = Number(params.page) || 1
  const levels = params.levels || ''
  const instrumental = params.instrumental || ''
  const keyRef = params.keyRef || ''
  const bpmRef = params.bpmRef || ''
  const eighties = params.eighties === 'true'
  const nineties = params.nineties === 'true'
  const lastYear = params.lastYear === 'true'
  const thisYear = params.thisYear === 'true'

  // Pre-fetch data on the server
  const totalPages = await fetchSongsPages(
    query,
    levels,
    instrumental,
    keyRef,
    bpmRef,
    eighties.toString(),
    nineties.toString(),
    lastYear.toString(),
    thisYear.toString(),
  )

  return (
    <div className="w-full">
      <SearchFilters
        initialValues={params}
        nowPlayingKey={nowPlaying.currentSong.key || undefined}
        nowPlayingBPM={nowPlaying.currentSong.bpm || undefined}
      />
      <SearchResults
        query={query}
        currentPage={currentPage}
        levels={levels}
        instrumental={instrumental}
        keyRef={keyRef}
        bpmRef={bpmRef}
        eighties={eighties}
        nineties={nineties}
        lastYear={lastYear}
        thisYear={thisYear}
        totalPages={totalPages}
      />
    </div>
  )
}
