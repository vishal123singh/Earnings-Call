// components/AboutSection.js
import styles from "../styles/About.module.css";

const AboutSection = () => {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.title}>
          📊 Unlock Insights with <span>AI-Powered Analysis</span>
        </h1>
        <p className={styles.subtitle}>
          Transform your earnings call transcripts into actionable insights
          with the power of artificial intelligence.
        </p>
      </section>

      {/* Mission Section */}
      <section className={styles.section}>
        <h2 className={styles.heading}>🚀 Our Mission</h2>
        <p className={styles.text}>
          Our mission is to empower investors and analysts by leveraging
          cutting-edge AI technology to uncover patterns, detect sentiment, and
          highlight key information from earnings call transcripts. We simplify
          the complexity of financial communication, so you make better
          decisions.
        </p>
      </section>

      {/* How It Works Section */}
      <section className={styles.section}>
        <h2 className={styles.heading}>⚡ How It Works</h2>
        <p className={styles.text}>
          1. Upload your earnings call transcript. <br />
          2. Our AI analyzes tone, sentiment, and key takeaways. <br />
          3. Receive a detailed report with actionable insights.
        </p>
      </section>

      {/* Why Choose Us Section */}
      <section className={styles.section}>
        <h2 className={styles.heading}>💡 Why Choose Us?</h2>
        <ul className={styles.list}>
          <li>✅ Accurate sentiment analysis</li>
          <li>✅ Identify trends and patterns</li>
          <li>✅ Fast and reliable insights</li>
          <li>✅ Minimalist, intuitive dashboard</li>
        </ul>
      </section>

      {/* Contact Section */}
      <section className={styles.contact}>
        <h2 className={styles.heading}>📧 Get in Touch</h2>
        <p className={styles.text}>
          Have questions or want to learn more?{" "}
          <a href="mailto:support@aiinsights.com" className={styles.link}>
            Contact us!
          </a>
        </p>
      </section>
    </div>
  );
};

export default AboutSection;
