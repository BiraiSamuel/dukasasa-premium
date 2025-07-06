// app/api/proxy/cart/save-address/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("bagisto-session")?.value || "";
    //console.log("This*****-----"+sessionCookie);

    const response = await fetch(`${process.env.BAGISTO_BASE_URL}/api/checkout/save-address`, {
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
    console.log(err);
    return NextResponse.json({ success: false, message: "Save address failed" }, { status: 500 });
  }
}
