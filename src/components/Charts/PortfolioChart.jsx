import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = [
  'hsl(221, 83%, 53%)', // Royal Blue
  'hsl(221, 83%, 63%)', // Lighter Blue
  'hsl(221, 83%, 43%)', // Darker Blue
  'hsl(142, 52%, 45%)', // Muted Emerald
  'hsl(38, 92%, 50%)',  // Warm Amber
  'hsl(0, 65%, 55%)',   // Desaturated Red
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: '#ffffff',
          border: '1px solid hsl(214, 32%, 91%)',
          borderRadius: 6,
          padding: '8px 12px',
          color: 'hsl(222, 47%, 11%)',
          fontSize: '0.875rem',
        }}
      >
        <p style={{ margin: 0, fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif' }}>
          {payload[0].name}
        </p>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'hsl(222, 20%, 40%)', fontFamily: '"Space Grotesk", sans-serif' }}>
          Value: NGN {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function PortfolioChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ color: 'hsl(222, 20%, 40%)', textAlign: 'center', padding: '40px', fontSize: '0.875rem' }}>
        No portfolio data available
      </div>
    );
  }

  const chartData = data.map((holding, index) => ({
    name: holding.isin || `Holding ${index + 1}`,
    value: holding.value || holding.quantity || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={2}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ color: 'hsl(222, 47%, 11%)', fontSize: '0.75rem' }}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

