import NextAuth, { AuthError, CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { signInSchema } from "./app/lib/zod"
import { ZodError } from "zod"
import { getUserFromDb } from "./actions/users"
import React from "react"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
        credentials: {
          email: { label: "Email", type: "email" },
          password: {  label: "Password", type: "password" }
        },

        authorize: async (credentials) => {
            let user = null

            const { email, password } = await signInSchema.parseAsync(credentials).catch((error: ZodError) => {
                throw new CredentialsSignin()
            })
  
            // logic to verify if the user exists
            user = await getUserFromDb(email, password);
  
            if (!user) {
              //throw new CredentialsSignin({ message: "Tests" })
              throw new CredentialsSignin()
            }
  
            // return user object with their profile data
            return {
              id: user.id,
              name: user.name,
              email: user.email
            };
          
        }
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/logout'

  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
    async jwt({ token, user, account, trigger, session }) {
      if (account && user) {
          token.id = user.id
          token.name = user.name
          token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
        return {
            ...session,
            user: {
                ...session.user,
                id: token.id as string,
                name: token.name as string,
                email: token.email as string,
            }
        }
    }
  }

})