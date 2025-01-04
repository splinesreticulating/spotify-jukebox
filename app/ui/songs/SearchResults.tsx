'use client'

import { useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import Pagination from '@/app/ui/songs/pagination'
import Table from './table'

interface SearchResultsProps {
  query: string
  currentPage: number
  levels: string
  instrumental: string
  keyRef: string
  bpmRef: string
  eighties: boolean | ''
  nineties: boolean | ''
  thisYear: boolean | ''
  totalPages: number
}

export default function SearchResults(props: SearchResultsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const currentSearchParams = useSearchParams()

  // Handle pagination changes
  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(currentSearchParams.toString())
      params.set('page', newPage.toString())
      router.replace(`${pathname}?${params.toString()}`)
    },
    [currentSearchParams, pathname, router],
  )

  return (
    <div className="mt-6 space-y-4">
      <Table
        query={props.query}
        currentPage={props.currentPage}
        levels={props.levels}
        instrumental={props.instrumental === 'true' ? 1 : 0}
        keyRef={props.keyRef}
        bpmRef={props.bpmRef}
        eighties={props.eighties || undefined}
        nineties={props.nineties || undefined}
        thisYear={props.thisYear || undefined}
      />

      {props.totalPages > 1 && (
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={props.totalPages} currentPage={props.currentPage} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  )
}
