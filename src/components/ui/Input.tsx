interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const InputField = ({ label, ...props }: InputProps) => {
  return (
    <div className="text-left w-full">
      <label className="text-white/70 text-xs ml-4 mb-1 block font-medium">
        {label}
      </label>
      <input
        {...props}
        className={`
          w-full rounded-full bg-white/95 py-3.5 px-6 
          text-gray-800 outline-none transition-all
          focus:ring-2 focus:ring-emerald-500 focus:bg-white
          placeholder:text-gray-400
          ${props.className} 
        `}
      />
    </div>
  );
};