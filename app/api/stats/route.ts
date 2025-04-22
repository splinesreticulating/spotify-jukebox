import { NextResponse } from 'next/server'
import { fetchWeeklyAverageYear, fetchAvailableSongsByLevel } from '@/app/lib/data'

export async function GET() {
  try {
    const [averageYear, availableSongs] = await Promise.all([fetchWeeklyAverageYear(), fetchAvailableSongsByLevel()])

    return NextResponse.json({
      averageYear,
      availableSongs,
    })
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
