import { NextResponse } from "next/server";
import axios from "axios";
const cheerio = require("cheerio");
import { parseStringPromise } from "xml2js";
import { mkdir, writeFile, readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";


// ✅ SEC API Constants
const BASE_URL = "https://www.sec.gov/Archives/edgar/data";
const SEARCH_URL = "https://data.sec.gov/submissions/";
const TICKER_URL = "https://www.sec.gov/files/company_tickers.json";

// ✅ SEC Headers
const SEC_HEADERS = {
  "User-Agent": "EarningsCallInsights/1.0 (mailto:vishal.singh@jaiinfoway.com)",
  "Accept-Encoding": "gzip, deflate",
  Host: "www.sec.gov",
  Connection: "keep-alive",
  Accept: "application/json, text/plain, */*",
};

const SEC_HEADERS2 = {
  "User-Agent": "EarningsCallInsights/1.0 (mailto:vishal.singh@jaiinfoway.com)",
  "Accept-Encoding": "gzip, deflate",
  Host: "data.sec.gov",
  Referer: "https://www.sec.gov/",
  Accept: "application/json, text/plain, */*",
  Connection: "keep-alive",
};

// 🎯 Define report types with possible variations (singular/plural inclusive)
const REPORT_KEYWORDS = {
  incomeStatement: [
    "STATEMENTS OF OPERATIONS",
    "STATEMENT OF OPERATIONS",
    "STATEMENTS OF INCOME",
    "STATEMENT OF INCOME",
    "INCOME STATEMENTS",
    "INCOME STATEMENT",
    "PROFIT AND LOSS",
    "CONSOLIDATED STATEMENTS OF OPERATIONS",
    "CONSOLIDATED STATEMENT OF OPERATIONS",
    "CONSOLIDATED INCOME STATEMENTS",
    "CONSOLIDATED INCOME STATEMENT",
    "CONSOLIDATED STATEMENT OF EARNINGS",
    "CONSOLIDATED STATEMENTS OF EARNINGS",
    "STATEMENTS OF EARNINGS",
    "STATEMENT OF EARNINGS",
    "COMPREHENSIVE INCOME STATEMENTS",
    "COMPREHENSIVE INCOME STATEMENT",
    "CONSOLIDATED COMPREHENSIVE INCOME STATEMENT",
    "CONSOLIDATED COMPREHENSIVE INCOME STATEMENTS",
  ],
  balanceSheet: [
    "BALANCE SHEETS",
    "BALANCE SHEET",
    "STATEMENTS OF FINANCIAL POSITION",
    "STATEMENT OF FINANCIAL POSITION",
    "CONSOLIDATED BALANCE SHEETS",
    "CONSOLIDATED BALANCE SHEET",
    "STATEMENTS OF ASSETS AND LIABILITIES",
    "STATEMENT OF ASSETS AND LIABILITIES",
    "STATEMENTS OF FINANCIAL CONDITION",
    "STATEMENT OF FINANCIAL CONDITION",
  ],
  cashFlow: [
    "STATEMENTS OF CASH FLOWS",
    "STATEMENT OF CASH FLOWS",
    "CASH FLOW STATEMENTS",
    "CASH FLOW STATEMENT",
    "CONSOLIDATED STATEMENTS OF CASH FLOWS",
    "CONSOLIDATED STATEMENT OF CASH FLOWS",
    "CASH FLOWS STATEMENT",
    "STATEMENT OF CASH FLOW",
  ],
  comprehensiveIncome: [
    "STATEMENTS OF COMPREHENSIVE INCOME",
    "STATEMENT OF COMPREHENSIVE INCOME",
    "CONSOLIDATED STATEMENTS OF COMPREHENSIVE INCOME",
    "CONSOLIDATED STATEMENT OF COMPREHENSIVE INCOME",
    "COMPREHENSIVE INCOME STATEMENTS",
    "COMPREHENSIVE INCOME STATEMENT",
    "STATEMENTS OF OTHER COMPREHENSIVE INCOME",
    "STATEMENT OF OTHER COMPREHENSIVE INCOME",
  ],
  equity: [
    "STATEMENTS OF STOCKHOLDERS’ EQUITY",
    "STATEMENT OF STOCKHOLDERS’ EQUITY",
    "STATEMENTS OF CHANGES IN STOCKHOLDERS’ EQUITY",
    "STATEMENT OF CHANGES IN STOCKHOLDERS’ EQUITY",
    "STATEMENTS OF CHANGES IN EQUITY",
    "STATEMENT OF CHANGES IN EQUITY",
    "CONSOLIDATED STATEMENTS OF EQUITY",
    "CONSOLIDATED STATEMENT OF EQUITY",
    "STATEMENTS OF SHAREHOLDERS' EQUITY",
    "STATEMENT OF SHAREHOLDERS' EQUITY",
  ]

};


// ❌ Keywords to Exclude (Parenthetical and Irrelevant Reports)
const EXCLUDE_KEYWORDS = [
  "PARENTHETICAL",
  "Parent Company",
  "Tables",
  "Schedule",
  "Details",
];



// 📡 Fetch CIK from Symbol
async function getCIKFromSymbol(symbol) {
  try {
    const { data } = await axios.get(TICKER_URL, { headers: SEC_HEADERS });
    const companies = Object.values(data);
    const company = companies.find(
      (c) => c.ticker.toLowerCase() === symbol.toLowerCase()
    );

    if (company) {
      return String(company.cik_str).padStart(10, "0");
    } else {
      throw new Error(`CIK not found for symbol: ${symbol}`);
    }
  } catch (error) {
    console.error("Error fetching CIK:", error.message);
    return null;
  }
}

// 📡 Get Parent Company CIK if Available
async function getParentCompanyCIK(cik) {
  try {
    const { data } = await axios.get(`${SEARCH_URL}${cik}.json`, {
      headers: SEC_HEADERS2,
    });

    const parentCIK = data?.filings?.recent?.form.includes("8-K")
      ? data?.filings?.recent?.cik_str || null
      : null;

    if (parentCIK) {
      console.log(`Parent Company CIK found: ${parentCIK}`);
      return parentCIK;
    }
    return null;
  } catch (error) {
    console.error("Error fetching parent CIK:", error.message);
    return null;
  }
}

// 🎯 Fetch 10-K Filings with Fallbacks
async function get10KFilings(cik, reportType) {
  try {
    // 🔥 Fetch XML Data
    const response = await axios.get(
      `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cik}&type=10-K&count=5&output=xml`,
      { headers: SEC_HEADERS }
    );

    // 🔥 Parse XML Response
    const result = await parseStringPromise(response.data);

    // ✅ Extract Filings
    const filings = result.companyFilings.results[0].filing || [];

    // 🎯 Filter 10-K Filings and Extract URLs
    const tenKPromises = filings
      .filter((filing) => filing.type[0] === "10-K")
      .map(async (filing) => {
        const indexUrl = filing.filingHREF[0];
        const { filingUrl, periodOfReport } = await getDocumentUrl(indexUrl, reportType);

        return filingUrl && periodOfReport
          ? {
            dateFiled: filing.dateFiled[0],
            formType: filing.type[0],
            url: filingUrl,
            periodOfReport: periodOfReport
          }
          : null;
      });

    // ⏳ Await All Promises and Filter Valid URLs
    const tenKFilings = (await Promise.all(tenKPromises)).filter(Boolean);

    // console.log("✅ ====>Found 10-K Filings: =====>", tenKFilings);
    const transformedTenKFilings = tenKFilings.map(f => {
      if (f.url.includes(".htm")) {
        const xmlUrl = convertToXMLUrl(f.url)
        return {
          ...f, url: xmlUrl
        }
      } else return f;
    }).slice(0, 4);
    console.log("✅ ====>transformedTenKFilings: =====>", transformedTenKFilings);

    return transformedTenKFilings;
  } catch (error) {
    console.error("❌ Error fetching 10-K filings:", error.message);
    return [];
  }
}

// 📝 Function to Convert URL by Removing Last Part and Appending FilingSummary.xml
function convertToXMLUrl(htmlUrl) {
  // 🧠 Remove Last Part After Last Slash and Append FilingSummary.xml
  const baseUrl = htmlUrl.substring(0, htmlUrl.lastIndexOf("/"));
  return `${baseUrl}/FilingSummary.xml`;
}

// 🔎 Get Actual 10-K/10-Q Filing URL from Index Page
async function getDocumentUrl(indexUrl, reportType) {
  try {
    // 🌐 Fetch index page (HTML with links to documents)
    const response = await axios.get(indexUrl, { headers: SEC_HEADERS });
    const $ = cheerio.load(response.data);

    // 🎯 Find the 10-K document link from the index page correctly
    const docLink = $("tr")
      .filter((_, el) => {
        const text = $(el).text().trim();
        return text.includes(reportType === "annual" ? "10-K" : "10-Q") && !text.includes("index");
      })
      .find("a")
      .first()
      .attr("href");


    if (docLink) {
      const filingUrl = transformToXmlUrl(`https://www.sec.gov${docLink}`);
      console.log("docLink", docLink)
      const periodOfReport = extractDateFromFilename(docLink);
      console.log("periodOfReport", periodOfReport)
      return { filingUrl, periodOfReport };
    } else {
      console.warn(`⚠️ No ${reportType === "annual" ? "10-K" : "10-Q"} document found on page: ${indexUrl}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error fetching index page (${indexUrl}):`, error.message);
    return null;
  }
}


// 🔄 Transform Inline XBRL (iXBRL) Link to FilingSummary.xml
function transformToXmlUrl(ixbrlUrl) {
  try {
    const xmlUrl = ixbrlUrl
      .replace(/ix\?doc=/, "") // ✅ Remove `ix?doc=`
      .replace(/\/\w+-\d{8}\.htm$/, "/FilingSummary.xml"); // 🔄 Match any filename before date and replace

    return xmlUrl;
  } catch (error) {
    console.warn("⚠️ Unable to transform URL:", ixbrlUrl);
    return null;
  }
}


function extractDateFromFilename(filename) {
  const regex = /([a-z]+)(?:-\w+)?[_-](\d{4})(\d{2})(\d{2})\.htm/;
  const match = filename.match(regex);


  if (match) {
    const ticker = match[1].toUpperCase(); // Convert ticker to uppercase
    const year = match[2];
    const month = match[3];
    const day = match[4];

    // 🎯 Create Date in YYYY-MM-DD format
    const dateString = `${year}-${month}-${day}`;
    return dateString;
  } else {
    console.warn("⚠️ Invalid filename format:", filename);
    return null;
  }
}

// 📊 Extract Financial Data from Filing
async function extractFinancialData(filingURL, periodOfReport, dateFiled, formType, symbol) {
  try {
    const { data } = await axios.get(filingURL, { headers: SEC_HEADERS });
    const parsedData = await parseStringPromise(data);

    const reports = parsedData?.FilingSummary?.MyReports?.[0]?.Report || [];
    const baseFilingURL = filingURL.replace("/FilingSummary.xml", "");
    // 🎯 Helper function to check for keyword matches
    function isMatch(reportName, keywords) {
      return keywords.some((keyword) =>
        reportName.includes(keyword.toUpperCase())
      );
    }
    // 🚫 Exclude Parenthetical and Details Reports
    const isExcluded = (shortName) => {
      return EXCLUDE_KEYWORDS.some((keyword) => shortName.includes(keyword.toUpperCase()));
    };


    // 📊 Get target reports dynamically
    const targetReports = reports.filter((report) => {
      const shortName = (report?.ShortName?.[0] || "").trim().toUpperCase();

      // ❗️ Skip parenthetical and supplemental reports
      if (isExcluded(shortName)) {
        return false;
      }

      return (
        isMatch(shortName, REPORT_KEYWORDS.incomeStatement) ||
        isMatch(shortName, REPORT_KEYWORDS.balanceSheet) ||
        isMatch(shortName, REPORT_KEYWORDS.cashFlow) ||
        isMatch(shortName, REPORT_KEYWORDS.comprehensiveIncome) || // Optional addition
        isMatch(shortName, REPORT_KEYWORDS.equity)
        // isMatch(shortName, REPORT_KEYWORDS.notes) ||
        // isMatch(shortName, REPORT_KEYWORDS.segmentData) ||
        // isMatch(shortName, REPORT_KEYWORDS.supplementalInfo) ||
        // isMatch(shortName, REPORT_KEYWORDS.leaseInfo) ||
        // isMatch(shortName, REPORT_KEYWORDS.derivatives)
      );
    });




    let allFinancialData = [];
    for (const report of targetReports) {
      const reportPath = report?.HtmlFileName?.[0] || "";
      if (reportPath) {
        const reportURL = `${baseFilingURL}/${reportPath}`;
        console.log(`🎯 Fetching Report: ${report.ShortName[0]} from ${reportURL}`);
        const reportData = await fetchAndParseReport(reportURL);
        if (reportData) {
          allFinancialData.push({
            comapny_ticker: symbol,
            reportName: cleanReportName(report.ShortName[0]),
            data: reportData,
            periodOfReport,
            dateFiled,
            formType,
            quarter: getQuarterFromDate(periodOfReport)
          });
        }
      }
    }

    return allFinancialData;
  } catch (error) {
    console.error("Error extracting financial data:", error.message);
    return null;
  }
}

// 📊 Clean Report Name by Removing Unnecessary Words and Normalizing
const cleanReportName = (reportName) => {
  return reportName
    .replace(/Consolidated\s/gi, "") // Remove "Consolidated"
    .replace(/\(.*?\)/g, "") // Remove text in parentheses
    .replace(/\s+/g, " ") // Normalize multiple spaces
    .replace(/Statements/gi, "Statement") // Normalize plural to singular
    .replace(/Sheets/gi, "Sheet") // Normalize plural to singular
    .replace(/Flows/gi, "Flow") // Normalize "Cash Flows" to "Cash Flow"
    .trim(); // Remove extra spaces
};

// 📈 Fetch and Parse Report (HTML/HTM)
async function fetchAndParseReport(reportURL) {
  try {
    // ✅ Fetch HTML content
    const { data: htmlData } = await axios.get(reportURL, { headers: SEC_HEADERS });
    const $ = cheerio.load(htmlData);

    // 🎯 Initialize Report Data Object
    const reportData = {
      header: "",
      period: "",
      data: {},
    };

    // ✅ Extract Header Information
    const headerElement = $("table.report th.tl strong").first();
    if (headerElement.length > 0) {
      reportData.header = headerElement.text().trim().replace(/\s+/g, " ");
    }

    const cleanedData = cleanReportName(reportData.header);

    reportData.header = cleanedData;

    // ✅ Extract Latest Period (First Column after Labels)
    const firstRow = $("table.report tr").first().find("th.th");
    if (firstRow.length > 0) {
      reportData.period = firstRow.first().text().trim().replace(/\s+/g, " ");
    }

    // ✅ Process all rows in the document
    $("table.report tr").each((j, row) => {
      // ✅ Skip header rows
      if ($(row).find("th").length > 0) {
        return;
      }

      // 🎯 Get Label
      const label = $(row).find("td.pl").first().text().trim().replace(/\s+/g, " ");
      if (!label) return;

      // ✅ Get Latest Period Value (First Numeric Column after Label)
      const valueCell = $(row).find("td.nump").first();
      let colValue = valueCell.text().trim();

      // ✅ Check for negative values inside parentheses and handle appropriately
      if (colValue.match(/\(\d[\d,]*\)/)) {
        // 🎯 Convert (123,456) → -123456
        colValue = `-${colValue.replace(/[$(),]/g, "").trim()}`;
      } else {
        // ✅ Remove $, commas, and trim if no parentheses
        colValue = colValue.replace(/[$,]/g, "").trim();
      }

      // ✅ Add valid data to the object if label and value exist
      if (colValue && !isNaN(colValue)) {
        reportData.data[label] = parseFloat(colValue);
      }
    });

    // ✅ Return Parsed Data
    return reportData;
  } catch (error) {
    console.error(`❌ Error fetching or parsing ${reportURL}:`, error.message);
    return null;
  }
}

// 📡 Get Latest 10-Q Filings URLs
async function get10QFilings(cik, reportType) {

  try {
    // 🔥 Fetch XML Data
    const response = await axios.get(
      `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cik}&type=10-Q&count=5&output=xml`,
      { headers: SEC_HEADERS }
    );

    // 🔥 Parse XML Response
    const result = await parseStringPromise(response.data);

    // ✅ Extract Filings
    const filings = result.companyFilings.results[0].filing || [];

    // 🎯 Filter 10-Q Filings and Extract URLs
    const tenQPromises = filings
      .filter((filing) => filing.type[0] === "10-Q")
      .map(async (filing) => {
        const indexUrl = filing.filingHREF[0];
        const { filingUrl, periodOfReport } = await getDocumentUrl(indexUrl, reportType);

        return filingUrl && periodOfReport
          ? {
            dateFiled: filing.dateFiled[0],
            formType: filing.type[0],
            url: filingUrl,
            periodOfReport: periodOfReport
          }
          : null;

      });

    // ⏳ Await All Promises and Filter Valid URLs
    const tenQFilings = (await Promise.all(tenQPromises)).filter(Boolean);

    console.log("✅ ====>Found 10-Q Filings: =====>", tenQFilings);
    const transformed10QFilings = tenQFilings.map(f => {
      if (f.url.includes(".htm")) {
        const xmlUrl = convertToXMLUrl(f.url)
        return {
          ...f, url: xmlUrl
        }
      } else return f;
    }).slice(0, 3);
    console.log("✅ ====>transformedTen Q Filings: =====>", transformed10QFilings);

    return transformed10QFilings;
  } catch (error) {
    console.error("❌ Error fetching 10-K filings:", error.message);
    return [];
  }

}

function getQuarterFromDate(dateString) {
  const date = new Date(dateString);
  const month = date.getMonth() + 1; // getMonth() is zero-based (0 = Jan, 11 = Dec)

  // 🎯 Determine the Quarter (10-Q only considers Q1, Q2, Q3)
  if (month >= 1 && month <= 3) return "Q1";
  if (month >= 4 && month <= 6) return "Q2";
  if (month >= 7 && month <= 9) return "Q3";

  // ❗️ Q4 should return null or indicate it's not a 10-Q period
  if (month >= 10 && month <= 12) return null; // No 10-Q for Q4
}



// ✅ Main API Handler - For GET Requests
// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const symbol = searchParams.get("symbol");
//     const reportType = searchParams.get("reportType");

//     // 🎯 Get CIK from Symbol
//     let cik = await getCIKFromSymbol(symbol);

//     if (!cik) {
//       return NextResponse.json(
//         { error: `Unable to fetch CIK for symbol: ${symbol}` },
//         { status: 400 }
//       );
//     }

//     if (reportType === "annual") {
//     // 🔍 Fetch 10-K Filings or Alternatives
//       let filingURLs = await get10KFilings(cik, reportType);
//       if (filingURLs.length === 0) {
//         console.warn(`No 10-K/alternative filings found for CIK ${cik}.`);
//         // 🎯 Check for Parent Company Filings
//         const parentCIK = await getParentCompanyCIK(cik);
//         if (parentCIK) {
//           //console.log(`🔄 Checking Parent Company CIK: ${parentCIK}`);
//           filingURLs = await get10KFilings(parentCIK, reportType);
//         }
//       }

//       if (filingURLs.length === 0) {
//         return NextResponse.json(
//           { success: false, error: "No relevant filings found" },
//           { status: 404 }
//         );
//       }



//       // 🧠 Extract Financial Data from All Filings
//       const financialDataPromises = filingURLs.map(async (filingURL) => {
//         const financialData = await extractFinancialData(filingURL.url, filingURL.periodOfReport, filingURL.dateFiled, filingURL.formType, symbol);
//         if (financialData && financialData.length > 0) {
//           const year = new Date(filingURL.periodOfReport).getFullYear();
//           const reportType = filingURL.formType === "10-K" ? "Annual" : "Quarterly";

//           // ✅ Construct directory path dynamically
//           const directoryPath = path.join(
//             process.cwd(),
//             "public",
//             "financial-metrics",
//             symbol,
//             reportType,
//             String(year),
//           );

//           try {
//             // 🎯 Create the directory recursively if it doesn't exist
//             await mkdir(directoryPath, { recursive: true });

//             // 📄 Define file path and write the file
//             const filePath = path.join(directoryPath, `${filingURL.formType}.json`);
//             await writeFile(filePath, JSON.stringify(financialData, null, 2));
//             console.log(`✅ File written successfully: ${filePath}`);
//           } catch (error) {
//             console.error("Error creating directory or writing file:", error);
//           }

//           // ✅ Return processed data
//           return {
//             symbol,
//             formType: filingURL.formType,
//             year,
//             data: financialData,
//           };
//         }
//         return null;
//       });


//       // 🎯 Await All Filings and Filter Valid Results
//       const allFinancialData = (await Promise.all(financialDataPromises)).filter(
//         Boolean
//       );

//       if (allFinancialData.length === 0) {
//         return NextResponse.json(
//           { success: false, error: "No financial data extracted" },
//           { status: 404 }
//         );
//       }
//       return NextResponse.json({ success: true, financialData: allFinancialData }, { status: 200 });

//     } else {
//       const filings = await get10QFilings(cik);



//       // 🧠 Extract Financial Data from All Filings
//       const financialDataPromises_10_Q = filings.map(async (filingURL) => {
//         const financialData = await extractFinancialData(filingURL.url, filingURL.periodOfReport, filingURL.dateFiled, filingURL.formType);
//         if (financialData && financialData.length > 0) {
//           const year = new Date(filingURL.periodOfReport).getFullYear();
//           const quarter = getQuarterFromDate(filingURL.periodOfReport);
//           const reportType = filingURL.formType === "10-K" ? "Annual" : "Quarterly";

//           // ✅ Construct directory path dynamically
//           const directoryPath_10_Q = path.join(
//             process.cwd(),
//             "public",
//             "financial-metrics",
//             symbol,
//             reportType,
//             String(year)
//           );

//           try {
//             // 🎯 Create the directory recursively if it doesn't exist
//             await mkdir(directoryPath_10_Q, { recursive: true });

//             // 📄 Define file path and write the file
//             const filePath = path.join(directoryPath_10_Q, `${quarter}.json`);
//             await writeFile(filePath, JSON.stringify(financialData, null, 2));
//             console.log(`✅ File written successfully: ${filePath}`);
//           } catch (error) {
//             console.error("Error creating directory or writing file:", error);
//           }

//           // ✅ Return processed data
//           return {
//             symbol,
//             formType: filingURL.formType,
//             year,
//             data: financialData,
//           };
//         }
//         return null;
//       });


//       // 🎯 Await All Filings and Filter Valid Results
//       const allFinancialData_10_Q = (await Promise.all(financialDataPromises_10_Q)).filter(
//         Boolean
//       );

//       if (allFinancialData_10_Q.length === 0) {
//         return NextResponse.json(
//           { success: false, error: "No financial data extracted" },
//           { status: 404 }
//         );
//       }

//       return NextResponse.json({ success: true, financialData: allFinancialData_10_Q }, { status: 200 });

//     }

//   } catch (error) {
//     console.error("Error processing request:", error.message);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol");
    const reportType = searchParams.get("reportType");
    const forceScrape = searchParams.get("forceScrape") === "true";

    if (!symbol || !reportType) {
      return NextResponse.json(
        { error: "Missing required parameters." },
        { status: 400 }
      );
    }

    let cik = await getCIKFromSymbol(symbol);
    if (!cik) {
      return NextResponse.json(
        { error: `Unable to fetch CIK for symbol: ${symbol}` },
        { status: 400 }
      );
    }

    if (reportType === "annual") {
      let filingURLs = await get10KFilings(cik, reportType);
      if (filingURLs.length === 0) {
        const parentCIK = await getParentCompanyCIK(cik);
        if (parentCIK) {
          filingURLs = await get10KFilings(parentCIK, reportType);
        }
      }

      if (filingURLs.length === 0) {
        return NextResponse.json(
          { success: false, error: "No relevant filings found" },
          { status: 404 }
        );
      }

      const financialDataPromises = filingURLs.map(async (filingURL) => {
        const year = new Date(filingURL.periodOfReport).getFullYear();
        const directoryPath = path.join(
          process.cwd(),
          "public",
          "financial-metrics",
          symbol,
          "Annual",
          String(year)
        );
        const filePath = path.join(directoryPath, `${filingURL.formType}.json`);

        // 🧠 If file exists and no forceScrape, read and return cached data
        if (!forceScrape && existsSync(filePath)) {
          const cachedData = await readFile(filePath, "utf-8");
          return {
            symbol,
            formType: filingURL.formType,
            year,
            data: JSON.parse(cachedData),
            cached: true
          };
        }

        // 🧪 Scrape, save and return as usual
        const financialData = await extractFinancialData(
          filingURL.url,
          filingURL.periodOfReport,
          filingURL.dateFiled,
          filingURL.formType,
          symbol
        );

        if (financialData && financialData.length > 0) {
          await mkdir(directoryPath, { recursive: true });
          await writeFile(filePath, JSON.stringify(financialData, null, 2));
          console.log(`✅ File written successfully: ${filePath}`);

          return {
            symbol,
            formType: filingURL.formType,
            year,
            data: financialData,
            cached: false
          };
        }

        return null;
      });

      const allFinancialData = (await Promise.all(financialDataPromises)).filter(Boolean);

      if (allFinancialData.length === 0) {
        return NextResponse.json(
          { success: false, error: "No financial data extracted" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, financialData: allFinancialData }, { status: 200 });

    } else {
      const filings = await get10QFilings(cik);

      const financialDataPromises_10_Q = filings.map(async (filingURL) => {
        const year = new Date(filingURL.periodOfReport).getFullYear();
        const quarter = getQuarterFromDate(filingURL.periodOfReport);
        const directoryPath_10_Q = path.join(
          process.cwd(),
          "public",
          "financial-metrics",
          symbol,
          "Quarterly",
          String(year)
        );
        const filePath = path.join(directoryPath_10_Q, `${quarter}.json`);

        // 🧠 If file exists and no forceScrape, read and return cached data
        if (!forceScrape && existsSync(filePath)) {
          const cachedData = await readFile(filePath, "utf-8");
          return {
            symbol,
            formType: filingURL.formType,
            year,
            data: JSON.parse(cachedData),
            cached: true
          };
        }

        // 🧪 Scrape, save and return as usual
        const financialData = await extractFinancialData(
          filingURL.url,
          filingURL.periodOfReport,
          filingURL.dateFiled,
          filingURL.formType
        );

        if (financialData && financialData.length > 0) {
          await mkdir(directoryPath_10_Q, { recursive: true });
          await writeFile(filePath, JSON.stringify(financialData, null, 2));
          console.log(`✅ File written successfully: ${filePath}`);

          return {
            symbol,
            formType: filingURL.formType,
            year,
            data: financialData,
            cached: false
          };
        }

        return null;
      });

      const allFinancialData_10_Q = (await Promise.all(financialDataPromises_10_Q)).filter(Boolean);

      if (allFinancialData_10_Q.length === 0) {
        return NextResponse.json(
          { success: false, error: "No financial data extracted" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, financialData: allFinancialData_10_Q }, { status: 200 });
    }

  } catch (error) {
    console.error("Error processing request:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
