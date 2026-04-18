"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Mic,
  BarChart3,
  TrendingUp,
  LineChart,
  Users,
  Calendar,
  ArrowRight,
  Sparkles,
} from "lucide-react";

/* ---------------------------------- DATA --------------------------------- */

const features = [
  {
    icon: Brain,
    title: "AI Earnings Assistant",
    description:
      "Ask complex financial questions and get structured insights instantly.",
    type: "hero",
    preview: {
      prompt: "> What changed in guidance this quarter?",
      response: "Revenue outlook increased by 8%, margin guidance narrowed...",
    },
  },
  {
    icon: Mic,
    title: "Voice Interface",
    description: "Interact hands-free with natural voice commands.",
  },
  {
    icon: TrendingUp,
    title: "Sentiment Tracking",
    description: "Understand tone and confidence shifts instantly.",
  },
  {
    icon: BarChart3,
    title: "Real-time Metrics",
    description: "Track live indicators across global markets.",
    metric: "+12%",
  },
  {
    icon: LineChart,
    title: "Performance Charts",
    description: "Visualize trends with interactive charts.",
  },
  {
    icon: Users,
    title: "Competitive Insights",
    description: "Benchmark companies side-by-side.",
  },
  {
    icon: Calendar,
    title: "Earnings Calendar",
    description: "Stay ahead with smart alerts.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/* -------------------------------- SECTION -------------------------------- */

export default function FeaturesSection() {
  return (
    <section className="relative py-28 px-6 overflow-hidden">
      {/* Minimal background - just one subtle gradient */}
      <div className="absolute inset-0 hero-gradient opacity-30" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Minimal Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">Features</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
            Built for how investors
            <br />
            <span className="text-primary">actually think</span>
          </h2>

          <p className="mt-4 text-muted-foreground">
            A smarter workflow to decode earnings calls faster.
          </p>
        </motion.div>

        {/* Minimal Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-min"
        >
          {/* Hero Card */}
          <div className="md:col-span-2 md:row-span-2">
            <HeroCard feature={features[0]} />
          </div>

          {/* Mini Cards */}
          <div className="space-y-5">
            {features.slice(1, 3).map((f, i) => (
              <MiniCard key={i} feature={f} index={i} />
            ))}
          </div>

          {/* Wide Cards */}
          {features.slice(3).map((f, i) => (
            <WideCard key={i} feature={f} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------ HERO CARD ------------------------------ */

const HeroCard = ({ feature }) => {
  const Icon = feature.icon;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      }}
      whileHover={{ y: -2 }}
      className="group relative h-full p-6 rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg"
    >
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-semibold">{feature.title}</h3>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          {feature.description}
        </p>

        {/* Preview */}
        <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-primary text-sm">→</span>
              <span className="text-sm text-foreground/80">
                {feature.preview.prompt}
              </span>
            </div>
            <div className="flex items-start gap-2 pl-4">
              <ArrowRight className="w-3 h-3 text-muted-foreground mt-0.5" />
              <span className="text-sm text-muted-foreground">
                {feature.preview.response}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ------------------------------ MINI CARD ------------------------------ */

const MiniCard = ({ feature, index }) => {
  const Icon = feature.icon;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: 20 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { delay: index * 0.1, duration: 0.4 },
        },
      }}
      whileHover={{ y: -2 }}
      className="group p-4 rounded-lg border border-border bg-card transition-all duration-300 hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Icon className="w-4 h-4" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm">{feature.title}</h4>
            {feature.badge && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                {feature.badge}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {feature.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

/* ------------------------------ WIDE CARD ------------------------------ */

const WideCard = ({ feature, index }) => {
  const Icon = feature.icon;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { delay: index * 0.1, duration: 0.4 },
        },
      }}
      whileHover={{ y: -2 }}
      className="group p-5 rounded-lg border border-border bg-card transition-all duration-300 hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
          <Icon className="w-5 h-5" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h4 className="font-medium">{feature.title}</h4>
              <p className="text-sm text-muted-foreground mt-0.5">
                {feature.description}
              </p>
            </div>
            {feature.metric && (
              <div className="px-2 py-1 rounded-md bg-success/10">
                <span className="text-xs font-medium text-success">
                  {feature.metric}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
