'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    username: string;
    email: string;
    rol: string;
  } | null>(null);

  useEffect(() => {
    const name = localStorage.getItem('user_name');
    const email = localStorage.getItem('user_email');
    const rol = localStorage.getItem('user_role');

    if (!name || !email) {
      router.push('/login');
      return;
    }

    setUser({ username: name, email, rol: rol || 'Sin rol' });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    document.cookie = 'access_token=; path=/; max-age=0';
    router.push('/login');
  };

  if (!user) return null;

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <GlassCard className="w-full max-w-md p-8 text-center">
        <h1 className="font-serif text-3xl text-gray-900 dark:text-white mb-6">Mi Perfil</h1>
        
        <div className="space-y-4 mb-8 text-left">
          <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Usuario</p>
            <p className="font-medium text-gray-900 dark:text-white">{user.username}</p>
          </div>
          <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
            <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
          </div>
          <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Rol</p>
            <p className="font-medium text-gray-900 dark:text-white">{user.rol}</p>
          </div>
        </div>

        <Button onClick={handleLogout} variant="white" className="w-full">
          Cerrar Sesión
        </Button>
      </GlassCard>
    </main>
  );
}