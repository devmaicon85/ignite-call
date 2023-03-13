import { PrismaAdapter } from "@/src/lib/auth/prisma-adapter"
import { NextApiRequest, NextApiResponse, NextPageContext } from "next"
import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google"


export function buildNextAuthOptions(req: NextApiRequest | NextPageContext['req'], res: NextApiResponse | NextPageContext['res']): NextAuthOptions {

    return {
        adapter: PrismaAdapter(req, res),
        providers: [
            GoogleProvider({
                clientId: process.env.GOOGLE_CLIENT_ID ?? "",
                clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
                authorization: {
                    params: {
                        prompt: "consent",
                        access_type: "offline",
                        response_type: "code",
                        scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar'
                    }
                },
                profile: (profile: GoogleProfile) => {
                    return {
                        id: profile.sub,
                        name: profile.name,
                        username: '',
                        email: profile.email,
                        avatar_url: profile.picture
                    }
                }
            }),
        ],
        callbacks: {
            async session({ session, token, user }) {


                return {
                    ...session,
                    user
                };
            },
            signIn({ account, email, profile, user, credentials }) {

                console.log("🚀 ~ file: [...nextauth].ts:17 ~ signIn ~ account:", account)

                if (!account?.scope?.includes('https://www.googleapis.com/auth/calendar')) {
                    return '/register/conect-calendar/?error=permissions'
                }

                return Promise.resolve(true);
            },
        }
    }
}
// export default NextAuth(authOptions)

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    return await NextAuth(req, res, buildNextAuthOptions(req, res))
}