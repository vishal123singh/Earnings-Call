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
      className="bg-card rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md p-4 sm:p-5 border border-border active:bg-muted/30 transition-all duration-200"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-primary line-clamp-1">
            {item.company}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {item.symbol || item.ticker}
          </p>
        </div>
        <div className="px-2 py-1 bg-primary/10 rounded-lg">
          <span className="text-xs font-medium text-primary">Earnings</span>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <InfoRow
          label="Event"
          value={item.event || "N/A"}
          valueColor="text-secondary-purple"
        />
        <InfoRow
          label="Call Time"
          value={item.earningsCallTime || "N/A"}
          valueColor="text-secondary-purple"
        />
        <InfoRow
          label="EPS Estimate"
          value={item.epsEstimate || "N/A"}
          valueColor="text-secondary-purple"
        />
        <InfoRow
          label="EPS Reported"
          value={item.epsReported || "N/A"}
          valueColor="text-primary"
        />
        <InfoRow
          label="Surprise"
          value={item.surprize || "N/A"}
          valueColor="text-success"
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
      className="bg-card rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md p-4 sm:p-5 border border-border active:bg-muted/30 transition-all duration-200"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-base sm:text-lg font-bold text-primary line-clamp-1">
            {item.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">{item.symbol}</p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <InfoRow
          label="Report Date"
          value={item.reportDate || "N/A"}
          valueColor="text-secondary-purple"
        />
        <InfoRow
          label="Fiscal Ending"
          value={item.fiscalDateEnding || "N/A"}
          valueColor="text-secondary-purple"
        />
        <InfoRow
          label="EPS Estimate"
          value={item.estimate || "N/A"}
          valueColor="text-primary"
        />
        <InfoRow
          label="Currency"
          value={item.currency || "USD"}
          valueColor="text-success"
        />
      </div>
    </motion.div>
  );
};

// Reusable Info Row Component
const InfoRow = ({ label, value, valueColor = "text-foreground" }) => (
  <div className="flex justify-between items-baseline py-1 border-b border-border/50">
    <span className="text-muted-foreground text-xs sm:text-sm font-medium">
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
            className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-card shadow-2xl z-50 lg:hidden"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">
                  Filters
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-muted active:bg-muted/60"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeTab === "date" && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Search Company
                    </label>
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="Search by company name..."
                        className="w-full p-3 pl-10 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {activeTab === "date" && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Select Date
                    </label>
                    <div className="relative">
                      <Calendar
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        size={18}
                      />
                      <input
                        type="date"
                        className="w-full p-3 pl-10 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-border">
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 active:bg-primary/80 transition-colors"
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
    <div className="min-h-screen bg-gradient-to-br from-muted/30 to-background">
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
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
            Earnings Calendar
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track company earnings and financial reports
          </p>
        </div>

        {/* Tab Buttons - Mobile Optimized */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("company")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "company"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card text-foreground border border-border hover:bg-muted"
            }`}
          >
            <Briefcase size={18} />
            <span className="text-sm sm:text-base">Company-wise</span>
          </button>
          <button
            onClick={() => setActiveTab("date")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "date"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card text-foreground border border-border hover:bg-muted"
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
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by company name..."
                className="w-full p-3 pl-10 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background text-foreground"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          )}
          {activeTab === "date" && (
            <div className="flex-1 relative">
              <Calendar
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <input
                type="date"
                className="w-full p-3 pl-10 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background text-foreground"
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
              className="w-full flex items-center justify-center gap-2 py-3 bg-card border border-border rounded-xl text-foreground font-medium active:bg-muted"
            >
              <Filter size={18} />
              Filter & Search
              {(search || dateRange !== getTodayDate()) && (
                <span className="ml-1 w-2 h-2 bg-primary rounded-full" />
              )}
            </button>
          </div>
        )}

        {/* Results Count - Mobile Friendly */}
        {!loading && filteredData.length > 0 && (
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {filteredData.length}
              </span>{" "}
              results
            </p>
            {activeTab === "date" && (
              <p className="text-xs text-muted-foreground">Page {page}</p>
            )}
          </div>
        )}

        {/* Cards Grid - Responsive */}
        <div className="min-h-[500px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <CircularProgress size={40} sx={{ color: "var(--primary)" }} />
              <p className="mt-4 text-muted-foreground">
                Loading earnings data...
              </p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                <Calendar size={32} className="text-muted-foreground" />
              </div>
              {!selectedCompanies.length ? (
                <>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Companies Selected
                  </h3>
                  <p className="text-muted-foreground">
                    Select a company to see its earnings calendar
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Results Found
                  </h3>
                  <p className="text-muted-foreground">
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
              className="flex items-center gap-2 px-4 sm:px-6 py-2 rounded-xl bg-card border border-border text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted active:bg-muted/60 transition-all"
            >
              <ChevronLeft size={18} />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="px-3 py-2 bg-primary text-primary-foreground rounded-lg font-semibold min-w-[40px] text-center">
                {page}
              </span>
              <span className="text-muted-foreground text-sm">
                of {Math.ceil(data.length / size) || 1}
              </span>
            </div>

            <button
              onClick={() => fetchData(page + 1)}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 rounded-xl bg-card border border-border text-foreground hover:bg-muted active:bg-muted/60 transition-all"
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
