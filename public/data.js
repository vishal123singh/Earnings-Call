const suggestedQuestions = {
  "Common": {
    "Common Questions": [
      "What are the most common questions asked during the Q&A portion of earnings calls?",
      "How did management teams address those questions?",
      "What topics/themes did management teams devote the most time to on earnings calls? (or what topics/themes were most common across banks)",
      "Summarize comments management teams made on earnings calls about the external environment (the economy, the regulatory landscape, customer sentiment, expectations about interest rates, loan demand, deposit competition, customer sentiment are examples)",
      "What forward looking expectations did management teams provide about net interest margin?",
      "Summarize management’s comments about credit quality"]
  },
  "Financial Performance & Guidance": {
    "Common Questions": [
      "What were the most common financial questions analysts asked?",
      "What concerns did analysts raise about revenue, EPS, net income, margins, and loan growth?",
      "Did analysts ask about guidance for the next quarter/year? What was the management’s response?",
      "Were there any unexpected financial concerns analysts highlighted?",
      "How did competitors justify misses or beats on financial expectations?",
    ],
  },
  "Interest Rate & Macro Impact": {
    "Common Questions": [
      "What did analysts ask about the impact of Fed rate changes on net interest margin (NIM)?",
      "How did competitors respond to concerns about loan demand and deposit pricing pressure?",
      "Were there any discussions around inflation and economic outlook?",
    ],
  },
  "Loan Portfolio & Credit Risk": {
    "Common Questions": [
      "What questions did analysts ask regarding loan portfolio quality, delinquency rates, and charge-offs?",
      "How did competitors address concerns about credit risk and exposure to specific industries (e.g., CRE, C&I loans)?",
      "Did analysts probe into loan loss provisions and reserve levels?",
      "Were there any regulatory concerns about stress tests or liquidity management?",
    ],
  },
  "Deposit Trends & Liquidity": {
    "Common Questions": [
      "What concerns did analysts raise about deposit outflows and cost of deposits?",
      "How did competitors explain liquidity management strategies?",
      "Were there any discussions around CDs, money market accounts, and client behavior shifts?",
    ],
  },
  "Technology & Digital Banking": {
    "Common Questions": [
      "Did analysts question digital transformation, fintech partnerships, or investment in AI/automation?",
      "What strategies did competitors highlight for digital banking growth?",
      "Were there concerns about operational risks, cybersecurity, or compliance issues?",
    ],
  },
  "Capital Allocation & Shareholder Returns": {
    "Common Questions": [
      "What did analysts ask about dividends, stock buybacks, and capital deployment?",
      "How did competitors justify capital decisions in light of regulatory requirements and growth plans?",
      "Were there discussions around M&A activity or expansion plans?",
    ],
  },
  "Regulatory & Compliance Risks": {
    "Common Questions": [
      "Did analysts ask about compliance with Basel III, stress tests, or new banking regulations?",
      "Were there any concerns raised about government scrutiny, lawsuits, or regulatory penalties?",
    ],
  },
  "Competitive Landscape & Market Positioning": {
    "Common Questions": [
      "How did analysts probe into competitive threats (regional banks, fintech, big banks)?",
      "What differentiation strategies did competitors highlight?",
      "Were there any discussions on customer retention, product offerings, or geographic expansion?",
    ],
  },
  "Cost Management & Operational Efficiency": {
    "Common Questions": [
      "What did analysts ask about cost-cutting measures, efficiency ratio, and expense control?",
      "How did competitors address questions around branch optimization and workforce restructuring?",
    ],
  },
  "Strategic Initiatives & Long-Term Vision": {
    "Common Questions": [
      "What future growth initiatives were analysts most interested in?",
      "Were there any concerns about leadership changes, succession planning, or cultural shifts?",
    ],
  },



};

const years = [2024];
const quarters = ["1st", "2nd", "3rd", "4th"];


