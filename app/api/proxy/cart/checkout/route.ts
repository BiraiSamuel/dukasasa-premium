// /app/api/proxy/cart/checkout/route.ts

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BAGISTO_BASE_URL = "https://jezkimhardware.dukasasa.co.ke";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("bagisto-session")?.value || "";
    //console.log("Here---"+sessionCookie);

    const res = await fetch(`${BAGISTO_BASE_URL}/api/checkout/save-order`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Cookie: `bagisto_session=${sessionCookie}`,
      },
    });
    //console.log(`bagisto_session=${sessionCookie}`);
    const data = await res.json();
    //console.log("save order feedback")
    //console.log(data)

    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Checkout failed" },
      { status: 500 }
    );
  }
}
