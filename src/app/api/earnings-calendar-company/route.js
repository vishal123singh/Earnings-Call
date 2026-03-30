import axios from "axios";
import Papa from "papaparse";

// ✅ Alpha Vantage API Base URL
const ALPHA_VANTAGE_URL = "https://www.alphavantage.co/query";

// ✅ API Key (Replace with your own API key)
const API_KEY = "X8S1EUG70YVL21RJ"; // <-- Add your Alpha Vantage API key here

export async function POST(req) {
  try {
    // 🎯 Extract request body: symbols, page, size
    const body = await req.json();
    const symbols = body.selectedCompanies || ["AAPL"]; // Default to AAPL if no symbols provided
    const pageParam = parseInt(body.page || "1", 10); // Default to page 1
    const sizeParam = parseInt(body.size || "25", 10); // Default to 25 records

    // 📊 Container to store combined data
    let allData = [];

    // 🔄 Fetch data for each symbol
    for (const symbol of symbols) {
      const url = `${ALPHA_VANTAGE_URL}?function=EARNINGS_CALENDAR&symbol=${symbol}&apikey=${API_KEY}`;
      console.log(`🔗 Fetching data for: ${symbol} from: ${url}`);

      try {
        // 📡 Fetch data from Alpha Vantage
        const response = await axios.get(url, { responseType: "text" });

        // ✅ Parse CSV data to JSON
        const parsedData = Papa.parse(response.data, {
          header: true, // Treat first row as headers
          skipEmptyLines: true, // Skip empty rows
        });

        // 🎯 Check if valid data is returned
        if (parsedData.data && parsedData.data.length > 0) {
          // Add symbol-specific data to combined results
          parsedData.data.forEach((item) => {
            allData.push({ symbol, ...item });
          });
        } else {
          console.log(`❌ No data found for ${symbol}`);
        }
      } catch (err) {
        console.error(`❌ Error fetching data for ${symbol}:`, err.message);
      }
    }

    // 📊 Check if any data was fetched
    if (allData.length === 0) {
      return Response.json({
        success: false,
        error: "No earnings data found for the specified symbols.",
      });
    }

    // 🎯 Pagination Logic
    const startIndex = (pageParam - 1) * sizeParam;
    const endIndex = startIndex + sizeParam;
    const paginatedData = allData.slice(startIndex, endIndex);

    console.log(`✅ Combined and extracted ${paginatedData.length} rows.`);

    // ✅ Return combined and paginated data
    return Response.json({
      success: true,
      data: paginatedData,
      totalResults: allData.length,
      nextOffset: endIndex < allData.length ? endIndex : null,
    });
  } catch (error) {
    console.error("❌ Error fetching data from Alpha Vantage:", error.message);
    return Response.json({
      success: false,
      error: "Failed to fetch earnings data from Alpha Vantage.",
    });
  }
}