const companies = [
  {
    "name": "SoFi Technologies Inc.",
    "ticker": "SOFI",
    "logo": "https://logo.clearbit.com/sofi.com"
  },
  {
    "name": "Morgan Stanley",
    "ticker": "MS",
    "logo": "https://logo.clearbit.com/morganstanley.com"
  },
  {
    "name": "JPMorgan Chase & Co",
    "ticker": "JPM",
    "logo": "https://logo.clearbit.com/jpmorganchase.com"
  },
  {
    "name": "Microsoft Corp",
    "ticker": "MSFT",
    "logo": "https://logo.clearbit.com/microsoft.com"
  },
  {
    "name": "Ameris Bancorp",
    "ticker": "ABCB",
    "logo": "https://logo.clearbit.com/amerisbank.com"
  },
  {
    "name": "Associated Banc-Corp",
    "ticker": "ASB",
    "logo": "https://logo.clearbit.com/associatedbank.com"
  },
  {
    "name": "Atlantic Union Bankshares Corporation",
    "ticker": "AUB",
    "logo": "https://logo.clearbit.com/atlanticunionbank.com"
  },
  {
    "name": "Banc of California, Inc.",
    "ticker": "BANC",
    "logo": "https://logo.clearbit.com/bancofcal.com"
  },
  {
    "name": "Bank of America Corporation",
    "ticker": "BAC",
    "logo": "https://logo.clearbit.com/bankofamerica.com"
  },
  {
    "name": "Bank of Hawaii Corporation",
    "ticker": "BOH",
    "logo": "https://logo.clearbit.com/boh.com"
  },
  {
    "name": "Bank OZK",
    "ticker": "OZK",
    "logo": "https://logo.clearbit.com/ozk.com"
  },
  {
    "name": "BankUnited, Inc.",
    "ticker": "BKU",
    "logo": "https://logo.clearbit.com/bankunited.com"
  },
  {
    "name": "BOK Financial Corporation",
    "ticker": "BOKF",
    "logo": "https://logo.clearbit.com/bokf.com"
  },
  {
    "name": "Cadence Bank",
    "ticker": "CADE",
    "logo": "https://logo.clearbit.com/cadencebank.com"
  },
  {
    "name": "Cathay General Bancorp",
    "ticker": "CATY",
    "logo": "https://logo.clearbit.com/cathaybank.com"
  },
  {
    "name": "Citigroup Inc.",
    "ticker": "C",
    "logo": "https://logo.clearbit.com/citigroup.com"
  },
  {
    "name": "Citizens Financial Group, Inc.",
    "ticker": "CFG",
    "logo": "https://logo.clearbit.com/citizensbank.com"
  },
  {
    "name": "Columbia Banking System, Inc.",
    "ticker": "COLB",
    "logo": "https://logo.clearbit.com/columbiabank.com"
  },
  {
    "name": "Comerica Incorporated",
    "ticker": "CMA",
    "logo": "https://logo.clearbit.com/comerica.com"
  },
  {
    "name": "Commerce Bancshares, Inc.",
    "ticker": "CBSH",
    "logo": "https://logo.clearbit.com/commercebank.com"
  },
  {
    "name": "Cullen/Frost Bankers, Inc.",
    "ticker": "CFR",
    "logo": "https://logo.clearbit.com/frostbank.com"
  },
  {
    "name": "Customers Bancorp, Inc.",
    "ticker": "CUBI",
    "logo": "https://logo.clearbit.com/customersbank.com"
  },
  {
    "name": "East West Bancorp, Inc.",
    "ticker": "EWBC",
    "logo": "https://logo.clearbit.com/eastwestbank.com"
  },
  {
    "name": "Eastern Bankshares, Inc.",
    "ticker": "EBC",
    "logo": "https://logo.clearbit.com/easternbank.com"
  },
  {
    "name": "F.N.B. Corporation",
    "ticker": "FNB",
    "logo": "https://logo.clearbit.com/fnb-online.com"
  },
  {
    "name": "Fifth Third Bancorp",
    "ticker": "FITB",
    "logo": "https://logo.clearbit.com/53.com"
  },
  {
    "name": "First Citizens BancShares, Inc.",
    "ticker": "FCNC.A",
    "logo": "https://logo.clearbit.com/firstcitizens.com"
  },
  {
    "name": "First Hawaiian, Inc.",
    "ticker": "FHB",
    "logo": "https://logo.clearbit.com/fhb.com"
  },
  {
    "name": "First Horizon Corporation",
    "ticker": "FHN",
    "logo": "https://logo.clearbit.com/firsthorizon.com"
  },
  {
    "name": "First Interstate BancSystem, Inc.",
    "ticker": "FIBK",
    "logo": "https://logo.clearbit.com/firstinterstatebank.com"
  },
  {
    "name": "Flagstar Financial, Inc.",
    "ticker": "FLG",
    "logo": "https://logo.clearbit.com/flagstar.com"
  },
  {
    "name": "Fulton Financial Corporation",
    "ticker": "FULT",
    "logo": "https://logo.clearbit.com/fultonbank.com"
  },
  {
    "name": "Glacier Bancorp, Inc.",
    "ticker": "GBCI",
    "logo": "https://logo.clearbit.com/glacierbank.com"
  },
  {
    "name": "Hancock Whitney Corporation",
    "ticker": "HWC",
    "logo": "https://logo.clearbit.com/hancockwhitney.com"
  },
  {
    "name": "Home Bancshares, Inc.",
    "ticker": "HOMB",
    "logo": "https://logo.clearbit.com/homebancshares.com"
  },
  {
    "name": "Huntington Bancshares Incorporated",
    "ticker": "HBAN",
    "logo": "https://logo.clearbit.com/huntington.com"
  },
  {
    "name": "KeyCorp",
    "ticker": "KEY",
    "logo": "https://logo.clearbit.com/key.com"
  },
  {
    "name": "M&T Bank Corporation",
    "ticker": "MTB",
    "logo": "https://logo.clearbit.com/mtb.com"
  },
  {
    "name": "Old National Bancorp",
    "ticker": "ONB",
    "logo": "https://logo.clearbit.com/oldnational.com"
  },
  {
    "name": "Pinnacle Financial Partners, Inc.",
    "ticker": "PNFP",
    "logo": "https://logo.clearbit.com/pnfp.com"
  },
  {
    "name": "Popular, Inc.",
    "ticker": "BPOP",
    "logo": "https://logo.clearbit.com/popular.com"
  },
  {
    "name": "Prosperity Bancshares, Inc.",
    "ticker": "PB",
    "logo": "https://logo.clearbit.com/prosperitybankusa.com"
  },
  {
    "name": "Provident Financial Services, Inc.",
    "ticker": "PFS",
    "logo": "https://logo.clearbit.com/provident.bank"
  },
  {
    "name": "Regions Financial Corporation",
    "ticker": "RF",
    "logo": "https://logo.clearbit.com/regions.com"
  },
  {
    "name": "Simmons First National Corporation",
    "ticker": "SFNC",
    "logo": "https://logo.clearbit.com/simmonsbank.com"
  },
  {
    "name": "SouthState Corporation",
    "ticker": "SSB",
    "logo": "https://logo.clearbit.com/southstatebank.com"
  },
  {
    "name": "Synovus Financial Corp.",
    "ticker": "SNV",
    "logo": "https://logo.clearbit.com/synovus.com"
  },
  {
    "name": "Texas Capital Bancshares, Inc.",
    "ticker": "TCBI",
    "logo": "https://logo.clearbit.com/texascapitalbank.com"
  },
  {
    "name": "The PNC Financial Services Group, Inc.",
    "ticker": "PNC",
    "logo": "https://logo.clearbit.com/pnc.com"
  },
  {
    "name": "Truist Financial Corporation",
    "ticker": "TFC",
    "logo": "https://logo.clearbit.com/truist.com"
  },
  {
    "name": "U.S. Bancorp",
    "ticker": "USB",
    "logo": "https://logo.clearbit.com/usbank.com"
  },
  {
    "name": "UMB Financial Corporation",
    "ticker": "UMBF",
    "logo": "https://logo.clearbit.com/umb.com"
  },
  {
    "name": "United Bankshares, Inc.",
    "ticker": "UBSI",
    "logo": "https://logo.clearbit.com/ubsi-inc.com"
  },
  {
    "name": "United Community Banks, Inc.",
    "ticker": "UCB",
    "logo": "https://logo.clearbit.com/ucbi.com"
  },
  {
    "name": "Valley National Bancorp",
    "ticker": "VLY",
    "logo": "https://logo.clearbit.com/valley.com"
  },
  {
    "name": "Webster Financial Corporation",
    "ticker": "WBS",
    "logo": "https://logo.clearbit.com/websteronline.com"
  },
  {
    "name": "Wells Fargo & Company",
    "ticker": "WFC",
    "logo": "https://logo.clearbit.com/wellsfargo.com"
  },
  {
    "name": "Western Alliance Bancorporation",
    "ticker": "WAL",
    "logo": "https://logo.clearbit.com/westernalliancebancorporation.com"
  },
  {
    "name": "Wintrust Financial Corporation",
    "ticker": "WTFC",
    "logo": "https://logo.clearbit.com/wintrust.com"
  },
  {
    "name": "WSFS Financial Corporation",
    "ticker": "WSFS",
    "logo": "https://logo.clearbit.com/wsfsbank.com"
  },
  {
    "name": "Zions Bancorporation, National Association",
    "ticker": "ZION",
    "logo": "https://logo.clearbit.com/zionsbank.com"
  }
]

