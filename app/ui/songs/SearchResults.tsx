import Pagination from '@/app/ui/songs/pagination'
import Table from './table'
import type { SearchResultsProps } from '@/app/lib/types'

export default function SearchResults({ searchParams }: SearchResultsProps) {
  const { query = '', page, levels = '', instrumental, keyRef, bpmRef, eighties, nineties, totalPages } = searchParams

  const currentPage = Number(page) || 1

  return (
    <>
      <Table
        query={query}
        currentPage={currentPage}
        levels={levels}
        instrumental={Number(instrumental) || 0}
        keyRef={keyRef}
        bpmRef={bpmRef}
        eighties={eighties === 'true'}
        nineties={nineties === 'true'}
      />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </>
  )
}
