"use client";
import { useEffect, useState } from "react";

interface Profitability {
  revenue: number;
  netIncome: number;
  grossMargin: number;
  netMargin: number;
}

interface Props {
  ticker: string;
}

export default function ProfitabilityCard({ ticker }: Props) {
  const [data, setData] = useState<Profitability | null>(null);
  const [loading, setLoading] = useState(false);
  const FMP_API_KEY = process.env.NEXT_PUBLIC_FMP_API_KEY;

  useEffect(() => {
    const fetchProfit = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_FMP_BASE_URL}/income-statement?symbol=${ticker}&limit=1&apikey=${FMP_API_KEY}`,
        );
        const d = await res.json();
        const latest = d[0];

        setData({
          revenue: latest.revenue,
          netIncome: latest.netIncome,
          grossMargin: latest.grossProfit / latest.revenue,
          netMargin: latest.netIncome / latest.revenue,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfit();
  }, [ticker]);

  const formatCurrency = (val: number) => {
    if (!val) return "-";
    return `$${(val / 1e6).toFixed(1)}M`;
  };

  const formatPercent = (val: number) => {
    if (!val) return "-";
    return `${(val * 100).toFixed(2)}%`;
  };

  return (
    <div className="bg-background border border-border rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-primary">
          {ticker} Profitability
        </h2>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : !data ? (
        <p className="text-sm text-muted-foreground">No data available</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard label="Revenue" value={formatCurrency(data.revenue)} />
          <MetricCard
            label="Net Income"
            value={formatCurrency(data.netIncome)}
          />
          <MetricCard
            label="Gross Margin"
            value={formatPercent(data.grossMargin)}
          />
          <MetricCard
            label="Net Margin"
            value={formatPercent(data.netMargin)}
          />
        </div>
      )}
    </div>
  );
}

/* Metric Card */
const MetricCard = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-muted/40 rounded-lg p-3 flex flex-col justify-between hover:bg-muted/60 transition">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-sm sm:text-base font-semibold text-foreground">
      {value}
    </span>
  </div>
);
