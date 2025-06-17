import { LoginForm } from "@/components/auth/login-form";
import { Card } from "@/components/ui/card";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <Card className="p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <Suspense>
          <LoginForm />
        </Suspense>
      </Card>
    </div>
  );
}
