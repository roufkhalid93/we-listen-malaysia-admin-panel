import { NextRequest, NextResponse } from "next/server";
import { CausesStore, Cause } from "@/lib/data";
import { getSessionFromCookies } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { withCors, corsPreflight } from "@/lib/cors";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req.headers.get("origin"));
}

export async function GET(req: NextRequest) {
  const causes = await CausesStore.getAll();
  return withCors(NextResponse.json(causes), req.headers.get("origin"));
}

export async function POST(req: NextRequest) {
  const session = getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const required = ["title", "category", "summary", "description", "goal"];
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json(
        { error: `Missing field: ${field}` },
        { status: 400 }
      );
    }
  }

  const causes = await CausesStore.getAll();
  const newCause: Cause = {
    id: uuidv4(),
    title: body.title,
    slug: `${slugify(body.title)}-${Date.now().toString(36)}`,
    category: body.category,
    tags: Array.isArray(body.tags)
      ? body.tags
      : (body.tags || "")
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean),
    summary: body.summary,
    description: body.description,
    image:
      body.image ||
      "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?q=80&w=1200&auto=format&fit=crop",
    goal: Number(body.goal) || 0,
    raised: Number(body.raised) || 0,
    peopleHelped: Number(body.peopleHelped) || 0,
    priority: Boolean(body.priority),
    status: body.status === "completed" ? "completed" : "active",
    location: body.location || "Malaysia",
    createdAt: new Date().toISOString(),
  };

  causes.unshift(newCause);
  await CausesStore.saveAll(causes);

  return NextResponse.json(newCause, { status: 201 });
}
