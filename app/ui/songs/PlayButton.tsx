'use client'

import { PlayIcon } from '@heroicons/react/16/solid'
import { addToQueue } from '@/app/lib/actions'
import { useToast } from '@/app/ui/toast/toast'

export default function PlayButton({ songId }: { songId: number }) {
  const { toast } = useToast()

  const handleClick = async () => {
    try {
      const result = await addToQueue(songId)
      if (result.success) {
        toast('Added to queue', 'success')
      } else {
        toast('Failed to add to queue', 'error')
      }
    } catch (error) {
      toast('Failed to add to queue', 'error')
    }
  }

  return (
    <button onClick={handleClick}>
      <PlayIcon className="mr-1 inline h-3 w-3 text-gray-500 hover:text-red-800" aria-hidden="true" />
    </button>
  )
}
