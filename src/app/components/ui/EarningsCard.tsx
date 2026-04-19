"use client";
import { useEffect, useState } from "react";

interface Earnings {
  revenue: number;
  netIncome: number;
  eps: number;
  reportDate: string;
}

interface Props {
  ticker: string;
  year: number;
  quarter: string;
}

export default function EarningsCard({ ticker, year, quarter }: Props) {
  const [data, setData] = useState<Earnings | null>(null);
  const [loading, setLoading] = useState(false);
  const FMP_API_KEY = process.env.NEXT_PUBLIC_FMP_API_KEY;

  useEffect(() => {
    const fetchEarnings = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_FMP_BASE_URL}/earnings?symbol=${ticker}&limit=8&apikey=${FMP_API_KEY}`,
        );

        const d = await res.json();

        // Better matching: filter by year first
        const yearMatches = d.filter((e: any) =>
          e.date?.includes(String(year)),
        );

        // fallback if nothing found
        const match = yearMatches[0] || d[0];

        if (match) {
          setData({
            revenue: match.revenue || 0,
            netIncome: match.netIncome || 0,
            eps: match.eps || 0,
            reportDate: match.date,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [ticker, year, quarter]);

  const formatCurrency = (val: number) => {
    if (!val) return "-";
    return `$${(val / 1e6).toFixed(1)}M`;
  };

  const formatEPS = (val: number) => {
    if (!val) return "-";
    return val.toFixed(2);
  };

  const formatDate = (date: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-background border border-border rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <h2 className="text-base sm:text-lg font-semibold text-primary mb-4">
        {ticker} Earnings
      </h2>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : !data ? (
        <p className="text-sm text-muted-foreground">
          No earnings data available
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard label="Revenue" value={formatCurrency(data.revenue)} />
          <MetricCard
            label="Net Income"
            value={formatCurrency(data.netIncome)}
          />
          <MetricCard label="EPS" value={formatEPS(data.eps)} />
          <MetricCard label="Report Date" value={formatDate(data.reportDate)} />
        </div>
      )}
    </div>
  );
}

/* Reusable Metric Card */
const MetricCard = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-muted/40 rounded-lg p-3 flex flex-col justify-between hover:bg-muted/60 transition">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-sm sm:text-base font-semibold text-foreground">
      {value}
    </span>
  </div>
);
