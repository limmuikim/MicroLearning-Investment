import React, { useState } from 'react';
import { CompanyStock, UserPortfolio } from '../types';
import { TechnicalChartWidget } from './TechnicalChartWidget';
import { Search, Eye, Plus, Check, TrendingUp, TrendingDown, Layers, ArrowUpRight, ArrowDownRight, Globe, Zap, Shield, BarChart2 } from 'lucide-react';

interface MarketRadarProps {
  companies: CompanyStock[];
  portfolio: UserPortfolio;
  onToggleTrackTicker: (ticker: string) => void;
  onOpenTradeModal: (ticker: string) => void;
  selectedTickerForModal?: string;
  onCloseModal?: () => void;
}

export const MarketRadar: React.FC<MarketRadarProps> = ({
  companies,
  portfolio,
  onToggleTrackTicker,
  onOpenTradeModal,
}) => {
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalCompany, setActiveModalCompany] = useState<CompanyStock | null>(null);

  const sectors = ['all', 'Technology', 'Automotive', 'Healthcare', 'Financials', 'Consumer', 'Energy'];

  const filteredCompanies = companies.filter((c) => {
    const matchesSector = selectedSector === 'all' || c.sector.toLowerCase().includes(selectedSector.toLowerCase());
    const matchesSearch = c.ticker.toLowerCase().includes(searchQuery.toLowerCase()) || c.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
              Live Sector Benchmark Tracker
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight">
            Key Sector Companies & <span className="font-bold text-indigo-600">Market Insights</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track key companies illustrating broader macroeconomic trends, valuation metrics, and technical indicators.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ticker or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Sector Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {sectors.map((sec) => (
          <button
            key={sec}
            onClick={() => setSelectedSector(sec)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all border ${
              selectedSector === sec
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {sec === 'all' ? 'All Sectors' : sec}
          </button>
        ))}
      </div>

      {/* Grid of Company Stocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredCompanies.map((company) => {
          const isTracked = portfolio.trackedTickers.includes(company.ticker);
          const isPositive = company.change >= 0;

          return (
            <div
              key={company.ticker}
              className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-indigo-300 transition-all shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Top Company Title Bar */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-slate-900">{company.ticker}</span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {company.sector.split('/')[0]}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 block mt-0.5 font-medium">{company.name}</span>
                  </div>

                  <button
                    onClick={() => onToggleTrackTicker(company.ticker)}
                    className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                      isTracked
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {isTracked ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{isTracked ? 'Tracked' : 'Track'}</span>
                  </button>
                </div>

                {/* Price & Change Banner */}
                <div className="flex items-baseline justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200 mb-4">
                  <div>
                    <span className="text-2xl font-bold text-slate-900">${company.price.toFixed(2)}</span>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded ${
                    isPositive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    <span>{isPositive ? '+' : ''}{company.changePercent.toFixed(2)}%</span>
                  </div>
                </div>

                {/* Micro Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200 mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">P/E</span>
                    <span className="font-bold text-slate-800">{company.peRatio}x</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Beta (β)</span>
                    <span className="font-bold text-amber-700">{company.beta}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">RSI (14)</span>
                    <span className={`font-bold ${company.rsi > 70 ? 'text-rose-600' : company.rsi < 30 ? 'text-emerald-600' : 'text-slate-800'}`}>
                      {company.rsi}
                    </span>
                  </div>
                </div>

                {/* Economic Impact Summary Note */}
                <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-indigo-600 font-bold">Macro Impact:</span> {company.economicImpactSummary}
                </p>

                {/* News Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {company.newsTags.map((tag) => (
                    <span key={tag} className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setActiveModalCompany(company)}
                  className="flex-1 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <BarChart2 className="w-4 h-4 text-indigo-600" />
                  <span>Technical Chart</span>
                </button>

                <button
                  onClick={() => onOpenTradeModal(company.ticker)}
                  className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Trade Paper</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stock Detail Modal */}
      {activeModalCompany && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full p-6 sm:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModalCompany(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 bg-slate-100 p-2 rounded-full"
            >
              ✕
            </button>

            {/* Technical Chart Component */}
            <TechnicalChartWidget company={activeModalCompany} />

            {/* Macro Impact Detail */}
            <div className="mt-6 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-600" />
                <span>Macroeconomic Sector & Economic Trend Impact</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeModalCompany.description}
              </p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 shadow-xs">
                <span className="font-bold text-amber-700 block mb-1">Educational Takeaway:</span>
                {activeModalCompany.economicImpactSummary}
              </div>
            </div>

            {/* Trade Action Trigger */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setActiveModalCompany(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100"
              >
                Close Window
              </button>
              <button
                onClick={() => {
                  const ticker = activeModalCompany.ticker;
                  setActiveModalCompany(null);
                  onOpenTradeModal(ticker);
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2 shadow-sm"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Open Paper Trading Order</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
