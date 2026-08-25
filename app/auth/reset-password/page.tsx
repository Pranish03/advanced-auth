"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Button, buttonVariants } from "@/components/ui/button";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be of atleast 8 characters"),
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const error = searchParams.get("error");

  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  function handleResetPassword(data: ResetPasswordForm) {
    startTransition(async () => {
      if (token == null) return;

      await authClient.resetPassword(
        {
          newPassword: data.password,
          token: token,
        },
        {
          onError: (error) => {
            toast.add({
              type: "error",
              description: error.error.message || "Failed to reset password",
            });
          },
          onSuccess: () => {
            toast.add({
              type: "success",
              title: "Password reset successful",
              description: "Redirecting to login...",
            });

            setTimeout(() => {
              router.push("/auth/login");
            }, 1000);
          },
        },
      );
    });
  }

  if (token == null || error != null) {
    return (
      <div className="mx-auto w-full max-w-md my-10 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Invalid reset link</CardTitle>
            <CardDescription>
              The password reset link is invalid or has expired
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth/login" className={buttonVariants()}>
              Back to login
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md my-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(handleResetPassword)}>
            <FieldGroup className="gap-y-4">
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <PasswordInput
                      id="password"
                      placeholder="••••••••"
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button disabled={isPending} type="submit">
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />{" "}
                    <span>Loading...</span>
                  </>
                ) : (
                  "Reset password"
                )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
