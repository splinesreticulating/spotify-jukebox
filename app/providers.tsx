"use client"

import { FontProvider } from "@/app/lib/FontContext"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000, // 1 minute
        },
    },
})

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <FontProvider>
                {children}
                <Toaster
                    theme="light"
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: "#dcfce7",
                            border: "1px solid #86efac",
                            color: "#166534",
                        },
                        classNames: {
                            success:
                                "bg-green-50 border-green-200 text-green-800",
                            error: "bg-red-50 border-red-200 text-red-800",
                        },
                    }}
                />
            </FontProvider>
        </QueryClientProvider>
    )
}
