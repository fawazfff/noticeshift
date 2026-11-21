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
  const category = String(body.category || "announcements");\n  const intervalMinutes = Number(body.intervalMinutes ?? 15);\n  if (!Number.isInteger(intervalMinutes) || intervalMinutes < 15 || intervalMinutes > 10080) {\n    return NextResponse.json({ error: "Choose a check interval between 15 minutes and 7 days." }, { status: 400 });\n  }
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