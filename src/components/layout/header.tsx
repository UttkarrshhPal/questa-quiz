'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export function Header() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/');
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Questa
        </Link>
        
        <nav className="flex items-center gap-4">
          {!isPending && (
            <>
              {session?.user ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                  <Link href="/quiz/create">
                    <Button variant="ghost">Create Quiz</Button>
                  </Link>
                  <span className="text-sm text-muted-foreground">
                    {session.user.email}
                  </span>
                  <Button variant="outline" onClick={handleSignOut}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link href="/signup">
                    <Button>Sign Up</Button>
                  </Link>
                </>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}