// components/providers/session-provider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type User = {
  id: string;
  email: string;
  name?: string | null;
};

type SessionContextType = {
  user: User | null;
  loading: boolean;
  refetch: () => Promise<void>;
};

const SessionContext = createContext<SessionContextType>({
  user: null,
  loading: true,
  refetch: async () => {},
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchSession = async () => {
    try {
      const session = await authClient.getSession();
      setUser(
        session && "data" in session && session.data
          ? session.data.user || null
          : null
      );
    } catch (error) {
      console.error("Session fetch error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  // Handle client-side routing protection
  useEffect(() => {
    if (!loading) {
      const protectedPaths = ["/dashboard", "/quiz/create"];
      const isProtectedPath =
        protectedPaths.some((path) => pathname.startsWith(path)) ||
        pathname.match(/\/quiz\/.*\/(edit|responses)/);

      const authPaths = ["/login", "/signup"];
      const isAuthPath = authPaths.includes(pathname);

      if (!user && isProtectedPath) {
        router.push("/login");
      } else if (user && isAuthPath) {
        router.push("/dashboard");
      }
    }
  }, [user, loading, pathname, router]);

  return (
    <SessionContext.Provider value={{ user, loading, refetch: fetchSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);
