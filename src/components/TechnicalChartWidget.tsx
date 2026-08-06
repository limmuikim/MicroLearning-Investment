import React, { useState } from 'react';
import { CompanyStock } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Line } from 'recharts';
import { TrendingUp, Activity, Eye, Layers } from 'lucide-react';

interface TechnicalChartWidgetProps {
  company: CompanyStock;
}

export const TechnicalChartWidget: React.FC<TechnicalChartWidgetProps> = ({ company }) => {
  const [chartType, setChartType] = useState<'AREA' | 'CANDLESTICK'>('AREA');
  const [showMa20, setShowMa20] = useState<boolean>(true);
  const [showMa50, setShowMa50] = useState<boolean>(true);
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '1Y'>('1M');

  const isPositive = company.change >= 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-100">{company.name}</h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
              {company.ticker}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-2xl font-black text-slate-100">${company.price.toFixed(2)}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded flex items-center gap-0.5 ${
              isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {isPositive ? '+' : ''}{company.change.toFixed(2)} ({isPositive ? '+' : ''}{company.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setChartType('AREA')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                chartType === 'AREA' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Line / Area
            </button>
            <button
              onClick={() => setChartType('CANDLESTICK')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                chartType === 'CANDLESTICK' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              OHLC Bar
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs">
            <button
              onClick={() => setShowMa20(!showMa20)}
              className={`px-2.5 py-1 rounded border font-semibold ${
                showMa20 ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'text-slate-500 border-slate-800'
              }`}
            >
              MA 20
            </button>
            <button
              onClick={() => setShowMa50(!showMa50)}
              className={`px-2.5 py-1 rounded border font-semibold ${
                showMa50 ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'text-slate-500 border-slate-800'
              }`}
            >
              MA 50
            </button>
          </div>
        </div>
      </div>

      {/* Primary Chart Area */}
      <div className="h-64 w-full bg-slate-950/60 p-2 rounded-xl border border-slate-800/80 mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={company.chartHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="stockAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? "#10b981" : "#f43f5e"} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={isPositive ? "#10b981" : "#f43f5e"} stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis domain={['auto', 'auto']} stroke="#64748b" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', fontSize: '12px' }}
              formatter={(val: any, name: any) => [
                `$${Number(val).toFixed(2)}`,
                name === 'close' ? 'Closing Price' : name === 'ma20' ? '20-Day MA' : '50-Day MA'
              ]}
              labelFormatter={(lbl) => `Date: ${lbl}`}
            />
            {showMa20 && <Line type="monotone" dataKey="ma20" stroke="#f59e0b" strokeWidth={1.5} dot={false} />}
            {showMa50 && <Line type="monotone" dataKey="ma50" stroke="#06b6d4" strokeWidth={1.5} dot={false} />}
            <Area
              type="monotone"
              dataKey="close"
              stroke={isPositive ? "#10b981" : "#f43f5e"}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#stockAreaGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Volume Bar Chart */}
      <div className="h-20 w-full bg-slate-950/40 p-1 rounded-xl border border-slate-800/50 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={company.chartHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="date" hide />
            <YAxis hide />
            <Bar dataKey="volume" fill="#334155" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Financial Metric Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
        <div>
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">P/E Ratio</span>
          <span className="text-sm font-bold text-slate-200">{company.peRatio}x</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Beta (β)</span>
          <span className="text-sm font-bold text-amber-400">{company.beta}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">14-Day RSI</span>
          <span className={`text-sm font-bold ${company.rsi > 70 ? 'text-rose-400' : company.rsi < 30 ? 'text-emerald-400' : 'text-slate-200'}`}>
            {company.rsi}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">52W Range</span>
          <span className="text-xs font-bold text-slate-300">${company.fiftyTwoWeekLow} - ${company.fiftyTwoWeekHigh}</span>
        </div>
      </div>
    </div>
  );
};
