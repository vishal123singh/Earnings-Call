export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <section className="py-24 px-6 text-center hero-gradient">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-gradient-primary">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-lg">
            Your privacy matters to us. This policy explains how we collect,
            use, and protect your information.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Section 1 */}
          <div className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-3">1. Overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              InvestorEye is an AI-powered financial analytics platform. We are
              committed to protecting your personal data and ensuring
              transparency in how we use it.
            </p>
          </div>

          {/* Section 2 */}
          <div className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-3">
              2. Information We Collect
            </h2>
            <ul className="text-muted-foreground space-y-2 list-disc pl-5">
              <li>Account information (email, name if provided)</li>
              <li>Usage data (queries, interactions with AI assistant)</li>
              <li>Device and browser information</li>
              <li>API request logs for performance and debugging</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-3">3. How We Use Data</h2>
            <ul className="text-muted-foreground space-y-2 list-disc pl-5">
              <li>To provide AI-powered financial insights</li>
              <li>To improve system performance and accuracy</li>
              <li>To generate analytics and sentiment analysis</li>
              <li>To ensure platform security and prevent abuse</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-3">4. Data Sharing</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell personal data. We may share limited information
              with trusted third-party services (such as OpenAI, AWS, and
              financial data providers) strictly for processing requests.
            </p>
          </div>

          {/* Section 5 */}
          <div className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-3">5. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use industry-standard security practices including encryption,
              secure API authentication, and protected cloud storage (AWS S3) to
              safeguard your data.
            </p>
          </div>

          {/* Section 6 */}
          <div className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-3">
              6. Third-Party Services
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Our platform integrates with services such as OpenAI, AWS Bedrock,
              Yahoo Finance, Alpha Vantage, and other financial data providers.
              Each may have its own privacy policy.
            </p>
          </div>

          {/* Section 7 */}
          <div className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-3">7. Your Rights</h2>
            <ul className="text-muted-foreground space-y-2 list-disc pl-5">
              <li>Access your stored data</li>
              <li>Request deletion of your data</li>
              <li>Opt out of analytics tracking (where applicable)</li>
            </ul>
          </div>

          {/* Section 8 */}
          <div className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-3">
              8. Changes to This Policy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy periodically. Updates will be
              reflected on this page with a revised effective date.
            </p>
          </div>

          {/* Footer Note */}
          <div className="text-center text-sm text-muted-foreground pt-6">
            Last updated: April 2026
          </div>
        </div>
      </section>
    </main>
  );
}
