export const MaterialList = ({
  stats = [],      // Valor por defecto: array vacío
  selected, 
  onSelect, 
  colors = [],     // <--- ESTO evita el error de 'length'
  total = 1        // Evitamos división por cero abajo
}: any) => {
    return (
        <div className="bg-slate-900 p-6 rounded-[2.5rem] border border-slate-800">
            <div className="flex justify-between items-center mb-6">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Materiales</p>
            </div>
            <div className="space-y-4">
                {/* Agregamos el encadenamiento opcional stats?.map */}
                {stats?.map((m: any, index: number) => (
                    <div key={m.name} onClick={() => onSelect(m.name)} className="cursor-pointer">
                        <div className="flex justify-between text-xs mb-2">
                            <span className={selected === m.name ? 'text-blue-400 font-bold' : 'text-slate-400'}>
                                {m.name}
                            </span>
                            <span className="text-slate-500">{m.value}</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                            <div 
                                className="h-full transition-all duration-500" 
                                style={{
                                    // Usamos una protección extra para colors
                                    width: `${(m.value / (total || 1) * 100)}%`, 
                                    backgroundColor: colors && colors.length > 0 
                                        ? colors[index % colors.length] 
                                        : '#3b82f6' // Un azul por defecto si no hay colores
                                }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};