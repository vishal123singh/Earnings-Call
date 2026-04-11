export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-background text-foreground pb-24">
      {/* HERO */}
      <section className="py-24 px-6 text-center hero-gradient">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-gradient-cool">
            Security
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            We take security seriously. Your data, analytics, and interactions
            are protected using industry-standard practices.
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
              InvestorEye is built with a security-first approach. We protect
              financial data, user interactions, and API usage using modern
              encryption and cloud security standards.
            </p>
          </div>

          {/* Data Protection */}
          <div className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-3">2. Data Protection</h2>
            <ul className="text-muted-foreground space-y-2 list-disc pl-5">
              <li>All API communication is encrypted via HTTPS (TLS)</li>
              <li>Sensitive data is stored securely in AWS services</li>
              <li>Access to services is restricted via IAM roles</li>
              <li>
                No raw sensitive financial credentials are stored client-side
              </li>
            </ul>
          </div>

          {/* API Security */}
          <div className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-3">3. API Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              All backend APIs are protected using authentication keys, rate
              limiting, and request validation to prevent abuse and ensure
              system stability.
            </p>
          </div>

          {/* AI Safety */}
          <div className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-3">4. AI Safety</h2>
            <p className="text-muted-foreground leading-relaxed">
              AI-generated insights are sandboxed and processed securely using
              providers like OpenAI, AWS Bedrock, and OpenRouter. No personal
              sensitive data is used for model training.
            </p>
          </div>

          {/* Authentication */}
          <div className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-3">5. Authentication</h2>
            <ul className="text-muted-foreground space-y-2 list-disc pl-5">
              <li>Secure API key-based authentication</li>
              <li>Google OAuth (if enabled)</li>
              <li>Session-based access control</li>
            </ul>
          </div>

          {/* Storage Security */}
          <div className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-3">6. Cloud & Storage</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use AWS S3 for secure file storage, with restricted bucket
              policies and encrypted data at rest and in transit.
            </p>
          </div>

          {/* Monitoring */}
          <div className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-3">
              7. Monitoring & Abuse Prevention
            </h2>
            <ul className="text-muted-foreground space-y-2 list-disc pl-5">
              <li>Request logging for anomaly detection</li>
              <li>Rate limiting on sensitive endpoints</li>
              <li>reCAPTCHA protection for public forms</li>
              <li>Automated abuse detection systems</li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-3">8. Responsibility</h2>
            <p className="text-muted-foreground leading-relaxed">
              While we implement strong security measures, users are responsible
              for maintaining the confidentiality of their own credentials and
              access tokens.
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
