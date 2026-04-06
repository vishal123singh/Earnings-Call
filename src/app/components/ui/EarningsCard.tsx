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
          `${process.env.NEXT_PUBLIC_FMP_BASE_URL}/earnings?symbol=${ticker}&limit=5&apikey=${FMP_API_KEY}`,
        );
        const d = await res.json();
        // find closest matching quarter/year
        const match = d.find((e: any) => e.date.includes(String(year)));
        if (match) {
          setData({
            revenue: match.revenue,
            netIncome: match.netIncome,
            eps: match.eps,
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

  if (loading) return <p>Loading earnings...</p>;
  if (!data) return null;

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold text-purple-700">
        {ticker} Earnings
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
        <Metric label="EPS" value={data.eps.toFixed(2)} />
        <Metric label="Report Date" value={data.reportDate} />
      </div>
    </div>
  );
}

const Metric = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="flex justify-between bg-gray-50 p-2 rounded">
    <span>{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);
