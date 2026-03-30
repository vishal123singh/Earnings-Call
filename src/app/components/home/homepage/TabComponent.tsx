"use client";

import { useState } from "react";
import CompanyAnalysis from "./CompanyAnalysis";
import ReportPage from "./ReportPage";

const TabComponent = () => {
  const [activeTab, setActiveTab] = useState("companyAnalysis");

  return (
    <section className="bg-[#FBFBFC]">
      {/* Tab Buttons */}
      <div className="flex justify-center space-x-12 border-b border-gray-300 pb-4">
        {["companyAnalysis", "reportPage"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 font-medium text-lg transition-all duration-300 relative flex items-center justify-center 
              ${
                activeTab === tab
                  ? "text-purple-600"
                  : "text-gray-500 hover:text-purple-500"
              }
            `}
          >
            <span className="text-center w-full">
              {tab === "companyAnalysis" ? "Company Analysis" : "Report Page"}
            </span>
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300" />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="mt-12 flex justify-center">
        <div className="w-full">
          {activeTab === "companyAnalysis" && <CompanyAnalysis />}
          {activeTab === "reportPage" && <ReportPage />}
        </div>
      </div>
    </section>
  );
};

export default TabComponent;
