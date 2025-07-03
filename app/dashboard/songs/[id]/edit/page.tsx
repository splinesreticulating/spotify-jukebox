import { Metadata } from "next"
import Form from "@/app/components/songs/EditForm"
import { fetchSongById } from "@/app/lib/data"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
    title: "Edit Song | Spotify Jukebox",
}

export default async function EditSongPage({
    params,
}: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const song = await fetchSongById(Number(id))

    if (!song) {
        notFound()
    }

    metadata.title = `${song.title} by ${song.artists?.[0]}`

    return (
        <main>
            <Form song={song} />
        </main>
    )
}
