"use client";
import { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
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
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  Download,
  Print,
  Refresh,
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
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSection, setSelectedSection] = useState("income_statement");
  const [selectedPeriod, setSelectedPeriod] = useState("annual");
  const [ticker, setTicker] = useState("MSFT");

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
  }, []);

  // Set initial symbol from selected companies
  useEffect(() => {
    if (selectedCompanies?.length) {
      setTicker(selectedCompanies[0]);
    }
  }, [selectedCompanies]);

  // Prefetch report whenever symbol or reportType changes
  useEffect(() => {
    if (ticker) {
      fetchData();
    }
  }, [ticker, selectedPeriod]);

  // Fetch data function - replace with your actual API endpoint
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Actual API call example:
      const response = await axios.get(`/api/scrape-yf?ticker=${ticker}`);
      setData(response.data);
    } catch (err) {
      setError("Failed to fetch financial data. Please try again.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useState(() => {
    fetchData();
  }, []);

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
        <button
          onClick={fetchData}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </Box>
    );
  }

  if (!data || !data.success) {
    return (
      <Box className="p-8 text-center">
        <Typography variant="h6">No data available</Typography>
        <button
          onClick={fetchData}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Load Data
        </button>
      </Box>
    );
  }

  const financialData = data.data;
  const currentData = financialData[selectedSection]?.[selectedPeriod];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-purple-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Typography variant="h3" className="font-bold">
                {data.ticker} Financial Reports
              </Typography>
              <Typography variant="body1" className="text-blue-100 mt-1">
                Last updated:{" "}
                {new Date(financialData.fetched_at).toLocaleString()}
              </Typography>
            </div>
            <div className="flex gap-2">
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
              {data.cached && (
                <Chip
                  label="Cached Data"
                  size="small"
                  className="bg-yellow-500 text-white"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Paper className="p-4">
            <FormControl fullWidth>
              <InputLabel>Financial Statement</InputLabel>
              <Select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                label="Financial Statement"
              >
                {reportSections.map((section) => (
                  <MenuItem key={section.value} value={section.value}>
                    {section.icon} {section.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>

          <Paper className="p-4">
            <FormControl fullWidth>
              <InputLabel>Reporting Period</InputLabel>
              <Select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                label="Reporting Period"
              >
                {periodTypes.map((period) => (
                  <MenuItem key={period.value} value={period.value}>
                    {period.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        </div>

        {/* Key Metrics Cards */}
        {currentData && currentData.rows && (
          <KeyMetricsCards
            rows={currentData.rows.slice(0, 4)}
            headers={currentData.headers}
          />
        )}

        {/* Financial Table */}
        {currentData && (
          <FinancialTable
            data={currentData}
            title={`${reportSections.find((s) => s.value === selectedSection)?.name} - ${periodTypes.find((p) => p.value === selectedPeriod)?.name}`}
            ticker={data.ticker}
          />
        )}
      </div>
    </div>
  );
}

// Key Metrics Cards Component
const KeyMetricsCards = ({ rows, headers }) => {
  const metrics = rows.slice(0, 4);
  const latestPeriod = headers[1] || "Current";

  const getTrend = (current, previous) => {
    if (!previous || previous === "--") return null;
    const curr = parseFloat(current);
    const prev = parseFloat(previous);
    if (isNaN(curr) || isNaN(prev)) return null;
    const change = ((curr - prev) / prev) * 100;
    return change;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((row, idx) => {
        const currentValue = row.values[0];
        const previousValue = row.values[1];
        const trend = getTrend(currentValue, previousValue);
        const isPositive =
          trend > 0 ||
          (row.metric.toLowerCase().includes("income") && trend > 0);

        return (
          <Paper key={idx} className="p-4 hover:shadow-lg transition-shadow">
            <Typography variant="body2" className="text-gray-500 mb-2">
              {row.metric}
            </Typography>
            <Typography variant="h5" className="font-bold text-gray-800 mb-2">
              {formatValue(currentValue, row.metric)}
            </Typography>
            {trend !== null && (
              <div className="flex items-center gap-1">
                {isPositive ? (
                  <TrendingUp className="text-green-600" fontSize="small" />
                ) : (
                  <TrendingDown className="text-red-600" fontSize="small" />
                )}
                <Typography
                  variant="caption"
                  className={isPositive ? "text-green-600" : "text-red-600"}
                >
                  {Math.abs(trend).toFixed(1)}% vs {latestPeriod}
                </Typography>
              </div>
            )}
          </Paper>
        );
      })}
    </div>
  );
};

// Financial Table Component
const FinancialTable = ({ data, title, ticker }) => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  if (!data || !data.rows || data.rows.length === 0) {
    return (
      <Paper className="p-8 text-center">
        <Typography variant="h6" color="textSecondary">
          No data available for this section
        </Typography>
      </Paper>
    );
  }

  const { headers, rows } = data;

  // Filter rows based on search
  const filteredRows = rows.filter((row) =>
    row.metric.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Sort rows
  const sortedRows = [...filteredRows];
  if (sortColumn !== null) {
    sortedRows.sort((a, b) => {
      const aVal = parseFloat(a.values[sortColumn]) || 0;
      const bVal = parseFloat(b.values[sortColumn]) || 0;
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    });
  }

  const handleSort = (columnIndex) => {
    if (sortColumn === columnIndex) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnIndex);
      setSortDirection("asc");
    }
  };

  return (
    <Paper className="overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
        <div className="flex justify-between items-center">
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
                onClick={() => exportToCSV(sortedRows, headers)}
                className="bg-white/10 text-white hover:bg-white/20"
              >
                <Download />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>

      <TableContainer className="overflow-x-auto" style={{ maxHeight: 600 }}>
        <Table stickyHeader className="min-w-[800px]">
          <TableHead>
            <TableRow className="bg-gray-50">
              {headers.map((header, idx) => (
                <TableCell
                  key={idx}
                  className={`font-bold ${
                    idx > 0 ? "cursor-pointer hover:bg-gray-100" : ""
                  }`}
                  onClick={() => idx > 0 && handleSort(idx - 1)}
                  style={{
                    position: idx === 0 ? "sticky" : "static",
                    left: idx === 0 ? 0 : "auto",
                    backgroundColor: "#f9fafb",
                    zIndex: idx === 0 ? 10 : 1,
                  }}
                >
                  {header}
                  {idx > 0 && sortColumn === idx - 1 && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows.map((row, rowIdx) => (
              <TableRow
                key={rowIdx}
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
                  style={{
                    position: "sticky",
                    left: 0,
                    backgroundColor: "white",
                    zIndex: 1,
                  }}
                >
                  {row.metric}
                </TableCell>
                {row.values.map((value, valIdx) => (
                  <TableCell
                    key={valIdx}
                    align="right"
                    className={`font-mono ${
                      parseFloat(value) < 0 ? "text-red-600" : "text-gray-900"
                    }`}
                  >
                    {formatValue(value, row.metric)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="p-4 bg-gray-50 border-t">
        <Typography variant="caption" className="text-gray-500">
          Showing {sortedRows.length} of {rows.length} metrics | All values in
          thousands USD unless otherwise specified
        </Typography>
      </div>
    </Paper>
  );
};

// Helper function to format values
function formatValue(value, metric) {
  if (value === "--" || value === null || value === undefined) return "N/A";

  const numValue = parseFloat(value);
  if (isNaN(numValue)) return value;

  // Format EPS values
  if (metric.toLowerCase().includes("eps")) {
    return `$${numValue.toFixed(2)}`;
  }

  // Format percentage values
  if (
    metric.toLowerCase().includes("rate") ||
    metric.toLowerCase().includes("margin")
  ) {
    return `${numValue.toFixed(2)}%`;
  }

  // Format large numbers
  if (Math.abs(numValue) >= 1e9) {
    return `$${(numValue / 1e9).toFixed(2)}B`;
  }
  if (Math.abs(numValue) >= 1e6) {
    return `$${(numValue / 1e6).toFixed(2)}M`;
  }
  if (Math.abs(numValue) >= 1e3) {
    return `$${(numValue / 1e3).toFixed(2)}K`;
  }

  return `$${numValue.toLocaleString()}`;
}

// Export to CSV function
function exportToCSV(rows, headers) {
  const csvHeaders = headers.join(",");
  const csvRows = rows.map((row) => {
    return [row.metric, ...row.values].join(",");
  });
  const csv = [csvHeaders, ...csvRows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `financial_report_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
