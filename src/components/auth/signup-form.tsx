// components/auth/signup-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AlertCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

const formSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=$$$${};':"\\|,.<>\/?])/,
        "Password must contain uppercase, lowercase, number, and special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Helper component to show field validation status
function FieldStatus({ 
  error, 
  success, 
  message 
}: { 
  error?: string; 
  success?: boolean; 
  message?: string; 
}) {
  if (error) {
    return (
      <div className="flex items-center gap-1 mt-1.5">
        <AlertCircle className="h-3.5 w-3.5 text-red-500" />
        <p className="text-xs text-red-500">{error}</p>
      </div>
    );
  }
  
  if (success && message) {
    return (
      <div className="flex items-center gap-1 mt-1.5">
        <Check className="h-3.5 w-3.5 text-green-600" />
        <p className="text-xs text-green-600">{message}</p>
      </div>
    );
  }
  
  return null;
}

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange", // Enable real-time validation
  });

  // Watch form values for real-time validation
  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");
  const name = form.watch("name");
  const email = form.watch("email");

  // Get field states
  const nameError = form.formState.errors.name;
  const emailError = form.formState.errors.email;
  const passwordError = form.formState.errors.password;
  const confirmPasswordError = form.formState.errors.confirmPassword;

  // Check if fields have been touched
  const nameTouched = form.formState.touchedFields.name;
  const emailTouched = form.formState.touchedFields.email;
  const passwordTouched = form.formState.touchedFields.password;
  const confirmPasswordTouched = form.formState.touchedFields.confirmPassword;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
      const result = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
      });

      if (result.error) {
        console.error("Signup error:", result.error);
        
        if (result.error.message?.includes("already exists")) {
          toast.error("Email already exists", {
            description: "Please login or use a different email address.",
          });
          
          setTimeout(() => {
            router.push(`/login?email=${encodeURIComponent(values.email)}`);
          }, 2000);
          return;
        }

        throw new Error(result.error.message || "Failed to create account");
      }

      toast.success("Account created successfully! 🎉", {
        description: "Redirecting to dashboard...",
      });
      
      // Use window.location for hard redirect
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
      
    } catch (error) {
      console.error("Signup error:", error);
      
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Helper to get password validation details
  const getPasswordValidationDetails = () => {
    if (!password) return null;
    
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=$$$${};':"\\|,.<>\/?]/.test(password),
    };

    const allValid = Object.values(checks).every(Boolean);
    
    return { checks, allValid };
  };

  const passwordValidation = getPasswordValidationDetails();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="John Doe" 
                  autoComplete="name"
                  className={cn(
                    nameTouched && (nameError ? "border-red-500" : name.length >= 2 ? "border-green-500" : "")
                  )}
                  {...field} 
                />
              </FormControl>
              {nameTouched && (
                <FieldStatus 
                  error={nameError?.message}
                  success={!nameError && name.length >= 2}
                  message="Name looks good!"
                />
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  autoComplete="email"
                  className={cn(
                    emailTouched && (emailError ? "border-red-500" : email && !emailError ? "border-green-500" : "")
                  )}
                  {...field}
                />
              </FormControl>
              {emailTouched && (
                <FieldStatus 
                  error={emailError?.message}
                  success={!emailError && email.length > 0}
                  message="Valid email address"
                />
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={cn(
                    passwordTouched && (
                      passwordError ? "border-red-500" : 
                      passwordValidation?.allValid ? "border-green-500" : ""
                    )
                  )}
                  {...field}
                />
              </FormControl>
              
              {/* Show requirements when field is touched or has value */}
              {(passwordTouched || password) && passwordValidation && (
                <div className="mt-2 space-y-1">
                  <div className={cn(
                    "text-xs flex items-center gap-1",
                    passwordValidation.checks.length ? "text-green-600" : "text-red-500"
                  )}>
                    {passwordValidation.checks.length ? <Check className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                    At least 8 characters {!passwordValidation.checks.length && `(current: ${password.length})`}
                  </div>
                  
                  <div className={cn(
                    "text-xs flex items-center gap-1",
                    passwordValidation.checks.lowercase ? "text-green-600" : "text-red-500"
                  )}>
                    {passwordValidation.checks.lowercase ? <Check className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                    One lowercase letter
                  </div>
                  
                  <div className={cn(
                    "text-xs flex items-center gap-1",
                    passwordValidation.checks.uppercase ? "text-green-600" : "text-red-500"
                  )}>
                    {passwordValidation.checks.uppercase ? <Check className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                    One uppercase letter
                  </div>
                  
                  <div className={cn(
                    "text-xs flex items-center gap-1",
                    passwordValidation.checks.number ? "text-green-600" : "text-red-500"
                  )}>
                    {passwordValidation.checks.number ? <Check className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                    One number
                  </div>
                  
                  <div className={cn(
                    "text-xs flex items-center gap-1",
                    passwordValidation.checks.special ? "text-green-600" : "text-red-500"
                  )}>
                    {passwordValidation.checks.special ? <Check className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                    One special character (!@#$%^&*...)
                  </div>
                </div>
              )}
              
              {!passwordTouched && !password && (
                <FormDescription>
                  Must be at least 8 characters with uppercase, lowercase, number, and symbol
                </FormDescription>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={cn(
                    confirmPasswordTouched && (
                      confirmPasswordError ? "border-red-500" : 
                      password && confirmPassword && password === confirmPassword ? "border-green-500" : ""
                    )
                  )}
                  {...field}
                />
              </FormControl>
              {confirmPasswordTouched && (
                <FieldStatus 
                  error={confirmPasswordError?.message}
                  success={!!password && !!confirmPassword && password === confirmPassword}
                  message="Passwords match!"
                />
              )}
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || !form.formState.isValid}
        >
          {isLoading ? "Creating account..." : "Sign up"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="underline hover:text-primary">
            Login
          </Link>
        </p>
      </form>
    </Form>
  );
}