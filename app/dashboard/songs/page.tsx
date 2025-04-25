import SearchFilters from "@/app/components/songs/SearchFilters"
import SearchResults from "@/app/components/songs/SearchResults"
import { fetchNowPlaying, fetchSongsPages } from "@/app/lib/data"

type SearchParams = {
    query?: string
    page?: string
    levels?: string
    instrumental?: string
    keyMatch?: string
    keyCompatible?: string
    bpmRef?: string
    eighties?: string
    nineties?: string
    lastYear?: string
    thisYear?: string
    playable?: string
}

export default async function Page({
    searchParams,
}: { searchParams?: Promise<SearchParams> }) {
    const params = await (searchParams || {
        query: "",
        page: "1",
        levels: "",
        instrumental: "",
        keyMatch: "",
        keyCompatible: "",
        bpmRef: "",
        eighties: "",
        nineties: "",
        lastYear: "",
        thisYear: "",
        playable: "true",
    })
    const nowPlaying = await fetchNowPlaying()

    // If nothing is playing, show nothing playing
    const nowPlayingKey = nowPlaying?.currentSong?.key || undefined
    const nowPlayingBPM = nowPlaying?.currentSong?.bpm || undefined

    // Process search params
    const query = params.query || ""
    const currentPage = Number(params.page) || 1
    const levels = params.levels || ""
    const instrumental = params.instrumental || ""
    const keyMatch = params.keyMatch || ""
    const keyCompatible = params.keyCompatible || ""
    const bpmRef = params.bpmRef || ""
    const eighties = params.eighties === "true"
    const nineties = params.nineties === "true"
    const lastYear = params.lastYear === "true"
    const thisYear = params.thisYear === "true"
    const playable = params.playable === "true"

    // Pre-fetch data on the server
    const totalPages = await fetchSongsPages(
        query,
        levels,
        instrumental,
        keyMatch,
        keyCompatible,
        bpmRef,
        eighties.toString(),
        nineties.toString(),
        lastYear.toString(),
        thisYear.toString(),
        playable.toString(),
    )

    return (
        <div className="w-full">
            <SearchFilters
                initialValues={params}
                nowPlayingKey={nowPlayingKey}
                nowPlayingBPM={nowPlayingBPM}
            />
            <SearchResults
                query={query}
                currentPage={currentPage}
                levels={levels}
                instrumental={instrumental}
                keyMatch={keyMatch}
                keyCompatible={keyCompatible}
                bpmRef={bpmRef}
                eighties={eighties}
                nineties={nineties}
                lastYear={lastYear}
                thisYear={thisYear}
                playable={playable}
                totalPages={totalPages}
            />
        </div>
    )
}
