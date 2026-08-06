export type LessonTrack = 
  | 'market_concepts' 
  | 'asset_allocation' 
  | 'options_strategies' 
  | 'investment_analysis' 
  | 'technical_analysis' 
  | 'risk_management';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface InteractiveWidgetConfig {
  type: 'options_payoff' | 'rsi_gauge' | 'position_sizer' | 'candlestick_viewer' | 'asset_slider';
  title: string;
  description: string;
  defaultParams?: Record<string, number | string>;
}

export interface LessonStep {
  stepNumber: number;
  title: string;
  subtitle?: string;
  content: string; // Markdown supported or formatted text
  keyTakeaway: string;
  featuredTicker?: string; // e.g. "NVDA", "TSLA", "LLY" for live market illustration
  economicImpactNote?: string;
  widget?: InteractiveWidgetConfig;
}

export interface Lesson {
  id: string;
  track: LessonTrack;
  title: string;
  estimatedMinutes: number; // e.g. 15
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  xpReward: number;
  iconName: string;
  featuredCompanyTicker: string;
  steps: LessonStep[];
  quiz: QuizQuestion[];
  isCompleted?: boolean;
}

export interface CompanyStock {
  ticker: string;
  name: string;
  sector: string;
  industry: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  peRatio: number;
  beta: number;
  rsi: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  volume: string;
  description: string;
  sectorTrend: 'Bullish' | 'Neutral' | 'Bearish';
  economicImpactSummary: string;
  chartHistory: { date: string; open: number; high: number; low: number; close: number; volume: number; ma20?: number; ma50?: number }[];
  newsTags: string[];
}

export interface TradePosition {
  id: string;
  ticker: string;
  type: 'BUY_STOCK' | 'CALL_OPTION' | 'PUT_OPTION';
  sharesOrContracts: number;
  entryPrice: number;
  currentPrice: number;
  strikePrice?: number; // for options
  expirationDate?: string; // for options
  stopLoss?: number;
  takeProfit?: number;
  openedAt: string;
  notes?: string;
}

export interface TradeOrder {
  id: string;
  ticker: string;
  action: 'BUY' | 'SELL';
  type: 'STOCK' | 'CALL_OPTION' | 'PUT_OPTION';
  quantity: number;
  price: number;
  timestamp: string;
  status: 'EXECUTED';
  realizedPnl?: number;
  feedbackNotes?: string[];
}

export interface UserPortfolio {
  cashBalance: number;
  startingBalance: number;
  positions: TradePosition[];
  orderHistory: TradeOrder[];
  trackedTickers: string[];
  completedLessonIds: string[];
  bookmarkedLessonIds: string[];
  userXp: number;
  userLevel: number;
  streakDays: number;
  lastActiveDate: string;
}

export interface PortfolioAnalyticsData {
  totalValue: number;
  totalPnl: number;
  totalPnlPercent: number;
  dailyPnl: number;
  dailyPnlPercent: number;
  cashAllocationPercent: number;
  stockAllocationPercent: number;
  optionsAllocationPercent: number;
  portfolioBeta: number;
  sharpeRatio: number;
  diversificationScore: number; // 0 - 100
  riskRating: 'Conservative' | 'Moderate' | 'Aggressive' | 'High Risk';
  sectorBreakdown: { name: string; value: number; color: string }[];
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}
