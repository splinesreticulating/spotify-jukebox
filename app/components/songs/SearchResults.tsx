"use client"

import Pagination from "@/app/components/songs/Pagination"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import Table from "./Table"

interface SearchResultsProps {
    query: string
    currentPage: number
    levels: string
    instrumental: string
    keyMatch: string
    keyCompatible: string
    bpmRef: string
    eighties: boolean | ""
    nineties: boolean | ""
    lastYear: boolean | ""
    thisYear: boolean | ""
    playable: boolean | ""
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
            params.set("page", newPage.toString())
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
                instrumental={props.instrumental === "1" ? 1 : 0}
                keyMatch={props.keyMatch}
                keyCompatible={props.keyCompatible}
                bpmRef={props.bpmRef}
                eighties={props.eighties || undefined}
                nineties={props.nineties || undefined}
                lastYear={props.lastYear || undefined}
                thisYear={props.thisYear || undefined}
                playable={props.playable || undefined}
            />

            {props.totalPages > 1 && (
                <div className="mt-5 flex w-full justify-center">
                    <Pagination
                        totalPages={props.totalPages}
                        currentPage={props.currentPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    )
}
