import { NextRequest, NextResponse } from "next/server";
import { StatsStore } from "@/lib/data";
import { withCors, corsPreflight } from "@/lib/cors";

// Public read-only endpoint exposing org-wide marketing figures
// (volunteers, years active, partner communities) for the frontend repo.
export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req.headers.get("origin"));
}

export async function GET(req: NextRequest) {
  const stats = await StatsStore.get();
  return withCors(NextResponse.json(stats), req.headers.get("origin"));
}
