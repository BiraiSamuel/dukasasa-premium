// /app/api/proxy/products/route.ts

import { NextRequest } from "next/server";

const BAGISTO_URL = "https://jezkimhardware.dukasasa.co.ke/api/products";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Get dynamic query params, or fallback to defaults
  const limit = searchParams.get("limit") || "20";
  const page = searchParams.get("page") || "1";

  const url = `${BAGISTO_URL}?limit=${limit}&page=${page}`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store", // always fetch fresh data
    });

    if (!res.ok) {
      const errorText = await res.text();
      return new Response(`Failed to fetch Bagisto products: ${errorText}`, { status: res.status });
    }

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error("Proxy fetch failed:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
