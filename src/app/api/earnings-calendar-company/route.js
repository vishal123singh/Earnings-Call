import axios from "axios";
import Papa from "papaparse";

const ALPHA_VANTAGE_URL =
  process.env.ALPHA_VANTAGE_BASE_URL || "https://www.alphavantage.co/query";

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

export async function POST(req) {
  try {
    const body = await req.json();
    const symbols = body.selectedCompanies || ["AAPL"];
    const pageParam = parseInt(body.page || "1", 10);
    const sizeParam = parseInt(body.size || "25", 10);

    // ✅ SINGLE API CALL (IMPORTANT)
    const url = `${ALPHA_VANTAGE_URL}?function=EARNINGS_CALENDAR&apikey=${API_KEY}`;
    console.log(`🔗 Fetching earnings calendar once`);

    const response = await axios.get(url, { responseType: "text" });

    const parsedData = Papa.parse(response.data, {
      header: true,
      skipEmptyLines: true,
    });

    if (!parsedData.data || parsedData.data.length === 0) {
      return Response.json({
        success: false,
        error: "No earnings data found.",
      });
    }

    // ✅ FILTER LOCALLY BY SYMBOLS
    const filteredData = parsedData.data.filter((item) =>
      symbols.includes(item.symbol),
    );

    // 📊 Pagination
    const startIndex = (pageParam - 1) * sizeParam;
    const endIndex = startIndex + sizeParam;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return Response.json({
      success: true,
      data: paginatedData,
      totalResults: filteredData.length,
      nextOffset: endIndex < filteredData.length ? endIndex : null,
    });
  } catch (error) {
    console.error("❌ Error:", error.message);

    return Response.json({
      success: false,
      error: "Failed to fetch earnings data.",
    });
  }
}
