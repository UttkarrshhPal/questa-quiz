'use client';

import { authClient } from '@/lib/auth-client';
import { useEffect } from 'react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Ensure session is loaded on mount
    authClient.getSession();
  }, []);

  return <>{children}</>;
}