import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { User, Mail, Lock } from "lucide-react";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  return (
    <Card {...props} className="border-border/50 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your information to get started
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form>
          <FieldGroup className="space-y-4">
            <Field>
              <FieldLabel htmlFor="name" className="text-sm font-medium">
                Full Name
              </FieldLabel>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10"
                  required
                />
              </div>
            </Field>
            <Field>
              <FieldLabel htmlFor="email" className="text-sm font-medium">
                Email address
              </FieldLabel>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  required
                />
              </div>
              <FieldDescription className="mt-1">
                We&apos;ll use this to contact you. We will not share your email.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password" className="text-sm font-medium">
                Password
              </FieldLabel>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" className="pl-10" required />
              </div>
              <FieldDescription className="mt-1">
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password" className="text-sm font-medium">
                Confirm password
              </FieldLabel>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="confirm-password" type="password" placeholder="••••••••" className="pl-10" required />
              </div>
              <FieldDescription className="mt-1">
                Please confirm your password.
              </FieldDescription>
            </Field>
            <Field className="flex flex-col gap-3">
              <Button type="submit" className="w-full">
                Create Account
              </Button>
              <Button variant="outline" type="button" className="w-full">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M24 12.004c0 6.622-5.378 12-12 12s-12-5.378-12-12c0-6.623 5.378-12 12-12 6.622 0 12 5.377 12 12zm-6.491-8.114c-.197-1.178-.757-2.158-1.582-2.93-.757-.756-1.757-1.255-2.808-1.427l-.91 1.506c.87.453 1.477 1.22 1.74 2.12.197 1.178.757 2.158 1.582 2.93.756.756 1.757 1.255 2.808 1.427l.91-1.506zM12 11.553l-4.293-2.947-.91 1.506L12 14.553l5.293-3.947-.91-1.506L12 11.553z" />
                </svg>
                Continue with Google
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/" className="text-project-blue hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
