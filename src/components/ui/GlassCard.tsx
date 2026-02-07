export const GlassCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-emerald-900/40 backdrop-blur-md rounded-[2.5rem] border border-white/10 shadow-2xl ${className}`}>
    {children}
  </div>
);