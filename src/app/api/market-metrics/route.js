const api_key = 'aRERui6AsbhMhKc5dKhCmvgQCKpbgjBI';


export async function POST(req) {

  const { companies } = await req.json();

  console.log("companies",companies);
  if (!companies?.length) {
    return NextResponse.json({ error: 'Company is required' }, { status: 400 });
  }

  const symbol = companies[0];
  const apiKey = api_key;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key is missing' }), { status: 400 });
  }

  try {
    // Fetch historical stock prices
    const stockPriceRes = await fetch(
      `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?apikey=${apiKey}`
    );
    const stockPriceData = await stockPriceRes.json();

    // Fetch company financial data
    const financialsRes = await fetch(
      `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${apiKey}`
    );
    const financialsData = await financialsRes.json();

    // Fetch earnings data
    const earningsRes = await fetch(
      `https://financialmodelingprep.com/api/v3/earnings-surprises/${symbol}?apikey=${apiKey}`
    );
    const earningsData = await earningsRes.json();

    const revenueTrends = await fetch(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?apikey=${apiKey}`);

    const revenueTrendsData = await revenueTrends.json();


    const revenueTrend = revenueTrendsData.map(entry => ({
      year: entry.calendarYear,
      period: entry.period,
      revenue: entry.revenue
    }));
    const sortedRevenueTrends = revenueTrend.sort((a, b) => b.year - a.year);


    const formattedData = sortedRevenueTrends.map(item => {
      // Convert year to Date object
      const date = new Date(`${item.year}-12-31`);

      // Convert revenue from string to number
      let revenue = parseFloat(item.revenue.toString().replace(/[BM]/, ''));
      if (item.revenue.toString().includes('B')) {
        revenue *= 1_000_000_000; // Convert from billions to actual number
      } else if (item.revenue.toString().includes('M')) {
        revenue *= 1_000_000; // Convert from millions to actual number
      }

      return {
        date,
        open: revenue,
        high: revenue,
        low: revenue,
        close: revenue,
      };
    });




    if (!stockPriceData || !financialsData || !earningsData) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch data' }),
        { status: 500 }
      );
    }

    const responseData = {
      stockPrices: stockPriceData.historical?.slice(0, 16) || [],
      marketData: financialsData[0] || {},
      earningsData: earningsData.slice(0, 4) || [],
    };
    const marketData = processStockData(responseData);

    return new Response(JSON.stringify({ marketData, revenueTrends: formattedData }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Error fetching data', details: error.message }),
      { status: 500 }
    );
  }
}


const processStockData = (data) => {
  const { stockPrices, marketData, earningsData } = data;

  // Market Data
  const marketCap = marketData?.mktCap || 'N/A';
  const beta = marketData?.beta || 'N/A';
  const peRatio = marketData?.price / (earningsData[0]?.actualEarningResult || 1);
  const dividend = marketData?.lastDiv || 'N/A';
  const dividendYield = dividend && marketData?.price ? (dividend / marketData?.price) * 100 : 'N/A';

  // EPS from latest earnings
  const eps = earningsData[0]?.actualEarningResult || 'N/A';

  // Next earnings date
  const nextEarningsDate = earningsData[0]?.date || 'N/A';

  // Stock Prices Analysis
  const highestPrice = Math.max(...stockPrices.map(s => s.high));
  const lowestPrice = Math.min(...stockPrices.map(s => s.low));
  const averagePrice = stockPrices.reduce((sum, s) => sum + s.close, 0) / stockPrices.length;
  const changePercent = stockPrices[0]?.changePercent || 'N/A';



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

