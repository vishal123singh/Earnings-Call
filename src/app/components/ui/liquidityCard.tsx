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
        setData({
          currentRatio:
            latest.totalCurrentAssets / latest.totalCurrentLiabilities,
          debtEquity: latest.totalLiabilities / latest.totalStockholdersEquity,
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

  if (loading) return <p>Loading liquidity data...</p>;
  if (!data) return null;

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold text-purple-700">
        {ticker} Liquidity & Leverage
      </h2>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <Metric label="Current Ratio" value={data.currentRatio.toFixed(2)} />
        <Metric label="Debt/Equity" value={data.debtEquity.toFixed(2)} />
        <Metric label="Cash" value={`$${(data.cash / 1e6).toFixed(2)}M`} />
        <Metric
          label="Total Debt"
          value={`$${(data.totalDebt / 1e6).toFixed(2)}M`}
        />
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
