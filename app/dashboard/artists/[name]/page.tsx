import { EXCLUDED_TAGS } from "@/app/lib/constants/lists"
import { fetchArtistInfo, fetchSongsByArtist } from "@/app/lib/data"
import Image from "next/image"
import { notFound } from "next/navigation"
import SongTable from "./SongTable"

export default async function ArtistPage({
    params,
}: { params: Promise<{ name: string }> }) {
    const { name } = await params
    const decodedName = decodeURIComponent(name)
    const songs = await fetchSongsByArtist(decodedName)
    const artistInfo = await fetchArtistInfo(decodedName)

    if (!songs.length) {
        notFound()
    }

    // TODO: Explore image_urls. Is [1] the best?
    const imageUrl = songs.find(
        (song) => Array.isArray(song.image_urls) && song.image_urls.length > 0,
    )?.image_urls?.[1]

    return (
        <main className="mx-auto max-w-[2000px] p-6">
            <h1 className="mb-6 text-3xl font-bold">{decodedName}</h1>
            <div className="mb-8 flex flex-col gap-6 md:flex-row">
                {imageUrl && (
                    <div className="aspect-square h-48">
                        <Image
                            src={imageUrl}
                            alt={decodedName}
                            width={300}
                            height={300}
                            className="h-full w-full rounded-lg object-cover shadow-lg"
                        />
                    </div>
                )}
                <div className="flex flex-col gap-4">
                    {artistInfo?.bio && (
                        <p className="text-gray-600">{artistInfo.bio}</p>
                    )}
                    {artistInfo?.tags && artistInfo.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {artistInfo.tags
                                .filter(
                                    (tag) =>
                                        !EXCLUDED_TAGS.includes(
                                            tag.name.toLowerCase(),
                                        ),
                                )
                                .map((tag) => (
                                    <span
                                        key={tag.name}
                                        className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-700"
                                    >
                                        {tag.name}
                                    </span>
                                ))}
                        </div>
                    )}
                </div>
            </div>

            <section>
                <h2 className="mb-4 text-xl font-semibold">
                    {songs.length === 1 ? "1 Nut" : `${songs.length} Nuts`}
                </h2>
                <SongTable songs={songs} />
            </section>
        </main>
    )
}
