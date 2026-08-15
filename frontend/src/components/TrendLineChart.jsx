import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TrendLineChart({ expenses }) {
  // Group expenses by day (YYYY-MM-DD) and sum, then sort chronologically
  const dataMap = expenses.reduce((acc, exp) => {
    const day = new Date(exp.date).toISOString().slice(0, 10);
    acc[day] = (acc[day] || 0) + Number(exp.amount);
    return acc;
  }, {});

  const data = Object.entries(dataMap)
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-mist text-sm">
        No spending trend yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: '#94A3B8', fontSize: 11 }}
          tickFormatter={(d) => d.slice(5)}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
        />
        <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
        <Tooltip
          contentStyle={{ background: '#1A2333', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
          labelStyle={{ color: '#E2E8F0' }}
          formatter={(value) => [`₹${value.toFixed(2)}`, 'Spent']}
        />
        <Line type="monotone" dataKey="total" stroke="#D4A24C" strokeWidth={2} dot={{ r: 3, fill: '#D4A24C' }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
