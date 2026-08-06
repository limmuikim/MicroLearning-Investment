import React from 'react';
import { BookOpen, TrendingUp, Briefcase, Zap, Bot, Flame, Trophy, DollarSign } from 'lucide-react';
import { UserPortfolio } from '../types';

interface NavbarProps {
  activeTab: 'learn' | 'market' | 'portfolio' | 'trading' | 'mentor';
  setActiveTab: (tab: 'learn' | 'market' | 'portfolio' | 'trading' | 'mentor') => void;
  portfolio: UserPortfolio;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, portfolio }) => {
  const totalValue = portfolio.cashBalance + portfolio.positions.reduce((acc, pos) => acc + (pos.currentPrice * pos.sharesOrContracts), 0);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('learn')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
              V
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight uppercase text-slate-900">
                  Vantage
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                  15m Microlearning
                </span>
              </div>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80">
            <button
              onClick={() => setActiveTab('learn')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'learn'
                  ? 'bg-white text-indigo-600 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Learn (15m)</span>
            </button>

            <button
              onClick={() => setActiveTab('market')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'market'
                  ? 'bg-white text-indigo-600 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Sector Radar</span>
            </button>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'portfolio'
                  ? 'bg-white text-indigo-600 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('trading')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'trading'
                  ? 'bg-white text-indigo-600 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Sim Arena</span>
            </button>

            <button
              onClick={() => setActiveTab('mentor')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'mentor'
                  ? 'bg-white text-indigo-600 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>AI Mentor</span>
            </button>
          </nav>

          {/* Right User Stats */}
          <div className="flex items-center gap-4">
            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/60 text-amber-700 px-3 py-1.5 rounded-xl text-xs font-bold">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>{portfolio.streakDays} Day Streak</span>
            </div>

            {/* Level & XP */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
              <Trophy className="w-3.5 h-3.5 text-indigo-600" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-semibold leading-none">Lvl {portfolio.userLevel}</span>
                <span className="font-bold text-slate-800 leading-tight">{portfolio.userXp} XP</span>
              </div>
            </div>

            {/* Virtual Equity Pill */}
            <div 
              onClick={() => setActiveTab('portfolio')}
              className="flex items-center gap-2 bg-white border border-slate-200 hover:border-indigo-300 px-3.5 py-1.5 rounded-xl cursor-pointer transition-all shadow-sm"
            >
              <div className="text-right">
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest leading-none">Virtual Equity</p>
                <p className="text-sm font-mono font-bold text-emerald-600 leading-tight">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-200 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('learn')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
              activeTab === 'learn' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Learn</span>
          </button>
          <button
            onClick={() => setActiveTab('market')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
              activeTab === 'market' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Radar</span>
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
              activeTab === 'portfolio' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('trading')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
              activeTab === 'trading' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Trading</span>
          </button>
          <button
            onClick={() => setActiveTab('mentor')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
              activeTab === 'mentor' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI</span>
          </button>
        </div>
      </div>
    </header>
  );
};
