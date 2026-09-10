import { NextRequest, NextResponse } from "next/server";
import { MessagesStore } from "@/lib/data";
import { getSessionFromCookies } from "@/lib/auth";
import { withCors, corsPreflight } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req.headers.get("origin"));
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const body = await req.json();
  const { name, email, subject, message, phone } = body;

  if (!name || !email || !subject || !message) {
    return withCors(
      NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      ),
      origin
    );
  }

  const messages = await MessagesStore.getAll();
  messages.unshift({
    id: crypto.randomUUID(),
    name,
    email,
    phone: phone || "",
    subject,
    message,
    createdAt: new Date().toISOString(),
  });
  await MessagesStore.saveAll(messages);

  return withCors(NextResponse.json({ success: true }, { status: 201 }), origin);
}

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const messages = await MessagesStore.getAll();
  return NextResponse.json(messages);
}
