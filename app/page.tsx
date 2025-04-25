import { ArrowRightIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import Link from "next/link"

export default function Page() {
    const getFrontPageImages = (): string[] => {
        const fs = require("fs")
        const path = require("path")

        const directoryPath = path.join(__dirname, "../../../public")
        const files: string[] = fs.readdirSync(directoryPath)

        const baseFrontPageImages: string[] = files
            .filter(
                (file: string) =>
                    file.startsWith("squirrel") && file.endsWith(".jpg"),
            )
            .map((file: string) =>
                file.replace(/-desktop|-mobile/, "").replace(".jpg", ""),
            )
            .filter(
                (value: string, index: number, self: string[]) =>
                    self.indexOf(value) === index,
            )

        return baseFrontPageImages
    }

    const frontPageImages = getFrontPageImages()
    const randomImage =
        frontPageImages[Math.floor(Math.random() * frontPageImages.length)]

    return (
        <main className="flex min-h-screen flex-col">
            {/* Hero section with gradient overlay */}
            <div className="relative flex min-h-screen flex-col">
                {/* Background image with overlay */}
                <div className="absolute inset-0">
                    <Image
                        src={`/${randomImage}-desktop.jpg`}
                        fill
                        className="hidden object-cover brightness-50 md:block"
                        alt="Background (desktop)"
                        priority
                    />
                    <Image
                        src={`/${randomImage}-mobile.jpg`}
                        fill
                        className="block object-cover brightness-50 md:hidden"
                        alt="Background (mobile)"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-1 flex-col">
                    {/* Main content */}
                    <div className="flex flex-1 items-center justify-center p-6 md:p-8">
                        <div className="mx-auto max-w-md text-center">
                            <h1 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
                                Spotify Jukebox
                            </h1>
                            <p className="mb-8 text-lg text-gray-200 md:text-xl">
                                Complimentary mixed nuts
                            </p>
                            <Link
                                href="/login"
                                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm 
                font-medium text-gray-900 shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl 
                focus:outline-none focus:ring-2 focus:ring-white/20 active:bg-gray-100 md:text-base"
                            >
                                Log In
                                <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
