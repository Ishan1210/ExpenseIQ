import { useState } from 'react';
import { getInsights } from '../api/ai';

export default function AIInsightsCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate() {
    setLoading(true);
    setError('');
    try {
      const result = await getInsights();
      setData(result);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate insights');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-surface border border-white/5 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-sm font-semibold text-white">AI insights</h3>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-gold/10 text-gold border border-gold/30 rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-gold/20 transition disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : data ? 'Refresh' : 'Generate'}
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-3">
          {error}
        </div>
      )}

      {!data && !loading && !error && (
        <p className="text-sm text-mist">
          Get AI-generated insights on your spending patterns and savings health.
        </p>
      )}

      {data && (
        <div className="space-y-4">
          <p className="text-sm text-mist leading-relaxed">{data.summary}</p>

          {data.insights?.length > 0 && (
            <div>
              <p className="text-xs text-gold font-medium mb-2 uppercase tracking-wide">Insights</p>
              <ul className="space-y-1.5">
                {data.insights.map((item, i) => (
                  <li key={i} className="text-sm text-white flex gap-2">
                    <span className="text-gold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.suggestions?.length > 0 && (
            <div>
              <p className="text-xs text-green-400 font-medium mb-2 uppercase tracking-wide">Suggestions</p>
              <ul className="space-y-1.5">
                {data.suggestions.map((item, i) => (
                  <li key={i} className="text-sm text-white flex gap-2">
                    <span className="text-green-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.riskFlags?.length > 0 && (
            <div>
              <p className="text-xs text-red-400 font-medium mb-2 uppercase tracking-wide">Watch out</p>
              <ul className="space-y-1.5">
                {data.riskFlags.map((item, i) => (
                  <li key={i} className="text-sm text-white flex gap-2">
                    <span className="text-red-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
