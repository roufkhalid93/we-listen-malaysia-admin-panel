import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth";

export default async function AdminIndexPage() {
  const session = await getSessionFromCookies();
  redirect(session ? "/admin/dashboard" : "/admin/login");
}
