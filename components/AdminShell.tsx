"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/causes", label: "Manage Causes", icon: "🗂️" },
];

export default function AdminShell({
  adminName,
  children,
}: {
  adminName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex bg-cream">
      <aside className="w-[240px] shrink-0 bg-blue-800 text-white flex flex-col fixed inset-y-0">
        <div className="p-6 border-b border-white/10">
          <Logo dark />
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <span aria-hidden>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-white/40 px-2 mb-2">Signed in as</p>
          <p className="text-sm font-medium px-2 mb-3 truncate">{adminName}</p>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-pink-300 hover:bg-white/5 transition-colors"
          >
            Log Out
          </button>
        </div>
      </aside>

      <div className="flex-1 ml-[240px]">
        <div className="p-8 sm:p-10 max-w-6xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
