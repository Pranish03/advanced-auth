"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";

export default function Home() {
  const [isPending, startTransition] = useTransition();
  const { data: session, isPending: loading } = authClient.useSession();

  function handleSignOut() {
    startTransition(async () => {
      await authClient.signOut();
    });
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-6 px-4 max-w-md mx-auto">
      <div className="text-center space-y-6">
        {session == null ? (
          <>
            <h1 className="text-3xl font-bold">Welcome to Our App</h1>
            <Link className={buttonVariants()} href="/auth/login">
              Sign In / Sign Up
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold">
              Welcome, {session.user.name}!
            </h1>
            <Button
              disabled={isPending}
              variant="destructive"
              onClick={() => handleSignOut()}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />{" "}
                  <span>Loading...</span>
                </>
              ) : (
                "Sign out"
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
