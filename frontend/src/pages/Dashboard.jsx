import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-ink">
      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-white">ExpenseIQ</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-mist">{user?.name}</span>
          <button
            onClick={logout}
            className="text-sm text-mist hover:text-white transition"
          >
            Log out
          </button>
        </div>
      </nav>

      <main className="p-6">
        <h2 className="font-display text-2xl font-semibold text-white mb-2">
          Welcome back, {user?.name?.split(' ')[0]}
        </h2>
        <p className="text-mist text-sm">
          Dashboard charts, budgets, and AI insights land in the next milestones.
        </p>
      </main>
    </div>
  );
}
