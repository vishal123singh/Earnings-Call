"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import {
  ChevronLeft,
  ChevronRight,
  Building2,
  TrendingUp,
  Star,
  Database,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";

const companies = [
  { name: "JPMorgan Chase", ticker: "JPM", domain: "jpmorganchase.com" },
  { name: "Morgan Stanley", ticker: "MS", domain: "morganstanley.com" },
  { name: "Microsoft", ticker: "MSFT", domain: "microsoft.com" },
  { name: "SoFi", ticker: "SOFI", domain: "sofi.com" },
  { name: "Bank of America", ticker: "BAC", domain: "bankofamerica.com" },
  { name: "Apple", ticker: "AAPL", domain: "apple.com" },
  { name: "Goldman Sachs", ticker: "GS", domain: "goldmansachs.com" },
  { name: "Wells Fargo", ticker: "WFC", domain: "wellsfargo.com" },
  { name: "Tesla", ticker: "TSLA", domain: "tesla.com" },
  { name: "Amazon", ticker: "AMZN", domain: "amazon.com" },
];

function CompaniesCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 2,
      spacing: 24,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: { perView: 3, spacing: 24 },
      },
      "(min-width: 768px)": {
        slides: { perView: 4, spacing: 24 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 5, spacing: 24 },
      },
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  // Auto-advance every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, 4000);
    return () => clearInterval(interval);
  }, [instanceRef]);

  return (
    <div
      id="companies"
      className="w-full py-20 px-4 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header with Animation */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Enterprise Ready</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
            Leading Companies
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Analyze earnings calls from major financial institutions and
            technology leaders
          </p>
        </div>

        <div className="relative group">
          {/* Navigation Buttons - Modern Design */}
          <button
            onClick={() => instanceRef.current?.prev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 z-20 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-white hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => instanceRef.current?.next()}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 z-20 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-white hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Carousel */}
          <div ref={sliderRef} className="keen-slider">
            {companies.map((company, idx) => (
              <div key={idx} className="keen-slider__slide">
                <div className="group/card relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden">
                  {/* Animated Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 to-blue-50/0 group-hover/card:from-indigo-50/50 group-hover/card:to-blue-50/50 transition-all duration-500" />

                  {/* Top Accent Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 scale-x-0 group-hover/card:scale-x-100 transition-transform duration-500 origin-left" />

                  {/* Logo Container with Better Fallback */}
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <img
                      src={`https://img.logo.dev/${company.domain}?token=pk_XGdxvZBbQCCRdcdQnSqbxA`}
                      alt={`${company.name} logo`}
                      className="w-full h-full object-contain rounded-xl transition-transform duration-300 group-hover/card:scale-110"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                        const fallback = document.createElement("div");
                        fallback.className =
                          "w-full h-full bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center text-3xl font-bold text-indigo-600";
                        fallback.textContent = company.name.charAt(0);
                        target.parentElement?.appendChild(fallback);
                      }}
                    />
                  </div>

                  {/* Company Info */}
                  <div className="text-center relative z-10">
                    <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover/card:text-indigo-600 transition-colors">
                      {company.name}
                    </h3>
                    <p className="text-sm font-mono text-indigo-500 font-semibold">
                      {company.ticker}
                    </p>

                    {/* Hover Action */}
                    <div className="mt-4 opacity-0 group-hover/card:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/card:translate-y-0">
                      <span className="text-xs text-indigo-600 flex items-center justify-center gap-1 font-medium">
                        Analyze Reports <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modern Pagination Dots */}
          <div className="flex justify-center gap-2 mt-12">
            {[...Array(Math.ceil(companies.length / 5))].map((_, idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx * 5)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide >= idx * 5 && currentSlide < (idx + 1) * 5
                    ? "w-8 bg-indigo-600"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>

          {/* Stats Badge - Enhanced */}
          <div className="text-center mt-10">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white shadow-md border border-slate-100 text-slate-700 text-sm">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Building2 className="w-3 h-3 text-indigo-600" />
                </div>
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 text-blue-600" />
                </div>
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                  <Star className="w-3 h-3 text-purple-600" />
                </div>
              </div>
              <span className="font-medium">+500 companies supported</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">Real-time data feeds</span>
              <Database className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompaniesCarousel;
