"use client";

import { motion } from "framer-motion";
import { Brain, CheckSquare } from "lucide-react";

const ReportPage = () => {
  return (
    <section className="bg-gradient-to-br from-[#f9f9fb] to-[#eef1f5] py-16 px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between relative">
        {/* Left Side - Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="md:w-1/2 space-y-6 text-left"
        >
          <p className="text-lg font-medium text-purple-600 uppercase tracking-widest">
            Report
          </p>
          <h1 className="text-4xl font-extrabold leading-tight bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
            The Total Economic Impact™ <br /> (TEI) of AI-Powered Insights
          </h1>
          <p className="text-md lg:text-lg text-gray-500">
            AAPL | GOOG | TSLA | MCD | NVDA |AMZN | MSFT | JPM | META
          </p>
          <p className="text-gray-700 text-lg mt-4">
            Discover how AI-driven insights deliver measurable ROI. Forrester
            Consulting analyzed the Total Economic Impact of leveraging AI for
            insights and found a 141% ROI over three years.
          </p>
        </motion.div>

        {/* Right Side - Feature Boxes */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="md:w-1/2 grid md:grid-cols-1 gap-6 mt-10 md:mt-0"
        >
          {[
            {
              icon: <CheckSquare color="green"></CheckSquare>,
              title: "Summarized Reports",
              description:
                "Save hours with instant AI-generated summaries of earnings call transcripts.",
              bg: "bg-purple-50",
            },
            {
              icon: <Brain color="brown"></Brain>,
              title: "Real-Time Insights",
              description:
                "Enhance financial decision-making with real-time AI-driven analysis.",
              bg: "bg-white",
            },
            {
              icon: <CheckSquare color="green"></CheckSquare>,
              title: "Improved Accuracy",
              description:
                "Reduce manual research efforts and minimize errors with AI-powered insights.",
              bg: "bg-green-100",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`${item.bg} p-6 rounded-xl shadow-lg hover:shadow-2xl border border-gray-200 transition-transform transform hover:scale-[1.02]`}
            >
              <div className="flex flex-row gap-2">
                <span>{item.icon}</span>
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  {item.title}
                </h3>
              </div>
              <p className="text-gray-600 mt-2">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ReportPage;
