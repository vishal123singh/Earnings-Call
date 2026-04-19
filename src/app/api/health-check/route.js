import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const response = await fetch(process.env.PYTHON_API_URL + "/health");

    // handle non-200 responses
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "External API failed", details: errorText },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