const companyLogos = {
  SOFI: "https://logo.clearbit.com/sofi.com",
  MS: "https://logo.clearbit.com/morganstanley.com",
  JPM: "https://logo.clearbit.com/jpmorganchase.com",
  MSFT: "https://logo.clearbit.com/microsoft.com",
  ABCB: "https://logo.clearbit.com/amerisbank.com",
  ASB: "https://logo.clearbit.com/associatedbank.com",
  AUB: "https://logo.clearbit.com/atlanticunionbank.com",
  BANC: "https://logo.clearbit.com/bancofcal.com",
  BAC: "https://logo.clearbit.com/bankofamerica.com",
  BOH: "https://logo.clearbit.com/boh.com",
  OZK: "https://logo.clearbit.com/ozk.com",
  BKU: "https://logo.clearbit.com/bankunited.com",
  BOKF: "https://logo.clearbit.com/bokf.com",
  CADE: "https://logo.clearbit.com/cadencebank.com",
  CATY: "https://logo.clearbit.com/cathaybank.com",
  C: "https://logo.clearbit.com/citigroup.com",
  CFG: "https://logo.clearbit.com/citizensbank.com",
  COLB: "https://logo.clearbit.com/columbiabank.com",
  CMA: "https://logo.clearbit.com/comerica.com",
  CBSH: "https://logo.clearbit.com/commercebank.com",
  CFR: "https://logo.clearbit.com/frostbank.com",
  CUBI: "https://logo.clearbit.com/customersbank.com",
  EWBC: "https://logo.clearbit.com/eastwestbank.com",
  EBC: "https://logo.clearbit.com/easternbank.com",
  FNB: "https://logo.clearbit.com/fnb-online.com",
  FITB: "https://logo.clearbit.com/53.com",
  "FCNC.A": "https://logo.clearbit.com/firstcitizens.com",
  FHB: "https://logo.clearbit.com/fhb.com",
  FHN: "https://logo.clearbit.com/firsthorizon.com",
  FIBK: "https://logo.clearbit.com/firstinterstatebank.com",
  FLG: "https://logo.clearbit.com/flagstar.com",
  FULT: "https://logo.clearbit.com/fultonbank.com",
  GBCI: "https://logo.clearbit.com/glacierbank.com",
  HWC: "https://logo.clearbit.com/hancockwhitney.com",
  HOMB: "https://logo.clearbit.com/homebancshares.com",
  HBAN: "https://logo.clearbit.com/huntington.com",
  KEY: "https://logo.clearbit.com/key.com",
  MTB: "https://logo.clearbit.com/mtb.com",
  ONB: "https://logo.clearbit.com/oldnational.com",
  PNFP: "https://logo.clearbit.com/pnfp.com",
  BPOP: "https://logo.clearbit.com/popular.com",
  PB: "https://logo.clearbit.com/prosperitybankusa.com",
  PFS: "https://logo.clearbit.com/provident.bank",
  RF: "https://logo.clearbit.com/regions.com",
  SFNC: "https://logo.clearbit.com/simmonsbank.com",
  SSB: "https://logo.clearbit.com/southstatebank.com",
  SNV: "https://logo.clearbit.com/synovus.com",
  TCBI: "https://logo.clearbit.com/texascapitalbank.com",
  PNC: "https://logo.clearbit.com/pnc.com",
  TFC: "https://logo.clearbit.com/truist.com",
  USB: "https://logo.clearbit.com/usbank.com",
  UMBF: "https://logo.clearbit.com/umb.com",
  UBSI: "https://logo.clearbit.com/ubsi-inc.com",
  UCB: "https://logo.clearbit.com/ucbi.com",
  VLY: "https://logo.clearbit.com/valley.com",
  WBS: "https://logo.clearbit.com/websteronline.com",
  WFC: "https://logo.clearbit.com/wellsfargo.com",
  WAL: "https://logo.clearbit.com/westernalliancebancorporation.com",
  WTFC: "https://logo.clearbit.com/wintrust.com",
  WSFS: "https://logo.clearbit.com/wsfsbank.com",
  ZION: "https://logo.clearbit.com/zionsbank.com",
};

