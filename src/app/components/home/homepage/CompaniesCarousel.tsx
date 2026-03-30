"use client"

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const images = [
  "/images/icons/google_full.png",
  "/images/icons/notion.png",
  "/images/icons/trello.png",
  "/images/icons/slack.png",
  "/images/icons/sofi.png",
];
function CompaniesCarousel() {
    const [sliderRef, instanceRef] = useKeenSlider({
      loop: true,
      slides: {
        perView: 3,
        spacing: 10,
      },
      breakpoints: {
        "(min-width: 768px)": {
          slides: { perView: 4, spacing: 10 },
        },
        "(min-width: 1024px)": {
          slides: { perView: 5, spacing: 10 },
        },
      },
      created: (slider) => {
        setInterval(() => {
          slider.next(); // Auto-slide every 3 seconds
        }, 3000);
      },
    });
  
    return (
      <div className="w-full flex justify-center mt-10">
        <div className="relative w-full max-w-[90vw]">
          {/* Left Button */}
          <button
            onClick={() => instanceRef.current?.prev()}
            className="
              absolute left-[-50px] top-1/2 transform -translate-y-1/2 
              bg-[#DA6486] text-white p-3 rounded-full shadow-md 
              hover:bg-[#E88FA7] transition-all duration-300 z-10
              pointer-events-auto
            "
          >
            <ChevronLeft />
          </button>
  
          {/* Carousel */}
          <div className="overflow-hidden rounded-lg shadow-lg bg-white">
            <div ref={sliderRef} className="keen-slider">
              {images.map((src, index) => (
                <div key={index} className="keen-slider__slide">
                  <div className="p-2">
                    <div className="border-0 flex justify-center items-center p-4">
                      <Image
                        src={src}
                        alt={`Slide ${index + 1}`}
                        width={80}
                        height={80}
                        className="rounded-md object-contain"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          {/* Right Button */}
          <button
            onClick={() => instanceRef.current?.next()}
            className="
              absolute right-[-50px] top-1/2 transform -translate-y-1/2
              bg-[#DA6486] text-white p-3 rounded-full shadow-md
              hover:bg-[#E88FA7] transition-all duration-300 z-10
              pointer-events-auto
            "
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    );
  
  
  }
  
  export default CompaniesCarousel;