import { SignupForm } from '@/components/auth/signup-form';
import { Card } from '@/components/ui/card';

export default function SignupPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <Card className="p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
        <SignupForm />
      </Card>
    </div>
  );
}