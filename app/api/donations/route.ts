import { NextRequest, NextResponse } from "next/server";
import { DonationsStore, CausesStore } from "@/lib/data";
import { getSessionFromCookies } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { withCors, corsPreflight } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req.headers.get("origin"));
}

export async function GET(req: NextRequest) {
  const session = getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const donations = await DonationsStore.getAll();
  return NextResponse.json(donations);
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const body = await req.json();
  const { causeId, name, email, amount, message } = body;

  if (!causeId || !name || !email || !amount) {
    return withCors(
      NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 }
      ),
      origin
    );
  }

  const numericAmount = Number(amount);
  if (!numericAmount || numericAmount <= 0) {
    return withCors(
      NextResponse.json(
        { error: "Please enter a valid donation amount." },
        { status: 400 }
      ),
      origin
    );
  }

  const causes = await CausesStore.getAll();
  const cause = causes.find((c) => c.id === causeId);
  if (!cause) {
    return withCors(
      NextResponse.json({ error: "Cause not found." }, { status: 404 }),
      origin
    );
  }

  const donations = await DonationsStore.getAll();
  const donation = {
    id: uuidv4(),
    causeId,
    causeTitle: cause.title,
    name,
    email,
    amount: numericAmount,
    message: message || "",
    createdAt: new Date().toISOString(),
  };
  donations.unshift(donation);
  await DonationsStore.saveAll(donations);

  cause.raised += numericAmount;
  await CausesStore.saveAll(causes);

  return withCors(
    NextResponse.json({ success: true, donation }, { status: 201 }),
    origin
  );
}
