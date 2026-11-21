import { NextResponse } from "next/server";

const API = "https://api.anakin.io/v1";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const key = process.env.ANAKIN_API_KEY;
  if (!key) return NextResponse.json({ error: "ANAKIN_API_KEY is not configured." }, { status: 500 });
  const { id } = await context.params;
  try {
    const response = await fetch(`${API}/monitors/${encodeURIComponent(id)}/changes`, {
      headers: { "X-API-Key": key },
      cache: "no-store",
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ error: "Could not reach the monitoring service." }, { status: 502 });
  }
}
