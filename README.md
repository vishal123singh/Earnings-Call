# InvestorEye

An AI-powered platform for analyzing earnings call transcripts, extracting financial insights, and generating intelligent summaries with real-time data visualization.

## 🎯 Overview

InvestorEye is a comprehensive Next.js application that leverages artificial intelligence to decode earnings call transcripts in seconds. Rather than spending hours reviewing lengthy transcripts, users can get instant insights on company performance, market trends, and investment opportunities through an intuitive AI-powered interface.

## ✨ Key Features

- **AI-Powered Earnings Assistant**: Chat-based interface for asking questions about earnings calls
- **Voice Assistant**: Hands-free interaction using AI voice input/output
- **Real-time Financial Metrics**: Track key financial indicators across multiple companies
- **Sentiment Analysis**: Analyze emotional tone and sentiment in earnings transcripts
- **Financial Performance Charts**: Dynamic charts and visualizations of financial data
- **Competitive Insights**: Compare financial metrics across competitors
- **Earnings Calendar**: Track upcoming earnings announcements
- **Transcript Management**: Search and access historical earnings transcripts
- **Market Metrics**: Real-time market data integration
- **Multi-Company Support**: Monitor multiple companies (ASB, JPM, MS, MSFT, SOFI, BAC, etc.)

## 🛠️ Technology Stack

### Frontend

- **Next.js 16.2.2** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality UI components
- **Framer Motion** - Animation library
- **Redux Toolkit** - State management

### Backend & APIs

- **Node.js** - Server runtime
- **OpenAI API** - LLM for AI insights
- **OpenRouter** - Alternative AI model routing
- **AWS Bedrock** - Enterprise AI services
- **AWS S3** - File storage
- **Ollama** - Local LLM capability

### Data & Analytics

- **Chart.js** - Data visualization
- **IgniteUI Charts** - Advanced charting components
- **Yahoo Finance API** - Market data
- **Alpha Vantage** - Stock data
- **Financial Modeling Prep** - Comprehensive financial data

### External Services

- **Google Cloud** - Cloud services
- **Zoho** - CRM integration
- **Apollo API** - Company intelligence
- **reCAPTCHA** - Security

## 📁 Project Structure

```
earnings-call-insights/
├── src/
│   ├── app/
│   │   ├── api/                    # API routes
│   │   │   ├── ai-voice-assistant/ # Voice AI functionality
│   │   │   ├── charts-api/         # Chart data endpoints
│   │   │   ├── financial-metrics/  # Financial data APIs
│   │   │   ├── insights-api/       # AI insights generation
│   │   │   ├── sentiment-analysis/ # Sentiment analysis
│   │   │   ├── transcript/         # Transcript management
│   │   │   └── market-metrics/     # Market data
│   │   ├── components/             # Reusable components
│   │   ├── insights/               # Insights page
│   │   ├── sentiment-analysis/     # Sentiment analysis page
│   │   ├── transcript/             # Transcript viewer
│   │   ├── competitive-insights/   # Competitive analysis
│   │   └── page.tsx                # Landing page
│   ├── lib/                        # Utility functions
│   └── store/                      # Redux store
├── public/
│   ├── financial-metrics/          # Financial data files
│   ├── reports/                    # Company reports
│   └── sentiments/                 # Sentiment data
├── transcripts/                    # Historical transcripts
├── declaration/                    # TypeScript declarations
└── Configuration files
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Environment variables configured (see below)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd earnings-call-insights
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

### Environment Variables

Configure the following in your `.env.local` file:

```env
# AI & LLM APIs
OPENAI_API_KEY=<your-openai-key>
OPEN_ROUTER_API_KEY=<your-openrouter-key>
OPENROUTER_API_KEY=<your-openrouter-key>

# AWS Services
M_ACCESS_KEY_ID=<aws-access-key>
M_SECRET_ACCESS_KEY=<aws-secret>
S3_BUCKET_NAME=earnings-calls-transcripts

# Data APIs
ALPHA_VANTAGE_ACCESS_KEY=<alpha-vantage-key>
FMP_API_KEY=<financial-modeling-prep-key>
EARNINGS_CALLS_TRANSCRIPTS_API_KEY=<api-ninjas-key>

# Google Services
GOOGLE_CLIENT_ID=<google-client-id>
GOOGLE_CLIENT_SECRET=<google-secret>
GOOGLE_SERVICE_ACCOUNT_CRED=<google-service-account-json>

# Application
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_BACKEND_URL=<backend-url>
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=<recaptcha-key>
PYTHON_API_URL=<python-api-url>
```

### Running the Application

Development mode:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

Build for production:

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## 📊 Supported Companies

Currently supports financial metrics and analysis for:

- **JPM** (JPMorgan Chase)
- **MS** (Morgan Stanley)
- **MSFT** (Microsoft)
- **SOFI** (SoFi Technologies)
- **BAC** (Bank of America)
- **ASB** (Additional companies)
- **BKU** and more...

## 🔌 API Endpoints

Key API routes available:

- `POST /api/insights-api` - Generate AI insights
- `POST /api/sentiment-analysis` - Analyze sentiment
- `POST /api/charts-api` - Generate chart data
- `POST /api/financial-metrics` - Get financial metrics
- `POST /api/market-metrics` - Get market data
- `POST /api/transcript` - Access transcripts
- `POST /api/ai-voice-assistant` - Voice interaction
- `POST /api/generate-speech` - Text-to-speech
- `POST /api/voice-input` - Speech-to-text

## 🎨 Features in Detail

### AI Voice Assistant

Interact with earnings call data naturally using voice commands. The system can:

- Answer questions about earnings calls
- Provide financial insights
- Generate summaries
- Compare company metrics

### Sentiment Analysis

Analyze the emotional tone and sentiment across earnings transcripts:

- Identify positive/negative themes
- Track sentiment changes over time
- Correlate sentiment with market movements

### Financial Performance Visualization

Interactive charts showing:

- Revenue trends
- Profit margins
- Earnings per share (EPS)
- Debt ratios
- Cash flow metrics

### Competitive Insights

Compare financial metrics between competitors to identify:

- Market position
- Performance relative to peers
- Investment opportunities

## 🔐 Security

- reCAPTCHA integration for form protection
- API key validation
- Environment variable-based configuration
- AWS S3 secure file storage

## 📝 Contributing

Contributions are welcome! Please follow these steps:

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is private and proprietary. Unauthorized copying or modification is prohibited.

## 📧 Support

For support and inquiries, please contact the development team or open an issue in the repository.

---

**Built with ❤️ for financial intelligence**
