"use client"

import { useTheme } from "@/app/lib/ThemeContext"
import { getThemeClasses } from "@/app/lib/theme-utils"
import { generatePagination } from "@/app/lib/utils"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import clsx from "clsx"

interface PaginationProps {
    totalPages: number
    currentPage: number
    onPageChange: (page: number) => void
}

export default function Pagination({
    totalPages,
    currentPage,
    onPageChange,
}: PaginationProps) {
    const { theme } = useTheme()
    const allPages = generatePagination(currentPage, totalPages)

    return (
        <div className="inline-flex">
            <PaginationArrow
                direction="left"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
            />

            <div className="flex -space-x-px">
                {allPages.map((page) => {
                    if (page === "...") {
                        return (
                            <span
                                key={`ellipsis-${page}-${Math.random()}`}
                                className="px-4 py-2 text-sm text-gray-700"
                            >
                                {page}
                            </span>
                        )
                    }

                    const isActive = page === currentPage
                    return (
                        <button
                            key={page}
                            type="button"
                            onClick={() => onPageChange(Number(page))}
                            className={clsx(
                                "relative inline-flex items-center px-4 py-2 text-sm font-semibold",
                                getThemeClasses<"pagination">(
                                    theme,
                                    "pagination",
                                    isActive ? "active" : "hover",
                                ),
                            )}
                        >
                            {page}
                        </button>
                    )
                })}
            </div>

            <PaginationArrow
                direction="right"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
            />
        </div>
    )
}

function PaginationArrow({
    direction,
    onClick,
    disabled,
}: {
    direction: "left" | "right"
    onClick: () => void
    disabled: boolean
}) {
    const Icon = direction === "left" ? ChevronLeftIcon : ChevronRightIcon

    return (
        <button
            type="button"
            className={clsx(
                "inline-flex h-10 w-10 items-center justify-center rounded-md",
                disabled
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-gray-100",
            )}
            onClick={onClick}
            disabled={disabled}
        >
            <span className="sr-only">
                {direction === "left" ? "Previous page" : "Next page"}
            </span>
            <Icon className="h-4 w-4" />
        </button>
    )
}
