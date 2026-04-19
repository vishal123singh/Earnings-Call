// components/FinancialAnalysisDashboard.jsx
import React, { useEffect, useRef, useState } from "react";
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
  Filler,
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
import {
  Expand,
  ChevronDown,
  ChevronUp,
  X,
  TrendingUp,
  BarChart3,
  PieChart,
  Loader2,
  Sparkles,
  MessageCircle,
  Maximize2,
  Download,
  RefreshCw,
  Menu,
} from "lucide-react";
import ChatBox from "./chatbox";
import PropTypes from "prop-types";
import { setFilterConfig } from "../../../../store/sidebarSlice";
import { quarters, companies, years } from "../../../../public/data";
import ChartContainer from "./ChartContainer";
import MemoizedChatPanel from "./MemoizedChatPanel";

// Register ChartJS components
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
  Filler,
);

const graphRequirements = {
  "Revenue Trend": {
    statements: ["incomeStatement"],
    metrics: ["Total Revenue"],
    icon: TrendingUp,
    color: "from-blue-500 to-cyan-500",
  },
  "Net Income Comparison": {
    statements: ["incomeStatement"],
    metrics: ["Net Income Common Stockholders"],
    icon: BarChart3,
    color: "from-green-500 to-emerald-500",
  },
  "Asset Composition": {
    statements: ["balanceSheet"],
    metrics: [
      "Cash, Cash Equivalents & Federal Funds Sold",
      "Net Loan",
      "Securities and Investments",
      "Net PPE",
    ],
    icon: PieChart,
    color: "from-purple-500 to-pink-500",
  },
  "Debt-to-Equity Ratio": {
    statements: ["balanceSheet"],
    metrics: ["Total Debt", "Total Equity Gross Minority Interest"],
    icon: BarChart3,
    color: "from-orange-500 to-red-500",
  },
  "Loan Portfolio Growth": {
    statements: ["balanceSheet"],
    metrics: ["Gross Loan"],
    icon: TrendingUp,
    color: "from-teal-500 to-green-500",
  },
  "Interest Income vs Expense": {
    statements: ["incomeStatement"],
    metrics: ["Interest Income", "Interest Expense"],
    icon: BarChart3,
    color: "from-indigo-500 to-blue-500",
  },
  "Operating Cash Flow": {
    statements: ["cashFlow"],
    metrics: ["Operating Cash Flow"],
    icon: TrendingUp,
    color: "from-cyan-500 to-blue-500",
  },
  "EPS Comparison": {
    statements: ["incomeStatement"],
    metrics: ["Basic EPS", "Diluted EPS"],
    icon: BarChart3,
    color: "from-violet-500 to-purple-500",
  },
  "Efficiency Ratio": {
    statements: ["incomeStatement"],
    metrics: ["Non Interest Expense", "Total Revenue"],
    icon: PieChart,
    color: "from-rose-500 to-pink-500",
  },
  "Deposit Growth": {
    statements: ["balanceSheet"],
    metrics: ["Total Deposits"],
    icon: TrendingUp,
    color: "from-amber-500 to-orange-500",
  },
};

