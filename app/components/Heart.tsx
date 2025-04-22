import { HeartIcon as FullHeart } from '@heroicons/react/24/solid'
import { HeartIcon as EmptyHeart } from '@heroicons/react/24/outline'

interface HeartProps {
  onHeartClick: () => void
  isHeartFilled: boolean
}

export const Heart: React.FC<HeartProps> = ({ onHeartClick, isHeartFilled }) => {
  const HeartIcon = isHeartFilled ? FullHeart : EmptyHeart

  return (
    <button onClick={onHeartClick} className="flex items-center justify-center">
      <HeartIcon className="h-6 w-6 text-red-500" />
    </button>
  )
}
