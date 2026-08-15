import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#D4A24C', '#5B8CFF', '#4ADE80', '#F472B6', '#FB923C', '#A78BFA', '#38BDF8'];

export default function CategoryPieChart({ expenses }) {
  // Aggregate raw expense list into { category, total } for the chart
  const dataMap = expenses.reduce((acc, exp) => {
    const cat = exp.category;
    acc[cat] = (acc[cat] || 0) + Number(exp.amount);
    return acc;
  }, {});

  const data = Object.entries(dataMap).map(([category, total]) => ({ category, total }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-mist text-sm">
        No expenses yet — add one to see the breakdown.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="total"
          nameKey="category"
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={2}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: '#1A2333', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
          labelStyle={{ color: '#E2E8F0' }}
          formatter={(value) => [`₹${value.toFixed(2)}`, 'Spent']}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: '#94A3B8' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
