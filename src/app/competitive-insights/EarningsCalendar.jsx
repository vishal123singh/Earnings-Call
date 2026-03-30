"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
  Loader,
  Briefcase,
} from "lucide-react";
import { useSelector } from "react-redux";
import { companyLogos } from "../../../public/data";
import { CircularProgress } from "@mui/material";

// 🗓️ Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// 🎯 Individual Earnings Card Component
const EarningsCard = ({ item }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-2xl shadow-md p-4 border border-gray-200 hover:shadow-lg transition"
    >
      <h3 className="text-lg font-semibold text-purple-600">{item.company}</h3>
      <h5 className="text-lg font-semibold text-gray-600">
        ({item.symbol || item.ticker})
      </h5>
      <p className="text-gray-700">
        Event:{" "}
        <span className="font-bold text-pink-500">{item.event || "N/A"}</span>
      </p>
      <p className="text-gray-700">
        Earnings Call Time:{" "}
        <span className="font-bold text-pink-500">
          {item.earningsCallTime || "N/A"}
        </span>
      </p>
      <p className="text-gray-700">
        EPS Estimate:{" "}
        <span className="font-bold text-pink-500">
          {item.epsEstimate || "N/A"}
        </span>
      </p>
      <p className="text-gray-700">
        EPS Reported:{" "}
        <span className="font-bold text-purple-500">
          {item.epsReported || "N/A"}
        </span>
      </p>
      <p className="text-gray-700">
        Surprise:{" "}
        <span className="font-bold text-purple-500">
          {item.surprize || "N/A"}
        </span>
      </p>
    </motion.div>
  );
};

// 🏢 Company-wise Earnings Card
const CompanyEarningsCard = ({ item }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-2xl shadow-md p-4 border border-gray-200 hover:shadow-lg transition"
    >
      <h3 className="text-lg font-semibold text-purple-600">{item.name}</h3>
      <h5 className="text-lg font-semibold text-gray-600">({item.symbol})</h5>
      <div className="flex items-center gap-2 mb-2">
        <img
          src={companyLogos[item.symbol]}
          alt={item.name || "Company Logo"}
          className="w-5 h-5"
        />
        <h3 className="text-lg font-semibold text-purple-600">{item.name}</h3>
      </div>

      <p className="text-gray-700">
        Report Date:{" "}
        <span className="font-bold text-pink-500">
          {item.reportDate || "N/A"}
        </span>
      </p>
      <p className="text-gray-700">
        Fiscal Date Ending:{" "}
        <span className="font-bold text-pink-500">
          {item.fiscalDateEnding || "N/A"}
        </span>
      </p>
      <p className="text-gray-700">
        EPS Estimate:{" "}
        <span className="font-bold text-purple-500">
          {item.estimate || "N/A"}
        </span>
      </p>
      <p className="text-gray-700">
        Currency:{" "}
        <span className="font-bold text-purple-500">
          {item.currency || "USD"}
        </span>
      </p>
    </motion.div>
  );
};

