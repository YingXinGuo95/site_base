"use client";

import { GoogleSignInButton } from "./GoogleSignInButton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { LogIn } from "lucide-react";

export function LoginForm() {
  return (
    <Card className="w-full max-w-md border-0 bg-card/80 p-4 shadow-lg shadow-black/[0.04] backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-500">
      <CardHeader className="pb-4 text-center">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary shadow-sm">
          <LogIn className="size-5 text-primary-foreground" />
        </div>
        <CardTitle className="text-xl font-semibold">Welcome to ToolShelf</CardTitle>
        <CardDescription className="text-sm">
          Sign in to access your account
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pb-6">
        <GoogleSignInButton size="lg" className="w-full" />
        <p className="text-center text-xs text-muted-foreground">
          Only Google sign-in is supported.
        </p>
      </CardContent>
    </Card>
  );
}
