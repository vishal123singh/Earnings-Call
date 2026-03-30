"use client";

import { Card, CardContent } from "@/components/ui/card";
import { JSX, useEffect, useState } from "react";

// Load charts dynamically after the component is mounted
let IgrFinancialChart: JSX.IntrinsicAttributes;
let IgrFinancialChartModule;

if (typeof window !== "undefined") {
  // Import the chart only in the browser
  const igniteModule = require("igniteui-react-charts");
  IgrFinancialChart = igniteModule.IgrFinancialChart;
  IgrFinancialChartModule = igniteModule.IgrFinancialChartModule;
  IgrFinancialChartModule.register();
}

function MarketMetrics({ financialMetricsData, isLoading }: any) {
  const [marketData, setMarketData] = useState({});
  const [revenueTrends, setRevenueTrends] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    if (financialMetricsData?.marketData) {
      setMarketData(financialMetricsData?.marketData);
    } else {
      setMarketData({});
    }
    if (financialMetricsData?.revenueTrends) {
      setRevenueTrends(financialMetricsData?.revenueTrends);
    } else {
      setRevenueTrends([]);
    }
  }, [financialMetricsData]);

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 text-gray-800 shadow-lg rounded-3xl p-6 border border-gray-100 transition-all hover:shadow-xl">
      {/* Financial Stock Chart */}
      <CardContent className="w-full h-72 bg-white border border-gray-100 rounded-xl shadow-sm">
        {isClient && revenueTrends.length > 0 && IgrFinancialChart ? (
          <IgrFinancialChart
            width="100%"
            height="100%"
            dataSource={revenueTrends}
            chartTitle="📈 Revenue Trends"
            chartType="Line"
            isToolbarVisible={false}
            brushes={["#8B5CF6"]}
            outlines={["#8B5CF6"]}
            negativeOutlines={["#F43F5E"]}
            zoomSliderType="None"
            xAxisLabelTextColor="#6B7280"
            yAxisLabelTextColor="#6B7280"
            xAxisMajorStroke="#E5E7EB"
            yAxisMajorStroke="#E5E7EB"
          />
        ) : (
          <div className="flex justify-center items-center h-full text-gray-400">
              {isClient ? "No revenue trends data available." : "Loading chart..."}
          </div>
        )}
      </CardContent>

      {/* Market Data Section */}
      {Object.keys(marketData).length > 0 ? (
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 text-sm">
          {[
            { label: "🏢 Market Cap", value: marketData?.marketCap?.toLocaleString() || "N/A" },
            { label: "📊 Beta", value: marketData?.beta ?? "N/A" },
            { label: "💹 P/E Ratio", value: marketData?.peRatio?.toFixed(2) || "N/A" },
            { label: "💸 Dividend", value: marketData?.dividend || "N/A" },
            { label: "📈 Dividend Yield", value: marketData?.dividendYield ?? "N/A" },
            { label: "📚 EPS", value: marketData?.eps?.toFixed(2) || "N/A" },
            { label: "🗓️ Next Earnings Date", value: marketData?.nextEarningsDate || "N/A" },
            { label: "🚀 Highest Price", value: marketData?.highestPrice?.toFixed(2) || "N/A" },
            { label: "📉 Lowest Price", value: marketData?.lowestPrice?.toFixed(2) || "N/A" },
            { label: "⚖️ Average Price", value: marketData?.averagePrice?.toFixed(2) || "N/A" },
            {
              label: "📊 Change Percent",
              value: marketData?.changePercent
                ? `${(marketData?.changePercent * 100).toFixed(2)}%`
                : "N/A",
            },
          ].map((data, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-white border border-gray-100 p-3 rounded-lg shadow-sm transition-all hover:shadow-md"
            >
              <span className="text-gray-500 font-medium">{data.label}:</span>
              <span
                className={`text-sm font-semibold ${data.label === "📊 Change Percent"
                    ? parseFloat(data.value) > 0
                      ? "text-green-500"
                      : "text-red-500"
                    : "text-gray-700"
                  }`}
              >
                {data.value}
              </span>
            </div>
          ))}
        </CardContent>
      ) : (
          <div className="text-gray-400 text-center mt-6">
            🚫 No market data available.
        </div>
      )}
    </Card>
  );
}

export default MarketMetrics;
