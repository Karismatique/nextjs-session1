// auth.ts
import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async signIn({ user, profile }) {
      if (user.id && !user.handle && profile?.login) {
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: { handle: '@' + (profile.login as string) },
          });
        } catch {
          // Handle déjà pris, on laisse null
        }
      }
      return true;
    }
  }
})