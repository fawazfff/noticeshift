import { NextRequest, NextResponse } from "next/server";

const API = "https://api.anakin.io/v1";

function apiKey() {
  return process.env.ANAKIN_API_KEY;
}

export async function GET() {
  const key = apiKey();
  if (!key) return NextResponse.json({ error: "ANAKIN_API_KEY is not configured." }, { status: 500 });
  const response = await fetch(`${API}/monitors`, {
    headers: { "X-API-Key": key },
    cache: "no-store",
  });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function POST(request: NextRequest) {
  const key = apiKey();
  if (!key) return NextResponse.json({ error: "ANAKIN_API_KEY is not configured." }, { status: 500 });

  const body = await request.json();
  const url = String(body.url || "").trim();
  const category = String(body.category || "announcements");
  const intervalMinutes = Number(body.intervalMinutes ?? 15);
  if (!Number.isInteger(intervalMinutes) || intervalMinutes < 15 || intervalMinutes > 10080) {
    return NextResponse.json({ error: "Choose a check interval between 15 minutes and 7 days." }, { status: 400 });
  }
  if (!/^https?:\/\//i.test(url)) {
    return NextResponse.json({ error: "Enter a valid webpage URL starting with https://" }, { status: 400 });
  }

  const goals: Record<string, string> = {
    prices: "Focus on product prices, discounts, fees, and stock availability. Explain price increases or decreases clearly.",
    opportunities: "Focus on application openings, eligibility requirements, required documents, and deadlines for scholarships, internships, and grants.",
    announcements: "Focus on important announcements, policy changes, dates, deadlines, and newly added or removed requirements.",
    business: "Focus on supplier prices, product availability, catalogue changes, business terms, and competitor information.",
  };

  const response = await fetch(`${API}/monitors`, {
    method: "POST",
    headers: { "X-API-Key": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
      intervalMinutes,
      watchMode: "full_page",
      aiMode: true,
      aiGoal: goals[category] || goals.announcements,
      country: "ng",
    }),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function DELETE() {
  const key = apiKey();
  if (!key) return NextResponse.json({ error: "ANAKIN_API_KEY is not configured." }, { status: 500 });

  const listResponse = await fetch(`${API}/monitors`, {
    headers: { "X-API-Key": key },
    cache: "no-store",
  });
  const listData = await listResponse.json();
  if (!listResponse.ok) return NextResponse.json(listData, { status: listResponse.status });

  const monitors = Array.isArray(listData)
    ? listData
    : (listData.monitors || listData.data?.monitors || []);

  const results = await Promise.all(
    monitors.map(async (monitor: { id?: string }) => {
      if (!monitor.id) return { success: false, error: "Monitor ID missing." };
      const response = await fetch(`${API}/monitors/${encodeURIComponent(monitor.id)}`, {
        method: "DELETE",
        headers: { "X-API-Key": key },
      });
      return { success: response.ok, status: response.status };
    })
  );

  const failed = results.filter((result) => !result.success);
  return NextResponse.json(
    { deleted: results.length - failed.length, failed: failed.length },
    { status: failed.length ? 207 : 200 }
  );
}
