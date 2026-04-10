export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground pb-24">
      {/* HERO */}
      <section className="py-24 px-6 text-center hero-gradient">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-gradient-cool">
            Contact Us
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Have questions, feedback, or partnership inquiries? We’d love to
            hear from you.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="card-premium p-6">
              <h2 className="text-xl font-semibold mb-3">Get in Touch</h2>
              <p className="text-muted-foreground">
                Reach out for support, feature requests, or collaboration
                opportunities.
              </p>
            </div>

            <div className="card-premium p-6">
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-muted-foreground">
                support@earningscallinsights.com
              </p>
            </div>

            <div className="card-premium p-6">
              <h3 className="font-semibold mb-2">Response Time</h3>
              <p className="text-muted-foreground">
                We typically respond within 24–48 hours.
              </p>
            </div>

            <div className="card-premium p-6">
              <h3 className="font-semibold mb-2">For Enterprises</h3>
              <p className="text-muted-foreground">
                For enterprise integrations or partnerships, please mention
                “Enterprise” in your subject line.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card-premium p-6">
            <h2 className="text-xl font-semibold mb-6">Send a Message</h2>

            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="input-premium w-full"
              />

              <input
                type="email"
                placeholder="Your Email"
                className="input-premium w-full"
              />

              <input
                type="text"
                placeholder="Subject"
                className="input-premium w-full"
              />

              <textarea
                placeholder="Your Message"
                rows={5}
                className="input-premium w-full resize-none"
              />

              <button
                type="submit"
                className="btn-premium w-full py-3 rounded-xl"
              >
                Send Message
              </button>
            </form>

            <p className="text-xs text-muted-foreground mt-4 text-center">
              We respect your privacy. Your information is never shared.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
