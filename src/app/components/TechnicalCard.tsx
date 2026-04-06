"use client";
import { useEffect, useState } from "react";

interface Technical {
  rsi: number;
}

interface Props {
  ticker: string;
}

export default function TechnicalCard({ ticker }: Props) {
  const [data, setData] = useState<Technical | null>(null);
  const [loading, setLoading] = useState(false);
  const FMP_API_KEY = process.env.NEXT_PUBLIC_FMP_API_KEY;

  useEffect(() => {
    const fetchTechnical = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_FMP_BASE_URL}/technical-indicators/rsi?symbol=${ticker}&periodLength=14&timeframe=1day&apikey=${FMP_API_KEY}`,
        );
        const d = await res.json();
        if (d && d.length) {
          setData({ rsi: d[0].rsi });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTechnical();
  }, [ticker]);

  if (loading) return <p>Loading technical data...</p>;
  if (!data) return null;

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold text-purple-700">
        {ticker} Technical
      </h2>
      <div className="flex justify-between mt-2 bg-gray-50 p-2 rounded">
        <span>RSI (14)</span>
        <span className="font-semibold">{data.rsi.toFixed(2)}</span>
      </div>
    </div>
  );
}
