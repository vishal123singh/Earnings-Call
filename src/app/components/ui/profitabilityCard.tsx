"use client";

interface Profitability {
  revenue: number | null;
  netIncome: number | null;
  grossMargin: number | null;
  netMargin: number | null;
}

interface Props {
  ticker: string;
  data: Profitability | null;
  loading?: boolean;
}

export default function ProfitabilityCard({ ticker, data, loading }: Props) {
  if (loading) return <Skeleton />;

  if (!data) {
    return (
      <div className="bg-background border border-border rounded-2xl p-4 text-sm text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <div className="bg-background border border-border rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-primary">
          {ticker} Profitability
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard label="Revenue" value={formatCurrency(data.revenue)} />
        <MetricCard label="Net Income" value={formatCurrency(data.netIncome)} />
        <MetricCard
          label="Gross Margin"
          value={formatPercent(data.grossMargin)}
        />
        <MetricCard label="Net Margin" value={formatPercent(data.netMargin)} />
      </div>
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

const Skeleton = () => (
  <div className="bg-background border rounded-2xl p-4 sm:p-5 animate-pulse">
    <div className="h-5 w-40 bg-muted rounded mb-4" />
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-20 bg-muted rounded-lg" />
      ))}
    </div>
  </div>
);

const formatCurrency = (val: number | null) => {
  const num = Number(val);
  if (!isFinite(num)) return "-";

  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;

  return `$${num.toFixed(2)}`;
};

const formatPercent = (val: number | null) => {
  const num = Number(val);
  if (!isFinite(num)) return "-";

  return `${(num * 100).toFixed(2)}%`;
};
