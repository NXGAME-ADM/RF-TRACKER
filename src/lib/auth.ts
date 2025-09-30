import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import DiscordProvider from "next-auth/providers/discord";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: { params: { scope: "identify" } },
      profile(profile) {
        return {
          id: profile.id,
          name: (profile as any).global_name ?? profile.username,
          image: profile.avatar
            ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
            : null
        } as any;
      }
    })
  ],
  session: { strategy: "database" },
  callbacks: {
    async session({ session, user }) {
      (session as any).discordId = user.id;
      const admins = (process.env.ADMIN_DISCORD_IDS || "")
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);
      (session as any).isAdmin = admins.includes(user.id);
      return session;
    }
  },
  pages: { signIn: "/signin" },
  secret: process.env.NEXTAUTH_SECRET
};
