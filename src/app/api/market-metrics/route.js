const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://localhost:8000";

export async function POST(req) {
  const { companies } = await req.json();

  if (!companies?.length) {
    return new Response(JSON.stringify({ error: "Company is required" }), {
      status: 400,
    });
  }

  const symbol = companies[0];

  try {
    // 🔥 Call BOTH endpoints in parallel
    const [marketRes, financialsRes] = await Promise.all([
      fetch(`${PYTHON_API_URL}/market-data/${symbol}`),
      fetch(`${PYTHON_API_URL}/financials/${symbol}`),
    ]);

    const [marketText, financialsText] = await Promise.all([
      marketRes.text(),
      financialsRes.text(),
    ]);

    let marketApi, financialsApi;

    try {
      marketApi = JSON.parse(marketText);
      financialsApi = JSON.parse(financialsText);
    } catch (err) {
      console.error("Invalid JSON:", { marketText, financialsText });
      throw new Error("FastAPI returned invalid JSON");
    }

    if (!marketRes.ok || !marketApi?.success) {
      throw new Error(marketApi?.detail || "Market API failed");
    }

    if (!financialsRes.ok || !financialsApi?.success) {
      throw new Error(financialsApi?.detail || "Financials API failed");
    }

    // ---------------- MARKET DATA ----------------
    const market = marketApi.data;

    const responseData = {
      stockPrices: market.stockPrices || [],
      marketData: {
        mktCap: market.marketData?.marketCap,
        beta: market.marketData?.beta,
        price: market.marketData?.currentPrice,
        lastDiv: market.marketData?.dividendYield
          ? market.marketData.dividendYield * market.marketData.currentPrice
          : 0,
      },
      earningsData: (market.earningsData || []).map((e) => ({
        actualEarningResult: e.earnings,
        date: e.year,
      })),
    };

    const marketData = processStockData(responseData);

    // ---------------- REVENUE TRENDS ----------------
    const incomeStatement = financialsApi.data?.income_statement || {};

    const annualData = incomeStatement || {};

    const revenueTrends = Object.entries(annualData).map(([date, values]) => {
      const revenue = values?.["Total Revenue"];

      return {
        date: new Date(date),
        open: revenue,
        high: revenue,
        low: revenue,
        close: revenue,
      };
    });

    const sortedRevenueTrends = revenueTrends.sort((a, b) => b.date - a.date);

    // ---------------- PROFITABILITY ----------------
    const latestEntry = Object.entries(incomeStatement)[0];

    let profitability = null;

    if (latestEntry) {
      const [date, values] = latestEntry;

      const revenue = Number(values?.["Total Revenue"]);
      const netIncome = Number(values?.["Net Income"]);
      const grossProfit = Number(values?.["Gross Profit"]);

      profitability = {
        revenue: isFinite(revenue) ? revenue : null,
        netIncome: isFinite(netIncome) ? netIncome : null,
        grossMargin:
          isFinite(grossProfit) && isFinite(revenue) && revenue !== 0
            ? grossProfit / revenue
            : null,
        netMargin:
          isFinite(netIncome) && isFinite(revenue) && revenue !== 0
            ? netIncome / revenue
            : null,
      };
    }

    // ---------------- LIQUIDITY ----------------
    const balanceSheet = financialsApi.data?.balance_sheet || {};

    const latestBalanceEntry = Object.entries(balanceSheet)[0];

    let liquidity = null;

    if (latestBalanceEntry) {
      const [date, values] = latestBalanceEntry;

      const currentAssets = Number(values?.["Total Current Assets"]);
      const currentLiabilities = Number(values?.["Total Current Liabilities"]);
      const totalLiabilities = Number(values?.["Total Liabilities"]);
      const equity = Number(values?.["Total Stockholder Equity"]);
      const cash = Number(values?.["Cash And Cash Equivalents"]);
      const totalDebt = Number(values?.["Total Debt"]);

      liquidity = {
        currentRatio:
          isFinite(currentAssets) &&
          isFinite(currentLiabilities) &&
          currentLiabilities !== 0
            ? currentAssets / currentLiabilities
            : null,

        debtEquity:
          isFinite(totalLiabilities) && isFinite(equity) && equity !== 0
            ? totalLiabilities / equity
            : null,

        cash: isFinite(cash) ? cash : null,
        totalDebt: isFinite(totalDebt) ? totalDebt : null,
      };
    }

    // ---------------- EARNINGS ----------------
    const earningsList = responseData.earningsData || [];

    const latestEarnings = earningsList[0];

    let earnings = null;

    if (latestEarnings) {
      earnings = {
        revenue: null, // Yahoo earnings API usually doesn’t include revenue
        netIncome: null,
        eps: isFinite(latestEarnings.actualEarningResult)
          ? latestEarnings.actualEarningResult
          : null,
        reportDate: latestEarnings.date || null,
      };
    }

    return new Response(
      JSON.stringify({
        marketData,
        revenueTrends: sortedRevenueTrends,
        profitability,
        liquidity,
        earnings,
        stockPrices: responseData.stockPrices,
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching data:", error);

    return new Response(
      JSON.stringify({
        error: "Error fetching data",
        details: error.message,
      }),
      { status: 500 },
    );
  }
}

const processStockData = (data) => {
  const { stockPrices, marketData, earningsData } = data;

  // Market Data
  const marketCap = marketData?.mktCap || "N/A";
  const beta = marketData?.beta || "N/A";
  const peRatio =
    marketData?.price / (earningsData[0]?.actualEarningResult || 1);
  const dividend = marketData?.lastDiv || "N/A";
  const dividendYield =
    dividend && marketData?.price
      ? (dividend / marketData?.price) * 100
      : "N/A";

  // EPS from latest earnings
  const eps = earningsData[0]?.actualEarningResult || "N/A";

  // Next earnings date
  const nextEarningsDate = earningsData[0]?.date || "N/A";

  // Stock Prices Analysis
  const highestPrice = Math.max(...stockPrices.map((s) => s.high));
  const lowestPrice = Math.min(...stockPrices.map((s) => s.low));
  const averagePrice =
    stockPrices.reduce((sum, s) => sum + s.close, 0) / stockPrices.length;
  const changePercent = stockPrices[0]?.changePercent || "N/A";

  return {
    marketCap,
    beta,
    peRatio,
    dividend,
    dividendYield,
    eps,
    nextEarningsDate,
    highestPrice,
    lowestPrice,
    averagePrice,
    changePercent,
  };
};
