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
    transition: { staggerChildren: 0.1 },
  },
};

/* -------------------------------- SECTION -------------------------------- */

export default function FeaturesSection() {
  return (
    <section className="relative py-28 px-6 overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(2,119,199,0.15),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(77,208,225,0.15),transparent_40%)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/20 mb-5 backdrop-blur">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">Features</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight text-foreground">
            Built for how investors
            <br />
            <span className="bg-gradient-to-r from-[#0277C7] to-[#4DD0E1] bg-clip-text text-transparent">
              actually think
            </span>
          </h2>

          <p className="mt-4 text-muted-foreground">
            A smarter workflow to decode earnings calls faster.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-min"
        >
          <div className="md:col-span-2 md:row-span-2">
            <HeroCard feature={features[0]} />
          </div>

          <div className="space-y-5">
            {features.slice(1, 3).map((f, i) => (
              <MiniCard key={i} feature={f} index={i} />
            ))}
          </div>

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
      whileHover={{ y: -6, scale: 1.01 }}
      className="group relative h-full p-6 rounded-2xl border border-white/10 
      bg-gradient-to-br from-[#0F1D4A]/90 to-[#0277C7]/80 
      backdrop-blur-xl overflow-hidden transition-all duration-500
      hover:shadow-[0_20px_60px_rgba(2,119,199,0.25)]"
    >
      {/* Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-[#0277C7]/20 via-transparent to-[#4DD0E1]/20" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#0277C7]/20 to-[#4DD0E1]/20 text-[#4DD0E1]">
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
        </div>

        <p className="text-white/80 leading-relaxed">{feature.description}</p>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-5" />

        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-[#4DD0E1] text-sm">→</span>
              <span className="text-sm text-white/90">
                {feature.preview.prompt}
              </span>
            </div>
            <div className="flex items-start gap-2 pl-4">
              <ArrowRight className="w-3 h-3 text-white/50 mt-0.5" />
              <span className="text-sm text-white/70">
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
      whileHover={{ y: -4 }}
      className="group p-4 rounded-xl border border-white/10 
      bg-white/5 backdrop-blur-md 
      transition-all duration-300 
      hover:bg-white/10 hover:shadow-lg hover:shadow-[#0277C7]/10"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-[#0277C7]/20 to-[#4DD0E1]/20 text-[#4DD0E1]">
          <Icon className="w-4 h-4" />
        </div>

        <div className="flex-1">
          <h4 className="font-medium text-sm text-foreground">
            {feature.title}
          </h4>
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
      whileHover={{ y: -4 }}
      className="group p-5 rounded-xl border border-white/10 
      bg-gradient-to-br from-white/5 to-transparent 
      backdrop-blur-md transition-all duration-300 
      hover:shadow-lg hover:shadow-[#0277C7]/10 hover:border-[#0277C7]/30"
    >
      <div className="flex items-center gap-4">
        <div className="p-2.5 rounded-lg bg-gradient-to-br from-[#0277C7]/20 to-[#4DD0E1]/20 text-[#4DD0E1]">
          <Icon className="w-5 h-5" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h4 className="font-medium text-foreground">{feature.title}</h4>
              <p className="text-sm text-muted-foreground mt-0.5">
                {feature.description}
              </p>
            </div>

            {feature.metric && (
              <div className="px-2 py-1 rounded-md bg-[#00B894]/10">
                <span className="text-xs font-medium text-[#00B894]">
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
