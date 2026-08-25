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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword({
  openSignInTab,
}: {
  openSignInTab: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  function handleForgotPassword(data: ForgotPasswordForm) {
    startTransition(async () => {
      await authClient.requestPasswordReset(
        { ...data, redirectTo: "/auth/reset-password" },
        {
          onError: (error) => {
            toast.add({
              type: "error",
              title:
                error.error.message || "Failed to send password reset email",
            });
          },
          onSuccess: () => {
            toast.add({
              type: "success",
              title: "Password reset email sent",
            });
          },
        },
      );
    });
  }

  return (
    <form onSubmit={form.handleSubmit(handleForgotPassword)}>
      <FieldGroup className="gap-y-4">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...field}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={openSignInTab}
            className="flex-1"
          >
            Back
          </Button>

          <Button disabled={isPending} type="submit" className="flex-1">
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />{" "}
                <span>Loading...</span>
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
