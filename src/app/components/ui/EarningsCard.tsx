"use client";

interface Earnings {
  revenue: number | null;
  netIncome: number | null;
  eps: number | null;
  reportDate: string | null;
}

interface Props {
  ticker: string;
  data: Earnings | null;
  loading?: boolean;
}

export default function EarningsCard({ ticker, data, loading }: Props) {
  if (loading) return <Skeleton />;

  if (!data) {
    return (
      <div className="bg-background border border-border rounded-2xl p-4 text-sm text-muted-foreground">
        No earnings data available
      </div>
    );
  }

  return (
    <div className="bg-background border border-border rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <h2 className="text-base sm:text-lg font-semibold text-primary mb-4">
        {ticker} Earnings
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard label="Revenue" value={formatCurrency(data.revenue)} />
        <MetricCard label="Net Income" value={formatCurrency(data.netIncome)} />
        <MetricCard label="EPS" value={formatEPS(data.eps)} />
        <MetricCard label="Report Date" value={formatDate(data.reportDate)} />
      </div>
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

const formatEPS = (val: number | null) => {
  const num = Number(val);
  if (!isFinite(num)) return "-";
  return num.toFixed(2);
};

const formatDate = (date: string | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
