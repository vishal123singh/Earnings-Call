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
  Skeleton,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  Download,
  Print,
  Refresh,
  ChevronLeft,
  ChevronRight,
  HouseOutlined,
  Money,
} from "@mui/icons-material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setFilterConfig } from "../../../store/sidebarSlice";
import { companies, quarters, years } from "../../../public/data";
import { DollarSign } from "lucide-react";

// Report sections configuration
const reportSections = [
  { name: "Income Statement", value: "income_statement", icon: <DollarSign /> },
  { name: "Balance Sheet", value: "balance_sheet", icon: <HouseOutlined /> },
  { name: "Cash Flow", value: "cash_flow", icon: <Money /> },
];

const periodTypes = [
  { name: "📅 Annual", value: "annual" },
  { name: "📆 Quarterly", value: "quarterly" },
];

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-background">
    {/* Header Skeleton */}
    <div className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <Skeleton
              variant="text"
              width={300}
              height={48}
              className="bg-white/20"
            />
            <Skeleton
              variant="text"
              width={200}
              height={24}
              className="bg-white/20 mt-1"
            />
          </div>
          <div className="flex gap-2">
            <Skeleton
              variant="circular"
              width={40}
              height={40}
              className="bg-white/20"
            />
            <Skeleton
              variant="circular"
              width={40}
              height={40}
              className="bg-white/20"
            />
          </div>
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Controls Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[1, 2, 3].map((i) => (
          <Paper key={i} className="p-4 border-border">
            <Skeleton variant="text" width="100%" height={56} />
          </Paper>
        ))}
      </div>

      {/* Key Metrics Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Paper key={i} className="p-4 border-border">
            <Skeleton variant="text" width="80%" height={24} className="mb-2" />
            <Skeleton variant="text" width="60%" height={32} className="mb-2" />
            <Skeleton variant="text" width="40%" height={20} />
          </Paper>
        ))}
      </div>

      {/* Table Skeleton */}
      <Paper className="overflow-hidden border-border bg-card">
        <div className="bg-primary p-4">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <Skeleton
                variant="text"
                width={200}
                height={28}
                className="bg-white/20"
              />
              <Skeleton
                variant="text"
                width={100}
                height={20}
                className="bg-white/20 mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Skeleton
                variant="rounded"
                width={200}
                height={36}
                className="bg-white/20"
              />
              <Skeleton
                variant="circular"
                width={36}
                height={36}
                className="bg-white/20"
              />
            </div>
          </div>
        </div>

        <TableContainer style={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow className="bg-muted">
                <TableCell className="font-bold text-foreground">
                  <Skeleton variant="text" width={100} height={24} />
                </TableCell>
                <TableCell align="right" className="font-bold text-foreground">
                  <Skeleton
                    variant="text"
                    width={80}
                    height={24}
                    className="ml-auto"
                  />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton variant="text" width="90%" height={20} />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton
                      variant="text"
                      width="70%"
                      height={20}
                      className="ml-auto"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <div className="p-4 bg-muted border-t border-border">
          <Skeleton variant="text" width={250} height={20} />
        </div>
      </Paper>
    </div>
  </div>
);

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
      setSelectedYear(null);
      setCurrentPage(0);
    } catch (err) {
      setError("Failed to fetch financial data. Please try again.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Show loading skeleton while fetching data
  if (loading) {
    return <LoadingSkeleton />;
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

  const availableYears = Object.keys(sectionData).filter(
    (year) => sectionData[year] && Object.keys(sectionData[year]).length > 0,
  );

  const displayYear = selectedYear || availableYears[0];
  const yearData = sectionData[displayYear] || {};

  const metrics = Object.keys(yearData);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(metrics.length / itemsPerPage);
  const displayedMetrics = metrics.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage,
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <Typography variant="h3" className="font-bold">
                {responseTicker} Financial Reports
              </Typography>
              <Typography variant="body1" className="text-primary-light mt-1">
                Last updated: {new Date(data.fetched_at).toLocaleString()}
              </Typography>
            </div>
            <div className="flex gap-2">
              {cached && (
                <Chip label="Cached Data" className="bg-warning text-white" />
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
          <Paper className="p-4 border-border">
            <FormControl fullWidth>
              <InputLabel>Financial Statement</InputLabel>
              <Select
                value={selectedSection}
                onChange={(e) => {
                  setSelectedSection(e.target.value);
                  setSelectedYear(null);
                  setCurrentPage(0);
                }}
                className="bg-card"
              >
                {reportSections.map((section) => (
                  <MenuItem key={section.value} value={section.value}>
                    {section.icon} {section.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>

          <Paper className="p-4 border-border">
            <FormControl fullWidth>
              <InputLabel>Fiscal Year</InputLabel>
              <Select
                value={displayYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-card"
              >
                {availableYears.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year.split(" ")[0]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>

          <Paper className="p-4 border-border">
            <div className="flex items-center gap-2 h-full">
              <div className="flex-1">
                <Typography variant="caption" className="text-muted-foreground">
                  Total Metrics
                </Typography>
                <Typography variant="h6" className="text-foreground">
                  {metrics.length}
                </Typography>
              </div>
              <div className="flex-1">
                <Typography variant="caption" className="text-muted-foreground">
                  Reporting Year
                </Typography>
                <Typography variant="h6" className="text-foreground">
                  {displayYear?.split(" ")[0]}
                </Typography>
              </div>
            </div>
          </Paper>
        </div>

        {/* Key Metrics Cards */}
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
          <Paper className="p-8 text-center border-border">
            <Typography variant="h6" className="text-muted-foreground">
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
              className="bg-card border-border shadow"
            >
              <ChevronLeft />
            </IconButton>
            <Typography className="text-foreground">
              Page {currentPage + 1} of {totalPages}
            </Typography>
            <IconButton
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
              }
              disabled={currentPage === totalPages - 1}
              className="bg-card border-border shadow"
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
    if (value > 0) return "text-success";
    if (value < 0) return "text-destructive";
    return "text-muted-foreground";
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
          <Paper
            key={idx}
            className="p-4 hover:shadow-lg transition-shadow border-border bg-card"
          >
            <Typography
              variant="body2"
              className="text-muted-foreground mb-2 truncate"
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
                <TrendingUp className="text-success" fontSize="small" />
              ) : (
                <TrendingDown className="text-destructive" fontSize="small" />
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

  const filteredMetrics = metrics.filter((metric) =>
    metric.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
    <Paper className="overflow-hidden border-border bg-card">
      <div className="bg-primary p-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <Typography variant="h6" className="text-primary-foreground">
              {title}
            </Typography>
            <Typography variant="caption" className="text-primary-light">
              Ticker: {ticker}
            </Typography>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search metrics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1 rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Tooltip title="Export to CSV">
              <IconButton
                onClick={exportToCSV}
                className="bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
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
            <TableRow className="bg-muted">
              <TableCell className="font-bold text-foreground">
                Metric
              </TableCell>
              <TableCell
                align="right"
                className="font-bold text-foreground cursor-pointer hover:bg-muted-foreground/10"
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
                  className="hover:bg-muted/50 transition-colors"
                  sx={{
                    "&:nth-of-type(even)": {
                      backgroundColor: "var(--muted)",
                    },
                  }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    className="font-medium text-foreground"
                  >
                    <div className="break-words max-w-md">
                      {metric.replace(/([A-Z])/g, " $1").trim()}
                    </div>
                  </TableCell>
                  <TableCell
                    align="right"
                    className={`font-mono ${isNegative ? "text-destructive" : "text-foreground"}`}
                  >
                    {formatCellValue(value)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="p-4 bg-muted border-t border-border">
        <Typography variant="caption" className="text-muted-foreground">
          Showing {sortedMetrics.length} of {metrics.length} metrics | Values in
          USD
        </Typography>
      </div>
    </Paper>
  );
};
