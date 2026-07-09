"use client";

import { cn } from "@/lib/utils";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { loginAction } from "@/actions/auth/login";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function LoginForm({ className }: { className?: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const loginSchema = z.object({
    email: z.email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "abir@gmail.com", password: "123456789" },
  });

  const mutation = useMutation({
    mutationFn: loginAction,
    onSuccess: () => {
      toast.success("Welcome back!");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error((error as Error).message || "Login failed");
    },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    await mutation.mutateAsync(data);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Logo/Branding area */}
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-xl bg-project-blue/10 flex items-center justify-center mb-3">
          <Lock className="w-6 h-6 text-project-blue" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-1">
          Welcome back
        </h2>
        <p className="text-muted-foreground">
          Enter your credentials to access your tasks
        </p>
      </div>

      <Card className="border-border/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl">Sign in to your account</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your email and password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
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
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.email.message}
                  </p>
                )}
              </Field>
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel
                    htmlFor="password"
                    className="text-sm font-medium"
                  >
                    Password
                  </FieldLabel>
                  <Link
                    href="#"
                    className="text-sm text-project-blue hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.password.message}
                  </p>
                )}
              </Field>
              <Field className="flex flex-col gap-3">
                <Button
                  disabled={mutation.isPending}
                  type="submit"
                  className="w-full"
                >
                  {mutation.isPending ? "Signing in..." : "Sign in"}
                </Button>
                <Button variant="outline" type="button" className="w-full">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M24 12.004c0 6.622-5.378 12-12 12s-12-5.378-12-12c0-6.623 5.378-12 12-12 6.622 0 12 5.377 12 12zm-6.491-8.114c-.197-1.178-.757-2.158-1.582-2.93-.757-.756-1.757-1.255-2.808-1.427l-.91 1.506c.87.453 1.477 1.22 1.74 2.12.197 1.178.757 2.158 1.582 2.93.756.756 1.757 1.255 2.808 1.427l.91-1.506zM12 11.553l-4.293-2.947-.91 1.506L12 14.553l5.293-3.947-.91-1.506L12 11.553z"
                    />
                  </svg>
                  Continue with Google
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-project-blue hover:underline font-medium"
                  >
                    Sign up
                  </Link>
                </p>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
