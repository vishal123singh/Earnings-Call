// pages/about.js
import Head from "next/head";
import AboutSection from "../components/AboutSection";

export default function About() {
  return (
    <div>
      <Head>
        <title>About Us | AI Earnings Insights</title>
        <meta
          name="description"
          content="AI-powered insights for earnings call transcripts."
        />
      </Head>
      <main>
        <AboutSection />
      </main>
    </div>
  );
}
