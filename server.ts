import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Safe lazy initializer for Gemini API client
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API Endpoints
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Daily AI Digest Endpoint
  app.post('/api/ai/daily-digest', async (req, res) => {
    try {
      const { trackedTickers = ['NVDA', 'AAPL', 'TSLA'], completedTopics = [] } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          digest: `### 📈 Daily Market Pulse & Sector Overview\n\n- **Tech & Semiconductor Sector (NVDA, AAPL)**: Equities are maintaining solid support near 20-day moving averages as data center infrastructure capex remains high.\n- **Clean Tech & Automotive (TSLA)**: High beta price swings continue. Key focus remains on macro rate cut expectations.\n- **Defensive Health (LLY)**: Steady inflows as investors balance growth with defensive yield.\n\n*Tip: Connect your Gemini API Key in Settings > Secrets to unlock live tailored AI macro digests.*`
        });
      }

      const prompt = `You are a top-tier institutional financial educator for retail investors.
Provide a concise 3-bullet daily market insight digest for an investor tracking these tickers: ${trackedTickers.join(', ')}.
Recently completed microlearning topics: ${completedTopics.join(', ') || 'Market Essentials'}.

Format with clean Markdown:
1. Macro Trend Impact (Interest rates/inflation relation)
2. Sector Specific Catalyst (for the tracked stocks)
3. Actionable Microlearning Takeaway for today's trading practice.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
      });

      res.json({ digest: response.text || 'Market digest generated.' });
    } catch (err: any) {
      console.error('Error generating daily digest:', err);
      res.status(500).json({ error: err.message || 'Failed to generate market digest' });
    }
  });

  // AI Mentor Financial Q&A Endpoint
  app.post('/api/ai/ask-mentor', async (req, res) => {
    try {
      const { question, context } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          answer: `Here is the financial breakdown for **"${question}"**:\n\n- **Core Concept**: In financial markets, this concept relates to managing risk-adjusted returns and timing position entries with technical indicators like RSI or moving averages.\n- **Real-World Application**: When analyzing companies like NVDA or TSLA, always evaluate valuation metrics (P/E, Free Cash Flow) alongside macroeconomic interest rate conditions.\n\n*Configure GEMINI_API_KEY in Secrets for personalized AI answers.*`
        });
      }

      const prompt = `You are InvestPulse AI, a friendly, concise, and highly educational financial mentor for investors.
User Question: "${question}"
Context (if any): ${JSON.stringify(context || {})}

Rules:
1. Explain in simple, crystal-clear terms using short bullet points.
2. Provide a practical real-world company example (e.g. NVDA, AAPL, TSLA, LLY, JPM) when applicable.
3. Emphasize risk management (position sizing, stop-loss, risk-reward ratio).
4. Keep the total length around 150-250 words.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
      });

      res.json({ answer: response.text || 'Response generated.' });
    } catch (err: any) {
      console.error('Error in ask-mentor:', err);
      res.status(500).json({ error: err.message || 'Failed to generate mentor answer' });
    }
  });

  // AI Trade Review & Audit Endpoint
  app.post('/api/ai/analyze-trade', async (req, res) => {
    try {
      const { ticker, type, quantity, entryPrice, stopLoss, takeProfit, portfolioBalance } = req.body;
      const ai = getGeminiClient();

      const riskPerShare = stopLoss ? Math.abs(entryPrice - stopLoss) : entryPrice * 0.05;
      const totalRisk = riskPerShare * quantity;
      const riskPercent = portfolioBalance ? ((totalRisk / portfolioBalance) * 100).toFixed(2) : '2.5';

      if (!ai) {
        return res.json({
          feedback: `### 🛡️ Trade Risk Audit (${ticker} ${type})\n- **Position Risk**: Total risk estimate is ~$${totalRisk.toFixed(2)} (~${riskPercent}% of balance).\n- **Risk-Reward Rating**: ${takeProfit ? 'Calculated risk-reward target is set cleanly.' : 'Consider defining a Take-Profit target at 2x your risk distance.'}\n- **Educational Tip**: Align this order with technical support/resistance levels and check RSI before confirming.`
        });
      }

      const prompt = `Analyze this simulated trade order for an educational paper trading platform:
Ticker: ${ticker}
Order Type: ${type}
Quantity: ${quantity}
Entry Price: $${entryPrice}
Stop-Loss: ${stopLoss ? `$${stopLoss}` : 'None specified'}
Take-Profit: ${takeProfit ? `$${takeProfit}` : 'None specified'}
Portfolio Total Balance: $${portfolioBalance}

Provide a 3-bullet institutional critique:
1. **Position Sizing & Capital at Risk** (Assess against the 1% risk rule)
2. **Risk/Reward Profile** (Evaluate Stop-Loss vs Take-Profit setup)
3. **Strategic Learning Connection** (How this trade applies market concepts learned in microlearning)
Keep it direct, educational, and constructive.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
      });

      res.json({ feedback: response.text || 'Trade analysis completed.' });
    } catch (err: any) {
      console.error('Error analyzing trade:', err);
      res.status(500).json({ error: err.message || 'Failed to analyze trade' });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
