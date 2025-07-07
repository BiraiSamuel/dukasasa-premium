// File: /app/api/proxy/register/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch("https://jezkimhardware.dukasasa.co.ke/api/v1/customer/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: body.name,
        last_name: body.lastname,
        email: body.email,
        password: body.password,
        password_confirmation: body.password, // Bagisto requires this field
      }),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Server Error" }, { status: 500 });
  }
}
