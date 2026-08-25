"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import {
  SUPPORTED_OAUTH_PROVIDER,
  SUPPORTED_OAUTH_PROVIDER_DETAILS,
  SupportedOAuthProvider,
} from "@/lib/o-auth-provider";

export default function SocialAuthButtons() {
  const [loadingProvider, setLoadingProvider] =
    useState<SupportedOAuthProvider | null>(null);

  async function handleSocialSignIn(provider: SupportedOAuthProvider) {
    setLoadingProvider(provider);

    await authClient.signIn.social(
      { provider, callbackURL: "/" },
      {
        onError: (error) => {
          toast.add({
            type: "error",
            title: error.error.message || "Failed to sign in",
          });

          setLoadingProvider(null);
        },
      },
    );
  }

  return SUPPORTED_OAUTH_PROVIDER.map((provider) => {
    const Icon = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].Icon;
    const isThisPending = loadingProvider === provider;

    return (
      <Button
        variant="outline"
        key={provider}
        disabled={loadingProvider !== null}
        onClick={() => handleSocialSignIn(provider)}
      >
        {isThisPending ? <Loader2 className="size-4 animate-spin" /> : <Icon />}
        {SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].name}
      </Button>
    );
  });
}
