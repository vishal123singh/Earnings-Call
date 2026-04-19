"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
  Loader,
  Briefcase,
  Filter,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// Individual Earnings Card Component - Mobile Optimized
const EarningsCard = ({ item }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md p-4 sm:p-5 border border-gray-100 active:bg-gray-50 transition-all duration-200"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-blue-600 line-clamp-1">
            {item.company}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            {item.symbol || item.ticker}
          </p>
        </div>
        <div className="px-2 py-1 bg-blue-50 rounded-lg">
          <span className="text-xs font-medium text-blue-600">Earnings</span>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <InfoRow
          label="Event"
          value={item.event || "N/A"}
          valueColor="text-pink-600"
        />
        <InfoRow
          label="Call Time"
          value={item.earningsCallTime || "N/A"}
          valueColor="text-pink-600"
        />
        <InfoRow
          label="EPS Estimate"
          value={item.epsEstimate || "N/A"}
          valueColor="text-purple-600"
        />
        <InfoRow
          label="EPS Reported"
          value={item.epsReported || "N/A"}
          valueColor="text-blue-600"
        />
        <InfoRow
          label="Surprise"
          value={item.surprize || "N/A"}
          valueColor="text-green-600"
        />
      </div>
    </motion.div>
  );
};

// Company-wise Earnings Card - Mobile Optimized
const CompanyEarningsCard = ({ item }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md p-4 sm:p-5 border border-gray-100 active:bg-gray-50 transition-all duration-200"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-base sm:text-lg font-bold text-blue-600 line-clamp-1">
            {item.name}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">{item.symbol}</p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <InfoRow
          label="Report Date"
          value={item.reportDate || "N/A"}
          valueColor="text-pink-600"
        />
        <InfoRow
          label="Fiscal Ending"
          value={item.fiscalDateEnding || "N/A"}
          valueColor="text-purple-600"
        />
        <InfoRow
          label="EPS Estimate"
          value={item.estimate || "N/A"}
          valueColor="text-blue-600"
        />
        <InfoRow
          label="Currency"
          value={item.currency || "USD"}
          valueColor="text-green-600"
        />
      </div>
    </motion.div>
  );
};

// Reusable Info Row Component
const InfoRow = ({ label, value, valueColor = "text-gray-900" }) => (
  <div className="flex justify-between items-baseline py-1 border-b border-gray-50">
    <span className="text-gray-600 text-xs sm:text-sm font-medium">
      {label}
    </span>
    <span
      className={`font-semibold text-right break-words max-w-[60%] ${valueColor}`}
    >
      {value}
    </span>
  </div>
);

// Mobile Filter Drawer Component
const MobileFilterDrawer = ({
  isOpen,
  onClose,
  search,
  setSearch,
  dateRange,
  setDateRange,
  activeTab,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl z-50 lg:hidden"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeTab === "date" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search Company
                    </label>
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="Search by company name..."
                        className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {activeTab === "date" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Date
                    </label>
                    <div className="relative">
                      <Calendar
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="date"
                        className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Main Earnings Calendar Component
const EarningsCalendar = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState(getTodayDate());
  const [symbol, setSymbol] = useState("AAPL");
  const [page, setPage] = useState(1);
  const [size] = useState(25);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("company");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const selectedCompanies = useSelector(
    (state) => state.sidebar.selectedCompanies,
  );

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const fetchData = async (newPage = 1) => {
    setLoading(true);
    try {
      let endpoint = "";
      if (activeTab === "company") {
        endpoint = `/api/earnings-calendar-company`;
      } else {
        endpoint = `/api/earnings-calendar-date?date=${dateRange}&page=${newPage}&size=${size}`;
      }

      let res;
      if (activeTab === "company") {
        res = await fetch(endpoint, {
          body: JSON.stringify({ selectedCompanies: selectedCompanies }),
          method: "POST",
        });
      } else {
        res = await fetch(endpoint, { method: "GET" });
      }

      const result = await res.json();
      if (result.success) {
        setData(result.data);
        setPage(newPage);
      } else {
        console.error("Error fetching earnings data:", result.error);
      }
    } catch (error) {
      console.error("❌ Error fetching earnings:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedCompanies.length > 0) {
      fetchData(1);
    }
  }, [activeTab, symbol, dateRange, selectedCompanies]);

  const filteredData = data.filter((item) => {
    const companyName = activeTab === "company" ? item.name : item.company;
    return (
      companyName && companyName.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        search={search}
        setSearch={setSearch}
        dateRange={dateRange}
        setDateRange={setDateRange}
        activeTab={activeTab}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Earnings Calendar
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Track company earnings and financial reports
          </p>
        </div>

        {/* Tab Buttons - Mobile Optimized */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("company")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "company"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Briefcase size={18} />
            <span className="text-sm sm:text-base">Company-wise</span>
          </button>
          <button
            onClick={() => setActiveTab("date")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "date"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Calendar size={18} />
            <span className="text-sm sm:text-base">Date-wise</span>
          </button>
        </div>

        {/* Search and Filters - Desktop */}
        <div className="hidden md:flex flex-col sm:flex-row gap-4 mb-6">
          {activeTab === "date" && (
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by company name..."
                className="w-full p-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          )}
          {activeTab === "date" && (
            <div className="flex-1 relative">
              <Calendar
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="date"
                className="w-full p-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Mobile Filter Button */}
        {activeTab === "date" && (
          <div className="md:hidden mb-4">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium active:bg-gray-50"
            >
              <Filter size={18} />
              Filter & Search
              {(search || dateRange !== getTodayDate()) && (
                <span className="ml-1 w-2 h-2 bg-blue-600 rounded-full" />
              )}
            </button>
          </div>
        )}

        {/* Results Count - Mobile Friendly */}
        {!loading && filteredData.length > 0 && (
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredData.length}
              </span>{" "}
              results
            </p>
            {activeTab === "date" && (
              <p className="text-xs text-gray-400">Page {page}</p>
            )}
          </div>
        )}

        {/* Cards Grid - Responsive */}
        <div className="min-h-[500px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <CircularProgress size={40} sx={{ color: "#3B82F6" }} />
              <p className="mt-4 text-gray-500">Loading earnings data...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Calendar size={32} className="text-gray-400" />
              </div>
              {!selectedCompanies.length ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Companies Selected
                  </h3>
                  <p className="text-gray-500">
                    Select a company to see its earnings calendar
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Results Found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search or date range
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredData.map((item, index) => (
                <div key={index}>
                  {activeTab === "date" ? (
                    <EarningsCard item={item} />
                  ) : (
                    <CompanyEarningsCard item={item} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination - Mobile Optimized */}
        {activeTab === "date" && filteredData.length > 0 && (
          <div className="mt-8 flex justify-center items-center gap-3">
            <button
              onClick={() => fetchData(page - 1)}
              disabled={page === 1}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 active:bg-gray-100 transition-all"
            >
              <ChevronLeft size={18} />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="px-3 py-2 bg-blue-600 text-white rounded-lg font-semibold min-w-[40px] text-center">
                {page}
              </span>
              <span className="text-gray-500 text-sm">
                of {Math.ceil(data.length / size) || 1}
              </span>
            </div>

            <button
              onClick={() => fetchData(page + 1)}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EarningsCalendar;
