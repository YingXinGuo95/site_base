"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { ReactNode } from "react";

export function SessionProviderWrapper({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider
      session={session}
      refetchOnWindowFocus={false}
      refetchInterval={10 * 60} // 每 10 分钟轮询一次，避免频繁请求
    >
      {children}
    </SessionProvider>
  );
}
