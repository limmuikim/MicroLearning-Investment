import { CompanyStock } from '../types';

// Helper to generate 30 days of synthetic OHLC dataset for technical charting
function generateHistoricalData(basePrice: number, volatility: number = 0.02) {
  const data = [];
  let currentPrice = basePrice * 0.92;
  const now = new Date();

  for (let i = 30; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    const change = (Math.random() - 0.48) * volatility * currentPrice;
    const open = Number(currentPrice.toFixed(2));
    const close = Number((currentPrice + change).toFixed(2));
    const high = Number((Math.max(open, close) + Math.random() * volatility * currentPrice * 0.8).toFixed(2));
    const low = Number((Math.min(open, close) - Math.random() * volatility * currentPrice * 0.8).toFixed(2));
    const volume = Math.floor(15000000 + Math.random() * 25000000);
    
    currentPrice = close;
    data.push({
      date: dateStr,
      open,
      high,
      low,
      close,
      volume,
    });
  }

  // Calculate 20-day and 50-day moving averages
  for (let i = 0; i < data.length; i++) {
    const slice20 = data.slice(Math.max(0, i - 19), i + 1);
    const avg20 = slice20.reduce((acc, curr) => acc + curr.close, 0) / slice20.length;
    data[i].ma20 = Number(avg20.toFixed(2));

    const slice50 = data.slice(Math.max(0, i - 49), i + 1);
    const avg50 = slice50.reduce((acc, curr) => acc + curr.close, 0) / slice50.length;
    data[i].ma50 = Number(avg50.toFixed(2));
  }

  return data;
}

