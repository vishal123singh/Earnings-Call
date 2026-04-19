"use client";
import { useEffect, useState } from "react";

interface Liquidity {
  currentRatio: number;
  debtEquity: number;
  cash: number;
  totalDebt: number;
}

interface Props {
  ticker: string;
}

export default function LiquidityCard({ ticker }: Props) {
  const [data, setData] = useState<Liquidity | null>(null);
  const [loading, setLoading] = useState(false);
  const FMP_API_KEY = process.env.NEXT_PUBLIC_FMP_API_KEY;

  useEffect(() => {
    const fetchBalance = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_FMP_BASE_URL}/balance-sheet-statement?symbol=${ticker}&limit=1&apikey=${FMP_API_KEY}`,
        );

        const d = await res.json();
        const latest = d[0];

        const currentRatio =
          latest.totalCurrentLiabilities !== 0
            ? latest.totalCurrentAssets / latest.totalCurrentLiabilities
            : 0;

        const debtEquity =
          latest.totalStockholdersEquity !== 0
            ? latest.totalLiabilities / latest.totalStockholdersEquity
            : 0;

        setData({
          currentRatio,
          debtEquity,
          cash: latest.cashAndCashEquivalents,
          totalDebt: latest.totalDebt,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [ticker]);

  const formatCurrency = (val: number) => {
    if (!val) return "-";
    return `$${(val / 1e6).toFixed(1)}M`;
  };

  const formatNumber = (val: number) => {
    if (!val) return "-";
    return val.toFixed(2);
  };

  return (
    <div className="bg-background border border-border rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <h2 className="text-base sm:text-lg font-semibold text-primary mb-4">
        {ticker} Liquidity & Leverage
      </h2>

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
          <MetricCard
            label="Current Ratio"
            value={formatNumber(data.currentRatio)}
          />
          <MetricCard
            label="Debt / Equity"
            value={formatNumber(data.debtEquity)}
          />
          <MetricCard label="Cash" value={formatCurrency(data.cash)} />
          <MetricCard
            label="Total Debt"
            value={formatCurrency(data.totalDebt)}
          />
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
