export default function CompliancePage() {
  return (
    <main className="min-h-screen bg-background text-foreground pb-24">
      {/* HERO */}
      <section className="py-24 px-6 text-center hero-gradient">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-gradient-primary">
            Compliance
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Our platform follows strict compliance standards to ensure data
            security, transparency, and responsible AI usage.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Overview */}
          <div className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-3">1. Overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              InvestorEye is designed with compliance-first architecture,
              ensuring responsible handling of financial data, AI-generated
              insights, and third-party integrations.
            </p>
          </div>

          {/* Data Privacy Compliance */}
          <div className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-3">
              2. Data Privacy Compliance
            </h2>
            <ul className="text-muted-foreground space-y-2 list-disc pl-5">
              <li>
                Aligned with GDPR principles (data minimization & transparency)
              </li>
              <li>Respects user data access and deletion rights</li>
              <li>No selling of user personal data</li>
              <li>Secure handling of financial and usage data</li>
            </ul>
          </div>

          {/* Financial Data Disclaimer */}
          <div className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-3">
              3. Financial Data Compliance
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              All financial data is sourced from third-party providers such as
              Yahoo Finance, Alpha Vantage, and Financial Modeling Prep. We do
              not guarantee accuracy and users should not treat insights as
              financial advice.
            </p>
          </div>

          {/* AI Compliance */}
          <div className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-3">
              4. AI Usage Compliance
            </h2>
            <ul className="text-muted-foreground space-y-2 list-disc pl-5">
              <li>AI models are used strictly for informational analysis</li>
              <li>No training on private user data</li>
              <li>Outputs are probabilistic, not deterministic</li>
              <li>Human responsibility required for financial decisions</li>
            </ul>
          </div>

          {/* Security Standards */}
          <div className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-3">
              5. Security Standards
            </h2>
            <ul className="text-muted-foreground space-y-2 list-disc pl-5">
              <li>Encrypted communication (TLS/HTTPS)</li>
              <li>Secure AWS infrastructure (S3, IAM roles)</li>
              <li>API authentication & rate limiting</li>
              <li>Regular monitoring and abuse detection</li>
            </ul>
          </div>

          {/* Third-Party Compliance */}
          <div className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-3">
              6. Third-Party Services
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We integrate with OpenAI, AWS Bedrock, OpenRouter, Google Cloud,
              and financial data providers. Each provider operates under its own
              compliance and privacy policies.
            </p>
          </div>

          {/* User Responsibility */}
          <div className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-3">
              7. User Responsibility
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Users are responsible for how they interpret and use AI-generated
              insights. The platform should not be used as a sole source for
              financial decision-making.
            </p>
          </div>

          {/* Regulatory Note */}
          <div className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-3">8. Regulatory Note</h2>
            <p className="text-muted-foreground leading-relaxed">
              This platform is not a registered financial advisory service. It
              provides analytical tools and insights for informational purposes
              only.
            </p>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground pt-6">
            Last updated: April 2026
          </div>
        </div>
      </section>
    </main>
  );
}
