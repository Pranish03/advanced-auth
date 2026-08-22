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
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

const signUpSchema = z.object({
  name: z.string().min(3, "Name must be of atleast 3 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be of atleast 8 characters"),
});

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUpTab() {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  function handleSignUp(data: SignUpForm) {
    startTransition(async () => {
      await authClient.signUp.email(
        { ...data, callbackURL: "/" },
        {
          onError: (error) => {
            toast.add({
              type: "error",
              description: error.error.message || "Failed to signup",
            });
          },
          onSuccess: () => {
            router.push("/");
          },
        },
      );
    });
  }

  return (
    <form onSubmit={form.handleSubmit(handleSignUp)}>
      <FieldGroup className="gap-y-4">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                {...field}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
            "Sign up"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
