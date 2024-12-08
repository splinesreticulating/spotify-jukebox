import Form from '@/app/ui/songs/edit-form'
import { fetchSongById } from '@/app/lib/data'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit Song',
}

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
