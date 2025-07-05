// /app/api/proxy/cart/route.ts

"use server";

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BAGISTO_BASE_URL = "https://jezkimhardware.dukasasa.co.ke";

// Helper: Get Bagisto session cookie in required format
function getSessionCookie() {
  const cookieValue = cookies().get("bagisto-session")?.value;
  return cookieValue ? `bagisto_session=${cookieValue}` : "";
}

// GET: Retrieve cart details
export async function GET() {
  try {
    const sessionCookie = getSessionCookie();

    const res = await fetch(`${BAGISTO_BASE_URL}/api/checkout/cart`, {
      headers: {
        Accept: "application/json",
        Cookie: sessionCookie,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { success: false, message: "Failed to fetch cart.", error: errText },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({ success: true, cart: data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Something went wrong.", error },
      { status: 500 }
    );
  }
}

// DELETE: Remove a cart item (Bagisto uses GET for this, not DELETE!)
export async function DELETE(req: NextRequest) {
  const sessionCookie = getSessionCookie();
  const { item_id } = await req.json();
  //console.log(item_id);

  if (!sessionCookie || !item_id) {
    return NextResponse.json(
      { success: false, message: "Missing session or item_id." },
      { status: 400 }
    );
  }

  try {
    // ⚠️ Bagisto uses GET for removing cart items
    const res = await fetch(`${BAGISTO_BASE_URL}/api/checkout/cart/remove-item/${item_id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Cookie: sessionCookie,
      },
    });

    const text = await res.text();

    try {
      const result = JSON.parse(text);
      if (!res.ok) throw new Error(result?.message || "Failed to delete item");
      return NextResponse.json({ success: true, result });
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid response", raw: text },
        { status: res.status }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Something went wrong while deleting item.", error },
      { status: 500 }
    );
  }
}

// PATCH: Update cart item quantity
export async function PATCH(req: NextRequest) {
  const sessionCookie = getSessionCookie();
  const { item_id, quantity } = await req.json();

  if (!sessionCookie || !item_id || !quantity) {
    return NextResponse.json(
      { success: false, message: "Missing session, item_id, or quantity." },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`${BAGISTO_BASE_URL}/api/checkout/cart/update`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Cookie: sessionCookie,
      },
      body: JSON.stringify({ qty: { [item_id]: quantity } }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Failed to update quantity");

    return NextResponse.json({ success: true, cart: data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Something went wrong.", error },
      { status: 500 }
    );
  }
}
