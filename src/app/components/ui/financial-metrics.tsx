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
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_FMP_BASE_URL}/profile?symbol=${ticker}&apikey=${FMP_API_KEY}`,
        );
        const data = await res.json();
        const p = data[0];
        setMetrics({
          price: p.price,
          changePercent: p.changePercentage,
          marketCap: p.marketCap,
          volume: p.averageVolume,
          week52High: parseFloat(p.range.split("-")[1]),
          week52Low: parseFloat(p.range.split("-")[0]),
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

  if (loading) return <p>Loading...</p>;
  if (!metrics) return null;

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold text-purple-700">
        {ticker} Market & Valuation
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
        {Object.entries(metrics).map(([k, v]) => (
          <div key={k} className="flex justify-between bg-gray-50 p-2 rounded">
            <span className="capitalize">{k.replace(/([A-Z])/g, " $1")}</span>
            <span className="font-semibold">
              {typeof v === "number" ? v.toFixed(2) : v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
