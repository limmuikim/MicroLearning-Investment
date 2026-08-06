import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, Send, BookOpen, RefreshCw, ChevronRight, HelpCircle } from 'lucide-react';
import { AIMessage, UserPortfolio } from '../types';

interface AIMentorDrawerProps {
  portfolio: UserPortfolio;
}

export const AIMentorDrawer: React.FC<AIMentorDrawerProps> = ({ portfolio }) => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello investor! I am your AI Financial Mentor powered by Gemini. Ask me any question about market concepts, options strategies (Calls/Puts), technical chart patterns, or valuation metrics.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dailyDigest, setDailyDigest] = useState<string | null>(null);
  const [isDigestLoading, setIsDigestLoading] = useState<boolean>(false);

  // Fetch initial AI Daily Digest on load
  const fetchDailyDigest = async () => {
    setIsDigestLoading(true);
    try {
      const res = await fetch('/api/ai/daily-digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackedTickers: portfolio.trackedTickers,
          completedTopics: portfolio.completedLessonIds,
        }),
      });
      const data = await res.json();
      setDailyDigest(data.digest || 'Daily digest generated.');
    } catch (err) {
      console.error(err);
      setDailyDigest('Unable to load AI daily digest right now.');
    } finally {
      setIsDigestLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyDigest();
  }, []);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: AIMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/ask-mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          context: {
            trackedTickers: portfolio.trackedTickers,
            userLevel: portfolio.userLevel,
          },
        }),
      });
      const data = await res.json();

      const aiMsg: AIMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.answer || 'Thank you for your question.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const presetQueries = [
    'Explain Call vs Put Options using NVDA',
    'How does Fed interest rate affect TSLA?',
    'What is the 1% risk rule for position sizing?',
    'How to read RSI overbought levels on charts?',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
              Gemini Powered Assistant
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight">
            AI Market Digest & <span className="font-bold text-indigo-600">Financial Mentor</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Get personalized market briefings and instant answers to financial concepts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left AI Daily Market Digest (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Daily Market Insights Digest</h3>
              </div>
              <button
                onClick={fetchDailyDigest}
                disabled={isDigestLoading}
                className="p-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isDigestLoading ? 'animate-spin text-indigo-600' : ''}`} />
              </button>
            </div>

            {isDigestLoading ? (
              <div className="py-12 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
                <span>Generating tailored AI market digest...</span>
              </div>
            ) : (
              <div className="text-xs text-slate-700 leading-relaxed space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {dailyDigest?.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Preset Starter Chips */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Popular Microlearning Questions</h4>
            <div className="space-y-2">
              {presetQueries.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSendMessage(q)}
                  className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 text-xs text-slate-700 hover:text-indigo-900 font-medium flex items-center justify-between transition-all group"
                >
                  <span>{q}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Q&A Chat Panel (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col h-[600px]">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">InvestPulse AI Mentor Chat</h3>
                <span className="text-[10px] text-indigo-600 font-semibold">Ready to explain financial concepts</span>
              </div>
            </div>

            {/* Message History */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-slate-900 text-white font-medium rounded-tr-none'
                        : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                    <span
                      className={`text-[9px] block mt-2 text-right ${
                        msg.sender === 'user' ? 'text-slate-300' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-xs text-slate-500 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
                    <span>AI Mentor is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 pt-3 border-t border-slate-100"
            >
              <input
                type="text"
                placeholder="Ask about options, chart patterns, risk management..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 transition-all shadow-sm"
              />
              <button
                type="submit"
                disabled={isLoading || !inputQuery.trim()}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all disabled:opacity-50 shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
