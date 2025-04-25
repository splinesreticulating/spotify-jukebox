import { SongLink } from "@/app/components/SongLink"
import PlayButton from "@/app/components/songs/PlayButton"
import { fetchLatestSongs } from "@/app/lib/data"
import { daysAgo } from "@/app/lib/utils"

export default async function LatestSongs() {
    const songs = await fetchLatestSongs()

    return (
        <div className="w-full">
            {/* Desktop View */}
            <div className="hidden lg:block">
                <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="w-12 px-3 py-3"></th>
                                <th
                                    scope="col"
                                    className="px-3 py-3 text-left text-sm font-semibold text-gray-900"
                                >
                                    Fresh Nuts
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 py-3 text-right text-sm font-semibold text-gray-900"
                                >
                                    Added
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {songs.map((song) => (
                                <tr
                                    key={song.id}
                                    className="transition-colors hover:bg-gray-50"
                                >
                                    <td className="whitespace-nowrap px-3 py-4">
                                        <PlayButton songId={song.id} />
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-3 pr-4">
                                        <SongLink
                                            song={{
                                                ...song,
                                                id: song.id,
                                                level: song.level,
                                                roboticness:
                                                    song.roboticness ?? 2,
                                            }}
                                        />
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-right text-sm text-gray-500">
                                        {daysAgo(song.date_added)}d ago
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile View */}
            <div className="space-y-2 lg:hidden">
                {songs.map((song) => (
                    <div
                        key={song.id}
                        className="rounded-lg bg-white p-3 shadow-sm transition-shadow duration-200 hover:shadow-md"
                    >
                        <div className="flex items-center gap-3">
                            <PlayButton songId={song.id} />

                            <div className="min-w-0 flex-1">
                                <SongLink
                                    song={{
                                        ...song,
                                        id: song.id,
                                        level: song.level,
                                        roboticness: song.roboticness ?? 2,
                                    }}
                                />
                                <p className="mt-0.5 text-xs text-gray-500">
                                    {Array.isArray(song.artists)
                                        ? song.artists.join(", ").length > 60
                                            ? `${song.artists.join(", ").substring(0, 60)}...`
                                            : song.artists.join(", ")
                                        : ""}
                                </p>
                            </div>

                            <span className="flex-shrink-0 text-xs text-gray-400">
                                {daysAgo(song.date_added!)}d
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
