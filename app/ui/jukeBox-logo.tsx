import { RadioIcon } from '@heroicons/react/24/outline'; // Assuming there is a radio icon
import { openSans } from '@/app/ui/fonts';

export default function JukeBoxLogo() {
  return (
    <div
      className={`${openSans.className} flex flex-row flex-nowrap items-center space-x-2 leading-none text-white`}
    >
      <RadioIcon className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20" />
      <p className="text-[20px] sm:text-[28px] md:text-[33px]">
        Squirrel Radio
      </p>
    </div>
  );
}
