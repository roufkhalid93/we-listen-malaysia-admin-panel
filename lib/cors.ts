import { NextResponse } from "next/server";

const allowedOrigins = (process.env.FRONTEND_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

export function resolveOrigin(requestOrigin: string | null) {
  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    return requestOrigin;
  }
  return allowedOrigins[0] || "*";
}

export function corsHeaders(requestOrigin: string | null) {
  return {
    "Access-Control-Allow-Origin": resolveOrigin(requestOrigin),
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export function withCors(res: NextResponse, requestOrigin: string | null) {
  const headers = corsHeaders(requestOrigin);
  Object.entries(headers).forEach(([key, value]) => res.headers.set(key, value));
  return res;
}

export function corsPreflight(requestOrigin: string | null) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(requestOrigin) });
}
