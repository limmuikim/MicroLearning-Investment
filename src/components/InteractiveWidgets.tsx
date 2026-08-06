import React, { useState } from 'react';
import { Sliders, Shield, Activity, HelpCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';

export const OptionsPayoffVisualizer: React.FC = () => {
  const [optionType, setOptionType] = useState<'CALL' | 'PUT'>('CALL');
  const [strikePrice, setStrikePrice] = useState<number>(135);
  const [premium, setPremium] = useState<number>(5);
  const [simulatedPrice, setSimulatedPrice] = useState<number>(140);

  // Generate payoff curve data points
  const minPrice = Math.max(80, strikePrice - 40);
  const maxPrice = strikePrice + 40;
  const chartData = [];

  for (let p = minPrice; p <= maxPrice; p += 2) {
    let profit = 0;
    if (optionType === 'CALL') {
      profit = Math.max(0, p - strikePrice) - premium;
    } else {
      profit = Math.max(0, strikePrice - p) - premium;
    }
    chartData.push({
      price: p,
      profit: Number((profit * 100).toFixed(0)), // Per contract (100 shares)
    });
  }

  // Current simulated payoff calculation
  const currentPayoff = optionType === 'CALL'
    ? (Math.max(0, simulatedPrice - strikePrice) - premium) * 100
    : (Math.max(0, strikePrice - simulatedPrice) - premium) * 100;

  const breakEven = optionType === 'CALL' ? strikePrice + premium : strikePrice - premium;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 my-4 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Interactive Concept Tool
          </span>
          <h4 className="text-base font-bold text-slate-100 mt-1">Options Profit/Loss Payoff Simulator</h4>
        </div>
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setOptionType('CALL')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
              optionType === 'CALL' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Call Option (Bullish)
          </button>
          <button
            onClick={() => setOptionType('PUT')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
              optionType === 'PUT' ? 'bg-rose-500 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Put Option (Bearish)
          </button>
        </div>
      </div>

      {/* Control Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
        <div>
          <label className="text-xs text-slate-400 font-medium block mb-1">Strike Price: <span className="text-slate-200 font-bold">${strikePrice}</span></label>
          <input
            type="range"
            min="100"
            max="200"
            step="5"
            value={strikePrice}
            onChange={(e) => setStrikePrice(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 font-medium block mb-1">Option Premium Paid: <span className="text-slate-200 font-bold">${premium}</span> ($500/contract)</label>
          <input
            type="range"
            min="1"
            max="15"
            step="0.5"
            value={premium}
            onChange={(e) => setPremium(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 font-medium block mb-1">Stock Price at Expiration: <span className="text-emerald-400 font-bold">${simulatedPrice}</span></label>
          <input
            type="range"
            min={strikePrice - 30}
            max={strikePrice + 30}
            step="1"
            value={simulatedPrice}
            onChange={(e) => setSimulatedPrice(Number(e.target.value))}
            className="w-full accent-emerald-400 cursor-pointer"
          />
        </div>
      </div>

      {/* Payoff Chart */}
      <div className="h-52 w-full bg-slate-950/40 p-2 rounded-xl border border-slate-800/60 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="price" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              formatter={(val: any) => [`$${val}`, 'Profit/Loss (1 Contract)']}
              labelFormatter={(lbl) => `Stock Price: $${lbl}`}
            />
            <ReferenceLine y={0} stroke="#475569" strokeDasharray="3 3" />
            <ReferenceLine x={breakEven} stroke="#eab308" label={{ value: `Break-even: $${breakEven}`, fill: '#eab308', fontSize: 11, position: 'top' }} />
            <ReferenceLine x={simulatedPrice} stroke="#38bdf8" label={{ value: `Selected: $${simulatedPrice}`, fill: '#38bdf8', fontSize: 11 }} />
            <Area type="monotone" dataKey="profit" stroke="#10b981" fillOpacity={1} fill="url(#profitGrad)" strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Results Summary Box */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Break-Even Price</span>
            <span className="text-base font-bold text-amber-400">${breakEven.toFixed(2)}</span>
          </div>
          <HelpCircle className="w-4 h-4 text-slate-500" />
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Max Loss Risk</span>
            <span className="text-base font-bold text-rose-400">-${(premium * 100).toFixed(2)}</span>
          </div>
          <Shield className="w-4 h-4 text-rose-400" />
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Simulated P&L at ${simulatedPrice}</span>
            <div className="flex items-center gap-1">
              {currentPayoff >= 0 ? <ArrowUpRight className="w-4 h-4 text-emerald-400" /> : <ArrowDownRight className="w-4 h-4 text-rose-400" />}
              <span className={`text-base font-bold ${currentPayoff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {currentPayoff >= 0 ? '+' : ''}${currentPayoff.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RsiGaugeWidget: React.FC = () => {
  const [rsiVal, setRsiVal] = useState<number>(68);

  const getRsiCategory = (rsi: number) => {
    if (rsi >= 70) return { label: 'Overbought (High Pullback Risk)', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' };
    if (rsi <= 30) return { label: 'Oversold (Mean Reversion Opportunity)', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    return { label: 'Neutral Momentum Zone', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
  };

  const status = getRsiCategory(rsiVal);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 my-4 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Interactive RSI (Relative Strength Index) Dial</span>
        </h4>
        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${status.bg} ${status.color}`}>
          RSI {rsiVal} — {status.label}
        </span>
      </div>

      <div className="my-4">
        <input
          type="range"
          min="10"
          max="90"
          value={rsiVal}
          onChange={(e) => setRsiVal(Number(e.target.value))}
          className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
        />
        <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-2 px-1">
          <span className="text-emerald-400 font-bold">0-30: Oversold (Bullish Bounce)</span>
          <span className="text-amber-400">30-70: Neutral Range</span>
          <span className="text-rose-400 font-bold">70-100: Overbought (Selloff Danger)</span>
        </div>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
        <span className="text-emerald-400 font-bold">Technical Analysis Insight:</span> When RSI breaches 70 (like NVDA or TSLA during momentum runs), institutional traders look for candlestick upper wick rejections before taking profit. Conversely, RSI below 30 signals exhaustion selling.
      </p>
    </div>
  );
};

export const PositionSizerWidget: React.FC = () => {
  const [portfolioValue, setPortfolioValue] = useState<number>(100000);
  const [entryPrice, setEntryPrice] = useState<number>(138);
  const [stopLoss, setStopLoss] = useState<number>(132);

  const riskPerShare = Math.max(0.1, entryPrice - stopLoss);
  const maxRiskDollar = portfolioValue * 0.01; // 1% Rule
  const maxShares = Math.floor(maxRiskDollar / riskPerShare);
  const positionTotalCapital = maxShares * entryPrice;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 my-4 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>1% Risk Rule Position Size Calculator</span>
        </h4>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Institutional Risk Rule
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
        <div>
          <label className="text-xs text-slate-400 block font-medium mb-1">Total Portfolio Value</label>
          <input
            type="number"
            value={portfolioValue}
            onChange={(e) => setPortfolioValue(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-bold"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block font-medium mb-1">Target Stock Entry Price ($)</label>
          <input
            type="number"
            value={entryPrice}
            onChange={(e) => setEntryPrice(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-bold"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block font-medium mb-1">Planned Stop-Loss Exit ($)</label>
          <input
            type="number"
            value={stopLoss}
            onChange={(e) => setStopLoss(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-bold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Max 1% Risk Dollar Budget</span>
          <span className="text-base font-bold text-amber-400">${maxRiskDollar.toLocaleString()}</span>
        </div>
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Risk Per Share</span>
          <span className="text-base font-bold text-rose-400">${riskPerShare.toFixed(2)}</span>
        </div>
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Recommended Max Share Count</span>
          <span className="text-lg font-extrabold text-emerald-400">{maxShares} Shares</span>
          <span className="text-[10px] text-slate-500 block">(${positionTotalCapital.toLocaleString()} total position)</span>
        </div>
      </div>
    </div>
  );
};

export const AssetAllocationSlider: React.FC = () => {
  const [growthRatio, setGrowthRatio] = useState<number>(60);
  const defensiveRatio = 100 - growthRatio;

  const projectedVolatility = (growthRatio * 0.28 + defensiveRatio * 0.08).toFixed(1);
  const projectedDividendYield = (growthRatio * 0.005 + defensiveRatio * 0.032 * 100).toFixed(2);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 my-4 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span>Strategic Asset Allocation Weighting</span>
        </h4>
        <span className="text-xs font-bold text-slate-300">
          {growthRatio}% Growth / {defensiveRatio}% Value & Dividend
        </span>
      </div>

      <div className="my-4">
        <input
          type="range"
          min="10"
          max="90"
          step="5"
          value={growthRatio}
          onChange={(e) => setGrowthRatio(Number(e.target.value))}
          className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
        <div>
          <span className="text-xs text-slate-400 block">Projected Annual Volatility</span>
          <span className="text-base font-bold text-amber-400">{projectedVolatility}%</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block">Estimated Dividend Yield</span>
          <span className="text-base font-bold text-emerald-400">{projectedDividendYield}%</span>
        </div>
      </div>
    </div>
  );
};
