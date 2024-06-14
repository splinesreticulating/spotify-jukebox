import Form from '@/app/ui/songs/edit-form'
import Breadcrumbs from '@/app/ui/songs/breadcrumbs'
import { fetchSongById } from '@/app/lib/data'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit Song',
}

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id
  const song = await fetchSongById(Number(id))

  if (!song) {
    notFound()
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Songs', href: '/dashboard/songs' },
          {
            label: 'Edit Song',
            href: `/dashboard/songs/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form song={song} />
    </main>
  )
}
