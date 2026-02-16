interface MaterialListProps {
  stats: any[];
  selected: string | null;
  onSelect: (name: string | null) => void;
  total: number;
  customColors: Record<string, string>; 
  onColorChange: (name: string, color: string) => void; 
}

export const MaterialList = ({ stats, selected, onSelect, total, customColors, onColorChange }: MaterialListProps) => {
  return (
    <div className="bg-slate-900 p-6 rounded-[2.5rem] border border-slate-800 flex flex-col max-h-[500px]">
      <div className="flex justify-between items-center mb-6">
        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Materiales de Construcción</p>
        {selected && (
          <button 
            onClick={() => onSelect(null)} 
            className="text-pink-500 text-[10px] uppercase font-bold hover:underline"
          >
            Ver Todos
          </button>
        )}
      </div>

      {/* Añadimos scroll automático si hay muchos materiales */}
      <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        {stats.map((m, i) => {
          const percentage = total > 0 ? (m.value / total) * 100 : 0;
          const currentColor = customColors[m.name] || "#64748b";

          return (
            <div key={i} className="group">
              <div className="flex justify-between text-xs mb-2 items-center">
                <button 
                  onClick={() => onSelect(m.name)} 
                  className={`transition-all ${
                    selected === m.name 
                    ? 'text-blue-400 font-bold scale-105' 
                    : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {m.name}
                </button>
                <input 
                  type="color" 
                  value={currentColor} 
                  onChange={(e) => onColorChange(m.name, e.target.value)}
                  className="w-4 h-4 rounded-full cursor-pointer bg-transparent border-none" 
                />
              </div>
              <div 
                onClick={() => onSelect(m.name)} 
                className="w-full bg-slate-800 h-1.5 rounded-full cursor-pointer overflow-hidden"
              >
                <div 
                  className="h-full transition-all duration-700 ease-out" 
                  style={{ 
                    width: `${percentage}%`, 
                    backgroundColor: currentColor,
                    opacity: selected && selected !== m.name ? 0.3 : 1 
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};