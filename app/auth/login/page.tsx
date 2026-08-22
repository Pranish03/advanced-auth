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

export default function LoginPage() {
  return (
    <Tabs defaultValue="signin" className="mx-auto w-full max-w-md my-10 px-4">
      <TabsList>
        <TabsTrigger value="signin">Log in</TabsTrigger>
        <TabsTrigger value="signup">Sign up</TabsTrigger>
      </TabsList>
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
            <SignUpTab />
          </CardContent>
          <CardFooter className="grid grid-cols-2 gap-3">
            <SocialAuthButtons />
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
