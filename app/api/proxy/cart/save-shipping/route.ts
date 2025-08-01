import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BAGISTO_BASE_URL = process.env.BAGISTO_BASE_URL || "https://jezkimhardware.dukasasa.co.ke";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("bagisto-session")?.value || "";
    const authHeader = req.headers.get("authorization");

    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    // Prefer Bearer token if available
    if (authHeader && authHeader.startsWith("Bearer ")) {
      headers.Authorization = authHeader;
    } else if (sessionCookie) {
      headers.Cookie = `bagisto_session=${sessionCookie}`;
    }

    const response = await fetch(`${BAGISTO_BASE_URL}/api/checkout/save-shipping`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    console.error("❌ Save shipping error:", err);
    return NextResponse.json({ success: false, message: "Save shipping failed" }, { status: 500 });
  }
}