const personas = [
  "Controller (Chief Accounting Officer)",
  "Treasurer",
  "Head of Financial Planning & Analysis (FP&A)",
  "Head of Risk & Compliance",
  "Head of Taxation",
  "Investor Relations Director",
  "Head of Procurement & Vendor Management"
];

const models = [{
  name: "Claude 3.5 Sonnet v1",
  value: "anthropic.claude-3-5-sonnet-20240620-v1:0"

}, {
  name: "Claude 3.5 Sonnet v2",
  value: "anthropic.claude-3-5-sonnet-v2"

}, {
  name: "Claude 3.5 Haiku",
  value: "anthropic.claude-3-haiku-20240307-v1:0"
}]



const promptsAndReportsMapping = [
  {
    "prompt": "Revenue over the last 5 years",
    "requiredReport": "Income Statement",
    "covered": true,
    "source": "10-K"
  },
  {
    "prompt": "Profit margin",
    "requiredReport": "Income Statement",
    "covered": true,
    "source": "10-K"
  },
  {
    "prompt": "Stock performance trends",
    "requiredReport": "Market/Stock Data (External)",
    "covered": false,
    "note": "Not available in 10-K",
    "source": "External"
  },
  {
    "prompt": "Cash flow variation by quarter",
    "requiredReport": "Cash Flow Statement",
    "covered": true,
    "source": "10-Q"
  },
  {
    "prompt": "Earnings per share (EPS) growth rate",
    "requiredReport": "Income Statement",
    "covered": true,
    "source": "10-K"
  },
  {
    "prompt": "Debt-to-equity ratio analysis",
    "requiredReport": "Balance Sheet",
    "covered": true,
    "source": "10-K"
  },
  {
    "prompt": "Operating income vs. net income",
    "requiredReport": "Income Statement",
    "covered": true,
    "source": "10-K"
  },
  {
    "prompt": "Quarterly dividend payout trends",
    "requiredReport": "Cash Flow / Equity Section",
    "covered": "partial",
    "note": "May need dividend-specific report",
    "source": "10-Q"
  },
  {
    "prompt": "Return on equity (ROE) comparison",
    "requiredReport": "Balance Sheet & Income",
    "covered": true,
    "source": "10-K"
  },
  {
    "prompt": "Gross margin trend over time",
    "requiredReport": "Income Statement",
    "covered": true,
    "source": "10-K"
  },
  {
    "prompt": "Year-over-year revenue growth",
    "requiredReport": "Income Statement",
    "covered": true,
    "source": "10-K"
  },
  {
    "prompt": "Free cash flow analysis",
    "requiredReport": "Cash Flow Statement",
    "covered": true,
    "source": "10-K"
  },
  {
    "prompt": "Interest expense as % of revenue",
    "requiredReport": "Income Statement",
    "covered": true,
    "source": "10-K"
  },
  {
    "prompt": "Net profit margin variation by quarter",
    "requiredReport": "Income Statement",
    "covered": true,
    "source": "10-Q"
  },
  {
    "prompt": "Impact of foreign exchange rates",
    "requiredReport": "Income Statement (Notes)",
    "covered": "partial",
    "note": "Usually found in footnotes",
    "source": "10-K"
  },
  {
    "prompt": "Working capital trend analysis",
    "requiredReport": "Balance Sheet",
    "covered": true,
    "source": "10-K"
  },
  {
    "prompt": "Cost of goods sold (COGS) comparison",
    "requiredReport": "Income Statement",
    "covered": true,
    "source": "10-K"
  },
  {
    "prompt": "Capital expenditure (CapEx) trend",
    "requiredReport": "Cash Flow Statement",
    "covered": true,
    "source": "10-K"
  },
  {
    "prompt": "Long-term vs. short-term debt structure",
    "requiredReport": "Balance Sheet",
    "covered": true,
    "source": "10-K"
  },
  {
    "prompt": "Inventory turnover rate analysis",
    "requiredReport": "Balance Sheet",
    "covered": true,
    "source": "10-K"
  },
  {
    "prompt": "EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization) trends",
    "requiredReport": "Income Statement",
    "covered": true,
    "source": "10-K"
  }
]



module.exports = { suggestedQuestions, companies, companyLogos, years, quarters, personas, models, promptsAndReportsMapping };
