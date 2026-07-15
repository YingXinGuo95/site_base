"use client";

import { createContext, useContext } from "react";
import { SessionProvider, useSession as useNextAuthSession } from "next-auth/react";
import type { Session } from "next-auth";
import type { ReactNode } from "react";

// ── App-level session context ──────────────────────────────────────────
// We wrap both the real SessionProvider (when authenticated) and a
// lightweight noop-provider (when unauthenticated) behind a single
// context.  This way child components always use useAppSession() and
// never trigger a wasted GET /api/auth/session when there's no session.

type SessionCtxValue = {
  data: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
  update: () => Promise<Session | null>;
};

const AppSessionCtx = createContext<SessionCtxValue>({
  data: null,
  status: "loading",
  update: async () => null,
});

// ── Public hook — use this instead of next-auth's useSession ───────────
export function useAppSession(): SessionCtxValue {
  return useContext(AppSessionCtx);
}

// ── Bridge: reads next-auth's real useSession, writes to our context ───
function AppSessionBridge({ children }: { children: ReactNode }) {
  const session = useNextAuthSession();
  return (
    <AppSessionCtx.Provider
      value={{
        data: session.data,
        status: session.status,
        update: session.update,
      }}
    >
      {children}
    </AppSessionCtx.Provider>
  );
}

// ── Wrapper: skips real SessionProvider when there's no session ────────
const noSessionValue: SessionCtxValue = {
  data: null,
  status: "unauthenticated",
  update: async () => null,
};

export function SessionProviderWrapper({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  if (!session) {
    // No session → skip SessionProvider entirely.
    // No GET /api/auth/session, no adapter_getSessionAndUser.
    return (
      <AppSessionCtx.Provider value={noSessionValue}>
        {children}
      </AppSessionCtx.Provider>
    );
  }

  return (
    <SessionProvider
      session={session}
      refetchOnWindowFocus={false}
      refetchInterval={10 * 60}
    >
      <AppSessionBridge>{children}</AppSessionBridge>
    </SessionProvider>
  );
}
