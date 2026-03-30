import yahooFinance from 'yahoo-finance2';

export async function GET(req) {
  const symbol = req.nextUrl.searchParams.get('symbol'); // Example: AAPL

  if (!symbol) {
    return new Response(JSON.stringify({ error: 'Symbol is required' }), { status: 400 });
  }

  try {
    // Fetch all relevant data
    const data = await yahooFinance.quoteSummary(symbol, {
      modules: [
        'incomeStatementHistory',
        'balanceSheetHistory',
        'cashflowStatementHistory',
        'earnings',
        'earningsHistory',
        'earningsTrend',
        'price',
        'defaultKeyStatistics',
        'financialData',
        'calendarEvents'
      ],
    });
  
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error('Error fetching financial data:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), { status: 500 });
  }
}
