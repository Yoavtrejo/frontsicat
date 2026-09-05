'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/Input';
import { GlassCard } from '@/components/ui/GlassCard';
import { Suspense } from 'react';

function GateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (username === 'Admin' && password === 'admin123') {
      document.cookie = 'portfolio_access=true; path=/; max-age=2592000; samesite=lax';
      router.push(callbackUrl);
    } else {
      setError('Credenciales incorrectas');
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4">
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#1a1a2e] to-[#16213e]" />
      </div>

      <GlassCard className="w-full max-w-md p-8 sm:p-10 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 002 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <h1 className="font-serif text-4xl text-white mb-2 tracking-wide">UrbanInsight</h1>
        <p className="text-white/70 text-lg mb-8">Acceso al Portfolio</p>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <InputField
            label="Usuario"
            type="text"
            placeholder="Admin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
          <InputField
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <Button type="submit" isLoading={loading} className="w-full">
            Entrar al Portfolio
          </Button>
        </form>

        <p className="mt-6 text-xs text-white/40">
          Solo para revisión de portfolio · Sin datos privados
        </p>
      </GlassCard>
    </main>
  );
}

export default function GatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <GateContent />
    </Suspense>
  );
}