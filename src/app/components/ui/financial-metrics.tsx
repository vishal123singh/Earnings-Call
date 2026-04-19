"use client";

import { useEffect, useState } from "react";

interface FinancialMetrics {
  price: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  week52High: number;
  week52Low: number;
  dividendYield: number;
}

interface Props {
  ticker: string;
}

export default function FinancialMetricsCard({ ticker }: Props) {
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null);
  const [loading, setLoading] = useState(false);

  const FMP_API_KEY = process.env.NEXT_PUBLIC_FMP_API_KEY;

  useEffect(() => {
    if (!ticker) return;

    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_FMP_BASE_URL}/profile?symbol=${ticker}&apikey=${FMP_API_KEY}`,
        );

        const data = await res.json();
        const p = data?.[0];

        if (!p) return;

        setMetrics({
          price: p.price,
          changePercent: p.changePercentage,
          marketCap: p.marketCap,
          volume: p.averageVolume,
          week52High: parseFloat(p.range?.split("-")[1] || 0),
          week52Low: parseFloat(p.range?.split("-")[0] || 0),
          dividendYield: p.lastDividend,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [ticker]);

  if (loading) return <Skeleton />;

  if (!metrics) {
    return (
      <div className="p-4 rounded-xl border text-sm text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <div className="bg-background border rounded-2xl shadow-sm p-4 sm:p-5 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-primary truncate">
          {ticker} Metrics
        </h2>

        <span className="text-xs sm:text-sm text-muted-foreground">
          Market Overview
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {Object.entries(metrics).map(([key, value]) => (
          <MetricItem key={key} label={formatLabel(key)} value={value} />
        ))}
      </div>
    </div>
  );
}

const MetricItem = ({ label, value }: { label: string; value: number }) => {
  return (
    <div className="rounded-xl border bg-muted/40 px-3 py-2.5 sm:px-4 sm:py-3 flex flex-col gap-1 min-w-0">
      <span className="text-[11px] sm:text-xs text-muted-foreground truncate">
        {label}
      </span>

      <span className="text-sm sm:text-base font-semibold truncate">
        {formatValue(value)}
      </span>
    </div>
  );
};

const formatLabel = (key: string) =>
  key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

const formatValue = (value: number) => {
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  return value.toFixed(2);
};

const Skeleton = () => (
  <div className="bg-background border rounded-2xl p-4 sm:p-6 animate-pulse">
    <div className="h-5 w-40 bg-muted rounded mb-4" />

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-14 bg-muted rounded-xl" />
      ))}
    </div>
  </div>
);
