"use server";

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BAGISTO_BASE_URL =
  process.env.BAGISTO_BASE_URL || "https://jezkimhardware.dukasasa.co.ke";

// ✅ TS-safe helper: Resolve authentication (Bearer > Cookie)
function resolveAuthHeader(req?: NextRequest): Record<string, string> {
  const authHeader = req?.headers?.get("authorization");
  const session = cookies().get("bagisto-session")?.value;

  const headers: Record<string, string> = {};
  if (authHeader?.startsWith("Bearer ")) {
    headers["Authorization"] = authHeader;
  } else if (session) {
    headers["Cookie"] = `bagisto_session=${session}`;
  }
  return headers;
}

// ✅ GET: Retrieve cart details
export async function GET(req: NextRequest) {
  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...resolveAuthHeader(req),
    };

    const res = await fetch(`${BAGISTO_BASE_URL}/api/checkout/cart`, {
      headers,
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

// ✅ DELETE: Remove a cart item
export async function DELETE(req: NextRequest) {
  const { item_id } = await req.json();

  if (!item_id) {
    return NextResponse.json(
      { success: false, message: "Missing item_id." },
      { status: 400 }
    );
  }

  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...resolveAuthHeader(req),
    };

    const res = await fetch(
      `${BAGISTO_BASE_URL}/api/checkout/cart/remove-item/${item_id}`,
      {
        method: "GET", // ✅ Bagisto uses GET to remove item
        headers,
      }
    );

    const text = await res.text();
    try {
      const result = JSON.parse(text);
      if (!res.ok) throw new Error(result?.message || "Failed to delete item");
      return NextResponse.json({ success: true, result });
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid response", raw: text },
        { status: res.status }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete item.", error },
      { status: 500 }
    );
  }
}

// ✅ PATCH: Update cart item quantity
export async function PATCH(req: NextRequest) {
  const { item_id, quantity } = await req.json();

  if (!item_id || !quantity) {
    return NextResponse.json(
      { success: false, message: "Missing item_id or quantity." },
      { status: 400 }
    );
  }

  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...resolveAuthHeader(req),
    };

    const res = await fetch(`${BAGISTO_BASE_URL}/api/checkout/cart/update`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ qty: { [item_id]: quantity } }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Failed to update quantity");

    return NextResponse.json({ success: true, cart: data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update cart.", error },
      { status: 500 }
    );
  }
}
