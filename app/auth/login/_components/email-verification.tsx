"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";

export default function EmailVerification({ email }: { email: string }) {
  const [timeToNextResend, setTimeToNextResend] = useState(30);
  const interval = useRef<NodeJS.Timeout>(undefined);
  const [isPending, startTransition] = useTransition();

  const runCountdown = useCallback(() => {
    if (interval.current) clearInterval(interval.current);

    interval.current = setInterval(() => {
      setTimeToNextResend((t) => {
        const newT = t - 1;

        if (newT <= 0) {
          if (interval.current) clearInterval(interval.current);
          return 0;
        }

        return newT;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    runCountdown();

    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, [runCountdown]);

  function resendHandler() {
    startTransition(async () => {
      const { error } = await authClient.sendVerificationEmail({
        email,
        callbackURL: "/",
      });

      if (error) {
        toast.add({
          type: "error",
          title: error.message || "Failed to resend email",
        });
      } else {
        toast.add({
          type: "success",
          title: "Verification email sent!",
        });
        setTimeToNextResend(30);
        runCountdown();
      }
    });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mt-2">
        We sent you a verification link. Please check your email and click the
        link to verify your account.
      </p>

      <Button
        disabled={isPending || timeToNextResend > 0}
        variant="outline"
        onClick={() => resendHandler()}
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" /> <span>Loading...</span>
          </>
        ) : timeToNextResend > 0 ? (
          `Resend email (${timeToNextResend})`
        ) : (
          "Resend email"
        )}
      </Button>
    </div>
  );
}
