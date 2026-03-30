"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";

function FinancialMetrics() {
  const [earningsMetrics, setEarningsMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const earningsData = useSelector((state) => state?.sidebar?.earningsData);

const selectedYear = useSelector((state) => state.sidebar.selectedYear);
const selectedQuarter = useSelector((state) => state.sidebar.selectedQuarter);

const quartersMapping = { "1st": 1, "2nd": 2, "3rd": 3, "4th": 4 };

// ✅ Ensure window is available after mount
useEffect(() => {
  setIsClient(true);
  setIsLoading(true);

  // Extract the earnings data for display
  const data = extractEarnings(
    earningsData?.earningsHistory,
    selectedYear,
    quartersMapping[selectedQuarter],
  );

  if (data) {
    setEarningsMetrics([
      {
        name: `Q${Math.ceil((new Date(data.quarter).getMonth() + 1) / 3)}`,
        value: data.epsActual,
        estimate: data.epsEstimate,
        difference: data.epsDifference,
        surprisePercent: (data.surprisePercent * 100).toFixed(2) + "%",
        currency: data.currency,
      },
    ]);
  } else {
    setEarningsMetrics([]);
  }

  setIsLoading(false);
}, []);

if (!earningsMetrics && !earningsMetrics?.length > 0) {
  return null;
}
return (
  <Card className="bg-gradient-to-br from-purple-50 to-pink-50 text-gray-800 shadow-lg rounded-3xl p-8 border border-gray-100 transition-all hover:shadow-xl">
    {/* Header Section */}
    <CardHeader className="pb-6 border-b border-gray-200">
      <CardTitle className="text-3xl font-extrabold text-gray-700 tracking-wide">
        📊 Financial Metrics
      </CardTitle>
    </CardHeader>

    {/* Content Section */}
    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 text-base mt-6">
      {/* Metrics Section */}
      <div className="space-y-4">
        {isLoading ? (
          <p className="text-gray-500 text-lg animate-pulse">Loading data...</p>
        ) : earningsMetrics && earningsMetrics.length > 0 ? (
          earningsMetrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl p-4 border border-gray-100 hover:shadow-lg transition-all"
            >
              <div className="grid grid-cols-2 gap-2">
                <div className="text-gray-500 font-medium">Quarter:</div>
                <div className="text-gray-800 font-bold">{metric.name}</div>

                <div className="text-gray-500 font-medium">EPS Actual:</div>
                <div className="text-purple-600 font-bold">
                  {metric.value} {metric.currency}
                </div>

                <div className="text-gray-500 font-medium">EPS Estimate:</div>
                <div className="text-gray-800 font-bold">
                  {metric.estimate} {metric.currency}
                </div>

                <div className="text-gray-500 font-medium">Difference:</div>
                <div
                  className={`font-bold ${
                    metric.difference > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {metric.difference} {metric.currency}
                </div>

                <div className="text-gray-500 font-medium">
                  Surprise Percent:
                </div>
                <div
                  className={`font-bold ${
                    parseFloat(metric.surprisePercent) > 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {metric.surprisePercent}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-lg">🚫 No data available.</p>
        )}
      </div>

      {/* Chart Section */}
      {/* <div className="w-full h-72 bg-white rounded-xl shadow-md border border-gray-100">
          {isLoading ? (
            <div className="flex justify-center items-center h-full text-gray-400">
              📊 Loading chart...
            </div>
          ) : isClient && earningsMetrics && earningsMetrics.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsMetrics} barSize={30}>
                <XAxis
                  dataKey="name"
                  tick={{
                    fill: "#4B5563",
                    fontSize: 14,
                    fontWeight: "500",
                  }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fill: "#4B5563",
                    fontSize: 14,
                    fontWeight: "500",
                  }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                  domain={[0, "auto"]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#F9FAFB",
                    color: "#4B5563",
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  cursor={{ fill: "#E5E7EB" }}
                />
                <Bar
                  dataKey="value"
                  fill="url(#purpleGradient)"
                  radius={[12, 12, 0, 0]}
                />
                <defs>
                  <linearGradient
                    id="purpleGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#A855F7" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-full text-gray-400">
              🚫 No data available for chart.
            </div>
          )}
        </div> */}
    </CardContent>
  </Card>
);
}

// ✅ Extract earnings data for the selected quarter and year
const extractEarnings = (earningsHistory, targetYear, targetQuarter) => {
  if (!earningsHistory?.history) return null;

  return (
    earningsHistory.history.find((entry) => {
      const date = new Date(entry.quarter);
      const year = date.getFullYear();
      const quarter = Math.ceil((date.getMonth() + 1) / 3);
      return year === targetYear && quarter === targetQuarter;
    }) || null
  );
};

export default FinancialMetrics;
