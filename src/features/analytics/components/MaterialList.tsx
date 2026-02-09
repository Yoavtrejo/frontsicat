export const MaterialList = ({stats, selected, onSelect, colors, total}: any) => {
    <div className="bg-slate-900 p-6 rounded-[2.5rem] border border-slate-800">
        <div className="flex justify-between items-center mb-6">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest"> Materiales</p>
        </div>
        <div className="space-y-4">
            {stats.map((m:any) => (
                <div key={m.name} onClick={() => onSelect(m.name)} className="cursor-pointer">
                    <div className="flex justify-between text-xs mb-2">
                        <span className={selected === m.name ? 'text-blue-400 font-bold' : 'text-slate-400'}>{m.name}</span>
                        <span className="text-slate-500">{m.value}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                        <div className="h-full transition-all duration-500" style ={{width: `${(m.value / total * 100)}%`, backgroundColor: colors[m.name]}}></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
}