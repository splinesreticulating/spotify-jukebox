import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: "/login",
    },
    providers: [],
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
            if (isOnDashboard) {
                if (isLoggedIn) return true
                return false
            }
            if (isLoggedIn) {
                return Response.redirect(new URL("/dashboard", nextUrl))
            }
            return true
        },
    },
    trustHost: true,
} satisfies NextAuthConfig
