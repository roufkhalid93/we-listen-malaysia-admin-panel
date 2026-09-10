import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth";

export default function AdminIndexPage() {
  const session = getSessionFromCookies();
  redirect(session ? "/admin/dashboard" : "/admin/login");
}
