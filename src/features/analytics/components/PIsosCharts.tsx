'use client';

import React from 'react';

interface PisoStats {
    key: string | number;
    label: string;
    count: number;
    percentage: number;
    color: string;
}

interface PisosChartProps {
    stats: PisoStats[];
    total: number;
    onHover: (key: string | number | null) => void;
    hoveredKey: string | number | null;
}

export const PisosChart = ({ stats, total, onHover, hoveredKey }: PisosChartProps) => {
    // Calculamos el gradiente dinámico sumando los porcentajes acumulados
    let cumulativePercentage = 0;
    
    const gradient = stats.map((stat) => {
        const start = cumulativePercentage;
        cumulativePercentage += stat.percentage;
        const end = cumulativePercentage;
        return `${stat.color} ${start}% ${end}%`;
    }).join(', ');

    return (
        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-6">
                Distribución por Pisos
            </p>

            {/* Gráfica Circular (Conic Gradient) */}
            <div className="flex justify-center mb-8">
                <div 
                    className="relative w-48 h-48 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-105 group"
                    style={{ background: `conic-gradient(${gradient || '#334155 0% 100%'})` }}
                >
                    {/* Agujero central para efecto "Donut" (Opcional) */}
                    <div className="absolute inset-4 bg-slate-900 rounded-full flex flex-col items-center justify-center border border-slate-800">
                        <span className="text-3xl font-serif text-white">{total}</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Predios</span>
                    </div>
                </div>
            </div>

            {/* Leyenda Interactiva */}
            <div className="space-y-3">
                {stats.map((stat) => (
                    <div 
                        key={stat.key}
                        onMouseEnter={() => onHover(stat.key)}
                        onMouseLeave={() => onHover(null)}
                        className={`flex items-center justify-between p-2 rounded-xl transition-all duration-300 ${
                            hoveredKey === stat.key ? 'bg-slate-800 scale-[1.02]' : 'opacity-80'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div 
                                className="w-3 h-3 rounded-full shadow-sm" 
                                style={{ backgroundColor: stat.color }}
                            />
                            <span className="text-sm text-slate-300 font-medium">{stat.label}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-white font-bold block text-sm">{stat.count}</span>
                            <span className="text-[10px] text-slate-500">{stat.percentage.toFixed(1)}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};