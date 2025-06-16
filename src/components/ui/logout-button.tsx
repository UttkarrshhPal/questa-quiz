// components/ui/logout-button.tsx
"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Logged out successfully");
      router.push("/");
    } catch {
      toast.error("Failed to logout");
    }
  };

  return (
    <Button onClick={handleLogout} variant="outline" size="sm">
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </Button>
  );
}