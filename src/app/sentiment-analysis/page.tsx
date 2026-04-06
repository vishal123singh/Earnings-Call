"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import FinancialMetricsCard from "@/components/ui/financial-metrics";
import MarketMetrics from "@/components/ui/market-metrics";
import ChatBox from "@/components/ui/chatbox";
import "./styles.css";
import { Inter } from "next/font/google";
import { useSelector } from "react-redux";
import ProfitabilityCard from "@/components/ui/profitabilityCard";
import LiquidityCard from "@/components/ui/liquidityCard";
import EarningsCard from "@/components/ui/EarningsCard";
import AnalystCard from "@/components/AnalystCard";
// import TechnicalCard from "@/components/TechnicalCard";

const inter = Inter({ subsets: ["latin"], weight: ["400"] });

export default function SentimentAnalysis() {
  const [chats, setChats] = useState<any[]>([]);
  const [isSentimentsLoading, setIsSentimentsLoading] = useState(false);
  const [content, setContent] = useState<string>("");
  const apiUrlSentiments = `${process.env.NEXT_PUBLIC_API_URL}/sentiment-analysis`;
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [isChartsLoading, setIsChartsLoading] = useState(false);
  const [financialMetricsData, setFinancialMetricsData] = useState<any>({
    marketData: {},
    revenueTrends: [],
  });

  const selectedCompanies = useSelector(
    (state: any) => state?.sidebar.selectedCompanies,
  );
  const selectedYear = useSelector((state: any) => state?.sidebar.selectedYear);
  const selectedQuarter = useSelector(
    (state: any) => state?.sidebar.selectedQuarter,
  );

  useEffect(() => {
    if (selectedCompanies.length > 0 && selectedYear && selectedQuarter) {
      getFinancialMetricsData();
      getSentimentAnalysis();
    }
  }, [selectedCompanies, selectedYear, selectedQuarter]);

  const getFinancialMetricsData = async () => {
    if (!selectedCompanies.length || !selectedYear || !selectedQuarter) return;

    try {
      setIsChartsLoading(true);
      const response = await fetch("/api/market-metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companies: selectedCompanies }),
      });
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      setFinancialMetricsData(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsChartsLoading(false);
    }
  };

  const getSentimentAnalysis = async () => {
    if (!selectedCompanies.length) return;

    setIsSentimentsLoading(true);
    try {
      const res = await fetch(apiUrlSentiments, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedCompany: { name: "", ticker: selectedCompanies[0] },
          selectedYear,
          selectedQuarter,
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch sentiment");

      const data = await res.json();
      setContent(
        DOMPurify.sanitize(
          data.sentiment_analysis?.reasoning || "No Data Available.",
        ),
      );
    } catch (error) {
      console.error(error);
      setContent(
        "<p style='color:red;'>Error: Sorry, something went wrong.</p>",
      );
    } finally {
      setIsSentimentsLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-purple-50 px-6 py-6 space-y-6 min-h-screen">
      {/* Financial & Market Metrics */}
      {isChartsLoading ? (
        <div className="flex justify-center items-center h-32 text-gray-400">
          Loading charts...
        </div>
      ) : selectedCompanies?.length ? (
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <FinancialMetricsCard ticker={selectedCompanies[0]} />
          <ProfitabilityCard ticker={selectedCompanies[0]} />
          <LiquidityCard ticker={selectedCompanies[0]} />
          <EarningsCard
            ticker={selectedCompanies[0]}
            year={selectedYear}
            quarter={selectedQuarter}
          />
          {/* <AnalystCard ticker={selectedCompanies[0]} /> */}
          {/* <TechnicalCard ticker={selectedCompanies[0]} /> */}

          {/* <MarketMetrics
            financialMetricsData={financialMetricsData}
            isLoading={isChartsLoading}
          /> */}
        </div>
      ) : null}

      {/* Sentiment Analysis Card */}
      {isSentimentsLoading ? (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-600"></div>
        </div>
      ) : (
        <Card className="bg-white shadow-md border border-[#e5e7eb] rounded-xl backdrop-blur-lg">
          <CardContent className="py-4">
            {content.trim().length ? (
              <FormattedContent text={content} />
            ) : (
              <p>
                No Data Available.
                <br />
                Select a company to get started.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Chatbox */}
      <ChatBox
        isOpen={isChatOpen}
        toggleChat={() => setIsChatOpen(!isChatOpen)}
        chats={chats}
        setChats={setChats}
      />
    </div>
  );
}

// Component to safely render formatted content
const FormattedContent = ({ text }: { text: string }) => {
  let formatted = text;

  // Basic Markdown formatting
  formatted = formatted.replace(/^# (.*?)$/gm, "<h1>$1</h1>");
  formatted = formatted.replace(/^## (.*?)$/gm, "<h2>$1</h2>");
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  formatted = formatted.replace(/---/g, "<hr />");

  // Fix lists: wrap consecutive <li> in <ul>
  const liMatches = [...formatted.matchAll(/<li>[\s\S]*?<\/li>/g)];
  if (liMatches.length) {
    formatted = formatted.replace(
      /(<li>[\s\S]*?<\/li>)+/g,
      (match) => `<ul>${match}</ul>`,
    );
  }

  return (
    <div
      className={`sentiment-analysis ${inter.className}`}
      dangerouslySetInnerHTML={{ __html: formatted }}
    />
  );
};
