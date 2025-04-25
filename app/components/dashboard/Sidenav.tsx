"use client"

import { Logo } from "@/app/components"
import NavLinks from "@/app/components/dashboard/NavLinks"
import { useTheme } from "@/app/lib/ThemeContext"
import { handleSignOut } from "@/app/lib/actions/auth"
import { getThemeClasses } from "@/app/lib/theme-utils"
import { PowerIcon } from "@heroicons/react/24/outline"
import clsx from "clsx"
import Link from "next/link"
import { useTransition } from "react"

export default function SideNav() {
    const [_isPending, startTransition] = useTransition()
    const { theme } = useTheme()

    const handleSubmit = () => {
        startTransition(() => {
            handleSignOut()
        })
    }

    return (
        <div className="flex h-full flex-col px-4 py-4 sm:px-6 md:px-3">
            <Link
                className={clsx(
                    "mb-4 flex h-24 items-center justify-center rounded-md py-4 sm:h-24 sm:py-5 md:h-44 md:py-6",
                    getThemeClasses<"logo">(theme, "logo"),
                )}
                href="/"
            >
                <div className="flex w-full justify-center text-white">
                    <Logo />
                </div>
            </Link>
            <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
                <NavLinks />
                <div
                    className={clsx(
                        "hidden h-auto w-full grow rounded-md md:block",
                        getThemeClasses<"background">(theme, "background"),
                    )}
                ></div>
                <button
                    onClick={handleSubmit}
                    className={clsx(
                        "flex h-12 w-full grow items-center justify-center gap-2 rounded-md p-2 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3",
                        getThemeClasses<"button">(theme, "button"),
                    )}
                >
                    <PowerIcon className="w-5 sm:w-6" />
                    <div className="hidden md:block">Sign Out</div>
                </button>
            </div>
        </div>
    )
}
