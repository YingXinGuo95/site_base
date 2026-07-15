"use client";

import { useAppSession } from "./SessionProviderWrapper";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { UserMenu } from "./UserMenu";

export function AuthHeaderSlot() {
  const { data: session, status } = useAppSession();

  if (status === "loading") {
    return <div className="size-8 animate-pulse rounded-full bg-muted" />;
  }

  if (session?.user) {
    return <UserMenu />;
  }

  return <GoogleSignInButton variant="ghost" size="sm" />;
}
