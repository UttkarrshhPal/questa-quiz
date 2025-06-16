import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Users, BarChart } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Welcome to Questa</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Create and share quizzes with ease
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">Login</Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <Card className="p-6">
          <CheckCircle className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Easy to Create</h3>
          <p className="text-muted-foreground">
            Build quizzes with multiple question types in minutes
          </p>
        </Card>
        <Card className="p-6">
          <Users className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Share Publicly</h3>
          <p className="text-muted-foreground">
            Share your quizzes with anyone via a simple link
          </p>
        </Card>
        <Card className="p-6">
          <BarChart className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Track Responses</h3>
          <p className="text-muted-foreground">
            View and analyze all responses to your quizzes
          </p>
        </Card>
      </div>
    </div>
  );
}