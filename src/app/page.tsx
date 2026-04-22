"use client";
import { ParentContext } from "./clientLayout";
import ChatStep from "./components/home/homepage/EarningsAssitant";
import CompaniesCarousel from "./components/home/homepage/CompaniesCarousel";
import { useState, useEffect, useRef, useContext } from "react";
import {
  Mic,
  BarChart3,
  TrendingUp,
  Calendar,
  MessageSquare,
  Brain,
  Zap,
  Users,
  LineChart,
  Star,
  ArrowRight,
  CheckCircle,
  FileText,
  Sparkles,
} from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { ResponsiveContainer, Tooltip } from "recharts";
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import Image from "next/image";
import LogoImage from "@/assets/images/logo_3.png";
import MetricsShowcase from "./components/home/homepage/MetricsShowcase";
import FeaturesSection from "./components/home/homepage/Features";

const chartData = [
  { q: "Q1", value: 40, revenue: 42 },
  { q: "Q2", value: 55, revenue: 58 },
  { q: "Q3", value: 70, revenue: 74 },
  { q: "Q4", value: 85, revenue: 89 },
];

const flow = [
  { type: "user", text: "What drove JPM earnings this quarter?" },
  {
    type: "ai",
    text: "JPM earnings were driven by strong investment banking (+23%) and record net interest income of $24.5B.",
  },
  { type: "insight" },
  { type: "user", text: "Show revenue trend vs last quarter" },
  { type: "thinking" },
  { type: "chart" },
  {
    type: "ai",
    text: "Revenue grew 8% QoQ with strong trading and wealth management performance.",
  },
];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
          {label}
        </p>
        <p className="text-lg font-bold text-primary">${payload[0].value}M</p>
      </div>
    );
  }
  return null;
};

