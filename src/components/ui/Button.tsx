interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'white';
}

export const Button = ({ children, isLoading, variant = 'white', ...props }: ButtonProps) => {
  const baseStyles = "w-full rounded-full py-4 text-lg font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    white: "bg-white text-emerald-900 hover:bg-emerald-50",
    primary: "bg-emerald-600 text-white hover:bg-emerald-500"
  };

  return (
    <button {...props} className={`${baseStyles} ${variants[variant]} ${props.className}`}>
      {isLoading ? 'Cargando...' : children}
    </button>
  );
};