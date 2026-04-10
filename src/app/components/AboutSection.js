export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* HERO */}
      <section className="py-24 px-6 text-center hero-gradient">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tight mb-6 p-2 text-gradient-primary">
            About Earnings Call Insights
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed">
            An AI-powered financial intelligence platform that transforms
            earnings call transcripts into actionable insights in seconds.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-gradient-cool">
              Our Mission
            </h2>

            <p className="text-muted-foreground leading-relaxed">
              We eliminate the time barrier in financial research. Instead of
              reading long earnings call transcripts, users get instant AI
              insights, sentiment signals, and financial breakdowns in seconds.
            </p>
          </div>

          <div className="card-premium p-6">
            <p className="text-sm text-muted-foreground mb-2">
              Core Philosophy
            </p>

            <p className="text-lg font-semibold">
              Faster insights → Better decisions → Smarter investing
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6 bg-muted">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gradient-secondary">
            What We Offer
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "AI earnings call analysis",
              "Real-time financial metrics",
              "Sentiment tracking engine",
              "Voice AI assistant",
              "Interactive financial charts",
              "Competitive benchmarking",
              "Earnings calendar tracking",
              "Historical transcript search",
              "Market data integration",
            ].map((item, i) => (
              <div key={i} className="card-premium p-5">
                <p className="font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gradient-cool">
            Technology Stack
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-premium p-6">
              <h3 className="font-semibold mb-3">Frontend</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Next.js (App Router)</li>
                <li>React + TypeScript</li>
                <li>Tailwind CSS</li>
                <li>Shadcn/ui</li>
                <li>Framer Motion</li>
              </ul>
            </div>

            <div className="card-premium p-6">
              <h3 className="font-semibold mb-3">AI & Backend</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>OpenAI API</li>
                <li>AWS Bedrock</li>
                <li>OpenRouter</li>
                <li>Node.js APIs</li>
                <li>Ollama (Local LLM)</li>
              </ul>
            </div>

            <div className="card-premium p-6">
              <h3 className="font-semibold mb-3">Data & Analytics</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Chart.js</li>
                <li>Yahoo Finance API</li>
                <li>Alpha Vantage</li>
                <li>Financial Modeling Prep</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 px-6 bg-muted">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            ["9+", "AI Modules"],
            ["10+", "Data Sources"],
            ["Real-time", "Market Data"],
            ["Multi", "Company Coverage"],
          ].map(([value, label], i) => (
            <div key={i} className="stat-card-premium">
              <p className="stat-value-premium">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto glass-premium p-10 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4 text-gradient-primary">
            Built for Financial Intelligence
          </h2>

          <p className="text-muted-foreground mb-6">
            Empowering investors and analysts with AI-driven insights from
            earnings calls and financial data.
          </p>

          <button className="btn-premium px-6 py-3 rounded-xl">
            Get Started
          </button>
        </div>
      </section>
    </main>
  );
}
