import React, { useState } from 'react';
import { CompanyStock, UserPortfolio, TradeOrder } from '../types';
import { Zap, ShieldAlert, ArrowUpRight, ArrowDownRight, AlertTriangle, CheckCircle, Sparkles, HelpCircle, Activity } from 'lucide-react';

interface SimulatedTradingArenaProps {
  companies: CompanyStock[];
  portfolio: UserPortfolio;
  onExecuteTrade: (
    ticker: string,
    tradeType: 'BUY_STOCK' | 'CALL_OPTION' | 'PUT_OPTION',
    quantity: number,
    price: number,
    stopLoss?: number,
    takeProfit?: number,
    strikePrice?: number,
    expirationDate?: string
  ) => Promise<string[]>; // Returns AI feedback audit notes
  initialTicker?: string;
}

export const SimulatedTradingArena: React.FC<SimulatedTradingArenaProps> = ({
  companies,
  portfolio,
  onExecuteTrade,
  initialTicker = 'NVDA',
}) => {
  const [selectedTicker, setSelectedTicker] = useState<string>(initialTicker);
  const [tradeCategory, setTradeCategory] = useState<'STOCK' | 'OPTION'>('STOCK');
  const [optionType, setOptionType] = useState<'CALL_OPTION' | 'PUT_OPTION'>('CALL_OPTION');
  const [quantity, setQuantity] = useState<number>(10);
  const [stopLoss, setStopLoss] = useState<string>('');
  const [takeProfit, setTakeProfit] = useState<string>('');
  const [strikePrice, setStrikePrice] = useState<number>(140);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [tradeAuditFeedback, setTradeAuditFeedback] = useState<string[] | null>(null);

  const activeCompany = companies.find((c) => c.ticker === selectedTicker) || companies[0];

  const executionPrice = tradeCategory === 'STOCK'
    ? activeCompany.price
    : 4.50; // Standard simulated option contract premium per share

  const totalCost = tradeCategory === 'STOCK'
    ? quantity * executionPrice
    : quantity * 100 * executionPrice; // 1 contract = 100 shares

  // Real-time risk validator calculations
  const stopLossNum = stopLoss ? parseFloat(stopLoss) : undefined;
  const takeProfitNum = takeProfit ? parseFloat(takeProfit) : undefined;
  
  const riskPerShare = stopLossNum ? Math.abs(executionPrice - stopLossNum) : executionPrice * 0.05;
  const totalDollarRisk = tradeCategory === 'STOCK' ? quantity * riskPerShare : quantity * 100 * executionPrice;
  const riskPercentageOfPortfolio = (totalDollarRisk / portfolio.cashBalance) * 100;

  const isRiskExceeded = riskPercentageOfPortfolio > 5.0; // Warning if > 5% of balance at risk
  const isOverBalance = totalCost > portfolio.cashBalance;

  const handleTradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOverBalance) return;

    setIsExecuting(true);
    setTradeAuditFeedback(null);

    const type = tradeCategory === 'STOCK' ? 'BUY_STOCK' : optionType;
    const feedback = await onExecuteTrade(
      selectedTicker,
      type,
      quantity,
      executionPrice,
      stopLossNum,
      takeProfitNum,
      tradeCategory === 'OPTION' ? strikePrice : undefined,
      tradeCategory === 'OPTION' ? '30 Days' : undefined
    );

    setTradeAuditFeedback(feedback);
    setIsExecuting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
              Simulated Trading Sandbox
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight">
            Paper Trading & <span className="font-bold text-indigo-600">Real-Time Risk Arena</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Test trading strategies in a risk-free environment with instant institutional risk audits and AI feedback.
          </p>
        </div>

        <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Available Paper Cash:</span>
          <span className="text-sm font-bold text-slate-900">${portfolio.cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Trading Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            {/* Asset Ticker Selector */}
            <div className="mb-6">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Select Asset Ticker</label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {companies.map((c) => (
                  <button
                    key={c.ticker}
                    type="button"
                    onClick={() => {
                      setSelectedTicker(c.ticker);
                      setStrikePrice(Math.round(c.price));
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all border ${
                      selectedTicker === c.ticker
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {c.ticker}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Company Banner */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold text-slate-600">{activeCompany.name} ({activeCompany.sector.split('/')[0]})</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xl font-bold text-slate-900">${activeCompany.price.toFixed(2)}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    activeCompany.change >= 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {activeCompany.change >= 0 ? '+' : ''}{activeCompany.changePercent}%
                  </span>
                </div>
              </div>
              <div className="text-right text-xs">
                <span className="text-slate-500 block">Beta (β): <strong className="text-amber-700">{activeCompany.beta}</strong></span>
                <span className="text-slate-500 block">RSI: <strong className="text-indigo-600">{activeCompany.rsi}</strong></span>
              </div>
            </div>

            {/* Instrument Category Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 mb-6">
              <button
                type="button"
                onClick={() => setTradeCategory('STOCK')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                  tradeCategory === 'STOCK' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Stock Equity Shares
              </button>
              <button
                type="button"
                onClick={() => setTradeCategory('OPTION')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                  tradeCategory === 'OPTION' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Options Contracts (Call/Put)
              </button>
            </div>

            <form onSubmit={handleTradeSubmit} className="space-y-4">
              {/* Option specifics */}
              {tradeCategory === 'OPTION' && (
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <label className="text-xs text-slate-500 block font-medium mb-1">Option Type</label>
                    <select
                      value={optionType}
                      onChange={(e) => setOptionType(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-800 shadow-sm"
                    >
                      <option value="CALL_OPTION">Call Option (Bullish)</option>
                      <option value="PUT_OPTION">Put Option (Bearish)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 block font-medium mb-1">Strike Price ($)</label>
                    <input
                      type="number"
                      value={strikePrice}
                      onChange={(e) => setStrikePrice(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-800 shadow-sm"
                    />
                  </div>
                </div>
              )}

              {/* Quantity Input */}
              <div>
                <label className="text-xs text-slate-500 block font-medium mb-1">
                  {tradeCategory === 'STOCK' ? 'Number of Stock Shares' : 'Number of Contracts (100 shares/contract)'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-500 shadow-sm"
                />
              </div>

              {/* Stop Loss & Take Profit Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 block font-medium mb-1">Stop-Loss Exit Price ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder={`e.g. ${(activeCompany.price * 0.95).toFixed(2)}`}
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-rose-700 focus:outline-none focus:border-rose-500 shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-500 block font-medium mb-1">Take-Profit Target ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder={`e.g. ${(activeCompany.price * 1.10).toFixed(2)}`}
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-emerald-700 focus:outline-none focus:border-emerald-500 shadow-sm"
                  />
                </div>
              </div>

              {/* Real-time Pre-Trade Risk Warning Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Total Capital Cost:</span>
                  <span className="font-bold text-slate-900">${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Estimated Total Capital Risk:</span>
                  <span className={`font-bold ${isRiskExceeded ? 'text-rose-600' : 'text-amber-700'}`}>
                    ${totalDollarRisk.toFixed(2)} ({riskPercentageOfPortfolio.toFixed(1)}% of balance)
                  </span>
                </div>

                {isOverBalance && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-600 font-bold mt-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Insufficient paper cash available for this order setup.</span>
                  </div>
                )}
                {isRiskExceeded && !isOverBalance && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-700 font-semibold mt-2">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Warning: Total risk exceeds 5% of your balance. Consider reducing share count to adhere to 1% risk rule.</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isExecuting || isOverBalance}
                className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all ${
                  isOverBalance
                    ? 'opacity-50 cursor-not-allowed bg-slate-200 text-slate-400'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>{isExecuting ? 'Executing Paper Order...' : `Execute Paper ${tradeCategory} Order`}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Audit Feedback & Recent Orders (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Instant Trade Audit Panel */}
          {tradeAuditFeedback && (
            <div className="bg-indigo-50/80 border border-indigo-100 rounded-3xl p-6 shadow-sm animate-fade-in">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">AI Institutional Trade Critique</h3>
              </div>

              <div className="space-y-3 text-xs text-slate-700 leading-relaxed bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                {tradeAuditFeedback.map((line, index) => (
                  <p key={index} className="leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Trade Order History Log */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">Paper Order Executions Log</h3>

            {portfolio.orderHistory.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-6">No orders executed yet. Submit a paper trade above to see real-time execution logs.</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {portfolio.orderHistory.map((ord) => (
                  <div key={ord.id} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{ord.ticker}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {ord.type}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {ord.quantity} qty @ ${ord.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">{ord.timestamp}</span>
                      <span className="text-xs font-bold text-emerald-600">EXECUTED</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
