import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getExpenses } from '../api/expenses';
import { getBudgets } from '../api/budgets';
import { getGoals } from '../api/goals';
import { getIncomes } from '../api/income';
import CategoryPieChart from '../components/CategoryPieChart';
import TrendLineChart from '../components/TrendLineChart';
import ProgressBar from '../components/ProgressBar';
import AddExpenseForm from '../components/AddExpenseForm';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [exp, bud, gl, inc] = await Promise.all([
        getExpenses(),
        getBudgets(),
        getGoals(),
        getIncomes(),
      ]);
      setExpenses(exp);
      setBudgets(bud);
      setGoals(gl);
      setIncomes(inc);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleExpenseAdded(expense) {
    setExpenses((prev) => [expense, ...prev]);
  }

  // Spend-per-category, used to line budgets up against actual spending
  const spendByCategory = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
    return acc;
  }, {});

  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount), 0);
  const netBalance = totalIncome - totalSpent;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink text-mist">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink">
      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-white">ExpenseIQ</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-mist">{user?.name}</span>
          <button onClick={logout} className="text-sm text-mist hover:text-white transition">
            Log out
          </button>
        </div>
      </nav>

      <main className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-white">
            Welcome back, {user?.name?.split(' ')[0]}
          </h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gold text-ink font-semibold rounded-lg px-4 py-2 text-sm hover:brightness-110 transition"
          >
            + Add expense
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface border border-white/5 rounded-xl p-5">
            <p className="text-xs text-mist mb-1">Total income</p>
            <p className="font-display text-2xl font-bold text-white">₹{totalIncome.toLocaleString()}</p>
          </div>
          <div className="bg-surface border border-white/5 rounded-xl p-5">
            <p className="text-xs text-mist mb-1">Total spent</p>
            <p className="font-display text-2xl font-bold text-white">₹{totalSpent.toLocaleString()}</p>
          </div>
          <div className="bg-surface border border-white/5 rounded-xl p-5">
            <p className="text-xs text-mist mb-1">Net balance</p>
            <p className={`font-display text-2xl font-bold ${netBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ₹{netBalance.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-surface border border-white/5 rounded-xl p-5">
            <h3 className="font-display text-sm font-semibold text-white mb-3">Spend by category</h3>
            <CategoryPieChart expenses={expenses} />
          </div>
          <div className="bg-surface border border-white/5 rounded-xl p-5">
            <h3 className="font-display text-sm font-semibold text-white mb-3">Spending trend</h3>
            <TrendLineChart expenses={expenses} />
          </div>
        </div>

        {/* Budgets and goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-surface border border-white/5 rounded-xl p-5">
            <h3 className="font-display text-sm font-semibold text-white mb-4">Budgets</h3>
            {budgets.length === 0 ? (
              <p className="text-sm text-mist">No budgets set yet.</p>
            ) : (
              budgets.map((b) => (
                <ProgressBar
                  key={b.id}
                  label={b.category}
                  current={spendByCategory[b.category] || 0}
                  target={Number(b.limit)}
                  reverse
                />
              ))
            )}
          </div>
          <div className="bg-surface border border-white/5 rounded-xl p-5">
            <h3 className="font-display text-sm font-semibold text-white mb-4">Goals</h3>
            {goals.length === 0 ? (
              <p className="text-sm text-mist">No goals set yet.</p>
            ) : (
              goals.map((g) => (
                <ProgressBar
                  key={g.id}
                  label={g.title}
                  current={Number(g.savedAmount)}
                  target={Number(g.targetAmount)}
                />
              ))
            )}
          </div>
        </div>

        {/* Recent expenses list */}
        <div className="bg-surface border border-white/5 rounded-xl p-5">
          <h3 className="font-display text-sm font-semibold text-white mb-4">Recent expenses</h3>
          {expenses.length === 0 ? (
            <p className="text-sm text-mist">No expenses yet — add your first one above.</p>
          ) : (
            <div className="space-y-2">
              {expenses.slice(0, 8).map((exp) => (
                <div key={exp.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-sm text-white">{exp.category}</p>
                    {exp.description && <p className="text-xs text-mist">{exp.description}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white font-medium">₹{Number(exp.amount).toLocaleString()}</p>
                    <p className="text-xs text-mist">{new Date(exp.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {showAddForm && (
        <AddExpenseForm onAdded={handleExpenseAdded} onClose={() => setShowAddForm(false)} />
      )}
    </div>
  );
}
