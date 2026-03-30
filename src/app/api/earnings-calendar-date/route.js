import puppeteer from "puppeteer";

// ✅ Format date for Yahoo Finance URL (YYYY-MM-DD → YYYY-MM-DD)
const formatDateForYahoo = (dateString) => {
  const [year, month, day] = dateString.split("-");
  return `${year}-${month}-${day}`;
};

export async function GET(req) {
  try {
    // 🎯 Extract query params: date, page, size
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");
    const pageParam = parseInt(searchParams.get("page") || "1", 10); // Default to page 1
    const sizeParam = parseInt(searchParams.get("size") || "25", 10); // Default to size 25

    // 📅 Default to today's date if no date is provided
    const today = new Date().toISOString().split("T")[0];
    const selectedDate = dateParam || today;

    // 🕰️ Format date for Yahoo Finance
    const formattedDate = formatDateForYahoo(selectedDate);

    // 📡 Yahoo Finance earnings calendar URL
    const url = `https://finance.yahoo.com/calendar/earnings?day=${formattedDate}`;
    console.log(`🔗 Scraping URL: ${url}`);

    // 🚀 Launch Puppeteer browser
    const browser = await puppeteer.launch({
      headless: true, // Run in headless mode
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--disable-software-rasterizer",
        "--remote-debugging-port=9222",
      ],
    });

    // 📄 Open a new page
    const page = await browser.newPage();

    // 📡 Go to the Yahoo Finance earnings calendar page
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    // 📊 Extract earnings data
    const earningsData = await page.evaluate((sizeParam, pageParam) => {
      const rows = Array.from(document.querySelectorAll("table tbody tr"));

      // 🎯 Paginate results dynamically
      const startIndex = (pageParam - 1) * sizeParam;
      const endIndex = startIndex + sizeParam;
      const paginatedRows = rows.slice(startIndex, endIndex);

      // 🔥 Scrape data from each row
      return paginatedRows.map((row) => {
        const cells = row.querySelectorAll("td");

        // 📝 Return scraped data
        return {
          ticker: cells[0]?.innerText.trim() || "N/A",
          company: cells[1]?.innerText.trim() || "N/A",
          event: cells[2]?.innerText.trim() || "N/A",
          earningsCallTime: cells[3]?.innerText.trim() || "N/A",
          epsEstimate: cells[4]?.innerText.trim() || "N/A",
          epsReported: cells[5]?.innerText.trim() || "N/A",
          surprise: cells[6]?.innerText.trim() || "N/A",
        };
      });
    }, sizeParam, pageParam);

    console.log(`✅ Extracted ${earningsData.length} rows.`);

    // 🛑 Close browser after scraping
    await browser.close();

    // ✅ Return JSON response with earnings data
    return Response.json({
      success: true,
      date: selectedDate,
      data: earningsData,
      totalResults: earningsData.length,
      nextOffset: (pageParam - 1) * sizeParam + earningsData.length,
    });
  } catch (error) {
    console.error("❌ Error scraping earnings data:", error);
    return Response.json({
      success: false,
      error: "Failed to scrape earnings data",
    });
  }
}
