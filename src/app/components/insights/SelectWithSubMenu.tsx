"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { createPortal } from "react-dom";

interface SubOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
  submenu?: SubOption[];
}

interface Props {
  className?: string;
  handleCategoryChange: (value: string) => void;
  handleButtonClick: (value: string) => void;
  options?: Option[];
  placeholder?: string;
}

const SelectWithSubmenu = ({
  className = "",
  handleCategoryChange,
  handleButtonClick,
  options = [],
  placeholder = "Select a question",
}: Props) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [mobileSub, setMobileSub] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const [pos, setPos] = useState({ top: 0, left: 0 });

  // detect mobile
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  // outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        (!submenuRef.current || !submenuRef.current.contains(e.target as Node))
      ) {
        setOpen(false);
        setHovered(null);
        setMobileSub(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // submenu position
  const setSubmenuPosition = (key: string) => {
    const el = btnRefs.current[key];
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const width = 240;

    let left = rect.right;
    if (window.innerWidth - rect.right < width) {
      left = rect.left - width;
    }

    setPos({
      top: rect.top,
      left,
    });
  };

  const select = (value: string) => {
    setSelected(value);
    setOpen(false);
    setHovered(null);
    setMobileSub(null);
  };

  return (
    <div ref={ref} className="relative w-full sm:w-auto">
      {/* BUTTON */}
      <button
        onClick={() => setOpen((p) => !p)}
        className={`w-full sm:w-auto px-4 py-2.5 rounded-xl border text-sm flex items-center justify-between gap-2
        bg-primary/10 border-primary/30 text-primary
        hover:bg-primary/20 transition ${className}`}
      >
        <span className="truncate max-w-[12rem] text-foreground">
          {selected || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-50 mt-2 w-full sm:min-w-[16rem] rounded-xl border bg-background shadow-lg overflow-hidden">
          <div className="max-h-[60vh] overflow-y-auto py-1">
            {options.map((opt) => (
              <div key={opt.value}>
                {/* OPTION */}
                <button
                  ref={(el) => (btnRefs.current[opt.value] = el)}
                  onClick={() => {
                    if (opt.submenu) {
                      if (isMobile) {
                        setMobileSub(
                          mobileSub === opt.value ? null : opt.value,
                        );
                      }
                    } else {
                      select(opt.value);
                      handleCategoryChange(opt.value);
                      handleButtonClick(opt.value);
                    }
                  }}
                  onMouseEnter={() => {
                    if (!isMobile && opt.submenu) {
                      setHovered(opt.value);
                      setSubmenuPosition(opt.value);
                    }
                  }}
                  className="w-full px-4 py-2.5 text-left flex items-center justify-between text-sm hover:bg-primary/10"
                >
                  <div className="flex items-center gap-2 truncate">
                    {opt.icon}
                    <span className="truncate">{opt.label}</span>
                  </div>

                  {opt.submenu && (
                    <ChevronRight
                      size={14}
                      className={`transition ${
                        mobileSub === opt.value ? "rotate-90" : ""
                      }`}
                    />
                  )}
                </button>

                {/* MOBILE SUBMENU */}
                {isMobile && mobileSub === opt.value && (
                  <div className="pl-5 border-l ml-3">
                    {opt.submenu?.map((sub) => (
                      <button
                        key={sub.value}
                        onClick={() => {
                          select(opt.value);
                          handleCategoryChange(opt.value);
                          handleButtonClick(sub.value);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-primary/10"
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* DESKTOP SUBMENU */}
                {!isMobile &&
                  hovered === opt.value &&
                  opt.submenu &&
                  createPortal(
                    <div
                      ref={submenuRef}
                      className="fixed z-50 w-60 bg-background border rounded-xl shadow-lg py-1"
                      style={{
                        top: pos.top,
                        left: pos.left,
                      }}
                      onMouseEnter={() => setHovered(opt.value)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      {opt.submenu.map((sub) => (
                        <button
                          key={sub.value}
                          onClick={() => {
                            select(opt.value);
                            handleCategoryChange(opt.value);
                            handleButtonClick(sub.value);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm hover:bg-primary/10"
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>,
                    document.body,
                  )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectWithSubmenu;
