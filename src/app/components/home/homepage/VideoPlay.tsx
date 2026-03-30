"use client";

import { motion } from "framer-motion";

const VideoPlay = () => {
  return (
    <section className="bg-[#FBFBFC] py-16 px-6 lg:px-16 flex flex-col items-center w-full">
      <div className="max-w-7xl w-full text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text"
        >
          Watch Our AI in Action
        </motion.h2>
        <p className="text-gray-600 mt-4 text-lg">
          See how our AI-powered earnings call transcript analysis can
          revolutionize your insights.
        </p>

        {/* Video Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 relative w-full shadow-lg rounded-lg overflow-hidden"
        >
          <iframe
            className="w-full h-64 md:h-96 rounded-lg"
            src="https://www.youtube.com/embed/N1UVm-tkI1w"
            title="Summarizing Earnings Calls with AI"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoPlay;
