"use client";

import { useRef, useState } from "react";
import DynamicChart from "./dynamicChart";
import { useSelector } from "react-redux";

const SUGGESTIONS = [
  "Revenue over the last 5 years",
  "Profit margin",
  "Cash flow variation by quarter",
  "Earnings per share (EPS) growth rate",
  "Debt-to-equity ratio analysis",
  "Operating income vs. net income",
  "Quarterly dividend payout trends",
  "Return on equity (ROE) comparison",
  "Gross margin trend over time",
  "Year-over-year revenue growth",
  "Free cash flow analysis",
  "Interest expense as a percentage of revenue",
  "Net profit margin variation by quarter",
  "Impact of foreign exchange rates on revenue",
  "Working capital trend analysis",
  "Cost of goods sold (COGS) comparison",
  "Capital expenditure (CapEx) trend",
  "Long-term vs. short-term debt structure",
  "Inventory turnover rate analysis",
  "EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization) trends",
];

const Spinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-600"></div>
  </div>
);

const ChartCreator = ({
  chartData,
  setChartData,
  userPrompts,
  setUserPrompts,
}) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const selectedCompanies = useSelector(
    (state) => state.sidebar.selectedCompanies,
  );
  const selectedYear = useSelector((state) => state.sidebar.selectedYear);
  const selectedQuarter = useSelector((state) => state.sidebar.selectedQuarter);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleGenerateChart = async () => {
    try {
      if (!prompt.trim()) return;
      if (!selectedCompanies?.length) {
        alert("Please select at least one company.");
        return;
      }
      if (!selectedYear) {
        alert("Please select a year.");
        return;
      }
      if (!selectedQuarter) {
        alert("Please select a quarter.");
        return;
      }
      let length = chartData.length;
      setChartData((prev) => [
        {
          role: "user",
          content: prompt,
        },
      ]);
      setUserPrompts((prev) => [
        ...prev,
        {
          role: "user",
          content: prompt,
        },
      ]);
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
      setIsLoading(true);
      const response = await fetch("/api/charts-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          companies: selectedCompanies,
          chartData,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      // setChartData((prev) => {
      //   let temp = [];
      //   if (prev.length > 0) {
      //     temp = [...prev];
      //   }
      //   // if (Array.isArray(data.data)) {
      //   //   temp.unshift(...data.data); // Spread array items
      //   // } else {
      //   //   temp.unshift({ role: "assistant", content: data.data }); // Add single object
      //   // }
      //   return temp;
      // });

      setChartData((prev) => {
        let temp = [...prev];
        temp.push({
          role: "assistant",
          content: data.data,
        });
        return temp;
      });

      setIsLoading(false);
      scrollToBottom();
      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        <div className="flex flex-col space-y-4 h-[100%]">
          <div className="flex-grow max-h-[50vh] overflow-y-auto border border-gray-200 bg-gradient-to-br from-white to-purple-50 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex flex-wrap gap-3 max-w-full overflow-hidden">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setPrompt(suggestion)}
                  className="px-4 py-2 text-sm text-gray-700 bg-gradient-to-r from-gray-100 to-white border border-gray-300 rounded-full shadow-md hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-400 hover:text-white transition-all duration-300"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
          <form
            className="w-full bg-gradient-to-r from-white to-purple-50 p-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerateChart();
            }}
          >
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
              <input
                type="text"
                placeholder="Enter chart prompt..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 placeholder-gray-400 shadow-sm"
              />

              <button
                type="submit"
                className={`px-6 py-3 text-white rounded-lg transition-all duration-300 ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400"
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v2a6 6 0 00-6 6H4z"
                      />
                    </svg>
                    <span>Generating...</span>
                  </div>
                ) : (
                  "Generate"
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col border border-gray-200 rounded-2xl p-4 h-[60vh] overflow-y-auto bg-gradient-to-br from-white to-purple-50 shadow-sm hover:shadow-lg transition-all duration-300">
          {/* <div ref={messagesEndRef} /> */}
          {isLoading && (
            <div className="absolute z-[50] flex my-4 self-center">
              <Spinner />
            </div>
          )}
          {chartData?.length > 0 ? (
            chartData?.map((chart, index) => (
              <div key={index} className="mb-6">
                {chart.role === "user" ? (
                  chart.content
                ) : (
                  <DynamicChart
                    chartId={index}
                    data={chart.content.chartData}
                    chartType={chart.content.chartType}
                    chartTitle={chart.content.title}
                    chartInsights={chart.content.insights}
                    chartData={chartData}
                    setChartData={setChartData}
                    userPrompts={userPrompts}
                    setUserPrompts={setUserPrompts}
                  />
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No charts generated yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartCreator;
