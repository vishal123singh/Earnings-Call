'use client';

import { useState } from 'react';
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
    <div className="w-full min-h-screen bg-purple-50 text-gray-800 p-6">
      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-300 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === tab.id
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-gray-500 hover:text-purple-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div className="mx-[auto]">
        {TABS.map(
          (tab) =>
            activeTab === tab.id && <div key={tab.id}>{tab.component}</div>,
        )}
      </div>
    </div>
  );
};

export default Dashboard;