// 🎉 Main Earnings Calendar Component
const EarningsCalendar = () => {
  const [data, setData] = useState([]); // Full data
  const [search, setSearch] = useState(""); // Search input
  const [dateRange, setDateRange] = useState(getTodayDate()); // ✅ Pre-select today's date
  const [symbol, setSymbol] = useState("AAPL"); // ✅ Default to AAPL
  const [page, setPage] = useState(1); // ✅ Current page
  const [size] = useState(25); // ✅ Fixed size per page
  const [loading, setLoading] = useState(false); // Loading indicator
  const [activeTab, setActiveTab] = useState("company"); // ✅ Active tab: "date" or "company"
  const selectedCompanies = useSelector(
    (state) => state.sidebar.selectedCompanies,
  ); // 🎯 Fetch Earnings Data Dynamically Based on Tab
  const fetchData = async (newPage = 1) => {
    setLoading(true);
    try {
      let endpoint = "";

      if (activeTab === "company") {
        // 📡 Fetch Company-wise Calendar Data
        endpoint = `/api/earnings-calendar-company`;
      } else {
        // 📡 Fetch Date-wise Calendar Data
        endpoint = `/api/earnings-calendar-date?date=${dateRange}&page=${newPage}&size=${size}`;
      }
      let res;
      if (activeTab === "company") {
        res = await fetch(endpoint, {
          body: JSON.stringify({ selectedCompanies: selectedCompanies }),
          method: "POST",
        });
      } else {
        res = await fetch(endpoint, {
          method: "GET",
        });
      }
      const result = await res.json();

      if (result.success) {
        setData(result.data);
        setPage(newPage); // ✅ Update current page
      } else {
        console.error("Error fetching earnings data:", result.error);
      }
    } catch (error) {
      console.error("❌ Error fetching earnings:", error);
    }
    setLoading(false);
  };

  // 📚 Initial Data Fetch when Tab, Symbol, or Date Changes
  useEffect(() => {
    // ✅ Reset to page 1 when params change
    console.log("🔄 Fetching data...");

    if (selectedCompanies.length > 0) {
      fetchData(1);
    }
  }, [activeTab, symbol, dateRange, selectedCompanies]);

  const filteredData = data.filter((item) => {
    const companyName =
      activeTab === "company"
        ? item.name // 📊 Company-wise uses "name"
        : item.company; // 📅 Date-wise uses "company"

    return (
      companyName && companyName.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="p-6 bg-white min-h-screen flex flex-col">
      {/* 🟣 Tab Buttons */}
      <div className="flex items-center bg-gray-100 shadow-sm w-fit mb-4">
        <button
          onClick={() => setActiveTab("company")}
          className={`flex items-center gap-2 px-6 py-2  font-medium transition-all duration-300 ${
            activeTab === "company"
              ? "bg-purple-700 text-white shadow-md"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Briefcase size={18} /> Company-wise
        </button>
        <button
          onClick={() => setActiveTab("date")}
          className={`flex items-center gap-2 px-6 py-2  font-medium transition-all duration-300 ${
            activeTab === "date"
              ? "bg-purple-700 text-white shadow-md"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Calendar size={18} /> Date-wise
        </button>
      </div>

      {/* 🔎 Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {activeTab === "date" ? (
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-3 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search by company"
              className="p-3 pl-10 border border-gray-300 rounded-xl w-full focus:outline-purple-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        ) : null}
        {activeTab === "company" ? null : ( // No date picker for company-wise
          <div className="relative w-full md:w-1/3">
            <Calendar
              className="absolute left-3 top-3 text-gray-500"
              size={18}
            />
            <input
              type="date"
              className="p-3 pl-10 border border-gray-300 rounded-xl w-full focus:outline-purple-500"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* 📊 Scrollable Cards Container */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          maxHeight: "calc(100vh - 220px)", // Restrict max height to viewport
        }}
      >
        {loading ? (
          <div className="flex justify-center items-center h-40 text-purple-500">
            <CircularProgress size={32} sx={{ color: "inherit" }} />
          </div>
        ) : filteredData.length === 0 ? (
          !selectedCompanies.length ? (
            <p className="text-gray-500 text-center">
              Select a Company to See its Calendar
            </p>
          ) : (
            <p className="text-gray-500 text-center">No earnings data found.</p>
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item, index) =>
              activeTab === "date" ? (
                <EarningsCard key={index} item={item} />
              ) : (
                <CompanyEarningsCard
                  key={index}
                  item={item}
                ></CompanyEarningsCard>
              ),
            )}
          </div>
        )}
      </div>

      {/* ⏩ Pagination Controls */}
      {activeTab === "date" && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => fetchData(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 disabled:opacity-50"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-gray-700">Page {page}</span>
          <button
            onClick={() => fetchData(page + 1)}
            className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default EarningsCalendar;
