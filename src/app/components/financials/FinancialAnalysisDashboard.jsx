// components/FinancialAnalysisDashboard.jsx
import React, { useEffect, useRef } from "react";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Expand, ChevronDown, ChevronUp, X } from "lucide-react";
import ChatBox from "./chatbox";
import PropTypes from "prop-types";
import { setFilterConfig } from "../../../../store/sidebarSlice";
import { quarters, companies, years } from "../../../../public/data";
import ChartContainer from "./ChartContainer";
import MemoizedChatPanel from "./MemoizedChatPanel";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
);

const graphRequirements = {
  "Revenue Trend": {
    statements: ["incomeStatement"],
    metrics: ["Total Revenue"],
  },
  "Net Income Comparison": {
    statements: ["incomeStatement"],
    metrics: ["Net Income Common Stockholders"],
  },
  "Asset Composition": {
    statements: ["balanceSheet"],
    metrics: [
      "Cash, Cash Equivalents & Federal Funds Sold",
      "Net Loan",
      "Securities and Investments",
      "Net PPE",
    ],
  },
  "Debt-to-Equity Ratio": {
    statements: ["balanceSheet"],
    metrics: ["Total Debt", "Total Equity Gross Minority Interest"],
  },
  "Loan Portfolio Growth": {
    statements: ["balanceSheet"],
    metrics: ["Gross Loan"],
  },
  "Interest Income vs Expense": {
    statements: ["incomeStatement"],
    metrics: ["Interest Income", "Interest Expense"],
  },
  "Operating Cash Flow": {
    statements: ["cashFlow"],
    metrics: ["Operating Cash Flow"],
  },
  "EPS Comparison": {
    statements: ["incomeStatement"],
    metrics: ["Basic EPS", "Diluted EPS"],
  },
  "Efficiency Ratio": {
    statements: ["incomeStatement"],
    metrics: ["Non Interest Expense", "Total Revenue"],
  },
  "Deposit Growth": {
    statements: ["balanceSheet"],
    metrics: ["Total Deposits"],
  },
};

