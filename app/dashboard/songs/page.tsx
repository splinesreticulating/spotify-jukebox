import Pagination from '@/app/ui/songs/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/songs/table';
import { openSans } from '@/app/ui/fonts';
import { SongsTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchSongsPages } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Songs',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchSongsPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${openSans.className} text-2xl`}>Songs</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search..." />
      </div>
      <Suspense key={query + currentPage} fallback={<SongsTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
