"use client";
import { ParentContext } from "./clientLayout";
import ChatStep from "./components/home/homepage/EarningsAssitant";
import CompaniesCarousel from "./components/home/homepage/CompaniesCarousel";
import { useState, useEffect, useRef, useContext } from "react";
import {
  ChevronRight,
  Mic,
  BarChart3,
  TrendingUp,
  Calendar,
  MessageSquare,
  Brain,
  Zap,
  Users,
  LineChart,
  Play,
  Star,
  ArrowRight,
  CheckCircle,
  FileText,
  Sparkles,
} from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Button } from "./components/ui/button";
import { useSelector } from "react-redux";
import { DemoModal } from "./components/Demo";
import { useRouter } from "next/navigation";

import { AnimatePresence } from "framer-motion";

import {
  LineChart as RechartLineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { Area, AreaChart, XAxis, YAxis } from "recharts";
import Image from "next/image";
import LogoImage from "@/assets/images/logo_3.png";

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
      {/* <TestimonialsSection /> */}
      {/* <PricingSection /> */}
      <CTASection router={router} />
      <Footer />
    </div>
  );
}

const HeroSection = ({ router }) => {
  const [openDemo, setOpenDemo] = useState(false);

  return (
    <section className="relative pt-28 pb-20 px-6 overflow-hidden bg-background">
      {/* background glow system */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl opacity-30" />
      <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl opacity-30" />

      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
              <Sparkles className="w-4 h-4" />
              InvestorEye • AI Financial Intelligence
            </div>

            {/* headline */}
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4">
              See Beyond Numbers
              <span className="block text-gradient-primary">
                with AI-Powered Earnings Insights
              </span>
            </h1>

            {/* subtext */}
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl">
              InvestorEye helps you instantly decode earnings calls, uncover
              hidden signals, track sentiment, and analyze financial performance
              — all in one intelligent platform.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push("/insights")}
                className="cursor-pointer btn-premium px-6 py-3 rounded-xl flex items-center gap-2"
              >
                Explore Insights
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* <button
                onClick={() => setOpenDemo(true)}
                className="px-6 py-3 rounded-xl border border-border hover:bg-muted transition"
              >
                Watch Demo
              </button> */}

              <DemoModal open={openDemo} setOpen={setOpenDemo} />
            </div>

            {/* TRUST STRIP */}
            <div className="mt-10 flex items-center gap-6 flex-wrap">
              {/* avatars */}
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-background flex items-center justify-center text-xs font-bold text-white"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>

              {/* rating */}
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-500 text-yellow-500"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Trusted by investors & analysts
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT - AI TERMINAL */}

          <InvestorEyeDemo />
        </div>
      </div>
    </section>
  );
};

const ChatBubble = ({ type, message }) => (
  <div className={`flex ${type === "user" ? "justify-end" : "justify-start"}`}>
    <div
      className={`max-w-[90%] sm:max-w-[80%] p-2 sm:p-3 rounded-lg text-sm sm:text-sm ${
        type === "user"
          ? "bg-primary text-primary-foreground rounded-br-none"
          : "bg-muted text-muted-foreground rounded-bl-none"
      }`}
    >
      {message}
    </div>
  </div>
);

