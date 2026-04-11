import React from "react";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
);

const ChartContainer = React.memo(({ graphData, title, height = 300 }) => {
  if (!graphData?.data?.datasets) {
    return (
      <div className="h-full min-h-[300px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            No chart data available
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Unable to render visualization
          </p>
        </div>
      </div>
    );
  }

  // Default options with better styling
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 12,
            family: "'Inter', system-ui, sans-serif",
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#e5e5e5",
        titleFont: {
          size: 13,
          weight: "bold",
        },
        bodyFont: {
          size: 12,
        },
        padding: 10,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== undefined) {
              label += new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(context.parsed.y);
            }
            if (context.parsed !== undefined) {
              label += context.parsed;
            }
            return label;
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 3,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
        borderWidth: 2,
        borderColor: "#fff",
      },
      bar: {
        borderRadius: 8,
        borderSkipped: false,
      },
    },
    scales:
      graphData.chartType === "bar" || graphData.chartType === "line"
        ? {
            y: {
              grid: {
                color: "rgba(0, 0, 0, 0.05)",
                drawBorder: false,
              },
              ticks: {
                callback: function (value) {
                  if (value >= 1000000000)
                    return "$" + (value / 1000000000).toFixed(1) + "B";
                  if (value >= 1000000)
                    return "$" + (value / 1000000).toFixed(1) + "M";
                  if (value >= 1000)
                    return "$" + (value / 1000).toFixed(1) + "K";
                  return "$" + value;
                },
                font: {
                  size: 11,
                },
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                font: {
                  size: 11,
                },
              },
            },
          }
        : {},
  };

  // Merge provided options with defaults
  const mergedOptions = {
    ...defaultOptions,
    ...graphData.options,
    plugins: {
      ...defaultOptions.plugins,
      ...graphData.options?.plugins,
      tooltip: {
        ...defaultOptions.plugins.tooltip,
        ...graphData.options?.plugins?.tooltip,
      },
      legend: {
        ...defaultOptions.plugins.legend,
        ...graphData.options?.plugins?.legend,
      },
    },
  };

  // Add gradient effects for line and bar charts
  const enhanceDataWithGradients = () => {
    if (!graphData.data) return graphData.data;

    const enhancedData = { ...graphData.data };

    if (graphData.chartType === "line" && enhancedData.datasets) {
      enhancedData.datasets = enhancedData.datasets.map((dataset, index) => {
        if (dataset.fill !== false && !dataset.backgroundColor) {
          const ctx = document.createElement("canvas").getContext("2d");
          if (ctx) {
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(
              0,
              `rgba(${dataset.borderColor || getColorByIndex(index)}, 0.3)`,
            );
            gradient.addColorStop(
              1,
              `rgba(${dataset.borderColor || getColorByIndex(index)}, 0.01)`,
            );
            return { ...dataset, backgroundColor: gradient };
          }
        }
        return dataset;
      });
    }

    if (graphData.chartType === "bar" && enhancedData.datasets) {
      enhancedData.datasets = enhancedData.datasets.map((dataset) => ({
        ...dataset,
        borderRadius: 8,
        borderSkipped: false,
      }));
    }

    return enhancedData;
  };

  const getColorByIndex = (index) => {
    const colors = [
      "59, 130, 246", // blue
      "139, 92, 246", // purple
      "236, 72, 153", // pink
      "34, 197, 94", // green
      "245, 158, 11", // orange
      "239, 68, 68", // red
      "6, 182, 212", // cyan
    ];
    return colors[index % colors.length];
  };

  const enhancedData = enhanceDataWithGradients();

  const renderChart = () => {
    const commonProps = {
      data: enhancedData,
      options: mergedOptions,
      height: height,
    };

    switch (graphData.chartType) {
      case "line":
        return <Line {...commonProps} />;
      case "bar":
        return <Bar {...commonProps} />;
      case "pie":
        return (
          <div className="flex justify-center">
            <div style={{ maxWidth: "300px", margin: "0 auto" }}>
              <Pie {...commonProps} />
            </div>
          </div>
        );
      case "doughnut":
        return (
          <div className="flex justify-center">
            <div style={{ maxWidth: "300px", margin: "0 auto" }}>
              <Doughnut {...commonProps} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header with title */}
      {title && (
        <div className="px-5 pt-5 pb-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {title}
          </h3>
        </div>
      )}

      {/* Chart content */}
      <div className="p-5" style={{ height: title ? height - 60 : height }}>
        {renderChart()}
      </div>

      {/* Footer with metadata */}
      {graphData.metadata && (
        <div className="px-5 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Updated just now</span>
            <div className="flex gap-3">
              <button className="hover:text-primary transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
              <button className="hover:text-primary transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

ChartContainer.displayName = "ChartContainer";

export default ChartContainer;
