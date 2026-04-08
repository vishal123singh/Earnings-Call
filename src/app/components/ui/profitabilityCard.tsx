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

  if (loading) return <p>Loading...</p>;
  if (!data) return null;

  return (
    <div className="bg-background p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold text-primary">
        {ticker} Profitability
      </h2>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <Metric
          label="Revenue"
          value={`$${(data.revenue / 1e6).toFixed(2)}M`}
        />
        <Metric
          label="Net Income"
          value={`$${(data.netIncome / 1e6).toFixed(2)}M`}
        />
        <Metric
          label="Gross Margin"
          value={`${(data.grossMargin * 100).toFixed(2)}%`}
        />
        <Metric
          label="Net Margin"
          value={`${(data.netMargin * 100).toFixed(2)}%`}
        />
      </div>
    </div>
  );
}

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between bg-gray-50 p-2 rounded">
    <span>{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);
