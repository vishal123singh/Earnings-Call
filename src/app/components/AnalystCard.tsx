"use client";
import { useEffect, useState } from "react";

interface Analyst {
  priceTarget: number;
  recommendation: string;
}

interface Props {
  ticker: string;
}

export default function AnalystCard({ ticker }: Props) {
  const [data, setData] = useState<Analyst | null>(null);
  const [loading, setLoading] = useState(false);
  const FMP_API_KEY = process.env.NEXT_PUBLIC_FMP_API_KEY;

  useEffect(() => {
    const fetchAnalyst = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_FMP_BASE_URL}/price-target-summary?symbol=${ticker}&apikey=${FMP_API_KEY}`,
        );
        const d = await res.json();
        if (d && d[0]) {
          setData({
            priceTarget: d[0].priceTargetAverage,
            recommendation: d[0].rating,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalyst();
  }, [ticker]);

  if (loading) return <p>Loading analyst data...</p>;
  if (!data) return null;

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold text-purple-700">
        {ticker} Analyst Estimates
      </h2>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <Metric
          label="Price Target"
          value={`$${data.priceTarget.toFixed(2)}`}
        />
        <Metric label="Recommendation" value={data.recommendation} />
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
