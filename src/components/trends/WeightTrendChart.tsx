"use client";

import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface WeightData {
  date: string;
  weight_kg: number;
}

export function WeightTrendChart({ data }: { data: WeightData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[250px] flex items-center justify-center font-bold text-gray-400 bg-surface rounded-3xl border border-gray-100">
        No recent data available.
      </div>
    );
  }

  // Determine dynamic limits to keep chart aesthetic tight
  const minWeight = Math.min(...data.map(d => d.weight_kg));
  const maxWeight = Math.max(...data.map(d => d.weight_kg));

  return (
    <div className="w-full h-[250px] pt-4 -ml-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }}
            tickFormatter={(dateStr) => {
              const d = new Date(dateStr);
              return `${d.getMonth() + 1}/${d.getDate()}`;
            }}
            dy={10}
            minTickGap={20}
          />
          <Tooltip 
            cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4' }}
            contentStyle={{ 
              borderRadius: '16px', 
              border: 'none', 
              boxShadow: '0 4px 20px -5px rgba(0,0,0,0.1)',
              padding: '12px 16px',
              fontFamily: 'inherit'
            }}
            labelStyle={{ color: '#9ca3af', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}
            itemStyle={{ color: '#111827', fontSize: '16px', fontWeight: 800 }}
            formatter={(value: any) => [`${value} kg`, 'Weight']}
          />
          <Area 
            type="monotone" 
            dataKey="weight_kg" 
            stroke="#10b981" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#emeraldGradient)" 
            isAnimationActive={true}
            animationDuration={800}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
