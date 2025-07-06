import { NextRequest, NextResponse } from "next/server";

const BAGISTO_API = "https://jezkimhardware.dukasasa.co.ke/api";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const res = await fetch(`${BAGISTO_API}/products/slug/${params.slug}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: res.status }
      );
    }

    const json = await res.json();
    return NextResponse.json({ success: true, data: json.data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
