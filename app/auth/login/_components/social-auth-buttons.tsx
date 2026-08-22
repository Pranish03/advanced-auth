"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import {
  SUPPORTED_OAUTH_PROVIDER,
  SUPPORTED_OAUTH_PROVIDER_DETAILS,
} from "@/lib/o-auth-provider";

export default function SocialAuthButtons() {
  return SUPPORTED_OAUTH_PROVIDER.map((provider) => {
    const Icon = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].Icon;

    return (
      <Button
        variant="outline"
        key={provider}
        onClick={() => authClient.signIn.social({ provider, callbackURL: "/" })}
      >
        <Icon /> {SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].name}
      </Button>
    );
  });
}
