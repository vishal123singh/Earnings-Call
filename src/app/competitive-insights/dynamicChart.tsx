"use client";

import React, { useEffect, useState } from "react";
import { MessageCircle, Maximize2, X, Maximize2Icon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import ChatBox from "../components/ui/chatbox";

// 🛠️ Dynamically Import Chart.js Components (Prevents SSR Errors)
const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
  ssr: false,
});
const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
  ssr: false,
});
const Pie = dynamic(() => import("react-chartjs-2").then((mod) => mod.Pie), {
  ssr: false,
});
const Doughnut = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Doughnut),
  { ssr: false }
);
const Scatter = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Scatter),
  { ssr: false }
);
const Bubble = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Bubble),
  { ssr: false }
);

// 🛠️ Register Chart.js Components (Ensures Charts Work Properly)
const useRegisterChartJS = () => {
  useEffect(() => {
    import("chart.js").then((chartjs) => {
      const {
        Chart,
        CategoryScale, // 🛑 Required for 'category' scale
        LinearScale,
        PointElement,
        LineElement,
        BarElement,
        Title,
        Tooltip,
        Legend,
        Filler,
        ArcElement,
      } = chartjs;

      // ✅ Register required chart elements and scales
      Chart.register(
        CategoryScale, // ⚠️ Make sure this is registered
        LinearScale,
        PointElement,
        LineElement,
        BarElement,
        Title,
        Tooltip,
        Legend,
        Filler,
        ArcElement
      );
    });
  }, []);
};


// 🎨 Theme Colors
const COLORS = [
  "#7C3AED",
  "#DB2777",
  "#A78BFA",
  "#F472B6",
  "#9CA3AF",
  "#1F2937",
  "#E879F9",
  "#6366F1",
];

interface ChartData {
  [key: string]: string | number;
}

interface Props {
  key: number;
  chartId: string;
  data: ChartData[];
  chartType: string;
  chartTitle: string;
  chartInsights: string;
  chartData:any;
  setChartData:any;
  userPrompts: any;
  setUserPrompts: any;
}

const DynamicChart = ({
  chartId,
  data,
  chartType,
  chartTitle,
  chartInsights,
  chartData,
  setChartData,
  userPrompts,
  setUserPrompts
}: Props) => {
  const [isClient, setIsClient] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [chats, setChats] = useState([]);

  useRegisterChartJS();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-4">No data available</div>
    );
  }

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "#4B5563",
          font: {
            size: 12,
            family: "Poppins",
          },
        },
      },
      title: {
        display: true,
        text: chartTitle,
        color: "#7C3AED",
        font: {
          size: 18,
          family: "Poppins",
          weight: "bold",
        },
        padding: { top: 8, bottom: 12 },
      },
    },
  };

  return (
    <>
      {/* 📊 Main Chart Card */}
      <div className="w-full mx-auto bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 relative">
        {/* 🔍 Expand Icon */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="absolute top-4 right-4 text-gray-500 hover:text-purple-800"
        >
          <Maximize2Icon className="h-5 w-5" />
        </button>

        {/* 📊 Chart Section */}
        <div className="w-full h-[250px] md:h-[350px] relative">
          {chartType === "bar" && <Bar data={data} options={chartOptions} />}
          {chartType === "line" && <Line data={data} options={chartOptions} />}
          {chartType === "pie" && <Pie data={data} options={chartOptions} />}
          {chartType === "donut" && (
            <Doughnut data={data} options={chartOptions} />
          )}
          {chartType === "scatter" && (
            <Scatter data={data} options={chartOptions} />
          )}
          {chartType === "bubble" && (
            <Bubble data={data} options={chartOptions} />
          )}
        </div>

        {/* 📌 Chart Insights */}
        {chartInsights && (
          <div className="text-center text-gray-700 mt-4 text-sm italic bg-gray-100 p-2 rounded-lg">
            {chartInsights}
          </div>
        )}
      </div>

      {/* 🔥 Chart Drawer for Fullscreen View */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* 🔍 Overlay to Close Drawer */}
            <motion.div
              className="fixed inset-0 z-[9998]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
            />

            {/* 🏡 Drawer Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-[80%] bg-white shadow-2xl z-[9999] overflow-hidden"
            >
              {/* 📌 Drawer Content */}
              <div className="flex flex-col md:flex-row h-[100%] w-full">
                {/* 📊 Enlarged Chart Section */}
                <div className="flex-1 flex-col p-4 bg-gray-50 overflow-y-auto">
                  <div className="flex justify-between items-center p-4 border-b">
                    <button onClick={() => setIsDrawerOpen(false)}>
                      <X className="h-6 w-6 text-gray-500 hover:text-red-500" />
                    </button>
                  </div>
                  <div className="h-[80%] w-full">
                    {chartType === "bar" && (
                      <Bar data={data} options={chartOptions} />
                    )}
                    {chartType === "line" && (
                      <Line data={data} options={chartOptions} />
                    )}
                    {chartType === "pie" && (
                      <Pie data={data} options={chartOptions} />
                    )}
                    {chartType === "donut" && (
                      <Doughnut data={data} options={chartOptions} />
                    )}
                    {chartType === "scatter" && (
                      <Scatter data={data} options={chartOptions} />
                    )}
                    {chartType === "bubble" && (
                      <Bubble data={data} options={chartOptions} />
                    )}
                  </div>
                </div>

                {/* 💬 ChatBox Section */}
                <div className="w-full md:w-[35%] border-l border-gray-200">
                  <ChatBox
                    isOpen={isDrawerOpen}
                    toggleChat={() => setIsDrawerOpen(!isDrawerOpen)}
                    chartId={chartId}
                    chats={chartData}
                    setChats={setChartData}
                    userPrompts={userPrompts}
                    setUserPrompts={setUserPrompts}
                    showChat1={false}
                    showChat2={true}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DynamicChart;
