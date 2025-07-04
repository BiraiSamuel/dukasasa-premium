export async function GET() {
  try {
    const res = await fetch("https://jezkimhardware.dukasasa.co.ke/api/products", {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store", // disables caching to always get fresh data
    });

    if (!res.ok) {
      return new Response("Failed to fetch from external API", { status: 500 });
    }

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error("Proxy fetch failed:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
