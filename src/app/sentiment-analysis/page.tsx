"use client";
import { Card, CardContent } from "@/components/ui/card";

import { useEffect, useRef, useState } from "react";
import { companies } from "../../../public/data";
import DOMPurify from "dompurify";
import FinancialMetrics from "@/components/ui/financial-metrics";
import MarketMetrics from "@/components/ui/market-metrics";
import ChatBox from "@/components/ui/chatbox";
import './styles.css'
import { Inter } from "next/font/google";
import { useSelector } from "react-redux";
const inter = Inter({ subsets: ['latin'], weight: ["400"] });

export default function SentimentAnalysis() {
    const [chats, setChats] = useState([]);
    const [isSentimentsLoading, setIsSentimentsLoading] = useState(false);
    const [content, setContent] = useState("");
    const apiUrlSentiments = `${process.env.NEXT_PUBLIC_API_URL}/sentiment-analysis`;
    const [isChatOpen, setIsChatOpen] = useState(false);

    const [isChartsLoading, setIsChartsLoading] = useState(false);
    const [financialMetricsData, setFinancialMetricsData] = useState<any>({ marketData: {}, revenueTrends: [] });

    // const [earningsMetrics, setEarningsMetrics] = useState([])

    const selectedCompanies = useSelector(
        (state: any) => state?.sidebar.selectedCompanies,
    );
    const selectedYear = useSelector((state: any) => state?.sidebar.selectedYear);
    const selectedQuarter = useSelector((state: any) => state?.sidebar.selectedQuarter);


    useEffect(() => {
        if (selectedCompanies.length > 0 && selectedYear && selectedQuarter) {
            getFinancialMetricsData();
            getSentimentAnalysis();
        }
    }, [selectedCompanies, selectedYear, selectedQuarter]);

    useEffect(() => {
        const fetchEarnings = async () => {
            const API_KEY = process.env.ALPHA_VANTAGE_ACCESS_KEY;
            const response = await fetch(`https://www.alphavantage.co/query?function=EARNINGS&symbol=${"MS"}&apikey=${API_KEY}`);
            const data = await response.json();
            console.log("alphavantage data", data);
            //setEarningsMetrics(data);
        };

        //        fetchEarnings();
    }, []);

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
        setIsSentimentsLoading(true);
        try {
            const res = await fetch(apiUrlSentiments, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ selectedCompany: { name: "", ticker: selectedCompanies[0] }, selectedYear, selectedQuarter }),
            });

            const reader = res.body?.getReader();
            if (!reader) return;
            const decoder = new TextDecoder();
            let resultText = "";
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                };
                resultText += decoder.decode(value, { stream: true });
                setContent(DOMPurify.sanitize(resultText));
            }
            setIsSentimentsLoading(false);
        } catch (error) {
            console.error(error);
            setContent("<p style='color:red;'>Error: Sorry, something went wrong.</p>");
        }
    };

    return (
        <div className="flex flex-col bg-purple-50 px-6 py-6 space-y-6 min-h-screen">
            {/* Header */}
            {/* <CustomHeader /> */}

            {/* Financial & Market Metrics */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                {isChartsLoading ? (
                    <div className="flex justify-center items-center h-32 text-gray-400">
                        Loading charts...
                    </div>
                ) : selectedCompanies?.length ? (
                    <>
                            <FinancialMetrics />
                            <MarketMetrics
                                financialMetricsData={financialMetricsData}
                                isLoading={isChartsLoading}
                            />
                        </>
                    ) : (
                        <div className="flex justify-center items-center text-gray-400">

                        </div>
                )}
            </div> */}


            {/* Sentiment Analysis Card */}
            {
                isSentimentsLoading ? <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-600"></div>
                </div> : <Card className="bg-white shadow-md border border-[#e5e7eb] rounded-xl backdrop-blur-lg">
                    {/* <CardHeader>
                <CardTitle className="text-lg font-medium text-purple-600">
                    Sentiment Analysis
                </CardTitle>
            </CardHeader> */}
                    <CardContent className="py-4">
                            {content.trim().length ? formatContent(content) : <p>No Data Available.<br></br>Select a company to get started.</p>
                            }
                        </CardContent>
                    </Card>
            }

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

const formatContent = (text: string) => {
    // Format headers
    text = text.replace(/^# (.*?)$/gm, "<h1>$1</h1>");
    text = text.replace(/^## (.*?)$/gm, "<h2>$1</h2>");

    // Bold for labels
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Line breaks and separation
    text = text.replace(/---/g, "<hr />");

    // Format lists
    text = text.replace(/- (.*?)$/gm, "<li>$1</li>");
    text = text.replace(/(<li>.*<\/li>)+/gm, "<ul>$&</ul>");

    return (
        <div
            className={`sentiment-analysis ${inter.className}`}
            dangerouslySetInnerHTML={{ __html: text }}
        />
    );
};



