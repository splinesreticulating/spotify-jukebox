import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import type { User } from '@/app/lib/definitions'
import { authConfig } from './auth.config'
import { db } from '@/app/lib/db'

async function getUser(email: string): Promise<User | null> {
  try {
    const response = await db.users.findFirst({ where: { email } })

    if (!response) {
      return null
    }
    
    return {
      id: `${response.id}`,
      name: response.name || 'Anonymous',
      password: response.password,
      email: response.email,
    }
  } catch (error) {
    console.error('Failed to fetch user:', error)
    throw new Error('Failed to fetch user.')
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(5) })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          const user = await getUser(email)
          if (!user) return null

          const passwordsMatch = await bcrypt.compare(password, user.password)
          
          if (passwordsMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
            }
          }
        }

        console.log('Invalid credentials')
        return null
      },
    }),
  ],
})
