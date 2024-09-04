import { HeartIcon as FullHeart } from "@heroicons/react/24/solid";
import { HeartIcon as EmptyHeart } from "@heroicons/react/24/outline";

export const Heart: React.FC<{
  onHeartClick: () => void;
  isHeartFilled: boolean;
}> = ({ onHeartClick, isHeartFilled }) => {
  return (
    <div
      className="mx-auto flex h-10 w-10 cursor-pointer items-center justify-center p-2 sm:h-16 sm:w-16 sm:p-4"
      onClick={onHeartClick}
    >
      {isHeartFilled ? (
        <FullHeart className="h-5 w-5 text-red-500 sm:h-8 sm:w-8" />
      ) : (
        <EmptyHeart className="h-5 w-5 text-red-500 sm:h-8 sm:w-8" />
      )}
    </div>
  );
};
