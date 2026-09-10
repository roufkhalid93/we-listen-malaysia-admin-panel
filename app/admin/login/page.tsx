"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      setStatus("error");
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-blue-800 flex items-center justify-center p-4 paper-texture">
      <div className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-2xl">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <h1 className="font-display text-2xl text-ink text-center mb-1">Admin Panel</h1>
        <p className="text-sm text-ink/50 text-center mb-7">
          Sign in to manage causes and view impact stats.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink/70 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-ink/15 px-4 py-2.5 text-sm focus-ring focus:border-blue-400 outline-none"
              placeholder="admin@welisten.org.my"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink/70 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-ink/15 px-4 py-2.5 text-sm focus-ring focus:border-blue-400 outline-none"
              placeholder="••••••••"
            />
          </div>

          {status === "error" && <p className="text-sm text-pink-600">{error}</p>}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-full transition-colors focus-ring"
          >
            {status === "loading" ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-xs text-ink/40 text-center mt-6 leading-relaxed">
          Demo credentials: admin@welisten.org.my / WeListen@2026
        </p>
      </div>
    </div>
  );
}
