import { NextRequest, NextResponse } from "next/server";

const API = "https://api.anakin.io/v1";

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const key = process.env.ANAKIN_API_KEY;
  if (!key) return NextResponse.json({ error: "ANAKIN_API_KEY is not configured." }, { status: 500 });
  const { id } = await context.params;
  const response = await fetch(`${API}/monitors/${encodeURIComponent(id)}`, {
    headers: { "X-API-Key": key },
    cache: "no-store",
  });
  return NextResponse.json(await response.json(), { status: response.status });
}