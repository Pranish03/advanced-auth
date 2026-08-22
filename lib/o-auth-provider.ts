import { GitHubIcon, GoogleIcon } from "@/components/auth/o-auth-icon";
import { ComponentProps, ElementType } from "react";

export const SUPPORTED_OAUTH_PROVIDER = ["google", "github"];
export type SupportedOAuthProvider = (typeof SUPPORTED_OAUTH_PROVIDER)[number];

export const SUPPORTED_OAUTH_PROVIDER_DETAILS: Record<
  SupportedOAuthProvider,
  { name: string; Icon: ElementType<ComponentProps<"svg">> }
> = {
  google: { name: "Google", Icon: GoogleIcon },
  github: { name: "GitHub", Icon: GitHubIcon },
};
