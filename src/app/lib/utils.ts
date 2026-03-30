import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// Define required statements for each graph type
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

const CHART_COLORS = [
  "#4e79a7", // blue
  "#f28e2b", // orange
  "#e15759", // red
  "#76b7b2", // teal
  "#59a14f", // green
  "#edc948", // yellow
  "#b07aa1", // purple
  "#ff9da7", // pink
  "#9c755f", // brown
  "#bab0ac", // gray
];
interface FinancialData {
  success: boolean;
  ticker: string;
  data: {
    incomeStatement?: {
      annual: FinancialStatement;
      quarterly: FinancialStatement;
    };
    balanceSheet?: {
      annual: FinancialStatement;
      quarterly: FinancialStatement;
    };
    cashFlow?: {
      annual: FinancialStatement;
      quarterly: FinancialStatement;
    };
  };
}

interface FinancialStatement {
  headers: string[];
  rows: {
    metric: string;
    values: (string | number)[];
  }[];
}

interface MetricResult {
  description: string;
  [key: string]: any;
}

interface FinancialMetrics {
  [key: string]: MetricResult;
}

export function calculateFinancialMetrics(
  companyData: FinancialData,
  graphType: keyof typeof graphRequirements,
  periodType: "annual" | "quarterly" = "annual",
): FinancialMetrics {
  // Helper function to get the appropriate statement based on report type
  const getStatement = (
    statement:
      | {
          annual: FinancialStatement;
          quarterly: FinancialStatement;
        }
      | undefined,
  ): FinancialStatement | undefined => {
    if (!statement) return undefined;
    return statement[periodType];
  };
  console.log("graphType", graphType);
  // Get required statements for the requested graph type
  const requirements = graphRequirements[graphType];
  const availableStatements = {
    incomeStatement: getStatement(companyData.data?.incomeStatement),
    balanceSheet: getStatement(companyData.data?.balanceSheet),
    cashFlow: getStatement(companyData.data?.cashFlow),
  };

  // Check if required statements are available
  const missingStatements = requirements.statements.filter(
    (stmt) => !availableStatements[stmt],
  );
  if (missingStatements.length > 0) {
    return {};
  }

  const getMetricValues = (
    statement: FinancialStatement | undefined,
    metricName: string,
  ): number[] | null => {
    if (!statement?.rows) return null;

    const metric = statement.rows.find(
      (row) => row.metric.trim().toLowerCase() === metricName.toLowerCase(),
    );

    if (!metric) return null;

    return metric.values.map((val) => {
      if (typeof val === "number") return val;
      if (val === "--" || val === "") return 0;
      return parseFloat(val) || 0;
    });
  };

  const getLatestValue = (values: number[] | null): number | null => {
    if (!values || values.length < 2) return null;
    return values[1]; // TTM is at index 0, latest year at 1
  };

  const formatValue = (value: number | null): string => {
    if (value === null) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const calculateGrowthRate = (
    current: number | null,
    previous: number | null,
  ): string => {
    if (current === null || previous === null || previous === 0) return "N/A";
    return (((current - previous) / previous) * 100).toFixed(2) + "%";
  };

  // Calculate metrics based on graph type
  switch (graphType) {
    case "Revenue Trend": {
      const revenueValues =
        getMetricValues(availableStatements.incomeStatement, "Total Revenue") ||
        [];
      return {
        "Revenue Trend": {
          description: "Total revenue over time",
          data: revenueValues.map((val, i) => ({
            period:
              availableStatements.incomeStatement?.headers?.[i + 1] ||
              `Period ${i + 1}`,
            value: formatValue(val),
            rawValue: val,
          })),
        },
      };
    }

    case "Net Income Comparison": {
      const netIncomeValues =
        getMetricValues(
          availableStatements.incomeStatement,
          "Net Income Common Stockholders",
        ) || [];
      return {
        "Net Income Comparison": {
          description: "Net income performance",
          latestValue: formatValue(getLatestValue(netIncomeValues)),
          rawValue: getLatestValue(netIncomeValues),
          data: netIncomeValues.map((val, i) => ({
            period:
              availableStatements.incomeStatement?.headers?.[i + 1] ||
              `Period ${i + 1}`,
            value: formatValue(val),
            rawValue: val,
          })),
        },
      };
    }

    case "Asset Composition": {
      const totalAssets =
        getLatestValue(
          getMetricValues(availableStatements.balanceSheet, "Total Assets"),
        ) || 0;
      const cash =
        getLatestValue(
          getMetricValues(
            availableStatements.balanceSheet,
            "Cash, Cash Equivalents & Federal Funds Sold",
          ),
        ) || 0;
      const loans =
        getLatestValue(
          getMetricValues(availableStatements.balanceSheet, "Net Loan"),
        ) || 0;
      const securities =
        getLatestValue(
          getMetricValues(
            availableStatements.balanceSheet,
            "Securities and Investments",
          ),
        ) || 0;
      const ppe =
        getLatestValue(
          getMetricValues(availableStatements.balanceSheet, "Net PPE"),
        ) || 0;

      return {
        "Asset Composition": {
          description: "Breakdown of total assets",
          cash: formatValue(cash),
          rawCash: cash,
          loans: formatValue(loans),
          rawLoans: loans,
          securities: formatValue(securities),
          rawSecurities: securities,
          property: formatValue(ppe),
          rawProperty: ppe,
          other: formatValue(totalAssets - (cash + loans + securities + ppe)),
          rawOther: totalAssets - (cash + loans + securities + ppe),
          total: formatValue(totalAssets),
          rawTotal: totalAssets,
        },
      };
    }

    case "Debt-to-Equity Ratio": {
      const totalDebt =
        getLatestValue(
          getMetricValues(availableStatements.balanceSheet, "Total Debt"),
        ) || 0;
      const totalEquity =
        getLatestValue(
          getMetricValues(
            availableStatements.balanceSheet,
            "Total Equity Gross Minority Interest",
          ),
        ) || 0;

      return {
        "Debt-to-Equity Ratio": {
          description: "Financial leverage ratio",
          ratio: totalEquity ? (totalDebt / totalEquity).toFixed(2) : "N/A",
          rawRatio: totalEquity ? totalDebt / totalEquity : null,
          interpretation: totalEquity
            ? totalDebt / totalEquity > 1
              ? "High leverage"
              : "Conservative leverage"
            : "N/A",
          debt: formatValue(totalDebt),
          rawDebt: totalDebt,
          equity: formatValue(totalEquity),
          rawEquity: totalEquity,
        },
      };
    }

    case "Loan Portfolio Growth": {
      const loanValues =
        getMetricValues(availableStatements.balanceSheet, "Gross Loan") || [];
      return {
        "Loan Portfolio Growth": {
          description: "Growth of loan portfolio",
          latestValue: formatValue(loanValues[0]),
          rawValue: loanValues[0],
          growthRate:
            loanValues.length > 1
              ? calculateGrowthRate(loanValues[0], loanValues[1])
              : "N/A",
          data: loanValues.map((val, i) => ({
            period:
              availableStatements.balanceSheet?.headers?.[i + 1] ||
              `Period ${i + 1}`,
            value: formatValue(val),
            rawValue: val,
          })),
        },
      };
    }

    case "Interest Income vs Expense": {
      const interestIncome =
        getLatestValue(
          getMetricValues(
            availableStatements.incomeStatement,
            "Interest Income",
          ),
        ) || 0;
      const interestExpense =
        getLatestValue(
          getMetricValues(
            availableStatements.incomeStatement,
            "Interest Expense",
          ),
        ) || 0;

      return {
        "Interest Income vs Expense": {
          description: "Interest income and expense comparison",
          income: formatValue(interestIncome),
          rawIncome: interestIncome,
          expense: formatValue(interestExpense),
          rawExpense: interestExpense,
          net: formatValue(interestIncome - interestExpense),
          rawNet: interestIncome - interestExpense,
          margin: interestIncome
            ? (
                ((interestIncome - interestExpense) / interestIncome) *
                100
              ).toFixed(2) + "%"
            : "N/A",
          rawMargin: interestIncome
            ? (interestIncome - interestExpense) / interestIncome
            : null,
        },
      };
    }

    case "Operating Cash Flow": {
      const operatingCashFlowValues =
        getMetricValues(availableStatements.cashFlow, "Operating Cash Flow") ||
        [];
      return {
        "Operating Cash Flow": {
          description: "Cash generated from operations",
          latestValue: formatValue(getLatestValue(operatingCashFlowValues)),
          rawValue: getLatestValue(operatingCashFlowValues),
          data: operatingCashFlowValues.map((val) => ({
            value: formatValue(val),
            rawValue: val,
          })),
        },
      };
    }

    case "EPS Comparison": {
      const basicEPSValues =
        getMetricValues(availableStatements.incomeStatement, "Basic EPS") || [];
      const dilutedEPSValues =
        getMetricValues(availableStatements.incomeStatement, "Diluted EPS") ||
        [];
      return {
        "EPS Comparison": {
          description: "Earnings per share comparison",
          basic: basicEPSValues[1]?.toFixed(2) || "N/A",
          rawBasic: basicEPSValues[1],
          diluted: dilutedEPSValues[1]?.toFixed(2) || "N/A",
          rawDiluted: dilutedEPSValues[1],
          dilutionPercentage: basicEPSValues[1]
            ? (
                ((basicEPSValues[1] - dilutedEPSValues[1]) /
                  basicEPSValues[1]) *
                100
              ).toFixed(2) + "%"
            : "N/A",
          rawDilutionPercentage: basicEPSValues[1]
            ? (basicEPSValues[1] - dilutedEPSValues[1]) / basicEPSValues[1]
            : null,
          basicTrend: basicEPSValues.map((val) => val?.toFixed(2)),
          dilutedTrend: dilutedEPSValues.map((val) => val?.toFixed(2)),
        },
      };
    }

    case "Efficiency Ratio": {
      const nonInterestExpense =
        getLatestValue(
          getMetricValues(
            availableStatements.incomeStatement,
            "Non Interest Expense",
          ),
        ) || 0;
      const totalRevenue =
        getLatestValue(
          getMetricValues(availableStatements.incomeStatement, "Total Revenue"),
        ) || 0;

      return {
        "Efficiency Ratio": {
          description: "Non-interest expenses as percentage of revenue",
          ratio: totalRevenue
            ? ((nonInterestExpense / totalRevenue) * 100).toFixed(2) + "%"
            : "N/A",
          rawRatio: totalRevenue ? nonInterestExpense / totalRevenue : null,
          interpretation: totalRevenue
            ? nonInterestExpense / totalRevenue < 0.6
              ? "Efficient"
              : "Inefficient"
            : "N/A",
          expense: formatValue(nonInterestExpense),
          rawExpense: nonInterestExpense,
          revenue: formatValue(totalRevenue),
          rawRevenue: totalRevenue,
        },
      };
    }

    case "Deposit Growth": {
      const depositValues =
        getMetricValues(availableStatements.balanceSheet, "Total Deposits") ||
        [];
      return {
        "Deposit Growth": {
          description: "Growth of customer deposits",
          latestValue: formatValue(depositValues[0]),
          rawValue: depositValues[0],
          growthRate:
            depositValues.length > 1
              ? calculateGrowthRate(depositValues[0], depositValues[1])
              : "N/A",
          data: depositValues.map((val, i) => ({
            period:
              availableStatements.balanceSheet?.headers?.[i + 1] ||
              `Period ${i + 1}`,
            value: formatValue(val),
            rawValue: val,
          })),
        },
      };
    }

    default:
      return {};
  }
}

export function calculateFinancialMetricsFromRaw(
  rawData: Record<string, Partial<FinancialData["data"]>>,
  graphType: keyof typeof graphRequirements,
  periodType: "annual" | "quarterly" = "annual",
): Record<string, FinancialMetrics> {
  const result: Record<string, FinancialMetrics> = {};

  for (const [ticker, data] of Object.entries(rawData)) {
    result[ticker] = calculateFinancialMetrics(
      {
        ticker,
        success: true,
        data: {
          incomeStatement: data.incomeStatement,
          balanceSheet: data.balanceSheet,
          cashFlow: data.cashFlow,
        },
      },
      graphType,
      periodType,
    );
  }

  return result;
}

type TrendPoint = {
  period: string;
  value: string;
  rawValue: number;
};

type MetricData = {
  description: string;
  data: TrendPoint[];
};

type CompanyData = {
  [ticker: string]: {
    [metricName: string]: MetricData;
  };
};

export function generateChartJsFromTrendData(
  companyData: CompanyData,
  normalizeInMillions = false,
) {
  const allPeriods = new Set<string>();
  let inferredMetricName: string | null = null;

  // Infer the metric name and collect all periods
  for (const company of Object.values(companyData)) {
    const metricNames = Object.keys(company);
    if (metricNames.length === 0) continue;

    inferredMetricName =
      inferredMetricName || metricNames[metricNames.length - 1];
    const metric = company[inferredMetricName];

    if (!metric || !metric.data) continue;

    for (const point of metric.data) {
      allPeriods.add(point.period);
    }
  }

  if (!inferredMetricName) {
    return {
      data: { labels: [], datasets: [] },
      options: {},
      analysis: "No valid metric data available",
    };
  }

  // Sort periods chronologically, keeping "TTM" at the end
  const sortedLabels = Array.from(allPeriods).sort((a, b) => {
    if (a === "TTM") return 1;
    if (b === "TTM") return -1;
    return new Date(a).getTime() - new Date(b).getTime();
  });

  // Build datasets with colors
  const datasets = Object.entries(companyData).map(
    ([ticker, metrics], index) => {
      const metric = metrics[inferredMetricName!];
      const periodToValue: Record<string, number> = {};

      for (const point of metric.data) {
        periodToValue[point.period] = point.rawValue;
      }

      const data = sortedLabels.map((period) =>
        normalizeInMillions && periodToValue[period] !== undefined
          ? periodToValue[period] / 1_000_000
          : periodToValue[period] ?? null,
      );

      const colorIndex = index % CHART_COLORS.length;
      const color = CHART_COLORS[colorIndex];

      return {
        label: ticker,
        data,
        borderColor: color,
        backgroundColor: color + "80", // Add transparency for fill
        fill: false,
        tension: 0.2,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: color,
        pointHoverRadius: 6,
      };
    },
  );

  return {
    data: {
      labels: sortedLabels,
      datasets,
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            padding: 20,
          },
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const value = context.raw;
              const formatted = normalizeInMillions
                ? `$${value?.toLocaleString()}M`
                : `$${value?.toLocaleString()}`;
              return `${context.dataset.label}: ${formatted}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (val: number) =>
              normalizeInMillions
                ? `$${val.toLocaleString()}M`
                : `$${val.toLocaleString()}`,
          },
          grid: {
            color: "rgba(0, 0, 0, 0.05)",
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
    },
    analysis: `Showing trend for ${inferredMetricName}`,
  };
}
