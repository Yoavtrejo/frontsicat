'use client';
import Image from 'next/image';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { InputField } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export default function LoginPage() {
    const { email, setEmail, password, setPassword, error, loading, handleSubmit } = useAuth();

    return (
        <main className="relative min-h-screen w-full flex items-center justify-center p-4">
            <div className="absolute inset-0 -z-20">
                <Image src="/img/fondo.jpeg" alt="Fondo" fill className="object-cover" priority />
            </div>
            <div className="absolute inset-0 bg-black/40 -z-10"></div>
            
            <GlassCard className="w-full max-w-md p-8 sm:p-10 text-center">
                <h1 className="font-serif text-5xl text-white mb-2 tracking-wide">UrbanInsight</h1>
                <p className="text-white/80 text-lg mb-8">Gestión Territorial</p>

                {error && <ErrorMessage message={error} />}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <InputField 
                        label="Usuario / Email" 
                        type="text"
                        placeholder="admin_merida"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                    />
                    <InputField 
                        label="Contraseña" 
                        type="password" 
                        placeholder="••••••••"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                    />

                    <Button type="submit" isLoading={loading}>
                        Entrar al Sistema
                    </Button>
                </form>
            </GlassCard>
        </main>
    );
}