export const PisosChart = ({ stats, total, onHover, hoveredKey }: any) => {
  // Handle empty/undefined data
  const safeStats = Array.isArray(stats) ? stats : [];
  const safeTotal = typeof total === 'number' ? total : 0;
  
  if (safeStats.length === 0 || safeTotal === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-6 text-center">Distribución por Pisos</p>
        <div className="flex justify-center mb-8">
          <div className="relative w-40 h-40 rounded-full flex items-center justify-center shadow-2xl bg-slate-800 border border-slate-700">
            <div className="absolute w-[75%] h-[75%] bg-slate-900 rounded-full flex flex-col items-center justify-center border border-slate-800 shadow-inner">
              <span className="text-2xl font-black text-white">{safeTotal.toLocaleString()}</span>
              <span className="text-[8px] text-slate-500 uppercase tracking-tighter">Edificios</span>
            </div>
          </div>
        </div>
        <p className="text-slate-500 text-sm">No hay datos de pisos disponibles</p>
      </div>
    );
  }

  // Generamos el string del gradiente dinámicamente
  let cumulativePercentage = 0;
  const gradientStops = safeStats.map((p: any) => {
    const start = cumulativePercentage;
    cumulativePercentage += p.percentage;
    return `${p.color} ${start}% ${cumulativePercentage}%`;
  }).join(', ');

  return (
    <div className="p-4">
      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-6 text-center">Distribución por Pisos</p>
      
      <div className="flex justify-center mb-8">
        <div 
          className="relative w-40 h-40 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-500"
          style={{ background: `conic-gradient(${gradientStops})` }}
        >
          {/* El centro de la dona */}
          <div className="absolute w-[75%] h-[75%] bg-slate-900 rounded-full flex flex-col items-center justify-center border border-slate-800 shadow-inner">
            <span className="text-2xl font-black text-white">{safeTotal.toLocaleString()}</span>
            <span className="text-[8px] text-slate-500 uppercase tracking-tighter">Edificios</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {safeStats.map((p: any, i: number) => (
          <div 
            key={i} 
            className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-default ${
              hoveredKey === p.key ? 'bg-slate-800 ring-1 ring-slate-700 scale-105' : 'opacity-70'
            }`}
            onMouseEnter={() => onHover(p.key)}
            onMouseLeave={() => onHover(null)}
          >
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }}></div>
              <span className="text-xs font-medium text-slate-200">{p.label}</span>
            </div>
            <span className="text-xs font-bold text-blue-400">{p.percentage.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};