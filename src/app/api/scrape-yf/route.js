// ✅ Import Required Libraries
import puppeteer from "puppeteer";
const cheerio = require("cheerio");
import fs from "fs/promises";
import path from "path";
import { existsSync } from "fs";

// 🎯 Scrape Yahoo Finance Financials
async function scrapeFinancialReports(ticker) {
  const urls = {
    incomeStatement: `https://finance.yahoo.com/quote/${ticker}/financials?p=${ticker}`,
    balanceSheet: `https://finance.yahoo.com/quote/${ticker}/balance-sheet?p=${ticker}`,
    cashFlow: `https://finance.yahoo.com/quote/${ticker}/cash-flow?p=${ticker}`,
  };

 // 🚀 Launch Puppeteer browser
const browser = await puppeteer.launch({
    headless: "new",
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      "--disable-software-rasterizer",
      "--remote-debugging-port=9222",
      "--disable-features=FirstPartySets", 
    ],
  });

  try {
    const page = await browser.newPage();

    // ✅ Set Custom Headers and User Agent
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36"
    );

    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
    });

    // 📊 Extract Data from Each Report
    const incomeStatement = await extractReportData(page, urls.incomeStatement);
    const balanceSheet = await extractReportData(page, urls.balanceSheet);
    const cashFlow = await extractReportData(page, urls.cashFlow);

    

    // 🎯 Combine Extracted Data
    return {
      incomeStatement,
      balanceSheet,
      cashFlow,
    };
  } catch (error) {
    console.error("❌ Error scraping Yahoo Finance:", error);
    return { error: "Failed to scrape financial reports." };
  } finally {
    await browser.close();
  }
}

async function extractReportData(page, url) {
  console.log(`🔍 Extracting data from: ${url}`);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });

  async function extractTableData(contextLabel) {
    // ✅ Expand All Rows
    const expandButton = await page.$("button.link2-btn");
    if (expandButton) {
      console.log(`⏳ Expanding all rows for ${contextLabel}...`);
      await expandButton.click();
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Allow time for expansion
      console.log(`✅ All rows expanded for ${contextLabel}.`);
    } else {
      console.warn(`⚠️ Expand-all button not found for ${contextLabel}. Continuing...`);
    }

    // ✅ Wait for rows to appear
    await page.waitForSelector(".row.lv-0, .row.lv-1, .row.lv-2", { timeout: 60000 });

    const html = await page.content();
    const $ = cheerio.load(html);

    const headers = [];
    $(".tableHeader .row .column").each((index, element) => {
      headers.push($(element).text().trim());
    });

    const rows = [];
    $(".tableBody .row").each((index, element) => {
      const rowTitle = $(element).find(".rowTitle").text().trim();
      const rowLevel = $(element).attr("class").match(/lv-(\d+)/)?.[1] || "0";

      if (!rowTitle) return;

      const rowValues = [];
      $(element)
        .find(".column")
        .each((i, el) => {
          if (i > 0) {
            rowValues.push($(el).text().trim().replace(/,/g, ""));
          }
        });

      if (rowValues.length > 0) {
        rows.push({
          metric: rowLevel === "0" ? rowTitle.trim() : `${"  ".repeat(rowLevel)}${rowTitle}`.trim(),
          values: rowValues,
        });
      }
    });

    return { headers, rows };
  }

  // 📌 Extract Annual Data (default)
  const annualData = await extractTableData("Annual");
  // 🔄 Switch to Quarterly
  const quarterlyTab = await page.$("#tab-quarterly");

  if (quarterlyTab) {
    console.log("🔄 Switching to Quarterly data...");
    await quarterlyTab.click();
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Allow time for expansion

    // Ensure table is loaded again
    await page.waitForSelector(".tableBody .row", { timeout: 60000 });

    // 📌 Extract Quarterly Data
    const quarterlyData = await extractTableData("Quarterly");

    const reportData = {
      annual: annualData,
      quarterly: quarterlyData,
    };

    console.log(
      `✅ Extracted Annual & Quarterly Data for ${url.split("/")[5]}:`,
      JSON.stringify(reportData, null, 2)
    );

    return reportData;
  } else {
    console.warn("⚠️ Quarterly tab not found. Returning only annual data.");
    return { annual: annualData };
  }
}


// 📄 API Route Handler
export async function GET(req) {
  // ✅ Extract Ticker and Query Params
  const { searchParams } = new URL(req.url);
  const ticker = searchParams.get("ticker");
  const forceScrape = searchParams.get("forceScrape") === "true"; // default is false

  // ❗️ Validate Input
  if (!ticker || ticker.length < 1) {
    return Response.json(
      { error: "Invalid or missing ticker." },
      { status: 400 }
    );
  }

  const upperTicker = ticker.toUpperCase();
  const reportPath = path.resolve(`public/reports/${upperTicker}.json`);

  try {
    // 🔍 Check for Existing File if not forced
    if (!forceScrape && existsSync(reportPath)) {
      console.log(`📂 Found cached report for ${upperTicker}. Returning saved data.`);
      const cachedData = await fs.readFile(reportPath, "utf-8");
      return Response.json({
        success: true,
        ticker: upperTicker,
        cached: true,
        data: JSON.parse(cachedData),
      });
    }

    // 🚀 Scrape Data if not found or forceScrape=true
    console.log(`🔄 Scraping financial reports for: ${upperTicker}`);
    const financialReports = await scrapeFinancialReports(upperTicker);

    // 💾 Save Scraped Data
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(financialReports, null, 2), "utf-8");

    return Response.json({
      success: true,
      ticker: upperTicker,
      cached: false,
      data: financialReports,
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
    return Response.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}