const FinancialAnalysisDashboard = ({
  financialState,
  setFinancialState,
  chatState,
  setChatState,
}) => {
  const {
    selectedGraph,
    graphPrompt,
    isLoading,
    graphData,
    periodType,
    error,
    companyData,
    isDrawerOpen,
    isChatOpen,
  } = financialState;

  const setGraphState = (updates) => {
    setFinancialState((prev) => ({ ...prev, ...updates }));
  };

  const chatBoxRef = useRef(null);

  const selectedCompanies = useSelector(
    (state) => state.sidebar.selectedCompanies,
  );
  const selectedYear = useSelector((state) => state.sidebar.selectedYear);
  const selectedQuarter = useSelector((state) => state.sidebar.selectedQuarter);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setFilterConfig({
        companies: companies,
        years: [2021, 2022, 2023, 2024],
        quarters: quarters,
        selectProps: {
          companies: {
            isMulti: true,
            maxSelected: 5,
            placeholder: "Select companies (max 5)",
          },
          years: { isMulti: true, placeholder: "Select years" },
          quarters: { isMulti: true, placeholder: "Select quarters" },
          persona: { isMulti: false, placeholder: "Select persona" },
          model: { isMulti: false, placeholder: "Select model" },
        },
      }),
    );
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const newData = {};
      for (const ticker of selectedCompanies) {
        if (!companyData[ticker]) {
          const data = await fetchCompanyData(ticker);
          newData[ticker] = data;
        }
      }
      setGraphState({ companyData: { ...companyData, ...newData } });
    };

    if (selectedCompanies.length > 0) {
      loadData();
    }
  }, [selectedCompanies]);

  const fetchCompanyData = async (ticker) => {
    try {
      const response = await fetch(`/api/scrape-yf?ticker=${ticker}`);
      if (!response.ok) throw new Error("Failed to fetch data");
      return await response.json();
    } catch (err) {
      console.error("Error:", err);
      return null;
    }
  };

  const prepareCompanyDataForGraph = (ticker) => {
    if (!selectedGraph || !companyData[ticker] || !companyData[ticker].data) {
      return null;
    }

    const requirements = graphRequirements[selectedGraph];
    const preparedData = {};

    requirements.statements.forEach((statementType) => {
      if (companyData[ticker].data[statementType]?.[periodType]) {
        preparedData[statementType] = {
          [periodType]: {
            headers:
              companyData[ticker].data[statementType][periodType].headers,
            rows: companyData[ticker].data[statementType][periodType],
          },
        };
      }
    });

    return preparedData;
  };

  // Compute whether all selected companies have data loaded
  const canGenerateGraph =
    selectedCompanies.length > 0 &&
    selectedCompanies.every((ticker) => companyData[ticker]);

  const generateGraph = async () => {
    // Prevent graph generation if company data is not fully loaded
    if (!canGenerateGraph) return;
    if (!selectedGraph || selectedCompanies.length === 0) return;

    setGraphState({ isLoading: true, error: null });
    try {
      const filteredCompanyData = {};
      for (const ticker of selectedCompanies) {
        const preparedData = prepareCompanyDataForGraph(ticker);
        if (preparedData) {
          filteredCompanyData[ticker] = preparedData;
        }
      }

      const response = await fetch("/api/generate-chart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companies: selectedCompanies,
          years: selectedYear,
          quarters: selectedQuarter,
          graphType: selectedGraph,
          prompt: graphPrompt,
          companyData: filteredCompanyData,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate chart");
      const result = await response.json();

      if (result.type === "chart_update" && result.data) {
        setGraphState({ graphData: result.data });
      } else {
        throw new Error("Invalid chart data format received");
      }
    } catch (err) {
      console.error("Error generating graph:", err);
      setGraphState({ error: err.message, graphData: null });
    } finally {
      setGraphState({ isLoading: false });
    }
  };

  const handleChartUpdate = async (newGraphData) => {
    setGraphState({ graphData: newGraphData });
  };

  const ChartErrorBoundary = ({ children }) => {
    try {
      return children;
    } catch (err) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-red-500">
            <p>Chart rendering failed</p>
            <p className="text-sm">{err.message}</p>
          </div>
        </div>
      );
    }
  };

  const renderChart = () => {
    if (!graphData?.data?.datasets) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p>{error || "No chart data available"}</p>
          </div>
        </div>
      );
    }

    return (
      <ChartErrorBoundary>
        {graphData.chartType === "line" && (
          <Line data={graphData.data} options={graphData.options} />
        )}
        {graphData.chartType === "bar" && (
          <Bar data={graphData.data} options={graphData.options} />
        )}
        {graphData.chartType === "pie" && (
          <Pie data={graphData.data} options={graphData.options} />
        )}
        {graphData.chartType === "doughnut" && (
          <Doughnut data={graphData.data} options={graphData.options} />
        )}
      </ChartErrorBoundary>
    );
  };

  return (
    <div className="container mx-auto p-2 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Configuration Panel */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
          <div className="space-y-6">
            <div className="space-y-2 z-[20]">
              <label className="block text-sm font-medium text-gray-700">
                Graph Type
              </label>
              <Select
                value={selectedGraph}
                onValueChange={(val) => setGraphState({ selectedGraph: val })}
              >
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="Select a graph type" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-md shadow-lg border border-gray-200">
                  {Object.keys(graphRequirements).map((type) => (
                    <SelectItem
                      key={type}
                      value={type}
                      className="hover:bg-gray-50 cursor-pointer px-4 py-2"
                    >
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Period Type
              </label>
              <Select
                value={periodType}
                onValueChange={(val) => setGraphState({ periodType: val })}
              >
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="Select period type" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-md shadow-lg border border-gray-200">
                  <SelectItem
                    value="annual"
                    className="hover:bg-gray-50 cursor-pointer px-4 py-2"
                  >
                    Annual
                  </SelectItem>
                  <SelectItem
                    value="quarterly"
                    className="hover:bg-gray-50 cursor-pointer px-4 py-2"
                  >
                    Quarterly
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedGraph && (
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Customize your graph request
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="E.g., 'Compare quarterly revenue growth'"
                    value={graphPrompt}
                    onChange={(e) =>
                      setGraphState({ graphPrompt: e.target.value })
                    }
                  />
                </div>

                <button
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    isLoading || !canGenerateGraph
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg"
                  }`}
                  onClick={generateGraph}
                  disabled={isLoading || !canGenerateGraph}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-current"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating...
                    </span>
                  ) : !canGenerateGraph && selectedCompanies.length ? (
                    <span className="flex items-center justify-center gap-2">
                      {/* indicator that company data is still loading */}
                      <svg
                        className="animate-spin h-4 w-4 text-current"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Waiting for company data...
                    </span>
                  ) : (
                    "Generate Graph"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side Container */}
        <div className="space-y-4 relative z-10 bg-white p-2 rounded-md">
          <div className="mb-6">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="animate-spin h-10 w-10 text-purple-600 mx-auto"
                    xmlns="http://www.w3.org/2000/svg"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <p className="mt-3 text-gray-600 font-medium">
                    Generating visualization...
                  </p>
                </div>
              </div>
            ) : (
             <>
                <div className="relative">
                  {graphData && (
                    <button
                      className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                      onClick={() => setGraphState({ isDrawerOpen: true })}
                      aria-label="Expand graph"
                    >
                      <Expand className="w-5 h-5 text-gray-600" />
                    </button>
                  )}
                </div>
                  <div className="w-full h-96 flex items-center justify-center">
                    <div className="w-full h-full relative">
                      <ChartContainer graphData={graphData} />
                    </div>
                  </div>

                {graphData?.analysis && (
                  <div className="mt-2">
                    <h3 className="text-md font-semibold text-gray-800 mb-3">
                      Analysis
                    </h3>
                    <div className="bg-gray-50/50 p-5 rounded-lg border border-gray-200">
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {graphData.analysis}
                      </p>
                    </div>
                  </div>
                )}
              </>

            )}
          </div>

          {/* Chat Container */}
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            initial={false}
            animate={{ height: isChatOpen ? "auto" : "48px" }}
            transition={{ type: "spring", damping: 25 }}
          >
            <button
              className="w-full text-left font-medium text-gray-700 p-3 flex items-center justify-between"
              onClick={() => setGraphState({ isChatOpen: !isChatOpen })}
            >
              <span>Chat about this analysis</span>
              {isChatOpen ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              )}
            </button>

            <AnimatePresence>
              {isChatOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChatBox
                    ref={chatBoxRef}
                    context={{
                      graphType: selectedGraph,
                      graphData: graphData,
                      companies: selectedCompanies,
                      periodType: periodType,
                      companyData: companyData,
                    }}
                    chatState={chatState}
                    setChatState={setChatState}
                    onChartUpdate={handleChartUpdate}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Expanded View Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 w-full max-w-4xl bg-white shadow-xl z-[5000] flex"
          >
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold">Detailed Analysis</h2>
                <button
                  onClick={() => setGraphState({ isDrawerOpen: false })}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 flex overflow-hidden">
                {/* Graph Panel */}
                <div className="flex-1 p-4 overflow-auto">
                  {graphData && (
                    <>
                      <div className="mb-4">
                        <ChartErrorBoundary>
                          <ChartContainer graphData={graphData} />
                        </ChartErrorBoundary>
                      </div>
                      <div className="mt-2">
                        <h3 className="text-md font-semibold text-gray-800 mb-3">
                          Analysis
                        </h3>
                        <div className="bg-gray-50/50 p-5 rounded-lg border border-gray-200">
                          <p className="text-gray-700 leading-relaxed text-sm">
                            {graphData.analysis}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Chat Panel */}
                <div className="w-96 border-l border-gray-200 flex flex-col">
                  <div className="p-4 border-b">
                    <h3 className="font-medium">Chat with AI Analyst</h3>
                    <p className="text-sm text-gray-500">
                      Ask questions or request chart modifications
                    </p>
                  </div>
                  <MemoizedChatPanel
                    context={{
                      graphType: selectedGraph,
                      graphData: graphData,
                      companies: selectedCompanies,
                      periodType: periodType,
                      companyData: companyData,
                    }}
                    chatState={chatState}
                    setChatState={setChatState}
                    onChartUpdate={handleChartUpdate}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

FinancialAnalysisDashboard.propTypes = {
  financialState: PropTypes.shape({
    selectedGraph: PropTypes.string,
    graphPrompt: PropTypes.string,
    isLoading: PropTypes.bool,
    graphData: PropTypes.object,
    periodType: PropTypes.string,
    error: PropTypes.string,
    companyData: PropTypes.object,
    isDrawerOpen: PropTypes.bool,
    isChatOpen: PropTypes.bool,
  }).isRequired,
  setFinancialState: PropTypes.func.isRequired,
  chatState: PropTypes.shape({
    messages: PropTypes.array,
    inputMessage: PropTypes.string,
    isWaitingForResponse: PropTypes.bool,
  }).isRequired,
  setChatState: PropTypes.func.isRequired,
};

export default FinancialAnalysisDashboard;