export const INITIAL_COMPANIES: CompanyStock[] = [
  {
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Technology / Semiconductors',
    industry: 'AI Hardware & Data Center GPU',
    price: 138.45,
    change: 4.25,
    changePercent: 3.17,
    marketCap: '$3.40 Trillion',
    peRatio: 52.4,
    beta: 1.68,
    rsi: 64.5,
    fiftyTwoWeekHigh: 140.76,
    fiftyTwoWeekLow: 86.40,
    volume: '48.2M',
    description: 'Global leader in GPU computing, artificial intelligence accelerator chips, and high-performance enterprise data center hardware.',
    sectorTrend: 'Bullish',
    economicImpactSummary: 'High AI infrastructure capital expenditure directly correlates with hyperscaler (MSFT, GOOGL, AMZN) earnings and macro tech sentiment.',
    chartHistory: generateHistoricalData(135.0, 0.025),
    newsTags: ['AI Surge', 'Data Center Growth', 'Export Controls', 'High Valuation']
  },
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Technology / Consumer Hardware',
    industry: 'Consumer Electronics & Ecosystem',
    price: 224.80,
    change: -1.15,
    changePercent: -0.51,
    marketCap: '$3.43 Trillion',
    peRatio: 33.8,
    beta: 1.05,
    rsi: 52.1,
    fiftyTwoWeekHigh: 237.23,
    fiftyTwoWeekLow: 164.08,
    volume: '36.5M',
    description: 'Premum hardware ecosystem provider (iPhone, Mac, Wearables) paired with sticky recurring high-margin services revenue.',
    sectorTrend: 'Neutral',
    economicImpactSummary: 'Consumer spending health indicator. Strong benchmark for global supply chain resilience and premium hardware gross margins.',
    chartHistory: generateHistoricalData(225.0, 0.015),
    newsTags: ['Apple Intelligence', 'Services Growth', 'Supply Chain', 'MegaCap Safety']
  },
  {
    ticker: 'TSLA',
    name: 'Tesla, Inc.',
    sector: 'Automotive & Clean Energy',
    industry: 'Electric Vehicles, Robotics & Solar',
    price: 248.90,
    change: 8.60,
    changePercent: 3.58,
    marketCap: '$792.5 Billion',
    peRatio: 68.2,
    beta: 2.34,
    rsi: 69.8,
    fiftyTwoWeekHigh: 271.00,
    fiftyTwoWeekLow: 138.80,
    volume: '62.1M',
    description: 'Electric vehicle manufacturer expanding into Autonomous Driving (FSD), Megapack grid storage, and humanoid robotics.',
    sectorTrend: 'Bullish',
    economicImpactSummary: 'Acts as a high-beta growth proxy. Sensitive to Federal Reserve interest rate policy, auto financing rates, and lithium commodity cycles.',
    chartHistory: generateHistoricalData(240.0, 0.038),
    newsTags: ['FSD Breakthrough', 'Robotaxi Catalyst', 'High Beta', 'Clean Tech']
  },
  {
    ticker: 'LLY',
    name: 'Eli Lilly and Company',
    sector: 'Healthcare / Pharmaceuticals',
    industry: 'Biopharmaceuticals & Metabolic Therapeutics',
    price: 842.10,
    change: 12.30,
    changePercent: 1.48,
    marketCap: '$798.2 Billion',
    peRatio: 48.6,
    beta: 0.58,
    rsi: 58.2,
    fiftyTwoWeekHigh: 967.74,
    fiftyTwoWeekLow: 516.50,
    volume: '3.4M',
    description: 'Leading biopharmaceutical firm revolutionizing diabetes and obesity treatment with GLP-1 receptor agonists (Mounjaro, Zepbound).',
    sectorTrend: 'Bullish',
    economicImpactSummary: 'Defensive growth sector anchor. Provides capital protection during macroeconomic recessions due to inelastic demand for essential healthcare products.',
    chartHistory: generateHistoricalData(835.0, 0.018),
    newsTags: ['GLP-1 Monopoly', 'Defensive Growth', 'Low Beta', 'Pharma Breakthrough']
  },
  {
    ticker: 'JPM',
    name: 'JPMorgan Chase & Co.',
    sector: 'Financials / Banking',
    industry: 'Diversified Banking & Capital Markets',
    price: 218.60,
    change: -0.80,
    changePercent: -0.36,
    marketCap: '$622.1 Billion',
    peRatio: 12.4,
    beta: 1.08,
    rsi: 48.9,
    fiftyTwoWeekHigh: 225.48,
    fiftyTwoWeekLow: 143.20,
    volume: '8.9M',
    description: 'Largest American multinational financial institution offering consumer banking, investment banking, asset management, and trading services.',
    sectorTrend: 'Neutral',
    economicImpactSummary: 'Direct proxy for global macroeconomic health, net interest margin trends (NIM), credit loan default risks, and investment banking deal volume.',
    chartHistory: generateHistoricalData(220.0, 0.014),
    newsTags: ['Rate Decisions', 'Net Interest Income', 'Value Anchor', 'Credit Trends']
  },
  {
    ticker: 'AMZN',
    name: 'Amazon.com, Inc.',
    sector: 'Consumer Cyclical / Cloud',
    industry: 'E-Commerce & AWS Cloud Infrastructure',
    price: 186.75,
    change: 2.10,
    changePercent: 1.14,
    marketCap: '$1.94 Trillion',
    peRatio: 44.1,
    beta: 1.22,
    rsi: 56.4,
    fiftyTwoWeekHigh: 201.20,
    fiftyTwoWeekLow: 118.35,
    volume: '31.2M',
    description: 'Dominant global e-commerce enterprise paired with AWS, the world’s leading cloud computing and enterprise server platform.',
    sectorTrend: 'Bullish',
    economicImpactSummary: 'Dual metric for consumer discretionary spending habits and corporate IT cloud transformation budgets.',
    chartHistory: generateHistoricalData(184.0, 0.021),
    newsTags: ['AWS Expansion', 'Retail Margins', 'Ad Revenue Growth', 'E-Commerce']
  },
  {
    ticker: 'XOM',
    name: 'Exxon Mobil Corporation',
    sector: 'Energy / Commodities',
    industry: 'Integrated Oil & Gas Exploration',
    price: 118.20,
    change: -1.40,
    changePercent: -1.17,
    marketCap: '$468.9 Billion',
    peRatio: 13.8,
    beta: 0.85,
    rsi: 44.2,
    fiftyTwoWeekHigh: 126.34,
    fiftyTwoWeekLow: 95.77,
    volume: '14.1M',
    description: 'International energy titan engaged in crude oil exploration, refining, petrochemical production, and LNG distribution.',
    sectorTrend: 'Bearish',
    economicImpactSummary: 'Hedge against geopolitical inflation and crude oil spot price spikes. Dividend income anchor in inflationary macro regimes.',
    chartHistory: generateHistoricalData(120.0, 0.016),
    newsTags: ['Crude Spot Price', 'Inflation Hedge', 'High Dividend Yield', 'Permian Basin']
  }
];
