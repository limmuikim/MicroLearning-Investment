import React from 'react';
import { UserPortfolio, CompanyStock, TradePosition } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis } from 'recharts';
import { ShieldCheck, ShieldAlert, DollarSign, TrendingUp, AlertTriangle, Layers, PieChart as PieIcon, Activity, RefreshCw } from 'lucide-react';

interface PortfolioAnalyticsProps {
  portfolio: UserPortfolio;
  companies: CompanyStock[];
  onClosePosition: (positionId: string) => void;
  onResetPortfolio: () => void;
}

export const PortfolioAnalytics: React.FC<PortfolioAnalyticsProps> = ({
  portfolio,
  companies,
  onClosePosition,
  onResetPortfolio,
}) => {
  // Calculate current positions market value
  const positionsValue = portfolio.positions.reduce((acc, pos) => {
    return acc + (pos.currentPrice * pos.sharesOrContracts);
  }, 0);

  const totalNetWorth = portfolio.cashBalance + positionsValue;
  const totalPnl = totalNetWorth - portfolio.startingBalance;
  const totalPnlPercent = (totalPnl / portfolio.startingBalance) * 100;

  // Sector breakdown calculation
  const sectorMap: Record<string, number> = {};
  portfolio.positions.forEach((pos) => {
    const comp = companies.find((c) => c.ticker === pos.ticker);
    const secName = comp ? comp.sector.split('/')[0].trim() : 'Other';
    const posVal = pos.currentPrice * pos.sharesOrContracts;
    sectorMap[secName] = (sectorMap[secName] || 0) + posVal;
  });

  if (portfolio.cashBalance > 0) {
    sectorMap['Unallocated Cash'] = portfolio.cashBalance;
  }

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6', '#ec4899', '#64748b'];

  const sectorChartData = Object.keys(sectorMap).map((key, i) => ({
    name: key,
    value: Number(sectorMap[key].toFixed(2)),
    color: COLORS[i % COLORS.length],
  }));

  // Portfolio Beta Calculation
  let weightedBetaSum = 0;
  if (positionsValue > 0) {
    portfolio.positions.forEach((pos) => {
      const comp = companies.find((c) => c.ticker === pos.ticker);
      const b = comp ? comp.beta : 1.0;
      const weight = (pos.currentPrice * pos.sharesOrContracts) / positionsValue;
      weightedBetaSum += b * weight;
    });
  } else {
    weightedBetaSum = 1.0;
  }

  // Diversification Score (0 - 100)
  const uniqueSectors = Object.keys(sectorMap).filter((s) => s !== 'Unallocated Cash').length;
  const maxPositionWeight = portfolio.positions.length > 0
    ? Math.max(...portfolio.positions.map((p) => (p.currentPrice * p.sharesOrContracts) / totalNetWorth))
    : 0;

  let diversificationScore = Math.min(100, uniqueSectors * 20 + (1 - maxPositionWeight) * 40);
  if (portfolio.positions.length === 0) diversificationScore = 50;

  const getRiskLevel = (beta: number, maxWeight: number) => {
    if (beta > 1.8 || maxWeight > 0.45) return { label: 'High Speculative Risk', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' };
    if (beta > 1.2 || maxWeight > 0.3) return { label: 'Aggressive Growth', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' };
    return { label: 'Balanced & Diversified', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' };
  };

  const riskInfo = getRiskLevel(weightedBetaSum, maxPositionWeight);

  // Synthetic equity curve history
  const equityCurve = [
    { date: 'Day 1', balance: portfolio.startingBalance },
    { date: 'Day 2', balance: portfolio.startingBalance * 1.008 },
    { date: 'Day 3', balance: portfolio.startingBalance * 1.015 },
    { date: 'Day 4', balance: portfolio.startingBalance * 1.012 },
    { date: 'Current', balance: totalNetWorth },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
            Real-Time Portfolio Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight mt-1">
            Portfolio Analytics & <span className="font-bold text-indigo-600">Risk Audit</span>
          </h1>
        </div>

        <button
          onClick={onResetPortfolio}
          className="self-start md:self-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 transition-all shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Paper Portfolio</span>
        </button>
      </div>

      {/* Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Net Worth</span>
          <div className="text-2xl font-bold text-slate-900">${totalNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <span className="text-xs text-slate-500 mt-1 block">Starting: ${portfolio.startingBalance.toLocaleString()}</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">All-Time Return</span>
          <div className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {totalPnl >= 0 ? '+' : ''}${totalPnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className={`text-xs font-bold ${totalPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {totalPnlPercent >= 0 ? '+' : ''}{totalPnlPercent.toFixed(2)}% Return
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Portfolio Beta (β)</span>
          <div className="text-2xl font-bold text-amber-700">{weightedBetaSum.toFixed(2)}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Market sensitivity benchmark</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Diversification Score</span>
          <div className="text-2xl font-bold text-indigo-600">{diversificationScore.toFixed(0)} / 100</div>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border mt-1 inline-block ${riskInfo.bg} ${riskInfo.color}`}>
            {riskInfo.label}
          </span>
        </div>
      </div>

      {/* Analytics Visualizers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Sector Breakdown Pie Chart */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-indigo-600" />
            <span>Sector & Asset Allocation Breakdown</span>
          </h3>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sectorChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#0f172a' }}
                  formatter={(val: any) => [`$${val.toLocaleString()}`, 'Allocation']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100">
            {sectorChartData.map((s) => (
              <div key={s.name} className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }}></span>
                <span className="text-slate-600 font-medium truncate">{s.name}:</span>
                <span className="font-bold text-slate-900">${s.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Growth Curve */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span>Simulated Equity Curve Trajectory</span>
          </h3>

          <div className="h-64 w-full bg-slate-50 p-2 rounded-2xl border border-slate-200">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equityCurve} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis domain={['auto', 'auto']} stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#0f172a' }}
                  formatter={(val: any) => [`$${Number(val).toFixed(2)}`, 'Net Worth']}
                />
                <Area type="monotone" dataKey="balance" stroke="#4f46e5" strokeWidth={2.5} fill="url(#equityGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Active Holdings Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Active Open Paper Positions</h3>

        {portfolio.positions.length === 0 ? (
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
            <p className="text-xs">No active positions open right now. Head to the Trading Arena to execute paper stock or option orders!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Asset Ticker</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Qty</th>
                  <th className="py-3 px-4">Entry Price</th>
                  <th className="py-3 px-4">Current Price</th>
                  <th className="py-3 px-4">Market Value</th>
                  <th className="py-3 px-4">Unrealized P&L</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {portfolio.positions.map((pos) => {
                  const mktVal = pos.currentPrice * pos.sharesOrContracts;
                  const costBasis = pos.entryPrice * pos.sharesOrContracts;
                  const pnl = mktVal - costBasis;
                  const pnlPercent = (pnl / costBasis) * 100;
                  const isPos = pnl >= 0;

                  return (
                    <tr key={pos.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{pos.ticker}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          pos.type === 'BUY_STOCK' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-sky-50 text-sky-700 border-sky-200'
                        }`}>
                          {pos.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{pos.sharesOrContracts}</td>
                      <td className="py-3 px-4 text-slate-600">${pos.entryPrice.toFixed(2)}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">${pos.currentPrice.toFixed(2)}</td>
                      <td className="py-3 px-4 font-bold text-slate-700">${mktVal.toFixed(2)}</td>
                      <td className="py-3 px-4 font-bold">
                        <span className={isPos ? 'text-emerald-600' : 'text-rose-600'}>
                          {isPos ? '+' : ''}${pnl.toFixed(2)} ({isPos ? '+' : ''}{pnlPercent.toFixed(2)}%)
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onClosePosition(pos.id)}
                          className="px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-semibold transition-all"
                        >
                          Close Position
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
