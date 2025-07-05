// app/api/proxy/cart/add/[id]/route.ts

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BAGISTO_URL = "https://jezkimhardware.dukasasa.co.ke";

export async function POST(req: NextRequest, { params }: { params: { productId: string } }) {
  const body = await req.json();
  const bagistoSession = cookies().get("bagisto-session");

  console.log("🛒 Attempting to add to cart:");
  console.log("Product ID:", params.productId);
  console.log("Payload:", JSON.stringify(body, null, 2));
  console.log("Session Cookie:", bagistoSession?.value);

  try {
    const res = await fetch(`${BAGISTO_URL}/api/checkout/cart/add/${params.productId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(bagistoSession && {
          Cookie: `bagisto_session=${bagistoSession.value}`,
        }),
      },
      body: JSON.stringify(body),
    });

    const responseText = await res.text();

    let json: any;
    try {
      json = JSON.parse(responseText);
    } catch {
      console.error("❌ Invalid JSON from Bagisto:", responseText);
      return NextResponse.json(
        { success: false, message: "Invalid JSON response from Bagisto", raw: responseText },
        { status: 500 }
      );
    }

    // ❗ Check for known internal Bagisto error (usually bad payload)
    if (json?.error?.message?.includes("Trying to get property 'status' of non-object")) {
      console.error("⚠️ Malformed add-to-cart request. Likely payload mismatch.");
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product add-to-cart payload. Check product type and structure.",
          error: json.error,
        },
        { status: 400 }
      );
    }

    const nextRes = NextResponse.json({ success: res.ok, data: json }, { status: res.status });

    // ✅ Handle session cookie set from Bagisto
    const setCookie = res.headers.get("set-cookie");
    console.log("Set-Cookie Header:", setCookie);
    if (setCookie) {
      const sessionMatch = setCookie.match(/bagisto_session=([^;]+);/);
      if (sessionMatch) {
        nextRes.cookies.set("bagisto-session", sessionMatch[1], {
          path: "/",
          httpOnly: true,
        });
      }
    }

    return nextRes;
  } catch (error) {
    console.error("❌ Failed to add to cart:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add to cart. Possibly a network or payload issue.",
        error,
      },
      { status: 500 }
    );
  }
}
