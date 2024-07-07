import Pagination from '@/app/ui/songs/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/songs/table';
import { openSans } from '@/app/ui/fonts';
import { SongsTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchSongsPages } from '@/app/lib/data';
import { Metadata } from 'next';
import { LevelFilters } from '@/app/lib/components/LevelFilters';

export const metadata: Metadata = {
  title: 'Songs',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    levels?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const levels = searchParams?.levels || '';

  const totalPages = await fetchSongsPages(query, levels);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${openSans.className} text-2xl`}>Songs</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search..." defaultValue={query} />
      </div>
      <LevelFilters levels={levels} />
      <Suspense key={query + currentPage + levels} fallback={<SongsTableSkeleton />}>
        <Table query={query} currentPage={currentPage} levels={levels} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
