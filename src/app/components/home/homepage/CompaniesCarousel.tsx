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
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 2,
      spacing: 20,
    },
    breakpoints: {
      "(min-width: 640px)": { slides: { perView: 3, spacing: 20 } },
      "(min-width: 768px)": { slides: { perView: 4, spacing: 24 } },
      "(min-width: 1024px)": { slides: { perView: 5, spacing: 24 } },
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, 3500);
    return () => clearInterval(interval);
  }, [instanceRef]);

  return (
    <div
      id="companies"
      className="relative py-24 px-6 bg-gradient-to-br from-background via-background to-primary/5"
    >
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
            <Sparkles className="w-4 h-4" />
            Enterprise Financial Coverage
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-primary p-2">
            Leading Global Companies
          </h2>

          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Analyze earnings calls from top financial institutions and tech
            leaders in real time
          </p>
        </div>

        {/* NAV BUTTONS */}
        <div className="relative group">
          <button
            onClick={() => instanceRef.current?.prev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-20
            w-11 h-11 rounded-xl bg-card border border-border shadow-md
            flex items-center justify-center hover:shadow-xl hover:-translate-x-6 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => instanceRef.current?.next()}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-20
            w-11 h-11 rounded-xl bg-card border border-border shadow-md
            flex items-center justify-center hover:shadow-xl hover:translate-x-6 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* CAROUSEL */}
          <div ref={sliderRef} className="keen-slider">
            {companies.map((company, idx) => (
              <div key={idx} className="keen-slider__slide">
                <div
                  className="
                  group relative card-premium p-5 overflow-hidden
                  hover:-translate-y-2 transition-all duration-300
                "
                >
                  {/* subtle scan glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

                  {/* top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-tertiary scale-x-0 group-hover:scale-x-100 origin-left transition" />

                  {/* logo container */}
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 blur-sm opacity-70" />

                    <img
                      src={`https://img.logo.dev/${company.domain}?token=pk_XGdxvZBbQCCRdcdQnSqbxA`}
                      alt={company.name}
                      className="relative w-full h-full object-contain rounded-xl p-2 bg-white/60 dark:bg-card transition-transform group-hover:scale-110"
                      onError={(e) => {
                        const el = e.currentTarget;
                        el.style.display = "none";
                      }}
                    />
                  </div>

                  {/* info */}
                  <div className="text-center relative z-10">
                    <h3 className="text-base font-semibold group-hover:text-primary transition">
                      {company.name}
                    </h3>

                    <p className="text-xs font-mono text-muted-foreground mt-1">
                      {company.ticker}
                    </p>

                    {/* CTA reveal */}
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                      <span className="text-xs text-primary flex items-center justify-center gap-1 font-medium">
                        View Insights
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DOTS */}
          <div className="flex justify-center gap-2 mt-10">
            {[...Array(Math.ceil(companies.length / 5))].map((_, idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx * 5)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide >= idx * 5 && currentSlide < (idx + 1) * 5
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted hover:bg-muted-foreground"
                }`}
              />
            ))}
          </div>
        </div>

        {/* FOOTER STATS */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-card border border-border shadow-sm text-sm">
            <Database className="w-4 h-4 text-primary" />
            <span className="font-medium">500+ companies tracked</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">Live earnings data</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompaniesCarousel;
