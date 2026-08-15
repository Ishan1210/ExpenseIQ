export default function ProgressBar({ label, current, target, reverse = false }) {
  // reverse=true means "less is better" (budget spend vs limit) — bar turns red near/over 100%
  // reverse=false means "more is better" (goal saved vs target) — bar fills toward gold as it grows
  const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const isOver = current > target;

  let barColor = '#D4A24C';
  if (reverse) {
    if (pct >= 100) barColor = '#F87171';
    else if (pct >= 80) barColor = '#FB923C';
  } else {
    if (pct >= 100) barColor = '#4ADE80';
  }

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-sm text-white font-medium">{label}</span>
        <span className={`text-xs ${isOver && reverse ? 'text-red-400' : 'text-mist'}`}>
          ₹{Number(current).toLocaleString()} / ₹{Number(target).toLocaleString()}
        </span>
      </div>
      <div className="h-2 bg-ink rounded-full overflow-hidden border border-white/5">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}
