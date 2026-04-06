const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://localhost:8000";

//  API Route Handler
export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const ticker = searchParams.get("ticker");
  const reportType = searchParams.get("reportType");
  const forceScrape = searchParams.get("forceScrape") === "true";

  if (!ticker || ticker.length < 1) {
    return Response.json(
      { error: "Invalid or missing ticker." },
      { status: 400 },
    );
  }

  const upperTicker = ticker.toUpperCase();

  try {
    console.log(`Fetching from Python API for ${upperTicker}`);

    const res = await fetch(
      `${PYTHON_API_URL}/financials/${upperTicker}?force_scrape=${forceScrape}&period=${reportType}`,
    );

    if (!res.ok) {
      throw new Error(`Python API error: ${res.status}`);
    }

    const json = await res.json();

    if (!json.success) {
      throw new Error(json.error || "Failed to fetch financials");
    }

    const financialReports = json.data;

    return Response.json({
      success: true,
      ticker: upperTicker,
      cached: false,
      data: financialReports,
    });
  } catch (error) {
    console.error("Error:", error.message);

    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
