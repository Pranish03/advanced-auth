"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInTab from "./_components/sign-in-tab";
import SignUpTab from "./_components/sign-up-tab";
import SocialAuthButtons from "./_components/social-auth-buttons";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import EmailVerification from "./_components/email-verification";

type Tab = "signin" | "signup" | "email-verification";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<Tab>("signin");

  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session.data != null) router.push("/");
    });
  }, [router]);

  function openEmailVerificationTab(email: string) {
    setEmail(email);
    setSelectedTab("email-verification");
  }

  return (
    <Tabs
      value={selectedTab}
      onValueChange={(t) => setSelectedTab(t as Tab)}
      className="mx-auto w-full max-w-md my-10 px-4"
    >
      {selectedTab === "signin" ||
        (selectedTab === "signup" && (
          <TabsList>
            <TabsTrigger value="signin">Log in</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>
        ))}
      <TabsContent value="signin">
        <Card>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to Login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignInTab />
          </CardContent>
          <CardFooter className="grid grid-cols-2 gap-3">
            <SocialAuthButtons />
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="signup">
        <Card>
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Enter your information below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignUpTab openEmailVerificationTab={openEmailVerificationTab} />
          </CardContent>
          <CardFooter className="grid grid-cols-2 gap-3">
            <SocialAuthButtons />
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="email-verification">
        <Card>
          <CardHeader>
            <CardTitle>Verify your email</CardTitle>
          </CardHeader>
          <CardContent>
            <EmailVerification email={email} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
