import { NextResponse } from 'next/server'
import { fetchFilteredSongs } from '@/app/lib/data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  try {
    const query = searchParams.get('query') || ''
    const currentPage = Number(searchParams.get('page')) || 1
    const levels = searchParams.get('levels') || ''
    const instrumental = searchParams.get('instrumental') || ''
    const keyRef = searchParams.get('keyRef') || ''
    const bpmRef = searchParams.get('bpmRef') || ''
    const eighties = searchParams.get('eighties') === 'true'
    const nineties = searchParams.get('nineties') === 'true'
    const thisYear = searchParams.get('thisYear') === 'true'
    const lastYear = searchParams.get('lastYear') === 'true'

    const songs = await fetchFilteredSongs(
      query,
      currentPage,
      levels,
      instrumental,
      keyRef,
      bpmRef,
      eighties,
      nineties,
      lastYear,
      thisYear,
    )

    return NextResponse.json(songs)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 })
  }
}
