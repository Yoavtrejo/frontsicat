export const ErrorMessage = ({ message }: { message: string }) => (
  <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-2 rounded-xl mb-6 text-sm animate-shake">
    {message}
  </div>
);