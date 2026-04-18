"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import {
  ChevronLeft,
  ChevronRight,
  Database,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

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
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    renderMode: "performance",
    slides: {
      perView: 2,
      spacing: 20,
    },
    breakpoints: {
      "(min-width: 640px)": { slides: { perView: 3, spacing: 20 } },
      "(min-width: 768px)": { slides: { perView: 4, spacing: 24 } },
      "(min-width: 1024px)": { slides: { perView: 5, spacing: 28 } },
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  // autoplay with pause on hover
  useEffect(() => {
    if (isHovered) return;

    intervalRef.current = setInterval(() => {
      instanceRef.current?.next();
    }, 3000);

    return () => clearInterval(intervalRef.current!);
  }, [instanceRef, isHovered]);

  return (
    <section
      id="companies"
      className="relative py-28 px-6 bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden"
    >
      {/* ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.08),transparent_60%)]" />

      <div className="max-w-7xl mx-auto relative">
        {/* HEADER */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20 backdrop-blur">
            <Sparkles className="w-4 h-4" />
            Enterprise Financial Coverage
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Leading Global Companies
          </h2>

          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Analyze earnings calls from top financial institutions and tech
            leaders in real time
          </p>
        </div>

        {/* CAROUSEL WRAPPER */}
        <div
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* NAV BUTTONS */}
          <button
            onClick={() => instanceRef.current?.prev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20
            w-11 h-11 rounded-xl bg-white/70 dark:bg-white/10 backdrop-blur-md
            border border-white/20 shadow-md flex items-center justify-center
            opacity-0 group-hover:opacity-100 hover:scale-110 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => instanceRef.current?.next()}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20
            w-11 h-11 rounded-xl bg-white/70 dark:bg-white/10 backdrop-blur-md
            border border-white/20 shadow-md flex items-center justify-center
            opacity-0 group-hover:opacity-100 hover:scale-110 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* SLIDER */}
          <div ref={sliderRef} className="keen-slider">
            {companies.map((company, idx) => (
              <div key={idx} className="keen-slider__slide">
                <div className="group relative p-[1px] rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-transparent hover:from-primary/30 transition">
                  <div className="relative rounded-3xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 h-full overflow-hidden hover:-translate-y-2 transition-all duration-300">
                    {/* glow hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-primary/10 via-transparent to-transparent" />

                    {/* LOGO */}
                    <div className="relative w-16 h-16 mx-auto mb-4">
                      <img
                        src={`https://img.logo.dev/${company.domain}?token=pk_XGdxvZBbQCCRdcdQnSqbxA`}
                        alt={company.name}
                        className="w-full h-full object-contain rounded-xl p-2 bg-white dark:bg-card shadow-sm group-hover:scale-110 transition"
                        onError={(e) => {
                          const el = e.currentTarget;
                          el.style.display = "none";
                          const fallback = document.createElement("div");
                          fallback.className =
                            "w-full h-full flex items-center justify-center rounded-xl bg-primary/10 text-primary font-bold";
                          fallback.innerText = company.ticker;
                          el.parentElement?.appendChild(fallback);
                        }}
                      />
                    </div>

                    {/* INFO */}
                    <div className="text-center relative z-10">
                      <h3 className="text-base font-semibold group-hover:text-primary transition">
                        {company.name}
                      </h3>

                      <p className="text-xs font-mono text-muted-foreground mt-1">
                        {company.ticker}
                      </p>
                    </div>

                    {/* bottom line */}
                    <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DOTS */}
          <div className="flex justify-center gap-2 mt-12">
            {companies.map((_, idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`transition-all duration-300 rounded-full ${
                  currentSlide === idx
                    ? "w-8 h-2 bg-primary"
                    : "w-2 h-2 bg-muted hover:bg-muted-foreground"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-10 md:mt-14 px-4">
          <div
            className="
      inline-flex flex-wrap items-center justify-center
      gap-x-3 gap-y-2
      px-4 py-2 md:px-5 md:py-2.5
      rounded-full
      bg-white/60 dark:bg-white/5
      backdrop-blur
      border border-white/20
      shadow-sm
      text-xs sm:text-sm
      max-w-full
    "
          >
            <Database className="w-4 h-4 text-primary shrink-0" />

            <span className="font-medium whitespace-nowrap">
              500+ companies tracked
            </span>

            <span className="text-muted-foreground hidden sm:inline">•</span>

            <span className="text-muted-foreground whitespace-nowrap">
              Live earnings data
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CompaniesCarousel;
