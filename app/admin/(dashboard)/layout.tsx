import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth";
import AdminShell from "@/components/AdminShell";

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = getSessionFromCookies();
  if (!session) {
    redirect("/admin/login");
  }

  return <AdminShell adminName={session!.name}>{children}</AdminShell>;
}
