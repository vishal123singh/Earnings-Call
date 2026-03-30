"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import IconOne from "../image/Group 51.png";
import IconTwo from "../image/Group 71.png";
import IconThree from "../image/Group 72.png";
import MarketMetrics from "../image/Screenshot 2025-03-06 at 7.10.32 PM 1.png";
import FinancialMetrics from "../image/Screenshot 2025-03-06 at 7.10.16 PM 1.png";
import BGright from "../image/bg.png";
import { CheckSquare, TrendingUpDown } from "lucide-react";
import { BsLightbulbFill } from "react-icons/bs";

const CompanyAnalysis = () => {
  return (
    <section className="bg-gradient-to-b from-[#fafaff] to-[#f3f4f9] flex flex-col items-center px-6 py-16">
      <div className="flex flex-col md:flex-row items-center justify-between  w-full relative gap-12">
        {/* Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="md:w-1/2 space-y-6"
        >
          <h2 className="text-4xl font-extrabold leading-tight bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
            AI-Driven Company Analysis
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Skip the tedious reading and get straight to the insights. Our
            AI-driven platform delivers instant summaries, competitive analysis,
            and key trend highlights, helping you focus on smarter
            decision-making.
          </p>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-5 bg-white shadow-md rounded-xl border-l-4 border-pink-400 transition-all duration-300 hover:scale-[1.02]">
              <CheckSquare color="green"></CheckSquare>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  Instant AI summaries
                </h3>
                <p className="text-gray-500">
                  No more sifting through pages of transcripts.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-5 bg-white shadow-md rounded-xl border-l-4 border-purple-400 transition-all duration-300 hover:scale-[1.02]">
              <TrendingUpDown></TrendingUpDown>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  Compare Competitors
                </h3>
                <p className="text-gray-500">
                  Gain an edge with side-by-side analysis.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-5 bg-white shadow-md rounded-xl border-l-4 border-yellow-400 transition-all duration-300 hover:scale-[1.02]">
              <BsLightbulbFill color="gold"></BsLightbulbFill>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  Spot Key Trends
                </h3>
                <p className="text-gray-500">
                  Identify market movements in real time.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side with Floating Effects */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="md:w-1/2 flex justify-center relative"
        >
          <div className="relative w-full max-w-md flex flex-col items-center">
            {/* Background Moving Image */}
            <motion.div
              animate={{ x: [-15, 15, -15], opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="absolute inset-0 z-0"
            >
              <Image
                src={BGright}
                alt="Background Right"
                className="w-full opacity-70"
              />
            </motion.div>

            {/* Financial Metrics Card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative z-20 w-[90%] bg-white p-6 rounded-2xl shadow-lg"
            >
              <Image
                src={FinancialMetrics}
                alt="Financial Metrics"
                className="w-full rounded-xl"
              />
            </motion.div>

            {/* Market Metrics Card */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative z-10 mt-[-30px] w-[95%] bg-gradient-to-r from-blue-700 to-blue-500 p-6 rounded-2xl shadow-lg"
            >
              <Image
                src={MarketMetrics}
                alt="Market Metrics"
                className="w-full rounded-xl"
              />
            </motion.div>

            {/* Rotating Icons */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10 }}
              className="absolute top-[-30px] left-[40px] z-30"
            >
              <Image src={IconOne} alt="Icon One" width={40} height={40} />
            </motion.div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 15 }}
              className="absolute top-12 right-[-20px] z-30"
            >
              <Image src={IconTwo} alt="Icon Two" width={40} height={40} />
            </motion.div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 12 }}
              className="absolute bottom-[-30px] right-[-20px] z-30"
            >
              <Image src={IconThree} alt="Icon Three" width={40} height={40} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CompanyAnalysis;
