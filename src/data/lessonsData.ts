import { Lesson } from '../types';

export const MICROLEARNING_LESSONS: Lesson[] = [
  {
    id: 'lesson-1',
    track: 'market_concepts',
    title: 'Market Cycles, Fed Rates & Macro Economic Drivers',
    estimatedMinutes: 15,
    difficulty: 'Beginner',
    summary: 'Master how interest rate shifts by the Federal Reserve and inflation metrics drive stock valuations across growth vs value sectors.',
    xpReward: 150,
    iconName: 'Landmark',
    featuredCompanyTicker: 'JPM',
    steps: [
      {
        stepNumber: 1,
        title: 'The Macro Economic Clock',
        subtitle: 'Why Interest Rates Are the Financial Gravity',
        content: `Central banks control benchmark interest rates to balance inflation and unemployment. When the Federal Reserve raises rates, borrowing money becomes expensive for businesses and consumers. Conversely, rate cuts lower capital costs, accelerating business expansion.

Key principle: **Interest rates represent the discount rate for future cash flows.** High rates decrease the present value of future corporate earnings, disproportionately hurting long-duration growth stocks.`,
        keyTakeaway: 'Higher interest rates raise borrowing costs and compress valuation multiples, especially for high-growth companies.',
        featuredTicker: 'JPM',
        economicImpactNote: 'JPMorgan Chase (JPM) experiences expanding Net Interest Margins (NIM) during rate hike cycles, whereas high-debt growth companies face higher refinancing burdens.'
      },
      {
        stepNumber: 2,
        title: 'Bull vs. Bear Regimes & Sector Rotation',
        subtitle: 'Navigating Economic Phases',
        content: `Markets rotate through four primary economic phases: Early Recovery, Mid-Cycle Expansion, Late-Cycle Slowdown, and Recession.

- **Early Expansion**: Cyclicals, Financials, Consumer Discretionary (AMZN) outpace.
- **Late Expansion**: Energy (XOM) and Industrials benefit from commodity demand.
- **Recession / Slowdown**: Defensive sectors like Healthcare (LLY) and Consumer Staples retain pricing power due to non-discretionary consumer needs.`,
        keyTakeaway: 'Sector rotation allows savvy investors to rebalance out of overvalued cyclicals into defensive safe havens before downturns.',
        featuredTicker: 'LLY',
        economicImpactNote: 'Eli Lilly (LLY) maintains revenue consistency during economic recessions because patients require medications regardless of macroeconomic GDP fluctuations.'
      },
      {
        stepNumber: 3,
        title: 'Understanding Beta & Market Volatility',
        subtitle: 'Measuring Stock Sensitivity to S&P 500',
        content: `**Beta (β)** measures a stock volatility relative to the broader market index (S&P 500 benchmark β = 1.0):

- **β > 1.0 (High Beta)**: Example TSLA (β = 2.34). Amplifies market movements — when S&P gains 1%, TSLA often gains 2.34%. High upside, high risk.
- **β < 1.0 (Low Beta)**: Example LLY (β = 0.58). More stable, lower drawdowns during market panics.`,
        keyTakeaway: 'Balance high-beta growth stocks with low-beta defensive anchors to limit portfolio drawdowns.',
        featuredTicker: 'TSLA',
        economicImpactNote: 'Tesla (TSLA) has a high beta (2.34), making it hyper-sensitive to macro liquidity shifts and consumer automotive financing rates.'
      }
    ],
    quiz: [
      {
        id: 'q1-1',
        question: 'When the Federal Reserve cuts interest rates aggressively, which type of company generally experiences the highest valuation expansion?',
        options: [
          'High-growth tech companies with long-duration future earnings expectations',
          'Stable utility companies with fixed dividend yields',
          'Short-term money market cash funds',
          'Mature legacy retail stores with heavy fixed debt'
        ],
        correctIndex: 0,
        explanation: 'Lower interest rates decrease the discount rate applied to future earnings, boosting present value estimates for high-growth tech firms.'
      },
      {
        id: 'q1-2',
        question: 'Which sector is traditionally considered "defensive" during an economic slowdown?',
        options: [
          'Consumer Discretionary',
          'Healthcare & Pharmaceuticals',
          'Semiconductor Equipment',
          'Automotive Manufacturers'
        ],
        correctIndex: 1,
        explanation: 'Healthcare is non-discretionary; demand for pharmaceuticals and medical treatments remains constant regardless of economic downturns.'
      }
    ]
  },
  {
    id: 'lesson-2',
    track: 'asset_allocation',
    title: 'Modern Portfolio Theory & Strategic Rebalancing',
    estimatedMinutes: 15,
    difficulty: 'Beginner',
    summary: 'Learn the mathematical principles of diversification, correlation coefficients, and the 60/40 rule to maximize risk-adjusted returns.',
    xpReward: 160,
    iconName: 'PieChart',
    featuredCompanyTicker: 'AAPL',
    steps: [
      {
        stepNumber: 1,
        title: 'The Efficient Frontier & Diversification',
        subtitle: 'Harry Markowitz’s Free Lunch in Finance',
        content: `Modern Portfolio Theory (MPT) proves that holding uncorrelated assets allows an investor to reduce overall portfolio variance without forfeiting expected returns.

By pairing assets with low or negative price correlation (e.g. Technology + Healthcare + Commodities), losses in one sector during a macro shift are buffered by gains or stability in another.`,
        keyTakeaway: 'True diversification requires holding low-correlation assets across different sectors, not just multiple stocks in the same industry.',
        featuredTicker: 'AAPL',
        economicImpactNote: 'Combining Apple (Consumer Hardware) with ExxonMobil (Energy) creates sector correlation buffer during oil price shocks.',
        widget: {
          type: 'asset_slider',
          title: 'Interactive Asset Allocation Simulator',
          description: 'Adjust the ratio of High Growth (NVDA/TSLA) vs Defensive Value (LLY/JPM) to see projected portfolio risk vs expected return curve.'
        }
      },
      {
        stepNumber: 2,
        title: 'Correlation Matrix Essentials',
        subtitle: 'How Stocks Move Together',
        content: `Correlation ranges from +1.0 (perfectly identical movement) to -1.0 (opposite movement). 

If your portfolio consists of NVDA, AAPL, MSFT, and AMD, your correlation is near +0.85! When tech drops 3%, your entire net worth contracts simultaneously. Adding non-correlated assets lowers overall Beta.`,
        keyTakeaway: 'Check correlation matrix before adding new positions to ensure you are adding genuine diversification.',
        featuredTicker: 'NVDA'
      },
      {
        stepNumber: 3,
        title: 'Disciplined Portfolio Rebalancing',
        subtitle: 'Sell High, Buy Low Systematically',
        content: `Over time, outperforming stocks grow to dominate your portfolio allocation (e.g., NVDA growing from 10% to 40% of net worth). This exposes you to concentrated single-stock risk!

Rebalancing involves periodically trimming over-weighted winners and allocating capital into under-weighted value opportunities to restore target weights.`,
        keyTakeaway: 'Rebalancing enforces disciplined profit-taking without emotion.',
        featuredTicker: 'AAPL'
      }
    ],
    quiz: [
      {
        id: 'q2-1',
        question: 'What is the primary benefit of combining assets with low or negative correlation in a single portfolio?',
        options: [
          'It guarantees positive returns every single trading day',
          'It reduces total portfolio risk/volatility without necessarily sacrificing expected returns',
          'It eliminates the need to pay capital gains taxes',
          'It guarantees double-digit dividend yields'
        ],
        correctIndex: 1,
        explanation: 'Low correlation offsets sector-specific shocks, lowering overall variance while maintaining strategic growth objectives.'
      }
    ]
  },
  {
    id: 'lesson-3',
    track: 'options_strategies',
    title: 'Call vs Put Options & Derivative Risk Payoffs',
    estimatedMinutes: 15,
    difficulty: 'Intermediate',
    summary: 'Demystify Call & Put option contracts, strike prices, premiums, leverage risks, protective puts, and covered call strategies.',
    xpReward: 200,
    iconName: 'Zap',
    featuredCompanyTicker: 'NVDA',
    steps: [
      {
        stepNumber: 1,
        title: 'Option Contract Fundamentals',
        subtitle: 'Calls (Bullish) vs Puts (Bearish)',
        content: `An option contract grants the buyer the right (but not obligation) to buy or sell 100 shares of an underlying stock at a specified **Strike Price** before an **Expiration Date**.

- **Call Option**: Right to BUY stock at Strike Price. Used when expecting stock price to rise significantly.
- **Put Option**: Right to SELL stock at Strike Price. Used to speculate on downside or hedge an existing stock holding (Protective Put).`,
        keyTakeaway: 'Buying Calls profits from upward momentum; buying Puts profits from downward drops or hedges existing long positions.',
        featuredTicker: 'NVDA',
        widget: {
          type: 'options_payoff',
          title: 'Interactive Options Payoff Diagram',
          description: 'Simulate stock price movements at expiration to calculate exact profit/loss for Call and Put options.'
        }
      },
      {
        stepNumber: 2,
        title: 'Strike Price & In-The-Money (ITM) Mechanics',
        subtitle: 'Intrinsic Value vs Time Decay (Theta)',
        content: `Option pricing consists of two components:
1. **Intrinsic Value**: The actual real-world profit if exercised today. (For a $130 Call on NVDA trading at $140, intrinsic value is $10).
2. **Extrinsic Value (Time Value)**: The premium paid for remaining time before expiration. As expiration approaches, time value decays exponentially (**Theta Decay**).`,
        keyTakeaway: 'Options buyers face a ticking time clock (Theta decay); options tend to lose value rapidly in the final 30 days before expiration.',
        featuredTicker: 'NVDA',
        economicImpactNote: 'High implied volatility in tech stocks like NVDA inflates option premiums, making buying options expensive unless sharp moves occur.'
      },
      {
        stepNumber: 3,
        title: 'Protective Puts & Hedging Strategy',
        subtitle: 'Insurance Policies for Your Portfolio',
        content: `A **Protective Put** involves holding 100 shares of stock (e.g. TSLA) while purchasing 1 Put contract below the market price. 

If TSLA crashes 30% due to earnings miss, your Put contract surges in value, allowing you to sell your stock at the strike price and capping your maximum possible loss!`,
        keyTakeaway: 'Protective Puts act like insurance policies, limiting maximum downside risk during major market uncertainty.',
        featuredTicker: 'TSLA'
      }
    ],
    quiz: [
      {
        id: 'q3-1',
        question: 'If an investor owns 100 shares of NVDA at $135 and buys a Put Option with a $130 Strike Price, what is the maximum downside loss per share on the stock position?',
        options: [
          '$5 plus the premium paid for the Put option',
          '$135 full loss if the company goes to zero',
          'Zero loss under any condition',
          'Unlimited downside loss'
        ],
        correctIndex: 0,
        explanation: 'The Put option guarantees the holder can sell shares at $130, capping the stock loss at $5 ($135 - $130) plus the upfront option premium.'
      }
    ]
  },
  {
    id: 'lesson-4',
    track: 'investment_analysis',
    title: 'Fundamental Valuation: P/E, P/S & Earnings Analysis',
    estimatedMinutes: 15,
    difficulty: 'Intermediate',
    summary: 'Evaluate balance sheet strength, Discounted Cash Flow (DCF), Price-to-Earnings ratios, and earnings surprise catalysts.',
    xpReward: 180,
    iconName: 'BarChart3',
    featuredCompanyTicker: 'AMZN',
    steps: [
      {
        stepNumber: 1,
        title: 'The Price-to-Earnings (P/E) Multiple',
        subtitle: 'Comparing What You Pay vs What They Earn',
        content: `$$\\text{P/E Ratio} = \\frac{\\text{Stock Price}}{\\text{Earnings Per Share (EPS)}}$$

- **High P/E (>40)**: Example NVDA (52.4) or TSLA (68.2). Investors expect rapid future profit growth. Vulnerable to sharp selloffs if earnings miss expectations.
- **Low P/E (<15)**: Example JPM (12.4) or XOM (13.8). Mature businesses generating immediate steady cash flows.`,
        keyTakeaway: 'A high P/E is not automatically bad, but it demands aggressive profit execution from management to justify the premium.',
        featuredTicker: 'AMZN',
        economicImpactNote: 'Amazon (AMZN) historic P/E expansion reflected reinvestment of cash flow into AWS cloud data infrastructure before earnings exploded.'
      },
      {
        stepNumber: 2,
        title: 'Free Cash Flow (FCF) & Balance Sheet Quality',
        subtitle: 'Cash Is King in Volatile Regimes',
        content: `Net income can be adjusted by accounting rules, but **Free Cash Flow (FCF)** is the actual cold hard cash remaining after capital expenditures (CapEx).

Firms with huge FCF reserves (AAPL, NVDA) can buy back shares, acquire competitors, pay growing dividends, and survive credit crunches cleanly.`,
        keyTakeaway: 'Prioritize companies with positive Free Cash Flow growth and low Net Debt-to-EBITDA ratios.',
        featuredTicker: 'AAPL'
      }
    ],
    quiz: [
      {
        id: 'q4-1',
        question: 'Why might a mature company like JPMorgan Chase trade at a significantly lower P/E ratio than a tech firm like NVIDIA?',
        options: [
          'Investors expect high-double-digit annual revenue growth from NVIDIA, whereas banking growth is tied to steady macroeconomic GDP rates',
          'JPMorgan Chase is near bankruptcy',
          'P/E ratios are completely random numbers with no real financial meaning',
          'High tech stocks are exempt from tax regulations'
        ],
        correctIndex: 0,
        explanation: 'Market multiples reflect future growth expectations. High growth companies command higher earnings multiples.'
      }
    ]
  },
  {
    id: 'lesson-5',
    track: 'technical_analysis',
    title: 'Technical Chart Analysis: Moving Averages, RSI & MACD',
    estimatedMinutes: 15,
    difficulty: 'Intermediate',
    summary: 'Master candlestick patterns, 20/50-day SMA golden crosses, Relative Strength Index (RSI) momentum, and breakout levels.',
    xpReward: 190,
    iconName: 'TrendingUp',
    featuredCompanyTicker: 'TSLA',
    steps: [
      {
        stepNumber: 1,
        title: 'Reading Candlestick Anatomy',
        subtitle: 'Bullish Green vs Bearish Red Candles',
        content: `A Japanese Candlestick displays four prices for a given time period: **Open, High, Low, and Close (OHLC)**.

- **Green Candle**: Close price > Open price (Buyers dominated).
- **Red Candle**: Close price < Open price (Sellers dominated).
- **Long Upper Wick**: Rejection of higher prices by sellers.
- **Long Lower Wick (Hammer)**: Buyers stepped in at lower price levels to defend support.`,
        keyTakeaway: 'Candlestick wicks reveal price rejection zones where institutional buyers or sellers took control.',
        featuredTicker: 'TSLA',
        widget: {
          type: 'rsi_gauge',
          title: 'Interactive Technical RSI Gauge',
          description: 'Visualize Overbought (>70) vs Oversold (<30) momentum thresholds on real-time stock charts.'
        }
      },
      {
        stepNumber: 2,
        title: 'Relative Strength Index (RSI) Momentum',
        subtitle: 'Identifying Overbought and Oversold Reversals',
        content: `RSI measures the speed and velocity of price changes on a 0 to 100 scale:

- **RSI > 70 (Overbought)**: Stock has surged rapidly; risk of short-term pullbacks or consolidation is high.
- **RSI < 30 (Oversold)**: Selling pressure is extreme; potential mean-reversion bounce opportunity.`,
        keyTakeaway: 'Avoid buying stocks with RSI above 75 without a catalyst; look for bullish RSI divergence at key support levels.',
        featuredTicker: 'TSLA'
      },
      {
        stepNumber: 3,
        title: 'Moving Average Crossovers (Golden Cross & Death Cross)',
        subtitle: 'Institutional Trend Validation',
        content: `Moving averages smooth out daily price noise to reveal underlying trends:

- **Golden Cross**: 20-day or 50-day Moving Average crosses *above* 200-day Moving Average. Strongly bullish institutional signal.
- **Death Cross**: Short-term Moving Average breaks *below* long-term average. Warning of prolonged downtrend.`,
        keyTakeaway: 'Trade in the direction of the 50-day and 200-day Moving Averages for higher probability setups.',
        featuredTicker: 'NVDA'
      }
    ],
    quiz: [
      {
        id: 'q5-1',
        question: 'When a stock’s 14-day RSI reads 78 after a 5-day continuous rally, technical traders interpret this as:',
        options: [
          'An overbought condition where caution is warranted for new long entries',
          'A guaranteed signal to buy maximum position size',
          'A strong indication that the company will default on debt',
          'An oversold extreme buying opportunity'
        ],
        correctIndex: 0,
        explanation: 'RSI above 70 indicates overbought momentum where risk/reward for new long entries is unfavorable.'
      }
    ]
  },
  {
    id: 'lesson-6',
    track: 'risk_management',
    title: 'Position Sizing, Stop-Loss Rules & Sharpe Ratio',
    estimatedMinutes: 15,
    difficulty: 'Advanced',
    summary: 'Master institutional risk controls, the 1% risk rule, setting optimal stop-loss levels, and analyzing risk-reward ratios.',
    xpReward: 220,
    iconName: 'ShieldAlert',
    featuredCompanyTicker: 'NVDA',
    steps: [
      {
        stepNumber: 1,
        title: 'The Golden 1% Risk Rule',
        subtitle: 'Protecting Capital to Play Long Term',
        content: `Institutional traders never risk more than 1% to 2% of their total portfolio capital on a single trade setup.

Formula:
$$\\text{Position Size} = \\frac{\\text{Total Portfolio Value} \\times 1\\%}{\\text{Entry Price} - \\text{Stop-Loss Price}}$$

Example: $100,000 portfolio = $1,000 max risk. If buying NVDA at $138 with Stop-Loss at $133 ($5 risk per share), your max shares = $1,000 / $5 = 200 shares.`,
        keyTakeaway: 'Calculate your stop-loss distance FIRST, then determine share count second.',
        featuredTicker: 'NVDA',
        widget: {
          type: 'position_sizer',
          title: 'Interactive 1% Position Sizing Calculator',
          description: 'Input your portfolio balance, entry price, and stop-loss level to automatically calculate safe maximum share quantity.'
        }
      },
      {
        stepNumber: 2,
        title: 'Risk-to-Reward Ratio (R:R)',
        subtitle: 'Stacking Asymmetric Odds in Your Favor',
        content: `Never take a trade where potential reward is less than 2x potential risk (**1:2 Risk-to-Reward Ratio**).

If risking $500 on a trade setup, your target take-profit exit must offer at least $1,000 profit potential. With a 1:2 R:R ratio, you can be WRONG on 60% of trades and still maintain long-term profitability!`,
        keyTakeaway: 'Asymmetric risk-reward ratios ensure long-term profitability even with a modest 45% win rate.',
        featuredTicker: 'TSLA'
      },
      {
        stepNumber: 3,
        title: 'Evaluating Sharpe Ratio & Max Drawdown',
        subtitle: 'Measuring True Risk-Adjusted Returns',
        content: `The **Sharpe Ratio** calculates excess return generated per unit of risk/volatility:

- **Sharpe > 1.0**: Good risk-adjusted performance.
- **Sharpe > 2.0**: Exceptional institutional quality return profile.

Max Drawdown measures the maximum peak-to-trough drop experienced by a portfolio before a new peak is achieved.`,
        keyTakeaway: 'High returns mean nothing if accompanied by catastrophic 40%+ portfolio drawdowns.',
        featuredTicker: 'LLY'
      }
    ],
    quiz: [
      {
        id: 'q6-1',
        question: 'Under the 1% risk rule, if you have a $50,000 portfolio and plan to buy a stock at $100 with a stop-loss set at $95, how many shares should you buy?',
        options: [
          '100 shares ($500 max risk / $5 risk per share)',
          '500 shares',
          '1,000 shares',
          '50 shares'
        ],
        correctIndex: 0,
        explanation: '1% of $50,000 is $500 max loss. $100 - $95 = $5 risk per share. $500 / $5 = 100 shares.'
      }
    ]
  }
];
