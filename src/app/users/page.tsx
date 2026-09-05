'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/Input';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';

interface User {
  id: number;
  username: string;
  email: string;
  rol: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', rol: 'viewer' });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const rol = localStorage.getItem('user_role');
    
    if (!token || rol !== 'admin') {
      router.push('/dashboard');
      return;
    }
    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const data = await fetchApi<User[]>('/usuarios/');
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/usuarios/', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setShowModal(false);
      setFormData({ username: '', email: '', password: '', rol: 'viewer' });
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este usuario?')) return;
    try {
      await fetchApi(`/usuarios/${id}/`, { method: 'DELETE' });
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;

  return (
    <main className="min-h-screen w-full p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-serif text-3xl text-gray-900 dark:text-white">Gestión de Usuarios</h1>
          <Button onClick={() => setShowModal(true)}>Nuevo Usuario</Button>
        </div>

        {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}

        <GlassCard className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-4 text-left">Usuario</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Rol</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/5">
                  <td className="p-4">{u.username}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">{u.rol}</td>
                  <td className="p-4 text-right">
                    <Button 
                      variant="white" 
                      onClick={() => handleDelete(u.id)}
                      className="text-red-600 hover:bg-red-50 px-4 py-2 text-sm"
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <GlassCard className="w-full max-w-md p-6">
              <h2 className="text-xl font-bold mb-4">Crear Usuario</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <InputField label="Usuario" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required />
                <InputField label="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                <InputField label="Contraseña" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                <select 
                  value={formData.rol} 
                  onChange={(e) => setFormData({...formData, rol: e.target.value})}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="white" onClick={() => setShowModal(false)}>Cancelar</Button>
                  <Button type="submit" variant="primary">Crear</Button>
                </div>
              </form>
            </GlassCard>
          </div>
        )}
      </div>
    </main>
  );
}