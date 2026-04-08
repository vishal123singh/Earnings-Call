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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CompaniesCarousel />
      <MetricsShowcase />
      <AIAssistantDemo />
      {/* <TestimonialsSection /> */}
      {/* <PricingSection /> */}
      <CTASection />
      <Footer />
    </div>
  );
}

// Hero Section
const HeroSection = () => {
  return (
    <section className="pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Background animated elements - hidden on mobile, visible on larger screens */}
      <div className="absolute top-0 right-0 w-48 sm:w-64 md:w-80 lg:w-96 h-48 sm:h-64 md:h-80 lg:h-96 bg-primary/20 rounded-full filter blur-3xl opacity-20 animate-pulse hidden sm:block"></div>
      <div className="absolute bottom-0 left-0 w-48 sm:w-64 md:w-80 lg:w-96 h-48 sm:h-64 md:h-80 lg:h-96 bg-secondary/20 rounded-full filter blur-3xl opacity-20 animate-pulse hidden sm:block"></div>

      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6 mx-auto lg:mx-0">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              AI-Powered Financial Intelligence
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-foreground via-primary to-primary/70 bg-clip-text text-transparent">
              Decode Earnings Calls in Seconds with AI
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 px-2 sm:px-0">
              Stop spending hours reviewing transcripts. Get instant insights on
              company performance, market trends, and investment opportunities
              through our intelligent AI assistant.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <button className="bg-primary text-primary-foreground px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base">
                Let's Get Started
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-6 sm:mt-8">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-background flex items-center justify-center text-background text-xs sm:text-sm font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center gap-1 justify-center sm:justify-start">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-500 text-yellow-500"
                    />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Trusted by 10,000+ investors
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Chat Interface */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mt-8 lg:mt-0"
          >
            <div className="bg-card rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden border border-border">
              <div className="bg-gradient-primary p-3 sm:p-4">
                <div className="flex items-center gap-2 text-primary-foreground">
                  <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-semibold text-sm sm:text-base">
                    AI Voice Assistant
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                {/* Chat Messages - Scrollable on mobile */}
                <div className="space-y-3 sm:space-y-4 max-h-[300px] sm:max-h-[400px] overflow-y-auto">
                  <ChatBubble
                    type="user"
                    message="What were JPM's key earnings drivers this quarter?"
                  />
                  <ChatBubble
                    type="ai"
                    message="JPMorgan Chase saw strong performance driven by 23% increase in investment banking fees and record net interest income of $24.5B. Consumer banking showed resilience with 15% growth in credit card spending."
                  />
                  <ChatBubble
                    type="user"
                    message="How does this compare to previous quarter?"
                  />
                  <ChatBubble
                    type="ai"
                    message="QoQ comparison shows 8% revenue growth, driven primarily by trading revenues (+32%) and wealth management (+12%). NIM expanded by 15 basis points to 2.85%."
                  />
                </div>

                {/* Input Area */}
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Ask about earnings..."
                    className="flex-1 px-3 sm:px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground text-sm sm:text-base"
                  />
                  <button className="bg-primary text-primary-foreground px-4 sm:px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base">
                    Send
                  </button>
                </div>
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-16 h-16 sm:w-24 sm:h-24 bg-destructive rounded-full filter blur-2xl opacity-30 pointer-events-none"></div>
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

// Features Section
const FeaturesSection = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Assistant",
      description:
        "Chat-based interface for asking questions about earnings calls. Get instant, accurate answers.",
      gradient: "from-primary to-primary/70",
    },
    {
      icon: <Mic className="w-8 h-8" />,
      title: "Voice Assistant",
      description:
        "Hands-free interaction using AI voice input/output. Ask questions naturally.",
      gradient: "from-secondary to-secondary/70",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Real-time Metrics",
      description:
        "Track key financial indicators across multiple companies with live updates.",
      gradient: "from-chart-1 to-chart-1/70",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Sentiment Analysis",
      description:
        "Analyze emotional tone and sentiment in earnings transcripts instantly.",
      gradient: "from-destructive to-destructive/70",
    },
    {
      icon: <LineChart className="w-8 h-8" />,
      title: "Performance Charts",
      description:
        "Dynamic charts and visualizations of financial data and trends.",
      gradient: "from-chart-2 to-chart-2/70",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Competitive Insights",
      description: "Compare financial metrics across competitors side-by-side.",
      gradient: "from-chart-3 to-chart-3/70",
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Earnings Calendar",
      description:
        "Track upcoming earnings announcements and never miss a call.",
      gradient: "from-chart-4 to-chart-4/70",
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Transcript Management",
      description: "Search and access historical earnings transcripts easily.",
      gradient: "from-chart-5 to-chart-5/70",
    },
  ];

  return (
    <section id="features" className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Powerful Features for Financial Intelligence
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to decode earnings calls and make informed
            investment decisions
          </p>
        </div>
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
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { delay: index * 0.1 } },
      }}
      className="group bg-card rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-border"
    >
      <div
        className={`w-16 h-16 rounded-xl bg-gradient-to-r ${gradient} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
};

// How It Works Section
const HowItWorksSection = () => {
  const steps = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Upload or Select Transcript",
      description:
        "Choose from our library of earnings call transcripts or upload your own",
      step: "01",
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Analysis",
      description:
        "Our AI processes the transcript, extracting key insights and sentiment",
      step: "02",
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Interactive Q&A",
      description: "Ask questions naturally through chat or voice interface",
      step: "03",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Get Insights",
      description:
        "Receive actionable insights, comparisons, and recommendations",
      step: "04",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-20 px-4 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground">
            Get insights in 4 simple steps
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-primary to-primary/70 rounded-2xl flex items-center justify-center text-white mb-4 relative">
                  {step.icon}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-destructive rounded-full flex items-center justify-center text-sm font-bold text-destructive-foreground">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-primary/30">
                  <ChevronRight className="absolute right-0 top-1/2 transform -translate-y-1/2 text-primary/50" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Metrics Showcase
const MetricsShowcase = () => {
  const metrics = [
    { label: "Revenue Growth", value: "+23.5%", trend: "up", color: "green" },
    { label: "Net Income", value: "$12.4B", trend: "up", color: "green" },
    { label: "EPS", value: "$3.45", trend: "up", color: "green" },
    { label: "ROE", value: "18.2%", trend: "up", color: "green" },
    { label: "Debt/Equity", value: "1.45", trend: "down", color: "green" },
    { label: "P/E Ratio", value: "12.3x", trend: "neutral", color: "yellow" },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Real-time Financial Metrics
          </h2>
          <p className="text-xl text-primary-foreground/80">
            Live data from major financial institutions
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <p className="text-primary-foreground/80 mb-2">{metric.label}</p>
              <p className="text-3xl font-bold mb-2">{metric.value}</p>
              {metric.trend === "up" && (
                <div className="flex items-center gap-1 text-green-400">
                  <TrendingUp className="w-4 h-4" /> +12% vs last quarter
                </div>
              )}
              {metric.trend === "down" && (
                <div className="flex items-center gap-1 text-red-400">
                  <TrendingUp className="w-4 h-4 transform rotate-180" /> -8% vs
                  last quarter
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// AI Assistant Demo
const AIAssistantDemo = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

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
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              AI Voice Assistant
            </h2>
            <p className="text-xl text-muted-foreground mb-6">
              Interact with earnings call data naturally using voice commands.
              Ask questions, get summaries, and compare companies hands-free.
            </p>
            <div className="space-y-4">
              <Feature icon={<Mic />} text="Voice-controlled interface" />
              <Feature
                icon={<MessageSquare />}
                text="Natural language understanding"
              />
              <Feature icon={<Brain />} text="Contextual responses" />
              <Feature icon={<Zap />} text="Real-time answers" />
            </div>

            <Button
              onClick={() => setIsOpen(true)}
              className="group mt-6 rounded-full w-full sm:w-[60vw] md:w-[40vw] lg:w-[20vw] max-w-[280px] py-3 sm:py-4 lg:py-5 px-4 sm:px-6 bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/30 transition-transform transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Try Voice Assistant <Mic className="w-5 h-5" />
              <motion.div
                initial={{ x: 0 }}
                whileHover={{ x: 8 }}
                transition={{ type: "spring", stiffness: 150, damping: 12 }}
                className="group-hover:translate-x-2"
              >
                <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
              </motion.div>
            </Button>
            <ChatStep
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              onExploreMore={() => setIsLoginOpen(true)}
              handleSwitchToVoice={handleSwitchToVoice}
            />
          </div>
          <div className="bg-gradient-primary rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center justify-center mb-6">
              <div
                className={`w-32 h-32 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center cursor-pointer transition-all ${
                  isListening ? "animate-pulse scale-110" : "hover:scale-105"
                }`}
                onClick={toggleListening}
              >
                <Mic className="w-12 h-12 text-white" />
              </div>
            </div>
            <div className="text-center text-white mb-4">
              {isListening ? "Listening..." : "Click to start speaking"}
            </div>
            {transcript && (
              <div className="bg-white/10 rounded-lg p-4 text-white">
                <p className="text-sm">You said:</p>
                <p className="mt-1">{transcript}</p>
              </div>
            )}
            <div className="mt-6 space-y-2">
              <Suggestion text="What were JPM's earnings this quarter?" />
              <Suggestion text="Compare MSFT and SOFI performance" />
              <Suggestion text="Summarize the CEO's outlook" />
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
const CTASection = () => {
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
          <button className="bg-background text-foreground px-8 py-3 rounded-lg font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2">
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
                <a href="#" className="hover:text-foreground transition">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Blog
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-foreground transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-foreground font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Security
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">
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
