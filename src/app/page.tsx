'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useState, useContext } from 'react';
import Image from 'next/image';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import VideoPlay from './components/home/homepage/VideoPlay';
import TabComponent from './components/home/homepage/TabComponent';
import { ParentContext } from './layout';
import ChatStep from './components/home/homepage/EarningsAssitant';
import CompaniesCarousel from './components/home/homepage/CompaniesCarousel';
import Footer from './components/home/homepage/Footer';
import AIVoiceAssistant from './components/AIVoiceAssistant';

export default function LandingPage() {
  const { setIsLoginOpen, isVoiceAssistantOpen, setIsVoiceAssistantOpen } =
    useContext(ParentContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleSwitchToVoice = () => {
    setIsOpen(false);
    setIsVoiceAssistantOpen(!isVoiceAssistantOpen);
  };

  return (
    <div className="relative m-4 sm:m-8 flex flex-col items-center justify-center p-0">
      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-full w-full bg-[#fff3ff] p-6 sm:p-10 lg:p-[60px] place-items-center">
        {/* Left Column */}
        <div className="flex flex-col justify-center text-center lg:text-left items-center lg:items-start">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-purple-600 to-orange-500 text-transparent bg-clip-text">
            Smarter Earnings Call Insights,
            <br />
            Powered by AI
          </h1>
          <p className="mt-4 text-base sm:text-lg font-regular text-gray-600">
            Decode earnings calls in seconds — no more endless transcripts
          </p>

          {/* Styled Button */}
          <Button
            onClick={() => setIsOpen(true)}
            className="
            group mt-6 rounded-full w-full sm:w-[60vw] md:w-[40vw] lg:w-[20vw] max-w-[280px] py-3 sm:py-4 lg:py-5 px-4 sm:px-6 text-white font-semibold
            bg-gradient-to-r from-purple-500 to-pink-500
            shadow-lg shadow-purple-300/40
            transition-transform transform hover:scale-105 hover:shadow-xl hover:bg-[#E88FA7]
            flex items-center justify-center gap-2
          "
          >
            <span className="text-sm sm:text-base lg:text-sm">
              Explore Earnings Assistant
            </span>
            <motion.div
              initial={{ x: 0 }}
              whileHover={{ x: 8 }} // Moves smoothly when hovered
              transition={{ type: 'spring', stiffness: 150, damping: 12 }}
              className="group-hover:translate-x-2"
            >
              <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
            </motion.div>
          </Button>
        </div>

        {/* Right Column */}
        <div className="relative w-full h-60 sm:h-72 lg:h-[400px] flex justify-center items-center">
          <Image
            src="/images/heroim.png"
            alt="Happy employee"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Chat Assistant & Carousel */}
      <ChatStep
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onExploreMore={() => setIsLoginOpen(true)}
        handleSwitchToVoice={handleSwitchToVoice}
      />
      <CompaniesCarousel />

      {/* Video & Tab Section */}
      <VideoPlay />
      <TabComponent />

      {/* Subscription Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[50vh] mt-12 w-full bg-gradient-to-br from-[#fff3ff] to-[#fdeff9] p-6 sm:p-8 shadow-lg items-center">
        {/* Left Part */}
        <div className="flex flex-col space-y-4 text-center md:text-left">
          <p className="text-sm font-medium text-[#DA6486] tracking-wider uppercase">
            Subscribe
          </p>

          <h2
            className="text-3xl sm:text-4xl font-extrabold leading-tight
            bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500
            bg-clip-text text-transparent"
          >
            Stay updated with our latest marketing strategies
          </h2>

          <p className="text-base text-gray-600 leading-relaxed">
            Drop your email below to receive daily updates about what we do.
          </p>

          {/* Input and Button Container */}
          <div className="mt-4 w-full max-w-[500px]">
            <div className="flex items-center rounded-full overflow-hidden shadow-md border border-gray-300 focus-within:border-gray-300 transition-all">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-5 h-[44px] sm:h-[48px] bg-white border-none outline-none text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0 rounded-l-full"
              />
              <Button className="bg-[#DA6486] h-[44px] sm:h-[48px] px-6 sm:px-8 rounded-none rounded-r-full text-white font-medium hover:bg-[#E88FA7] transition-all">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Right Part */}
        <div className="relative w-full h-60 sm:h-72 lg:h-[280px] flex justify-center items-center">
          <div className="relative w-full h-full">
            <Image
              src="/images/heroim.png"
              alt="Happy employee"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
