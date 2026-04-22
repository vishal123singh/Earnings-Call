"use client";

import { useState } from "react";
import EarningsCalendar from "./EarningsCalendar";
import FinancialReports from "./FinancialReports";
import FinancialAnalysisDashboard from "@/components/financials/FinancialAnalysisDashboard";

const Dashboard = () => {
  // Combined state for FinancialAnalysisDashboard (including chart data, UI flags, etc.)
  const initialFinancialState = {
    selectedGraph: "",
    graphPrompt: "",
    isLoading: false,
    graphData: null,
    periodType: "annual",
    error: null,
    companyData: {},
    isDrawerOpen: false,
    isChatOpen: true,
  };

  // Separate state for ChatBox (conversation, input, etc.)
  const initialChatState = {
    messages: [],
    inputMessage: "",
    isWaitingForResponse: false,
  };

  const [financialState, setFinancialState] = useState(initialFinancialState);
  const [chatState, setChatState] = useState(initialChatState);

  const TABS = [
    {
      id: "earnings-calendar",
      label: "Earnings Calendar",
      component: <EarningsCalendar />,
    },
    {
      id: "financial-analysis",
      label: "Financial Analysis",
      component: (
        <FinancialAnalysisDashboard
          financialState={financialState}
          setFinancialState={setFinancialState}
          chatState={chatState}
          setChatState={setChatState}
        />
      ),
    },
    {
      id: "financial-reports",
      label: "Financial Reports",
      component: <FinancialReports />,
    },
  ];
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  return (
    <div className="w-full min-h-screen bg-muted/30 text-foreground p-0">
      {/* Tabs */}
      <div className="w-full min-h-screen bg-muted/30 text-foreground px-4 py-6">
        {/* Tabs */}
        <div className="border-b border-border mb-6 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 sm:gap-4 min-w-max">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-2 px-3 sm:px-4 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Tab Content */}
        <div className="max-w-7xl mx-auto">
          {TABS.map(
            (tab) =>
              activeTab === tab.id && <div key={tab.id}>{tab.component}</div>,
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
