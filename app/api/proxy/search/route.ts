// app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("search") || "";
  const page = req.nextUrl.searchParams.get("page") || "1";

  try {
    const res = await fetch(
      `https://jezkimhardware.dukasasa.co.ke/api/products?search=${encodeURIComponent(search)}&page=${page}`
    );

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { success: false, error: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      success: true,
      products: data.data,
      meta: {
        current_page: data.meta?.current_page,
        last_page: data.meta?.last_page,
        per_page: data.meta?.per_page,
        total: data.meta?.total,
        from: data.meta?.from,
        to: data.meta?.to,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch search results." },
      { status: 500 }
    );
  }
}
