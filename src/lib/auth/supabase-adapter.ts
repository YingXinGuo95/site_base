import type { Adapter, AdapterUser, AdapterAccount, AdapterSession, VerificationToken } from "next-auth/adapters";
import { createClient } from "@supabase/supabase-js";

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// ── Best-effort expired-session cleanup ──────────────────────────────
// Runs inline on sign-in / sign-out.  Limit 10 per call — replace with a
// proper cron job later.

function cleanupExpiredSessions() {
  supabaseAdmin()
    .from("session")
    .delete()
    .lt("expires", new Date().toISOString())
    .limit(10)
    .then(
      () => {},
      () => {},
    );
}

/** Supabase returns timestamps as ISO strings; Auth.js needs Date objects. */
function normalizeDates<T>(record: T): T {
  if (record && typeof record === "object" && "expires" in record) {
    const val = (record as Record<string, unknown>).expires;
    if (typeof val === "string") {
      (record as Record<string, unknown>).expires = new Date(val);
    }
  }
  return record;
}

export function SupabaseAdapter(): Adapter {
  const sb = supabaseAdmin;
  const tenantId = process.env.TENANT_ID || "default";

  return {
    async createUser(user) {
      const { data, error } = await sb()
        .from("user")
        .insert({ ...user, tenant_id: tenantId })
        .select()
        .single();
      if (error) throw error;
      return data as AdapterUser;
    },

    async getUser(id) {
      const { data } = await sb()
        .from("user")
        .select()
        .eq("id", id)
        .eq("tenant_id", tenantId)
        .single();
      return (data as AdapterUser) ?? null;
    },

    async getUserByEmail(email) {
      const { data } = await sb()
        .from("user")
        .select()
        .eq("email", email)
        .eq("tenant_id", tenantId)
        .single();
      return (data as AdapterUser) ?? null;
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const { data: account } = await sb()
        .from("account")
        .select("userId")
        .eq("provider", provider)
        .eq("providerAccountId", providerAccountId)
        .eq("tenant_id", tenantId)
        .single();

      if (!account) return null;

      const { data: user } = await sb()
        .from("user")
        .select()
        .eq("id", account.userId)
        .eq("tenant_id", tenantId)
        .single();

      return (user as AdapterUser) ?? null;
    },

    async updateUser(user) {
      const { data, error } = await sb()
        .from("user")
        .update(user)
        .eq("id", user.id)
        .eq("tenant_id", tenantId)
        .select()
        .single();
      if (error) throw error;
      return data as AdapterUser;
    },

    async deleteUser(userId) {
      await sb()
        .from("user")
        .delete()
        .eq("id", userId)
        .eq("tenant_id", tenantId);
    },

    async linkAccount(account) {
      const { error } = await sb()
        .from("account")
        .insert({ ...account, tenant_id: tenantId });
      if (error) throw error;
    },

    async unlinkAccount({ provider, providerAccountId }) {
      await sb()
        .from("account")
        .delete()
        .eq("provider", provider)
        .eq("providerAccountId", providerAccountId)
        .eq("tenant_id", tenantId);
    },

    async createSession(session) {
      const { data, error } = await sb()
        .from("session")
        .insert({ ...session, tenant_id: tenantId })
        .select()
        .single();
      if (error) throw error;
      cleanupExpiredSessions(); // fire-and-forget expired cleanup
      return normalizeDates(data) as AdapterSession;
    },

    async getSessionAndUser(sessionToken) {
      const { data: session } = await sb()
        .from("session")
        .select()
        .eq("sessionToken", sessionToken)
        .eq("tenant_id", tenantId)
        .single();

      if (!session) return null;

      const { data: user } = await sb()
        .from("user")
        .select()
        .eq("id", session.userId)
        .eq("tenant_id", tenantId)
        .single();

      if (!user) return null;

      return {
        session: normalizeDates(session) as AdapterSession,
        user: user as AdapterUser,
      };
    },

    async updateSession(session) {
      const { data, error } = await sb()
        .from("session")
        .update(session)
        .eq("sessionToken", session.sessionToken)
        .eq("tenant_id", tenantId)
        .select()
        .single();
      if (error) throw error;
      return normalizeDates(data) as AdapterSession;
    },

    async deleteSession(sessionToken) {
      await sb()
        .from("session")
        .delete()
        .eq("sessionToken", sessionToken)
        .eq("tenant_id", tenantId);
      cleanupExpiredSessions(); // fire-and-forget expired cleanup
    },

    async createVerificationToken(token) {
      const { data, error } = await sb()
        .from("verificationToken")
        .insert({ ...token, tenant_id: tenantId })
        .select()
        .single();
      if (error) throw error;
      return normalizeDates(data) as VerificationToken;
    },

    async useVerificationToken({ identifier, token }) {
      const { data } = await sb()
        .from("verificationToken")
        .select()
        .eq("identifier", identifier)
        .eq("token", token)
        .eq("tenant_id", tenantId)
        .single();

      if (!data) return null;

      await sb()
        .from("verificationToken")
        .delete()
        .eq("identifier", identifier)
        .eq("token", token)
        .eq("tenant_id", tenantId);

      return normalizeDates(data) as VerificationToken;
    },
  };
}
