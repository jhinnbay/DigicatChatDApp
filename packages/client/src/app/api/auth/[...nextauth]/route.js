import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";
import { cookies } from "next/headers";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Ethereum",
            credentials: {
                message: {
                    label: "Message",
                    type: "text",
                    placeholder: "0x0",
                },
                signature: {
                    label: "Signature",
                    type: "text",
                    placeholder: "0x0",
                },
            },
            authorize: async (credentials) => {
                try {
                    const csrf = cookies().get('next-auth.csrf-token')?.value.split('|')[0]
                    const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"));
                    const nextAuthUrl = new URL(process.env.NEXTAUTH_URL);

                    const result = await siwe.verify({
                        signature: credentials?.signature || "",
                        domain: nextAuthUrl.host,
                        nonce: csrf,
                    });

                    if (result.success) {
                        return {
                            id: siwe.address,
                        };
                    }
                    return null;
                } catch (e) {
                    console.error("Error during authorization:", e);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        session: async ({ session, token }) => {
            session.address = token.sub;
            session.user.name = token.sub;
            session.user.image = "https://www.fillmurray.com/128/128";
            return session;
        },
    },
});

export { handler as GET, handler as POST };
