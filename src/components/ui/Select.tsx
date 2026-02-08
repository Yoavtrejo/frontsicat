interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
}

export const SelectField = ({ label, options, ...props }: SelectProps) => (
  <div>
    <label className="text-xs mb-1 block text-slate-400">{label}</label>
    <select 
      {...props}
      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
    >
      <option value="">Seleccionar...</option>
      {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);