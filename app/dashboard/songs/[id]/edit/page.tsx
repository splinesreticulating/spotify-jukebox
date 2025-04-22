import Form from '@/app/components/songs/EditForm'
import { fetchSongById } from '@/app/lib/data'
import { notFound } from 'next/navigation'

export default async function EditSongPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const song = await fetchSongById(Number(id))

  if (!song) {
    notFound()
  }

  return (
    <main>
      <Form song={song} />
    </main>
  )
}
