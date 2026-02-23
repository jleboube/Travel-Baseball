import { auth } from '@/auth'

export interface AuthUser {
  id: string
  email: string | null
  name: string | null
  role: string
}

/**
 * Get authenticated user from NextAuth session
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  const session = await auth()
  if (session?.user) {
    return {
      id: session.user.id!,
      email: session.user.email!,
      name: session.user.name!,
      role: (session.user as any).role || 'PARENT',
    }
  }

  return null
}