const FeaturesSection = () => {
  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Assistant",
      description:
        "Chat-based interface for asking questions about earnings calls.",
      gradient: "from-primary to-secondary",
    },
    {
      icon: <Mic className="w-6 h-6" />,
      title: "Voice Assistant",
      description:
        "Hands-free interaction using natural voice commands and responses.",
      gradient: "from-secondary to-tertiary",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Real-time Metrics",
      description:
        "Live financial indicators across global companies and markets.",
      gradient: "from-chart-1 to-primary",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Sentiment Analysis",
      description:
        "Detect emotional tone and investor sentiment from transcripts.",
      gradient: "from-destructive to-accent",
    },
    {
      icon: <LineChart className="w-6 h-6" />,
      title: "Performance Charts",
      description: "Interactive charts for financial trends and comparisons.",
      gradient: "from-chart-2 to-chart-3",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Competitive Insights",
      description:
        "Benchmark companies side-by-side for smarter investment decisions.",
      gradient: "from-chart-3 to-secondary",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Earnings Calendar",
      description:
        "Never miss earnings calls with smart scheduling and alerts.",
      gradient: "from-chart-4 to-accent",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Transcript Management",
      description:
        "Search and analyze historical earnings call transcripts instantly.",
      gradient: "from-chart-5 to-primary",
    },
  ];

  return (
    <section id="features" className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-5 text-gradient-primary p-2">
            Powerful Features for Financial Intelligence
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Everything you need to decode earnings calls and make informed
            investment decisions
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description, gradient, index }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 25 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { delay: index * 0.08 },
        },
      }}
      className="group relative card-premium p-6 overflow-hidden hover:-translate-y-2 transition-all duration-300"
    >
      {/* top glow line */}
      <div
        className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${gradient} opacity-70`}
      />

      {/* background number */}
      <span className="absolute -top-4 -right-2 text-6xl font-bold text-muted/10 select-none">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* icon orb */}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-gradient-to-r ${gradient} text-white shadow-lg group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>

      {/* title */}
      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>

      {/* description */}
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {/* hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
    </motion.div>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Ingest Earnings Data",
      description:
        "Access earnings call transcripts, financial metrics, and market data across multiple companies in one place.",
      step: "01",
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Extracts Signals",
      description:
        "InvestorEye analyzes transcripts to detect key drivers, sentiment shifts, risks, and hidden financial signals.",
      step: "02",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Ask Anything",
      description:
        "Use chat or voice to ask questions like a conversation — compare quarters, detect trends, or explore risks instantly.",
      step: "03",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Visualize & Decide",
      description:
        "Get charts, insights, and comparisons to make faster, data-driven investment decisions.",
      step: "04",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-24 px-6 bg-gradient-to-br from-[#2563eb]/5 via-background to-[#8b5cf6]/5"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#2563eb] to-[#8b5cf6] bg-clip-text text-transparent">
            How InvestorEye Works
          </h2>
          <p className="text-lg text-muted-foreground">
            From earnings calls → insights, charts, and decisions in seconds
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12 }}
              className="relative group"
            >
              <div className="card-premium p-6 h-full relative overflow-hidden">
                {/* Step Number */}
                <span className="absolute -top-6 -right-2 text-7xl font-bold text-muted/10 select-none">
                  {step.step}
                </span>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r from-[#2563eb] to-[#8b5cf6] text-white shadow-lg mb-5 group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>

                {/* Hover Glow */}
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#2563eb] to-[#8b5cf6] opacity-0 group-hover:opacity-100 transition" />
              </div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 right-[-20px] w-10 h-[2px] bg-gradient-to-r from-[#2563eb]/40 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const MetricsShowcase = () => {
  const metrics = [
    { label: "Revenue Growth", value: "+23.5%", trend: "up" },
    { label: "Net Income", value: "$12.4B", trend: "up" },
    { label: "EPS", value: "$3.45", trend: "up" },
    { label: "ROE", value: "18.2%", trend: "up" },
    { label: "Debt/Equity", value: "1.45", trend: "down" },
    { label: "P/E Ratio", value: "12.3x", trend: "neutral" },
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground relative overflow-hidden">
      {/* subtle glow overlay */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white,transparent_60%)]" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Real-time Financial Metrics
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            Live data from major financial institutions
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric, index) => {
            const isUp = metric.trend === "up";
            const isDown = metric.trend === "down";

            return (
              <div
                key={index}
                className="group relative rounded-2xl p-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-white/15"
              >
                {/* top glow line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition" />

                {/* Label */}
                <p className="text-primary-foreground/70 text-sm mb-2">
                  {metric.label}
                </p>

                {/* Value */}
                <p className="text-3xl font-bold mb-3 tracking-tight">
                  {metric.value}
                </p>

                {/* Trend badge */}
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border
                    ${
                      isUp
                        ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/30"
                        : isDown
                          ? "bg-red-500/20 text-red-200 border-red-400/30"
                          : "bg-yellow-500/20 text-yellow-200 border-yellow-400/30"
                    }
                  `}
                >
                  {isUp && "▲"}
                  {isDown && "▼"}
                  {!isUp && !isDown && "●"}

                  {isUp && "+12% vs last quarter"}
                  {isDown && "-8% vs last quarter"}
                  {!isUp && !isDown && "Stable vs last quarter"}
                </div>
              </div>
            );
          })}
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
        <div className="relative">
          <div className="card-premium p-8 relative overflow-hidden">
            {/* AI glow background */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,#2563eb,transparent_60%)]" />

            {/* HEADER */}
            <div className="flex items-center justify-between mb-8 relative">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm text-muted-foreground">
                  AI Listening
                </span>
              </div>

              <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                LIVE
              </span>
            </div>

            {/* BIG MIC ORB */}
            <div className="flex items-center justify-center mb-6">
              <div
                onClick={toggleListening}
                className={`relative w-36 h-36 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300
                ${
                  isListening
                    ? "animate-pulse-glow scale-110"
                    : "hover:scale-105"
                }
                bg-gradient-to-r from-primary via-secondary to-tertiary shadow-lg`}
              >
                <Mic className="w-14 h-14 text-white" />

                {/* outer ring */}
                <div className="absolute inset-0 rounded-full border border-white/20 scale-110" />
              </div>
            </div>

            {/* STATUS */}
            <div className="text-center mb-6">
              <p className="font-medium">
                {isListening
                  ? "Listening to your question..."
                  : "Tap to start speaking"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Powered by AI financial intelligence
              </p>
            </div>

            {/* TRANSCRIPT */}
            {transcript && (
              <div className="mb-6 p-4 rounded-xl bg-muted border border-border">
                <p className="text-xs text-muted-foreground mb-1">You said</p>
                <p className="text-sm font-medium">{transcript}</p>
              </div>
            )}

            {/* SUGGESTIONS */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground mb-2">Try asking:</p>

              {[
                "What were JPM earnings this quarter?",
                "Compare MSFT vs SOFI performance",
                "Summarize CEO outlook",
              ].map((q, i) => (
                <button
                  key={i}
                  className="w-full text-left px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted transition text-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
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

const Suggestion = ({ text }) => (
  <div className="bg-muted rounded-lg p-3 text-foreground hover:bg-muted/80 cursor-pointer transition-colors">
    "{text}"
  </div>
);

// Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Hedge Fund Manager",
      content:
        "This platform has revolutionized how we analyze earnings calls. The AI insights are incredibly accurate and save us hours of manual work.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Financial Analyst",
      content:
        "The voice assistant is a game-changer. I can now get answers while reviewing other data. Highly recommended!",
      rating: 5,
    },
    {
      name: "David Williams",
      role: "Investment Advisor",
      content:
        "Competitive insights feature helps us identify market trends before they become obvious. Invaluable tool.",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            What Our Users Say
          </h2>
          <p className="text-xl text-muted-foreground">
            Trusted by financial professionals worldwide
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-lg border border-border"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-destructive text-destructive"
                  />
                ))}
              </div>
              <p className="text-foreground mb-4 italic">
                "{testimonial.content}"
              </p>
              <div>
                <p className="font-semibold text-foreground">
                  {testimonial.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Pricing Section
const PricingSection = () => {
  const plans = [
    {
      name: "Starter",
      price: "$49",
      period: "month",
      features: [
        "Up to 10 companies",
        "Basic AI insights",
        "Email support",
        "Monthly reports",
      ],
      highlighted: false,
    },
    {
      name: "Professional",
      price: "$99",
      period: "month",
      features: [
        "Unlimited companies",
        "Advanced AI insights",
        "Voice assistant",
        "Priority support",
        "Real-time metrics",
        "Competitive analysis",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      features: [
        "Everything in Professional",
        "Custom integrations",
        "Dedicated account manager",
        "SLA guarantee",
        "On-premise deployment",
      ],
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground">
            Choose the plan that works for you
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl p-8 ${
                plan.highlighted
                  ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground transform scale-105 shadow-2xl"
                  : "bg-muted border border-border"
              }`}
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-sm">/{plan.period}</span>}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`cursor-pointer w-full py-3 rounded-lg font-semibold transition-all ${
                  plan.highlighted
                    ? "bg-background text-foreground hover:shadow-lg"
                    : "bg-primary text-primary-foreground hover:shadow-lg"
                }`}
              >
                Get Started
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

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

// Footer
const Footer = () => {
  return (
    <footer className="bg-card text-muted-foreground py-12 px-4 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src={LogoImage}
                alt="InvestorEye Logo"
                width={60}
                height={60}
                className="object-contain w-[60px] sm:w-[60px] md:w-[80px] lg:w-[80px] h-auto"
                priority
              />
            </div>
            <p className="text-sm">
              AI-powered platform for decoding earnings call transcripts and
              extracting financial insights.
            </p>
          </div>
          <div>
            <h4 className="text-foreground font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="hover:text-foreground transition"
                >
                  Features
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-foreground font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="hover:text-foreground transition">
                  About
                </a>
              </li>

              <li>
                <a href="/contact" className="hover:text-foreground transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-foreground font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/privacy-policy"
                  className="hover:text-foreground transition"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms-of-service"
                  className="hover:text-foreground transition"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/security"
                  className="hover:text-foreground transition"
                >
                  Security
                </a>
              </li>
              <li>
                <a
                  href="/compliance"
                  className="hover:text-foreground transition"
                >
                  Compliance
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center text-sm">
          <p>&copy; 2024 EarningsCall Insights. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
