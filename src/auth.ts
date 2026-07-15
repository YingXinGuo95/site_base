import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { SupabaseAdapter } from "@/lib/auth/supabase-adapter";

// ── Diagnostic: log env var presence (never log values) ──────────────
console.log("[auth] AUTH_GOOGLE_ID present:", !!process.env.AUTH_GOOGLE_ID);
console.log("[auth] AUTH_GOOGLE_SECRET present:", !!process.env.AUTH_GOOGLE_SECRET);
console.log("[auth] AUTH_SECRET present:", !!process.env.AUTH_SECRET);
console.log("[auth] AUTH_URL:", process.env.AUTH_URL);
console.log("[auth] NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("[auth] SUPABASE_SERVICE_ROLE_KEY present:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);

export const { auth, signIn, signOut, handlers } = NextAuth({
  adapter: SupabaseAdapter(),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "database",
  },
  // Enable verbose debug logging for the OAuth flow
  debug: true,
  logger: {
    error(code, ...message) {
      console.error("[auth][error]", code, ...message);
    },
    warn(code, ...message) {
      console.warn("[auth][warn]", code, ...message);
    },
    debug(code, ...message) {
      console.log("[auth][debug]", code, ...message);
    },
  },
  callbacks: {
    signIn({ user, account, profile: _profile }) {
      console.log("[auth] signIn callback — user:", user?.email, "provider:", account?.provider);
      return true;
    },
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});
