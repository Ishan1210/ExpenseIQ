import { useState } from 'react';
import { createExpense } from '../api/expenses';

const CATEGORIES = ['Food', 'Transport', 'Rent', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Other'];

export default function AddExpenseForm({ onAdded, onClose }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const expense = await createExpense({ amount: Number(amount), category, description });
      onAdded(expense);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-surface border border-white/10 rounded-xl p-6 w-full max-w-sm">
        <h3 className="font-display text-lg font-semibold text-white mb-4">Add expense</h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs text-mist mb-1.5">Amount</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-xs text-mist mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-mist mb-1.5">Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
              placeholder="Lunch with team"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-white/10 text-mist rounded-lg py-2.5 text-sm hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gold text-ink font-semibold rounded-lg py-2.5 text-sm hover:brightness-110 transition disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
