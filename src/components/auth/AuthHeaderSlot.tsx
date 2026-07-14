"use client";

import { useSession } from "next-auth/react";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { UserMenu } from "./UserMenu";

export function AuthHeaderSlot() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="size-8 animate-pulse rounded-full bg-muted" />;
  }

  if (session?.user) {
    return <UserMenu />;
  }

  return <GoogleSignInButton variant="ghost" size="sm" />;
}
