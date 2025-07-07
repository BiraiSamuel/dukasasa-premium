import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BAGISTO_URL = "https://jezkimhardware.dukasasa.co.ke";

export async function POST(req: NextRequest, { params }: { params: { productId: string } }) {
  const body = await req.json();
  const cookieStore = cookies();
  const bagistoSession = cookieStore.get("bagisto-session");
  const authHeader = req.headers.get("authorization");

  console.log("🛒 Attempting to add to cart:");
  console.log("Product ID:", params.productId);
  console.log("Payload:", JSON.stringify(body, null, 2));
  console.log("Bearer Token:", authHeader);
  console.log("Session Cookie:", bagistoSession?.value);

  // Use Bearer token if available, fallback to session cookie
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (authHeader && authHeader.startsWith("Bearer ")) {
    headers.Authorization = authHeader;
  } else if (bagistoSession?.value) {
    headers.Cookie = `bagisto_session=${bagistoSession.value}`;
  }

  try {
    const res = await fetch(`${BAGISTO_URL}/api/checkout/cart/add/${params.productId}`, {
      method: "POST",
      headers,
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

    // ✅ Set session cookie from Bagisto response (if provided)
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
