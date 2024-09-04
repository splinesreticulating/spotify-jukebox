import AcmeLogo from '@/app/ui/jukeBox-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { openSans } from '@/app/ui/fonts';
import Image from 'next/image';

export default function Page() {
  const getFrontPageImages = (): string[] => {
    const fs = require('fs');
    const path = require('path');

    const directoryPath = path.join(__dirname, '../../../public');
    const files: string[] = fs.readdirSync(directoryPath);

    // Filter filenames matching squirrel*(-desktop|-mobile).jpg
    const baseFrontPageImages: string[] = files
      .filter(
        (file: string) => file.startsWith('squirrel') && file.endsWith('.jpg'),
      )
      .map((file: string) =>
        file.replace(/-desktop|-mobile/, '').replace('.jpg', ''),
      )
      .filter(
        (value: string, index: number, self: string[]) =>
          self.indexOf(value) === index,
      );

    return baseFrontPageImages;
  };

  const frontPageImages = getFrontPageImages();
  const randomImage =
    frontPageImages[Math.floor(Math.random() * frontPageImages.length)];

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-teal-800 p-4 md:h-52">
        <AcmeLogo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p
            className={`${openSans.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}
          >
            A work in progress...
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-teal-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          <Image
            src={`/${randomImage}-desktop.jpg`}
            width={1000}
            height={760}
            className="hidden md:block"
            alt="Logo (desktop version)"
          />
          <Image
            src={`/${randomImage}-mobile.jpg`}
            width={560}
            height={620}
            className="block md:hidden"
            alt="Logo (mobile version)"
          />
        </div>
      </div>
    </main>
  );
}
