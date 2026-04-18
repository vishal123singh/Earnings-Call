"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const MetricsShowcase = () => {
  const metrics = [
    { label: "Revenue Growth", value: "+23.5%", trend: "up" },
    { label: "Net Income", value: "$12.4B", trend: "up" },
    { label: "EPS", value: "$3.45", trend: "up" },
    { label: "ROE", value: "18.2%", trend: "up" },
    { label: "Debt/Equity", value: "1.45", trend: "down" },
    { label: "P/E Ratio", value: "12.3x", trend: "neutral" },
  ];

  const getStyles = (trend: string) => {
    if (trend === "up") {
      return {
        icon: <TrendingUp size={16} />,
        color: "text-emerald-300",
        bg: "bg-emerald-500/20",
        border: "border-emerald-400/30",
        glow: "from-emerald-400/40",
        text: "+12% vs last quarter",
      };
    }
    if (trend === "down") {
      return {
        icon: <TrendingDown size={16} />,
        color: "text-red-300",
        bg: "bg-red-500/20",
        border: "border-red-400/30",
        glow: "from-red-400/40",
        text: "-8% vs last quarter",
      };
    }
    return {
      icon: <Minus size={16} />,
      color: "text-yellow-300",
      bg: "bg-yellow-500/20",
      border: "border-yellow-400/30",
      glow: "from-yellow-400/40",
      text: "Stable vs last quarter",
    };
  };

  return (
    <section className="py-28 px-6 bg-gradient-to-br from-primary via-primary/90 to-black text-primary-foreground relative overflow-hidden">
      {/* ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_60%)]" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Financial Metrics
          </h2>
          <p className="text-primary-foreground/70 text-lg">
            Real-time insights across key performance indicators
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {metrics.map((metric, index) => {
            const styles = getStyles(metric.trend);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                viewport={{ once: true }}
                className="group relative rounded-3xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden hover:-translate-y-2 transition-all duration-300"
              >
                {/* gradient glow on hover */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br ${styles.glow} via-transparent to-transparent`}
                />

                {/* label */}
                <p className="text-sm text-primary-foreground/60 mb-2">
                  {metric.label}
                </p>

                {/* value */}
                <h3 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
                  {metric.value}
                </h3>

                {/* trend */}
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${styles.bg} ${styles.border} ${styles.color}`}
                >
                  {styles.icon}
                  {styles.text}
                </div>

                {/* subtle bottom glow line */}
                <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MetricsShowcase;
