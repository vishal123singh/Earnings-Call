// components/FinancialDashboard.jsx
import React from 'react';
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
  ArcElement
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

const FinancialDashboard = ({ data }) => {
  if (!data || !data.success) {
    return <div>No data available</div>;
  }

  const { incomeStatement, balanceSheet, cashFlow } = data.data;
  
  // Helper function to extract data for a specific metric
  const getMetricData = (statement, metricName) => {
    const metric = statement.rows.find(row => row.metric === metricName);
    return metric ? metric.values.map(val => val === "--" ? 0 : Number(val)) : [];
  };

  // Extract years from headers (remove "Breakdown" and "TTM" if needed)
  const incomeYears = incomeStatement.headers.slice(2).map(header => header.split('/')[2]);
  const balanceYears = balanceSheet.headers.slice(1).map(header => header.split('/')[2]);
  const cashFlowYears = cashFlow.headers.slice(2).map(header => header.split('/')[2]);

  // Format large numbers for display
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`;
    }
    return `$${num}`;
  };

  // Chart options
  const defaultOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => formatNumber(context.raw)
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => formatNumber(value)
        }
      }
    }
  };

  // Data for charts
  const charts = [
    // 1. Revenue Trend
    {
      title: "Total Revenue Trend",
      type: "line",
      data: {
        labels: incomeYears,
        datasets: [
          {
            label: "Total Revenue",
            data: getMetricData(incomeStatement, "Total Revenue"),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
          }
        ]
      }
    },
    
    // 2. Revenue Composition (Stacked Bar)
    {
      title: "Revenue Composition",
      type: "bar",
      options: {
        ...defaultOptions,
        scales: {
          x: { stacked: true },
          y: { stacked: true }
        }
      },
      data: {
        labels: incomeYears,
        datasets: [
          {
            label: "Net Interest Income",
            data: getMetricData(incomeStatement, "  Net Interest Income"),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
          },
          {
            label: "Non-Interest Income",
            data: getMetricData(incomeStatement, "  Non Interest Income"),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          }
        ]
      }
    },
    
    // 3. Net Income Trend
    {
      title: "Net Income Trend",
      type: "line",
      data: {
        labels: incomeYears,
        datasets: [
          {
            label: "Net Income",
            data: getMetricData(incomeStatement, "Net Income Common Stockholders"),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          }
        ]
      }
    },
    
    // 4. EPS Comparison
    {
      title: "Earnings Per Share",
      type: "bar",
      data: {
        labels: incomeYears,
        datasets: [
          {
            label: "Basic EPS",
            data: getMetricData(incomeStatement, "Basic EPS"),
            backgroundColor: 'rgba(153, 102, 255, 0.5)',
          },
          {
            label: "Diluted EPS",
            data: getMetricData(incomeStatement, "Diluted EPS"),
            backgroundColor: 'rgba(255, 159, 64, 0.5)',
          }
        ]
      }
    },
    
    // 5. Assets vs Liabilities
    {
      title: "Assets vs Liabilities",
      type: "bar",
      data: {
        labels: balanceYears,
        datasets: [
          {
            label: "Total Assets",
            data: getMetricData(balanceSheet, "Total Assets"),
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
          },
          {
            label: "Total Liabilities",
            data: getMetricData(balanceSheet, "Total Liabilities Net Minority Interest"),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          }
        ]
      }
    },
    
    // 6. Loan Portfolio Growth
    {
      title: "Loan Portfolio Growth",
      type: "line",
      data: {
        labels: balanceYears,
        datasets: [
          {
            label: "Gross Loans",
            data: getMetricData(balanceSheet, "Gross Loan"),
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            fill: true
          }
        ]
      }
    },
    
    // 7. Cash Flow Components
    {
      title: "Cash Flow Components",
      type: "bar",
      data: {
        labels: cashFlowYears,
        datasets: [
          {
            label: "Operating Cash Flow",
            data: getMetricData(cashFlow, "Operating Cash Flow"),
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
          },
          {
            label: "Investing Cash Flow",
            data: getMetricData(cashFlow, "Investing Cash Flow"),
            backgroundColor: 'rgba(255, 159, 64, 0.5)',
          },
          {
            label: "Financing Cash Flow",
            data: getMetricData(cashFlow, "Financing Cash Flow"),
            backgroundColor: 'rgba(153, 102, 255, 0.5)',
          }
        ]
      }
    },
    
    // 8. Asset Composition (Pie Chart)
    {
      title: "Asset Composition (Latest Year)",
      type: "pie",
      data: {
        labels: ["Cash & Equivalents", "Loans", "Securities", "PP&E", "Goodwill & Intangibles"],
        datasets: [
          {
            data: [
              getMetricData(balanceSheet, "  Cash, Cash Equivalents & Federal Funds Sold")[0],
              getMetricData(balanceSheet, "Net Loan")[0],
              getMetricData(balanceSheet, "  Securities and Investments")[0],
              getMetricData(balanceSheet, "Net PPE")[0],
              getMetricData(balanceSheet, "  Goodwill And Other Intangible Assets")[0]
            ],
            backgroundColor: [
              'rgba(54, 162, 235, 0.5)',
              'rgba(75, 192, 192, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(153, 102, 255, 0.5)',
              'rgba(255, 99, 132, 0.5)'
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${formatNumber(value)} (${percentage}%)`;
              }
            }
          }
        }
      }
    }
  ];

  return (
    <div className="financial-dashboard">
      <h1 className="text-2xl font-bold mb-8">SOFI Financial Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {charts.map((chart, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">{chart.title}</h2>
            <div className="h-64">
              {chart.type === "line" && (
                <Line 
                  options={{ ...defaultOptions, ...chart.options }} 
                  data={chart.data} 
                />
              )}
              {chart.type === "bar" && (
                <Bar 
                  options={{ ...defaultOptions, ...chart.options }} 
                  data={chart.data} 
                />
              )}
              {chart.type === "pie" && (
                <Pie 
                  options={{ ...defaultOptions, ...chart.options }} 
                  data={chart.data} 
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialDashboard;