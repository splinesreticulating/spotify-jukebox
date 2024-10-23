import { fetchFilteredArtists } from '@/app/lib/data'
import ArtistsTable from '@/app/ui/artists/table'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Artists',
}

export default async function Page({ searchParams }: { searchParams?: { query?: string; page?: string } }) {
  const query = searchParams?.query || ''

  const artists = await fetchFilteredArtists(query)

  return (
    <main>
      <ArtistsTable artists={artists} />
    </main>
  )
}
