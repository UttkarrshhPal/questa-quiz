import { getServerSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session?.user) {
    const headersList = await headers();
    const currentPath = headersList.get("x-pathname") || "/dashboard"; // fallback
    redirect(`/login?redirect=${encodeURIComponent(currentPath)}`);
  }

  return <>{children}</>;
}
