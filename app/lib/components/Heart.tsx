import { NowPlayingData } from "../definitions"
import { HeartIcon as FullHeart } from '@heroicons/react/24/solid'
import { HeartIcon as EmptyHeart } from '@heroicons/react/24/outline'

export const Heart: React.FC<{ onHeartClick: () => void, isHeartFilled: boolean }> = ({ onHeartClick, isHeartFilled }) => {
    return (
      <div className="flex items-center justify-center h-10 w-10 sm:h-16 sm:w-16 mx-auto p-2 sm:p-4 cursor-pointer" onClick={onHeartClick}>
        {isHeartFilled ? (
          <FullHeart className="h-5 w-5 sm:h-8 sm:w-8 text-red-500" />
        ) : (
          <EmptyHeart className="h-5 w-5 sm:h-8 sm:w-8 text-red-500" />
        )}
      </div>
    )
  }
