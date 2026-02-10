interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color?: string;
}

export const StatCard = ({ label, value, icon, trend, color = "blue" }: StatCardProps) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] hover:border-slate-700 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl bg-slate-800 text-${color}-400 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        {trend && (
          <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">{label}</p>
        <h3 className="text-2xl font-serif text-white">{value}</h3>
      </div>
    </div>
  );
};