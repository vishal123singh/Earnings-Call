"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import DOMPurify from "dompurify";
import FinancialMetricsCard from "@/components/ui/financial-metrics";
import ChatBox from "@/components/ui/chatbox";
import "./styles.css";
import { Inter } from "next/font/google";
import { useSelector } from "react-redux";
import ProfitabilityCard from "@/components/ui/profitabilityCard";
import LiquidityCard from "@/components/ui/liquidityCard";
import EarningsCard from "@/components/ui/EarningsCard";

const inter = Inter({ subsets: ["latin"], weight: ["400"] });

export default function SentimentAnalysis() {
  const [chats, setChats] = useState<any[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [isSentimentsLoading, setIsSentimentsLoading] = useState(false);
  const [content, setContent] = useState({});

  const [marketsData, setMarketsData] = useState({
    marketData: null,
    profitability: null,
    liquidity: null,
    earnings: null,
  });

  const [isChartsLoading, setIsChartsLoading] = useState(false);

  const selectedCompanies = useSelector(
    (state: any) => state?.sidebar.selectedCompanies,
  );
  const selectedYear = useSelector((state: any) => state?.sidebar.selectedYear);
  const selectedQuarter = useSelector(
    (state: any) => state?.sidebar.selectedQuarter,
  );

  const primaryTicker = selectedCompanies?.[0];

  const canFetch = useMemo(
    () => primaryTicker && selectedYear && selectedQuarter,
    [primaryTicker, selectedYear, selectedQuarter],
  );

  // 🔹 Fetch Financial Data
  useEffect(() => {
    if (!canFetch) return;

    const fetchFinancials = async () => {
      try {
        setIsChartsLoading(true);

        const res = await fetch("/api/market-metrics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ companies: selectedCompanies }),
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setMarketsData(data);

        console.log("Fetched Metrics:", data);
      } catch (err) {
        console.error("Financial error:", err);
      } finally {
        setIsChartsLoading(false);
      }
    };

    fetchFinancials();
  }, [canFetch, selectedCompanies]);

  // 🔹 Fetch Sentiment
  useEffect(() => {
    if (!canFetch) return;

    const fetchSentiment = async () => {
      try {
        setIsSentimentsLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/sentiment-analysis`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              selectedCompany: { ticker: primaryTicker },
              selectedYear,
              selectedQuarter,
            }),
          },
        );

        // 🔴 Better error debugging
        if (!res.ok) {
          const text = await res.text();
          console.error("API ERROR:", text);
          throw new Error("Failed to fetch sentiment");
        }

        let data;

        // 🔴 Safe JSON parsing
        try {
          data = await res.json();
        } catch (err) {
          const text = await res.text();
          console.error("Invalid JSON:", text);
          throw new Error("Invalid API response");
        }

        const sentiment = data?.sentiment_analysis;

        // 🔴 Validate structure
        if (!sentiment || typeof sentiment !== "object") {
          throw new Error("Invalid sentiment structure");
        }

        // ✅ Set structured data instead of HTML
        setContent(sentiment);
      } catch (err) {
        console.error("Sentiment error:", err);

        // ✅ Keep consistent fallback structure
        setContent({
          label: "Neutral",
          confidence: 0.5,
          summary: "Something went wrong while fetching sentiment.",
          key_insights: [],
          risks: [],
          opportunities: [],
          management_tone: "Unknown",
          notable_quotes: [],
        });
      } finally {
        setIsSentimentsLoading(false);
      }
    };

    fetchSentiment();
  }, [canFetch, primaryTicker, selectedYear, selectedQuarter]);

  return (
    <div className="flex flex-col gap-6 px-4 sm:px-6 py-6 min-h-screen bg-background">
      {/* ===== Metrics Section ===== */}
      {canFetch && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-6">
            <SkeletonWrapper loading={isChartsLoading}>
              <FinancialMetricsCard
                ticker={primaryTicker}
                metrics={marketsData?.marketData}
              />
            </SkeletonWrapper>

            <SkeletonWrapper loading={isChartsLoading}>
              <ProfitabilityCard
                ticker={primaryTicker}
                data={marketsData?.profitability}
              />
            </SkeletonWrapper>
          </div>

          <div className="space-y-6">
            <SkeletonWrapper loading={isChartsLoading}>
              <LiquidityCard
                ticker={primaryTicker}
                data={marketsData?.liquidity}
              />
            </SkeletonWrapper>

            <SkeletonWrapper loading={isChartsLoading}>
              <EarningsCard
                ticker={primaryTicker}
                data={marketsData?.earnings}
              />
            </SkeletonWrapper>
          </div>
        </div>
      )}

      {/* ===== Sentiment Section ===== */}
      <Card className="rounded-2xl border shadow-sm">
        <CardContent className="py-5">
          {isSentimentsLoading ? (
            <SkeletonText />
          ) : (
            <SentimentView data={content} />
          )}
        </CardContent>
      </Card>

      {/* ===== Chat ===== */}
      <ChatBox
        isOpen={isChatOpen}
        toggleChat={() => setIsChatOpen((p) => !p)}
        chats={chats}
        setChats={setChats}
      />
    </div>
  );
}

const SkeletonWrapper = ({
  loading,
  children,
}: {
  loading: boolean;
  children: React.ReactNode;
}) => {
  if (!loading) return <>{children}</>;

  return <div className="h-40 rounded-xl bg-muted animate-pulse" />;
};

const SkeletonText = () => (
  <div className="space-y-3 animate-pulse">
    <div className="h-4 bg-muted rounded w-3/4" />
    <div className="h-4 bg-muted rounded w-5/6" />
    <div className="h-4 bg-muted rounded w-2/3" />
  </div>
);

const SentimentView = ({ data }: { data: any }) => {
  const getColor = () => {
    if (data.label === "Positive") return "text-green-500";
    if (data.label === "Negative") return "text-red-500";
    return "text-yellow-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-primary/10 to-transparent border">
        <div className="flex items-center justify-between">
          <h2 className={`text-lg font-semibold ${getColor()}`}>
            {data.label} Sentiment
          </h2>
          <span className="text-sm text-muted-foreground">
            Confidence: {(data.confidence * 100).toFixed(0)}%
          </span>
        </div>

        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          {data.summary}
        </p>
      </div>

      {/* Grid Sections */}
      <div className="grid md:grid-cols-2 gap-4">
        <Section title="📊 Key Insights" items={data.key_insights} />
        <Section title="⚠️ Risks" items={data.risks} />
        <Section title="🚀 Opportunities" items={data.opportunities} />
        <Section title="🎯 Management Tone" text={data.management_tone} />
      </div>

      {/* Quotes */}
      <Section title="💬 Notable Quotes" items={data.notable_quotes} />
    </div>
  );
};

const Section = ({
  title,
  items,
  text,
}: {
  title: string;
  items?: string[];
  text?: string;
}) => {
  const hasItems = Array.isArray(items) && items.length > 0;
  const hasText = text && text.trim().length > 0;

  return (
    <div className="bg-background border rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold mb-3">{title}</h3>

      {/* List */}
      {items !== undefined &&
        (hasItems ? (
          <ul className="space-y-2 text-sm text-muted-foreground">
            {items.map((item, i) => (
              <li key={i} className="flex gap-2">
                <span>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState message="No data available." />
        ))}

      {/* Text */}
      {text !== undefined &&
        (hasText ? (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {text}
          </p>
        ) : (
          <EmptyState message="No information available." />
        ))}
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <p className="text-sm text-muted-foreground italic">{message}</p>
);
