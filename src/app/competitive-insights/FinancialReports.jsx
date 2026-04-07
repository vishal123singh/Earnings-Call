"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  Download,
  Print,
  Refresh,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setFilterConfig } from "../../../store/sidebarSlice";
import { companies, quarters, years } from "../../../public/data";

// Report sections configuration
const reportSections = [
  { name: "Income Statement", value: "income_statement", icon: "💰" },
  { name: "Balance Sheet", value: "balance_sheet", icon: "🏦" },
  { name: "Cash Flow", value: "cash_flow", icon: "💵" },
];

const periodTypes = [
  { name: "📅 Annual", value: "annual" },
  { name: "📆 Quarterly", value: "quarterly" },
];

export default function FinancialReports() {
  const dispatch = useDispatch();
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSection, setSelectedSection] = useState("income_statement");
  const [ticker, setTicker] = useState("SOFI");
  const [selectedYear, setSelectedYear] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const selectedCompanies = useSelector(
    (state) => state.sidebar.selectedCompanies,
  );

  useEffect(() => {
    dispatch(
      setFilterConfig({
        companies: companies,
        years: years,
        quarters: quarters,
        selectProps: {
          companies: {
            isMulti: false,
            maxSelected: 1,
            placeholder: "Select a company",
          },
          years: { isMulti: false, placeholder: "Select a year" },
          quarters: { isMulti: false, placeholder: "Select a quarter" },
          persona: { isMulti: false, placeholder: "Select persona" },
          model: { isMulti: false, placeholder: "Select model" },
        },
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    if (selectedCompanies?.length) {
      setTicker(selectedCompanies[0]);
    }
  }, [selectedCompanies]);

  useEffect(() => {
    if (ticker) {
      fetchData();
    }
  }, [ticker]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/scrape-yf?ticker=${ticker}`);
      setApiResponse(response.data);
      // Reset selections
      setSelectedYear(null);
      setCurrentPage(0);
    } catch (err) {
      setError("Failed to fetch financial data. Please try again.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress size={60} />
        <Typography variant="h6" className="ml-4">
          Loading financial data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="p-8">
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchData}>
          Retry
        </Button>
      </Box>
    );
  }

  if (!apiResponse?.success) {
    return (
      <Box className="p-8 text-center">
        <Typography variant="h6">No data available</Typography>
        <Button variant="contained" onClick={fetchData} className="mt-4">
          Load Data
        </Button>
      </Box>
    );
  }

  const { data, ticker: responseTicker, cached } = apiResponse;
  const sectionData = data[selectedSection];

  if (!sectionData) {
    return (
      <Box className="p-8 text-center">
        <Typography variant="h6">
          No data available for {selectedSection}
        </Typography>
      </Box>
    );
  }

  // Get available years (keys of the section data)
  const availableYears = Object.keys(sectionData).filter(
    (year) => sectionData[year] && Object.keys(sectionData[year]).length > 0,
  );

  // Auto-select first available year if none selected
  const displayYear = selectedYear || availableYears[0];
  const yearData = sectionData[displayYear] || {};

  // Convert to rows and headers format
  const metrics = Object.keys(yearData);
  const headers = [displayYear];

  // For comparison view (show multiple years)
  const itemsPerPage = 5;
  const totalPages = Math.ceil(metrics.length / itemsPerPage);
  const displayedMetrics = metrics.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-purple-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <Typography variant="h3" className="font-bold">
                {responseTicker} Financial Reports
              </Typography>
              <Typography variant="body1" className="text-blue-100 mt-1">
                Last updated: {new Date(data.fetched_at).toLocaleString()}
              </Typography>
            </div>
            <div className="flex gap-2">
              {cached && (
                <Chip
                  label="Cached Data"
                  className="bg-yellow-500 text-white"
                />
              )}
              <Tooltip title="Refresh">
                <IconButton
                  onClick={fetchData}
                  className="bg-white/10 text-white hover:bg-white/20"
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
              <Tooltip title="Print">
                <IconButton
                  onClick={() => window.print()}
                  className="bg-white/10 text-white hover:bg-white/20"
                >
                  <Print />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Paper className="p-4">
            <FormControl fullWidth>
              <InputLabel>Financial Statement</InputLabel>
              <select
                value={selectedSection}
                onChange={(e) => {
                  setSelectedSection(e.target.value);
                  setSelectedYear(null);
                  setCurrentPage(0);
                }}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {reportSections.map((section) => (
                  <option key={section.value} value={section.value}>
                    {section.icon} {section.name}
                  </option>
                ))}
              </select>
            </FormControl>
          </Paper>

          <Paper className="p-4">
            <FormControl fullWidth>
              <InputLabel>Fiscal Year</InputLabel>
              <select
                value={displayYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year.split(" ")[0]}
                  </option>
                ))}
              </select>
            </FormControl>
          </Paper>

          <Paper className="p-4">
            <div className="flex items-center gap-2 h-full">
              <div className="flex-1">
                <Typography variant="caption" className="text-gray-500">
                  Total Metrics
                </Typography>
                <Typography variant="h6">{metrics.length}</Typography>
              </div>
              <div className="flex-1">
                <Typography variant="caption" className="text-gray-500">
                  Reporting Year
                </Typography>
                <Typography variant="h6">
                  {displayYear?.split(" ")[0]}
                </Typography>
              </div>
            </div>
          </Paper>
        </div>

        {/* Key Metrics Cards - Top 4 metrics by absolute value */}
        {metrics.length > 0 && (
          <KeyMetricsCards
            yearData={yearData}
            metrics={metrics.slice(0, 4)}
            year={displayYear}
          />
        )}

        {/* Financial Table */}
        {metrics.length > 0 ? (
          <FinancialTable
            yearData={yearData}
            metrics={displayedMetrics}
            title={`${reportSections.find((s) => s.value === selectedSection)?.name} - ${displayYear?.split(" ")[0]}`}
            ticker={responseTicker}
          />
        ) : (
          <Paper className="p-8 text-center">
            <Typography variant="h6" color="textSecondary">
              No data available for this period
            </Typography>
          </Paper>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <IconButton
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="bg-white shadow"
            >
              <ChevronLeft />
            </IconButton>
            <Typography>
              Page {currentPage + 1} of {totalPages}
            </Typography>
            <IconButton
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
              }
              disabled={currentPage === totalPages - 1}
              className="bg-white shadow"
            >
              <ChevronRight />
            </IconButton>
          </div>
        )}
      </div>
    </div>
  );
}

// Key Metrics Cards Component
const KeyMetricsCards = ({ yearData, metrics, year }) => {
  const getTrendColor = (value) => {
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-gray-600";
  };

  const formatMetricValue = (value) => {
    if (value === null || value === undefined) return "N/A";
    const num = typeof value === "number" ? value : parseFloat(value);
    if (isNaN(num)) return "N/A";

    if (Math.abs(num) >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (Math.abs(num) >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (Math.abs(num) >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toLocaleString()}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, idx) => {
        const value = yearData[metric];
        const isPositive = typeof value === "number" && value > 0;

        return (
          <Paper key={idx} className="p-4 hover:shadow-lg transition-shadow">
            <Typography
              variant="body2"
              className="text-gray-500 mb-2 truncate"
              title={metric}
            >
              {metric.replace(/([A-Z])/g, " $1").trim()}
            </Typography>
            <Typography
              variant="h5"
              className={`font-bold mb-2 ${getTrendColor(value)}`}
            >
              {formatMetricValue(value)}
            </Typography>
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="text-green-600" fontSize="small" />
              ) : (
                <TrendingDown className="text-red-600" fontSize="small" />
              )}
              <Typography variant="caption" className={getTrendColor(value)}>
                {year?.split(" ")[0]}
              </Typography>
            </div>
          </Paper>
        );
      })}
    </div>
  );
};

// Financial Table Component
const FinancialTable = ({ yearData, metrics, title, ticker }) => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter metrics based on search
  const filteredMetrics = metrics.filter((metric) =>
    metric.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Sort metrics
  const sortedMetrics = [...filteredMetrics];
  if (sortColumn !== null) {
    sortedMetrics.sort((a, b) => {
      const aVal = yearData[a] || 0;
      const bVal = yearData[b] || 0;
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    });
  }

  const formatCellValue = (value) => {
    if (value === null || value === undefined) return "N/A";
    const num = typeof value === "number" ? value : parseFloat(value);
    if (isNaN(num)) return value;

    if (Math.abs(num) >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (Math.abs(num) >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (Math.abs(num) >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toLocaleString()}`;
  };

  const exportToCSV = () => {
    const headers = ["Metric", "Value"];
    const rows = sortedMetrics.map((metric) => [metric, yearData[metric]]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${ticker}_${title.replace(/\s/g, "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Paper className="overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <Typography variant="h6" className="text-white">
              {title}
            </Typography>
            <Typography variant="caption" className="text-blue-100">
              Ticker: {ticker}
            </Typography>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search metrics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <Tooltip title="Export to CSV">
              <IconButton
                onClick={exportToCSV}
                className="bg-white/10 text-white hover:bg-white/20"
              >
                <Download />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>

      <TableContainer className="overflow-x-auto" style={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow className="bg-gray-50">
              <TableCell className="font-bold">Metric</TableCell>
              <TableCell
                align="right"
                className="font-bold cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  if (sortColumn === 0) {
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                  } else {
                    setSortColumn(0);
                    setSortDirection("asc");
                  }
                }}
              >
                Value
                {sortColumn === 0 && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedMetrics.map((metric, idx) => {
              const value = yearData[metric];
              const isNegative = typeof value === "number" && value < 0;

              return (
                <TableRow
                  key={idx}
                  className="hover:bg-gray-50 transition-colors"
                  sx={{
                    "&:nth-of-type(even)": {
                      backgroundColor: "#f9fafb",
                    },
                  }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    className="font-medium text-gray-900"
                  >
                    <div className="break-words max-w-md">
                      {metric.replace(/([A-Z])/g, " $1").trim()}
                    </div>
                  </TableCell>
                  <TableCell
                    align="right"
                    className={`font-mono ${isNegative ? "text-red-600" : "text-gray-900"}`}
                  >
                    {formatCellValue(value)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="p-4 bg-gray-50 border-t">
        <Typography variant="caption" className="text-gray-500">
          Showing {sortedMetrics.length} of {metrics.length} metrics | Values in
          USD
        </Typography>
      </div>
    </Paper>
  );
};
