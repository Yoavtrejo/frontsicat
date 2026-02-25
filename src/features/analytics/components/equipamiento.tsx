"use client"; 

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const EquipamientoChart = ({ data }: { data: any }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = [
    { name: 'Escuelas', value: data?.globalEscuelas || 0, color: '#3b82f6' },
    { name: 'Parques', value: data?.globalParques || 0, color: '#10b981' },
    { name: 'Gasolineras', value: data?.globalGasolinerias || 0, color: '#ef4444' },
    { name: 'Templos', value: data?.globalTemplos || 0, color: '#a855f7' },
    { name: 'Mercados', value: data?.globalMercados || 0, color: '#f59e0b' },
  ].filter(item => item.value > 0);

  if (!mounted) {
    return <div className="h-[300px] w-full" />;
  }

  if (chartData.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center border border-dashed border-slate-800 rounded-3xl">
        <p className="text-slate-500 text-xs italic">Sin equipamiento registrado</p>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={chartData} 
          layout="vertical" 
          margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
        >
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            tick={{ fill: '#94a3b8', fontSize: 10 }} 
            width={80}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            cursor={{ fill: '#1e293b', opacity: 0.4 }}
            contentStyle={{ 
              backgroundColor: '#0f172a', 
              border: '1px solid #334155', 
              borderRadius: '12px',
              fontSize: '12px'
            }}
            itemStyle={{ color: '#fff' }}
          />
          <Bar 
            dataKey="value" 
            radius={[0, 4, 4, 0]} 
            barSize={18}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};