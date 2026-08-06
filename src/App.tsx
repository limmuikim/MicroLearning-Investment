import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MicrolearningHub } from './components/MicrolearningHub';
import { MarketRadar } from './components/MarketRadar';
import { PortfolioAnalytics } from './components/PortfolioAnalytics';
import { SimulatedTradingArena } from './components/SimulatedTradingArena';
import { AIMentorDrawer } from './components/AIMentorDrawer';
import { MICROLEARNING_LESSONS } from './data/lessonsData';
import { INITIAL_COMPANIES } from './data/companiesData';
import { UserPortfolio, CompanyStock, TradePosition, TradeOrder } from './types';

const INITIAL_PORTFOLIO: UserPortfolio = {
  cashBalance: 85000,
  startingBalance: 100000,
  positions: [
    {
      id: 'pos-1',
      ticker: 'NVDA',
      type: 'BUY_STOCK',
      sharesOrContracts: 50,
      entryPrice: 130.00,
      currentPrice: 138.45,
      openedAt: new Date().toLocaleDateString(),
    },
    {
      id: 'pos-2',
      ticker: 'TSLA',
      type: 'CALL_OPTION',
      sharesOrContracts: 2,
      entryPrice: 4.50,
      currentPrice: 6.20,
      strikePrice: 250,
      expirationDate: '30 Days',
      openedAt: new Date().toLocaleDateString(),
    }
  ],
  orderHistory: [
    {
      id: 'ord-1',
      ticker: 'NVDA',
      action: 'BUY',
      type: 'STOCK',
      quantity: 50,
      price: 130.00,
      timestamp: 'Yesterday 10:15 AM',
      status: 'EXECUTED',
    },
    {
      id: 'ord-2',
      ticker: 'TSLA',
      action: 'BUY',
      type: 'CALL_OPTION',
      quantity: 2,
      price: 4.50,
      timestamp: 'Yesterday 02:30 PM',
      status: 'EXECUTED',
    }
  ],
  trackedTickers: ['NVDA', 'AAPL', 'TSLA', 'LLY', 'JPM', 'AMZN', 'XOM'],
  completedLessonIds: [],
  bookmarkedLessonIds: ['lesson-3'],
  userXp: 350,
  userLevel: 2,
  streakDays: 4,
  lastActiveDate: new Date().toLocaleDateString(),
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'learn' | 'market' | 'portfolio' | 'trading' | 'mentor'>('learn');
  const [companies, setCompanies] = useState<CompanyStock[]>(INITIAL_COMPANIES);
  
  // Load portfolio from localStorage or fallback
  const [portfolio, setPortfolio] = useState<UserPortfolio>(() => {
    const saved = localStorage.getItem('investpulse_portfolio');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_PORTFOLIO;
  });

  const [tradeArenaTicker, setTradeArenaTicker] = useState<string>('NVDA');

  // Sync portfolio state to localStorage
  useEffect(() => {
    localStorage.setItem('investpulse_portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  // Real-time market tick simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setCompanies((prev) =>
        prev.map((comp) => {
          const deltaPercent = (Math.random() - 0.49) * 0.004; // small tick movement
          const newPrice = Number(Math.max(1, comp.price * (1 + deltaPercent)).toFixed(2));
          const change = Number((newPrice - (comp.price - comp.change)).toFixed(2));
          const changePercent = Number(((change / (comp.price - comp.change)) * 100).toFixed(2));

          return {
            ...comp,
            price: newPrice,
            change,
            changePercent,
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Update current prices of active holdings
  useEffect(() => {
    setPortfolio((prev) => {
      const updatedPositions = prev.positions.map((pos) => {
        const comp = companies.find((c) => c.ticker === pos.ticker);
        if (!comp) return pos;
        return {
          ...pos,
          currentPrice: pos.type === 'BUY_STOCK' ? comp.price : pos.currentPrice,
        };
      });
      return { ...prev, positions: updatedPositions };
    });
  }, [companies]);

  // Handlers
  const handleCompleteLesson = (lessonId: string, xpReward: number) => {
    setPortfolio((prev) => {
      if (prev.completedLessonIds.includes(lessonId)) return prev;

      const newXp = prev.userXp + xpReward;
      const newLevel = Math.floor(newXp / 300) + 1;

      return {
        ...prev,
        userXp: newXp,
        userLevel: newLevel,
        completedLessonIds: [...prev.completedLessonIds, lessonId],
        streakDays: prev.streakDays + 1,
      };
    });
  };

  const handleToggleBookmark = (lessonId: string) => {
    setPortfolio((prev) => {
      const isBookmarked = prev.bookmarkedLessonIds.includes(lessonId);
      const newBookmarks = isBookmarked
        ? prev.bookmarkedLessonIds.filter((id) => id !== lessonId)
        : [...prev.bookmarkedLessonIds, lessonId];
      return { ...prev, bookmarkedLessonIds: newBookmarks };
    });
  };

  const handleToggleTrackTicker = (ticker: string) => {
    setPortfolio((prev) => {
      const isTracked = prev.trackedTickers.includes(ticker);
      const newTracked = isTracked
        ? prev.trackedTickers.filter((t) => t !== ticker)
        : [...prev.trackedTickers, ticker];
      return { ...prev, trackedTickers: newTracked };
    });
  };

  const handleOpenTradeModal = (ticker: string) => {
    setTradeArenaTicker(ticker);
    setActiveTab('trading');
  };

  const handleExecuteTrade = async (
    ticker: string,
    tradeType: 'BUY_STOCK' | 'CALL_OPTION' | 'PUT_OPTION',
    quantity: number,
    price: number,
    stopLoss?: number,
    takeProfit?: number,
    strikePrice?: number,
    expirationDate?: string
  ): Promise<string[]> => {
    const totalCost = tradeType === 'BUY_STOCK' ? quantity * price : quantity * 100 * price;

    if (totalCost > portfolio.cashBalance) {
      return ['Order failed: Insufficient paper cash available.'];
    }

    const newPosition: TradePosition = {
      id: 'pos-' + Date.now(),
      ticker,
      type: tradeType,
      sharesOrContracts: quantity,
      entryPrice: price,
      currentPrice: price,
      stopLoss,
      takeProfit,
      strikePrice,
      expirationDate,
      openedAt: new Date().toLocaleDateString(),
    };

    const newOrder: TradeOrder = {
      id: 'ord-' + Date.now(),
      ticker,
      action: 'BUY',
      type: tradeType === 'BUY_STOCK' ? 'STOCK' : tradeType,
      quantity,
      price,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'EXECUTED',
    };

    setPortfolio((prev) => ({
      ...prev,
      cashBalance: prev.cashBalance - totalCost,
      positions: [newPosition, ...prev.positions],
      orderHistory: [newOrder, ...prev.orderHistory],
    }));

    // Call server API for AI trade audit critique
    try {
      const res = await fetch('/api/ai/analyze-trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker,
          type: tradeType,
          quantity,
          entryPrice: price,
          stopLoss,
          takeProfit,
          portfolioBalance: portfolio.cashBalance,
        }),
      });
      const data = await res.json();
      if (data.feedback) {
        return data.feedback.split('\n').filter((l: string) => l.trim().length > 0);
      }
    } catch (err) {
      console.error(err);
    }

    return [
      `Order Executed: ${quantity} x ${ticker} (${tradeType}) at $${price.toFixed(2)}.`,
      `Position Risk: Defined cleanly. Position added to active portfolio analytics.`
    ];
  };

  const handleClosePosition = (positionId: string) => {
    setPortfolio((prev) => {
      const posToClose = prev.positions.find((p) => p.id === positionId);
      if (!posToClose) return prev;

      const proceedValue = posToClose.currentPrice * posToClose.sharesOrContracts;

      return {
        ...prev,
        cashBalance: prev.cashBalance + proceedValue,
        positions: prev.positions.filter((p) => p.id !== positionId),
      };
    });
  };

  const handleResetPortfolio = () => {
    if (confirm('Reset paper trading balance to $100,000 starting cash?')) {
      setPortfolio(INITIAL_PORTFOLIO);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
      {/* Primary Header */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} portfolio={portfolio} />

      {/* Main View Area */}
      <main>
        {activeTab === 'learn' && (
          <MicrolearningHub
            lessons={MICROLEARNING_LESSONS}
            companies={companies}
            portfolio={portfolio}
            onCompleteLesson={handleCompleteLesson}
            onToggleBookmark={handleToggleBookmark}
            onSelectCompanyForAnalysis={handleOpenTradeModal}
          />
        )}

        {activeTab === 'market' && (
          <MarketRadar
            companies={companies}
            portfolio={portfolio}
            onToggleTrackTicker={handleToggleTrackTicker}
            onOpenTradeModal={handleOpenTradeModal}
          />
        )}

        {activeTab === 'portfolio' && (
          <PortfolioAnalytics
            portfolio={portfolio}
            companies={companies}
            onClosePosition={handleClosePosition}
            onResetPortfolio={handleResetPortfolio}
          />
        )}

        {activeTab === 'trading' && (
          <SimulatedTradingArena
            companies={companies}
            portfolio={portfolio}
            onExecuteTrade={handleExecuteTrade}
            initialTicker={tradeArenaTicker}
          />
        )}

        {activeTab === 'mentor' && (
          <AIMentorDrawer portfolio={portfolio} />
        )}
      </main>
    </div>
  );
}