function InvestorEyeDemo() {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const chatRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, typing]);

  // Simulate online/offline status
  useEffect(() => {
    const interval = setInterval(() => {
      setIsOnline((prev) => !prev);
      setTimeout(() => setIsOnline(true), 2000);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let i = 0;
    let isMounted = true;

    const run = () => {
      if (!isMounted) return;

      if (i >= flow.length) {
        setTimeout(() => {
          if (isMounted) {
            setMessages([]);
            setTyping(null);
            i = 0;
            run();
          }
        }, 4000);
        return;
      }

      const step = flow[i];

      if (step.type === "user") {
        typeText(step.text, "user", () => {
          i++;
          setTimeout(run, 600);
        });
      } else if (step.type === "ai") {
        setTyping("thinking");
        setTimeout(() => {
          typeText(step.text, "ai", () => {
            setTyping(null);
            i++;
            setTimeout(run, 800);
          });
        }, 1000);
      } else {
        setMessages((prev) => [...prev, step]);
        i++;
        setTimeout(run, 1000);
      }
    };

    run();
    return () => {
      isMounted = false;
    };
  }, []);

  const typeText = (text, role, cb) => {
    let idx = 0;
    let current = "";

    const interval = setInterval(() => {
      current += text[idx];
      setTyping({ role, text: current });
      idx++;

      if (idx >= text.length) {
        clearInterval(interval);
        setMessages((prev) => [...prev, { type: role, text }]);
        setTyping(null);
        cb();
      }
    }, 25);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Premium card container */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 backdrop-blur-sm">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

        {/* HEADER - Enhanced */}
        <div className="relative px-5 py-4 bg-gradient-to-r from-primary via-primary/90 to-secondary text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${isOnline ? "bg-green-400" : "bg-yellow-400"} animate-pulse`}
                />
                <div
                  className={`absolute inset-0 w-2.5 h-2.5 rounded-full ${isOnline ? "bg-green-400" : "bg-yellow-400"} animate-ping opacity-75`}
                />
              </div>
              <div>
                <span className="font-semibold text-base tracking-tight">
                  InvestorEye AI
                </span>
                <p className="text-xs opacity-90">
                  Real-time financial intelligence
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* CHAT AREA - Enhanced */}
        <div
          ref={chatRef}
          className="p-5 space-y-4 h-[460px] overflow-y-auto bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 scroll-smooth"
        >
          <AnimatePresence mode="popLayout">
            {messages.map((m, idx) => {
              if (m.type === "user") {
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="flex justify-end"
                  >
                    <div className="max-w-[85%] sm:max-w-[75%]">
                      <div className="text-sm p-3.5 rounded-2xl rounded-br-md bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg shadow-primary/20">
                        {m.text}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1 text-right">
                        Just now
                      </div>
                    </div>
                  </motion.div>
                );
              }

              if (m.type === "ai") {
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[85%] sm:max-w-[75%]">
                      <div className="text-sm p-3.5 rounded-2xl rounded-bl-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-md">
                        {m.text}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1">
                        InvestorEye AI
                      </div>
                    </div>
                  </motion.div>
                );
              }

              if (m.type === "insight") {
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="my-2"
                  >
                    <div className="relative p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 shadow-sm">
                      <div className="absolute -top-2 left-4 px-2 bg-blue-500 text-white text-[10px] font-semibold rounded-full">
                        KEY INSIGHTS
                      </div>
                      <ul className="space-y-2 mt-2">
                        <li className="flex items-center gap-2 text-sm">
                          <span className="text-xl">📈</span>
                          <span>
                            Investment Banking:{" "}
                            <strong className="text-green-600 dark:text-green-400">
                              +23%
                            </strong>
                          </span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <span className="text-xl">💰</span>
                          <span>
                            Net Interest Income: <strong>$24.5B</strong>
                          </span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <span className="text-xl">🏦</span>
                          <span>
                            Trading Revenue:{" "}
                            <strong className="text-green-600 dark:text-green-400">
                              +32%
                            </strong>
                          </span>
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                );
              }

              if (m.type === "chart") {
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="my-2"
                  >
                    <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Revenue Trend Analysis
                        </p>
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          <span className="w-2 h-2 rounded-full bg-purple-500" />
                        </div>
                      </div>
                      <ResponsiveContainer width="100%" height={160}>
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient
                              id="colorValue"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#3B82F6"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="#3B82F6"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <XAxis
                            dataKey="q"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#6B7280" }}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#6B7280" }}
                            tickFormatter={(value) => `$${value}M`}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            fill="url(#colorValue)"
                            dot={{
                              fill: "#3B82F6",
                              r: 4,
                              strokeWidth: 2,
                              stroke: "#fff",
                            }}
                            activeDot={{ r: 6, fill: "#3B82F6" }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                      <div className="flex justify-between mt-2 text-[10px] text-gray-400">
                        <span>Q1 2024</span>
                        <span>Q2 2024</span>
                        <span>Q3 2024</span>
                        <span>Q4 2024</span>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              return null;
            })}
          </AnimatePresence>

          {/* TYPING INDICATOR - Enhanced */}
          {typing && typing !== "thinking" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${typing.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] ${typing.role === "user" ? "bg-gradient-to-r from-primary to-primary/90 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100"} rounded-2xl p-3.5 shadow-md`}
              >
                <div className="flex items-center gap-1">
                  {typing.text}
                  <span className="inline-block w-0.5 h-4 bg-current animate-pulse ml-0.5" />
                </div>
              </div>
            </motion.div>
          )}

          {/* THINKING INDICATOR - Enhanced */}
          {typing === "thinking" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-md">
                <div className="flex gap-1.5">
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* INPUT AREA - Enhanced */}
        <div className="relative p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="flex gap-2 items-center">
            <div className="flex-1 relative">
              <input
                className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                placeholder="Ask InvestorEye about markets, earnings, or trends..."
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                <span className="text-[10px] text-gray-400">⌘K</span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium shadow-lg shadow-primary/25 hover:shadow-xl transition-all"
            >
              Send
            </motion.button>
          </div>
          <div className="flex gap-3 mt-2 text-[10px] text-gray-400 justify-center">
            <span>💡 Try: "Compare with Goldman Sachs"</span>
            <span>⚡ "Risk analysis"</span>
          </div>
        </div>

        {/* Decorative glow effects */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <HeroSection router={router} />
      <FeaturesSection />
      <HowItWorksSection />
      <CompaniesCarousel />
      <MetricsShowcase />
      <AIAssistantDemo />
      <CTASection router={router} />
      <Footer />
    </div>
  );
}

const HeroSection = ({ router }) => {
  return (
    <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-background">
      {/* BACKGROUND SYSTEM (theme-aware) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(2,119,199,0.15),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(41,182,246,0.15),transparent_40%)]" />

      {/* subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* BADGE */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full 
            bg-accent/10 border border-accent/20 backdrop-blur-md mb-6"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-accent text-sm font-medium">
                InvestorEye • Financial Intelligence
              </span>
            </div>

            {/* HEADLINE */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight mb-6 tracking-tight">
              <span className="text-foreground">See Beyond Numbers</span>
              <br />
              <span className="text-gradient-cool">
                with AI-Powered Insights
              </span>
            </h1>

            {/* SUBTEXT */}
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl">
              Decode earnings calls instantly, uncover hidden signals, and track
              market sentiment — all in one intelligent platform designed for
              modern investors.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push("/insights")}
                className="group btn-premium px-6 py-3 rounded-xl flex items-center gap-2"
              >
                Explore Insights
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* TRUST STRIP */}
            <div className="mt-10 flex items-center gap-6 flex-wrap">
              {/* avatars */}
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full 
                    bg-gradient-primary 
                    border-2 border-background 
                    flex items-center justify-center 
                    text-xs font-semibold text-white shadow-md"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>

              {/* rating */}
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-secondary-green text-secondary-green"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Trusted by investors & analysts worldwide
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            {/* glow using theme */}
            <div className="absolute inset-0 bg-gradient-accent opacity-20 blur-2xl rounded-3xl" />

            <div className="relative">
              <InvestorEyeDemo />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Ingest Earnings Data",
      description:
        "Access transcripts, financial metrics, and market data across companies in one unified system.",
      step: "01",
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: "AI Extracts Signals",
      description:
        "Detect key drivers, sentiment shifts, risks, and hidden financial signals automatically.",
      step: "02",
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "Ask Anything",
      description:
        "Query insights naturally — compare quarters, trends, or risks in seconds.",
      step: "03",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Visualize & Decide",
      description:
        "Turn insights into charts and make faster, data-driven decisions.",
      step: "04",
    },
  ];

  return (
    <section id="how-it-works" className="relative py-28 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient opacity-30" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* HEADER */}
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            How InvestorEye Works
          </h2>
          <p className="text-muted-foreground text-lg">
            From raw earnings calls → structured insights → faster decisions
          </p>
        </div>

        {/* FLOW */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12 }}
              className="relative group"
            >
              {/* CARD */}
              <div
                className="relative h-full p-6 rounded-2xl border border-border 
  bg-white/60 dark:bg-white/5 backdrop-blur-xl 
  flex flex-col
  transition-all duration-300 
  hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2"
              >
                {/* top glow */}
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-primary opacity-0 group-hover:opacity-100 transition" />

                {/* HEADER */}
                <div className="flex items-center justify-between mb-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center 
    bg-gradient-primary text-white shadow-md"
                  >
                    {step.icon}
                  </div>

                  <span className="text-xs font-medium text-muted-foreground tracking-wider">
                    STEP {step.step}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed mt-auto">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* CONNECTOR LINE */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 right-[-28px] items-center">
                  <div className="w-12 h-[2px] bg-gradient-to-r from-primary/40 to-transparent" />
                  <div className="w-2 h-2 rounded-full bg-primary/40" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AIAssistantDemo = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  const isUserLoggedIn = useSelector((state: any) => state.user.isUserLoggedIn);

  const { setIsLoginOpen, isVoiceAssistantOpen, setIsVoiceAssistantOpen } =
    useContext(ParentContext);

  const [isOpen, setIsOpen] = useState(false);

  const handleSwitchToVoice = () => {
    setIsOpen(false);
    setIsVoiceAssistantOpen(!isVoiceAssistantOpen);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT CONTENT */}
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-5 text-gradient-cool">
            AI Voice Assistant
          </h2>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Interact with earnings call data naturally using voice commands. Ask
            questions, get summaries, and compare companies hands-free.
          </p>

          <div className="space-y-4">
            <Feature icon={<Mic />} text="Voice-controlled interface" />
            <Feature
              icon={<MessageSquare />}
              text="Natural language understanding"
            />
            <Feature
              icon={<Brain />}
              text="Context-aware financial intelligence"
            />
            <Feature icon={<Zap />} text="Real-time AI responses" />
          </div>

          {/* CTA */}
          <button
            onClick={() => setIsOpen(true)}
            className="cursor-pointer mt-8 btn-premium px-6 py-3 rounded-xl flex items-center gap-3"
          >
            Try Voice Assistant
            <Mic className="w-5 h-5" />
          </button>

          <ChatStep
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            onExploreMore={() => !isUserLoggedIn && setIsLoginOpen(true)}
            handleSwitchToVoice={handleSwitchToVoice}
            isUserLoggedIn={isUserLoggedIn}
          />
        </div>

        {/* RIGHT AI PANEL */}

        <SentimentDemoCard />
      </div>
    </section>
  );
};

const Feature = ({ icon, text }) => (
  <div className="flex items-center gap-3">
    <div className="text-primary">{icon}</div>
    <span className="text-foreground">{text}</span>
  </div>
);

// CTA Section
const CTASection = ({ router }) => {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-primary to-primary/80">
      <div className="max-w-4xl mx-auto text-center text-primary-foreground">
        <h2 className="text-4xl font-bold mb-4">
          Ready to Transform Your Earnings Call Analysis?
        </h2>
        <p className="text-xl mb-8 text-primary-foreground/80">
          Join thousands of investors who use AI to gain competitive advantage
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push("/insights")}
            className="bg-background text-foreground px-8 py-3 rounded-lg font-semibold cursor-pointer hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            Let's Get Started <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-border">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-gradient-cool opacity-10" />
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" />

      <div className="bg-background relative max-w-7xl mx-auto px-6 py-16">
        {/* GRID */}
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Image
                src={LogoImage}
                alt="InvestorEye Logo"
                width={70}
                height={70}
                className="object-contain"
                priority
              />
              {/* <span className="text-lg font-semibold text-foreground tracking-tight">
                InvestorEye
              </span> */}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              AI-powered platform for decoding earnings calls and uncovering
              real financial signals with precision.
            </p>
          </div>

          {/* PRODUCT */}
          <div>
            <h4 className="text-foreground font-semibold mb-4 tracking-tight">
              Product
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#features"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Features
                </a>
              </li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="text-foreground font-semibold mb-4 tracking-tight">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h4 className="text-foreground font-semibold mb-4 tracking-tight">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/privacy-policy"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms-of-service"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/security"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Security
                </a>
              </li>
              <li>
                <a
                  href="/compliance"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Compliance
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="relative mb-6">
          <div className="h-px w-full bg-border" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-40" />
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2024 InvestorEye. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <a
              href="/privacy-policy"
              className="hover:text-primary transition-colors"
            >
              Privacy
            </a>
            <a
              href="/terms-of-service"
              className="hover:text-primary transition-colors"
            >
              Terms
            </a>
            <a href="/contact" className="hover:text-primary transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const demoSentiment = {
  label: "Neutral",
  confidence: 0.78,
  summary:
    "Apple reported December quarter revenue of $117.2B, down 5% YoY due to FX headwinds and supply constraints, while services and iPad showed strong growth.",
  key_insights: [
    "Revenue declined 5% YoY impacted by FX",
    "Services hit record $20.8B revenue",
    "iPad grew 30% YoY",
    "Gross margin improved to 43%",
  ],
  risks: [
    "Foreign exchange volatility",
    "Weak macro demand",
    "Supply chain constraints",
  ],
  opportunities: [
    "Emerging market growth (India, Brazil)",
    "Services expansion",
    "New product launches",
  ],
  management_tone: "Confident but cautious amid macro uncertainty",
  notable_quotes: [
    "We remain confident in long-term growth.",
    "Our installed base reached 2 billion devices.",
  ],
};

function SentimentDemoCard() {
  const sentiment = demoSentiment;

  const sentimentColor =
    sentiment.label === "Positive"
      ? "text-emerald-500 bg-emerald-500/10"
      : sentiment.label === "Negative"
        ? "text-red-500 bg-red-500/10"
        : "text-yellow-500 bg-yellow-500/10";

  return (
    <div className="card-premium p-6 md:p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">AI Sentiment Analysis</h2>
          <p className="text-sm text-muted-foreground">
            Earnings call intelligence summary
          </p>
        </div>

        <div
          className={`px-4 py-1 rounded-full text-sm font-medium ${sentimentColor}`}
        >
          {sentiment.label}
        </div>
      </div>

      {/* CONFIDENCE BAR */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>Confidence</span>
          <span>{Math.round(sentiment.confidence * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${sentiment.confidence * 100}%` }}
          />
        </div>
      </div>

      {/* SUMMARY */}
      <div className="p-4 rounded-xl bg-muted border border-border">
        <p className="text-sm leading-relaxed">{sentiment.summary}</p>
      </div>

      {/* GRID SECTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* KEY INSIGHTS */}
        <Section title="Key Insights" items={sentiment.key_insights} />

        {/* RISKS */}
        <Section title="Risks" items={sentiment.risks} variant="red" />

        {/* OPPORTUNITIES */}
        <Section
          title="Opportunities"
          items={sentiment.opportunities}
          variant="green"
        />

        {/* MANAGEMENT TONE */}
        <div className="p-4 rounded-xl border bg-background">
          <h3 className="text-sm font-semibold mb-2">Management Tone</h3>
          <p className="text-sm text-muted-foreground">
            {sentiment.management_tone}
          </p>
        </div>
      </div>

      {/* QUOTES */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Notable Quotes</h3>
        <div className="space-y-2">
          {sentiment.notable_quotes.map((q, i) => (
            <div
              key={i}
              className="p-3 rounded-lg border bg-muted text-sm italic"
            >
              “{q}”
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Reusable Section Component
const Section = ({
  title,
  items,
  variant,
}: {
  title: string;
  items: string[];
  variant?: "red" | "green";
}) => {
  const color =
    variant === "red"
      ? "text-red-500"
      : variant === "green"
        ? "text-emerald-500"
        : "text-primary";

  return (
    <div className="p-4 rounded-xl border bg-background">
      <h3 className={`text-sm font-semibold mb-2 ${color}`}>{title}</h3>
      <ul className="space-y-1 text-sm text-muted-foreground">
        {items.map((item, i) => (
          <li key={i}>• {item}</li>
        ))}
      </ul>
    </div>
  );
};
