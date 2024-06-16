import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import JukeBoxLogo from '@/app/ui/jukeBox-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-4 py-4 sm:px-6 md:px-3">
      <Link
        className="mb-4 flex h-16 items-end justify-start rounded-md bg-teal-600 p-2 sm:h-20 sm:p-3 md:h-40 md:p-4"
        href="/"
      >
        <div className="w-28 text-white sm:w-32 md:w-40">
          <JukeBoxLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <button className="flex h-12 w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-2 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-5 sm:w-6" />
            <div className="block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
