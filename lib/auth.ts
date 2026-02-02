import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db) as any,
    session: { strategy: "jwt" },
    providers: [
        CredentialsProvider({
            name: "Email",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log("AUTH DEBUG: Attempting login for:", credentials?.email);
                if (!credentials?.email || !credentials?.password) {
                    console.log("AUTH DEBUG: Missing credentials");
                    return null;
                }

                const user = await db.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user) {
                    console.log("AUTH DEBUG: User not found");
                    return null;
                }

                if (!user.password) {
                    console.log("AUTH DEBUG: User has no password");
                    return null;
                }

                console.log("AUTH DEBUG: User found, checking password...");
                const isValid = await bcrypt.compare(credentials.password, user.password);
                console.log("AUTH DEBUG: Password valid?", isValid);

                if (!isValid) return null;

                // @ts-ignore
                if (!user.isVerified) {
                    console.log("AUTH DEBUG: User not verified");
                    throw new Error("Email not verified. Please check your console/email.");
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                };
            }
        }),
    ],
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.id;
                // @ts-ignore
                token.role = user.role;
            }
            return token;
        },
        session: async ({ session, token }) => {
            if (session.user) {
                // @ts-ignore
                session.user.id = token.id;
                // @ts-ignore
                session.user.role = token.role;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
    }
};
