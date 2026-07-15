import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { SupabaseAdapter } from "@/lib/auth/supabase-adapter";

// ── Diagnostic: one-line env-var presence summary (never log values) ──
if (process.env.NODE_ENV === "development") {
  console.log(
    "[auth] env:",
    {
      AUTH_GOOGLE_ID: !!process.env.AUTH_GOOGLE_ID,
      AUTH_GOOGLE_SECRET: !!process.env.AUTH_GOOGLE_SECRET,
      AUTH_SECRET: !!process.env.AUTH_SECRET,
      AUTH_URL: process.env.AUTH_URL,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
  );
}

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
  debug: process.env.NODE_ENV === "development",
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
      if (process.env.NODE_ENV === "development") {
        console.log("[auth] signIn —", user?.email, "|", account?.provider);
      }
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
