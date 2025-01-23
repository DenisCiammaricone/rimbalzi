import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { signInSchema } from "./app/lib/zod"
import bcrypt from "bcryptjs"
import { getUserFromDb } from "./actions/user"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
        name: 'Credentials',

        credentials: {
          email: { label: "Email", type: "email" },
          password: {  label: "Password", type: "password" }
        },

        authorize: async (credentials) => {
            let user = null

            const { email, password } = await signInSchema.parseAsync(credentials)
     
            // logic to salt and hash password
            const pwHash = bcrypt.hashSync(password)
     
            // logic to verify if the user exists
            user = await getUserFromDb(email, password) // TODO: Remove password and use pwHash
     
            if (!user) {
              // No user found, so this is their first attempt to login
              // Optionally, this is also the place you could do a user registration
              throw new Error("Invalid credentials.")
            }
     
            // return user object with their profile data
            return {
                id: user.id.toString(),
                name: user.name,
                email: user.email,
            }
          },
    }),
  ],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl
    }
  }

})