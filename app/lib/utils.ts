const pstToUTC = (date: Date): Date => {
  const pstOffset = 8 * 60 // Update one day to account for DST?
  const dateUTC = new Date(date.getTime() + pstOffset * 60 * 1000)

  return dateUTC
}

export const daysAgo = (date: Date) => {
  const datePlayedUTC = pstToUTC(date)
  const currentDateUTC = new Date()
  const differenceInMilliseconds = currentDateUTC.getTime() - datePlayedUTC.getTime()
  const differenceInDays = differenceInMilliseconds / 1000 / 60 / 60 / 24

  return Math.abs(differenceInDays).toFixed(0)
}

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages]
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages]
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
}

export const getLevelColor = (level?: number | null): string => {
  const colorMap: Record<number, string> = {
    1: 'text-indigo-400', // Sleep - soft purple
    2: 'text-green-500', // Morning - fresh green
    3: 'text-orange-400', // Afternoon - bright yellow
    4: 'text-rose-700', // Bar - deep pink
    5: 'text-violet-700', // Club - rich purple
  }

  return level ? (colorMap[level] ?? '') : ''
}

export const isPlayable = (song: { spotify_id?: string | null; sam_id?: number | null }) => {
  return process.env.NEXT_PUBLIC_PLATFORM === 'spotify' ? !!song.spotify_id : !!song.sam_id
}

export function cleanLastFMText(text: string): string {
  return (
    text
      ?.replace(/<a\b[^>]*>.*?<\/a>/g, '')
      .replace(/\s*\[.*?\]\s*/g, '')
      .replace(/\n/g, ' ')
      .replace(
        /\. User-contributed text is available under the Creative Commons By-SA License; additional terms may apply\./,
        '',
      ) || ''
  )
}

const camelotKeyCompatibilityMap: { [key: string]: string[] } = {
  '1A': ['1A', '1B', '12A', '2A', '3A', '12B', '8A', '4B'],
  '1B': ['1B', '1A', '12B', '2B', '3B', '12A', '8B', '4A'],
  '2A': ['2A', '2B', '1A', '3A', '4A', '1B', '9A', '5B'],
  '2B': ['2B', '2A', '1B', '3B', '4B', '1A', '9B', '5A'],
  '3A': ['3A', '3B', '2A', '4A', '5A', '2B', '10A', '6B'],
  '3B': ['3B', '3A', '2B', '4B', '5B', '2A', '10B', '6A'],
  '4A': ['4A', '4B', '3A', '5A', '6A', '3B', '11A', '7B'],
  '4B': ['4B', '4A', '3B', '5B', '6B', '3A', '11B', '7A'],
  '5A': ['5A', '5B', '4A', '6A', '7A', '4B', '12A', '8B'],
  '5B': ['5B', '5A', '4B', '6B', '7B', '4A', '12B', '8A'],
  '6A': ['6A', '6B', '5A', '7A', '8A', '5B', '1A', '9B'],
  '6B': ['6B', '6A', '5B', '7B', '8B', '5A', '1B', '9A'],
  '7A': ['7A', '7B', '6A', '8A', '9A', '6B', '2A', '10B'],
  '7B': ['7B', '7A', '6B', '8B', '9B', '6A', '2B', '10A'],
  '8A': ['8A', '8B', '7A', '9A', '10A', '7B', '3A', '11B'],
  '8B': ['8B', '8A', '7B', '9B', '10B', '7A', '3B', '11A'],
  '9A': ['9A', '9B', '8A', '10A', '11A', '8B', '4A', '12B'],
  '9B': ['9B', '9A', '8B', '10B', '11B', '8A', '4B', '12A'],
  '10A': ['10A', '10B', '9A', '11A', '12A', '9B', '5A', '1B'],
  '10B': ['10B', '10A', '9B', '11B', '12B', '9A', '5B', '1A'],
  '11A': ['11A', '11B', '10A', '12A', '1A', '10B', '6A', '2B'],
  '11B': ['11B', '11A', '10B', '12B', '1B', '10A', '6B', '2A'],
  '12A': ['12A', '12B', '11A', '1A', '2A', '11B', '7A', '3B'],
  '12B': ['12B', '12A', '11B', '1B', '2B', '11A', '7B', '3A'],
}

export const getCompatibleKeys = (key: string): string[] => {
  return camelotKeyCompatibilityMap[key] || []
}
