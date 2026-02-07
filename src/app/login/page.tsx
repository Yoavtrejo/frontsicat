'use client';

import Image from 'next/image';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { InputField } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export default function LoginPage() {
    const { credentials, error, loading, handleChange, handleSubmit } = useAuth();

    return (
        <main className="relative min-h-screen w-full flex items-center justify-center p-4">
            <div className="absolute inset-0 -z-20">
                <Image src="/img/fondo.jpeg" alt="Fondo" fill className="object-cover" priority />
            </div>
            
            <GlassCard className="w-full max-w-md p-8 text-center">
                <header className="mb-8">
                    <h1 className="font-serif text-5xl text-white mb-2 tracking-wide">UrbanInsight</h1>
                    <p className="text-white/80 text-lg font-light">Gestión Territorial</p>
                </header>

                {error && <ErrorMessage message={error} />}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <InputField 
                        label="Usuario" 
                        name="username" 
                        value={credentials.username} 
                        onChange={handleChange} 
                    />
                    <InputField 
                        label="Contraseña" 
                        name="password" 
                        type="password" 
                        value={credentials.password} 
                        onChange={handleChange} 
                    />

                    <Button type="submit" isLoading={loading}>
                        Entrar al Sistema
                    </Button>
                </form>
            </GlassCard>
        </main>
    );
}