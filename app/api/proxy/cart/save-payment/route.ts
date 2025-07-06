// app/api/proxy/cart/save-payment/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("bagisto-session")?.value || "";

    const response = await fetch(`${process.env.BAGISTO_BASE_URL}/api/checkout/save-payment`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Cookie: `bagisto_session=${sessionCookie}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ success: false, message: "Save payment failed" }, { status: 500 });
  }
}
