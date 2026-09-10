import { NextRequest, NextResponse } from "next/server";
import { CausesStore } from "@/lib/data";
import { getSessionFromCookies } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const causes = await CausesStore.getAll();
  const cause = causes.find((c) => c.id === id);
  if (!cause) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(cause);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const causes = await CausesStore.getAll();
  const index = causes.findIndex((c) => c.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const existing = causes[index];
  const tags = Array.isArray(body.tags)
    ? body.tags
    : typeof body.tags === "string"
    ? body.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
    : existing.tags;

  causes[index] = {
    ...existing,
    title: body.title ?? existing.title,
    category: body.category ?? existing.category,
    tags,
    summary: body.summary ?? existing.summary,
    description: body.description ?? existing.description,
    image: body.image ?? existing.image,
    goal: body.goal !== undefined ? Number(body.goal) : existing.goal,
    raised: body.raised !== undefined ? Number(body.raised) : existing.raised,
    peopleHelped:
      body.peopleHelped !== undefined
        ? Number(body.peopleHelped)
        : existing.peopleHelped,
    priority: body.priority !== undefined ? Boolean(body.priority) : existing.priority,
    status: body.status ?? existing.status,
    location: body.location ?? existing.location,
  };

  await CausesStore.saveAll(causes);
  return NextResponse.json(causes[index]);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const causes = await CausesStore.getAll();
  const filtered = causes.filter((c) => c.id !== id);
  if (filtered.length === causes.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await CausesStore.saveAll(filtered);
  return NextResponse.json({ success: true });
}
