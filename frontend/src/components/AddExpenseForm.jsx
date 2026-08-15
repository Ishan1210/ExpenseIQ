import { useState } from 'react';
import { createExpense } from '../api/expenses';
import { scanReceipt } from '../api/ocr';

const CATEGORIES = ['Food', 'Transport', 'Rent', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Other'];

export default function AddExpenseForm({ onAdded, onClose }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanNote, setScanNote] = useState('');

  async function handleReceiptUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setScanning(true);
    setScanNote('');
    setError('');

    try {
      const result = await scanReceipt(file);

      if (result.amount) setAmount(result.amount);
      if (result.merchant) setDescription(result.merchant);

      setScanNote(
        result.amount
          ? `Scanned — found amount ₹${result.amount}${result.merchant ? ` from "${result.merchant}"` : ''}. Review before saving.`
          : 'Scanned, but could not confidently detect an amount — please fill manually.'
      );
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to scan receipt');
    } finally {
      setScanning(false);
      e.target.value = ''; // allow re-selecting the same file
    }
  }

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

        {/* Receipt scan */}
        <label className="flex items-center justify-center gap-2 border border-dashed border-white/20 rounded-lg py-3 mb-4 text-sm text-mist hover:border-gold/50 hover:text-gold transition cursor-pointer">
          {scanning ? (
            <span>Scanning receipt...</span>
          ) : (
            <span>📷 Scan a receipt to auto-fill</span>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleReceiptUpload}
            disabled={scanning}
            className="hidden"
          />
        </label>

        {scanNote && (
          <div className="text-xs text-gold bg-gold/10 border border-gold/20 rounded-lg px-3 py-2 mb-4">
            {scanNote}
          </div>
        )}

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
