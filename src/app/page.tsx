"use client";
import { ParentContext } from "./layout";
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
              AI-Powered Financial Intelligence
            </div>

            {/* headline */}
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Decode Earnings Calls
              <span className="block text-gradient-primary">
                in Seconds with AI
              </span>
            </h1>

            {/* subtext */}
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl">
              Stop reading hours of transcripts. Get instant insights on
              revenue, sentiment, risks, and market impact — powered by advanced
              AI models.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push("/insights")}
                className="cursor-pointer btn-premium px-6 py-3 rounded-xl flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* <button
                onClick={() => setOpenDemo(true)}
                className="px-6 py-3 rounded-xl border border-border hover:bg-muted transition"
              >
                View Demo
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
                  Trusted by 10,000+ investors
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT - AI TERMINAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="card-premium overflow-hidden">
              {/* header */}
              <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    AI Financial Assistant
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs opacity-90">
                  <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                  LIVE
                </div>
              </div>

              {/* chat area */}
              <div className="p-5 space-y-4 max-h-[420px] overflow-y-auto bg-background">
                <ChatBubble
                  type="user"
                  message="What drove JPM earnings this quarter?"
                />

                <ChatBubble
                  type="ai"
                  message="JPM reported strong results driven by +23% investment banking growth and record net interest income of $24.5B."
                />

                <ChatBubble type="user" message="Compare with last quarter" />

                <ChatBubble
                  type="ai"
                  message="Revenue grew 8% QoQ, led by trading (+32%) and wealth management (+12%)."
                />
              </div>

              {/* input */}
              <div className="p-4 border-t border-border flex gap-2 bg-muted/30">
                <input
                  className="flex-1 px-4 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ask about earnings..."
                />
                <button className="btn-premium px-4 py-2 rounded-lg text-sm">
                  Send
                </button>
              </div>
            </div>

            {/* floating glow */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/30 blur-3xl rounded-full" />
          </motion.div>
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
      title: "Select Transcript",
      description: "Choose from our library of earnings call transcripts",
      step: "01",
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Analysis",
      description:
        "AI extracts insights, sentiment, risks, and financial signals",
      step: "02",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Ask Questions",
      description: "Chat or use voice to explore earnings data naturally",
      step: "03",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Get Insights",
      description: "Receive actionable insights, comparisons, and predictions",
      step: "04",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-24 px-6 bg-gradient-to-br from-primary/5 via-background to-secondary/5"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-primary">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            From raw earnings calls → actionable financial intelligence
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
                {/* background step number */}
                <span className="absolute -top-6 -right-2 text-7xl font-bold text-muted/10 select-none">
                  {step.step}
                </span>

                {/* icon orb */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r from-primary to-secondary text-white shadow-lg mb-5 group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>

                {/* title */}
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>

                {/* description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>

                {/* subtle glow line on hover */}
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-tertiary opacity-0 group-hover:opacity-100 transition" />
              </div>

              {/* connector (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 right-[-20px] w-10 h-[2px] bg-gradient-to-r from-primary/40 to-transparent" />
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
            className="mt-8 btn-premium px-6 py-3 rounded-xl flex items-center gap-3"
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
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
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
            className="bg-background text-foreground px-8 py-3 rounded-lg font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2"
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
              <Brain className="w-8 h-8 text-primary" />
              <span className="text-foreground font-bold text-lg">
                EarningsCall Insights
              </span>
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