// Mobile Bottom Sheet Component
const MobileBottomSheet = ({ isOpen, onClose, children, title }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl z-50 lg:hidden max-h-[85vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Mobile Filter Drawer
const MobileFilterDrawer = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-gray-900 shadow-2xl z-50 lg:hidden overflow-y-auto"
          >
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Chart Configuration
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileChartOptionsOpen, setIsMobileChartOptionsOpen] =
    useState(false);

  const selectedCompanies = useSelector(
    (state) => state.sidebar.selectedCompanies,
  );
  const selectedYear = useSelector((state) => state.sidebar.selectedYear);
  const selectedQuarter = useSelector((state) => state.sidebar.selectedQuarter);

  const dispatch = useDispatch();

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
    if (!selectedGraph || !companyData[ticker]?.data) {
      return null;
    }

    const requirements = graphRequirements[selectedGraph];
    const preparedData = {};

    requirements.statements.forEach((statementType) => {
      let apiKey;
      switch (statementType) {
        case "incomeStatement":
          apiKey = "income_statement";
          break;
        case "balanceSheet":
          apiKey = "balance_sheet";
          break;
        case "cashFlow":
          apiKey = "cash_flow";
          break;
        default:
          apiKey = statementType;
      }

      if (companyData[ticker].data[apiKey] && periodType === "annual") {
        preparedData[statementType] = {
          [periodType]: companyData[ticker].data[apiKey],
        };
      }
    });

    return preparedData;
  };

  const canGenerateGraph =
    selectedCompanies.length > 0 &&
    selectedCompanies.every((ticker) => companyData[ticker]?.data);

  const generateGraph = async () => {
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
        // Close mobile filter after generation
        if (isMobile) setIsMobileFilterOpen(false);
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

  const currentGraphConfig = selectedGraph
    ? graphRequirements[selectedGraph]
    : null;

  // Configuration Panel Content
  const ConfigPanelContent = () => (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
          Chart Configuration
        </h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Graph Type
          </label>
          <Select
            value={selectedGraph}
            onValueChange={(val) => setGraphState({ selectedGraph: val })}
          >
            <SelectTrigger className="w-full h-11 sm:h-12 rounded-xl border-2 hover:border-blue-400 transition-colors text-sm sm:text-base">
              <SelectValue placeholder="Select a graph type" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              {Object.keys(graphRequirements).map((type) => {
                const config = graphRequirements[type];
                const Icon = config.icon;
                return (
                  <SelectItem
                    key={type}
                    value={type}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer px-4 py-2 sm:py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-1.5 rounded-lg bg-gradient-to-r ${config.color}`}
                      >
                        <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <span className="text-sm sm:text-base">{type}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Period Type
          </label>
          <Select
            value={periodType}
            onValueChange={(val) => setGraphState({ periodType: val })}
          >
            <SelectTrigger className="w-full h-11 sm:h-12 rounded-xl border-2 hover:border-blue-400 transition-colors">
              <SelectValue placeholder="Select period type" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <SelectItem value="annual" className="py-2 sm:py-3">
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg">📅</span>
                  <span>Annual</span>
                </div>
              </SelectItem>
              <SelectItem value="quarterly" className="py-2 sm:py-3">
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg">📊</span>
                  <span>Quarterly</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedGraph && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 pt-2"
          >
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Customize your graph request
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 transition-all"
                  placeholder="E.g., 'Compare quarterly revenue growth'"
                  value={graphPrompt}
                  onChange={(e) =>
                    setGraphState({ graphPrompt: e.target.value })
                  }
                />
                {graphPrompt && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                    {graphPrompt.length}
                  </div>
                )}
              </div>
            </div>

            <motion.button
              whileHover={
                !isLoading && canGenerateGraph && !isMobile
                  ? { scale: 1.02 }
                  : {}
              }
              whileTap={!isLoading && canGenerateGraph ? { scale: 0.98 } : {}}
              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all text-sm sm:text-base ${
                isLoading || !canGenerateGraph
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg active:shadow-md"
              }`}
              onClick={generateGraph}
              disabled={isLoading || !canGenerateGraph}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">Generating...</span>
                </span>
              ) : !canGenerateGraph && selectedCompanies.length ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">Loading Data...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Generate Graph</span>
                </span>
              )}
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
      >
        <ConfigPanelContent />
      </MobileFilterDrawer>

      {/* Mobile Chart Options Bottom Sheet */}
      <MobileBottomSheet
        isOpen={isMobileChartOptionsOpen}
        onClose={() => setIsMobileChartOptionsOpen(false)}
        title="Chart Options"
      >
        <div className="flex flex-col gap-3">
          {graphData && (
            <>
              <button
                onClick={() => {
                  setGraphState({ isDrawerOpen: true });
                  setIsMobileChartOptionsOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-100 dark:bg-gray-800 active:bg-gray-200"
              >
                <Maximize2 className="w-5 h-5 text-blue-600" />
                <span className="flex-1 text-left">Expand View</span>
              </button>
              <button
                onClick={() => {
                  setIsMobileChartOptionsOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-100 dark:bg-gray-800 active:bg-gray-200"
              >
                <Download className="w-5 h-5 text-green-600" />
                <span className="flex-1 text-left">Download Chart</span>
              </button>
              <button
                onClick={() => {
                  generateGraph();
                  setIsMobileChartOptionsOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-100 dark:bg-gray-800 active:bg-gray-200"
              >
                <RefreshCw className="w-5 h-5 text-purple-600" />
                <span className="flex-1 text-left">Refresh Data</span>
              </button>
            </>
          )}
        </div>
      </MobileBottomSheet>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {/* Mobile Header with Filter Button */}
        <div className="lg:hidden mb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Financial Analysis
            </h1>
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl active:scale-95 transition-transform"
            >
              <Menu size={18} />
              <span className="text-sm">Configure</span>
            </button>
          </div>
          {selectedGraph && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Current: {selectedGraph}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-start">
          {/* Configuration Panel - Desktop */}
          <div className="hidden lg:block bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 sticky top-4 overflow-hidden">
            <div className="p-5 lg:p-6">
              <ConfigPanelContent />
            </div>
          </div>

          {/* Right Side Container */}
          <div className="space-y-4 sm:space-y-6 relative z-10">
            {/* Chart Container */}
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    {currentGraphConfig && (
                      <div
                        className={`p-1.5 sm:p-2 rounded-lg bg-gradient-to-r ${currentGraphConfig.color}`}
                      >
                        {React.createElement(currentGraphConfig.icon, {
                          className: "w-4 h-4 sm:w-5 sm:h-5 text-white",
                        })}
                      </div>
                    )}
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">
                      {selectedGraph || "Select a graph to begin"}
                    </h3>
                  </div>

                  {/* Mobile Chart Options Button */}
                  {graphData && isMobile && (
                    <button
                      onClick={() => setIsMobileChartOptionsOpen(true)}
                      className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gray-100 dark:bg-gray-800 active:bg-gray-200"
                    >
                      <Maximize2 className="w-4 h-4" />
                      <span className="text-sm">Options</span>
                    </button>
                  )}

                  {/* Desktop Chart Actions */}
                  {graphData && !isMobile && (
                    <div className="hidden sm:flex gap-2">
                      <button
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setGraphState({ isDrawerOpen: true })}
                        aria-label="Expand graph"
                      >
                        <Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button
                        onClick={generateGraph}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  )}
                </div>

                {isLoading ? (
                  <div className="h-64 sm:h-80 lg:h-96 flex items-center justify-center">
                    <div className="text-center">
                      <div className="relative">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 animate-pulse" />
                        </div>
                      </div>
                      <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium text-sm sm:text-base">
                        Analyzing financial data...
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        This may take a few seconds
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="min-h-[300px] sm:min-h-[400px] lg:h-96 flex items-center justify-center">
                      <div className="w-full h-full relative">
                        {graphData ? (
                          <ChartContainer graphData={graphData} />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-center p-8">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                              <BarChart3 className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400">
                              Select a graph type and configure your settings
                            </p>
                            <p className="text-sm text-gray-400 mt-2">
                              Then click "Generate Graph" to visualize data
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {graphData?.analysis && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 sm:mt-6"
                      >
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 sm:p-5 rounded-xl border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center gap-2 mb-2 sm:mb-3">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                              AI Analysis
                            </h4>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-xs sm:text-sm">
                            {graphData.analysis}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Chat Container - Enhanced Mobile */}
            <motion.div
              className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
              initial={false}
              animate={{ height: isChatOpen ? "auto" : "56px" }}
              transition={{ type: "spring", damping: 25 }}
            >
              <button
                className="w-full text-left font-medium p-3 sm:p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors active:bg-gray-100"
                onClick={() => setGraphState({ isChatOpen: !isChatOpen })}
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                    Chat about this analysis
                  </span>
                </div>
                {isChatOpen ? (
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                ) : (
                  <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
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
                    <div className="border-t border-gray-200 dark:border-gray-700">
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
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Expanded View Drawer - Mobile Optimized */}
        <AnimatePresence>
          {isDrawerOpen && (
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-0 lg:inset-y-0 lg:right-0 w-full lg:max-w-5xl bg-white dark:bg-gray-900 shadow-2xl z-[5000] flex flex-col"
            >
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    {currentGraphConfig && (
                      <div
                        className={`p-1.5 sm:p-2 rounded-xl bg-gradient-to-r ${currentGraphConfig.color} flex-shrink-0`}
                      >
                        {React.createElement(currentGraphConfig.icon, {
                          className: "w-4 h-4 sm:w-5 sm:h-5 text-white",
                        })}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h2 className="text-base sm:text-xl font-bold text-gray-800 dark:text-gray-200 truncate">
                        {selectedGraph} Analysis
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1 hidden sm:block">
                        Detailed view with AI chat assistance
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setGraphState({ isDrawerOpen: false })}
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors active:bg-gray-200 flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                  {/* Graph Panel */}
                  <div className="flex-1 overflow-auto p-4 sm:p-6">
                    {graphData && (
                      <>
                        <div className="mb-4 sm:mb-6">
                          <ChartErrorBoundary>
                            <div className="min-h-[300px] sm:min-h-[400px]">
                              <ChartContainer graphData={graphData} />
                            </div>
                          </ChartErrorBoundary>
                        </div>
                        {graphData?.analysis && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 sm:mt-6"
                          >
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 sm:p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                                  AI Analysis
                                </h3>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-xs sm:text-sm">
                                {graphData.analysis}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Chat Panel - Mobile Optimized */}
                  <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 flex flex-col bg-gray-50 dark:bg-gray-950">
                    <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-800">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                        AI Financial Analyst
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Ask questions or request modifications
                      </p>
                    </div>
                    <div className="flex-1 overflow-hidden">
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
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
